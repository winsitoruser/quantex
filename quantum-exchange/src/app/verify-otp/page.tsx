"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Shield,
  Mail,
  Smartphone,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Lock,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type VerifyMethod = "email" | "phone";
type VerifyStep = "method" | "input" | "success";

export default function VerifyOTPPage() {
  const router = useRouter();
  const [method, setMethod] = useState<VerifyMethod>("email");
  const [step, setStep] = useState<VerifyStep>("method");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (step !== "input") return;
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      setError("");

      // Auto focus next input
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [otp]
  );

  const handleKeyDown = useCallback(
    (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Backspace" && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    },
    [otp]
  );

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length > 0) {
      const newOtp = [...Array(6)].map((_, i) => pasted[i] || "");
      setOtp(newOtp);
      const focusIndex = Math.min(pasted.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  }, []);

  const handleResend = () => {
    setTimer(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    inputRefs.current[0]?.focus();
  };

  const handleVerify = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setVerifying(true);
    // Simulate API call
    await new Promise((r) => setTimeout(r, 2000));

    // For demo: any 6-digit code works
    setVerifying(false);
    setStep("success");
  };

  const handleSelectMethod = (m: VerifyMethod) => {
    setMethod(m);
    setStep("input");
    setTimer(60);
    setCanResend(false);
    setOtp(["", "", "", "", "", ""]);
    setError("");
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  };

  const maskedContact =
    method === "email" ? "u***r@email.com" : "+62 812 **** 7890";

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-cyan/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        <AnimatePresence mode="wait">
          {/* ====== SELECT METHOD ====== */}
          {step === "method" && (
            <motion.div
              key="method"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-3xl bg-card border border-border p-8"
            >
              <div className="text-center mb-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent to-cyan mb-4">
                  <Shield className="h-6 w-6 text-background" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Verify Your Identity
                </h1>
                <p className="text-sm text-muted">
                  Choose a verification method to secure your account
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    id: "email" as VerifyMethod,
                    icon: Mail,
                    title: "Email Verification",
                    desc: "We'll send a 6-digit code to your registered email",
                    color: "text-info",
                    bg: "bg-info/10",
                    border: "border-info/20",
                  },
                  {
                    id: "phone" as VerifyMethod,
                    icon: Smartphone,
                    title: "Phone Verification",
                    desc: "We'll send a 6-digit code via SMS to your phone",
                    color: "text-accent",
                    bg: "bg-accent/10",
                    border: "border-accent/20",
                  },
                ].map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.id}
                      onClick={() => handleSelectMethod(opt.id)}
                      className={cn(
                        "w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all hover:shadow-md",
                        "bg-background border-border hover:border-border-light"
                      )}
                    >
                      <div
                        className={cn(
                          "h-12 w-12 rounded-xl flex items-center justify-center shrink-0",
                          opt.bg
                        )}
                      >
                        <Icon className={cn("h-5 w-5", opt.color)} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-foreground">
                          {opt.title}
                        </p>
                        <p className="text-xs text-muted mt-0.5">{opt.desc}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted" />
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex items-center justify-center gap-2 text-xs text-muted">
                <Lock className="h-3.5 w-3.5 text-accent" />
                Secured with end-to-end encryption
              </div>
            </motion.div>
          )}

          {/* ====== OTP INPUT ====== */}
          {step === "input" && (
            <motion.div
              key="input"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-3xl bg-card border border-border p-8"
            >
              <button
                onClick={() => setStep("method")}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change method
              </button>

              <div className="text-center mb-8">
                <div
                  className={cn(
                    "inline-flex h-12 w-12 items-center justify-center rounded-xl mb-4",
                    method === "email"
                      ? "bg-info/10"
                      : "bg-accent/10"
                  )}
                >
                  {method === "email" ? (
                    <Mail className="h-6 w-6 text-info" />
                  ) : (
                    <Smartphone className="h-6 w-6 text-accent" />
                  )}
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Enter Verification Code
                </h1>
                <p className="text-sm text-muted">
                  We sent a 6-digit code to{" "}
                  <span className="text-foreground font-medium">
                    {maskedContact}
                  </span>
                </p>
              </div>

              {/* OTP Input */}
              <div className="flex justify-center gap-3 mb-6" onPaste={handlePaste}>
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputRefs.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={cn(
                      "h-14 w-12 rounded-xl border text-center text-lg font-bold transition-all outline-none",
                      "bg-background text-foreground",
                      digit
                        ? "border-accent/50 shadow-sm shadow-accent/10"
                        : "border-border focus:border-border-light"
                    )}
                  />
                ))}
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-2 text-xs text-danger mb-4"
                >
                  <AlertCircle className="h-3.5 w-3.5" />
                  {error}
                </motion.div>
              )}

              {/* Timer / Resend */}
              <div className="text-center mb-6">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="flex items-center justify-center gap-2 mx-auto text-sm text-accent hover:text-accent-hover font-medium transition-colors"
                  >
                    <RefreshCw className="h-3.5 w-3.5" />
                    Resend Code
                  </button>
                ) : (
                  <p className="text-xs text-muted">
                    Resend code in{" "}
                    <span className="text-foreground font-semibold font-mono">
                      {String(Math.floor(timer / 60)).padStart(2, "0")}:
                      {String(timer % 60).padStart(2, "0")}
                    </span>
                  </p>
                )}
              </div>

              {/* Verify Button */}
              <button
                onClick={handleVerify}
                disabled={otp.join("").length !== 6 || verifying}
                className={cn(
                  "w-full h-12 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all",
                  otp.join("").length === 6 && !verifying
                    ? "bg-accent hover:bg-accent-hover text-background hover:shadow-lg hover:shadow-accent/20"
                    : "bg-border text-muted cursor-not-allowed"
                )}
              >
                {verifying ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  <>
                    Verify Code
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

              <p className="text-center text-xs text-muted mt-4">
                Didn&apos;t receive the code? Check your spam folder or try a different method.
              </p>
            </motion.div>
          )}

          {/* ====== SUCCESS ====== */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-3xl bg-card border border-border p-8 text-center"
            >
              {/* Success Animation */}
              <div className="relative mx-auto mb-6 h-20 w-20">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="relative h-20 w-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <CheckCircle2 className="h-10 w-10 text-accent" />
                  </motion.div>
                </motion.div>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      x: [0, Math.cos((i * Math.PI) / 3) * 50],
                      y: [0, Math.sin((i * Math.PI) / 3) * 50],
                    }}
                    transition={{ duration: 0.8, delay: 0.6 + i * 0.05 }}
                    className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full"
                    style={{
                      backgroundColor: ["#00c26f", "#06b6d4", "#8b5cf6", "#f59e0b", "#00c26f", "#06b6d4"][i],
                    }}
                  />
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Verification Successful!
                </h1>
                <p className="text-sm text-muted mb-8">
                  Your {method === "email" ? "email" : "phone number"} has been verified successfully. Your account is now secured.
                </p>

                <div className="space-y-3">
                  <Link
                    href="/kyc"
                    className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-all hover:shadow-lg hover:shadow-accent/20"
                  >
                    Complete KYC Verification
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/trade/btc-usdt"
                    className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-background border border-border text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                  >
                    Skip for Now
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
