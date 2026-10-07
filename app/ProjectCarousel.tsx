"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { publicAssetPath } from "./publicAssetPath";

const projectImages = [
  {
    src: publicAssetPath("/images/banheiro-bancada.webp"),
    alt: "Bancada de banheiro em madeira com cuba e metais dourados",
  },
  {
    src: publicAssetPath("/images/banheiro-lavabo.webp"),
    alt: "Lavabo com parede ilustrada, bancada de madeira e detalhes verdes",
  },
  {
    src: publicAssetPath("/images/sala-estar-integrada.webp"),
    alt: "Sala de estar integrada à sala de jantar em tons neutros",
  },
  {
    src: publicAssetPath("/images/sala-de-jantar.webp"),
    alt: "Sala de jantar com mesa de madeira, cadeiras claras e painel ripado",
  },
  {
    src: publicAssetPath("/images/cozinha.webp"),
    alt: "Cozinha compacta com bancada de pedra e janela ampla",
  },
  {
    src: publicAssetPath("/images/cena-11.webp"),
    alt: "Vista externa principal do Complexo Educacional",
  },
  {
    src: publicAssetPath("/images/cena-12.webp"),
    alt: "Área externa de convivência do Complexo Educacional",
  },
  {
    src: publicAssetPath("/images/biblioteca.webp"),
    alt: "Biblioteca com estantes e espaços de leitura",
  },
  {
    src: publicAssetPath("/images/espaco-colaborativo.webp"),
    alt: "Espaço colaborativo com mesa orgânica e jardim vertical",
  },
  {
    src: publicAssetPath("/images/brinquedoteca.webp"),
    alt: "Brinquedoteca com tenda e área de brincadeiras",
  },
  {
    src: publicAssetPath("/images/sala-de-aula.webp"),
    alt: "Sala de aula com mesas de madeira",
  },
];

export default function ProjectCarousel() {
  const [firstImage, setFirstImage] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const visibleImages = [0, 1, 2].map(
    (offset) => (firstImage + offset) % projectImages.length,
  );
  const isPaused = isHovered || hasFocus;

  useEffect(() => {
    if (
      isPaused ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setFirstImage((current) => (current + 1) % projectImages.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isPaused]);

  function move(direction: number) {
    setFirstImage((current) =>
      (current + direction + projectImages.length) % projectImages.length,
    );
  }

  return (
    <div
      aria-label="Carrossel de imagens dos projetos"
      aria-roledescription="carrossel"
      className="w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6f552d]"
      role="region"
      tabIndex={0}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setHasFocus(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setHasFocus(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          move(-1);
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          move(1);
        }
      }}
      onTouchStart={(event) => setTouchStart(event.touches[0]?.clientX ?? null)}
      onTouchEnd={(event) => {
        if (touchStart === null) return;
        const end = event.changedTouches[0]?.clientX ?? touchStart;
        if (Math.abs(end - touchStart) > 45) move(end < touchStart ? 1 : -1);
        setTouchStart(null);
      }}
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visibleImages.map((imageIndex, slotIndex) => {
          const image = projectImages[imageIndex];
          return (
            <div
              className="relative h-[min(112vw,420px)] min-h-[280px] overflow-hidden rounded-2xl bg-[#ddd6cf] sm:h-[360px] lg:h-[420px] lg:rounded-[18px]"
              key={`${image.src}-${slotIndex}`}
            >
              <Image
                alt={image.alt}
                className="object-cover transition-opacity duration-500"
                fill
                sizes="(max-width: 767px) calc(100vw - 48px), (max-width: 1279px) 30vw, 400px"
                src={image.src}
              />
            </div>
          );
        })}
      </div>

      <div className="mt-5 flex items-center justify-center gap-5">
        <button
          aria-label="Imagens anteriores"
          className="grid h-11 w-11 place-items-center rounded-full border border-[#8a7a61] text-xl text-[#6f552d] transition hover:bg-[#6f552d] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6f552d]"
          onClick={() => move(-1)}
          type="button"
        >
          ←
        </button>
        <button
          aria-label="Próximas imagens"
          className="grid h-11 w-11 place-items-center rounded-full border border-[#8a7a61] text-xl text-[#6f552d] transition hover:bg-[#6f552d] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#6f552d]"
          onClick={() => move(1)}
          type="button"
        >
          →
        </button>
      </div>
    </div>
  );
}
