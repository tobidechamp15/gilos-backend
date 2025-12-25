import generateActivationCode from "@/lib/generateCode";
import dbConnect from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const code = generateActivationCode(9);
  return NextResponse.json({ message: "Hello", code });
}
