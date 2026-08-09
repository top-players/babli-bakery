"use client";
import { motion } from "framer-motion";
import { MapPin, Phone, Clock, ArrowRight } from "lucide-react";
import Link from "next/link";
import WaveDivider from "@/components/WaveDivider";

const inView = (i = 0) => ({
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.12, ease: "easeOut" as const } },
  viewport: { once: true as const },
});

export default function ContactPage() {
  return (
    <div className="overflow-x-hidden pt-[72px]">

      {/* Header */}
      <section
        className="section-sm texture-bg"
        style={{ background: "linear-gradient(180deg,#F5E6C8,#FFF8F0)" }}
      >
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label" style={{ fontFamily: "var(--font-jost), sans-serif" }}>Find Us</span>
            <h1
              className="mt-5 mb-4"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontSize: "clamp(2.5rem,6vw,4.5rem)",
                fontWeight: 700,
                color: "#2B1810",
                lineHeight: 1.1,
              }}
            >
              Visit <em style={{ color: "#D4A24C" }}>Babli Bakery</em>
            </h1>
            <div className="center-divider" style={{ color: "#D4A24C" }}>✦</div>
            <p className="mt-4 max-w-xl mx-auto" style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037", fontSize: 15, lineHeight: 1.8 }}>
              Come find us in Village Sikhera — we&apos;re open every day, ready to serve you
              the freshest food in town.
            </p>
          </motion.div>
        </div>
      </section>

      <WaveDivider color="#FFF8F0" />

      {/* Main contact grid */}
      <section className="section bg-mesh-cream texture-bg">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-10 items-start">

            {/* Info cards — 2 col */}
            <div className="lg:col-span-2 space-y-5">
              {/* Address */}
              <motion.div className="glass-card p-7" {...inView(0)}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(212,162,76,0.1)", border: "1px solid rgba(212,162,76,0.15)" }}
                  >
                    <MapPin size={22} style={{ color: "#D4A24C" }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "1.15rem", color: "#2B1810", marginBottom: 8 }}>Address</h3>
                    <p style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037", fontSize: 14, lineHeight: 1.7 }}>
                      Muzaffarnagar Jansath Road,<br />
                      Village Sikhera,<br />
                      Near Canara Bank,<br />
                      Muzaffarnagar, Uttar Pradesh
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Phone */}
              <motion.div className="glass-card p-7" {...inView(1)}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(212,162,76,0.1)", border: "1px solid rgba(212,162,76,0.15)" }}
                  >
                    <Phone size={22} style={{ color: "#D4A24C" }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "1.15rem", color: "#2B1810", marginBottom: 8 }}>Phone</h3>
                    <a href="tel:8077466148" className="block text-base font-medium mb-1" style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037", textDecoration: "none" }}>
                      📞 80774 66148
                    </a>
                    <a href="tel:8077894865" className="block text-base font-medium" style={{ fontFamily: "var(--font-jost), sans-serif", color: "#5D4037", textDecoration: "none" }}>
                      📞 8077894865
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Hours */}
              <motion.div className="glass-card p-7" {...inView(2)}>
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "rgba(212,162,76,0.1)", border: "1px solid rgba(212,162,76,0.15)" }}
                  >
                    <Clock size={22} style={{ color: "#D4A24C" }} />
                  </div>
                  <div>
                    <h3 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "1.15rem", color: "#2B1810", marginBottom: 8 }}>Hours</h3>
                    <div className="space-y-1">
                      <div className="flex justify-between text-sm" style={{ fontFamily: "var(--font-jost), sans-serif" }}>
                        <span style={{ color: "#8D6E63" }}>Monday – Sunday</span>
                        <span style={{ color: "#2E7D32", fontWeight: 600 }}>Open</span>
                      </div>
                      <div className="flex justify-between text-sm" style={{ fontFamily: "var(--font-jost), sans-serif" }}>
                        <span style={{ color: "#8D6E63" }}>Timing</span>
                        <span style={{ color: "#2B1810", fontWeight: 600 }}>10:00 AM – 11:00 PM</span>
                      </div>
                    </div>
                    <div
                      className="mt-3 inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                      style={{ background: "rgba(46,125,50,0.08)", border: "1px solid rgba(46,125,50,0.2)", color: "#2E7D32", fontFamily: "var(--font-jost), sans-serif" }}
                    >
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                      Open Now
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Call CTA */}
              <motion.div {...inView(3)}>
                <a href="tel:8077466148" className="btn-gold w-full justify-center text-base" style={{ padding: "16px 32px" }}>
                  📞 Call Now to Order
                </a>
              </motion.div>
            </div>

            {/* Map — 3 col */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 0.7 } }}
              viewport={{ once: true }}
            >
              <div className="card overflow-hidden rounded-3xl" style={{ height: 500 }}>
                <iframe
                  src="https://maps.google.com/maps?q=Muzaffarnagar+Jansath+road+village+sikhera+near+canara+bank&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: "none" }}
                  allowFullScreen
                  loading="lazy"
                  title="Babli Bakery Location"
                />
              </div>
              <p className="text-xs mt-3 text-center" style={{ fontFamily: "var(--font-jost), sans-serif", color: "#BCAAA4" }}>
                Muzaffarnagar Jansath Road, Village Sikhera, Near Canara Bank
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <WaveDivider color="#3E2723" />

      {/* Bottom CTA */}
      <section className="section-sm bg-mesh-dark text-center">
        <div className="container-sm">
          <motion.div {...inView()}>
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, color: "white", fontSize: "clamp(2rem,5vw,3rem)", marginBottom: 16 }}>
              We&apos;d Love to See You!
            </h2>
            <p style={{ fontFamily: "var(--font-jost), sans-serif", color: "rgba(255,255,255,0.5)", fontSize: "1.05rem", marginBottom: 28 }}>
              Drop by anytime — we&apos;re always open with hot food and warm smiles.
            </p>
            <Link href="/reviews" className="btn-gold" style={{ fontSize: 15 }}>
              Leave a Review <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
