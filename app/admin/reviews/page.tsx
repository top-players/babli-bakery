"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Review {
  _id: string;
  name: string;
  rating: number;
  comment: string;
  approved: boolean;
  createdAt: string;
}

export default function AdminReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/reviews?all=true")
      .then((r) => { if (r.status === 401) router.push("/admin/login"); return r.json(); })
      .then((d) => setReviews(d.reviews || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [router]);

  return (
    <div className="min-h-screen bg-dark-900">
      {/* Header */}
      <header className="bg-dark-800 border-b border-gold-500/20 px-6 py-4 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-gray-500 hover:text-gold-400 transition-colors text-sm">
              ← Dashboard
            </Link>
            <span className="text-gray-600">|</span>
            <span className="font-playfair text-gold-400">Customer Reviews</span>
          </div>
          <span className="text-gray-500 text-sm">{reviews.length} total</span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-playfair font-bold text-3xl gold-gradient-text mb-8">
          Customer Reviews
        </h1>

        {loading ? (
          <div className="text-center py-16">
            <div className="text-4xl animate-float">⭐</div>
            <p className="text-gray-500 mt-4">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="card-dark p-12 text-center">
            <div className="text-5xl mb-4">📝</div>
            <p className="text-gray-400">No reviews yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r._id} className="card-dark p-6 rounded-xl">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/15 border border-gold-500/30 flex items-center justify-center text-gold-400 font-bold">
                      {r.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-white font-semibold">{r.name}</p>
                      <p className="text-gray-600 text-xs">
                        {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[1,2,3,4,5].map((i) => (
                      <span key={i} className={`text-sm ${i <= r.rating ? "star-filled" : "star-empty"}`}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed mt-4 italic">
                  &quot;{r.comment}&quot;
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
