import ProductModel from "@/db/models/ProductModel";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const tags = await ProductModel.getAllTags();
  return Response.json({ tags });
}
