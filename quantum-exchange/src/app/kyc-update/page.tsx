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
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Upload,
  AlertCircle,
  CreditCard,
  Globe,
  MapPin,
  Calendar,
  Phone,
  Mail,
  Building,
  Loader2,
  ArrowRight,
  Lock,
  Trash2,
  Info,
  BadgeCheck,
  Edit3,
  Clock,
  Briefcase,
  DollarSign,
  FileCheck,
  AlertTriangle,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils";

type UpdateSection = "overview" | "personal" | "address" | "employment" | "documents" | "review";

interface PersonalUpdateData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  nationality: string;
  phone: string;
  email: string;
  nik: string;
  npwp: string;
  motherMaidenName: string;
  placeOfBirth: string;
}

interface AddressData {
  address: string;
  rt: string;
  rw: string;
  kelurahan: string;
  kecamatan: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
  sameAsDomicile: boolean;
  domicileAddress: string;
  domicileCity: string;
  domicileProvince: string;
  domicilePostalCode: string;
}

interface EmploymentData {
  occupation: string;
  companyName: string;
  industry: string;
  annualIncome: string;
  sourceOfFunds: string;
  purposeOfAccount: string;
}

interface UploadedFile {
  name: string;
  size: string;
  preview: string;
}

const indonesianProvinces = [
  "DKI Jakarta", "Jawa Barat", "Jawa Tengah", "Jawa Timur", "Banten",
  "DI Yogyakarta", "Bali", "Sumatera Utara", "Sumatera Barat", "Sumatera Selatan",
  "Riau", "Kepulauan Riau", "Lampung", "Kalimantan Barat", "Kalimantan Timur",
  "Kalimantan Selatan", "Sulawesi Selatan", "Sulawesi Utara", "Papua", "Maluku",
  "Nusa Tenggara Barat", "Nusa Tenggara Timur", "Aceh", "Bengkulu", "Jambi",
  "Kalimantan Tengah", "Kalimantan Utara", "Kepulauan Bangka Belitung",
  "Gorontalo", "Papua Barat", "Sulawesi Barat", "Sulawesi Tengah", "Sulawesi Tenggara", "Maluku Utara",
];

const occupations = [
  "Employee (Private Sector)", "Employee (Government/BUMN)", "Self-Employed / Entrepreneur",
  "Professional (Doctor, Lawyer, etc.)", "Freelancer", "Student", "Retired", "Housewife/Househusband", "Other",
];

const industries = [
  "Technology", "Finance & Banking", "Healthcare", "Education", "Manufacturing",
  "Retail & E-commerce", "Real Estate", "Agriculture", "Mining", "Transportation",
  "Hospitality", "Media & Entertainment", "Government", "Non-Profit", "Other",
];

const incomeRanges = [
  "< Rp 50,000,000/year",
  "Rp 50,000,000 - Rp 100,000,000/year",
  "Rp 100,000,000 - Rp 250,000,000/year",
  "Rp 250,000,000 - Rp 500,000,000/year",
  "Rp 500,000,000 - Rp 1,000,000,000/year",
  "> Rp 1,000,000,000/year",
];

const fundSources = [
  "Salary/Wages", "Business Income", "Investment Returns", "Inheritance",
  "Savings", "Pension", "Gift/Donation", "Rental Income", "Other",
];

const accountPurposes = [
  "Investment / Trading", "Savings / Store of Value", "Remittance / Transfer",
  "Payment / Transaction", "Hedging", "Other",
];

const changeHistory = [
  { date: "2025-01-15", field: "Phone Number", oldValue: "+62 812 1234 ****", newValue: "+62 812 3456 ****", status: "approved" },
  { date: "2024-11-20", field: "Address", oldValue: "Jl. Sudirman No. 10", newValue: "Jl. Gatot Subroto No. 25", status: "approved" },
  { date: "2024-09-05", field: "KTP Document", oldValue: "ktp_old.jpg", newValue: "ktp_new.jpg", status: "approved" },
];

