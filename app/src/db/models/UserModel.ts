import * as z from "zod";
import { hashSync } from "bcryptjs";
import { getDatabase } from "../config/mongodb";
import { UserType } from "@/types";
const UserSChema = z.object({
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  name: z.string().min(1, { message: "Name is required" }),
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" }),
});

class UserModel {
  static async create(payload: UserType) {
    UserSChema.parse(payload);
    const db = await getDatabase();
    const user = await db.collection("users").findOne({
      $or: [{ email: payload.email }, { username: payload.username }],
    });
    if (user) {
      throw { message: "Email or username already exists", status: 400 };
    }
    payload.password = hashSync(payload.password, 10);
    await db.collection("users").insertOne(payload);
  }
  static async findByEmail(email: string) {
    const db = await getDatabase();
    return db.collection("users").findOne({ email });
  }
}

export default UserModel;
