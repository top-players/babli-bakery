"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm]         = useState({ username: "", password: "" });
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const [checking, setChecking] = useState(true);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    let mounted = true;
    const timeout = setTimeout(() => {
      if (mounted) setChecking(false);
    }, 2000);

    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (!mounted) return;
        clearTimeout(timeout);
        if (data.authenticated) {
          router.replace("/admin/dashboard");
        } else {
          setChecking(false);
        }
      })
      .catch(() => {
        if (mounted) {
          clearTimeout(timeout);
          setChecking(false);
        }
      });

    return () => {
      mounted = false;
      clearTimeout(timeout);
    };
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!form.username.trim() || !form.password.trim()) {
      setError("Please enter username and password");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed"); return; }
      router.push("/admin/dashboard");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gold-500/30 border-t-gold-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400 text-sm font-medium">Checking admin session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-dark-900 checkered-bg opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-br from-black via-dark-800 to-black" />

      {/* Glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl" />

      <div className="relative z-10 w-full max-w-md animate-slide-up">
        {/* Card */}
        <div className="card-dark p-10 rounded-3xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="w-20 h-20 rounded-full border-2 border-gold-500 flex items-center justify-center bg-dark-700 mx-auto mb-4 shadow-[0_0_30px_rgba(212,175,55,0.4)]">
              <span className="text-4xl">🔐</span>
            </div>
            <h1 className="font-playfair font-bold text-3xl gold-gradient-text">
              Owner Login
            </h1>
            <p className="text-gray-500 text-sm mt-2">Babli Bakery Admin Dashboard</p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm text-center">
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Username</label>
              <input
                id="username"
                type="text"
                className="input-dark"
                placeholder="Enter username"
                autoComplete="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <div className="relative">
                <input
                  id="password"
                  type={showPass ? "text" : "password"}
                  className="input-dark pr-12"
                  placeholder="Enter password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-400 transition-colors"
                >
                  {showPass ? "🙈" : "👁️"}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-4 rounded-xl text-base disabled:opacity-50 mt-4"
            >
              {loading ? "Logging in..." : "🔓 Login to Dashboard"}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <Link href="/" className="text-gray-600 hover:text-gold-400 text-sm transition-colors">
              ← Back to Website
            </Link>
          </div>
        </div>

        {/* Setup hint */}
        <p className="text-center text-gray-700 text-xs mt-4">
          First time? Visit{" "}
          <code className="text-gold-500/60">/api/seed-admin?key=babli-setup-2024</code>{" "}
          to create admin account
        </p>
      </div>
    </div>
  );
}
