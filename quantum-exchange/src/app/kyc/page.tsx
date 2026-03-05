"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  User,
  FileText,
  Camera,
  Clock,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  X,
  AlertCircle,
  CreditCard,
  Globe,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Building,
  Image,
  Loader2,
  ArrowRight,
  Lock,
  Zap,
  BadgeCheck,
  Eye,
  Trash2,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

type KYCStep = "landing" | "personal" | "financial" | "document" | "selfie" | "review" | "approved";
type DocType = "ktp" | "passport" | "drivers_license";

interface PersonalData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  placeOfBirth: string;
  gender: string;
  nationality: string;
  phone: string;
  nik: string;
  npwp: string;
  motherMaidenName: string;
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
}

interface FinancialData {
  occupation: string;
  companyName: string;
  industry: string;
  annualIncome: string;
  sourceOfFunds: string;
  purposeOfAccount: string;
  isPEP: boolean;
}

interface UploadedFile {
  name: string;
  size: string;
  preview: string;
}

const stepOrder: KYCStep[] = ["landing", "personal", "financial", "document", "selfie", "review", "approved"];

const stepsMeta = [
  { key: "personal", label: "Personal Info", icon: User },
  { key: "financial", label: "Financial", icon: Building },
  { key: "document", label: "Documents", icon: FileText },
  { key: "selfie", label: "Selfie", icon: Camera },
  { key: "review", label: "Review", icon: Clock },
];

const indonesianProvinces = [
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten",
  "DI Yogyakarta", "Bali", "Sumatera Utara", "Sumatera Barat", "Sumatera Selatan",
  "Riau", "Kepulauan Riau", "Lampung", "Kalimantan Barat", "Kalimantan Timur",
  "Kalimantan Selatan", "Sulawesi Selatan", "Sulawesi Utara", "Papua", "Maluku",
];

const occupationsList = [
  "Employee (Private Sector)", "Employee (Government/BUMN)", "Self-Employed / Entrepreneur",
  "Professional (Doctor, Lawyer, etc.)", "Freelancer", "Student", "Retired", "Housewife/Househusband", "Other",
];

const industriesList = [
  "Technology", "Finance & Banking", "Healthcare", "Education", "Manufacturing",
  "Retail & E-commerce", "Real Estate", "Agriculture", "Mining", "Transportation", "Other",
];

const incomeRangesList = [
  "< Rp 50,000,000/year", "Rp 50,000,000 - Rp 100,000,000/year",
  "Rp 100,000,000 - Rp 250,000,000/year", "Rp 250,000,000 - Rp 500,000,000/year",
  "Rp 500,000,000 - Rp 1,000,000,000/year", "> Rp 1,000,000,000/year",
];

const fundSourcesList = [
  "Salary/Wages", "Business Income", "Investment Returns", "Inheritance",
  "Savings", "Pension", "Gift/Donation", "Rental Income", "Other",
];

const accountPurposesList = [
  "Investment / Trading", "Savings / Store of Value", "Remittance / Transfer",
  "Payment / Transaction", "Hedging", "Other",
];

const documentTypes: { value: DocType; label: string; description: string; icon: typeof CreditCard }[] = [
  { value: "ktp", label: "KTP (National ID)", description: "Indonesian National Identity Card", icon: CreditCard },
  { value: "passport", label: "Passport", description: "International travel passport", icon: Globe },
  { value: "drivers_license", label: "Driver's License", description: "Valid government-issued license", icon: CreditCard },
];

const verificationLevels = [
  {
    level: "Basic",
    color: "text-info",
    bg: "bg-info/10",
    border: "border-info/20",
    features: ["Deposit up to $10,000/day", "Withdraw up to $5,000/day", "Spot trading access"],
    requirements: ["Email verification", "Phone verification"],
  },
  {
    level: "Advanced",
    color: "text-accent",
    bg: "bg-accent/10",
    border: "border-accent/20",
    features: [
      "Unlimited deposits",
      "Withdraw up to $100,000/day",
      "Futures & margin trading",
      "P2P trading access",
      "Lower trading fees",
    ],
    requirements: ["Personal information", "Government ID verification", "Selfie verification"],
  },
];

const countries = [
  "Indonesia", "United States", "United Kingdom", "Singapore", "Malaysia",
  "Japan", "South Korea", "Australia", "Germany", "France", "India",
  "Thailand", "Philippines", "Vietnam", "Canada", "Brazil", "Netherlands",
];

