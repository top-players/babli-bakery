"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";
import { Heart } from "lucide-react";
import WaveDivider from "@/components/WaveDivider";

const inView = (i = 0) => ({
  initial: { opacity: 0, y: 36 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.1, ease: "easeOut" as const } },
  viewport: { once: true as const },
});

export default function AboutPage() {
  return (
    <div className="overflow-x-hidden pt-[72px]">

      {/* Hero */}
      <section className="relative h-72 sm:h-96 overflow-hidden">
        <Image
          src="/images/interior-golden.jpg" alt="Babli Bakery interior" fill className="object-cover" priority
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
            (e.currentTarget.parentElement as HTMLElement).style.background = "linear-gradient(135deg,#2B1810,#3E2723)";
          }}
        />
        <div className="absolute inset-0" style={{ background: "rgba(43,24,16,0.72)" }} />
        <div className="relative z-10 h-full flex items-end container pb-12">
          <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <span className="section-label section-label-light mb-4 inline-flex" style={{ fontFamily: "var(--font-jost), sans-serif" }}>Our Story</span>
            <h1 className="mt-3" style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, fontSize: "clamp(2.2rem,6vw,4rem)", color: "white", lineHeight: 1.1 }}>
              About Babli Bakery
            </h1>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="section bg-mesh-cream texture-bg">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
            <motion.div
              className="relative rounded-3xl overflow-hidden"
              style={{ height: 480 }}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0, transition: { duration: 0.7 } }}
              viewport={{ once: true }}
            >
              <Image
                src="/images/entrance.jpg" alt="Babli Bakery entrance" fill className="object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                  (e.currentTarget.parentElement as HTMLElement).style.background = "linear-gradient(135deg,#3E2723,#5D4037)";
                  (e.currentTarget.parentElement as HTMLElement).innerHTML += '<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:6rem">🍕</div>';
                }}
              />
              <motion.div
                className="absolute -bottom-5 -right-5 bg-white rounded-2xl p-5 shadow-[0_8px_40px_rgba(62,39,35,0.15)]"
                style={{ maxWidth: 200 }}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1, transition: { delay: 0.4, duration: 0.5 } }}
                viewport={{ once: true }}
              >
                <p style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", color: "#5D4037", fontSize: "1.1rem", lineHeight: 1.5 }}>Good Food,<br />Good Mood ♥</p>
                <div className="mt-2 h-0.5 w-10 rounded" style={{ background: "#D4A24C" }} />
              </motion.div>
            </motion.div>

            {/* Text */}
            <div>
              <motion.div {...inView(0)}>
                <span className="section-label" style={{ fontFamily: "var(--font-jost), sans-serif" }}>Est. in Muzaffarnagar</span>
              </motion.div>
              <motion.h2
                {...inView(1)}
                style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(2rem,5vw,3.5rem)", fontWeight: 700, color: "#2B1810", lineHeight: 1.15, margin: "24px 0 20px" }}
              >
                Born from <em style={{ color: "#D4A24C" }}>Passion</em>
              </motion.h2>
              <div className="gold-line-left mb-8" />
              <motion.div {...inView(2)} className="space-y-5" style={{ color: "#5D4037", lineHeight: 1.8, fontFamily: "var(--font-jost), sans-serif", fontSize: 15 }}>
                <p><strong style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "1.1rem", color: "#2B1810" }}>Babli Bakery and Pizza Point</strong> started with a simple dream — to serve Muzaffarnagar&apos;s finest, freshest food with a smile and a warm heart.</p>
                <p>Nestled on Jansath Road in Village Sikhera, we&apos;ve grown from a small neighbourhood bakery into one of the most loved food spots in the area — thanks to our amazing customers and our commitment to quality.</p>
                <p>Every pizza we bake, every shake we blend, every burger we grill — done with care, pride, and a genuine love for great food. That&apos;s the Babli Bakery promise.</p>
              </motion.div>
              <motion.div {...inView(3)} className="grid grid-cols-2 gap-4 mt-8">
                {[
                  { icon: "🌿", label: "100% Fresh"       },
                  { icon: "👨‍🍳", label: "Skilled Chefs"    },
                  { icon: "🚀", label: "Fast Service"     },
                  { icon: "❤️",  label: "Made with Love"  },
                ].map((f) => (
                  <div key={f.label} className="flex items-center gap-3 rounded-xl p-4" style={{ background: "rgba(212,162,76,0.08)", border: "1px solid rgba(212,162,76,0.15)" }}>
                    <span className="text-2xl">{f.icon}</span>
                    <span style={{ fontFamily: "var(--font-jost), sans-serif", fontWeight: 600, color: "#5D4037", fontSize: 13 }}>{f.label}</span>
                  </div>
                ))}
              </motion.div>
              <motion.div {...inView(4)} className="mt-8">
                <Link href="/menu" className="btn-gold">Explore Our Menu <ArrowRight size={18} /></Link>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <WaveDivider color="#F5E6C8" />

      {/* Gallery */}
      <section className="section-sm" style={{ background: "linear-gradient(180deg,#F5E6C8,#FFF8F0)" }}>
        <div className="container">
          <motion.div className="text-center mb-12" {...inView()}>
            <span className="section-label" style={{ fontFamily: "var(--font-jost), sans-serif" }}>Our Space</span>
            <h2 className="mt-5" style={{ fontFamily: "var(--font-cormorant), serif", fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 700, color: "#2B1810" }}>
              Inside Babli Bakery
            </h2>
          </motion.div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { src: "/images/interior-golden.jpg", alt: "Golden interior" },
              { src: "/images/interior-purple.jpg", alt: "Purple interior" },
              { src: "/images/entrance.jpg",         alt: "Entrance"        },
              { src: "/images/logo-circle.jpg",      alt: "Babli logo"      },
            ].map((img, i) => (
              <motion.div
                key={img.src}
                className="relative rounded-xl overflow-hidden group cursor-pointer"
                style={{ height: 200 }}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1, transition: { delay: i * 0.1, duration: 0.5 } }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.03 }}
              >
                <Image src={img.src} alt={img.alt} fill className="object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                    (e.currentTarget.parentElement as HTMLElement).style.background = ["linear-gradient(135deg,#3E2723,#5D4037)","linear-gradient(135deg,#4a2040,#8D6E63)","linear-gradient(135deg,#5D4037,#8D6E63)","linear-gradient(135deg,#B8892E,#D4A24C)"][i];
                  }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <WaveDivider color="#3E2723" />

      {/* Mission */}
      <section className="section bg-mesh-dark texture-bg text-center relative overflow-hidden">
        <div className="container-sm relative z-10">
          <motion.div {...inView()}>
            <Heart size={40} style={{ color: "#D4A24C", margin: "0 auto 24px" }} />
            <h2 style={{ fontFamily: "var(--font-cormorant), serif", fontWeight: 700, color: "white", fontSize: "clamp(2rem,5vw,3.5rem)", marginBottom: 24, lineHeight: 1.2 }}>
              Our Mission
            </h2>
            <p style={{ fontFamily: "var(--font-jost), sans-serif", color: "rgba(255,255,255,0.6)", fontSize: "1.1rem", lineHeight: 1.8, marginBottom: 36 }}>
              To bring <em style={{ color: "#D4A24C", fontFamily: "var(--font-cormorant), serif", fontSize: "1.2em" }}>joy, flavour, and warmth</em> to every customer who walks through our door — one delicious bite at a time.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/contact" className="btn-gold"><MapPin size={18} /> Find Us</Link>
              <Link href="/reviews" className="btn-outline-light">Read Reviews</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
