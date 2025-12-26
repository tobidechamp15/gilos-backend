import bcrypt from "bcrypt";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import generateActivationCode from "@/lib/generateCode";
import sendActivationEmail from "@/lib/sendEmail";

export async function POST(req) {
  await dbConnect();

  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(
      JSON.stringify({ error: "Email and password are required" }),
      { status: 400 }
    );
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User exists" }), {
      status: 400,
    });
  }

  // Generate activation code
  const activationCode = generateActivationCode();
  const activationCodeHash = await bcrypt.hash(activationCode, 10);
  const codeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

  // Create user with flat activation fields
  const user = await User.create({
    email,
    password: await bcrypt.hash(password, 10),
    activationCodeHash,
    codeExpires,
    isVerified: false,
  });

  // Send email
  await sendActivationEmail(email, activationCode);

  return NextResponse.json(
    {
      message: "Signup successful. Check your email.",
      user: {
        email,
        id: user._id,
      },
    },
    { status: 201 }
  );
}
