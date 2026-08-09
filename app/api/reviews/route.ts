import { NextRequest, NextResponse } from "next/server";
import { getReviewsStore, createReviewStore } from "@/lib/dbStore";

/* GET /api/reviews */
export async function GET() {
  try {
    const reviews = await getReviewsStore();
    return NextResponse.json({ reviews });
  } catch (err) {
    console.error("GET /api/reviews error:", err);
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}

/* POST /api/reviews */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, rating, comment } = body;

    if (!name?.trim())    return NextResponse.json({ error: "Name is required" }, { status: 400 });
    if (!comment?.trim()) return NextResponse.json({ error: "Review comment is required" }, { status: 400 });
    if (typeof rating !== "number" || rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
    }

    const review = await createReviewStore({
      name: name.trim(),
      rating,
      comment: comment.trim(),
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (err) {
    console.error("POST /api/reviews error:", err);
    return NextResponse.json({ error: "Failed to submit review" }, { status: 500 });
  }
}
