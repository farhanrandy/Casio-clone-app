// components/ProductCarousel.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import ProductCard from "@/components/ProductCard";
import type { Product } from "@/types";

type Props = {
  products: Product[];
  title?: string;
  hrefAll?: string;
  className?: string;
};

export default function ProductCarousel({
  products,
  title,
  hrefAll,
  className,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      setAtStart(el.scrollLeft <= 0);
      setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 1);
    };
    onScroll();
    el.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      el.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const amt = () =>
    ref.current ? Math.max(320, ref.current.clientWidth * 0.9) : 320;

  return (
    <section className={className}>
      {title && (
        <header className="mb-4 flex items-end justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">{title}</h2>
          {hrefAll && (
            <a
              href={hrefAll}
              className="text-sm font-semibold text-neutral-600 hover:text-neutral-900"
            >
              Lihat semua →
            </a>
          )}
        </header>
      )}

      <div className="relative">
        {/* track */}
        <div
          ref={ref}
          className="flex gap-4 overflow-x-auto scroll-smooth no-scrollbar snap-x snap-mandatory"
        >
          {products.map((p) => (
            <div
              key={p.slug}
              className="snap-start flex-shrink-0 min-w-[80%] sm:min-w-[55%] md:min-w-[40%] lg:min-w-[25%]"
            >
              {/* Override width grid milik card agar full isi slide */}
              <ProductCard product={p} className="!w-full" />
            </div>
          ))}
        </div>

        {/* gradient edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white to-transparent" />

        {/* nav buttons */}
        <button
          onClick={() =>
            ref.current?.scrollBy({ left: -amt(), behavior: "smooth" })
          }
          aria-label="Sebelumnya"
          disabled={atStart}
          className="absolute left-1 top-1/2 -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 shadow disabled:opacity-40"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 18l-6-6 6-6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          onClick={() =>
            ref.current?.scrollBy({ left: amt(), behavior: "smooth" })
          }
          aria-label="Berikutnya"
          disabled={atEnd}
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full border border-neutral-200 bg-white p-2 shadow disabled:opacity-40"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 6l6 6-6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </section>
  );
}
