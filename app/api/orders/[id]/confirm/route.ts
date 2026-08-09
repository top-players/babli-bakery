import { NextRequest, NextResponse } from "next/server";
import { confirmDeliveryStore } from "@/lib/dbStore";

/* POST /api/orders/[id]/confirm — customer confirms delivery */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await confirmDeliveryStore(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const socketUrl = process.env.SOCKET_SERVER_URL;
    if (socketUrl) {
      try {
        await fetch(`${socketUrl}/emit-order-update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order }),
        });
      } catch { /* non-critical */ }
    }

    return NextResponse.json({ success: true, order });
  } catch (err) {
    console.error("POST /api/orders/[id]/confirm error:", err);
    return NextResponse.json({ error: "Confirmation failed" }, { status: 500 });
  }
}
