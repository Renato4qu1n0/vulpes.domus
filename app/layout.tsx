import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://renato4qu1n0.github.io/vulpes.domus/"),
  title: "Vulpes Domus | Arquitetura & Interiores",
  description:
    "Projetos de arquitetura e interiores sofisticados em São Paulo e região, com soluções funcionais e alinhadas à identidade de cada cliente.",
  openGraph: {
    title: "Vulpes Domus | Arquitetura & Interiores",
    description:
      "Projetos de arquitetura e interiores sofisticados em São Paulo e região, com soluções funcionais e alinhadas à identidade de cada cliente.",
    url: "https://renato4qu1n0.github.io/vulpes.domus/",
    siteName: "Vulpes Domus",
    locale: "pt_BR",
    type: "website",
    images: [
      {
        url: "logo.webp",
        width: 840,
        height: 560,
        alt: "Vulpes Domus — Arquitetura & Interiores",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vulpes Domus | Arquitetura & Interiores",
    description:
      "Projetos de arquitetura e interiores sofisticados em São Paulo e região.",
    images: ["logo.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
