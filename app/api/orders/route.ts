import { NextRequest, NextResponse } from "next/server";
import { getOrdersStore, createOrderStore } from "@/lib/dbStore";

/* GET /api/orders — admin dashboard orders list */
export async function GET() {
  try {
    const orders = await getOrdersStore();
    return NextResponse.json({ orders });
  } catch (err) {
    console.error("GET /api/orders error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

/* POST /api/orders — place new customer order */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { customerName, phone, address, items, totalAmount, paymentMode } = body;

    if (!customerName?.trim()) return NextResponse.json({ error: "Name required"    }, { status: 400 });
    if (!phone?.trim())        return NextResponse.json({ error: "Phone required"   }, { status: 400 });
    if (!address?.trim())      return NextResponse.json({ error: "Address required" }, { status: 400 });
    if (!items?.length)        return NextResponse.json({ error: "No items in order"}, { status: 400 });

    const order = await createOrderStore({
      customerName: customerName.trim(),
      phone: phone.trim(),
      address: address.trim(),
      items,
      totalAmount,
      paymentMode: paymentMode || "Cash on Delivery",
    });

    /* Emit Socket.io event if available */
    const socketUrl = process.env.SOCKET_SERVER_URL;
    if (socketUrl) {
      try {
        await fetch(`${socketUrl}/emit-new-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order }),
        });
      } catch {
        /* Non-critical */
      }
    }

    return NextResponse.json({ order, trackingId: order.trackingId }, { status: 201 });
  } catch (err) {
    console.error("POST /api/orders error:", err);
    return NextResponse.json({ error: "Failed to place order" }, { status: 500 });
  }
}
