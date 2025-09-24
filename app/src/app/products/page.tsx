"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import SidebarFilter from "@/components/SidebarFilter";
import { Product } from "@/types";

interface FilterState {
  tags: string[];
}

type PageResp = {
  items: Product[];
  nextCursor: string | null;
};

export default function Page() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [initialLoaded, setInitialLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // filter state
  const [filters, setFilters] = useState<FilterState>({ tags: [] });
  const [availableTags, setAvailableTags] = useState<string[]>([]);

  // search state + suggestions
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [showSuggest, setShowSuggest] = useState(false);

  // cegah load ganda saat observer trigger berkali-kali
  const loadingRef = useRef(false);

  const fetchPage = useCallback(
    async (cursor?: string) => {
      if (loadingRef.current) return;
      loadingRef.current = true;
      setLoading(true);
      setError(null);

      try {
        const qs = new URLSearchParams();
        if (cursor) qs.set("cursor", cursor);
        qs.set("limit", "12"); // atur sesuai kebutuhan

        // tambah filter ke query
        if (filters.tags.length > 0) qs.set("tags", filters.tags.join(","));
        if (searchQuery) qs.set("search", searchQuery);

        const res = await fetch(`/api/products?${qs.toString()}`, {
          cache: "no-store",
        });
        if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);

        const data: PageResp = await res.json();

        // optional: hindari duplikat bila backend belum pasti unique
        setProducts((prev) => {
          const seen = new Set(prev.map((p) => p._id));
          const merged = [...prev];
          for (const item of data.items) {
            if (!seen.has(item._id)) merged.push(item);
          }
          return merged;
        });

        setNextCursor(data.nextCursor);
        setHasMore(Boolean(data.nextCursor) && data.items.length > 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        setHasMore(false);
      } finally {
        setLoading(false);
        loadingRef.current = false;
        setInitialLoaded(true);
      }
    },
    [filters, searchQuery]
  );

  // initial load
  useEffect(() => {
    fetchPage();
  }, [fetchPage]);

  // infinite observer
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const el = sentinelRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting && hasMore && !loading) {
          fetchPage(nextCursor ?? undefined);
        }
      },
      { rootMargin: "200px 0px" } // prefetch lebih awal
    );

    observer.observe(el);
    return () => observer.unobserve(el);
  }, [fetchPage, nextCursor, hasMore, loading]);

  const handleFilterChange = useCallback(
    (newFilters: FilterState) => {
      setFilters(newFilters);
      setProducts([]); // reset products
      setNextCursor(null);
      setHasMore(true);
      setInitialLoaded(false);
      fetchPage(); // fetch ulang dengan filter baru
    },
    [fetchPage]
  );

  // debounced suggestions fetch (lightweight list)
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const onSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setShowSuggest(true);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      if (!value.trim()) {
        setSuggestions([]);
        return;
      }
      const qs = new URLSearchParams();
      qs.set("limit", "10");
      qs.set("search", value.trim());
      // do not include tags here; suggestions are quick matches
      const res = await fetch(`/api/products?${qs.toString()}`, {
        cache: "no-store",
      });
      if (res.ok) {
        const data: PageResp = await res.json();
        setSuggestions(data.items);
      }
    }, 400);
  }, []);

  const goToDetail = (slug: string) => {
    setShowSuggest(false);
    setSuggestions([]);
    router.push(`/products/${slug}`);
  };

  // fetch available tags
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch("/api/products/tags");
        if (res.ok) {
          const data = await res.json();
          setAvailableTags(data.tags);
        }
      } catch (err) {
        console.error("Failed to fetch tags:", err);
      }
    };
    fetchTags();
  }, []);

  return (
    <main className="min-h-screen bg-white pt-13">
      <div className="px-6 py-10">
        <h1 className="mb-6 text-2xl text-black font-bold">Produk Casio</h1>

        {/* Search with debounce and suggestions */}
        <div className="relative mb-6 justify-end flex pr-25">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari produk…"
            className="w-1/5 text-black px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-neutral-800"
          />
          {showSuggest && suggestions.length > 0 && (
            <div className="absolute z-20 mt-2 w-full max-h-80 overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
              {suggestions.map((s) => (
                <button
                  key={s._id}
                  onClick={() => goToDetail(s.slug)}
                  className="w-full text-left text-black px-4 py-2 hover:bg-gray-50"
                >
                  {s.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* error state */}
        {error && (
          <div className="mb-6 text-red-600 text-sm">Error: {error}</div>
        )}

        {/* layout dengan sidebar */}
        <div className="flex gap-8">
          {/* sidebar filter */}
          <div className="w-80 flex-shrink-0">
            <SidebarFilter
              filters={filters}
              availableTags={availableTags}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* products grid */}
          <div className="flex-1">
            <div className="flex flex-wrap gap-4 justify-center">
              {products.map((p) => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>

            {/* loading skeleton / spinner */}
            <div className="flex justify-center py-6">
              {loading && <div className="text-sm text-gray-600">Loading…</div>}
            </div>

            {/* sentinel untuk Observer */}
            <div ref={sentinelRef} />

            {/* fallback tombol (aksesibilitas / jika observer gagal) */}
            {!loading && hasMore && (
              <div className="flex justify-center py-4">
                <button
                  onClick={() => fetchPage(nextCursor ?? undefined)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Load more
                </button>
              </div>
            )}

            {/* end state */}
            {initialLoaded && !hasMore && (
              <div className="text-center py-6 text-gray-500 text-sm">
                Kamu sudah mencapai akhir katalog.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
