"use client";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

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
  deliveryConfirmedByCustomer: boolean;
  createdAt: string;
}

const STEPS = ["Pending", "Preparing", "Out for Delivery", "Delivered"];

const stepIcons: Record<string, string> = {
  "Pending":          "⏳",
  "Preparing":        "👨‍🍳",
  "Out for Delivery": "🛵",
  "Delivered":        "✅",
};

export default function TrackOrderPage() {
  const { id }                      = useParams<{ id: string }>();
  const [order, setOrder]           = useState<Order | null>(null);
  const [loading, setLoading]       = useState(true);
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed]   = useState(false);
  const [error, setError]           = useState("");

  const fetchOrder = useCallback(async () => {
    try {
      const res  = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (res.ok) setOrder(data.order);
      else        setError("Order not found. Please check your tracking ID.");
    } catch {
      setError("Failed to load order. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  /* Poll every 30 seconds for status updates */
  useEffect(() => {
    const t = setInterval(fetchOrder, 30000);
    return () => clearInterval(t);
  }, [fetchOrder]);

  const confirmDelivery = async () => {
    setConfirming(true);
    try {
      const res = await fetch(`/api/orders/${id}/confirm`, { method: "POST" });
      if (res.ok) {
        setConfirmed(true);
        fetchOrder();
      }
    } catch { /* silently handle */ }
    finally { setConfirming(false); }
  };

  const currentStep = order ? STEPS.indexOf(order.status) : -1;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl animate-float">📦</div>
          <p className="text-gray-400 mt-4">Fetching your order...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center card-dark p-12 rounded-2xl max-w-md">
          <div className="text-5xl mb-4">😕</div>
          <p className="text-red-400 mb-4">{error}</p>
          <Link href="/" className="btn-gold px-8 py-3 rounded-xl inline-block">← Home</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <span className="section-tag">Order Tracking</span>
          <h1 className="font-playfair font-bold text-4xl mt-6 mb-2">
            Track Your <span className="gold-gradient-text">Order</span>
          </h1>
          <p className="text-gray-500 text-sm">ID: #{order.trackingId?.slice(0, 8)}</p>
        </div>

        {/* Status Progress */}
        <div className="card-dark p-8 rounded-2xl mb-6">
          <div className="relative">
            {/* Progress line */}
            <div className="absolute top-6 left-6 right-6 h-0.5 bg-dark-400" />
            <div
              className="absolute top-6 left-6 h-0.5 bg-gold-gradient transition-all duration-700"
              style={{
                width: currentStep <= 0 ? "0%" :
                  currentStep === 1 ? "33%" :
                  currentStep === 2 ? "66%" : "100%",
              }}
            />

            {/* Steps */}
            <div className="relative flex justify-between">
              {STEPS.map((step, i) => {
                const isDone   = i < currentStep;
                const isActive = i === currentStep;
                return (
                  <div key={step} className="flex flex-col items-center gap-3 w-1/4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold z-10 transition-all duration-500 border-2 ${
                        isDone   ? "step-done border-green-500 shadow-[0_0_15px_rgba(76,175,80,0.5)]" :
                        isActive ? "step-active border-gold-500 shadow-[0_0_15px_rgba(212,175,55,0.5)] animate-glow-pulse" :
                                   "step-inactive border-dark-300"
                      }`}
                    >
                      {stepIcons[step]}
                    </div>
                    <div className="text-center">
                      <p className={`text-xs font-medium ${
                        isActive ? "text-gold-400" : isDone ? "text-green-400" : "text-gray-600"
                      }`}>
                        {step}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Current status message */}
          <div className="mt-8 p-4 bg-dark-600 rounded-xl text-center">
            {order.status === "Pending" && (
              <p className="text-yellow-400">🕐 Your order has been placed! We&apos;ll start preparing it soon.</p>
            )}
            {order.status === "Preparing" && (
              <p className="text-orange-400">👨‍🍳 Your food is being freshly prepared with love!</p>
            )}
            {order.status === "Out for Delivery" && (
              <p className="text-blue-400">🛵 Your order is on the way! Should arrive shortly.</p>
            )}
            {order.status === "Delivered" && !order.deliveryConfirmedByCustomer && (
              <p className="text-green-400">📦 Your order has been delivered! Please confirm below.</p>
            )}
            {(order.status === "Delivered - Confirmed" || (order.status === "Delivered" && order.deliveryConfirmedByCustomer)) && (
              <p className="text-green-400">✅ Delivery confirmed! Thank you for ordering from Babli Bakery! ♥</p>
            )}
          </div>
        </div>

        {/* Confirm delivery button */}
        {order.status === "Delivered" && !order.deliveryConfirmedByCustomer && !confirmed && (
          <div className="card-dark p-6 rounded-2xl mb-6 text-center border border-green-500/20">
            <p className="text-gray-300 mb-4">Did you receive your order?</p>
            <button
              onClick={confirmDelivery}
              disabled={confirming}
              className="btn-gold px-10 py-4 rounded-xl text-base disabled:opacity-50"
            >
              {confirming ? "Confirming..." : "✅ Yes, I Received My Order"}
            </button>
          </div>
        )}

        {/* Order details */}
        <div className="card-dark p-6 rounded-2xl mb-6">
          <h3 className="font-playfair text-xl text-gold-400 mb-4">Order Details</h3>
          <div className="space-y-2 mb-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center text-sm">
                <span className="text-gray-300">
                  {item.name} <span className="text-gray-500">× {item.qty}</span>
                </span>
                <span className="text-gold-400">₹{item.price * item.qty}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-3 flex justify-between font-bold">
            <span className="text-white">Total</span>
            <span className="neon-gold font-playfair text-xl">₹{order.totalAmount}</span>
          </div>
        </div>

        {/* Customer info */}
        <div className="card-dark p-6 rounded-2xl">
          <h3 className="font-playfair text-xl text-gold-400 mb-4">Delivery Info</h3>
          <div className="space-y-3 text-sm">
            <div className="flex gap-3">
              <span className="text-gray-500">👤</span>
              <span className="text-gray-300">{order.customerName}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-500">📞</span>
              <span className="text-gray-300">{order.phone}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-500">📍</span>
              <span className="text-gray-300">{order.address}</span>
            </div>
            <div className="flex gap-3">
              <span className="text-gray-500">💳</span>
              <span className="text-gray-300">{order.paymentMode}</span>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-gray-500 hover:text-gold-400 transition-colors text-sm">
            ← Back to Babli Bakery
          </Link>
        </div>
      </div>
    </div>
  );
}
