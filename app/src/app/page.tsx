import HeroCarousel from "@/components/HeroCarousel";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import ProductCarousel from "@/components/ProductCarousel";
import { Product } from "@/types";
import Image from "next/image";

const categories = [
  {
    title: "Watches",
    img: "/panel_wat (1).avif",
    href: "/products",
  },
  {
    title: "Calculators",
    img: "/image.png",
    href: "#calculators",
  },
  {
    title: "Musical Instruments",
    img: "/panel_emi.avif",
    href: "#music",
  },
];

const highlights = [
  {
    tag: "NEW",
    title: "G-SHOCK | NIGO",
    desc: "Kolaborasi G-Shock dengan NIGO.",
    img: "/kv-main-nigo-1080x1080.avif",
  },
  {
    tag: "TRENDING",
    title: "G-SHOCK | XG",
    desc: "Kolaborasi G-Shock dengan Xtraordinary Girls.",
    img: "/lp-look1-sp-1200x1200-nologo.avif",
  },
  {
    tag: "EDITOR'S PICK",
    title: "Full Metal Origin",
    desc: "Desain full-metal dengan warna yang orisinal.",
    img: "/01-gmw-b5000d-gm-b2100sd-kv.avif",
  },
];

const news = [
  {
    date: "10 Sep 2025",
    title: "Peluncuran Seri G-SHOCK Terbaru",
    href: "#news-1",
  },
  {
    date: "02 Sep 2025",
    title: "Kolaborasi Edisi Terbatas X Artist",
    href: "#news-2",
  },
  {
    date: "25 Agu 2025",
    title: "Pembaruan Aplikasi Casio Connect",
    href: "#news-3",
  },
];

