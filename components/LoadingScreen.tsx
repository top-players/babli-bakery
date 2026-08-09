"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function LoadingScreen() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setShow(false), 1600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[10000] flex flex-col items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #2B1810 0%, #3E2723 40%, #2B1810 100%)",
          }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {/* Gold radial glow behind */}
          <div className="absolute w-80 h-80 rounded-full opacity-15 pointer-events-none"
            style={{ background: "radial-gradient(circle, #D4A24C 0%, transparent 70%)" }}
          />

          {/* Logo reveal */}
          <motion.div
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={{ opacity: 1, y: 0,  filter: "blur(0px)" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative z-10 text-center"
          >
            <div className="text-5xl mb-4">🍕</div>
            <h1
              className="font-serif font-bold text-4xl text-transparent bg-clip-text mb-2"
              style={{ backgroundImage: "linear-gradient(135deg, #D4A24C, #F0C070, #D4A24C)" }}
            >
              Babli Bakery
            </h1>
            <p className="text-amber-600/60 text-xs tracking-[0.3em] uppercase">
              & Pizza Point
            </p>
          </motion.div>

          {/* Elegant progress bar */}
          <motion.div
            className="mt-10 w-40 h-0.5 rounded-full overflow-hidden bg-amber-900/30 relative z-10"
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: "linear-gradient(90deg, #D4A24C, #F0C070)" }}
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.3, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
