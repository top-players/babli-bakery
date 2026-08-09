"use client";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { useCart } from "./CartContext";
import { useState } from "react";

import Image from "next/image";

interface QuickViewProps {
  item: { name: string; price: number; originalPrice?: number; category: string; desc?: string; image?: string; emoji?: string } | null;
  onClose: () => void;
}

export default function QuickViewModal({ item, onClose }: QuickViewProps) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!item) return null;

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) {
      addItem({ name: item.name, price: item.price, originalPrice: item.originalPrice, category: item.category, image: item.image });
    }
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      setQty(1);
      onClose();
    }, 800);
  };

  return (
    <AnimatePresence>
      {item && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-[101] flex items-center justify-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl"
              initial={{ scale: 0.85, y: 30, opacity: 0 }}
              animate={{ scale: 1,    y: 0,  opacity: 1 }}
              exit={{    scale: 0.85, y: 30, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top image header */}
              <div
                className="h-48 relative overflow-hidden flex items-center justify-center bg-stone-900"
              >
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <span className="text-7xl drop-shadow-lg">
                    {item.emoji || "🍕"}
                  </span>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/90 hover:bg-black/60 transition-colors z-10"
                >
                  <X size={18} />
                </button>
                {/* Category badge */}
                <div className="absolute bottom-4 left-6 z-10">
                  <span className="text-xs font-semibold tracking-widest uppercase bg-amber-400/90 text-stone-900 px-3 py-1 rounded-full shadow">
                    {item.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-7">
                <h3 className="font-serif font-bold text-2xl text-stone-800 mb-1">
                  {item.name}
                </h3>
                <p className="text-stone-500 text-sm mb-5 leading-relaxed">
                  {item.desc || "Fresh & hot — prepared with premium ingredients."}
                </p>

                {/* Price */}
                <div className="flex items-baseline gap-2 mb-6">
                  <span
                    className="font-serif font-bold text-3xl text-transparent bg-clip-text"
                    style={{ backgroundImage: "linear-gradient(135deg, #D4A24C, #B8892E)" }}
                  >
                    ₹{item.price}
                  </span>
                  {item.originalPrice && (
                    <span className="text-stone-400 line-through text-lg font-serif">
                      ₹{item.originalPrice}
                    </span>
                  )}
                  <span className="text-stone-400 text-xs ml-auto">per item</span>
                </div>

                {/* Quantity selector */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-stone-500 text-sm font-medium">Quantity</span>
                  <div className="flex items-center bg-stone-100 rounded-full overflow-hidden">
                    <button
                      onClick={() => setQty(Math.max(1, qty - 1))}
                      className="w-10 h-10 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="w-10 text-center font-semibold text-stone-800">{qty}</span>
                    <button
                      onClick={() => setQty(qty + 1)}
                      className="w-10 h-10 flex items-center justify-center text-stone-500 hover:bg-stone-200 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="text-stone-400 text-sm ml-auto font-medium">
                    Total: ₹{item.price * qty}
                  </span>
                </div>

                {/* Add to cart */}
                <motion.button
                  onClick={handleAdd}
                  disabled={added}
                  className="w-full py-4 rounded-2xl font-semibold text-base flex items-center justify-center gap-2 transition-all duration-300"
                  style={{
                    background: added
                      ? "linear-gradient(135deg, #4CAF50, #66BB6A)"
                      : "linear-gradient(135deg, #3E2723, #5D4037)",
                    color: "white",
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <AnimatePresence mode="wait">
                    {added ? (
                      <motion.span
                        key="done"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={20} /> Added to Cart!
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingCart size={18} /> Add to Cart — ₹{item.price * qty}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