export default function KYCUpdatePage() {
  const [activeSection, setActiveSection] = useState<UpdateSection>("overview");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [changeReason, setChangeReason] = useState("");

  const [personalData, setPersonalData] = useState<PersonalUpdateData>({
    firstName: "Ahmad",
    lastName: "Rizki",
    dateOfBirth: "1995-03-15",
    gender: "male",
    nationality: "Indonesia",
    phone: "+62 812 3456 7890",
    email: "ahmad.rizki@email.com",
    nik: "3175041503950001",
    npwp: "12.345.678.9-012.000",
    motherMaidenName: "Siti Aminah",
    placeOfBirth: "Jakarta",
  });

  const [addressData, setAddressData] = useState<AddressData>({
    address: "Jl. Gatot Subroto No. 25, RT 005/RW 003",
    rt: "005",
    rw: "003",
    kelurahan: "Karet Semanggi",
    kecamatan: "Setiabudi",
    city: "Jakarta Selatan",
    province: "DKI Jakarta",
    postalCode: "12930",
    country: "Indonesia",
    sameAsDomicile: true,
    domicileAddress: "",
    domicileCity: "",
    domicileProvince: "",
    domicilePostalCode: "",
  });

  const [employmentData, setEmploymentData] = useState<EmploymentData>({
    occupation: "Employee (Private Sector)",
    companyName: "PT Technology Indonesia",
    industry: "Technology",
    annualIncome: "Rp 100,000,000 - Rp 250,000,000/year",
    sourceOfFunds: "Salary/Wages",
    purposeOfAccount: "Investment / Trading",
  });

  const [newKtp, setNewKtp] = useState<UploadedFile | null>(null);
  const [newSelfie, setNewSelfie] = useState<UploadedFile | null>(null);
  const ktpInputRef = useRef<HTMLInputElement>(null);
  const selfieInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (setter: (file: UploadedFile | null) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setter({ name: file.name, size: (file.size / 1024 / 1024).toFixed(2) + " MB", preview });
      }
    },
    []
  );

  const handleSubmitUpdate = async () => {
    if (!changeReason) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setSubmitted(true);
  };

  const sectionItems = [
    { key: "overview" as UpdateSection, label: "Overview", icon: Shield, desc: "View current KYC status" },
    { key: "personal" as UpdateSection, label: "Personal Data", icon: User, desc: "Update personal info" },
    { key: "address" as UpdateSection, label: "Address", icon: MapPin, desc: "Update address info" },
    { key: "employment" as UpdateSection, label: "Employment & Financial", icon: Briefcase, desc: "Update employment & source of funds" },
    { key: "documents" as UpdateSection, label: "Documents", icon: FileText, desc: "Re-upload KTP/Selfie" },
    { key: "review" as UpdateSection, label: "Submit Changes", icon: FileCheck, desc: "Review & submit updates" },
  ];

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center">
                <Edit3 className="h-5 w-5 text-background" />
              </div>
              Update KYC Data
            </h1>
            <p className="text-sm text-muted mt-1">Update your verified identity information. Changes require re-verification.</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-accent/10 text-accent text-xs font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              KYC Verified (Advanced)
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-[260px_1fr] gap-6">
          {/* Sidebar Navigation */}
          <div className="rounded-2xl bg-card border border-border p-3 h-fit sticky top-24">
            <div className="space-y-1">
              {sectionItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveSection(item.key)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all",
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "text-muted hover:text-foreground hover:bg-card-hover"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div>
                      <p className="text-xs font-semibold">{item.label}</p>
                      <p className="text-[10px] text-muted">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content */}
          <div>
            <AnimatePresence mode="wait">
              {/* ======== OVERVIEW ======== */}
              {activeSection === "overview" && (
                <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  {/* Current Status */}
                  <div className="rounded-2xl bg-gradient-to-br from-card via-card to-accent/5 border border-border p-6 mb-6">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="h-16 w-16 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center">
                        <ShieldCheck className="h-8 w-8 text-accent" />
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground">Verification Status: Advanced</h2>
                        <p className="text-sm text-muted">Your identity is fully verified. All platform features are unlocked.</p>
                        <p className="text-xs text-muted mt-1">Verified on: January 10, 2025</p>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      {[
                        { label: "KYC Level", value: "Advanced", color: "text-accent", bg: "bg-accent/10" },
                        { label: "Daily Withdrawal Limit", value: "$100,000", color: "text-info", bg: "bg-info/10" },
                        { label: "Account Status", value: "Active", color: "text-accent", bg: "bg-accent/10" },
                      ].map((item) => (
                        <div key={item.label} className="rounded-xl bg-background border border-border p-4 text-center">
                          <p className="text-xs text-muted mb-1">{item.label}</p>
                          <p className={cn("text-lg font-bold", item.color)}>{item.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Current Data Summary */}
                  <div className="rounded-2xl bg-card border border-border mb-6">
                    <div className="px-6 py-4 border-b border-border">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <User className="h-4 w-4 text-accent" />
                        Current Verified Data
                      </h3>
                    </div>
                    <div className="p-6">
                      <div className="grid sm:grid-cols-2 gap-4">
                        {[
                          { label: "Full Name", value: `${personalData.firstName} ${personalData.lastName}` },
                          { label: "NIK", value: personalData.nik.replace(/(\d{4})(\d{4})(\d{4})(\d{4})/, "$1 $2 $3 $4") },
                          { label: "NPWP", value: personalData.npwp },
                          { label: "Date of Birth", value: new Date(personalData.dateOfBirth).toLocaleDateString("id-ID", { dateStyle: "long" }) },
                          { label: "Phone", value: personalData.phone },
                          { label: "Email", value: personalData.email },
                          { label: "Address", value: `${addressData.address}, ${addressData.city}` },
                          { label: "Occupation", value: employmentData.occupation },
                        ].map((item) => (
                          <div key={item.label} className="flex items-start justify-between p-3 rounded-xl bg-background border border-border">
                            <div>
                              <p className="text-[10px] text-muted uppercase tracking-wider">{item.label}</p>
                              <p className="text-sm text-foreground font-medium mt-0.5">{item.value}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Change History */}
                  <div className="rounded-2xl bg-card border border-border mb-6">
                    <div className="px-6 py-4 border-b border-border">
                      <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <History className="h-4 w-4 text-info" />
                        Change History
                      </h3>
                    </div>
                    <div className="divide-y divide-border/50">
                      {changeHistory.map((change, i) => (
                        <div key={i} className="px-6 py-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-info/10 flex items-center justify-center">
                              <Edit3 className="h-3.5 w-3.5 text-info" />
                            </div>
                            <div>
                              <p className="text-xs font-medium text-foreground">{change.field}</p>
                              <p className="text-[10px] text-muted">{change.date}</p>
                            </div>
                          </div>
                          <span className="px-2 py-1 rounded-lg bg-accent/10 text-accent text-[10px] font-semibold">
                            {change.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Important Notice */}
                  <div className="rounded-xl bg-warning/5 border border-warning/20 p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                      <div className="text-xs text-muted space-y-1">
                        <p className="font-semibold text-warning">Important Notice (OJK Regulation)</p>
                        <ul className="space-y-0.5">
                          <li>- Changes to KYC data require re-verification by our compliance team (1-3 business days)</li>
                          <li>- During review, your current verification level remains active</li>
                          <li>- Document changes may require new selfie verification per Bappebti/OJK guidelines</li>
                          <li>- All changes are logged and auditable per POJK anti-money laundering regulations</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ======== PERSONAL DATA ======== */}
              {activeSection === "personal" && (
                <motion.div key="personal" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="rounded-2xl bg-card border border-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                      <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <User className="h-4 w-4 text-accent" />
                        Update Personal Information
                      </h2>
                      <p className="text-xs text-muted mt-1">Fields marked with * are required per OJK regulation</p>
                    </div>

                    <div className="p-6 space-y-5">
                      {/* Name */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">First Name <span className="text-danger">*</span></label>
                          <input type="text" value={personalData.firstName} onChange={(e) => setPersonalData({ ...personalData, firstName: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Last Name <span className="text-danger">*</span></label>
                          <input type="text" value={personalData.lastName} onChange={(e) => setPersonalData({ ...personalData, lastName: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                        </div>
                      </div>

                      {/* NIK & NPWP (OJK Required) */}
                      <div className="rounded-xl bg-info/5 border border-info/20 p-4 mb-2">
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
                            <input type="text" value={personalData.nik} onChange={(e) => setPersonalData({ ...personalData, nik: e.target.value.replace(/\D/g, "").slice(0, 16) })}
                              placeholder="16-digit NIK number" maxLength={16}
                              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground font-mono placeholder:text-muted/50 outline-none focus:border-border-light transition-colors" />
                          </div>
                          <p className="text-[10px] text-muted mt-1">{personalData.nik.length}/16 digits</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">
                            NPWP (Nomor Pokok Wajib Pajak) <span className="text-danger">*</span>
                          </label>
                          <div className="relative">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                            <input type="text" value={personalData.npwp} onChange={(e) => setPersonalData({ ...personalData, npwp: e.target.value })}
                              placeholder="XX.XXX.XXX.X-XXX.XXX"
                              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground font-mono placeholder:text-muted/50 outline-none focus:border-border-light transition-colors" />
                          </div>
                        </div>
                      </div>

                      {/* DOB, Place of Birth, Gender */}
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Place of Birth <span className="text-danger">*</span></label>
                          <input type="text" value={personalData.placeOfBirth} onChange={(e) => setPersonalData({ ...personalData, placeOfBirth: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Date of Birth <span className="text-danger">*</span></label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                            <input type="date" value={personalData.dateOfBirth} onChange={(e) => setPersonalData({ ...personalData, dateOfBirth: e.target.value })}
                              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Gender <span className="text-danger">*</span></label>
                          <select value={personalData.gender} onChange={(e) => setPersonalData({ ...personalData, gender: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none">
                            <option value="male">Male / Laki-laki</option>
                            <option value="female">Female / Perempuan</option>
                          </select>
                        </div>
                      </div>

                      {/* Mother's Maiden Name (OJK AML requirement) */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">
                            Mother&apos;s Maiden Name <span className="text-danger">*</span>
                          </label>
                          <input type="text" value={personalData.motherMaidenName} onChange={(e) => setPersonalData({ ...personalData, motherMaidenName: e.target.value })}
                            placeholder="As per KTP/birth certificate"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors" />
                          <p className="text-[10px] text-muted mt-1">Required per OJK AML regulation for identity verification</p>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Nationality <span className="text-danger">*</span></label>
                          <div className="relative">
                            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                            <select value={personalData.nationality} onChange={(e) => setPersonalData({ ...personalData, nationality: e.target.value })}
                              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none">
                              <option value="Indonesia">Indonesia</option>
                              <option value="Other">Other</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Contact */}
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Phone Number <span className="text-danger">*</span></label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                            <input type="tel" value={personalData.phone} onChange={(e) => setPersonalData({ ...personalData, phone: e.target.value })}
                              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Email <span className="text-danger">*</span></label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                            <input type="email" value={personalData.email} onChange={(e) => setPersonalData({ ...personalData, email: e.target.value })}
                              className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-border flex justify-end">
                      <button onClick={() => setActiveSection("address")}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-all hover:shadow-lg hover:shadow-accent/20">
                        Next: Address <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ======== ADDRESS ======== */}
              {activeSection === "address" && (
                <motion.div key="address" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="rounded-2xl bg-card border border-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                      <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-accent" />
                        Update Address (Sesuai KTP)
                      </h2>
                      <p className="text-xs text-muted mt-1">Address must match your KTP/identity document per Bappebti regulation</p>
                    </div>

                    <div className="p-6 space-y-5">
                      <div>
                        <label className="text-xs font-medium text-muted mb-1.5 block">Street Address <span className="text-danger">*</span></label>
                        <div className="relative">
                          <MapPin className="absolute left-4 top-3.5 h-4 w-4 text-muted pointer-events-none" />
                          <input type="text" value={addressData.address} onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">RT</label>
                          <input type="text" value={addressData.rt} onChange={(e) => setAddressData({ ...addressData, rt: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">RW</label>
                          <input type="text" value={addressData.rw} onChange={(e) => setAddressData({ ...addressData, rw: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Kelurahan <span className="text-danger">*</span></label>
                          <input type="text" value={addressData.kelurahan} onChange={(e) => setAddressData({ ...addressData, kelurahan: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Kecamatan <span className="text-danger">*</span></label>
                          <input type="text" value={addressData.kecamatan} onChange={(e) => setAddressData({ ...addressData, kecamatan: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-3 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">City/Regency <span className="text-danger">*</span></label>
                          <input type="text" value={addressData.city} onChange={(e) => setAddressData({ ...addressData, city: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Province <span className="text-danger">*</span></label>
                          <select value={addressData.province} onChange={(e) => setAddressData({ ...addressData, province: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none">
                            <option value="">Select province</option>
                            {indonesianProvinces.map((p) => <option key={p} value={p}>{p}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Postal Code <span className="text-danger">*</span></label>
                          <input type="text" value={addressData.postalCode} onChange={(e) => setAddressData({ ...addressData, postalCode: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                        </div>
                      </div>

                      <div className="h-px bg-border" />

                      {/* Domicile Address */}
                      <label className="flex items-center gap-2.5 cursor-pointer">
                        <input type="checkbox" checked={addressData.sameAsDomicile}
                          onChange={(e) => setAddressData({ ...addressData, sameAsDomicile: e.target.checked })}
                          className="h-4 w-4 rounded border-border accent-accent" />
                        <span className="text-xs text-muted">Domicile address same as KTP address</span>
                      </label>

                      {!addressData.sameAsDomicile && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="space-y-4">
                          <p className="text-xs font-semibold text-foreground">Domicile Address (Alamat Domisili)</p>
                          <div>
                            <label className="text-xs font-medium text-muted mb-1.5 block">Domicile Address <span className="text-danger">*</span></label>
                            <input type="text" value={addressData.domicileAddress} onChange={(e) => setAddressData({ ...addressData, domicileAddress: e.target.value })}
                              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                          </div>
                          <div className="grid sm:grid-cols-3 gap-4">
                            <div>
                              <label className="text-xs font-medium text-muted mb-1.5 block">City</label>
                              <input type="text" value={addressData.domicileCity} onChange={(e) => setAddressData({ ...addressData, domicileCity: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted mb-1.5 block">Province</label>
                              <select value={addressData.domicileProvince} onChange={(e) => setAddressData({ ...addressData, domicileProvince: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none">
                                <option value="">Select province</option>
                                {indonesianProvinces.map((p) => <option key={p} value={p}>{p}</option>)}
                              </select>
                            </div>
                            <div>
                              <label className="text-xs font-medium text-muted mb-1.5 block">Postal Code</label>
                              <input type="text" value={addressData.domicilePostalCode} onChange={(e) => setAddressData({ ...addressData, domicilePostalCode: e.target.value })}
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </div>

                    <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                      <button onClick={() => setActiveSection("personal")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors">
                        <ChevronLeft className="h-4 w-4" /> Back
                      </button>
                      <button onClick={() => setActiveSection("employment")}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-all hover:shadow-lg hover:shadow-accent/20">
                        Next: Employment <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ======== EMPLOYMENT & FINANCIAL ======== */}
              {activeSection === "employment" && (
                <motion.div key="employment" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="rounded-2xl bg-card border border-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                      <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-accent" />
                        Employment & Financial Information
                      </h2>
                      <p className="text-xs text-muted mt-1">Required per POJK No. 12/2017 (AML/CFT) and Bappebti regulation for customer due diligence</p>
                    </div>

                    <div className="p-6 space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Occupation <span className="text-danger">*</span></label>
                          <select value={employmentData.occupation} onChange={(e) => setEmploymentData({ ...employmentData, occupation: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none">
                            <option value="">Select occupation</option>
                            {occupations.map((o) => <option key={o} value={o}>{o}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-medium text-muted mb-1.5 block">Industry</label>
                          <select value={employmentData.industry} onChange={(e) => setEmploymentData({ ...employmentData, industry: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none">
                            <option value="">Select industry</option>
                            {industries.map((ind) => <option key={ind} value={ind}>{ind}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted mb-1.5 block">Company / Business Name</label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                          <input type="text" value={employmentData.companyName} onChange={(e) => setEmploymentData({ ...employmentData, companyName: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors" />
                        </div>
                      </div>

                      <div className="h-px bg-border" />

                      <div>
                        <label className="text-xs font-medium text-muted mb-1.5 block">
                          Annual Income Range <span className="text-danger">*</span>
                        </label>
                        <div className="relative">
                          <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted pointer-events-none" />
                          <select value={employmentData.annualIncome} onChange={(e) => setEmploymentData({ ...employmentData, annualIncome: e.target.value })}
                            className="w-full bg-background border border-border rounded-xl pl-11 pr-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none">
                            <option value="">Select income range</option>
                            {incomeRanges.map((r) => <option key={r} value={r}>{r}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted mb-1.5 block">
                          Source of Funds <span className="text-danger">*</span>
                        </label>
                        <select value={employmentData.sourceOfFunds} onChange={(e) => setEmploymentData({ ...employmentData, sourceOfFunds: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none">
                          <option value="">Select source of funds</option>
                          {fundSources.map((s) => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <p className="text-[10px] text-muted mt-1">Required per POJK No. 12/2017 for Anti-Money Laundering compliance</p>
                      </div>

                      <div>
                        <label className="text-xs font-medium text-muted mb-1.5 block">
                          Purpose of Opening Account <span className="text-danger">*</span>
                        </label>
                        <select value={employmentData.purposeOfAccount} onChange={(e) => setEmploymentData({ ...employmentData, purposeOfAccount: e.target.value })}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground outline-none focus:border-border-light transition-colors appearance-none">
                          <option value="">Select purpose</option>
                          {accountPurposes.map((p) => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>

                      {/* PEP Declaration */}
                      <div className="rounded-xl bg-warning/5 border border-warning/20 p-4">
                        <p className="text-xs font-semibold text-warning mb-2">PEP Declaration (Politically Exposed Person)</p>
                        <p className="text-[10px] text-muted mb-3">Per OJK regulation, we are required to identify customers who are Politically Exposed Persons (PEP) or have relations with PEP.</p>
                        <div className="space-y-2">
                          <label className="flex items-start gap-2.5 cursor-pointer">
                            <input type="radio" name="pep" defaultChecked className="mt-0.5 accent-accent" />
                            <span className="text-xs text-muted">I am NOT a Politically Exposed Person (PEP)</span>
                          </label>
                          <label className="flex items-start gap-2.5 cursor-pointer">
                            <input type="radio" name="pep" className="mt-0.5 accent-accent" />
                            <span className="text-xs text-muted">I AM or have relations with a Politically Exposed Person (PEP)</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                      <button onClick={() => setActiveSection("address")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors">
                        <ChevronLeft className="h-4 w-4" /> Back
                      </button>
                      <button onClick={() => setActiveSection("documents")}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-all hover:shadow-lg hover:shadow-accent/20">
                        Next: Documents <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ======== DOCUMENTS ======== */}
              {activeSection === "documents" && (
                <motion.div key="documents" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="rounded-2xl bg-card border border-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                      <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <FileText className="h-4 w-4 text-accent" />
                        Re-Upload Documents
                      </h2>
                      <p className="text-xs text-muted mt-1">Upload new documents if your KTP has been renewed or changed</p>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="rounded-xl bg-info/5 border border-info/20 p-4">
                        <div className="flex items-start gap-3">
                          <Info className="h-4 w-4 text-info shrink-0 mt-0.5" />
                          <div className="text-xs text-muted space-y-1">
                            <p className="font-semibold text-info">Document Requirements</p>
                            <ul className="space-y-0.5">
                              <li>- KTP (e-KTP) must be valid and not expired</li>
                              <li>- Photo must be clear with all four corners visible</li>
                              <li>- New selfie required when updating KTP document</li>
                              <li>- Accepted formats: JPG, PNG (max 10MB)</li>
                            </ul>
                          </div>
                        </div>
                      </div>

                      {/* KTP Upload */}
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-3 block">
                          New KTP (e-KTP) Photo
                        </label>
                        <input ref={ktpInputRef} type="file" accept="image/*" onChange={handleFileUpload(setNewKtp)} className="hidden" />
                        {newKtp ? (
                          <div className="relative rounded-xl border border-accent/30 bg-accent/5 overflow-hidden">
                            <div className="aspect-[3/2] bg-background flex items-center justify-center">
                              <img src={newKtp.preview} alt="New KTP" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex items-center justify-between px-4 py-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                                <span className="text-xs text-foreground truncate">{newKtp.name}</span>
                                <span className="text-[10px] text-muted shrink-0">{newKtp.size}</span>
                              </div>
                              <button onClick={() => setNewKtp(null)} className="text-danger hover:text-danger-hover transition-colors">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => ktpInputRef.current?.click()}
                            className="w-full aspect-[3/2] max-h-48 rounded-xl border-2 border-dashed border-border hover:border-border-light bg-background flex flex-col items-center justify-center gap-2 transition-colors group">
                            <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:bg-card-hover transition-colors">
                              <Upload className="h-5 w-5 text-muted" />
                            </div>
                            <span className="text-xs text-muted">Click to upload new KTP photo</span>
                            <span className="text-[10px] text-muted/60">JPG or PNG up to 10MB</span>
                          </button>
                        )}
                      </div>

                      {/* Selfie Upload */}
                      <div>
                        <label className="text-xs font-semibold text-foreground mb-3 block">
                          New Selfie with KTP
                        </label>
                        <input ref={selfieInputRef} type="file" accept="image/*" capture="user" onChange={handleFileUpload(setNewSelfie)} className="hidden" />
                        {newSelfie ? (
                          <div className="relative rounded-xl border border-accent/30 bg-accent/5 overflow-hidden">
                            <div className="aspect-[4/3] max-h-64 bg-background flex items-center justify-center">
                              <img src={newSelfie.preview} alt="New Selfie" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex items-center justify-between px-4 py-3">
                              <div className="flex items-center gap-2 min-w-0">
                                <CheckCircle2 className="h-3.5 w-3.5 text-accent shrink-0" />
                                <span className="text-xs text-foreground truncate">{newSelfie.name}</span>
                                <span className="text-[10px] text-muted shrink-0">{newSelfie.size}</span>
                              </div>
                              <button onClick={() => setNewSelfie(null)} className="text-danger hover:text-danger-hover transition-colors">
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button onClick={() => selfieInputRef.current?.click()}
                            className="w-full aspect-[4/3] max-h-48 rounded-xl border-2 border-dashed border-border hover:border-border-light bg-background flex flex-col items-center justify-center gap-2 transition-colors group">
                            <div className="h-10 w-10 rounded-xl bg-card border border-border flex items-center justify-center group-hover:bg-card-hover transition-colors">
                              <Camera className="h-5 w-5 text-muted" />
                            </div>
                            <span className="text-xs text-muted">Click to take a new selfie holding KTP</span>
                            <span className="text-[10px] text-muted/60">JPG or PNG up to 10MB</span>
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                      <button onClick={() => setActiveSection("employment")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors">
                        <ChevronLeft className="h-4 w-4" /> Back
                      </button>
                      <button onClick={() => setActiveSection("review")}
                        className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-hover text-background text-sm font-semibold transition-all hover:shadow-lg hover:shadow-accent/20">
                        Review Changes <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ======== REVIEW & SUBMIT ======== */}
              {activeSection === "review" && !submitted && (
                <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="rounded-2xl bg-card border border-border overflow-hidden">
                    <div className="px-6 py-4 border-b border-border">
                      <h2 className="text-sm font-bold text-foreground flex items-center gap-2">
                        <FileCheck className="h-4 w-4 text-accent" />
                        Review & Submit Changes
                      </h2>
                      <p className="text-xs text-muted mt-1">Please review your updated information before submitting</p>
                    </div>

                    <div className="p-6 space-y-5">
                      {/* Summary Cards */}
                      <div className="space-y-4">
                        <div className="rounded-xl bg-background border border-border p-4">
                          <p className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                            <User className="h-3.5 w-3.5 text-accent" /> Personal Data
                          </p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {[
                              { l: "Name", v: `${personalData.firstName} ${personalData.lastName}` },
                              { l: "NIK", v: personalData.nik },
                              { l: "NPWP", v: personalData.npwp },
                              { l: "Phone", v: personalData.phone },
                              { l: "Place/Date of Birth", v: `${personalData.placeOfBirth}, ${personalData.dateOfBirth}` },
                              { l: "Mother's Name", v: personalData.motherMaidenName },
                            ].map((item) => (
                              <div key={item.l} className="flex items-center justify-between text-xs py-1">
                                <span className="text-muted">{item.l}</span>
                                <span className="text-foreground font-medium">{item.v}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl bg-background border border-border p-4">
                          <p className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-accent" /> Address
                          </p>
                          <div className="space-y-1">
                            <p className="text-xs text-foreground">{addressData.address}</p>
                            <p className="text-xs text-muted">
                              {addressData.kelurahan}, {addressData.kecamatan}, {addressData.city}, {addressData.province} {addressData.postalCode}
                            </p>
                          </div>
                        </div>

                        <div className="rounded-xl bg-background border border-border p-4">
                          <p className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                            <Briefcase className="h-3.5 w-3.5 text-accent" /> Employment & Financial
                          </p>
                          <div className="grid sm:grid-cols-2 gap-2">
                            {[
                              { l: "Occupation", v: employmentData.occupation },
                              { l: "Income", v: employmentData.annualIncome },
                              { l: "Source of Funds", v: employmentData.sourceOfFunds },
                              { l: "Purpose", v: employmentData.purposeOfAccount },
                            ].map((item) => (
                              <div key={item.l} className="flex items-center justify-between text-xs py-1">
                                <span className="text-muted">{item.l}</span>
                                <span className="text-foreground font-medium text-right">{item.v}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {(newKtp || newSelfie) && (
                          <div className="rounded-xl bg-background border border-border p-4">
                            <p className="text-xs font-bold text-foreground mb-3 flex items-center gap-2">
                              <FileText className="h-3.5 w-3.5 text-accent" /> Updated Documents
                            </p>
                            <div className="space-y-2">
                              {newKtp && (
                                <div className="flex items-center gap-2 text-xs">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                                  <span className="text-foreground">New KTP: {newKtp.name} ({newKtp.size})</span>
                                </div>
                              )}
                              {newSelfie && (
                                <div className="flex items-center gap-2 text-xs">
                                  <CheckCircle2 className="h-3.5 w-3.5 text-accent" />
                                  <span className="text-foreground">New Selfie: {newSelfie.name} ({newSelfie.size})</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Reason for Change */}
                      <div>
                        <label className="text-xs font-medium text-muted mb-1.5 block">
                          Reason for Data Change <span className="text-danger">*</span>
                        </label>
                        <textarea
                          value={changeReason}
                          onChange={(e) => setChangeReason(e.target.value)}
                          placeholder="e.g., Updated address due to relocation, KTP renewal, etc."
                          rows={3}
                          className="w-full bg-background border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted/50 outline-none focus:border-border-light transition-colors resize-none"
                        />
                      </div>

                      {/* Agreements */}
                      <div className="space-y-2">
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-border accent-accent" />
                          <span className="text-xs text-muted leading-relaxed">
                            I declare that the information provided is true and accurate. I understand that providing false information may result in account suspension per OJK regulation.
                          </span>
                        </label>
                        <label className="flex items-start gap-2.5 cursor-pointer">
                          <input type="checkbox" className="mt-0.5 h-4 w-4 rounded border-border accent-accent" />
                          <span className="text-xs text-muted leading-relaxed">
                            I understand that KYC data changes require re-verification and may take 1-3 business days to process.
                          </span>
                        </label>
                      </div>
                    </div>

                    <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                      <button onClick={() => setActiveSection("documents")}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-muted hover:text-foreground hover:bg-card-hover transition-colors">
                        <ChevronLeft className="h-4 w-4" /> Back
                      </button>
                      <button
                        onClick={handleSubmitUpdate}
                        disabled={!changeReason || submitting}
                        className={cn(
                          "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all",
                          changeReason && !submitting
                            ? "bg-accent hover:bg-accent-hover text-background hover:shadow-lg hover:shadow-accent/20"
                            : "bg-border text-muted cursor-not-allowed"
                        )}
                      >
                        {submitting ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
                        ) : (
                          <>Submit Update Request <ArrowRight className="h-4 w-4" /></>
                        )}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ======== SUBMITTED SUCCESS ======== */}
              {activeSection === "review" && submitted && (
                <motion.div key="submitted" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                  <div className="rounded-2xl bg-card border border-border p-8 sm:p-12 text-center">
                    <div className="relative mx-auto mb-6 h-20 w-20">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.5 }}
                        className="relative h-20 w-20 rounded-full bg-accent/10 border-2 border-accent/30 flex items-center justify-center"
                      >
                        <CheckCircle2 className="h-10 w-10 text-accent" />
                      </motion.div>
                    </div>
                    <h2 className="text-xl font-bold text-foreground mb-2">Update Request Submitted</h2>
                    <p className="text-sm text-muted max-w-md mx-auto mb-6">
                      Your KYC data update request has been submitted for review. Our compliance team will verify your changes within 1-3 business days.
                    </p>

                    <div className="max-w-sm mx-auto rounded-xl bg-background border border-border p-5 mb-8">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">Request ID</span>
                          <span className="text-foreground font-mono font-medium">KYC-UPD-{Date.now().toString(36).toUpperCase()}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">Status</span>
                          <span className="text-warning font-semibold flex items-center gap-1.5">
                            <Clock className="h-3 w-3" /> Under Review
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">Submitted</span>
                          <span className="text-foreground font-medium">
                            {new Date().toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted">Estimated Completion</span>
                          <span className="text-foreground font-medium">1-3 Business Days</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Link href="/profile"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-all hover:shadow-lg hover:shadow-accent/20">
                        Back to Profile <ArrowRight className="h-4 w-4" />
                      </Link>
                      <Link href="/trade/btc-usdt"
                        className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-muted hover:text-foreground bg-card-hover hover:bg-border transition-colors">
                        Continue Trading
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
