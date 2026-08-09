import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { verifyAdminCredentials } from "@/lib/dbStore";

const JWT_SECRET = process.env.JWT_SECRET || "babli-bakery-secret-2024";

/* POST /api/auth/login */
export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password)
      return NextResponse.json({ error: "Username and password required" }, { status: 400 });

    const admin = await verifyAdminCredentials(username, password);
    if (!admin)
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      JWT_SECRET,
      { expiresIn: "365d" }
    );

    const response = NextResponse.json({ success: true, username: admin.username });
    response.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 365 * 24 * 60 * 60,
      path: "/",
    });
    return response;
  } catch (err) {
    console.error("POST /api/auth/login error:", err);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
