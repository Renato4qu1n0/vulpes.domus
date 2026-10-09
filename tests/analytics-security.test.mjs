import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import vm from "node:vm";
import ts from "typescript";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const configSource = fs.readFileSync(
  path.join(projectRoot, "app/lib/analytics/config.ts"),
  "utf8",
);
const eventsSource = fs.readFileSync(
  path.join(projectRoot, "app/lib/analytics/events.ts"),
  "utf8",
);
const measurementId = configSource.match(/GA_MEASUREMENT_ID\s*=\s*"([^"]+)"/)?.[1];
const storageKey = configSource.match(/ANALYTICS_CONSENT_STORAGE_KEY\s*=\s*"([^"]+)"/)?.[1];

function createAnalyticsHarness(
  storedConsent = null,
  referrer = "https://vulpesdomus.com.br/?email=visitante%40example.com#contato",
) {
  const cookieWrites = [];
  let cookieJar = "_ga=analytics-id; _ga_G0CN22SFDJL=analytics-session; session=keep";
  let storedValue = storedConsent;
  const window = {
    location: {
      origin: "https://vulpesdomus.com.br",
      pathname: "/privacidade/",
      search: "?email=visitante%40example.com",
      hash: "#dados-pessoais",
      hostname: "vulpesdomus.com.br",
    },
    localStorage: {
      getItem(key) {
        return key === storageKey ? storedValue : null;
      },
      setItem(key, value) {
        if (key === storageKey) storedValue = value;
      },
    },
  };
  const document = {
    title: "Privacidade | Vulpes Domus",
    referrer,
  };
  Object.defineProperty(document, "cookie", {
    get() {
      return cookieJar;
    },
    set(value) {
      cookieWrites.push(value);
      const [pair, ...attributes] = value.split(";");
      const name = pair.split("=", 1)[0];
      if (attributes.some((attribute) => attribute.includes("max-age=0"))) {
        cookieJar = cookieJar
          .split(";")
          .map((cookie) => cookie.trim())
          .filter((cookie) => !cookie.startsWith(`${name}=`))
          .join("; ");
      }
    },
  });

  const compiled = ts.transpileModule(eventsSource, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const compiledModule = { exports: {} };
  vm.runInNewContext(compiled, {
    exports: compiledModule.exports,
    module: compiledModule,
    require: () => ({
      ANALYTICS_CONSENT_STORAGE_KEY: storageKey,
      GA_MEASUREMENT_ID: measurementId,
    }),
    window,
    document,
    URL,
    Date,
  });

  return {
    analytics: compiledModule.exports,
    window,
    document,
    cookieWrites,
    getCookieJar: () => cookieJar,
  };
}

test("Measurement ID is a public GA4 ID, not a credential", () => {
  assert.match(measurementId ?? "", /^G-[A-Z0-9]{10}$/);
  assert.ok(storageKey);
});

test("no consent means the event layer does not initialize or queue analytics", () => {
  const { analytics, window } = createAnalyticsHarness();

  assert.equal(analytics.getStoredAnalyticsConsent(), "unknown");
  analytics.trackEvent("click_whatsapp", {
    contact_method: "whatsapp",
    button_location: "header",
  });

  assert.equal(window.gtag, undefined);
  assert.equal(window.dataLayer, undefined);
});

test("accepted events contain only the sanitized page path and referrer", () => {
  const { analytics, window } = createAnalyticsHarness("granted");
  window.__vulpesConsentStoragePersisted = true;
  analytics.prepareAnalyticsAfterConsent();
  analytics.initializeGoogleAnalytics();
  analytics.trackEvent("click_email", {
    contact_method: "email",
    button_location: "contact_section",
  });

  const event = window.dataLayer.find((args) => args[0] === "event");
  assert.ok(event);
  assert.equal(event[1], "click_email");
  assert.equal(event[2].page_location, "https://vulpesdomus.com.br/privacidade/");
  assert.equal(event[2].page_referrer, "https://vulpesdomus.com.br/");
  assert.equal(JSON.stringify(event).includes("visitante@example.com"), false);
});

test("invalid persisted consent fails closed even if runtime state was previously granted", () => {
  const { analytics, window } = createAnalyticsHarness("maybe");
  window.__vulpesConsentChoice = "granted";
  window.__vulpesConsentStoragePersisted = true;
  window.__vulpesAnalyticsReady = true;
  analytics.prepareAnalyticsAfterConsent();
  analytics.initializeGoogleAnalytics();
  const eventsBefore = window.dataLayer.filter((args) => args[0] === "event").length;
  window.localStorage.setItem(storageKey, "maybe");
  window.__vulpesConsentStoragePersisted = true;

  assert.equal(analytics.getStoredAnalyticsConsent(), "unknown");
  analytics.trackEvent("click_whatsapp", {
    contact_method: "whatsapp",
    button_location: "header",
  });
  assert.equal(window.dataLayer.filter((args) => args[0] === "event").length, eventsBefore);
});

test("untrusted referrer URL content is reduced to its origin", () => {
  const { analytics, window } = createAnalyticsHarness(
    "granted",
    "https://attacker.example/?q=%3C%2Fscript%3E%3Cscript%3Ealert(1)%3C%2Fscript%3E",
  );
  window.__vulpesConsentStoragePersisted = true;
  analytics.prepareAnalyticsAfterConsent();
  analytics.initializeGoogleAnalytics();
  analytics.trackEvent("click_whatsapp", {
    contact_method: "whatsapp",
    button_location: "header",
  });

  const event = window.dataLayer.find((args) => args[0] === "event");
  assert.equal(event[2].page_referrer, "https://attacker.example");
  assert.equal(JSON.stringify(event).includes("alert(1)"), false);
});

test("Analytics failures do not throw into site interactions", () => {
  const { analytics, window } = createAnalyticsHarness("granted");
  window.__vulpesConsentStoragePersisted = true;
  window.__vulpesConsentChoice = "granted";
  window.__vulpesAnalyticsReady = true;
  window.gtag = () => {
    throw new Error("blocked by browser");
  };

  assert.doesNotThrow(() =>
    analytics.trackEvent("click_email", {
      contact_method: "email",
      button_location: "footer",
    }),
  );
});

test("revocation disables later events and expires only GA cookies", () => {
  const { analytics, window, cookieWrites, getCookieJar } =
    createAnalyticsHarness("granted");
  window.__vulpesConsentStoragePersisted = true;
  analytics.prepareAnalyticsAfterConsent();
  analytics.initializeGoogleAnalytics();
  const eventsBeforeRevocation = window.dataLayer.filter((args) => args[0] === "event").length;

  analytics.revokeGoogleAnalyticsConsent();
  analytics.trackEvent("click_whatsapp", {
    contact_method: "whatsapp",
    button_location: "footer",
  });

  assert.equal(window.__vulpesAnalyticsReady, false);
  assert.equal(
    window.dataLayer.filter((args) => args[0] === "event").length,
    eventsBeforeRevocation,
  );
  const latestConsentCommand = window.dataLayer.findLast((args) => args[0] === "consent");
  assert.equal(latestConsentCommand[1], "update");
  assert.equal(latestConsentCommand[2].analytics_storage, "denied");
  assert.ok(cookieWrites.length > 0);
  assert.ok(cookieWrites.every((value) => value.startsWith("_ga")));
  assert.match(getCookieJar(), /session=keep/);
});
