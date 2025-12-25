import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

export async function POST(req) {
  await dbConnect();

  const { userId, code } = await req.json();

  if (!userId || !code) {
    return NextResponse.json(
      { error: "User ID and code are required" },
      { status: 400 }
    );
  }

  const user = await User.findById(userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.isVerified) {
    return NextResponse.json(
      { error: "Already verified" },
      { status: 400 }
    );
  }

  if (!user.activationCodeHash || !user.codeExpires) {
    return NextResponse.json(
      { error: "Activation data missing" },
      { status: 400 }
    );
  }

  if (new Date() > user.codeExpires) {
    return NextResponse.json({ error: "Code expired" }, { status: 400 });
  }

  const isValid = await bcrypt.compare(
    String(code),
    user.activationCodeHash
  );

  if (!isValid) {
    return NextResponse.json({ error: "Invalid code" }, { status: 400 });
  }

  user.isVerified = true;
  user.activationCodeHash = undefined;
  user.codeExpires = undefined;

  await user.save();

  return NextResponse.json({ message: "Account activated!" });
}
