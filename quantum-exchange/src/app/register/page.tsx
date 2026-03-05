"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Eye, EyeOff, Zap, Mail, Lock, ArrowRight, User, Shield, Check } from "lucide-react";
import { useLanguage } from "@/i18n";

export default function RegisterPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [agreed, setAgreed] = useState(false);

  const passwordStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabels = ["", t.register.passwordStrength.weak, t.register.passwordStrength.medium, t.register.passwordStrength.strong];
  const strengthColors = ["", "bg-danger", "bg-warning", "bg-accent"];

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <div className="rounded-3xl bg-card border border-border p-8">
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-cyan mb-4">
              <Zap className="h-6 w-6 text-background" fill="currentColor" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">{t.register.createAccount}</h1>
            <p className="text-sm text-muted">{t.register.subtitle}</p>
          </div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <button className="flex items-center justify-center gap-2 h-11 rounded-xl bg-background border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {t.register.google}
            </button>
            <button className="flex items-center justify-center gap-2 h-11 rounded-xl bg-background border border-border text-sm font-medium text-foreground hover:bg-card-hover transition-colors">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-2.987 1.57-.18 0-.36-.02-.53-.06-.01-.18-.02-.36-.02-.54 0-1.13.535-2.34 1.217-3.08.745-.82 2.01-1.5 2.997-1.5.18 0 .36.02.5.05v.47zm3.635 17.05c-.75 1.07-1.54 2.13-2.78 2.15-1.17.02-1.56-.73-2.9-.73-1.34 0-1.77.71-2.86.75-1.2.04-2.12-1.16-2.87-2.22-1.52-2.17-2.7-6.12-1.13-8.79.78-1.32 2.18-2.16 3.68-2.18 1.15-.02 2.22.77 2.92.77.7 0 2.02-.95 3.4-.81.58.02 2.2.23 3.24 1.75-.08.05-1.93 1.13-1.91 3.36.02 2.67 2.34 3.56 2.37 3.57-.03.08-.37 1.27-1.21 2.52"/>
              </svg>
              {t.register.apple}
            </button>
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted">{t.register.orRegisterWith}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (agreed && email && password && username) router.push("/verify-otp"); }}>
            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">{t.register.username}</label>
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 focus-within:border-border-light transition-colors">
                <User className="h-4 w-4 text-muted" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder={t.register.usernamePlaceholder}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">{t.register.email}</label>
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 focus-within:border-border-light transition-colors">
                <Mail className="h-4 w-4 text-muted" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.register.emailPlaceholder}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-muted mb-1.5 block">{t.register.password}</label>
              <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 focus-within:border-border-light transition-colors">
                <Lock className="h-4 w-4 text-muted" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.register.passwordPlaceholder}
                  className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password.length > 0 && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 flex gap-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= passwordStrength ? strengthColors[passwordStrength] : "bg-border"
                        }`}
                      />
                    ))}
                  </div>
                  <span className={`text-[10px] font-medium ${
                    passwordStrength === 1 ? "text-danger" : passwordStrength === 2 ? "text-warning" : "text-accent"
                  }`}>
                    {strengthLabels[passwordStrength]}
                  </span>
                </div>
              )}
            </div>

            <div className="space-y-3 py-2">
              {[
                t.register.agreeTerms,
                t.register.marketingUpdates,
              ].map((text, i) => (
                <label key={i} className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={i === 0 ? agreed : false}
                    onChange={(e) => i === 0 && setAgreed(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-border accent-accent"
                  />
                  <span className="text-xs text-muted leading-relaxed">{text}</span>
                </label>
              ))}
            </div>

            <button
              type="submit"
              className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-all hover:shadow-lg hover:shadow-accent/20"
            >
              {t.register.createAccountBtn}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Security Badge */}
          <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
            <Shield className="h-3.5 w-3.5 text-accent" />
            {t.register.securityBadge}
          </div>

          <p className="text-center text-sm text-muted mt-4">
            {t.register.alreadyHaveAccount}{" "}
            <Link href="/login" className="text-accent hover:text-accent-hover font-medium transition-colors">
              {t.register.logIn}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
