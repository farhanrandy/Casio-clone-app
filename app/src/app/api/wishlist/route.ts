import errHandler from "@/helpers/errHandler";
import WishlistModel from "@/db/models/WishlistModel";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      throw { message: "Unauthorized", status: 401 };
    }
    await WishlistModel.create(userId, productId);
      return NextResponse.json({ message: "Product added to wishlist" });
  } catch (err) {
    return errHandler(err);
  }
}

export async function GET(request: Request) {
  try {
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      throw { message: "Unauthorized", status: 401 };
    }
    const wishlists = await WishlistModel.getByUserIdWithProducts(userId);
      return NextResponse.json(wishlists);
  } catch (err) {
    return errHandler(err);
  }
}

export async function DELETE(request: Request) {
  try {
    const { productId } = await request.json();
    const userId = request.headers.get("x-user-id");
    if (!userId) {
      throw { message: "Unauthorized", status: 401 };
    }
    await WishlistModel.delete(userId, productId);
      return NextResponse.json({ message: "Product removed from wishlist" });
  } catch (err) {
    return errHandler(err);
  }
}
