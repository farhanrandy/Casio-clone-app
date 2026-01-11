import errHandler from "@/helpers/errHandler";
import ProductModel from "@/db/models/ProductModel";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const product = await ProductModel.getBySlug(slug);
    if (!product) {
      return new Response("Product not found", { status: 404 });
    }
    return NextResponse.json(product);
  } catch (err) {
    return errHandler(err);
  }
}
