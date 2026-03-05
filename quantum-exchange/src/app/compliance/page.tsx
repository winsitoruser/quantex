"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Shield,
  ShieldCheck,
  Scale,
  FileText,
  Users,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Lock,
  Eye,
  Globe,
  Building,
  BadgeCheck,
  Landmark,
  BookOpen,
  ArrowRight,
  Info,
  Fingerprint,
  BanknoteIcon,
  UserCheck,
  FileSearch,
  Bell,
  Server,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface RegulationItem {
  id: string;
  regulation: string;
  title: string;
  description: string;
  requirements: string[];
  icon: typeof Shield;
  color: string;
  bg: string;
}

const regulations: RegulationItem[] = [
  {
    id: "pojk-12",
    regulation: "POJK No. 12/POJK.01/2017",
    title: "Anti-Money Laundering & Counter Terrorism Financing (AML/CFT)",
    description:
      "Penerapan Program Anti Pencucian Uang dan Pencegahan Pendanaan Terorisme di Sektor Jasa Keuangan.",
    requirements: [
      "Customer Due Diligence (CDD) for all customers",
      "Enhanced Due Diligence (EDD) for high-risk customers & PEP",
      "Transaction monitoring & suspicious transaction reporting (LTKM/STR)",
      "Record keeping for minimum 5 years after account closure",
      "Customer identification using valid government-issued ID (KTP/Passport)",
      "Source of funds verification for transactions above threshold",
      "Ongoing monitoring of customer risk profile",
      "Appointment of AML/CFT compliance officer",
    ],
    icon: Shield,
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    id: "bappebti-8",
    regulation: "Peraturan Bappebti No. 8/2021",
    title: "Crypto Asset Trading Requirements",
    description:
      "Pedoman Penyelenggaraan Perdagangan Pasar Fisik Aset Kripto di Bursa Berjangka.",
    requirements: [
      "Mandatory NIK (National ID Number) verification for all Indonesian customers",
      "NPWP (Tax ID) collection and verification",
      "KTP (e-KTP) document upload and verification",
      "Selfie with KTP verification (liveness detection)",
      "Minimum age requirement: 18 years old",
      "Customer risk assessment and profiling",
      "Real-time transaction monitoring",
      "Cold wallet storage for minimum 70% of customer assets",
    ],
    icon: Landmark,
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    id: "pojk-77",
    regulation: "POJK No. 77/POJK.01/2016",
    title: "Information Technology-Based Financial Services",
    description:
      "Layanan Pinjam Meminjam Uang Berbasis Teknologi Informasi — applicable data protection standards.",
    requirements: [
      "Data encryption at rest and in transit (AES-256)",
      "Multi-factor authentication (2FA) for all accounts",
      "Regular security audits and penetration testing",
      "Incident response plan and breach notification",
      "Data center must be located in Indonesia or approved jurisdiction",
      "Customer data privacy and consent management",
      "Business continuity and disaster recovery plan",
      "Regular reporting to OJK/Bappebti",
    ],
    icon: Lock,
    color: "text-purple",
    bg: "bg-purple/10",
  },
  {
    id: "pp-71",
    regulation: "PP No. 71/2019",
    title: "Electronic System & Transaction Operations",
    description:
      "Penyelenggaraan Sistem dan Transaksi Elektronik — data protection and electronic transaction standards.",
    requirements: [
      "Personal data protection and processing consent",
      "Right to access, correct, and delete personal data",
      "Data breach notification within 14 days",
      "Electronic transaction records and audit trail",
      "System availability and reliability standards",
      "Cross-border data transfer restrictions",
    ],
    icon: Server,
    color: "text-cyan",
    bg: "bg-cyan/10",
  },
  {
    id: "permen-5",
    regulation: "Permendag No. 99/2018",
    title: "General Policy on Crypto Asset Futures Trading",
    description:
      "Kebijakan Umum Penyelenggaraan Perdagangan Berjangka Aset Kripto.",
    requirements: [
      "Only approved crypto assets may be traded (Bappebti whitelist)",
      "Exchange must maintain adequate capital requirements",
      "Customer fund segregation from company operational funds",
      "Daily settlement and reconciliation",
      "Trading fee transparency and disclosure",
      "Market manipulation prevention measures",
    ],
    icon: Scale,
    color: "text-warning",
    bg: "bg-warning/10",
  },
];

