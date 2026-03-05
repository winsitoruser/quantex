"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  RefreshCw,
  AlertCircle,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ResetStep = "email" | "otp" | "newPassword" | "success";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer
  useEffect(() => {
    if (step !== "otp") return;
    if (timer <= 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer, step]);

  // Password strength
  const getPasswordStrength = (pw: string) => {
    if (pw.length === 0) return 0;
    let score = 0;
    if (pw.length >= 8) score++;
    if (/[A-Z]/.test(pw) && /[a-z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score;
  };

  const passwordStrength = getPasswordStrength(newPassword);
  const strengthLabels = ["", "Weak", "Fair", "Good", "Strong"];
  const strengthColors = ["", "bg-danger", "bg-warning", "bg-info", "bg-accent"];
  const strengthTextColors = ["", "text-danger", "text-warning", "text-info", "text-accent"];

  const passwordRules = [
    { label: "At least 8 characters", met: newPassword.length >= 8 },
    { label: "Uppercase and lowercase letters", met: /[A-Z]/.test(newPassword) && /[a-z]/.test(newPassword) },
    { label: "At least one number", met: /\d/.test(newPassword) },
    { label: "At least one special character", met: /[^A-Za-z0-9]/.test(newPassword) },
  ];

  const handleSendCode = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("otp");
    setTimer(60);
    setCanResend(false);
    setTimeout(() => inputRefs.current[0]?.focus(), 300);
  };

  const handleOtpChange = useCallback(
    (index: number, value: string) => {
      if (!/^\d*$/.test(value)) return;
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1);
      setOtp(newOtp);
      setError("");
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

  const handleVerifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 1500));
    setLoading(false);
    setStep("newPassword");
  };

  const handleResetPassword = async () => {
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (passwordStrength < 3) {
      setError("Password is too weak. Please use a stronger password.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    setError("");
    await new Promise((r) => setTimeout(r, 2000));
    setLoading(false);
    setStep("success");
  };

  const maskedEmail = email
    ? email.replace(/(.{2})(.*)(@.*)/, "$1***$3")
    : "";

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] bg-purple/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >
        {/* Progress Steps */}
        {step !== "success" && (
          <div className="flex items-center justify-center gap-2 mb-6">
            {[
              { key: "email", label: "Email" },
              { key: "otp", label: "Verify" },
              { key: "newPassword", label: "New Password" },
            ].map((s, i) => {
              const steps: ResetStep[] = ["email", "otp", "newPassword"];
              const currentIdx = steps.indexOf(step);
              const stepIdx = i;
              const isCompleted = currentIdx > stepIdx;
              const isActive = currentIdx === stepIdx;
              return (
                <div key={s.key} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "h-7 w-7 rounded-lg flex items-center justify-center text-xs font-bold transition-all",
                      isCompleted
                        ? "bg-accent text-background"
                        : isActive
                        ? "bg-accent/20 text-accent border border-accent/30"
                        : "bg-card border border-border text-muted"
                    )}
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      i + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium hidden sm:block",
                      isCompleted || isActive ? "text-foreground" : "text-muted"
                    )}
                  >
                    {s.label}
                  </span>
                  {i < 2 && (
                    <div
                      className={cn(
                        "h-0.5 w-8 rounded-full",
                        isCompleted ? "bg-accent" : "bg-border"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* ====== EMAIL STEP ====== */}
          {step === "email" && (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="rounded-3xl bg-card border border-border p-8"
            >
              <div className="text-center mb-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple to-info mb-4">
                  <KeyRound className="h-6 w-6 text-background" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Forgot Password?
                </h1>
                <p className="text-sm text-muted">
                  Enter your registered email address and we&apos;ll send you a
                  verification code to reset your password.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">
                    Email Address
                  </label>
                  <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 focus-within:border-border-light transition-colors">
                    <Mail className="h-4 w-4 text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setError("");
                      }}
                      placeholder="your@email.com"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 outline-none"
                      onKeyDown={(e) => e.key === "Enter" && handleSendCode()}
                    />
                  </div>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs text-danger"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {error}
                  </motion.div>
                )}

                <button
                  onClick={handleSendCode}
                  disabled={!email || loading}
                  className={cn(
                    "w-full h-12 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all",
                    email && !loading
                      ? "bg-accent hover:bg-accent-hover text-background hover:shadow-lg hover:shadow-accent/20"
                      : "bg-border text-muted cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    <>
                      Send Verification Code
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>

              <p className="text-center text-sm text-muted mt-6">
                Remember your password?{" "}
                <Link
                  href="/login"
                  className="text-accent hover:text-accent-hover font-medium transition-colors"
                >
                  Log In
                </Link>
              </p>
            </motion.div>
          )}

          {/* ====== OTP STEP ====== */}
          {step === "otp" && (
            <motion.div
              key="otp"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-3xl bg-card border border-border p-8"
            >
              <button
                onClick={() => setStep("email")}
                className="flex items-center gap-1.5 text-xs text-muted hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change email
              </button>

              <div className="text-center mb-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-info/10 mb-4">
                  <Mail className="h-6 w-6 text-info" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Check Your Email
                </h1>
                <p className="text-sm text-muted">
                  We sent a 6-digit code to{" "}
                  <span className="text-foreground font-medium">
                    {maskedEmail}
                  </span>
                </p>
              </div>

              {/* OTP Input */}
              <div
                className="flex justify-center gap-3 mb-6"
                onPaste={handlePaste}
              >
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      inputRefs.current[i] = el;
                    }}
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

              <button
                onClick={handleVerifyOtp}
                disabled={otp.join("").length !== 6 || loading}
                className={cn(
                  "w-full h-12 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all",
                  otp.join("").length === 6 && !loading
                    ? "bg-accent hover:bg-accent-hover text-background hover:shadow-lg hover:shadow-accent/20"
                    : "bg-border text-muted cursor-not-allowed"
                )}
              >
                {loading ? (
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
            </motion.div>
          )}

          {/* ====== NEW PASSWORD STEP ====== */}
          {step === "newPassword" && (
            <motion.div
              key="newPassword"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="rounded-3xl bg-card border border-border p-8"
            >
              <div className="text-center mb-8">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 mb-4">
                  <Lock className="h-6 w-6 text-accent" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-1">
                  Create New Password
                </h1>
                <p className="text-sm text-muted">
                  Your new password must be different from previously used
                  passwords.
                </p>
              </div>

              <div className="space-y-4">
                {/* New Password */}
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">
                    New Password
                  </label>
                  <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 focus-within:border-border-light transition-colors">
                    <Lock className="h-4 w-4 text-muted" />
                    <input
                      type={showNew ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter new password"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNew(!showNew)}
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      {showNew ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  {/* Strength Bar */}
                  {newPassword.length > 0 && (
                    <div className="mt-2">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex-1 flex gap-1">
                          {[1, 2, 3, 4].map((level) => (
                            <div
                              key={level}
                              className={cn(
                                "h-1 flex-1 rounded-full transition-colors",
                                level <= passwordStrength
                                  ? strengthColors[passwordStrength]
                                  : "bg-border"
                              )}
                            />
                          ))}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] font-medium",
                            strengthTextColors[passwordStrength]
                          )}
                        >
                          {strengthLabels[passwordStrength]}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {passwordRules.map((rule) => (
                          <div
                            key={rule.label}
                            className="flex items-center gap-2 text-[11px]"
                          >
                            {rule.met ? (
                              <CheckCircle2 className="h-3 w-3 text-accent" />
                            ) : (
                              <div className="h-3 w-3 rounded-full border border-border" />
                            )}
                            <span
                              className={
                                rule.met ? "text-foreground" : "text-muted"
                              }
                            >
                              {rule.label}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="text-xs font-medium text-muted mb-1.5 block">
                    Confirm Password
                  </label>
                  <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3 focus-within:border-border-light transition-colors">
                    <Lock className="h-4 w-4 text-muted" />
                    <input
                      type={showConfirm ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setError("");
                      }}
                      placeholder="Confirm new password"
                      className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted/50 outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="text-muted hover:text-foreground transition-colors"
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {confirmPassword.length > 0 && newPassword !== confirmPassword && (
                    <p className="text-[11px] text-danger mt-1.5 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Passwords do not match
                    </p>
                  )}
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs text-danger"
                  >
                    <AlertCircle className="h-3.5 w-3.5" />
                    {error}
                  </motion.div>
                )}

                <button
                  onClick={handleResetPassword}
                  disabled={
                    !newPassword ||
                    !confirmPassword ||
                    newPassword !== confirmPassword ||
                    passwordStrength < 3 ||
                    loading
                  }
                  className={cn(
                    "w-full h-12 flex items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all",
                    newPassword &&
                      confirmPassword &&
                      newPassword === confirmPassword &&
                      passwordStrength >= 3 &&
                      !loading
                      ? "bg-accent hover:bg-accent-hover text-background hover:shadow-lg hover:shadow-accent/20"
                      : "bg-border text-muted cursor-not-allowed"
                  )}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Resetting Password...
                    </>
                  ) : (
                    <>
                      Reset Password
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
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
                    <ShieldCheck className="h-10 w-10 text-accent" />
                  </motion.div>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h1 className="text-2xl font-bold text-foreground mb-2">
                  Password Reset Successful!
                </h1>
                <p className="text-sm text-muted mb-8">
                  Your password has been successfully reset. You can now log in
                  with your new password.
                </p>

                <div className="rounded-xl bg-info/5 border border-info/20 p-4 mb-6 text-left">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="h-4 w-4 text-info shrink-0 mt-0.5" />
                    <div className="text-xs text-muted space-y-1">
                      <p className="font-semibold text-info">
                        Security Recommendation
                      </p>
                      <ul className="space-y-0.5">
                        <li>
                          - Enable Two-Factor Authentication (2FA) for extra
                          security
                        </li>
                        <li>
                          - Never share your password with anyone
                        </li>
                        <li>
                          - Use a unique password for each platform
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                <Link
                  href="/login"
                  className="w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-all hover:shadow-lg hover:shadow-accent/20"
                >
                  Go to Login
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
