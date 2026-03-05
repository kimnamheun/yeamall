"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, User, Phone } from "lucide-react";
import { signUp } from "@/actions/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [agreeAll, setAgreeAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const passwordConfirm = formData.get("passwordConfirm") as string;

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    if (!agreeAll) {
      setError("이용약관에 동의해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    const result = await signUp(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      alert("회원가입이 완료되었습니다! 이메일을 확인해주세요.");
      router.push("/login");
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="rounded-2xl bg-white p-8 shadow-sm border border-border">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground">회원가입</h1>
          <p className="text-sm text-muted-foreground mt-2">
            YeAMall 회원이 되어 특별한 혜택을 누리세요
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              이름 <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                name="name"
                placeholder="홍길동"
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              이메일 <span className="text-destructive">*</span>
            </label>
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
            <label className="block text-sm font-medium text-foreground mb-1.5">
              전화번호 <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="tel"
                name="phone"
                placeholder="010-1234-5678"
                required
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              비밀번호 <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="8자 이상 입력하세요"
                required
                minLength={8}
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

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">
              비밀번호 확인 <span className="text-destructive">*</span>
            </label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                name="passwordConfirm"
                placeholder="비밀번호를 다시 입력하세요"
                required
                minLength={8}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-border focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeAll}
                onChange={(e) => setAgreeAll(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary w-4 h-4"
              />
              <span className="text-sm text-foreground">
                <span className="text-primary hover:underline cursor-pointer">이용약관</span> 및{" "}
                <span className="text-primary hover:underline cursor-pointer">개인정보 처리방침</span>에 동의합니다
              </span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          이미 회원이신가요?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            로그인
          </Link>
        </div>
      </div>
    </div>
  );
}
