"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  productId: string;
}

export default function WishlistButton({ productId }: WishlistButtonProps) {
  const router = useRouter();
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const res = await fetch("/api/wishlist", { cache: "no-store" });
        if (res.status === 401) return;
        if (!res.ok) return;
        type WishlistItem = {
          _id: string;
          productId: Array<{ _id: string }>;
        };
        const data: WishlistItem[] = await res.json();
        const found = data.some((w) =>
          w.productId.some((p) => p?._id?.toString?.() === productId)
        );
        if (!ignore) setIsWishlisted(found);
      } catch {}
    })();
    return () => {
      ignore = true;
    };
  }, [productId]);

  const toggleWishlist = useCallback(async () => {
    if (pending) return;
    setPending(true);
    try {
      if (!isWishlisted) {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.ok) {
          setIsWishlisted(true);
          setMessage("Ditambahkan ke wishlist!");
        } else {
          const err = await res.json().catch(() => ({}));
          setMessage(err?.message || "Gagal menambahkan ke wishlist.");
        }
      } else {
        const res = await fetch("/api/wishlist", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId }),
        });
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.ok) {
          setIsWishlisted(false);
          setMessage("Dihapus dari wishlist.");
        } else {
          const err = await res.json().catch(() => ({}));
          setMessage(err?.message || "Gagal menghapus wishlist.");
        }
      }
    } catch {
      setMessage("Terjadi kesalahan.");
    } finally {
      setPending(false);
      setTimeout(() => setMessage(""), 3000);
    }
  }, [productId, isWishlisted, pending, router]);

  return (
    <>
      <button
        onClick={toggleWishlist}
        disabled={pending}
        className={`w-1/2 py-2 rounded outline outline-2 outline-gray-300 shadow-lg ${
          isWishlisted
            ? "bg-red-300 text-black hover:bg-red-700 hover:text-white"
            : "bg-white-600 text-black hover:bg-blue-700 hover:text-white"
        } ${pending ? "opacity-70 cursor-not-allowed" : ""}`}
      >
        {isWishlisted ? "Hapus dari Favorit ❤️" : "Tambah ke Favorit 🖤"}
      </button>
      {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
    </>
  );
}