export default function KYCPage() {
  const [currentStep, setCurrentStep] = useState<KYCStep>("landing");
  const [personalData, setPersonalData] = useState<PersonalData>({
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    placeOfBirth: "",
    gender: "",
    nationality: "",
    phone: "",
    nik: "",
    npwp: "",
    motherMaidenName: "",
    address: "",
    rt: "",
    rw: "",
    kelurahan: "",
    kecamatan: "",
    city: "",
    province: "",
    postalCode: "",
    country: "",
  });
  const [financialData, setFinancialData] = useState<FinancialData>({
    occupation: "",
    companyName: "",
    industry: "",
    annualIncome: "",
    sourceOfFunds: "",
    purposeOfAccount: "",
    isPEP: false,
  });
  const [selectedDocType, setSelectedDocType] = useState<DocType>("ktp");
  const [docFront, setDocFront] = useState<UploadedFile | null>(null);
  const [docBack, setDocBack] = useState<UploadedFile | null>(null);
  const [selfieFile, setSelfieFile] = useState<UploadedFile | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reviewTimer, setReviewTimer] = useState(0);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const currentStepIndex = stepOrder.indexOf(currentStep);

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < stepOrder.length) {
      setCurrentStep(stepOrder[nextIndex]);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(stepOrder[prevIndex]);
    }
  };

  const handleFileUpload = useCallback(
    (setter: (file: UploadedFile | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setter({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2) + " MB",
          preview,
        });
      }
    },
    []
  );

  const handleSubmitReview = async () => {
    setSubmitting(true);
    // Simulate submission delay
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setCurrentStep("review");
    // Simulate review timer (auto-approve after 10 seconds for demo)
    let t = 0;
    const interval = setInterval(() => {
      t++;
      setReviewTimer(t);
      if (t >= 10) {
        clearInterval(interval);
        setCurrentStep("approved");
      }
    }, 1000);
  };

  const isPersonalValid =
    personalData.firstName &&
    personalData.lastName &&
    personalData.dateOfBirth &&
    personalData.placeOfBirth &&
    personalData.gender &&
    personalData.nationality &&
    personalData.phone &&
    personalData.nik &&
    personalData.nik.length === 16 &&
    personalData.motherMaidenName &&
    personalData.address &&
    personalData.city &&
    personalData.country;

  const isFinancialValid =
    financialData.occupation &&
    financialData.annualIncome &&
    financialData.sourceOfFunds &&
    financialData.purposeOfAccount;

  const isDocValid = docFront !== null && (selectedDocType === "passport" || docBack !== null);
  const isSelfieValid = selfieFile !== null;

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 lg:px-8 py-8">
        {/* Step Progress Bar - shown after landing */}
        <AnimatePresence mode="wait">
          {currentStep !== "landing" && currentStep !== "approved" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-8"
            >
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-bold text-foreground">Identity Verification</h1>
                <span className="text-xs text-muted px-3 py-1.5 rounded-lg bg-card border border-border">
                  Step {Math.min(stepOrder.indexOf(currentStep), 5)} of 5
                </span>
              </div>
              <div className="flex items-center gap-2">
                {stepsMeta.map((step, i) => {
                  const stepIdx = stepOrder.indexOf(step.key as KYCStep);
                  const currentIdx = stepOrder.indexOf(currentStep);
                  const isCompleted = currentIdx > stepIdx;
                  const isActive = currentIdx === stepIdx;
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex items-center flex-1">
                      <div className="flex items-center gap-2 flex-1">
                        <div
                          className={cn(
                            "h-9 w-9 rounded-xl flex items-center justify-center shrink-0 transition-all",
                            isCompleted
                              ? "bg-accent text-background"
                              : isActive
                              ? "bg-accent/20 text-accent border border-accent/30"
                              : "bg-card border border-border text-muted"
                          )}
                        >
                          {isCompleted ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            <Icon className="h-4 w-4" />
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-xs font-medium hidden sm:block",
                            isCompleted || isActive ? "text-foreground" : "text-muted"
                          )}
                        >
                          {step.label}
                        </span>
                      </div>
                      {i < stepsMeta.length - 1 && (
                        <div
                          className={cn(
                            "h-0.5 flex-1 mx-2 rounded-full transition-colors",
                            isCompleted ? "bg-accent" : "bg-border"
                          )}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          {/* ========== LANDING ========== */}
          {currentStep === "landing" && (
            <motion.div
              key="landing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Hero Section */}
              <div className="relative rounded-3xl bg-gradient-to-br from-card via-card to-accent/5 border border-border p-8 mb-8 overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/4" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple/5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/4" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-background" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">Identity Verification (KYC)</h1>
                      <p className="text-sm text-muted">Verify your identity to unlock full platform features</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 mt-6">
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Lock className="h-3.5 w-3.5 text-accent" />
                      256-bit encrypted
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Shield className="h-3.5 w-3.5 text-accent" />
                      GDPR compliant
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted">
                      <Clock className="h-3.5 w-3.5 text-accent" />
                      Usually verified within 24h
                    </div>
                  </div>
                </div>
              </div>

              {/* Verification Levels */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {verificationLevels.map((level) => (
                  <div
                    key={level.level}
                    className={cn(
                      "rounded-2xl bg-card border p-6",
                      level.border
                    )}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center", level.bg)}>
                        <Shield className={cn("h-5 w-5", level.color)} />
                      </div>
                      <div>
                        <h3 className={cn("text-sm font-bold", level.color)}>Level: {level.level}</h3>
                        <p className="text-xs text-muted">Verification tier</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-foreground mb-2">Features</p>
                      <ul className="space-y-1.5">
                        {level.features.map((f) => (
                          <li key={f} className="flex items-center gap-2 text-xs text-muted">
                            <CheckCircle2 className={cn("h-3.5 w-3.5 shrink-0", level.color)} />
                            {f}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-2">Requirements</p>
                      <ul className="space-y-1.5">
                        {level.requirements.map((r) => (
                          <li key={r} className="flex items-center gap-2 text-xs text-muted">
                            <div className="h-1.5 w-1.5 rounded-full bg-muted shrink-0" />
                            {r}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>

              {/* Process Steps */}
              <div className="rounded-2xl bg-card border border-border p-6 mb-8">
                <h3 className="text-sm font-bold text-foreground mb-5">How It Works</h3>
                <div className="grid sm:grid-cols-4 gap-4">
                  {[
                    { step: "1", title: "Personal Info", desc: "Fill in your name, address, and date of birth", icon: User, color: "text-info", bg: "bg-info/10" },
                    { step: "2", title: "Upload Document", desc: "Upload KTP, passport, or driver's license", icon: FileText, color: "text-accent", bg: "bg-accent/10" },
                    { step: "3", title: "Take Selfie", desc: "Take a selfie holding your document", icon: Camera, color: "text-purple", bg: "bg-purple/10" },
                    { step: "4", title: "Get Verified", desc: "Wait for review and approval", icon: BadgeCheck, color: "text-warning", bg: "bg-warning/10" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.step} className="text-center">
                        <div className={cn("h-12 w-12 rounded-2xl flex items-center justify-center mx-auto mb-3", item.bg)}>
                          <Icon className={cn("h-5 w-5", item.color)} />
                        </div>
                        <p className="text-sm font-semibold text-foreground mb-1">{item.title}</p>
                        <p className="text-xs text-muted leading-relaxed">{item.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Start Button */}
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => setCurrentStep("personal")}
                  className="flex items-center gap-2 px-8 py-3.5 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-all hover:shadow-lg hover:shadow-accent/20"
                >
                  Start Verification
                  <ArrowRight className="h-4 w-4" />
                </button>
                <p className="text-xs text-muted">
                  Estimated time: 5–10 minutes
                </p>
              </div>
            </motion.div>
          )}

          {/* ========== PERSONAL INFO ========== */}
          {currentStep === "personal" && (
            <motion.div
              key="personal"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <User className="h-4 w-4 text-accent" />
                    Personal Information
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Please enter your legal name exactly as it appears on your ID document
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  {/* Name Row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        First Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={personalData.firstName}
                        onChange={(e) => setPersonalData({ ...personalData, firstName: e.target.value })}
                        placeholder="e.g. Ahmad"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        Last Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={personalData.lastName}
                        onChange={(e) => setPersonalData({ ...personalData, lastName: e.target.value })}
                        placeholder="e.g. Rizki"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                    </div>
                  </div>

                  {/* NIK & NPWP (OJK/Bappebti Required) */}
                  <div className="rounded-xl bg-info/5 border border-info/20 p-4">
                    <div className="flex items-start gap-2">
                      <Info className="h-3.5 w-3.5 text-info shrink-0 mt-0.5" />
                      <p className="text-[10px] text-muted">NIK and NPWP are mandatory per Bappebti Regulation No. 8/2021 for crypto asset exchange customers in Indonesia.</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        NIK (Nomor Induk Kependudukan) <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                        <input
                          type="text"
                          value={personalData.nik}
                          onChange={(e) => setPersonalData({ ...personalData, nik: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                          placeholder="16-digit NIK number"
                          maxLength={16}
                          className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground font-mono placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-muted mt-1">{personalData.nik.length}/16 digits</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        NPWP (Nomor Pokok Wajib Pajak)
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                        <input
                          type="text"
                          value={personalData.npwp}
                          onChange={(e) => setPersonalData({ ...personalData, npwp: e.target.value })}
                          placeholder="XX.XXX.XXX.X-XXX.XXX"
                          className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground font-mono placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Place/Date of Birth & Gender */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        Place of Birth <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={personalData.placeOfBirth}
                        onChange={(e) => setPersonalData({ ...personalData, placeOfBirth: e.target.value })}
                        placeholder="e.g. Jakarta"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        Date of Birth <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                        <input
                          type="date"
                          value={personalData.dateOfBirth}
                          onChange={(e) => setPersonalData({ ...personalData, dateOfBirth: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        Gender <span className="text-danger">*</span>
                      </label>
                      <select
                        value={personalData.gender}
                        onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none"
                      >
                        <option value="">Select gender</option>
                        <option value="male">Male / Laki-laki</option>
                        <option value="female">Female / Perempuan</option>
                      </select>
                    </div>
                  </div>

                  {/* Mother's Maiden Name & Nationality */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        Mother&apos;s Maiden Name <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={personalData.motherMaidenName}
                        onChange={(e) => setPersonalData({ ...personalData, motherMaidenName: e.target.value })}
                        placeholder="As per birth certificate"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                      <p className="text-[10px] text-muted mt-1">Required per OJK AML regulation</p>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        Nationality <span className="text-danger">*</span>
                      </label>
                      <div className="relative">
                        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                        <select
                          value={personalData.nationality}
                          onChange={(e) => setPersonalData({ ...personalData, nationality: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none"
                        >
                          <option value="">Select nationality</option>
                          {countries.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">
                      Phone Number <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                      <input
                        type="tel"
                        value={personalData.phone}
                        onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                        placeholder="+62 812 3456 7890"
                        className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Address Section (Indonesian format) */}
                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">
                      Street Address (Sesuai KTP) <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-muted pointer-events-none" />
                      <input
                        type="text"
                        value={personalData.address}
                        onChange={(e) => setPersonalData({ ...personalData, address: e.target.value })}
                        placeholder="Enter your street address"
                        className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">RT</label>
                      <input
                        type="text"
                        value={personalData.rt}
                        onChange={(e) => setPersonalData({ ...personalData, rt: e.target.value })}
                        placeholder="001"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">RW</label>
                      <input
                        type="text"
                        value={personalData.rw}
                        onChange={(e) => setPersonalData({ ...personalData, rw: e.target.value })}
                        placeholder="001"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Kelurahan <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        value={personalData.kelurahan}
                        onChange={(e) => setPersonalData({ ...personalData, kelurahan: e.target.value })}
                        placeholder="Kelurahan"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Kecamatan <span className="text-danger">*</span></label>
                      <input
                        type="text"
                        value={personalData.kecamatan}
                        onChange={(e) => setPersonalData({ ...personalData, kecamatan: e.target.value })}
                        placeholder="Kecamatan"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        City <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        value={personalData.city}
                        onChange={(e) => setPersonalData({ ...personalData, city: e.target.value })}
                        placeholder="City"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        Province <span className="text-danger">*</span>
                      </label>
                      <select
                        value={personalData.province}
                        onChange={(e) => setPersonalData({ ...personalData, province: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none"
                      >
                        <option value="">Select province</option>
                        {indonesianProvinces.map((p) => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        value={personalData.postalCode}
                        onChange={(e) => setPersonalData({ ...personalData, postalCode: e.target.value })}
                        placeholder="12345"
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">
                      Country <span className="text-danger">*</span>
                    </label>
                    <div className="relative">
                      <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                      <select
                        value={personalData.country}
                        onChange={(e) => setPersonalData({ ...personalData, country: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none"
                      >
                        <option value="">Select country</option>
                        {countries.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!isPersonalValid}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                      isPersonalValid
                        ? "bg-accent hover:bg-accent-hover text-background hover:shadow-lg hover:shadow-accent/20"
                        : "bg-border text-muted cursor-not-allowed"
                    )}
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== FINANCIAL INFO (OJK/Bappebti Required) ========== */}
          {currentStep === "financial" && (
            <motion.div
              key="financial"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Building className="h-4 w-4 text-accent" />
                    Employment & Financial Information
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Required per POJK No. 12/2017 (AML/CFT) and Bappebti regulation for customer due diligence
                  </p>
                </div>

                <div className="p-6 space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">
                        Occupation <span className="text-danger">*</span>
                      </label>
                      <select
                        value={financialData.occupation}
                        onChange={(e) => setFinancialData({ ...financialData, occupation: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none"
                      >
                        <option value="">Select occupation</option>
                        {occupationsList.map((o) => <option key={o} value={o}>{o}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-muted mb-1.5 block">Industry</label>
                      <select
                        value={financialData.industry}
                        onChange={(e) => setFinancialData({ ...financialData, industry: e.target.value })}
                        className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none"
                      >
                        <option value="">Select industry</option>
                        {industriesList.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">Company / Business Name</label>
                    <input
                      type="text"
                      value={financialData.companyName}
                      onChange={(e) => setFinancialData({ ...financialData, companyName: e.target.value })}
                      placeholder="Enter company or business name"
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors"
                    />
                  </div>

                  <div className="h-px bg-border" />

                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">
                      Annual Income Range <span className="text-danger">*</span>
                    </label>
                    <select
                      value={financialData.annualIncome}
                      onChange={(e) => setFinancialData({ ...financialData, annualIncome: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none"
                    >
                      <option value="">Select income range</option>
                      {incomeRangesList.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">
                      Source of Funds <span className="text-danger">*</span>
                    </label>
                    <select
                      value={financialData.sourceOfFunds}
                      onChange={(e) => setFinancialData({ ...financialData, sourceOfFunds: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none"
                    >
                      <option value="">Select source of funds</option>
                      {fundSourcesList.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <p className="text-[10px] text-muted mt-1">Required per POJK No. 12/2017 for Anti-Money Laundering compliance</p>
                  </div>

                  <div>
                    <label className="text-xs font-medium text-muted mb-1.5 block">
                      Purpose of Opening Account <span className="text-danger">*</span>
                    </label>
                    <select
                      value={financialData.purposeOfAccount}
                      onChange={(e) => setFinancialData({ ...financialData, purposeOfAccount: e.target.value })}
                      className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none"
                    >
                      <option value="">Select purpose</option>
                      {accountPurposesList.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  {/* PEP Declaration */}
                  <div className="rounded-xl bg-warning/5 border border-warning/20 p-4">
                    <p className="text-xs font-semibold text-warning mb-2">PEP Declaration (Politically Exposed Person)</p>
                    <p className="text-[10px] text-muted mb-3">Per OJK regulation, we are required to identify customers who are Politically Exposed Persons (PEP) or have relations with PEP.</p>
                    <div className="space-y-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="pep"
                          checked={!financialData.isPEP}
                          onChange={() => setFinancialData({ ...financialData, isPEP: false })}
                          className="mt-0.5 accent-accent"
                        />
                        <span className="text-xs text-muted">I am NOT a Politically Exposed Person (PEP)</span>
                      </label>
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="pep"
                          checked={financialData.isPEP}
                          onChange={() => setFinancialData({ ...financialData, isPEP: true })}
                          className="mt-0.5 accent-accent"
                        />
                        <span className="text-xs text-muted">I AM or have relations with a Politically Exposed Person (PEP)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!isFinancialValid}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                      isFinancialValid
                        ? "bg-accent hover:bg-accent-hover text-background hover:shadow-lg hover:shadow-accent/20"
                        : "bg-border text-muted cursor-not-allowed"
                    )}
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== DOCUMENT UPLOAD ========== */}
          {currentStep === "document" && (
            <motion.div
              key="document"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4 text-accent" />
                    Document Verification
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Select your document type and upload clear photos of both sides
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Document Type Selection */}
                  <div>
                    <label className="text-xs font-semibold text-foreground mb-3 block">
                      Select Document Type
                    </label>
                    <div className="grid sm:grid-cols-3 gap-3">
                      {documentTypes.map((doc) => {
                        const Icon = doc.icon;
                        const isSelected = selectedDocType === doc.value;
                        return (
                          <button
                            key={doc.value}
                            onClick={() => {
                              setSelectedDocType(doc.value);
                              setDocFront(null);
                              setDocBack(null);
                            }}
                            className={cn(
                              "relative flex flex-col items-center gap-2 p-4 rounded-xl border text-center transition-all",
                              isSelected
                                ? "bg-accent/10 border-accent/30 text-accent"
                                : "bg-background border-border text-muted hover:border-border-light hover:text-foreground"
                            )}
                          >
                            {isSelected && (
                              <div className="absolute top-2 right-2">
                                <CheckCircle2 className="h-4 w-4 text-accent" />
                              </div>
                            )}
                            <Icon className="h-6 w-6" />
                            <span className="text-xs font-semibold">{doc.label}</span>
                            <span className="text-[10px] text-muted">{doc.description}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Upload Guidelines */}
                  <div className="rounded-xl bg-info/5 border border-info/20 p-4">
                    <div className="flex items-start gap-3">
                      <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
                      <div className="text-xs text-muted space-y-1">
                        <p className="font-semibold text-info">Upload Guidelines</p>
                        <ul className="space-y-0.5">
                          <li>- Document must be valid and not expired</li>
                          <li>- Photo must be clear, not blurry or cropped</li>
                          <li>- All four corners of the document must be visible</li>
                          <li>- Accepted formats: JPG, PNG, PDF (max 10MB)</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Upload Areas */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    {/* Front Side */}
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-2 block">
                        Front Side <span className="text-danger">*</span>
                      </label>
                      <input
                        ref={frontInputRef}
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleFileUpload(setDocFront)}
                        className="hidden"
                      />
                      {docFront ? (
                        <div className="relative rounded-xl border border-accent/30 bg-accent/5 overflow-hidden">
                          <div className="aspect-[3/2] bg-background flex items-center justify-center">
                            <img
                              src={docFront.preview}
                              alt="Front side"
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex items-center justify-between px-3 py-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                              <span className="text-xs text-foreground truncate">{docFront.name}</span>
                              <span className="text-[10px] text-muted shrink-0">{docFront.size}</span>
                            </div>
                            <button
                              onClick={() => setDocFront(null)}
                              className="text-danger hover:text-danger-hover transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => frontInputRef.current?.click()}
                          className="w-full aspect-[3/2] rounded-xl border-2 border-dashed border-border hover:border-border-light bg-background flex flex-col items-center justify-center gap-2 transition-colors group"
                        >
                          <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:bg-card-hover transition-colors">
                            <Upload className="h-5 w-5 text-muted" />
                          </div>
                          <span className="text-xs text-muted">Click to upload front side</span>
                          <span className="text-[10px] text-muted/60">JPG, PNG or PDF up to 10MB</span>
                        </button>
                      )}
                    </div>

                    {/* Back Side */}
                    {selectedDocType !== "passport" && (
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-2 block">
                          Back Side <span className="text-danger">*</span>
                        </label>
                        <input
                          ref={backInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={handleFileUpload(setDocBack)}
                          className="hidden"
                        />
                        {docBack ? (
                          <div className="relative rounded-xl border border-accent/30 bg-accent/5 overflow-hidden">
                            <div className="aspect-[3/2] bg-background flex items-center justify-center">
                              <img
                                src={docBack.preview}
                                alt="Back side"
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex items-center justify-between px-3 py-2">
                              <div className="flex items-center gap-2 min-w-0">
                                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                                <span className="text-xs text-foreground truncate">{docBack.name}</span>
                                <span className="text-[10px] text-muted shrink-0">{docBack.size}</span>
                              </div>
                              <button
                                onClick={() => setDocBack(null)}
                                className="text-danger hover:text-danger-hover transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => backInputRef.current?.click()}
                            className="w-full aspect-[3/2] rounded-xl border-2 border-dashed border-border hover:border-border-light bg-background flex flex-col items-center justify-center gap-2 transition-colors group"
                          >
                            <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:bg-card-hover transition-colors">
                              <Upload className="h-5 w-5 text-muted" />
                            </div>
                            <span className="text-xs text-muted">Click to upload back side</span>
                            <span className="text-[10px] text-muted/60">JPG, PNG or PDF up to 10MB</span>
                          </button>
                        )}
                      </div>
                    )}

                    {/* Passport: single page info */}
                    {selectedDocType === "passport" && (
                      <div className="flex flex-col items-center justify-center rounded-xl bg-background border border-border p-6 text-center">
                        <Globe className="h-8 w-8 text-muted mb-3" />
                        <p className="text-xs font-semibold text-foreground mb-1">Passport</p>
                        <p className="text-[10px] text-muted leading-relaxed">
                          For passports, only the information page (front side) is required.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={goNext}
                    disabled={!isDocValid}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                      isDocValid
                        ? "bg-accent hover:bg-accent-hover text-background hover:shadow-lg hover:shadow-accent/20"
                        : "bg-border text-muted cursor-not-allowed"
                    )}
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== SELFIE ========== */}
          {currentStep === "selfie" && (
            <motion.div
              key="selfie"
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="px-6 py-4 border-b border-border">
                  <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Camera className="h-4 w-4 text-accent" />
                    Selfie Verification
                  </h2>
                  <p className="text-xs text-muted mt-1">
                    Take a selfie while holding your document next to your face
                  </p>
                </div>

                <div className="p-6 space-y-6">
                  {/* Instructions */}
                  <div className="grid sm:grid-cols-3 gap-4">
                    {[
                      { icon: Eye, title: "Face Clearly Visible", desc: "Ensure good lighting and face the camera directly" },
                      { icon: CreditCard, title: "Hold Your Document", desc: "Hold your ID beside your face so both are visible" },
                      { icon: Image, title: "Clear Photo", desc: "Make sure the text on your ID is readable in the photo" },
                    ].map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="rounded-xl bg-background border border-border p-4 text-center">
                          <div className="h-10 w-10 rounded-xl bg-purple/10 flex items-center justify-center mx-auto mb-3">
                            <Icon className="h-5 w-5 text-purple" />
                          </div>
                          <p className="text-xs font-semibold text-foreground mb-1">{item.title}</p>
                          <p className="text-[10px] text-muted leading-relaxed">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Upload Selfie */}
                  <div className="max-w-md mx-auto">
                    <input
                      ref={selfieInputRef}
                      type="file"
                      accept="image/*"
                      capture="user"
                      onChange={handleFileUpload(setSelfieFile)}
                      className="hidden"
                    />
                    {selfieFile ? (
                      <div className="rounded-xl border border-accent/30 bg-accent/5 overflow-hidden">
                        <div className="aspect-[4/3] bg-background flex items-center justify-center">
                          <img
                            src={selfieFile.preview}
                            alt="Selfie"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex items-center justify-between px-4 py-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <CheckCircle2 className="h-4 w-4 text-accent shrink-0" />
                            <span className="text-sm text-foreground truncate">{selfieFile.name}</span>
                            <span className="text-xs text-muted shrink-0">{selfieFile.size}</span>
                          </div>
                          <button
                            onClick={() => setSelfieFile(null)}
                            className="flex items-center gap-1 text-xs text-danger hover:text-danger-hover transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => selfieInputRef.current?.click()}
                        className="w-full aspect-[4/3] rounded-xl border-2 border-dashed border-border hover:border-border-light bg-background flex flex-col items-center justify-center gap-3 transition-colors group"
                      >
                        <div className="h-16 w-16 rounded-2xl bg-card border border-border flex items-center justify-center group-hover:bg-card-hover transition-colors">
                          <Camera className="h-8 w-8 text-muted" />
                        </div>
                        <div className="text-center">
                          <p className="text-sm font-medium text-muted mb-1">Upload Selfie Photo</p>
                          <p className="text-xs text-muted/60">Click to take a photo or upload from gallery</p>
                        </div>
                      </button>
                    )}
                  </div>

                  {/* Warning */}
                  <div className="rounded-xl bg-warning/5 border border-warning/20 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                      <div className="text-xs text-muted space-y-1">
                        <p className="font-semibold text-warning">Important</p>
                        <p>Do not wear a hat, mask, or sunglasses. Ensure the photo is not blurry and both your face and document details are clearly readable.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                  <button
                    onClick={goBack}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Back
                  </button>
                  <button
                    onClick={handleSubmitReview}
                    disabled={!isSelfieValid || submitting}
                    className={cn(
                      "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                      isSelfieValid && !submitting
                        ? "bg-accent hover:bg-accent-hover text-background hover:shadow-lg hover:shadow-accent/20"
                        : "bg-border text-muted cursor-not-allowed"
                    )}
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit for Review
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== REVIEW / PENDING ========== */}
          {currentStep === "review" && (
            <motion.div
              key="review"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="p-8 sm:p-12 text-center">
                  {/* Animated Clock */}
                  <div className="relative mx-auto mb-6 h-24 w-24">
                    <div className="absolute inset-0 rounded-full bg-warning/10 animate-ping" style={{ animationDuration: "3s" }} />
                    <div className="relative h-24 w-24 rounded-full bg-warning/10 border-2 border-warning/30 flex items-center justify-center">
                      <Clock className="h-10 w-10 text-warning" />
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-foreground mb-2">
                    Verification Under Review
                  </h2>
                  <p className="text-sm text-muted max-w-md mx-auto mb-6">
                    Your documents have been submitted successfully. Our team is reviewing your information. This usually takes up to 24 hours.
                  </p>

                  {/* Status Card */}
                  <div className="max-w-sm mx-auto rounded-xl bg-background border border-border p-5 mb-8">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Status</span>
                        <span className="text-warning font-semibold flex items-center gap-1.5">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          In Review
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Submitted</span>
                        <span className="text-foreground font-medium">
                          {new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Document</span>
                        <span className="text-foreground font-medium">
                          {documentTypes.find((d) => d.value === selectedDocType)?.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Name</span>
                        <span className="text-foreground font-medium">
                          {personalData.firstName} {personalData.lastName}
                        </span>
                      </div>
                      <div className="h-px bg-border" />
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Estimated Completion</span>
                        <span className="text-foreground font-medium">Within 24 hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar (demo) */}
                  <div className="max-w-sm mx-auto mb-6">
                    <div className="flex items-center justify-between text-xs text-muted mb-2">
                      <span>Review Progress</span>
                      <span>{Math.min(reviewTimer * 10, 100)}%</span>
                    </div>
                    <div className="h-2 bg-background rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-warning to-accent rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(reviewTimer * 10, 100)}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                    <p className="text-[10px] text-muted mt-2">
                      Demo: Auto-approves in {Math.max(10 - reviewTimer, 0)} seconds
                    </p>
                  </div>

                  {/* What to expect */}
                  <div className="max-w-md mx-auto rounded-xl bg-info/5 border border-info/20 p-4 text-left">
                    <div className="flex items-start gap-3">
                      <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
                      <div className="text-xs text-muted space-y-1">
                        <p className="font-semibold text-info">What happens next?</p>
                        <ul className="space-y-0.5">
                          <li>- You will receive an email notification once the review is complete</li>
                          <li>- If additional information is needed, we will contact you via email</li>
                          <li>- You can continue trading with basic limits while verification is pending</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="mt-8">
                    <Link
                      href="/profile"
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground bg-card-hover hover:bg-border transition-colors"
                    >
                      Back to Profile
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ========== APPROVED ========== */}
          {currentStep === "approved" && (
            <motion.div
              key="approved"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
            >
              <div className="rounded-2xl bg-card border border-border overflow-hidden">
                <div className="p-8 sm:p-12 text-center">
                  {/* Success Animation */}
                  <div className="relative mx-auto mb-6 h-24 w-24">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                      className="relative h-24 w-24 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center"
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                      >
                        <ShieldCheck className="h-10 w-10 text-accent" />
                      </motion.div>
                    </motion.div>
                    {/* Confetti dots */}
                    {[...Array(8)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{
                          opacity: [0, 1, 0],
                          scale: [0, 1, 0],
                          x: [0, (Math.cos((i * Math.PI) / 4) * 60)],
                          y: [0, (Math.sin((i * Math.PI) / 4) * 60)],
                        }}
                        transition={{ duration: 1, delay: 0.7 + i * 0.05 }}
                        className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full"
                        style={{
                          backgroundColor: ["#00c26f", "#06b6d4", "#8b5cf6", "#f59e0b", "#00c26f", "#06b6d4", "#8b5cf6", "#f59e0b"][i],
                        }}
                      />
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <h2 className="text-2xl font-bold text-foreground mb-2">
                      Verification Approved!
                    </h2>
                    <p className="text-sm text-muted max-w-md mx-auto mb-8">
                      Congratulations! Your identity has been verified successfully. You now have full access to all Quantum Exchange features.
                    </p>
                  </motion.div>

                  {/* Unlocked Features */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="max-w-md mx-auto mb-8"
                  >
                    <div className="rounded-xl bg-accent/5 border border-accent/20 p-5">
                      <p className="text-xs font-bold text-accent mb-3 flex items-center justify-center gap-2">
                        <BadgeCheck className="h-4 w-4" />
                        Unlocked Features
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { label: "Unlimited Deposits", icon: ArrowRight },
                          { label: "$100K/day Withdrawal", icon: Zap },
                          { label: "Futures Trading", icon: Shield },
                          { label: "Lower Fees", icon: BadgeCheck },
                        ].map((feat) => {
                          const Icon = feat.icon;
                          return (
                            <div key={feat.label} className="flex items-center gap-2 text-xs text-foreground">
                              <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                              {feat.label}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>

                  {/* Verification Details */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1 }}
                    className="max-w-sm mx-auto rounded-xl bg-background border border-border p-5 mb-8"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Status</span>
                        <span className="text-accent font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="h-3 w-3" />
                          Verified
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">KYC Level</span>
                        <span className="text-foreground font-medium">Advanced</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Verified Name</span>
                        <span className="text-foreground font-medium">
                          {personalData.firstName} {personalData.lastName}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted">Verified On</span>
                        <span className="text-foreground font-medium">
                          {new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                        </span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-3"
                  >
                    <Link
                      href="/trade/btc-usdt"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-all hover:shadow-lg hover:shadow-accent/20"
                    >
                      Start Trading
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link
                      href="/profile"
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-muted hover:text-foreground bg-card-hover hover:bg-border transition-colors"
                    >
                      View Profile
                    </Link>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
