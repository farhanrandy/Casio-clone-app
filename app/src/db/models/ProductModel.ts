import { ObjectId } from "mongodb";
import { getDatabase } from "../config/mongodb";

class ProductModel {
  static async getAll(
    lastId?: string,
    limit: number = 10,
    filters?: { tags?: string[]; search?: string }
  ) {
    const query: Record<string, unknown> = lastId
      ? { _id: { $gt: new ObjectId(lastId) } }
      : {};

    // tambah filter tags (produk harus punya semua tags yang dipilih)
    if (filters?.tags && filters.tags.length > 0) {
      query.tags = { $all: filters.tags };
    }

    // tambah filter search (cari di name atau excerpt)
    if (filters?.search && filters.search.trim() !== "") {
      const regex = new RegExp(filters.search, "i");
      (query as Record<string, unknown>).$or = [
        { name: { $regex: regex } },
        { excerpt: { $regex: regex } },
      ];
    }

    const db = await getDatabase();
    return await db
      .collection("products")
      .find(query)
      .sort({ _id: 1 })
      .limit(limit)
      .toArray();
  }

  static async getAllTags() {
    const db = await getDatabase();
    const result = await db
      .collection("products")
      .aggregate([
        { $unwind: "$tags" },
        { $group: { _id: "$tags" } },
        { $sort: { _id: 1 } },
      ])
      .toArray();
    return result.map((item) => item._id);
  }

  static async getBySlug(slug: string) {
    const db = await getDatabase();
    return await db.collection("products").findOne({ slug });
  }
}

export default ProductModel;
