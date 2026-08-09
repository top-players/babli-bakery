"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, Clock, X, ArrowRight } from "lucide-react";

interface Order {
  _id: string;
  customerName: string;
  phone: string;
  address: string;
  items: { name: string; price: number; qty: number }[];
  totalAmount: number;
  paymentMode: string;
  status: string;
  trackingId: string;
  createdAt: string;
}

const CANCEL_WINDOW_MS = 5 * 60 * 1000; /* 5 minutes */

function Confetti() {
  const particles = Array.from({ length: 48 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: ["#D4A24C", "#F0C070", "#3E2723", "#8D6E63", "#E8855C"][i % 5],
    delay: Math.random() * 0.8,
    duration: 1.5 + Math.random() * 1.5,
    size: 6 + Math.random() * 8,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute top-0 rounded-sm"
          style={{ left: `${p.x}%`, width: p.size, height: p.size, background: p.color }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{ y: "110vh", opacity: [1, 1, 0], rotate: 360 * 3 }}
          transition={{ duration: p.duration, delay: p.delay, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function CancelCountdown({
  createdAt,
  orderId,
  onCancelled,
}: {
  createdAt: string;
  orderId: string;
  onCancelled: () => void;
}) {
  const [secsLeft, setSecsLeft] = useState<number>(() => {
    const elapsed = Date.now() - new Date(createdAt).getTime();
    return Math.max(0, Math.floor((CANCEL_WINDOW_MS - elapsed) / 1000));
  });
  const [cancelling,    setCancelling]    = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(false);
  const [cancelError,   setCancelError]   = useState("");

  useEffect(() => {
    if (secsLeft <= 0) return;
    const t = setInterval(() => {
      setSecsLeft((s) => {
        if (s <= 1) { clearInterval(t); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [secsLeft]);

  const doCancel = async () => {
    setCancelling(true);
    setCancelError("");
    try {
      const res = await fetch(`/api/orders/${orderId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Cancel failed");
      setConfirmDialog(false);
      onCancelled();
    } catch (err: unknown) {
      setCancelError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setCancelling(false);
    }
  };

  const mm = String(Math.floor(secsLeft / 60)).padStart(2, "0");
  const ss = String(secsLeft % 60).padStart(2, "0");
  const pct = (secsLeft / 300) * 100;

  if (secsLeft <= 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-2xl p-5 text-center text-sm"
        style={{ background: "rgba(220,38,38,0.06)", border: "1px solid rgba(220,38,38,0.15)", fontFamily: "var(--font-jost), sans-serif", color: "#B91C1C" }}
      >
        🔒 Cancellation window closed. Your order is now being prepared.
      </motion.div>
    );
  }

  return (
    <>
      <motion.div
        className="rounded-2xl p-5"
        style={{ background: "rgba(212,162,76,0.06)", border: "1px solid rgba(212,162,76,0.25)" }}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037" }}>
            <Clock size={15} style={{ color: "#D4A24C" }} />
            Cancel window: <span style={{ color: secsLeft < 60 ? "#DC2626" : "#D4A24C" }}>{mm}:{ss}</span>
          </div>
          <button
            onClick={() => setConfirmDialog(true)}
            className="text-xs font-semibold px-4 py-2 rounded-full transition-all"
            style={{ background: "rgba(220,38,38,0.08)", color: "#DC2626", border: "1px solid rgba(220,38,38,0.2)", fontFamily: "var(--font-jost), sans-serif" }}
          >
            Cancel Order
          </button>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(212,162,76,0.15)" }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: secsLeft < 60 ? "#DC2626" : "linear-gradient(90deg,#D4A24C,#F0C070)", width: `${pct}%` }}
            transition={{ duration: 1 }}
          />
        </div>
        <p className="text-xs mt-2" style={{ fontFamily: "var(--font-jost), sans-serif", color: "#8D6E63" }}>
          You can cancel within 5 minutes of placing the order.
        </p>
      </motion.div>

      {/* Confirm dialog */}
      <AnimatePresence>
        {confirmDialog && (
          <>
            <motion.div
              className="fixed inset-0 z-[200] bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => !cancelling && setConfirmDialog(false)}
            />
            <motion.div
              className="fixed inset-0 z-[201] flex items-center justify-center px-4"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            >
              <motion.div
                className="glass-card p-8 max-w-sm w-full text-center"
                initial={{ scale: 0.85 }} animate={{ scale: 1 }} exit={{ scale: 0.85 }}
                transition={{ type: "spring", damping: 20, stiffness: 300 }}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="text-5xl mb-4">😟</div>
                <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.5rem", fontWeight: 700, color: "#2B1810", marginBottom: 8 }}>
                  Cancel Order?
                </h3>
                <p className="text-sm mb-6" style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037" }}>
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>
                {cancelError && (
                  <p className="text-sm mb-4 text-red-600" style={{ fontFamily: "var(--font-jost), sans-serif" }}>⚠ {cancelError}</p>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => setConfirmDialog(false)}
                    disabled={cancelling}
                    className="btn-outline flex-1"
                  >
                    Keep Order
                  </button>
                  <button
                    onClick={doCancel}
                    disabled={cancelling}
                    className="btn-danger flex-1"
                  >
                    {cancelling ? "Cancelling..." : "Yes, Cancel"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

const STEPS = ["Pending", "Preparing", "Out for Delivery", "Delivered"];
const STEP_ICONS: Record<string, string> = {
  "Pending":          "⏳",
  "Preparing":        "👨‍🍳",
  "Out for Delivery": "🛵",
  "Delivered":        "✅",
};

export default function OrderConfirmationPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const [order,     setOrder]    = useState<Order | null>(null);
  const [loading,   setLoading]  = useState(true);
  const [cancelled, setCancelled] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);

  const fetchOrder = useCallback(async () => {
    try {
      const res  = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (res.ok) setOrder(data.order);
    } catch { /* ignore */ }
    finally { setLoading(false); }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
    const t = setTimeout(() => setShowConfetti(false), 3500);
    return () => clearTimeout(t);
  }, [fetchOrder]);

  if (loading) return (
    <div className="min-h-screen pt-[72px] flex items-center justify-center bg-mesh-cream">
      <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
        <div className="w-10 h-10 border-3 border-gold-300 border-t-gold-600 rounded-full" style={{ borderColor: "#EDE0D4", borderTopColor: "#D4A24C", borderWidth: 3 }} />
      </motion.div>
    </div>
  );

  if (cancelled) return (
    <div className="min-h-screen pt-[72px] flex items-center justify-center bg-mesh-cream texture-bg">
      <motion.div
        className="text-center max-w-md px-6"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="text-6xl mb-5">😔</div>
        <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "2.5rem", fontWeight: 700, color: "#2B1810", marginBottom: 12 }}>
          Order Cancelled
        </h1>
        <p style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037", marginBottom: 28 }}>
          Your order has been cancelled. We hope to serve you again soon!
        </p>
        <Link href="/menu" className="btn-gold" style={{ fontSize: 15 }}>
          Order Again <ArrowRight size={16} />
        </Link>
      </motion.div>
    </div>
  );

  const currentStep = order ? STEPS.indexOf(order.status) : 0;

  return (
    <div className="min-h-screen pt-[72px] bg-mesh-cream texture-bg">
      {showConfetti && <Confetti />}

      <div className="container section-sm">
        <div className="max-w-2xl mx-auto">

          {/* Success header */}
          <motion.div
            className="text-center mb-10"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 200 }}
          >
            <motion.div
              className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
              style={{ background: "linear-gradient(135deg,#D4A24C,#F0C070)" }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2, damping: 15, stiffness: 200 }}
            >
              <CheckCircle size={44} style={{ color: "#2B1810" }} />
            </motion.div>
            <motion.h1
              style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2rem,5vw,3rem)", fontWeight: 700, color: "#2B1810", marginBottom: 8 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Order Confirmed! 🎉
            </motion.h1>
            <motion.p
              style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037", fontSize: "1.05rem" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Your order is placed. Payment: <strong style={{ color: "#2B1810" }}>Cash on Delivery</strong>
            </motion.p>
            {order && (
              <motion.p
                className="mt-2 text-xs"
                style={{ fontFamily: "var(--font-jost), sans-serif", color: "#BCAAA4" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                Order ID: #{order.trackingId?.slice(0, 8)?.toUpperCase() || order._id.slice(-8).toUpperCase()}
              </motion.p>
            )}
          </motion.div>

          {/* Status Tracker */}
          {order && (
            <motion.div
              className="glass-card p-8 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.3rem", fontWeight: 700, color: "#2B1810", marginBottom: 24 }}>
                Order Status
              </h3>

              <div className="relative">
                {/* Track line */}
                <div className="absolute top-5 left-5 right-5 h-0.5" style={{ background: "#EDE0D4" }} />
                <motion.div
                  className="absolute top-5 left-5 h-0.5"
                  style={{
                    background: "linear-gradient(90deg,#D4A24C,#F0C070)",
                    width: currentStep <= 0 ? "0%" : currentStep === 1 ? "33%" : currentStep === 2 ? "66%" : "100%",
                  }}
                  transition={{ duration: 0.8 }}
                />
                <div className="relative flex justify-between">
                  {STEPS.map((step, i) => {
                    const done   = i < currentStep;
                    const active = i === currentStep;
                    return (
                      <div key={step} className="flex flex-col items-center gap-2 w-1/4">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-lg z-10 border-2 transition-all duration-500"
                          style={{
                            borderColor: done ? "#4CAF50" : active ? "#D4A24C" : "#EDE0D4",
                            background:  done ? "#E8F5E9"  : active ? "rgba(212,162,76,0.1)" : "white",
                            boxShadow:   active ? "0 0 0 4px rgba(212,162,76,0.15)" : "none",
                          }}
                        >
                          {STEP_ICONS[step]}
                        </div>
                        <span
                          className="text-center text-xs"
                          style={{
                            fontFamily: "var(--font-jost), sans-serif",
                            fontWeight: active ? 600 : 400,
                            color: active ? "#D4A24C" : done ? "#4CAF50" : "#BCAAA4",
                          }}
                        >
                          {step}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Link
                href={`/track-order/${order.trackingId}`}
                className="inline-flex items-center gap-2 mt-6 text-sm"
                style={{ fontFamily: "var(--font-jost), sans-serif", color: "#D4A24C", fontWeight: 600 }}
              >
                Track Order in Real-time <ArrowRight size={14} />
              </Link>
            </motion.div>
          )}

          {/* Order Summary */}
          {order && (
            <motion.div
              className="glass-card p-7 mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.3rem", fontWeight: 700, color: "#2B1810", marginBottom: 16 }}>
                Order Details
              </h3>
              <div className="space-y-2.5 mb-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037" }}>
                      {item.name} × {item.qty}
                    </span>
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", fontWeight: 600, color: "#2B1810" }}>
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>
              <div
                className="flex justify-between items-baseline pt-4"
                style={{ borderTop: "1px solid rgba(212,162,76,0.2)" }}
              >
                <span style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, color: "#2B1810" }}>Total</span>
                <span style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "1.5rem", background: "linear-gradient(135deg,#D4A24C,#B8892E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  ₹{order.totalAmount}
                </span>
              </div>
              <div className="mt-4 pt-4 text-sm space-y-1" style={{ borderTop: "1px dashed rgba(212,162,76,0.2)" }}>
                <p style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037" }}>
                  📍 <strong>{order.address}</strong>
                </p>
                <p style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037" }}>
                  📞 {order.phone}
                </p>
              </div>
            </motion.div>
          )}

          {/* Cancellation window */}
          {order && order.status === "Pending" && (
            <CancelCountdown
              createdAt={order.createdAt}
              orderId={order._id}
              onCancelled={() => setCancelled(true)}
            />
          )}

          <div className="text-center mt-8">
            <Link href="/" style={{ fontFamily: "var(--font-jost), sans-serif", color: "#8D6E63", fontSize: 14 }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
