import UserModel from "@/db/models/UserModel";
import errHandler from "@/helpers/errHandler";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password, name, username } = await req.json();
    await UserModel.create({ email, password, name, username });
    return NextResponse.json({ message: "User created successfully" });
  } catch (err) {
    return errHandler(err);
  }
}