const complianceFeatures = [
  {
    icon: Fingerprint,
    title: "KYC Verification",
    desc: "Multi-level identity verification with NIK, KTP, selfie, and liveness detection per Bappebti standards",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: Shield,
    title: "AML Screening",
    desc: "Real-time screening against PPATK watchlists, PEP databases, and international sanctions lists",
    color: "text-info",
    bg: "bg-info/10",
  },
  {
    icon: Eye,
    title: "Transaction Monitoring",
    desc: "24/7 automated monitoring of all transactions with threshold alerts and pattern detection",
    color: "text-purple",
    bg: "bg-purple/10",
  },
  {
    icon: FileSearch,
    title: "Suspicious Transaction Reporting",
    desc: "Automated STR/LTKM filing to PPATK for suspicious activities per POJK requirements",
    color: "text-warning",
    bg: "bg-warning/10",
  },
  {
    icon: Lock,
    title: "Data Protection",
    desc: "AES-256 encryption, data residency in Indonesia, and strict access controls per PP 71/2019",
    color: "text-cyan",
    bg: "bg-cyan/10",
  },
  {
    icon: BanknoteIcon,
    title: "Fund Segregation",
    desc: "Customer funds are fully segregated from operational funds with 70% cold storage requirement",
    color: "text-accent",
    bg: "bg-accent/10",
  },
  {
    icon: UserCheck,
    title: "PEP Screening",
    desc: "Enhanced due diligence for Politically Exposed Persons and their relatives per OJK mandate",
    color: "text-danger",
    bg: "bg-danger/10",
  },
  {
    icon: Bell,
    title: "Regulatory Reporting",
    desc: "Timely and accurate regulatory reports submitted to OJK, Bappebti, and PPATK",
    color: "text-info",
    bg: "bg-info/10",
  },
];

const kycLevels = [
  {
    level: "Level 1 — Basic",
    requirements: ["Email verification", "Phone number verification (OTP)"],
    limits: ["Deposit: Rp 10,000,000/day", "Withdraw: Rp 5,000,000/day", "Spot trading only"],
    color: "text-muted",
    border: "border-border",
  },
  {
    level: "Level 2 — Standard",
    requirements: [
      "NIK verification",
      "KTP (e-KTP) upload & verification",
      "Personal data (name, DOB, address as per KTP)",
      "Mother's maiden name",
    ],
    limits: ["Deposit: Rp 50,000,000/day", "Withdraw: Rp 25,000,000/day", "Spot + P2P trading"],
    color: "text-info",
    border: "border-info/20",
  },
  {
    level: "Level 3 — Advanced (Full KYC)",
    requirements: [
      "All Level 2 requirements",
      "Selfie with KTP (liveness check)",
      "NPWP verification",
      "Source of funds declaration",
      "Employment & income information",
      "PEP declaration",
      "Risk profile assessment",
    ],
    limits: [
      "Unlimited deposits",
      "Withdraw: Rp 1,000,000,000/day",
      "All trading features (Spot, Futures, Margin)",
      "P2P trading",
      "Lower trading fees",
    ],
    color: "text-accent",
    border: "border-accent/20",
  },
];

