import * as z from "zod";
import { NextResponse } from "next/server";

export default function errHandler(err: unknown) {
  const error = err as { message: string; status: number };
  console.log(error);

  if (error instanceof z.ZodError) {
    error.status = 400;
    error.message = error.issues[0].message;
  }

  return NextResponse.json(
    { message: error.message },
    { status: error.status || 500 }
  );
}
