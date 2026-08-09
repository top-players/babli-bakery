"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import WaveDivider from "@/components/WaveDivider";

const DELIVERY_CHARGE = 0; /* free delivery for now */

export default function CartPage() {
  const { items, removeItem, updateQty, totalAmount, totalItems } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-[72px] flex items-center justify-center bg-mesh-cream texture-bg">
        <motion.div
          className="text-center max-w-md px-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="text-7xl mb-6"
          >
            🛒
          </motion.div>
          <h1 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "2.5rem", fontWeight: 700, color: "#2B1810", marginBottom: 12 }}>
            Your Cart is Empty
          </h1>
          <p style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037", lineHeight: 1.7, marginBottom: 32 }}>
            Browse our menu and add your favourite items — fresh pizza, shakes, burgers &amp; more!
          </p>
          <Link href="/menu" className="btn-gold" style={{ fontSize: 15 }}>
            View Menu <ArrowRight size={18} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[72px] bg-mesh-cream texture-bg">
      <div className="container section-sm">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="section-label" style={{ fontFamily: "var(--font-jost), sans-serif" }}>
            <ShoppingCart size={13} /> Your Order
          </span>
          <h1
            className="mt-4"
            style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700, color: "#2B1810" }}
          >
            Cart ({totalItems} item{totalItems !== 1 ? "s" : ""})
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items list */}
          <div className="lg:col-span-2 space-y-4">
            <AnimatePresence>
              {items.map((item, i) => (
                <motion.div
                  key={item.name}
                  layout
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 30, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="glass-card p-5 flex items-center gap-5"
                >
                  {/* Photo Thumbnail */}
                  <div
                    className="w-20 h-20 rounded-2xl overflow-hidden relative flex-shrink-0 bg-stone-900 border border-amber-900/20 shadow-sm"
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        {item.category === "Pizzas" ? "🍕" : item.category === "Burgers" ? "🍔" : item.category === "Coffee & Shakes" ? "🥤" : "🥖"}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "1.15rem", color: "#2B1810" }}>
                      {item.name}
                    </h3>
                    <p style={{ fontFamily: "var(--font-jost), sans-serif", color: "#8D6E63", fontSize: 13 }}>
                      {item.category} · ₹{item.price} each
                    </p>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => updateQty(item.name, item.qty - 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{ background: "#EDE0D4", color: "#5D4037" }}
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "1.2rem", color: "#2B1810", minWidth: 28, textAlign: "center" }}>
                      {item.qty}
                    </span>
                    <button
                      onClick={() => updateQty(item.name, item.qty + 1)}
                      className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      style={{ background: "#3E2723", color: "white" }}
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Total + remove */}
                  <div className="flex-shrink-0 text-right">
                    <div
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        fontSize: "1.3rem",
                        fontWeight: 700,
                        background: "linear-gradient(135deg,#D4A24C,#B8892E)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      ₹{item.price * item.qty}
                    </div>
                    <button
                      onClick={() => removeItem(item.name)}
                      className="mt-1 text-xs flex items-center gap-1 transition-colors"
                      style={{ color: "#BCAAA4", fontFamily: "var(--font-jost), sans-serif" }}
                      onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "#DC2626"}
                      onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "#BCAAA4"}
                    >
                      <Trash2 size={12} /> Remove
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              href="/menu"
              className="inline-flex items-center gap-2 text-sm transition-colors mt-2"
              style={{ fontFamily: "var(--font-jost), sans-serif", color: "#B8892E" }}
            >
              ← Add more items
            </Link>
          </div>

          {/* Order summary */}
          <div>
            <motion.div
              className="glass-card p-7 sticky top-24"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <h3
                style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.4rem", fontWeight: 700, color: "#2B1810", marginBottom: 20 }}
              >
                Order Summary
              </h3>

              <div className="space-y-3 mb-5">
                {items.map((item) => (
                  <div key={item.name} className="flex justify-between text-sm">
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037" }}>
                      {item.name} × {item.qty}
                    </span>
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", color: "#2B1810", fontWeight: 600 }}>
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}
              </div>

              <div
                className="my-5"
                style={{ borderTop: "1px dashed rgba(212,162,76,0.3)" }}
              />

              <div className="flex justify-between mb-2">
                <span style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037", fontSize: 14 }}>Subtotal</span>
                <span style={{ fontFamily: "var(--font-jost), sans-serif", fontWeight: 600, color: "#2B1810" }}>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between mb-5">
                <span style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037", fontSize: 14 }}>Delivery</span>
                <span style={{ fontFamily: "var(--font-jost), sans-serif", fontWeight: 600, color: "#2E7D32", fontSize: 13 }}>
                  {DELIVERY_CHARGE === 0 ? "FREE" : `₹${DELIVERY_CHARGE}`}
                </span>
              </div>

              <div
                className="flex justify-between items-baseline py-4 mb-6"
                style={{ borderTop: "2px solid rgba(212,162,76,0.25)" }}
              >
                <span style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "1.1rem", color: "#2B1810" }}>
                  Grand Total
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    fontWeight: 700,
                    fontSize: "1.8rem",
                    background: "linear-gradient(135deg,#D4A24C,#B8892E)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ₹{totalAmount + DELIVERY_CHARGE}
                </span>
              </div>

              {/* COD badge */}
              <div
                className="flex items-center gap-2 p-3 rounded-xl mb-5 text-sm"
                style={{ background: "rgba(212,162,76,0.08)", border: "1px solid rgba(212,162,76,0.2)", fontFamily: "var(--font-jost), sans-serif", color: "#5D4037" }}
              >
                💵 <span>Payment: <strong style={{ color: "#2B1810" }}>Cash on Delivery</strong></span>
              </div>

              <Link href="/checkout" className="btn-gold w-full" style={{ fontSize: 15 }}>
                Proceed to Checkout <ArrowRight size={18} />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
