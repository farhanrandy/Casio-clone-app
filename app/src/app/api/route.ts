import ProductModel from "@/db/models/ProductModel";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await ProductModel.getAll();
  return NextResponse.json(products);
}
