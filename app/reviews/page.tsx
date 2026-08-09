"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star } from "lucide-react";

interface Review {
  _id?: string;
  name: string;
  rating: number;
  comment: string;
  date?: string;
  createdAt?: string;
}

const inView = (i = 0) => ({
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0, transition: { duration: 0.5, delay: i * 0.08, ease: "easeOut" as const } },
  viewport: { once: true },
});

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <motion.button
          key={i}
          type="button"
          whileHover={{ scale: 1.25 }}
          whileTap={{ scale: 0.9 }}
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => onChange(i)}
          className="text-3xl transition-colors duration-150"
          style={{ color: i <= (hovered || value) ? "#D4A24C" : "#D7CCC8" }}
        >
          ★
        </motion.button>
      ))}
    </div>
  );
}

function StarDisplay({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((i) => (
        <Star key={i} size={13} fill={i <= n ? "#D4A24C" : "none"} className={i <= n ? "text-gold-500" : "text-brown-200"} />
      ))}
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-6 space-y-3">
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
      <div className="flex items-center gap-3 pt-2 border-t border-cream-200">
        <div className="skeleton w-9 h-9 rounded-full" />
        <div className="space-y-1">
          <div className="skeleton h-3 w-24 rounded" />
          <div className="skeleton h-2.5 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}

export default function ReviewsPage() {
  const [reviews, setReviews]     = useState<Review[]>([]);
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm]           = useState({ name: "", rating: 5, comment: "" });
  const [error, setError]         = useState("");

  useEffect(() => {
    fetch("/api/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .catch(() => setReviews([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.name.trim())                { setError("Please enter your name");              return; }
    if (!form.comment.trim())             { setError("Please write your review");            return; }
    if (form.comment.trim().length < 10)  { setError("Review must be at least 10 characters"); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setReviews((p) => [data.review, ...p]);
      setForm({ name: "", rating: 5, comment: "" });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
    } catch { setError("Something went wrong. Please try again."); }
    finally { setSubmitting(false); }
  };

  const avg = reviews.length
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "5.0";

  const ratingCounts = [5,4,3,2,1].map((n) => ({
    n,
    count: reviews.filter((r) => r.rating === n).length,
    pct: reviews.length ? (reviews.filter((r) => r.rating === n).length / reviews.length) * 100 : 0,
  }));

  return (
    <div className="overflow-x-hidden pt-20">

      {/* Header */}
      <section className="section-sm bg-cream-200">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-label">Customer Reviews</span>
            <h1 className="heading-display text-4xl sm:text-5xl mt-5 mb-4">
              What Our Guests <em>Say</em>
            </h1>
            <div className="center-divider text-gold-500 text-lg">✦</div>
            <p className="body-text mt-4 max-w-xl mx-auto">
              Real reviews from real people. Your feedback helps us improve and
              grow. Thank you for sharing! 🙏
            </p>
          </motion.div>
        </div>
      </section>

      <section className="section bg-cream-100">
        <div className="container">

          {/* Rating summary */}
          {reviews.length > 0 && (
            <motion.div
              className="card p-8 mb-12 flex flex-col sm:flex-row items-center gap-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center flex-shrink-0">
                <div className="font-playfair font-black text-7xl text-brown-700 leading-none">{avg}</div>
                <StarDisplay n={Math.round(Number(avg))} />
                <p className="text-brown-300 text-sm mt-2">{reviews.length} review{reviews.length !== 1 ? "s" : ""}</p>
              </div>
              <div className="flex-1 w-full space-y-2.5">
                {ratingCounts.map(({ n, count, pct }) => (
                  <div key={n} className="flex items-center gap-3">
                    <span className="text-brown-500 text-sm font-medium w-3">{n}</span>
                    <Star size={13} fill="#D4A24C" className="text-gold-500 flex-shrink-0" />
                    <div className="flex-1 h-2 bg-cream-300 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gold-500 rounded-full"
                        initial={{ width: 0 }}
                        whileInView={{ width: `${pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: (5 - n) * 0.1 }}
                      />
                    </div>
                    <span className="text-brown-300 text-sm w-5 text-right">{count}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

            {/* Form */}
            <div className="lg:col-span-2">
              <motion.div
                className="card p-8 sticky top-28"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="font-playfair font-bold text-2xl text-brown-700 mb-6">
                  Share Your Experience
                </h2>

                <AnimatePresence>
                  {submitted && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-5 p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2"
                    >
                      🎉 Thank you for your review!
                    </motion.div>
                  )}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mb-5 p-4 bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl"
                    >
                      ⚠️ {error}
                    </motion.div>
                  )}
                </AnimatePresence>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-semibold text-brown-600 mb-2">Your Name *</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="e.g. Rahul Sharma"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      maxLength={50}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brown-600 mb-3">Your Rating *</label>
                    <StarPicker value={form.rating} onChange={(v) => setForm({ ...form, rating: v })} />
                    <p className="text-gold-600 text-xs mt-2 font-medium">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent! 🌟"][form.rating]}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-brown-600 mb-2">Your Review *</label>
                    <textarea
                      className="input-field resize-none"
                      rows={4}
                      placeholder="Tell us about your experience..."
                      value={form.comment}
                      onChange={(e) => setForm({ ...form, comment: e.target.value })}
                      maxLength={500}
                    />
                    <p className="text-brown-300 text-xs mt-1 text-right">{form.comment.length}/500</p>
                  </div>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-primary w-full justify-center py-4 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </span>
                    ) : "⭐ Submit Review"}
                  </motion.button>
                </form>
              </motion.div>
            </div>

            {/* Reviews list */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map((i) => <SkeletonCard key={i} />)}
                </div>
              ) : reviews.length === 0 ? (
                <motion.div
                  className="card p-16 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="text-5xl mb-4">🌟</div>
                  <p className="text-brown-400 text-lg">No reviews yet.</p>
                  <p className="body-text text-sm mt-2">Be the first to share your experience!</p>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review, i) => (
                    <motion.div
                      key={review._id || i}
                      className="card p-6"
                      {...inView(i)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-cream-200 border border-cream-300 flex items-center justify-center text-brown-600 font-bold font-playfair text-sm flex-shrink-0">
                            {review.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-brown-700 font-semibold text-sm">{review.name}</p>
                            <p className="text-brown-300 text-xs">
                              {review.date || (review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })
                                : "Recently")}
                            </p>
                          </div>
                        </div>
                        <StarDisplay n={review.rating} />
                      </div>
                      <p className="body-text text-sm leading-relaxed italic">
                        &ldquo;{review.comment}&rdquo;
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
