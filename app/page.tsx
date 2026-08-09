"use client";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowRight, Star, MapPin, Phone, Clock, ChevronDown } from "lucide-react";
import WaveDivider from "@/components/WaveDivider";
import CounterAnimation from "@/components/CounterAnimation";

/* ── Helper to create inline whileInView props ── */
const inView = (i = 0) => ({
  initial: { opacity: 0, y: 48 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.12, ease: "easeOut" as const } },
  viewport: { once: true },
});
const staggerContainer = { visible: { transition: { staggerChildren: 0.1 } } };

/* ── Word-by-word text reveal ── */
function WordReveal({ text, className = "", delay = 0 }: { text: string; className?: string; delay?: number }) {
  const words = text.split(" ");
  return (
    <span className={className} style={{ display: "inline-block" }}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          variants={{
            hidden:  { opacity: 0, y: 30, filter: "blur(4px)" },
            visible: { opacity: 1, y: 0,  filter: "blur(0px)",
              transition: { duration: 0.6, delay: delay + i * 0.08, ease: [0.25,0.46,0.45,0.94] } },
          }}
          style={{ display: "inline-block", marginRight: "0.25em" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}

/* ── Sample reviews ── */
const REVIEWS = [
  { name: "Rahul Sharma",  rating: 5, comment: "Best pizza in Muzaffarnagar! The cheese burst is absolutely legendary 🔥" },
  { name: "Priya Singh",   rating: 5, comment: "Loved the cold coffee and burgers. The aesthetic is perfect!"             },
  { name: "Amit Kumar",    rating: 5, comment: "Oreo shake is a must try. Fast service, great taste. 10/10!"              },
  { name: "Sneha Gupta",   rating: 5, comment: "Custom cake was stunning! Kids loved the chocolate burst flavour ♥"       },
];

const WHY_US = [
  { icon: "🌿", title: "100% Fresh Daily",    desc: "Every item made fresh each morning — no frozen shortcuts, ever."       },
  { icon: "🔥", title: "Hot & Fast Delivery", desc: "Your food arrives hot. We respect your hunger and your time."          },
  { icon: "⭐", title: "Premium Ingredients", desc: "We use only quality ingredients in every pizza, burger, and shake."     },
  { icon: "❤️", title: "Made with Love",      desc: "Every dish crafted with genuine passion. You can taste the difference." },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  /* Ken Burns — very slow zoom */
  const heroScale   = useTransform(scrollYProgress, [0, 1], [1.08, 1.18]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const heroY       = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  const [reviewIdx, setReviewIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setReviewIdx((i) => (i + 1) % REVIEWS.length), 4500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO — Ken Burns + word-by-word reveal
      ══════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex items-center overflow-hidden"
        style={{ minHeight: "100svh" }}
      >
        {/* Parallax BG image — Ken Burns */}
        <motion.div
          style={{ scale: heroScale, y: heroY }}
          className="absolute inset-0 origin-center"
        >
          <Image
            src="/images/interior-golden.jpg"
            alt="Babli Bakery warm interior"
            fill className="object-cover" priority
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
              (e.currentTarget.parentElement as HTMLElement).style.background =
                "linear-gradient(135deg,#2B1810 0%,#3E2723 50%,#2B1810 100%)";
            }}
          />
          {/* Layered overlay */}
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to right, rgba(43,24,16,0.93) 0%, rgba(43,24,16,0.75) 55%, rgba(43,24,16,0.25) 100%)",
          }} />
          <div className="absolute inset-0" style={{
            background: "linear-gradient(to top, rgba(43,24,16,0.7) 0%, transparent 50%)",
          }} />
        </motion.div>

        {/* Gold radial glow */}
        <div className="absolute top-1/3 left-1/4 w-96 h-96 rounded-full pointer-events-none opacity-10"
          style={{ background: "radial-gradient(circle, #D4A24C, transparent 70%)", filter: "blur(40px)" }}
        />

        {/* Hero content */}
        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 container"
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-2xl pt-24"
          >
            {/* Label */}
            <motion.div variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}>
              <span
                className="section-label section-label-light inline-flex mb-8"
                style={{ fontFamily: "var(--font-jost), sans-serif" }}
              >
                ✦ Muzaffarnagar&apos;s Favourite Since Day One
              </span>
            </motion.div>

            {/* Heading — word reveal */}
            <motion.h1
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="mb-3 leading-[1.02]"
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(3.5rem, 9vw, 7rem)",
                fontWeight: 700,
                color: "white",
              }}
            >
              <WordReveal text="Babli Bakery" delay={0.1} />
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.24 }}
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontSize: "clamp(1.5rem, 4vw, 2.25rem)",
                fontStyle: "italic",
                color: "#D4A24C",
                marginBottom: "1.5rem",
                letterSpacing: "0.01em",
              }}
            >
              &amp; Pizza Point
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.36 }}
              style={{
                fontFamily: "var(--font-jost), sans-serif",
                color: "rgba(255,255,255,0.68)",
                fontSize: "1.15rem",
                lineHeight: 1.75,
                maxWidth: "520px",
                marginBottom: "2.5rem",
              }}
            >
              Hot fresh pizza, juicy burgers, thick shakes and premium coffee —
              all{" "}
              <em style={{ color: "#F0C070", fontStyle: "italic", fontFamily: "var(--font-cormorant), serif" }}>
                baked with love ♥
              </em>
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.48 }} className="flex flex-wrap gap-4">
              <Link href="/menu" className="btn-gold" style={{ padding: "15px 36px", fontSize: 15 }}>
                Explore Menu <ArrowRight size={18} />
              </Link>
              <Link href="/contact" className="btn-outline-light" style={{ padding: "14px 32px", fontSize: 15 }}>
                📍 Find Us
              </Link>
            </motion.div>

            {/* Info pills */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.6 }} className="flex flex-wrap gap-3 mt-10">
              {[
                { icon: <MapPin size={13} />, text: "Village Sikhera, Muzaffarnagar" },
                { icon: <Phone size={13} />,  text: "80774 66148"                    },
                { icon: <Clock size={13} />,  text: "10 AM – 11 PM Daily"            },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-2 text-xs"
                  style={{
                    color: "rgba(255,255,255,0.55)",
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(8px)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "100px",
                    padding: "7px 14px",
                    fontFamily: "var(--font-jost), sans-serif",
                  }}
                >
                  <span style={{ color: "#D4A24C" }}>{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jost), sans-serif" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8 }}
        >
          <span className="text-[9px] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.div>
      </section>

      {/* ══════════════════════════════════════════
          ANIMATED STATS STRIP
      ══════════════════════════════════════════ */}
      <section style={{ background: "linear-gradient(135deg,#2B1810,#3E2723)", padding: "28px 0" }}>
        <div className="container">
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {[
              { end: 500, suffix: "+", label: "Happy Customers" },
              { end: 49,  suffix: "★", label: "Avg Rating / 50" },
              { end: 6,   suffix: "",  label: "Pizza Varieties"  },
              { end: 7,   suffix: "",  label: "Shake Flavours"   },
              { end: 5,   suffix: "+", label: "Years of Love"    },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div
                  className="font-serif font-bold text-3xl text-gold-foil"
                  style={{
                    fontFamily: "var(--font-cormorant), serif",
                    background: "linear-gradient(135deg,#D4A24C,#F0C070,#D4A24C)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  <CounterAnimation end={s.end} suffix={s.suffix} />
                </div>
                <div
                  className="text-xs uppercase tracking-[0.2em] mt-1"
                  style={{ color: "rgba(255,255,255,0.4)", fontFamily: "var(--font-jost), sans-serif" }}
                >
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider color="#FFF8F0" />

      {/* ══════════════════════════════════════════
          GALLERY — 3 images with hover reveal
      ══════════════════════════════════════════ */}
      <section className="section texture-bg bg-mesh-cream">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            {...inView()}
          >
            <span className="section-label" style={{ fontFamily: "var(--font-jost), sans-serif" }}>Our Space</span>
            <h2
              className="mt-5 mb-4"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "clamp(2.2rem,5vw,3.5rem)",
                fontWeight: 700,
                color: "#2B1810",
                lineHeight: 1.15,
              }}
            >
              A Place You&apos;ll <em style={{ color: "#D4A24C" }}>Love</em>
            </h2>
            <div className="center-divider" style={{ color: "#D4A24C" }}>✦</div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { src: "/images/interior-golden.jpg", label: "Warm Golden Interiors", span: "md:col-span-2 lg:col-span-2", h: 360 },
              { src: "/images/interior-purple.jpg", label: "Neon Purple Vibe",    span: "md:col-span-1 lg:col-span-1", h: 360 },
              { src: "/images/entrance.jpg",        label: "Good Food Entrance",  span: "md:col-span-1 lg:col-span-1", h: 360 },
            ].map((img, i) => (
              <motion.div
                key={img.src}
                className={`relative overflow-hidden rounded-3xl group cursor-pointer ${img.span}`}
                style={{ minHeight: img.h }}
                initial={{ opacity: 0, scale: 0.93 }}
                whileInView={{ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.6 } }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.01 }}
              >
                <Image
                  src={img.src} alt={img.label} fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                  sizes="(max-width:768px) 100vw, 50vw"
                />
                {/* Hover overlay */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{ background: "linear-gradient(to top,rgba(43,24,16,0.7),transparent)" }}
                />
                <motion.div
                  className="absolute bottom-5 left-5 opacity-0 group-hover:opacity-100 translate-y-3 group-hover:translate-y-0 transition-all duration-300"
                >
                  <span
                    className="text-white text-sm font-medium px-3 py-1.5 rounded-full"
                    style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", fontFamily: "var(--font-jost), sans-serif" }}
                  >
                    {img.label}
                  </span>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider color="#F5E6C8" />

      {/* ══════════════════════════════════════════
          WHY CHOOSE US — glassmorphism cards
      ══════════════════════════════════════════ */}
      <section className="section" style={{ background: "linear-gradient(180deg,#F5E6C8,#FFF8F0)" }}>
        <div className="container">
          <motion.div
            className="text-center mb-16"
            {...inView()}
          >
            <span className="section-label" style={{ fontFamily: "var(--font-jost), sans-serif" }}>Why Choose Us</span>
            <h2
              className="mt-5 mb-4"
              style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2.2rem,5vw,3.5rem)", fontWeight: 700, color: "#2B1810", lineHeight: 1.15 }}
            >
              What Makes Us <em style={{ color: "#D4A24C" }}>Special</em>
            </h2>
            <div className="center-divider" style={{ color: "#D4A24C" }}>✦</div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_US.map((item, i) => (
              <motion.div
                key={item.title}
                className="glass-card p-8 text-center group cursor-default"
                {...inView(i)}
                whileHover={{ y: -8, boxShadow: "0 24px 64px rgba(62,39,35,0.12)" }}
                transition={{ type: "spring", damping: 20, stiffness: 250 }}
              >
                <div className="text-5xl mb-5 group-hover:scale-110 transition-transform duration-300 inline-block">
                  {item.icon}
                </div>
                <h3
                  className="text-lg mb-3"
                  style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, color: "#2B1810" }}
                >
                  {item.title}
                </h3>
                <p style={{ color: "#5D4037", fontSize: 14, lineHeight: 1.7, fontFamily: "var(--font-jost), sans-serif" }}>
                  {item.desc}
                </p>
                {/* Gold bottom accent */}
                <div
                  className="mt-5 mx-auto opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ width: 32, height: 2, background: "linear-gradient(90deg,transparent,#D4A24C,transparent)" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider color="#3E2723" />

      {/* ══════════════════════════════════════════
          MENU TEASER — dark bg, gold text
      ══════════════════════════════════════════ */}
      <section className="section bg-mesh-dark texture-bg relative overflow-hidden">
        <div className="container relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden" whileInView="visible" viewport={{ once: true }}
            >
              <motion.div {...inView()}>
                <span className="section-label section-label-light" style={{ fontFamily: "var(--font-jost), sans-serif" }}>
                  Our Menu
                </span>
              </motion.div>
              <motion.h2
                {...inView(1)}
                style={{
                  fontFamily: "var(--font-cormorant), serif",
                  fontSize: "clamp(2.4rem,5vw,3.8rem)",
                  fontWeight: 700,
                  color: "white",
                  lineHeight: 1.15,
                  margin: "24px 0",
                }}
              >
                Pizza · Burgers ·<br />
                <em style={{ color: "#D4A24C" }}>Shakes & More</em>
              </motion.h2>
              <motion.p
                {...inView(2)}
                style={{ color: "rgba(255,255,255,0.6)", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: 32, fontFamily: "var(--font-jost), sans-serif" }}
              >
                6 pizza varieties, 5 burgers, 7 shake flavours, premium coffees,
                and custom cakes made to your order. Tap any item to add to cart!
              </motion.p>
              <motion.div {...inView(3)} className="flex flex-wrap gap-4">
                <Link href="/menu" className="btn-gold" style={{ padding: "15px 36px", fontSize: 15 }}>
                  View Full Menu <ArrowRight size={18} />
                </Link>
              </motion.div>
            </motion.div>

            {/* Menu preview cards */}
            <motion.div
              className="grid grid-cols-2 gap-3"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              {[
                { name: "Regular Combo", price: 150, category: "Special Combos", image: "/images/menu/regular-combo.jpg" },
                { name: "Paneer Burger", price: 70,  category: "Burgers", image: "/images/menu/paneer-burger.jpg" },
                { name: "Babli Special Pizza", price: 80, category: "Pizzas", image: "/images/menu/babli-special-pizza.jpg" },
                { name: "Cold Coffee", price: 69, category: "Coffee & Shakes", image: "/images/menu/cold-coffee.jpg" },
              ].map((item) => (
                <Link
                  key={item.name}
                  href="/menu"
                  style={{
                    background: "rgba(255,255,255,0.06)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(212,162,76,0.18)",
                    borderRadius: 20,
                    overflow: "hidden",
                    textDecoration: "none",
                    transition: "all 0.3s",
                  }}
                  className="group hover:border-amber-400 flex flex-col"
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(212,162,76,0.1)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,162,76,0.4)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.06)";
                    (e.currentTarget as HTMLElement).style.borderColor = "rgba(212,162,76,0.18)";
                    (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  }}
                >
                  <div className="h-28 relative overflow-hidden bg-stone-900">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <span className="absolute bottom-2 left-3 text-[10px] uppercase font-bold tracking-wider text-amber-300">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-3">
                    <div
                      className="font-semibold text-xs text-white mb-1 truncate"
                      style={{ fontFamily: "var(--font-jost), sans-serif" }}
                    >
                      {item.name}
                    </div>
                    <div
                      className="font-bold text-base"
                      style={{
                        fontFamily: "var(--font-cormorant), serif",
                        background: "linear-gradient(135deg,#D4A24C,#F0C070)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      ₹{item.price}
                    </div>
                  </div>
                </Link>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <WaveDivider color="#FFF8F0" flip />

      {/* ══════════════════════════════════════════
          REVIEWS CAROUSEL — glassmorphism
      ══════════════════════════════════════════ */}
      <section className="section bg-mesh-cream texture-bg">
        <div className="container">
          <motion.div
            className="text-center mb-16"
            {...inView()}
          >
            <span className="section-label" style={{ fontFamily: "var(--font-jost), sans-serif" }}>Customer Love</span>
            <h2 className="mt-5 mb-4" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2.2rem,5vw,3.5rem)", fontWeight: 700, color: "#2B1810", lineHeight: 1.15 }}>
              What People <em style={{ color: "#D4A24C" }}>Say</em>
            </h2>
            <div className="center-divider" style={{ color: "#D4A24C" }}>✦</div>
          </motion.div>

          <div className="max-w-2xl mx-auto mb-12">
            <div className="relative overflow-hidden" style={{ minHeight: 200 }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={reviewIdx}
                  initial={{ opacity: 0, x: 60, filter: "blur(4px)" }}
                  animate={{ opacity: 1, x: 0,  filter: "blur(0px)" }}
                  exit={{    opacity: 0, x: -60, filter: "blur(4px)" }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="glass-card p-10 text-center"
                >
                  <div className="flex justify-center gap-0.5 mb-5">
                    {[1,2,3,4,5].map((s) => (
                      <Star key={s} size={16} fill={s <= REVIEWS[reviewIdx].rating ? "#D4A24C" : "none"}
                        style={{ color: s <= REVIEWS[reviewIdx].rating ? "#D4A24C" : "#E0CFC2" }} />
                    ))}
                  </div>
                  <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", color: "#4E342E", fontSize: "1.25rem", lineHeight: 1.7, marginBottom: 28 }}>
                    &ldquo;{REVIEWS[reviewIdx].comment}&rdquo;
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold"
                      style={{ background: "#EDE0D4", color: "#5D4037", fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem" }}
                    >
                      {REVIEWS[reviewIdx].name.charAt(0)}
                    </div>
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", fontWeight: 600, color: "#2B1810" }}>
                      {REVIEWS[reviewIdx].name}
                    </span>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setReviewIdx(i)}
                  className="rounded-full transition-all duration-300"
                  style={{
                    width: i === reviewIdx ? 24 : 8,
                    height: 8,
                    background: i === reviewIdx ? "#D4A24C" : "#D7CCC8",
                  }}
                />
              ))}
            </div>
          </div>

          <div className="text-center">
            <Link href="/reviews" className="btn-primary">
              Read All Reviews <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <WaveDivider color="#D4A24C" />

      {/* ══════════════════════════════════════════
          CTA BANNER — gold bg
      ══════════════════════════════════════════ */}
      <section
        className="section-sm text-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg,#D4A24C,#F0C070,#D4A24C)", backgroundSize: "300% auto" }}
      >
        <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full opacity-20 pointer-events-none"
          style={{ background: "rgba(255,255,255,0.5)", filter: "blur(40px)" }}
        />
        <div className="container relative z-10">
          <motion.div
            {...inView()}
          >
            <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", color: "rgba(43,24,16,0.65)", fontSize: "1.3rem", marginBottom: 8 }}>
              Hungry? We&apos;ve got you covered!
            </p>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "clamp(2rem,5vw,3.5rem)", color: "#2B1810", lineHeight: 1.2, marginBottom: 28 }}>
              Village Sikhera, Muzaffarnagar
            </h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <a href="tel:8077466148" className="btn-primary" style={{ background: "#2B1810", borderColor: "#2B1810", fontSize: 15 }}>
                📞 Call to Order
              </a>
              <Link href="/menu" className="btn-outline" style={{ borderColor: "#2B1810", color: "#2B1810", fontSize: 15 }}>
                View Full Menu <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
