import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "babli-bakery-secret-2024";

/* GET /api/auth/me — Check if current user is logged in as admin */
export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("admin_token")?.value;
    if (!token) {
      return NextResponse.json({ authenticated: false }, { status: 200 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    return NextResponse.json({ authenticated: true, username: decoded.username });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }
}
