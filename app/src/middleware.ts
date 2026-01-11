import { verify } from "jsonwebtoken";
import { cookies } from "next/headers";
import errHandler from "./helpers/errHandler";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("Authorization")?.value;
  try {
    const path = request.nextUrl?.pathname || "";

  if (path === "/login") {
    if (auth) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  } else if (path.startsWith("/api/wishlist")) {
    try {
      if (!auth) throw { message: "Please login first", status: 401 };
      const [type, token] = auth?.split(" ");

      if (type !== "Bearer" || !token) {
        throw { message: "Invalid token format", status: 401 };
      }

      const decoded = verify(token, process.env.JWT_SECRET as string) as {
        id: string;
        email: string;
      };

      const requestHeader = new Headers(request.headers);
      requestHeader.set("x-user-id", decoded.id as string);

      const response = NextResponse.next({
        request: {
          headers: requestHeader,
        },
      });
      return response;
    } catch (err) {
      return errHandler(err);
    }
  }
  } catch (err) {
    console.error("middleware runtime error:", err);
    return NextResponse.next();
  }
}
export const config = {
  matcher: ["/login", "/api/wishlist/:path*"],
  runtime: "nodejs",
};
