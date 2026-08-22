"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      const params = new URLSearchParams(window.location.search);
      const redirect = params.get("redirect") || "/admin";
      // Use full page navigation to ensure cookie is set before middleware runs
      window.location.href = redirect;
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050505] px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Image
            src="/appalachian-logo.png"
            alt="Appalachian Growth"
            width={200}
            height={50}
            className="mb-6 h-12 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
          <p className="mt-1 text-sm text-neutral-500">
            Sign in to manage your website
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-[rgba(182,255,0,0.1)] bg-[#0A0A0A] p-8"
        >
          {error && (
            <div className="mb-4 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label className="mb-1.5 block text-sm font-medium text-neutral-400">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@appalachian.com"
              className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#B6FF00] focus:outline-none focus:ring-1 focus:ring-[#B6FF00]/30"
            />
          </div>

          <div className="mb-6">
            <label className="mb-1.5 block text-sm font-medium text-neutral-400">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="w-full rounded-lg border border-[rgba(255,255,255,0.1)] bg-[#111] px-4 py-3 text-sm text-white placeholder:text-neutral-600 focus:border-[#B6FF00] focus:outline-none focus:ring-1 focus:ring-[#B6FF00]/30"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#B6FF00] py-3 text-sm font-semibold text-[#050505] transition-all hover:bg-[#a3e600] hover:shadow-[0_0_20px_rgba(182,255,0,0.3)] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-neutral-600">
          Appalachian Growth Solutions — Admin
        </p>
      </div>
    </div>
  );
}