export default async function Home() {
  // BASE_URL harus tanpa /api dan tanpa trailing slash
  const raw = process.env.NEXT_PUBLIC_BASE_URL?.trim() || "";
  const base = raw.replace(/\/+$/g, ""); // hapus trailing slash
  const apiUrl = base ? `${base}/api/products` : "/api/products";

  const res = await fetch(apiUrl, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);

  const { items: products }: { items: Product[]; nextCursor?: string | null } =
    await res.json();

  return (
    <main className="min-h-dvh bg-white text-neutral-900">
      {/* HERO */}
      <HeroCarousel />

      <section className="mx-auto w-full max-w-7xl px-4 py-10 md:py-14">
        <ProductCarousel
          products={products}
          title="Rekomendasi"
          hrefAll="products"
        />
      </section>
      {/* KATEGORI GRID */}
      <section
        id="categories"
        className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14"
      >
        <header className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold md:text-3xl">Kategori Populer</h2>
          <a
            href="#all-categories"
            className="text-sm font-semibold text-neutral-600 hover:text-neutral-900"
          >
            Lihat semua →
          </a>
        </header>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {categories.map((c) => (
            <a
              key={c.title}
              href={c.href}
              className="group relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-neutral-200"
            >
              <img
                src={c.img}
                alt={c.title}
                className="h-56 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-3 left-3">
                <span className="rounded-md bg-white/90 px-3 py-1 text-sm font-semibold text-neutral-900">
                  {c.title}
                </span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* HIGHLIGHTS / KOLEKSI */}
      <section id="highlights" className="bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
          <header className="mb-6">
            <h2 className="text-2xl font-bold md:text-3xl">Produk Highlight</h2>
            <p className="mt-1 text-neutral-600">Yang lagi hot minggu ini.</p>
          </header>

          <div className="grid gap-5 md:grid-cols-3">
            {highlights.map((h) => (
              <article
                key={h.title}
                className="overflow-hidden rounded-2xl border border-neutral-200 bg-white"
              >
                <div className="relative">
                  <img
                    src={h.img}
                    alt={h.title}
                    className="h-56 w-full object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-md bg-black/80 px-2 py-1 text-xs font-semibold text-white">
                    {h.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{h.title}</h3>
                  <p className="mt-1 text-sm text-neutral-600">{h.desc}</p>
                  <div className="mt-4">
                    <button className="w-full rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800">
                      Detail Produk
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <section className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900">
          <div className="absolute right-0 top-0 hidden h-full w-1/2 md:block">
            <img
              src="https://images.unsplash.com/photo-1516570161787-2fd917215a3d?q=80&w=1600"
              alt="Promo"
              className="h-full w-full object-cover opacity-70"
            />
          </div>
          <div className="relative z-10 grid gap-4 p-6 text-white md:grid-cols-2 md:p-10">
            <div>
              <p className="text-xs tracking-widest text-white/70">PROMO</p>
              <h3 className="mt-1 text-2xl font-bold md:text-3xl">
                Diskon Musim Ini
              </h3>
              <p className="mt-2 max-w-md text-white/80">
                Pilihan koleksi terpilih sampai 25%. Berlaku sampai akhir bulan.
              </p>
            </div>
            <div className="flex items-end md:justify-end">
              <a
                href="#promo"
                className="inline-flex rounded-lg bg-white px-5 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
              >
                Cek Promo
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* NEWS / PRESS */}
      <section id="news" className="bg-neutral-50">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
          <header className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold md:text-3xl">Berita & Event</h2>
              <p className="mt-1 text-neutral-600">Info terbaru dari brand.</p>
            </div>
            <a
              href="#all-news"
              className="text-sm font-semibold text-neutral-600 hover:text-neutral-900"
            >
              Arsip →
            </a>
          </header>

          <ul className="divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white">
            {news.map((n) => (
              <li
                key={n.title}
                className="flex flex-col gap-2 p-4 hover:bg-neutral-50 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="text-xs text-neutral-500">{n.date}</p>
                  <a
                    href={n.href}
                    className="mt-1 block text-base font-semibold hover:underline"
                  >
                    {n.title}
                  </a>
                </div>
                <a
                  href={n.href}
                  className="self-start rounded-md border border-neutral-300 px-3 py-1 text-sm font-semibold text-neutral-700 hover:bg-neutral-100 md:self-auto"
                >
                  Baca
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-neutral-200">
        <div className="mx-auto w-full max-w-6xl px-4 py-10">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <h4 className="text-sm font-semibold">Produk</h4>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>
                  <a className="hover:text-neutral-900" href="#watches">
                    Watches
                  </a>
                </li>
                <li>
                  <a className="hover:text-neutral-900" href="#calculators">
                    Calculators
                  </a>
                </li>
                <li>
                  <a className="hover:text-neutral-900" href="#music">
                    Musical Instruments
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Dukungan</h4>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>
                  <a className="hover:text-neutral-900" href="#warranty">
                    Garansi
                  </a>
                </li>
                <li>
                  <a className="hover:text-neutral-900" href="#manuals">
                    Manual & Download
                  </a>
                </li>
                <li>
                  <a className="hover:text-neutral-900" href="#service">
                    Service Center
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Perusahaan</h4>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                <li>
                  <a className="hover:text-neutral-900" href="#about">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a className="hover:text-neutral-900" href="#careers">
                    Karier
                  </a>
                </li>
                <li>
                  <a className="hover:text-neutral-900" href="#press">
                    Press
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold">Newsletter</h4>
              <p className="mt-3 text-sm text-neutral-600">
                Dapatkan info terbaru & promo menarik.
              </p>
              <form className="mt-3 flex gap-2">
                <input
                  type="email"
                  placeholder="Email kamu"
                  className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900"
                />
                <button
                  type="submit"
                  className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-semibold text-white hover:bg-neutral-800"
                >
                  Daftar
                </button>
              </form>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-neutral-200 pt-6 text-xs text-neutral-500 md:flex-row">
            <p>
              © {new Date().getFullYear()} Casio (Demo). All rights reserved.
            </p>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-neutral-900">
                Privacy
              </a>
              <a href="#terms" className="hover:text-neutral-900">
                Terms
              </a>
              <a href="#cookies" className="hover:text-neutral-900">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