export default function CompliancePage() {
  const [expandedReg, setExpandedReg] = useState<string | null>("pojk-12");

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-5xl px-4 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="relative rounded-3xl bg-gradient-to-br from-card via-card to-accent/5 border border-border p-8 mb-10 overflow-hidden">
          <div className="absolute top-0 right-0 w-72 h-72 bg-accent/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/4" />
          <div className="relative">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-accent to-cyan flex items-center justify-center">
                <Scale className="h-7 w-7 text-background" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Regulatory Compliance
                </h1>
                <p className="text-sm text-muted mt-1">
                  OJK & Bappebti Standards for Crypto Asset Trading in Indonesia
                </p>
              </div>
            </div>
            <p className="text-sm text-muted leading-relaxed max-w-3xl mb-6">
              Quantum Exchange is committed to full regulatory compliance with Indonesian financial authorities.
              We adhere to all applicable regulations from OJK (Otoritas Jasa Keuangan), Bappebti (Badan Pengawas
              Perdagangan Berjangka Komoditi), and PPATK (Pusat Pelaporan dan Analisis Transaksi Keuangan)
              to ensure a safe, transparent, and legally compliant trading environment.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              {[
                { icon: ShieldCheck, label: "OJK Compliant" },
                { icon: Landmark, label: "Bappebti Licensed" },
                { icon: Lock, label: "PPATK Registered" },
                { icon: BadgeCheck, label: "ISO 27001" },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.label}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20"
                  >
                    <Icon className="h-3.5 w-3.5 text-accent" />
                    <span className="text-xs font-semibold text-accent">{badge.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Compliance Features Grid */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-2">
            Our Compliance Framework
          </h2>
          <p className="text-sm text-muted mb-6">
            How we implement OJK & Bappebti regulatory requirements
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {complianceFeatures.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-2xl bg-card border border-border p-5 hover:border-border-light transition-colors"
                >
                  <div
                    className={cn(
                      "h-10 w-10 rounded-xl flex items-center justify-center mb-3",
                      feature.bg
                    )}
                  >
                    <Icon className={cn("h-5 w-5", feature.color)} />
                  </div>
                  <p className="text-sm font-semibold text-foreground mb-1">
                    {feature.title}
                  </p>
                  <p className="text-xs text-muted leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* KYC Levels per OJK/Bappebti */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-2">
            KYC Verification Levels
          </h2>
          <p className="text-sm text-muted mb-6">
            Tiered verification per Bappebti regulation with progressive access to features
          </p>
          <div className="grid lg:grid-cols-3 gap-4">
            {kycLevels.map((level, i) => (
              <motion.div
                key={level.level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={cn(
                  "rounded-2xl bg-card border p-6",
                  level.border
                )}
              >
                <div className="flex items-center gap-2 mb-4">
                  <Shield className={cn("h-5 w-5", level.color)} />
                  <h3 className={cn("text-sm font-bold", level.color)}>
                    {level.level}
                  </h3>
                </div>

                <div className="mb-4">
                  <p className="text-xs font-semibold text-foreground mb-2">
                    Requirements
                  </p>
                  <ul className="space-y-1.5">
                    {level.requirements.map((req) => (
                      <li
                        key={req}
                        className="flex items-start gap-2 text-xs text-muted"
                      >
                        <CheckCircle2
                          className={cn(
                            "h-3.5 w-3.5 shrink-0 mt-0.5",
                            level.color
                          )}
                        />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <p className="text-xs font-semibold text-foreground mb-2">
                    Limits & Access
                  </p>
                  <ul className="space-y-1.5">
                    {level.limits.map((lim) => (
                      <li
                        key={lim}
                        className="flex items-center gap-2 text-xs text-muted"
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-muted shrink-0" />
                        {lim}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Applicable Regulations */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-2">
            Applicable Regulations
          </h2>
          <p className="text-sm text-muted mb-6">
            Key Indonesian regulations governing crypto asset trading that Quantum Exchange complies with
          </p>
          <div className="space-y-3">
            {regulations.map((reg) => {
              const Icon = reg.icon;
              const isExpanded = expandedReg === reg.id;
              return (
                <motion.div
                  key={reg.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={cn(
                    "rounded-2xl bg-card border overflow-hidden transition-colors",
                    isExpanded ? reg.bg.replace("/10", "/5") + " " + reg.color.replace("text-", "border-") + "/20" : "border-border"
                  )}
                >
                  <button
                    onClick={() =>
                      setExpandedReg(isExpanded ? null : reg.id)
                    }
                    className="w-full flex items-center gap-4 px-6 py-4 text-left"
                  >
                    <div
                      className={cn(
                        "h-10 w-10 rounded-xl flex items-center justify-center shrink-0",
                        reg.bg
                      )}
                    >
                      <Icon className={cn("h-5 w-5", reg.color)} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-mono text-muted">
                        {reg.regulation}
                      </p>
                      <p className="text-sm font-semibold text-foreground truncate">
                        {reg.title}
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted shrink-0 transition-transform",
                        isExpanded && "rotate-180"
                      )}
                    />
                  </button>

                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="px-6 pb-5"
                    >
                      <p className="text-xs text-muted mb-4 italic">
                        {reg.description}
                      </p>
                      <div className="rounded-xl bg-background border border-border p-4">
                        <p className="text-xs font-semibold text-foreground mb-3">
                          Key Requirements & How We Comply
                        </p>
                        <ul className="space-y-2">
                          {reg.requirements.map((req) => (
                            <li
                              key={req}
                              className="flex items-start gap-2.5 text-xs text-muted"
                            >
                              <CheckCircle2
                                className={cn(
                                  "h-3.5 w-3.5 shrink-0 mt-0.5",
                                  reg.color
                                )}
                              />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Regulatory Bodies */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-2">
            Regulatory Bodies
          </h2>
          <p className="text-sm text-muted mb-6">
            Indonesian authorities overseeing crypto asset trading
          </p>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              {
                name: "OJK",
                fullName: "Otoritas Jasa Keuangan",
                desc: "Financial Services Authority — oversees financial sector regulation, consumer protection, and AML/CFT compliance in Indonesia.",
                role: "AML/CFT supervision, consumer protection, financial stability",
                color: "text-accent",
                bg: "bg-accent/10",
              },
              {
                name: "Bappebti",
                fullName: "Badan Pengawas Perdagangan Berjangka Komoditi",
                desc: "Commodity Futures Trading Regulatory Agency — primary regulator for crypto asset exchanges in Indonesia.",
                role: "Crypto exchange licensing, trading rules, asset whitelist, customer protection",
                color: "text-info",
                bg: "bg-info/10",
              },
              {
                name: "PPATK",
                fullName: "Pusat Pelaporan dan Analisis Transaksi Keuangan",
                desc: "Indonesian Financial Transaction Reports and Analysis Centre — national AML/CFT intelligence unit.",
                role: "STR/LTKM reporting, financial intelligence, sanctions screening",
                color: "text-purple",
                bg: "bg-purple/10",
              },
            ].map((body) => (
              <div
                key={body.name}
                className="rounded-2xl bg-card border border-border p-6"
              >
                <div
                  className={cn(
                    "inline-flex px-3 py-1.5 rounded-lg text-xs font-bold mb-3",
                    body.bg,
                    body.color
                  )}
                >
                  {body.name}
                </div>
                <p className="text-xs font-semibold text-foreground mb-1">
                  {body.fullName}
                </p>
                <p className="text-xs text-muted leading-relaxed mb-3">
                  {body.desc}
                </p>
                <p className="text-[10px] text-muted">
                  <span className="font-semibold text-foreground">Role: </span>
                  {body.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* User Rights */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-foreground mb-2">
            Your Rights as a Customer
          </h2>
          <p className="text-sm text-muted mb-6">
            Per OJK consumer protection regulation and PP 71/2019
          </p>
          <div className="rounded-2xl bg-card border border-border p-6">
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                {
                  icon: Eye,
                  title: "Right to Information",
                  desc: "Access clear information about products, fees, risks, and terms of service",
                },
                {
                  icon: Lock,
                  title: "Data Privacy",
                  desc: "Your personal data is protected per PP 71/2019 with encryption and access controls",
                },
                {
                  icon: FileText,
                  title: "Right to Access",
                  desc: "Request access to, correction of, or deletion of your personal data at any time",
                },
                {
                  icon: Users,
                  title: "Fair Treatment",
                  desc: "Non-discriminatory treatment and transparent dispute resolution process",
                },
                {
                  icon: Bell,
                  title: "Breach Notification",
                  desc: "Timely notification in case of data breaches within 14 calendar days",
                },
                {
                  icon: BookOpen,
                  title: "Financial Literacy",
                  desc: "Access to educational resources about crypto risks and responsible trading",
                },
              ].map((right) => {
                const Icon = right.icon;
                return (
                  <div
                    key={right.title}
                    className="flex items-start gap-3 p-3 rounded-xl bg-background border border-border"
                  >
                    <div className="h-8 w-8 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                      <Icon className="h-4 w-4 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-foreground mb-0.5">
                        {right.title}
                      </p>
                      <p className="text-[10px] text-muted leading-relaxed">
                        {right.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Risk Disclaimer */}
        <div className="mb-10">
          <div className="rounded-2xl bg-warning/5 border border-warning/20 p-6">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-warning/10 flex items-center justify-center shrink-0">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-warning mb-2">
                  Risk Disclaimer
                </h3>
                <div className="text-xs text-muted space-y-2 leading-relaxed">
                  <p>
                    Trading crypto assets involves significant risk. The value of crypto assets can fluctuate
                    dramatically and you may lose some or all of your investment. Past performance is not
                    indicative of future results.
                  </p>
                  <p>
                    Per Bappebti regulation, crypto asset trading is classified as commodity futures trading
                    with high risk. Please ensure you understand the risks involved before trading and never
                    invest more than you can afford to lose.
                  </p>
                  <p>
                    Quantum Exchange does not provide investment advice. All trading decisions are made by the
                    customer. We encourage all customers to complete our Academy courses on risk management
                    before engaging in active trading.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <div className="rounded-2xl bg-gradient-to-br from-card via-card to-accent/5 border border-border p-8">
            <ShieldCheck className="h-10 w-10 text-accent mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">
              Trade with Confidence
            </h3>
            <p className="text-sm text-muted max-w-lg mx-auto mb-6">
              Complete your KYC verification to unlock the full potential of Quantum Exchange
              with full regulatory compliance and protection.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/kyc"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent hover:bg-accent-hover text-background font-semibold text-sm transition-all hover:shadow-lg hover:shadow-accent/20"
              >
                Start KYC Verification
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/academy"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium text-muted hover:text-foreground bg-card-hover hover:bg-border transition-colors"
              >
                <BookOpen className="h-4 w-4" />
                Learn About Crypto Risks
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
