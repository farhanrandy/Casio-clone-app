import errHandler from "@/helpers/errHandler";
import UserModel from "@/db/models/UserModel";
import { compareSync } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw { message: "Invalid email or password", code: 401 };
    }
    const isValid = compareSync(password, user.password);
    if (!isValid) {
      throw { message: "Invalid email or password", code: 401 };
    }
    const accessToken = sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET as string
    );
    const cookieStore = await cookies();
    cookieStore.set("Authorization", `Bearer ${accessToken}`);
    return Response.json({ accessToken });
  } catch (err) {
    return errHandler(err);
  }
}
