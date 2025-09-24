import React from "react";
import { notFound } from "next/navigation";
import ProductModel from "@/db/models/ProductModel";
import WishlistButton from "@/components/WishlistButton";
import { Product } from "@/types";

interface PageProps {
  params: {
    slug: string;
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug } = params;

  const productRaw = await ProductModel.getBySlug(slug);

  if (!productRaw) {
    notFound();
  }

  const product: Product = {
    _id: productRaw._id.toString(),
    name: productRaw.name,
    slug: productRaw.slug,
    description: productRaw.description,
    excerpt: productRaw.excerpt,
    price: productRaw.price,
    tags: productRaw.tags,
    thumbnail: productRaw.thumbnail,
    images: productRaw.images,
    createdAt:
      productRaw.createdAt instanceof Date
        ? productRaw.createdAt.toISOString()
        : typeof (productRaw as unknown as { createdAt?: string }).createdAt ===
          "string"
        ? (productRaw as unknown as { createdAt: string }).createdAt
        : new Date().toISOString(),
    updatedAt:
      productRaw.updatedAt instanceof Date
        ? productRaw.updatedAt.toISOString()
        : typeof (productRaw as unknown as { updatedAt?: string }).updatedAt ===
          "string"
        ? (productRaw as unknown as { updatedAt: string }).updatedAt
        : new Date().toISOString(),
    category: productRaw.category,
  };

  // Gabungkan thumbnail dan images, hindari duplikasi
  const allImages = [
    product.thumbnail,
    ...product.images.filter((img: string) => img !== product.thumbnail),
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="px-6 py-10 pt-28 w-full mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Gambar Produk - Mengambil 2/3 bagian */}
          <div className="md:col-span-2">
            <div className="grid grid-cols-2 gap-1">
              {allImages.map((image: string, index: number) => (
                <img
                  key={index}
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ))}
            </div>
          </div>

          {/* Detail Produk - Mengambil 1/3 bagian */}
          <div className="md:col-span-1">
            <h1 className="text-6xl font-bold mb-4 text-black">
              {product.name}
            </h1>
            <p className="text-4xl font-semibold mb-2 text-black">
              Rp {product.price.toLocaleString("id-ID")}
            </p>
            <br />
            <p className="text-2xl text-black mb-4 font-semibold">
              {product.category}
            </p>
            <p className="text-sm mb-4 text-black">{product.excerpt}</p>
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-black">Description:</h3>
              <p className="text-sm text-black">{product.description}</p>
            </div>
            <div className="mb-4">
              <h3 className="font-semibold mb-2 text-black">Tags:</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string) => (
                  <span
                    key={tag}
                    className="px-2 py-1 bg-gray-200 rounded text-sm text-black"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <WishlistButton productId={product._id} />
          </div>
        </div>
      </div>
    </main>
  );
}
