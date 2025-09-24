import { ObjectId } from "mongodb";
import { database } from "../config/mongodb";

class WishlistModel {
  static async create(userId: string, productId: string) {
    return await database.collection("wishlists").insertOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
    });
  }
  static async getByUserIdWithProducts(userId: string) {
    return await database
      .collection("wishlists")
      .aggregate([
        {
          $match: { userId: new ObjectId(userId) },
        },
        {
          $lookup: {
            from: "products",
            localField: "productId",
            foreignField: "_id",
            as: "productId",
          },
        },
      ])
      .toArray();
  }
  static async delete(userId: string, productId: string) {
    return await database.collection("wishlists").deleteOne({
      userId: new ObjectId(userId),
      productId: new ObjectId(productId),
    });
  }
}

export default WishlistModel;
