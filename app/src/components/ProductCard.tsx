// components/ProductCard.tsx
import { Product } from "@/types";
import React, { useEffect, useState } from "react";
import Link from "next/link";

function formatIDR(x: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(x);
}

interface ProductCardProps {
  product: Product;
  href?: string;
  className?: string;
  onWishlistRemoved?: () => void;
}

export default function ProductCard({
  product,
  href,
  className,
  onWishlistRemoved,
}: ProductCardProps) {
  const { slug, name, thumbnail, excerpt, price, category } = product;
  const url = href ?? `/products/${slug}`;

  const [message, setMessage] = useState<string>("");
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);

  // cek status wishlist produk untuk user saat init
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/wishlist", { cache: "no-store" });
        if (!res.ok) return;
        type WishlistItem = { _id: string; productId: Array<{ slug: string }> };
        const data: WishlistItem[] = await res.json();
        // data adalah array wishlist; setiap item memiliki productId: Product[] hasil $lookup
        const found = data.some((w) =>
          w.productId.some((p) => p?.slug === slug)
        );
        if (!ignore) setIsWishlisted(found);
      } catch {}
    })();
    return () => {
      ignore = true;
    };
  }, [slug]);

  // Fungsi untuk toggle wishlist
  const toggleWishlist = async () => {
    if (pending) return;
    setPending(true);
    try {
      if (!isWishlisted) {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        });
        if (res.ok) {
          setIsWishlisted(true);
        } else {
          const err = await res.json().catch(() => ({}));
          setMessage(err?.message || "Gagal menambahkan ke wishlist.");
        }
      } else {
        const res = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: product._id }),
        });
        if (res.ok) {
          setIsWishlisted(false);
          // beri tahu parent (halaman wishlist) untuk refetch
          onWishlistRemoved?.();
        } else {
          const err = await res.json().catch(() => ({}));
          setMessage(err?.message || "Gagal menghapus wishlist.");
        }
      }
    } catch (err) {
      setMessage("Terjadi kesalahan.");
    } finally {
      setPending(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  return (
    <Link
      href={url}
      className={`w-full sm:w-[calc(50%-0.5rem)] md:w-[calc(33.333%-0.67rem)] lg:w-[calc(16.666%-0.67rem)] rounded-lg border border-neutral-200 shadow hover:shadow-lg transition overflow-hidden flex flex-col min-h-[300px] ${
        className ?? ""
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="relative aspect-square bg-neutral-50 flex-shrink-0">
          <img
            src={thumbnail}
            alt={name}
            className="h-full w-full object-contain"
            loading="lazy"
          />
          {/* Wishlist button overlay (top-right) */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist();
            }}
            disabled={pending}
            aria-label={
              isWishlisted ? "Batalkan wishlist" : "Tambahkan ke wishlist"
            }
            className={`absolute top-2 right-2 rounded-full p-2 transition ${
              pending ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            <span>{isWishlisted ? "❤️" : "🖤"}</span>
          </button>
        </div>

        <div className="p-3 flex flex-col flex-1 min-h-[120px]">
          <h2 className="text-xm font-semibold text-neutral-800 line-clamp-2 flex-shrink-0">
            {name}
          </h2>
          <p className="mt-1 text-[10px] text-neutral-500 flex-shrink-0">
            {category} • {excerpt}
          </p>
          <p className="mt-2 text-xm font-semibold text-neutral-900 flex-shrink-0">
            {formatIDR(price)}
          </p>
          <div className="mt-auto">
            {message && (
              <p className="mt-1 text-xs text-green-600">{message}</p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
