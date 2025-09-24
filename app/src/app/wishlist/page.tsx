"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import ProductCard from "@/components/ProductCard";
import { Product } from "@/types";

type WishlistItem = {
  _id: string;
  productId: Product[];
};

export default function WishlistPage() {
  const [wishlists, setWishlists] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const fetchWishlist = useCallback(async () => {
    try {
      const res = await fetch("/api/wishlist", { cache: "no-store" });
      if (res.status === 401) {
        setIsLoggedIn(false);
        return;
      }
      if (!res.ok) {
        throw new Error("Failed to fetch wishlist");
      }
      const data: WishlistItem[] = await res.json();
      setWishlists(data);
      setIsLoggedIn(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (loading) {
    return (
      <main className="min-h-screen bg-white pt-13">
        <div className="px-6 py-10">
          <h1 className="mb-8 text-2xl font-bold pl-10 text-black">Favorit</h1>
          <div className="text-center text-black">Loading...</div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white pt-13">
        <div className="px-6 py-10">
          <h1 className="mb-8 text-2xl font-bold pl-10 text-black">Favorit</h1>
          <div className="text-center text-red-500">Error: {error}</div>
        </div>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className="min-h-screen bg-white pt-13">
        <div className="px-6 py-10">
          <h1 className="mb-8 text-2xl font-bold pl-10 text-black">Favorit</h1>
          <div className="flex justify-center">
            <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow p-6 text-center">
              <h2 className="text-xl font-semibold mb-4 text-black">
                Anda belum login
              </h2>
              <Link href="/login">
                <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white pt-13">
      <div className="px-6 py-10">
        <h1 className="mb-8 text-2xl font-bold text-black pl-10">Favorit</h1>

        {wishlists.length === 0 ? (
          <div className="flex justify-center">
            <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow p-6 text-center">
              <h2 className="text-xl font-semibold text-black">
                Anda belum memiliki produk favorit.
              </h2>
              <br />
              <Link href="/products">
                <button className="w-1/2 bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
                  Telusuri Produk
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 justify-start pl-10">
            {wishlists.map((wishlist) => (
              <ProductCard
                key={wishlist._id}
                product={wishlist.productId[0]}
                onWishlistRemoved={fetchWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
