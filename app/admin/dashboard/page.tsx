"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import io, { Socket } from "socket.io-client";
import { CheckCircle2, Trash2, ExternalLink, Calendar, DollarSign, ShoppingBag, Clock, Sparkles } from "lucide-react";

/* ─── Types ─── */
interface OrderItem { name: string; price: number; qty: number; }
interface Order {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMode: string;
  status: string;
  trackingId: string;
  deliveryConfirmedByCustomer: boolean;
  createdAt: string;
}

const STATUS_FLOW = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

const statusBadge = (s: string) => {
  const m: Record<string, string> = {
    "Pending":               "badge-pending",
    "Preparing":             "badge-preparing",
    "Out for Delivery":      "badge-delivery",
    "Delivered":             "badge-delivered",
    "Delivered - Confirmed": "badge-delivered",
    "Cancelled":             "badge-cancelled",
  };
  return m[s] || "badge-pending";
};

/* ─── Notification component ─── */
function Notification({ order, onClose }: { order: Order; onClose: () => void }) {
  useEffect(() => {
    const t = setTimeout(onClose, 8000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div className="animate-notif fixed top-6 right-6 z-[9999] w-80 card-dark border border-amber-500/50 p-5 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.3)]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <div className="w-3 h-3 bg-amber-400 rounded-full" />
            <div className="absolute inset-0 animate-ping-gold w-3 h-3 bg-amber-400 rounded-full" />
          </div>
          <span className="text-amber-400 font-bold text-sm">🛎️ New Order Received!</span>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-lg leading-none">×</button>
      </div>
      <p className="text-white font-semibold">{order.customerName}</p>
      <p className="text-gray-400 text-xs mt-1">📞 {order.phone}</p>
      <p className="text-gray-400 text-xs">📍 {order.address}</p>
      <div className="mt-2 pt-2 border-t border-white/5 flex justify-between items-center">
        <span className="text-amber-400 font-bold text-lg">₹{order.totalAmount}</span>
        <span className="text-gray-400 text-xs">{order.items.length} item(s)</span>
      </div>
    </div>
  );
}

/* ─── Main Dashboard ─── */
export default function AdminDashboard() {
  const router  = useRouter();
  const [orders, setOrders]         = useState<Order[]>([]);
  const [loading, setLoading]       = useState(true);
  const [notification, setNotif]    = useState<Order | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [filter, setFilter]         = useState<string>("active");
  const socketRef                   = useRef<Socket | null>(null);
  const audioRef                    = useRef<HTMLAudioElement | null>(null);

  /* ── fetch all orders ── */
  const fetchOrders = useCallback(async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.status === 401) { router.push("/admin/login"); return; }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch { /* silently handle */ }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  /* ── socket.io connection ── */
  useEffect(() => {
    const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
    if (!SOCKET_URL) return;

    const socket = io(SOCKET_URL, { transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("new-order", (order: Order) => {
      setOrders((prev) => [order, ...prev]);
      setNotif(order);
      /* Play sound */
      try {
        if (!audioRef.current) {
          audioRef.current = new Audio("/sounds/notification.mp3");
        }
        audioRef.current.play().catch(() => {});
      } catch { /* ignore audio errors */ }
    });

    socket.on("order-updated", (updated: Order) => {
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    });

    socket.on("order-delivered-confirmed", (updated: Order) => {
      setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
    });

    return () => { socket.disconnect(); };
  }, []);

  /* ── update order status ── */
  const updateStatus = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
      }
    } catch { /* silently handle */ }
    finally { setUpdatingId(null); }
  };

  /* ── confirm order (marks as Delivered & moves to history) ── */
  const confirmOrder = async (orderId: string) => {
    setUpdatingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "Delivered - Confirmed" }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders((prev) => prev.map((o) => (o._id === orderId ? data.order : o)));
      }
    } catch { /* silently handle */ }
    finally { setUpdatingId(null); }
  };

  /* ── delete order ── */
  const deleteOrder = async (orderId: string) => {
    if (!window.confirm("Are you sure you want to delete this order permanently?")) return;
    setDeletingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o._id !== orderId));
      } else {
        const data = await res.json();
        alert(data.error || "Failed to delete order");
      }
    } catch {
      alert("Failed to delete order. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  /* ── logout ── */
  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  /* ── Date Helpers for Today's Stats ── */
  const todayStr = new Date().toDateString();
  const todayOrders = orders.filter((o) => new Date(o.createdAt).toDateString() === todayStr);
  const todayIncome = todayOrders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
  const totalIncome = orders.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);

  /* ── Filter Logic ── */
  const filtered = orders.filter((o) => {
    if (filter === "all") return true;
    if (filter === "active") return ["Pending", "Preparing", "Out for Delivery"].includes(o.status);
    if (filter === "history") return o.status.includes("Delivered") || o.status === "Cancelled";
    return o.status.toLowerCase().includes(filter.toLowerCase());
  });

  const counts = {
    all:     orders.length,
    active:  orders.filter((o) => ["Pending", "Preparing", "Out for Delivery"].includes(o.status)).length,
    pending: orders.filter((o) => o.status === "Pending").length,
    history: orders.filter((o) => o.status.includes("Delivered") || o.status === "Cancelled").length,
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pt-0 font-sans">
      {/* Notification */}
      {notification && (
        <Notification order={notification} onClose={() => setNotif(null)} />
      )}

      {/* Admin Header */}
      <header className="bg-stone-900 border-b border-amber-500/20 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="font-serif font-bold text-xl text-amber-400 flex items-center gap-2">
              <Sparkles size={18} /> Babli Bakery
            </div>
            <span className="text-stone-700">|</span>
            <span className="text-stone-400 text-sm">Owner Control Panel</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin/reviews" className="text-stone-300 hover:text-amber-400 transition-colors text-sm font-medium">
              📝 Customer Reviews
            </a>
            <button onClick={logout} className="text-xs px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 border border-stone-700 transition-colors">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Today's Income & Orders Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-stone-900 border border-amber-500/30 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Calendar size={14} className="text-amber-400" /> Today&apos;s Orders
              </span>
              <div className="p-2 bg-amber-500/10 rounded-xl text-amber-400">
                <ShoppingBag size={20} />
              </div>
            </div>
            <div className="font-serif font-bold text-3xl text-white mt-1">
              {todayOrders.length} <span className="text-sm font-sans font-normal text-stone-400">orders</span>
            </div>
            <p className="text-xs text-amber-400/80 mt-2">Placed today ({new Date().toLocaleDateString()})</p>
          </div>

          <div className="bg-stone-900 border border-green-500/30 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign size={14} className="text-green-400" /> Today&apos;s Income
              </span>
              <div className="p-2 bg-green-500/10 rounded-xl text-green-400">
                💵
              </div>
            </div>
            <div className="font-serif font-bold text-3xl text-green-400 mt-1">
              ₹{todayIncome}
            </div>
            <p className="text-xs text-green-500/80 mt-2">Revenue generated today</p>
          </div>

          <div className="bg-stone-900 border border-blue-500/30 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={14} className="text-blue-400" /> Active Orders
              </span>
              <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                🔥
              </div>
            </div>
            <div className="font-serif font-bold text-3xl text-blue-400 mt-1">
              {counts.active} <span className="text-sm font-sans font-normal text-stone-400">pending</span>
            </div>
            <p className="text-xs text-blue-400/80 mt-2">Needs preparation / delivery</p>
          </div>

          <div className="bg-stone-900 border border-purple-500/30 p-6 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-stone-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                Total All-Time Income
              </span>
              <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                🏆
              </div>
            </div>
            <div className="font-serif font-bold text-3xl text-purple-300 mt-1">
              ₹{totalIncome}
            </div>
            <p className="text-xs text-purple-400/80 mt-2">{counts.all} total orders recorded</p>
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-stone-800">
          <div className="flex flex-wrap gap-2">
            {[
              { key: "active",   label: "🔥 Active Orders", count: counts.active },
              { key: "history",  label: "📜 Order History", count: counts.history },
              { key: "all",      label: "📦 All Orders", count: counts.all },
              { key: "pending",  label: "⏳ Pending", count: counts.pending },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 ${
                  filter === f.key
                    ? "bg-amber-500 text-stone-950 shadow-md scale-105"
                    : "bg-stone-900 text-stone-400 hover:text-white border border-stone-800"
                }`}
              >
                <span>{f.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${filter === f.key ? "bg-stone-950/20 text-stone-950" : "bg-stone-800 text-stone-300"}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          <div className="text-xs text-stone-500">
            Showing <strong className="text-amber-400">{filtered.length}</strong> orders
          </div>
        </div>

        {/* Orders list */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-stone-400 text-sm">Loading orders list...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-stone-900 p-16 text-center rounded-3xl border border-stone-800">
            <div className="text-5xl mb-4">📭</div>
            <h3 className="text-stone-300 font-semibold text-lg">No orders found in this section</h3>
            <p className="text-stone-500 text-xs mt-1">New customer orders will appear here automatically in real-time.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {filtered.map((order) => {
              const idx = STATUS_FLOW.indexOf(order.status);
              const next = STATUS_FLOW[idx + 1];
              const isDelivered = order.status.includes("Delivered");

              return (
                <div
                  key={order._id}
                  className={`bg-stone-900 p-6 rounded-3xl border transition-all ${
                    isDelivered ? "border-stone-800/80 opacity-95" : "border-amber-500/30 shadow-md"
                  }`}
                >
                  {/* Order header */}
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center flex-wrap gap-2.5 mb-1.5">
                        <h3 className="font-semibold text-lg text-white">{order.customerName}</h3>
                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusBadge(order.status)}`}>
                          {order.status}
                        </span>
                        {order.deliveryConfirmedByCustomer && (
                          <span className="text-xs px-2.5 py-0.5 bg-green-500/20 text-green-400 border border-green-500/30 rounded-full font-medium">
                            ✓ Customer Confirmed
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-stone-400">
                        <span>📞 <strong>{order.phone}</strong></span>
                        <span>📍 {order.address}</span>
                        <span>💳 {order.paymentMode}</span>
                        <span>🕐 {new Date(order.createdAt).toLocaleString("en-IN")}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-serif font-bold text-2xl text-amber-400">₹{order.totalAmount}</div>
                      <div className="text-stone-500 text-[11px] font-mono mt-0.5">ID: {order.trackingId?.slice(0, 8)}</div>
                    </div>
                  </div>

                  {/* Items list */}
                  <div className="border-t border-stone-800/80 pt-4 mb-5">
                    <p className="text-stone-500 text-[11px] uppercase tracking-wider font-semibold mb-2">Order Items ({order.items.length})</p>
                    <div className="flex flex-wrap gap-2">
                      {order.items.map((item, i) => (
                        <span
                          key={i}
                          className="text-xs bg-stone-950 border border-stone-800 px-3 py-1.5 rounded-xl text-stone-300 flex items-center gap-1.5"
                        >
                          <span className="font-semibold text-amber-400">{item.qty}x</span>
                          <span>{item.name}</span>
                          <span className="text-stone-500">(₹{item.price * item.qty})</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons: Confirm Order, Next Status, Delete Order */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-800/50">
                    <div className="flex flex-wrap items-center gap-3">
                      {/* Confirm Order Button */}
                      {!isDelivered && (
                        <button
                          onClick={() => confirmOrder(order._id)}
                          disabled={updatingId === order._id}
                          className="px-4 py-2 rounded-xl text-xs font-bold bg-green-600 hover:bg-green-500 text-white flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
                        >
                          <CheckCircle2 size={14} /> Confirm &amp; Save to History
                        </button>
                      )}

                      {/* Advance Status Button */}
                      {next && (
                        <button
                          onClick={() => updateStatus(order._id, next)}
                          disabled={updatingId === order._id}
                          className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-stone-950 flex items-center gap-1 transition-colors disabled:opacity-50"
                        >
                          {updatingId === order._id ? "Updating..." : `Mark as ${next} →`}
                        </button>
                      )}

                      {/* External Tracking link */}
                      <a
                        href={`/track-order/${order.trackingId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-3.5 py-2 rounded-xl text-xs font-medium bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 flex items-center gap-1 transition-colors"
                      >
                        <ExternalLink size={13} /> View Live Track
                      </a>
                    </div>

                    {/* Delete Order Button */}
                    <button
                      onClick={() => deleteOrder(order._id)}
                      disabled={deletingId === order._id}
                      className="px-3.5 py-2 rounded-xl text-xs font-medium bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800/50 flex items-center gap-1.5 transition-colors ml-auto disabled:opacity-50"
                    >
                      <Trash2 size={13} /> {deletingId === order._id ? "Deleting..." : "Delete Order"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
