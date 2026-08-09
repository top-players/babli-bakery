"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { ShieldCheck, Lock, ArrowRight, ChevronDown, ChevronUp } from "lucide-react";

interface FormData {
  customerName: string;
  phone: string;
  address: string;
}

interface FormErrors {
  customerName?: string;
  phone?: string;
  address?: string;
}



interface FieldProps {
  label: string;
  id: keyof FormData;
  value: string;
  error?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  type?: string;
  as?: "textarea";
}

function Field({
  label, id, value, error, onChange, placeholder, type = "text", as,
}: FieldProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-sm font-semibold mb-2"
        style={{ fontFamily: "var(--font-jost), sans-serif", color: "#4E342E" }}
      >
        {label} *
      </label>
      {as === "textarea" ? (
        <textarea
          id={id}
          name={id}
          className="input-field resize-none"
          rows={3}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ borderColor: error ? "#DC2626" : "" }}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          className="input-field"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{ borderColor: error ? "#DC2626" : "" }}
        />
      )}
      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0, y: -4 }}
            animate={{ opacity: 1, height: "auto", y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs mt-1.5"
            style={{ color: "#DC2626", fontFamily: "var(--font-jost), sans-serif" }}
          >
            ⚠ {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalAmount, clearCart } = useCart();
  const [form, setForm]         = useState<FormData>({ customerName: "", phone: "", address: "" });
  const [errors, setErrors]     = useState<FormErrors>({});
  const [placing, setPlacing]   = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);

  const validate = (): boolean => {
    const e: FormErrors = {};
    if (!form.customerName.trim()) e.customerName = "Please enter your name";
    if (!form.phone.trim())        e.phone = "Phone number is required";
    else if (!/^[6-9]\d{9}$/.test(form.phone.trim())) e.phone = "Enter a valid 10-digit Indian mobile number";
    if (!form.address.trim())      e.address = "Delivery address is required";
    else if (form.address.trim().length < 15) e.address = "Please enter a more detailed address";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    if (items.length === 0) { alert("Your cart is empty!"); return; }

    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: form.customerName.trim(),
          phone:        form.phone.trim(),
          address:      form.address.trim(),
          items:        items.map((i) => ({ name: i.name, price: i.price, qty: i.qty })),
          totalAmount:  totalAmount,
          paymentMode:  "Cash on Delivery",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Order failed");

      clearCart();
      router.push(`/order-confirmation/${data.order._id}`);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const val = e.target.value;
    setForm((p) => ({ ...p, [field]: val }));
    setErrors((p) => ({ ...p, [field]: undefined }));
  };

  return (
    <div className="min-h-screen pt-[72px] bg-mesh-cream texture-bg">
      <div className="container section-sm">
        {/* Header */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="section-label" style={{ fontFamily: "var(--font-jost), sans-serif" }}>
            <Lock size={12} /> Secure Checkout
          </span>
          <h1 className="mt-4" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700, color: "#2B1810" }}>
            Complete Your Order
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">

          {/* Form — 3 cols */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass-card p-8 space-y-6">
              <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.5rem", fontWeight: 700, color: "#2B1810" }}>
                Delivery Details
              </h2>

              <Field
                label="Full Name" id="customerName" value={form.customerName} error={errors.customerName}
                onChange={handleInputChange("customerName")}
                placeholder="e.g. Rahul Sharma"
              />
              <Field
                label="Mobile Number" id="phone" value={form.phone} error={errors.phone}
                onChange={handleInputChange("phone")}
                placeholder="10-digit number (e.g. 9876543210)" type="tel"
              />
              <Field
                label="Delivery Address" id="address" value={form.address} error={errors.address}
                onChange={handleInputChange("address")}
                placeholder="House no, Street, Village/Mohalla, Landmark..." as="textarea"
              />

              {/* Payment mode */}
              <div
                className="rounded-2xl p-5"
                style={{ background: "linear-gradient(135deg,rgba(212,162,76,0.08),rgba(240,192,112,0.06))", border: "1px solid rgba(212,162,76,0.25)" }}
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0" style={{ borderColor: "#D4A24C" }}>
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#D4A24C" }} />
                  </div>
                  <span style={{ fontFamily: "var(--font-jost), sans-serif", fontWeight: 700, color: "#2B1810" }}>
                    Cash on Delivery (COD)
                  </span>
                </div>
                <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 13, color: "#5D4037", paddingLeft: 32 }}>
                  💵 Pay cash at the time of delivery. No online payment required.
                </p>
              </div>

              <motion.button
                type="submit"
                disabled={placing}
                className="btn-gold w-full"
                style={{ fontSize: 15, padding: "16px 32px" }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                {placing ? (
                  <span className="flex items-center gap-2 justify-center">
                    <span className="w-4 h-4 rounded-full border-2 border-brown-800/30 border-t-brown-800 animate-spin" />
                    Placing Order...
                  </span>
                ) : (
                  <span className="flex items-center gap-2 justify-center">
                    <ShieldCheck size={18} /> Confirm Order — ₹{totalAmount}
                  </span>
                )}
              </motion.button>
            </form>
          </motion.div>

          {/* Summary — 2 cols */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="glass-card p-7 sticky top-24">
              {/* Mobile toggle */}
              <button
                className="flex items-center justify-between w-full lg:cursor-default"
                onClick={() => setSummaryOpen((o) => !o)}
                type="button"
              >
                <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.4rem", fontWeight: 700, color: "#2B1810" }}>
                  Order Summary
                </h3>
                <span className="lg:hidden" style={{ color: "#D4A24C" }}>
                  {summaryOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
              </button>

              <div className={`mt-5 space-y-3 ${summaryOpen || "hidden lg:block"}`}>
                {items.map((item) => (
                  <div key={item.name} className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm" style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037" }}>
                      <span style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, color: "#D4A24C", minWidth: 24 }}>
                        ×{item.qty}
                      </span>
                      {item.name}
                    </span>
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", fontWeight: 600, color: "#2B1810", fontSize: 13 }}>
                      ₹{item.price * item.qty}
                    </span>
                  </div>
                ))}

                <div style={{ borderTop: "1px dashed rgba(212,162,76,0.3)", paddingTop: 16, marginTop: 16 }}>
                  <div className="flex justify-between mb-2 text-sm">
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037" }}>Subtotal</span>
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", fontWeight: 600, color: "#2B1810" }}>₹{totalAmount}</span>
                  </div>
                  <div className="flex justify-between mb-4 text-sm">
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037" }}>Delivery</span>
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", fontWeight: 600, color: "#2E7D32" }}>FREE</span>
                  </div>
                  <div
                    className="flex justify-between items-baseline pt-4"
                    style={{ borderTop: "2px solid rgba(212,162,76,0.25)" }}
                  >
                    <span style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "1rem", color: "#2B1810" }}>Total</span>
                    <span style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "1.7rem", background: "linear-gradient(135deg,#D4A24C,#B8892E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                      ₹{totalAmount}
                    </span>
                  </div>
                </div>

                <div
                  className="flex items-center gap-2 p-3 rounded-xl text-xs mt-4"
                  style={{ background: "rgba(46,125,50,0.06)", border: "1px solid rgba(46,125,50,0.2)", fontFamily: "var(--font-jost), sans-serif", color: "#2E7D32" }}
                >
                  ✅ No online payment needed. Pay cash on delivery!
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
