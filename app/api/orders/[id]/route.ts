import { NextRequest, NextResponse } from "next/server";
import { getOrderByIdOrTrackingStore, updateOrderStatusStore, deleteOrderStore } from "@/lib/dbStore";

/* GET /api/orders/[id] — order tracking details */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const order = await getOrderByIdOrTrackingStore(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json({ order });
  } catch (err) {
    console.error("GET /api/orders/[id] error:", err);
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

/* PUT / PATCH /api/orders/[id] — admin update order status */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdateStatus(req, params);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return handleUpdateStatus(req, params);
}

async function handleUpdateStatus(
  req: NextRequest,
  paramsPromise: Promise<{ id: string }>
) {
  try {
    const { id } = await paramsPromise;
    const { status } = await req.json();
    if (!status) return NextResponse.json({ error: "Status required" }, { status: 400 });

    const order = await updateOrderStatusStore(id, status);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    /* Socket emit if available */
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

    return NextResponse.json({ order });
  } catch (err) {
    console.error("Update order error:", err);
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 });
  }
}

/* DELETE /api/orders/[id] — admin delete order */
export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const success = await deleteOrderStore(id);
    if (!success) {
      return NextResponse.json({ error: "Failed to delete order or order not found" }, { status: 400 });
    }
    return NextResponse.json({ success: true, message: "Order deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/orders/[id] error:", err);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
