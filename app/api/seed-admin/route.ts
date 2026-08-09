import { NextRequest, NextResponse } from "next/server";
import { seedAdminStore } from "@/lib/dbStore";

/**
 * GET /api/seed-admin
 * Default admin credentials: username=bablibakery2026, password=babli@2926
 */
export async function GET(req: NextRequest) {
  const key = req.nextUrl.searchParams.get("key");
  if (key !== process.env.SEED_KEY && key !== "babli-setup-2024") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const creds = await seedAdminStore("bablibakery2026", "babli@2926");
    return NextResponse.json({
      message: "Admin account seeded successfully!",
      credentials: creds,
    });
  } catch (err) {
    console.error("Seed admin error:", err);
    return NextResponse.json({ error: "Failed to seed admin" }, { status: 500 });
  }
}
