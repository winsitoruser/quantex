"use client";

import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Clock,
  Shield,
  Send,
  Copy,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  ChevronDown,
  Info,
  Phone,
  Flag,
  Image as ImageIcon,
  Check,
} from "lucide-react";
import { p2pAds, p2pOrders, type P2POrder, type P2PChatMessage } from "@/data/p2pData";
import { cn } from "@/lib/utils";

type OrderStep = "pending" | "paid" | "releasing" | "completed";

export default function P2POrderPage() {
  const params = useParams();
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Find ad or existing order
  const adId = params.id as string;
  const existingOrder = p2pOrders.find((o) => o.id === adId || o.adId === adId);
  const ad = p2pAds.find((a) => a.id === adId);

  const [orderStep, setOrderStep] = useState<OrderStep>(
    existingOrder?.status === "completed" ? "completed" :
    existingOrder?.status === "paid" || existingOrder?.status === "releasing" ? "paid" :
    "pending"
  );
  const [buyAmount, setBuyAmount] = useState(existingOrder ? existingOrder.amount.toString() : "");
  const [orderPlaced, setOrderPlaced] = useState(!!existingOrder);
  const [messages, setMessages] = useState<P2PChatMessage[]>(existingOrder?.chatMessages || []);
  const [newMessage, setNewMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds
  const [copied, setCopied] = useState<string | null>(null);
  const [showAppeal, setShowAppeal] = useState(false);

  const merchant = existingOrder?.counterparty || ad?.merchant;
  const crypto = existingOrder?.crypto || ad?.crypto || "USDT";
  const cryptoIcon = existingOrder?.cryptoIcon || ad?.cryptoIcon || "₮";
  const price = existingOrder?.price || ad?.price || 0;
  const fiat = existingOrder?.fiat || ad?.fiat || "IDR";

  const numAmount = parseFloat(buyAmount) || 0;
  const fiatAmount = existingOrder?.fiatAmount || numAmount * price;

  const fiatSymbol = fiat === "IDR" ? "Rp" : fiat === "USD" ? "$" : fiat;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!orderPlaced || orderStep === "completed") return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [orderPlaced, orderStep]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const handlePlaceOrder = () => {
    if (!numAmount) return;
    setOrderPlaced(true);
    setMessages([
      {
        id: "sys1",
        sender: "system",
        message: `Order created. Please complete payment of ${fiatSymbol} ${fiatAmount.toLocaleString()} within 15 minutes.`,
        timestamp: new Date().toISOString(),
        type: "system",
      },
    ]);
  };

  const handleMarkPaid = () => {
    setOrderStep("paid");
    setMessages((prev) => [
      ...prev,
      {
        id: `sys-paid-${Date.now()}`,
        sender: "system",
        message: "Buyer has marked order as paid. Waiting for seller to release crypto.",
        timestamp: new Date().toISOString(),
        type: "system",
      },
    ]);
    // Simulate seller releasing after a few seconds
    setTimeout(() => {
      setOrderStep("completed");
      setMessages((prev) => [
        ...prev,
        {
          id: `sys-release-${Date.now()}`,
          sender: "counterparty",
          message: "Payment confirmed! Releasing crypto now.",
          timestamp: new Date().toISOString(),
          type: "text",
        },
        {
          id: `sys-complete-${Date.now()}`,
          sender: "system",
          message: `Order completed! ${numAmount || existingOrder?.amount} ${crypto} has been released to your wallet.`,
          timestamp: new Date().toISOString(),
          type: "system",
        },
      ]);
    }, 3000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}`,
        sender: "me",
        message: newMessage.trim(),
        timestamp: new Date().toISOString(),
        type: "text",
      },
    ]);
    setNewMessage("");
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  const steps: { key: OrderStep; label: string }[] = [
    { key: "pending", label: "Payment" },
    { key: "paid", label: "Confirming" },
    { key: "releasing", label: "Releasing" },
    { key: "completed", label: "Completed" },
  ];

  const currentStepIndex = steps.findIndex((s) => s.key === orderStep);

  if (!ad && !existingOrder) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted mb-4">Order not found</p>
          <Link href="/p2p" className="text-accent hover:underline">Back to P2P</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-6">
        {/* Back + Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="h-9 w-9 rounded-xl bg-card border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              {orderPlaced ? `Order ${existingOrder?.id || "P2P-" + Date.now().toString().slice(-6)}` : `${ad?.type === "sell" ? "Buy" : "Sell"} ${crypto}`}
            </h1>
            <p className="text-xs text-muted">
              {orderPlaced ? "Complete your transaction" : "Review and place your order"}
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        {orderPlaced && (
          <div className="rounded-2xl bg-card border border-border p-4 mb-6">
            <div className="flex items-center justify-between">
              {steps.map((step, i) => (
                <div key={step.key} className="flex items-center flex-1 last:flex-none">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                        i <= currentStepIndex
                          ? "bg-accent text-background"
                          : "bg-background text-muted border border-border"
                      )}
                    >
                      {i < currentStepIndex ? <Check className="h-4 w-4" /> : i + 1}
                    </div>
                    <span className={cn(
                      "text-xs font-medium hidden sm:block",
                      i <= currentStepIndex ? "text-accent" : "text-muted"
                    )}>
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn(
                      "flex-1 h-0.5 mx-3",
                      i < currentStepIndex ? "bg-accent" : "bg-border"
                    )} />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Order Details + Payment */}
          <div className="lg:col-span-2 space-y-6">
            {/* Order Info Card */}
            <div className="rounded-2xl bg-card border border-border p-6">
              {!orderPlaced ? (
                <>
                  {/* Place Order Form */}
                  <h2 className="text-lg font-semibold text-foreground mb-4">Order Details</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs text-muted mb-1.5 block">I want to pay</label>
                      <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3">
                        <input
                          type="number"
                          value={buyAmount ? (parseFloat(buyAmount) * price).toString() : ""}
                          onChange={(e) => {
                            const fiatVal = parseFloat(e.target.value);
                            setBuyAmount(fiatVal ? (fiatVal / price).toFixed(6) : "");
                          }}
                          placeholder="0.00"
                          className="flex-1 bg-transparent text-foreground text-lg font-mono outline-none"
                        />
                        <span className="text-sm font-medium text-muted">{fiat}</span>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs text-muted mb-1.5 block">I will receive</label>
                      <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-3">
                        <input
                          type="number"
                          value={buyAmount}
                          onChange={(e) => setBuyAmount(e.target.value)}
                          placeholder="0.00"
                          className="flex-1 bg-transparent text-foreground text-lg font-mono outline-none"
                        />
                        <span className="text-sm font-medium text-muted">{crypto}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted py-2 border-t border-border">
                      <span>Price</span>
                      <span className="font-mono text-foreground">{fiatSymbol} {price.toLocaleString()} / {crypto}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Limit</span>
                      <span className="font-mono">{fiatSymbol}{ad?.minLimit.toLocaleString()} - {fiatSymbol}{ad?.maxLimit.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Available</span>
                      <span className="font-mono">{ad?.available.toLocaleString()} {crypto}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted">
                      <span>Payment Time Limit</span>
                      <span className="font-mono">15 min</span>
                    </div>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!numAmount || (ad && (fiatAmount < ad.minLimit || fiatAmount > ad.maxLimit))}
                      className="w-full py-3 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Buy {crypto}
                    </button>
                  </div>
                </>
              ) : orderStep === "pending" ? (
                <>
                  {/* Payment Instructions */}
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-foreground">Complete Payment</h2>
                    <div className="flex items-center gap-2 text-warning">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm font-mono font-bold">{formatTime(timeLeft)}</span>
                    </div>
                  </div>

                  <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 mb-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4.5 w-4.5 text-warning shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-warning font-medium">Transfer the exact amount</p>
                        <p className="text-[10px] text-muted mt-0.5">Include the order number in the transfer note for faster verification.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-background rounded-xl">
                      <div>
                        <p className="text-[10px] text-muted">Amount</p>
                        <p className="text-lg font-bold text-foreground font-mono">
                          {fiatSymbol} {fiatAmount.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleCopy(fiatAmount.toString(), "amount")}
                        className="h-8 w-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors"
                      >
                        {copied === "amount" ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                      </button>
                    </div>

                    <div className="p-3 bg-background rounded-xl space-y-2">
                      <p className="text-[10px] text-muted font-medium">Payment Method: Bank Transfer</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted">Bank</p>
                          <p className="text-sm text-foreground">BCA</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted">Account Number</p>
                          <p className="text-sm text-foreground font-mono">1234567890</p>
                        </div>
                        <button
                          onClick={() => handleCopy("1234567890", "account")}
                          className="h-8 w-8 rounded-lg bg-card border border-border flex items-center justify-center text-muted hover:text-foreground transition-colors"
                        >
                          {copied === "account" ? <Check className="h-3.5 w-3.5 text-accent" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] text-muted">Account Name</p>
                          <p className="text-sm text-foreground">{merchant?.name}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex gap-3">
                    <button
                      onClick={() => router.push("/p2p")}
                      className="flex-1 py-3 rounded-xl bg-background border border-border text-sm font-medium text-muted hover:text-foreground transition-colors"
                    >
                      Cancel Order
                    </button>
                    <button
                      onClick={handleMarkPaid}
                      className="flex-1 py-3 rounded-xl bg-accent text-background font-semibold text-sm hover:bg-accent-hover transition-colors"
                    >
                      I Have Paid
                    </button>
                  </div>
                </>
              ) : orderStep === "paid" ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-10 w-10 rounded-full bg-info/10 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-info animate-spin" style={{ animationDuration: "3s" }} />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Waiting for Seller</h2>
                      <p className="text-xs text-muted">The seller is verifying your payment. Crypto will be released shortly.</p>
                    </div>
                  </div>
                  <div className="bg-info/5 border border-info/20 rounded-xl p-4">
                    <p className="text-xs text-info">Payment marked. Please wait for the seller to confirm and release the crypto. Do not close this page.</p>
                  </div>
                  <button
                    onClick={() => setShowAppeal(true)}
                    className="mt-4 flex items-center gap-2 text-xs text-muted hover:text-warning transition-colors"
                  >
                    <Flag className="h-3.5 w-3.5" />
                    Appeal / Report Issue
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">Order Completed!</h2>
                      <p className="text-xs text-muted">
                        {numAmount || existingOrder?.amount} {crypto} has been credited to your wallet.
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-background rounded-xl">
                      <p className="text-[10px] text-muted">Crypto Received</p>
                      <p className="text-sm font-bold text-foreground font-mono">
                        {numAmount || existingOrder?.amount} {crypto}
                      </p>
                    </div>
                    <div className="p-3 bg-background rounded-xl">
                      <p className="text-[10px] text-muted">Total Paid</p>
                      <p className="text-sm font-bold text-foreground font-mono">
                        {fiatSymbol} {fiatAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Link href="/p2p" className="flex-1 py-3 rounded-xl bg-background border border-border text-sm font-medium text-center text-muted hover:text-foreground transition-colors">
                      Back to P2P
                    </Link>
                    <Link href="/wallet" className="flex-1 py-3 rounded-xl bg-accent text-background font-semibold text-sm text-center hover:bg-accent-hover transition-colors">
                      View Wallet
                    </Link>
                  </div>
                </>
              )}
            </div>

            {/* Merchant Info */}
            {merchant && (
              <div className="rounded-2xl bg-card border border-border p-6">
                <h3 className="text-sm font-semibold text-foreground mb-3">Merchant Info</h3>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-accent/20 to-cyan/20 flex items-center justify-center text-sm font-bold text-foreground">
                    {merchant.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">{merchant.name}</span>
                      {merchant.isVerified && <CheckCircle2 className="h-4 w-4 text-accent" />}
                    </div>
                    <p className="text-xs text-muted">Registered {merchant.registeredDays} days ago</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 bg-background rounded-xl text-center">
                    <p className="text-sm font-bold text-foreground">{merchant.totalTrades.toLocaleString()}</p>
                    <p className="text-[10px] text-muted">Total Trades</p>
                  </div>
                  <div className="p-2.5 bg-background rounded-xl text-center">
                    <p className="text-sm font-bold text-accent">{merchant.completionRate}%</p>
                    <p className="text-[10px] text-muted">Completion</p>
                  </div>
                  <div className="p-2.5 bg-background rounded-xl text-center">
                    <p className="text-sm font-bold text-foreground">{merchant.avgReleaseTime}</p>
                    <p className="text-[10px] text-muted">Avg Release</p>
                  </div>
                  <div className="p-2.5 bg-background rounded-xl text-center">
                    <p className="text-sm font-bold text-foreground">{merchant.positiveRate}%</p>
                    <p className="text-[10px] text-muted">Positive Rate</p>
                  </div>
                </div>
                {ad?.remarks && (
                  <div className="mt-3 p-3 bg-background rounded-xl">
                    <p className="text-[10px] text-muted mb-1">Seller&apos;s Note</p>
                    <p className="text-xs text-foreground">{ad.remarks}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right: Chat */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl bg-card border border-border overflow-hidden sticky top-20">
              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-accent" />
                  <span className="text-sm font-semibold text-foreground">Chat</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Shield className="h-3.5 w-3.5 text-accent" />
                  <span className="text-[10px] text-muted">Encrypted</span>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[400px] overflow-y-auto p-4 space-y-3">
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-muted">
                    <MessageSquare className="h-8 w-8 mb-2 text-border" />
                    <p className="text-xs">No messages yet</p>
                  </div>
                ) : (
                  messages.map((msg) => (
                    <div key={msg.id}>
                      {msg.type === "system" ? (
                        <div className="flex justify-center">
                          <span className="text-[10px] text-muted bg-background px-3 py-1.5 rounded-full">
                            {msg.message}
                          </span>
                        </div>
                      ) : (
                        <div className={cn("flex", msg.sender === "me" ? "justify-end" : "justify-start")}>
                          <div
                            className={cn(
                              "max-w-[80%] px-3 py-2 rounded-xl text-xs",
                              msg.sender === "me"
                                ? "bg-accent text-background rounded-br-sm"
                                : "bg-background text-foreground rounded-bl-sm"
                            )}
                          >
                            <p>{msg.message}</p>
                            <p className={cn(
                              "text-[9px] mt-1",
                              msg.sender === "me" ? "text-background/60" : "text-muted"
                            )}>
                              {new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </div>

              {/* Chat Input */}
              {orderPlaced && orderStep !== "completed" && (
                <div className="px-4 py-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      placeholder="Type a message..."
                      className="flex-1 bg-background border border-border rounded-xl px-3 py-2 text-xs text-foreground placeholder:text-muted outline-none focus:border-border-light"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="h-9 w-9 rounded-xl bg-accent text-background flex items-center justify-center hover:bg-accent-hover transition-colors disabled:opacity-50"
                    >
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <div className="flex items-center gap-1 mt-2">
                    <Info className="h-3 w-3 text-muted" />
                    <p className="text-[9px] text-muted">Do not share personal info outside of payment details.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
