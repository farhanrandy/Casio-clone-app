import ProductModel from "@/db/models/ProductModel";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  // ambil query string ?cursor=...&limit=...&tags=...&search=...
  const { searchParams } = new URL(req.url);
  const cursor = searchParams.get("cursor") || undefined;
  const limit = parseInt(searchParams.get("limit") || "15", 10);
  const tagsStr = searchParams.get("tags") || "";
  const tags = tagsStr ? tagsStr.split(",").map((t) => t.trim()) : [];
  const search = searchParams.get("search") || undefined;

  // ambil data dengan filter
  const items = await ProductModel.getAll(cursor, limit, { tags, search });

  // tentukan nextCursor (pakai _id dari item terakhir)
  const nextCursor =
    items.length > 0 ? items[items.length - 1]._id.toString() : null;

  return Response.json({
    items,
    nextCursor,
  });
}
