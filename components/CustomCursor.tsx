"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function CustomCursor() {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [hovering, setHovering] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    /* hide on touch devices */
    if (typeof window !== "undefined" && "ontouchstart" in window) return;
    setVisible(true);

    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const over = () => setHovering(true);
    const out  = () => setHovering(false);

    window.addEventListener("mousemove", move, { passive: true });

    const addListeners = () => {
      document.querySelectorAll("a, button, [role='button'], .cursor-pointer, input, textarea, select").forEach((el) => {
        el.addEventListener("mouseenter", over);
        el.addEventListener("mouseleave", out);
      });
    };

    addListeners();
    const observer = new MutationObserver(addListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, []);

  if (!visible) return null;

  return (
    <>
      {/* Main dot */}
      <motion.div
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
        animate={{
          x: pos.x - (hovering ? 20 : 6),
          y: pos.y - (hovering ? 20 : 6),
          width: hovering ? 40 : 12,
          height: hovering ? 40 : 12,
        }}
        transition={{ type: "spring", damping: 25, stiffness: 400, mass: 0.3 }}
        style={{
          borderRadius: "50%",
          background: hovering ? "rgba(212,162,76,0.15)" : "#D4A24C",
          border: hovering ? "1.5px solid rgba(212,162,76,0.6)" : "none",
        }}
      />
      {/* Trail ring */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none"
        animate={{
          x: pos.x - 18,
          y: pos.y - 18,
          opacity: hovering ? 0 : 0.3,
        }}
        transition={{ type: "spring", damping: 20, stiffness: 200, mass: 0.5 }}
        style={{
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1px solid rgba(212,162,76,0.4)",
        }}
      />
      <style jsx global>{`
        @media (hover: hover) {
          * { cursor: none !important; }
        }
        @media (hover: none) {
          .custom-cursor { display: none !important; }
        }
      `}</style>
    </>
  );
}
