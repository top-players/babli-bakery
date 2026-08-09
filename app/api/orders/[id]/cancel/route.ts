import { NextRequest, NextResponse } from "next/server";
import { getOrderByIdOrTrackingStore, updateOrderStatusStore } from "@/lib/dbStore";

const CANCEL_WINDOW_MS = 5 * 60 * 1000; /* 5 minutes */

/* POST /api/orders/[id]/cancel */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderByIdOrTrackingStore(id);

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "Pending") {
      return NextResponse.json(
        { error: "Order cannot be cancelled — it is already being prepared." },
        { status: 400 }
      );
    }

    const elapsed = Date.now() - new Date(order.createdAt).getTime();
    if (elapsed > CANCEL_WINDOW_MS) {
      return NextResponse.json(
        { error: "Cancellation window has expired (5 minutes). Your order is being prepared." },
        { status: 400 }
      );
    }

    const updated = await updateOrderStatusStore(id, "Cancelled");

    const socketUrl = process.env.SOCKET_SERVER_URL;
    if (socketUrl) {
      try {
        await fetch(`${socketUrl}/emit-order-update`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order: updated }),
        });
      } catch { /* non-critical */ }
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    console.error("POST /api/orders/[id]/cancel error:", err);
    return NextResponse.json({ error: "Cancel failed" }, { status: 500 });
  }
}
