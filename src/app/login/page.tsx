"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") ?? "/staff/orders";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const usernameRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    usernameRef.current?.focus();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        setError(data.error ?? "Đăng nhập thất bại");
        return;
      }

      router.push(from);
      router.refresh();
    } catch {
      setError("Lỗi mạng. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center px-6">
      {/* Card */}
      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="text-center mb-10">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 lacquer-gradient rounded-2xl mb-6 shadow-lg shadow-primary/20">
            <span className="material-symbols-outlined text-on-primary text-3xl">
              restaurant_menu
            </span>
          </div> */}
          <h1 className="font-headline text-2xl text-primary font-bold">
            Hủ Tiếu Ngọc Mai
          </h1>
          <p className="text-on-surface-variant text-sm mt-2">
            Nhân viên &amp; Chủ quán
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-error-container/30 border border-error/20 text-error rounded-xl px-4 py-3 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Username */}
          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold block mb-2">
              Tên đăng nhập
            </label>
            <input
              ref={usernameRef}
              type="text"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 font-body text-on-surface transition-colors outline-none"
              placeholder="ngocmai"
            />
          </div>

          {/* Password */}
          <div>
            <label className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant font-semibold block mb-2">
              Mật khẩu
            </label>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-surface-container-low border-0 border-b-2 border-outline-variant focus:border-primary focus:ring-0 rounded-t-lg px-4 py-3 font-body text-on-surface transition-colors outline-none"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full lacquer-gradient text-on-primary py-4 rounded-xl font-body font-semibold tracking-wide hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Đang xác thực…
              </>
            ) : (
              <>
                <span className="material-symbols-outlined text-sm">lock_open</span>
                Đăng nhập
              </>
            )}
          </button>
        </form>

        <p className="text-center text-on-surface-variant text-xs mt-8">
          <a href="/" className="hover:text-primary transition-colors">
            ← Về trang chủ
          </a>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
