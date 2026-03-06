"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { signIn, signInWithOAuth } from "@/actions/auth";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await signIn(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">로그인</h1>
          <p className="text-sm text-muted-foreground mt-2">
            YeAmall에 오신 것을 환영합니다
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">이메일</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                name="email"
                placeholder="example@email.com"
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">비밀번호</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="비밀번호를 입력하세요"
                required
                className="w-full h-12 pl-10 pr-12 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 text-muted-foreground">간편 로그인</span>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={async () => {
                const result = await signInWithOAuth("kakao");
                if (result.url) window.location.href = result.url;
              }}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#FEE500]">
                <span className="text-xs font-bold text-[#391B1B]">K</span>
              </div>
              <span className="text-sm">카카오</span>
            </button>
            <button
              type="button"
              onClick={async () => {
                const result = await signInWithOAuth("google");
                if (result.url) window.location.href = result.url;
              }}
              className="flex h-12 items-center justify-center gap-2 rounded-xl border border-border hover:bg-muted transition-colors"
            >
              <div className="flex items-center justify-center w-6 h-6">
                <span className="text-lg">G</span>
              </div>
              <span className="text-sm">Google</span>
            </button>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          아직 회원이 아니신가요?{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            회원가입
          </Link>
        </div>
      </div>
    </div>
  );
}
