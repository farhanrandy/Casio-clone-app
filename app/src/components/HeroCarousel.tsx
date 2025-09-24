// app/components/HeroCarousel.tsx (Next.js App Router) atau components/HeroCarousel.tsx
"use client";
import { useEffect, useRef, useState } from "react";

type Slide = {
  id: number;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
  image: string; // pakai URL public (unsplash/dll) atau /public/xxx.jpg
  align?: "left";
};

const slides: Slide[] = [
  {
    id: 1,
    title: "G-Shock Neo Series",
    subtitle: "Tough, minimal, ready for anything.",
    ctaText: "Shop Now",
    ctaHref: "#",
    image: "/future-classic2-1920x612.avif", // from /public
    align: "left",
  },
  {
    id: 2,
    title: "Urban Classic",
    subtitle: "Bold looks. Everyday comfort.",
    ctaText: "Explore",
    ctaHref: "#",
    image: "/homepage-iconic-styles-pc.avif", // from /public
    align: "left",
  },
  {
    id: 3,
    title: "Limited Drop",
    subtitle: "Get it before it’s gone.",
    ctaText: "Preorder",
    ctaHref: "#",
    image: "/cal-site-banner-60th.webp", // from /public
    align: "left",
  },
];

export default function HeroCarousel() {
  const [index, setIndex] = useState(0);
  const intervalRef = useRef<number | null>(null);
  const touchStartX = useRef<number | null>(null);

  const goTo = (i: number) => {
    const next = (i + slides.length) % slides.length;
    setIndex(next);
  };

  const next = () => goTo(index + 1);
  const prev = () => goTo(index - 1);

  // Auto-rotate
  useEffect(() => {
    clearTimer();
    intervalRef.current = window.setInterval(next, 5000);
    return clearTimer;
  }, [index]);

  const clearTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Keyboard nav
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index]);

  // Swipe (mobile)
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 40) prev();
    if (dx < -40) next();
    touchStartX.current = null;
  };

  return (
    <section
      className="relative w-full overflow-hidden"
      aria-roledescription="carousel"
      onMouseEnter={clearTimer}
      onMouseLeave={() => {
        if (!intervalRef.current)
          intervalRef.current = window.setInterval(next, 5000);
      }}
    >
      {/* Slides */}
      <div
        className="relative flex transition-transform duration-500 ease-out"
        style={{
          transform: `translateX(-${index * 100}%)`,
          width: `100%`,
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {slides.map((s, i) => (
          <div
            key={s.id}
            className="relative h-[60vh] md:h-[80vh] w-full shrink-0"
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} dari ${slides.length}`}
          >
            {/* Background image */}
            <div
              className="absolute inset-0 bg-center bg-cover"
              style={{ backgroundImage: `url(${s.image})` }}
            />
            {/* Dark gradient overlay */}

            {/* Content */}
            <div
              className={[
                "relative z-10 h-full w-full max-w-7xl mx-auto px-6",
                s.align === "left" && "flex items-center",
              ]
                .filter(Boolean)
                .join(" ")}
            ></div>
          </div>
        ))}
      </div>

      {/* Arrows */}
      <button
        aria-label="Sebelumnya"
        onClick={prev}
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/40 hover:bg-black/60 text-white grid place-items-center backdrop-blur-sm"
      >
        ‹
      </button>
      <button
        aria-label="Berikutnya"
        onClick={next}
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-black/40 hover:bg-black/60 text-white grid place-items-center backdrop-blur-sm"
      >
        ›
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={[
              "h-2.5 w-2.5 rounded-full transition",
              i === index
                ? "bg-white scale-110"
                : "bg-white/50 hover:bg-white/80",
            ].join(" ")}
          />
        ))}
      </div>
    </section>
  );
}
