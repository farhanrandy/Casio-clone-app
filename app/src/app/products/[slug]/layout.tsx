import type { Metadata } from "next";
import ProductModel from "@/db/models/ProductModel";
import React from "react";

type MetadataProps = {
  params: { slug: string };
};

export async function generateMetadata({
  params,
}: MetadataProps): Promise<Metadata> {
  const { slug } = params;

  try {
    const product = await ProductModel.getBySlug(slug);
    if (!product) {
      return {
        title: "Produk tidak ditemukan",
        description: "Produk yang Anda cari tidak tersedia.",
        robots: { index: false },
      };
    }

    const title = `${product.name} | Casio`;
    const description =
      product.excerpt || `${product.name} - ${product.category}`;
    const image = product.thumbnail || (product.images && product.images[0]);

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: image ? [{ url: image }] : undefined,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: image ? [image] : undefined,
      },
    };
  } catch {
    return {
      title: "Detail Produk | Casio",
    };
  }
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
