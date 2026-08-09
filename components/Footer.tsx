"use client";
import Link from "next/link";
import { MapPin, Phone, Clock, ChefHat } from "lucide-react";
import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer style={{ background: "linear-gradient(135deg,#2B1810 0%,#3E2723 100%)", color: "white", paddingTop: 64, paddingBottom: 32 }}>
      <div className="container">

        {/* Gold top border */}
        <div
          className="mb-12"
          style={{ height: 1, background: "linear-gradient(90deg,transparent,rgba(212,162,76,0.5),transparent)" }}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">

          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center"
                style={{ background: "rgba(212,162,76,0.15)", border: "1px solid rgba(212,162,76,0.3)" }}
              >
                <ChefHat size={20} style={{ color: "#D4A24C" }} />
              </div>
              <div>
                <div style={{ fontFamily: "var(--font-cormorant), Georgia, serif", fontWeight: 700, fontSize: "1.25rem", color: "white", letterSpacing: "0.01em" }}>
                  Babli Bakery
                </div>
                <div style={{ fontSize: 9, letterSpacing: "0.22em", textTransform: "uppercase", color: "rgba(212,162,76,0.6)" }}>
                  &amp; Pizza Point
                </div>
              </div>
            </div>
            <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.8, marginBottom: 20 }}>
              Muzaffarnagar&apos;s favourite neighbourhood bakery and pizza point — serving hot &amp; fresh food with love since day one.
            </p>
            <div style={{ fontFamily: "var(--font-cormorant), serif", fontStyle: "italic", fontSize: "1.2rem", color: "#D4A24C" }}>
              Baked with love ♥
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4
              className="mb-6 pb-3 relative"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "white",
                borderBottom: "1px solid rgba(212,162,76,0.2)",
              }}
            >
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { href: "/",            label: "Home"         },
                { href: "/menu",        label: "Menu"         },
                { href: "/about",       label: "About Us"     },
                { href: "/reviews",     label: "Reviews"      },
                { href: "/contact",     label: "Contact"      },
                { href: "/cart",        label: "Cart"         },
                { href: "/admin/login", label: "Owner Login"  },
              ].map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    style={{
                      fontFamily: "var(--font-jost), sans-serif",
                      fontSize: 14,
                      color: "rgba(255,255,255,0.45)",
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      transition: "color 0.2s",
                    }}
                    onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.color = "#D4A24C"}
                    onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.45)"}
                  >
                    <span style={{ width: 4, height: 4, borderRadius: "50%", background: "rgba(212,162,76,0.4)", display: "inline-block" }} />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4
              className="mb-6 pb-3"
              style={{
                fontFamily: "var(--font-cormorant), serif",
                fontWeight: 700,
                fontSize: "1.2rem",
                color: "white",
                borderBottom: "1px solid rgba(212,162,76,0.2)",
              }}
            >
              Contact Us
            </h4>
            <ul className="space-y-4">
              {[
                {
                  icon: <MapPin size={15} style={{ color: "#D4A24C", marginTop: 2, flexShrink: 0 }} />,
                  content: <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                    Muzaffarnagar Jansath Road,<br />Village Sikhera, Near Canara Bank
                  </p>
                },
                {
                  icon: <Phone size={15} style={{ color: "#D4A24C", flexShrink: 0 }} />,
                  content: <div>
                    <a href="tel:8077466148" style={{ display: "block", fontFamily: "var(--font-jost), sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}>80774 66148</a>
                    <a href="tel:8077894865" style={{ display: "block", fontFamily: "var(--font-jost), sans-serif", fontSize: 14, color: "rgba(255,255,255,0.5)", textDecoration: "none", transition: "color 0.2s" }}>8077894865</a>
                  </div>
                },
                {
                  icon: <Clock size={15} style={{ color: "#D4A24C", flexShrink: 0 }} />,
                  content: <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 14, color: "rgba(255,255,255,0.45)" }}>Mon – Sun: 10:00 AM – 11:00 PM</p>
                },
              ].map((item, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                  {item.icon}
                  {item.content}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Babli Bakery and Pizza Point. All rights reserved.
          </p>
          <p style={{ fontFamily: "var(--font-jost), sans-serif", fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
            Made with ❤️ in Muzaffarnagar
          </p>
        </div>
      </div>
    </footer>
  );
}
