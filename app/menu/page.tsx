"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, ArrowRight, Sparkles, Star, Tag } from "lucide-react";
import Link from "next/link";
import QuickViewModal from "@/components/QuickViewModal";
import { useCart } from "@/components/CartContext";
import WaveDivider from "@/components/WaveDivider";
import { MENU_CATEGORIES, MenuItem } from "@/lib/menuData";

const inView = (i = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.55, delay: i * 0.05, ease: "easeOut" as const } },
  viewport: { once: true as const },
});

/* ── 3D Tilt card with Image ── */
function TiltCard({ item, onQuickView, justAdded }: {
  item: MenuItem;
  onQuickView: (i: MenuItem) => void;
  justAdded: boolean;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rotY = ((e.clientX - cx) / (rect.width  / 2)) * 6;
    const rotX = ((e.clientY - cy) / (rect.height / 2)) * -6;
    setTilt({ x: rotX, y: rotY });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      className="relative rounded-3xl overflow-hidden cursor-pointer group flex flex-col h-full bg-white"
      style={{
        boxShadow: "0 4px 20px rgba(62,39,35,0.07), 0 12px 36px rgba(62,39,35,0.05)",
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: "transform 0.15s ease, box-shadow 0.3s ease",
        border: "1px solid rgba(212,162,76,0.18)",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      whileHover={{ boxShadow: "0 18px 50px rgba(62,39,35,0.15)" }}
      onClick={() => onQuickView(item)}
    >
      {/* Food Photo Header */}
      <div className="h-44 relative overflow-hidden bg-stone-900">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover group-hover:scale-108 transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {/* Subtle overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        {/* Popular Badge */}
        {item.isPopular && (
          <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
            <Star size={11} className="fill-stone-950" /> Bestseller
          </div>
        )}

        {/* Combo Discount Badge */}
        {item.originalPrice && (
          <div className="absolute top-3 right-3 bg-red-600 text-white font-bold text-[10px] tracking-wider px-2 py-1 rounded-full flex items-center gap-1 shadow-md z-10">
            <Tag size={10} /> SAVE ₹{item.originalPrice - item.price}
          </div>
        )}

        {/* Quick view hint */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="text-white text-xs font-medium bg-black/50 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg" style={{ fontFamily: "var(--font-jost), sans-serif" }}>
            Tap to view details
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-1">
            <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.2rem", fontWeight: 700, color: "#2B1810", lineHeight: 1.25 }}>
              {item.name}
            </h3>
          </div>
          <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 13, color: "#795548", lineHeight: 1.5, marginBottom: 14, minHeight: 38 }} className="line-clamp-2">
            {item.desc}
          </p>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-stone-100">
          <div className="flex items-baseline gap-1.5">
            <span
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "1.45rem",
                fontWeight: 700,
                background: "linear-gradient(135deg,#D4A24C,#B8892E)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ₹{item.price}
            </span>
            {item.originalPrice && (
              <span className="text-stone-400 line-through text-xs font-serif">
                ₹{item.originalPrice}
              </span>
            )}
          </div>

          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              addItem({
                name: item.name,
                price: item.price,
                originalPrice: item.originalPrice,
                category: item.category,
                image: item.image,
              });
            }}
            className="flex items-center gap-1.5 text-xs font-semibold rounded-full px-3.5 py-2 transition-all shadow-sm"
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              background: justAdded
                ? "linear-gradient(135deg,#4CAF50,#66BB6A)"
                : "linear-gradient(135deg,#3E2723,#5D4037)",
              color: "white",
            }}
            whileTap={{ scale: 0.92 }}
          >
            {justAdded ? "✓ Added" : <><ShoppingCart size={13} /> Add</>}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function MenuPage() {
  const [activeQuick, setActiveQuick] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const { justAdded } = useCart();

  const filteredCategories = selectedCategory === "All"
    ? MENU_CATEGORIES
    : MENU_CATEGORIES.filter((c) => c.category === selectedCategory);

  return (
    <div className="overflow-x-hidden pt-[72px]">

      {/* Header Banner */}
      <section
        className="section-sm texture-bg relative"
        style={{ background: "linear-gradient(180deg,#F5E6C8,#FFF8F0)" }}
      >
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-center max-w-2xl mx-auto mb-8"
          >
            <span className="section-label" style={{ fontFamily: "var(--font-jost), sans-serif" }}>Authentic Bakery & Fast Food Menu</span>
            <h1
              className="mt-4 mb-3"
              style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2.5rem,6vw,4.2rem)", fontWeight: 700, color: "#2B1810", lineHeight: 1.1 }}
            >
              Fresh Prepared,{" "}
              <em style={{ color: "#D4A24C" }}>Real Prices</em>
            </h1>
            <div className="center-divider" style={{ color: "#D4A24C" }}>✦</div>
            <p className="mt-4" style={{ color: "#5D4037", fontSize: 15, lineHeight: 1.8, fontFamily: "var(--font-jost), sans-serif" }}>
              Explore our full menu featuring special combos, artisan pizzas, juicy burgers, pastas, shakes, and sides! Prepared fresh daily in Village Sikhera.
            </p>
          </motion.div>

          {/* Category Filter Tabs */}
          <motion.div
            className="flex items-center justify-center flex-wrap gap-2 max-w-4xl mx-auto mb-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <button
              onClick={() => setSelectedCategory("All")}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                selectedCategory === "All"
                  ? "bg-amber-600 text-white shadow-md scale-105"
                  : "bg-white/80 text-stone-700 hover:bg-stone-100 border border-stone-200"
              }`}
              style={{ fontFamily: "var(--font-jost), sans-serif" }}
            >
              All Items ({MENU_CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0)})
            </button>

            {MENU_CATEGORIES.map((cat) => (
              <button
                key={cat.category}
                onClick={() => setSelectedCategory(cat.category)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300 flex items-center gap-1.5 ${
                  selectedCategory === cat.category
                    ? "bg-amber-600 text-white shadow-md scale-105"
                    : "bg-white/80 text-stone-700 hover:bg-stone-100 border border-stone-200"
                }`}
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                <span>{cat.emoji}</span>
                <span>{cat.category}</span>
                <span className="text-[10px] opacity-75 font-normal">({cat.items.length})</span>
              </button>
            ))}
          </motion.div>

          {/* Real Menu Board Showcase Card */}
          <motion.div
            className="max-w-4xl mx-auto rounded-3xl overflow-hidden shadow-2xl border"
            style={{ borderColor: "rgba(212,162,76,0.3)", background: "#2B1810" }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 items-center">
              <div className="relative h-56 md:h-72 w-full">
                <Image
                  src="/images/menu-board.jpg"
                  alt="Babli Bakery Neon Menu Board"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-7 text-white">
                <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-3" style={{ background: "rgba(212,162,76,0.15)", color: "#F0C070" }}>
                  <Sparkles size={13} /> Original Bakery Counter Menu
                </div>
                <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.7rem", fontWeight: 700, color: "#D4A24C", marginBottom: 8 }}>
                  Fast Food &amp; Bakery Point
                </h3>
                <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 14, color: "rgba(255,255,255,0.7)", lineHeight: 1.7 }}>
                  Order direct from our outlet menu! All prices and items match our live counter board at Jansath Road, Village Sikhera, Muzaffarnagar.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <WaveDivider color="#FFF8F0" />

      {/* Categories */}
      <section className="section bg-mesh-cream texture-bg min-h-[60vh]">
        <div className="container space-y-16">
          <AnimatePresence mode="wait">
            {filteredCategories.map((cat, ci) => (
              <motion.div
                key={cat.category}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, delay: ci * 0.05 }}
              >
                {/* Category header */}
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl">{cat.emoji}</span>
                  <div>
                    <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 700, color: "#2B1810", lineHeight: 1.1 }}>
                      {cat.category}
                    </h2>
                    <div className="gold-line-left mt-2" />
                  </div>
                  <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(212,162,76,0.3),transparent)" }} />
                  <span style={{ fontFamily: "var(--font-jost), sans-serif", color: "#B8892E", fontSize: 13, fontWeight: 600 }}>
                    {cat.items.length} items
                  </span>
                </div>

                {/* Item grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {cat.items.map((item, ii) => (
                    <motion.div
                      key={item.name}
                      {...inView(ii)}
                      className="h-full"
                    >
                      <TiltCard
                        item={item}
                        onQuickView={setActiveQuick}
                        justAdded={justAdded === item.name}
                      />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Custom Cakes special banner */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="pt-6"
          >
            <div className="flex items-center gap-4 mb-8">
              <span className="text-4xl">🎂</span>
              <div>
                <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", fontWeight: 700, color: "#2B1810" }}>
                  Custom Celebration Cakes
                </h2>
                <div className="gold-line-left mt-2" />
              </div>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg,rgba(212,162,76,0.3),transparent)" }} />
            </div>
            <div
              className="glass-card p-8 md:p-12 text-center"
              style={{ border: "1px solid rgba(212,162,76,0.25)" }}
            >
              <div className="text-6xl mb-4">🎂</div>
              <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "2rem", fontWeight: 700, color: "#2B1810", marginBottom: 12 }}>
                Customized Birthday &amp; Event Cakes
              </h3>
              <p style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037", marginBottom: 24, maxWidth: 520, margin: "0 auto 24px", lineHeight: 1.7 }}>
                Looking for a special birthday cake, wedding cake, or custom design? We bake fresh customized cakes on order with premium chocolate, fresh cream &amp; fruit toppings.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <a href="tel:8077466148" className="btn-primary" style={{ padding: "14px 32px" }}>
                  📞 Call to Order: 80774 66148
                </a>
                <a href="tel:7088889874" className="btn-outline" style={{ padding: "14px 32px", borderColor: "#2B1810", color: "#2B1810" }}>
                  📞 Alt Contact: 70888 89874
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <WaveDivider color="#D4A24C" />

      {/* CTA */}
      <section
        className="section-sm text-center"
        style={{ background: "linear-gradient(135deg,#D4A24C,#F0C070,#D4A24C)" }}
      >
        <div className="container-sm">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "clamp(2rem,5vw,3rem)", color: "#2B1810", marginBottom: 16 }}>
              Done Selecting Your Treats?
            </h2>
            <p style={{ fontFamily: "var(--font-jost), sans-serif", color: "rgba(43,24,16,0.7)", marginBottom: 28 }}>
              Review your items in the cart and place your Cash on Delivery order in seconds!
            </p>
            <Link href="/cart" className="btn-primary" style={{ background: "#2B1810", borderColor: "#2B1810", fontSize: 15, padding: "14px 36px" }}>
              <ShoppingCart size={18} /> View Cart &amp; Checkout <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal item={activeQuick} onClose={() => setActiveQuick(null)} />
    </div>
  );
}
