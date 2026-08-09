"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingCart, ChefHat, ShieldCheck } from "lucide-react";
import { useCart } from "./CartContext";

const NAV_LINKS = [
  { href: "/",        label: "Home"    },
  { href: "/menu",    label: "Menu"    },
  { href: "/about",   label: "About"   },
  { href: "/reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const pathname  = usePathname();
  const { totalItems } = useCart();

  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const isActive  = (href: string) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isHero    = pathname === "/";
  const isDark    = scrolled || !isHero || menuOpen;

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0,   opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.25,0.46,0.45,0.94] }}
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
        style={{
          background: isDark
            ? "rgba(255,248,240,0.95)"
            : "transparent",
          backdropFilter: isDark ? "blur(16px)" : "none",
          boxShadow: isDark ? "0 2px 24px rgba(62,39,35,0.08)" : "none",
          borderBottom: isDark ? "1px solid rgba(224,207,194,0.5)" : "none",
        }}
      >
        <div className="container">
          <div className="flex items-center justify-between" style={{ height: 72 }}>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: isDark
                    ? "linear-gradient(135deg,#3E2723,#5D4037)"
                    : "rgba(255,255,255,0.15)",
                  border: isDark ? "none" : "1px solid rgba(255,255,255,0.3)",
                  boxShadow: isDark ? "0 2px 12px rgba(62,39,35,0.2)" : "none",
                }}
              >
                <ChefHat size={19} style={{ color: isDark ? "#D4A24C" : "white" }} />
              </div>
              <div>
                <div
                  className="font-serif font-bold text-[19px] leading-tight"
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    color: isDark ? "#2B1810" : "white",
                    letterSpacing: "0.01em",
                  }}
                >
                  Babli Bakery
                </div>
                <div
                  className="text-[9px] tracking-[0.22em] uppercase"
                  style={{ color: isDark ? "#B8892E" : "rgba(240,192,112,0.8)" }}
                >
                  &amp; Pizza Point
                </div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 text-sm font-medium rounded-full transition-all duration-200"
                  style={{
                    fontFamily: "var(--font-jost), sans-serif",
                    letterSpacing: "0.03em",
                    color: isActive(link.href)
                      ? (isDark ? "#2B1810" : "white")
                      : (isDark ? "#5D4037" : "rgba(255,255,255,0.75)"),
                    background: isActive(link.href)
                      ? (isDark ? "rgba(212,162,76,0.12)" : "rgba(255,255,255,0.15)")
                      : "transparent",
                  }}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="nav-dot"
                      className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                      style={{ background: "#D4A24C" }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right: Admin + Cart + CTA + Hamburger */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Admin Login Corner Button */}
              <Link
                href="/admin/login"
                className="px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 text-xs font-semibold"
                style={{
                  color: isDark ? "#2B1810" : "white",
                  background: isDark ? "rgba(212,162,76,0.15)" : "rgba(255,255,255,0.18)",
                  border: isDark ? "1px solid rgba(212,162,76,0.3)" : "1px solid rgba(255,255,255,0.3)",
                }}
                title="Owner / Admin Login"
              >
                <ShieldCheck size={15} style={{ color: "#D4A24C" }} />
                <span className="hidden sm:inline" style={{ fontFamily: "var(--font-jost), sans-serif" }}>Admin</span>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="relative p-2.5 rounded-full transition-all"
                style={{ color: isDark ? "#5D4037" : "white" }}
                aria-label="Cart"
              >
                <ShoppingCart size={20} />
                <AnimatePresence>
                  {totalItems > 0 && (
                    <motion.div
                      key={totalItems}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", damping: 15, stiffness: 400 }}
                      className="absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white"
                      style={{ background: "#D4A24C" }}
                    >
                      {totalItems > 9 ? "9+" : totalItems}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>

              {/* CTA desktop */}
              <Link
                href="/menu"
                className="hidden md:inline-flex btn-gold text-sm px-5 py-2.5"
                style={{ fontSize: 13 }}
              >
                Order Now
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMenuOpen((o) => !o)}
                className="md:hidden p-2.5 rounded-full transition-all"
                style={{ color: isDark ? "#3E2723" : "white" }}
                aria-label="Menu"
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={menuOpen ? "x" : "m"}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0,   opacity: 1 }}
                    exit={{    rotate: 90,  opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {menuOpen ? <X size={22} /> : <Menu size={22} />}
                  </motion.div>
                </AnimatePresence>
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{    opacity: 0, y: -16 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-x-0 top-[72px] z-40 md:hidden"
            style={{
              background: "rgba(255,248,240,0.98)",
              backdropFilter: "blur(20px)",
              borderBottom: "1px solid rgba(224,207,194,0.4)",
              boxShadow: "0 12px 40px rgba(62,39,35,0.1)",
            }}
          >
            <div className="container py-5 space-y-1">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={link.href}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-medium transition-all"
                    style={{
                      fontFamily: "var(--font-jost), sans-serif",
                      color: isActive(link.href) ? "#2B1810" : "#5D4037",
                      background: isActive(link.href) ? "rgba(212,162,76,0.1)" : "transparent",
                      borderLeft: isActive(link.href) ? "3px solid #D4A24C" : "3px solid transparent",
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-4 border-t" style={{ borderColor: "rgba(224,207,194,0.5)" }}>
                <Link href="/menu" className="btn-gold w-full">
                  Order Now 🍕
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setMenuOpen(false)}
            className="fixed inset-0 z-30 md:hidden"
            style={{ background: "rgba(43,24,16,0.2)" }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
