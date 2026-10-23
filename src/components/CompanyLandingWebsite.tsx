import React, { useState } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Wallet, 
  Award, 
  Scale, 
  Globe, 
  Lock, 
  CheckCircle2, 
  FileText, 
  DollarSign, 
  Flame, 
  Layers, 
  QrCode, 
  Users, 
  ExternalLink,
  Crown,
  Lightbulb,
  Coins,
  Copy,
  Check,
  AlertOctagon,
  Ban,
  Zap,
  LayoutDashboard
} from "lucide-react";
import { Idea, UserProfile, CurrencyCode } from "../types";
import { 
  formatPrice, 
  EXCHANGE_RATES, 
  calculateCommissionBreakdown 
} from "../utils/legalAndCurrency";

interface CompanyLandingWebsiteProps {
  currentUser: UserProfile;
  ideas: Idea[];
  preferredCurrency: CurrencyCode;
  onSelectCurrency: (curr: CurrencyCode) => void;
  onEnterMarketplace: () => void;
  onOpenCreateIdea: () => void;
  onOpenDigitalWallet: () => void;
  onOpenSiteCopyright: () => void;
  onOpenLegalGuide: () => void;
  onOpenSalesGraph: () => void;
  onSelectIdea: (idea: Idea) => void;
  onOpenEthicalCert?: () => void;
  onOpenUnCert?: () => void;
  onOpenWebsiteLink?: () => void;
  onOpenEarningsDashboard?: () => void;
}

export const CompanyLandingWebsite: React.FC<CompanyLandingWebsiteProps> = ({
  currentUser,
  ideas,
  preferredCurrency,
  onSelectCurrency,
  onEnterMarketplace,
  onOpenCreateIdea,
  onOpenDigitalWallet,
  onOpenSiteCopyright,
  onOpenLegalGuide,
  onOpenSalesGraph,
  onSelectIdea,
  onOpenEthicalCert,
  onOpenUnCert,
  onOpenWebsiteLink,
  onOpenEarningsDashboard,
}) => {
  // Interactive Calculator State
  const [calcPriceUsd, setCalcPriceUsd] = useState<number>(1000);
  const [calcModel, setCalcModel] = useState<"keep_copyright" | "full_buyout" | "royalty_split">("royalty_split");

  const calcBreakdown = calculateCommissionBreakdown(
    calcPriceUsd, 
    calcModel === "keep_copyright" ? "royalty_split" : calcModel
  );
  const calcSellerNpr = Math.round(calcBreakdown.netSellerUsd * EXCHANGE_RATES.NPR.rate);
  const calcPlatformFeeNpr = Math.round(calcBreakdown.platformFeeUsd * EXCHANGE_RATES.NPR.rate);

  // Filter ideas (pre-launch exactly 18 AI seeds)
  const aiSeedsCount = ideas.filter(i => i.originType === "ai_seed").length;
  const humanPostsCount = ideas.filter(i => i.originType === "real_human").length;
  const showcaseIdeas = ideas.slice(0, 3);

  return (
    <div className="space-y-12 sm:space-y-16 animate-fadeIn pb-12">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 p-6 sm:p-12 shadow-2xl">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
          {/* Top Company Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3.5 py-1.5 text-xs font-bold text-amber-300 shadow-sm shadow-amber-500/10">
            <Sparkles className="h-4 w-4 text-amber-400" />
            <span>Official Portal • IdeaVault Global IP Exchange & Task Marketplace</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-100 leading-[1.15]">
            Turn Original Post Ideas Into{" "}
            <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
              Profitable Tech Products
            </span>
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
            IdeaVault connects non-tech and tech creators with hardware engineers, software developers, and venture investors. Monitored under international UN & WIPO treaties with automated multi-currency escrow.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={onEnterMarketplace}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-6 py-3.5 text-sm font-extrabold text-neutral-950 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Explore 18 Idea Seeds</span>
              <ArrowRight className="h-4 w-4" />
            </button>

            <button
              onClick={onOpenCreateIdea}
              className="flex items-center gap-2 rounded-2xl border border-neutral-700 bg-neutral-900/90 hover:bg-neutral-800 px-6 py-3.5 text-sm font-bold text-neutral-100 transition-all active:scale-95 cursor-pointer"
            >
              <span>Post Your Idea (Free)</span>
            </button>

            {onOpenEarningsDashboard && (
              <button
                onClick={onOpenEarningsDashboard}
                className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-neutral-900/90 hover:bg-neutral-800 px-5 py-3.5 text-sm font-bold text-amber-300 transition-all active:scale-95 cursor-pointer"
              >
                <LayoutDashboard className="h-4 w-4 text-amber-400" />
                <span>Earnings Dashboard</span>
              </button>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs text-neutral-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Nepal Copyright Act 2059 Certified</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-sky-400" />
              <span>WIPO Berne Convention (181 Countries)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Lock className="h-4 w-4 text-amber-400" />
              <span>Cryptographic SHA-256 IP Stamps</span>
            </span>
          </div>
        </div>
      </section>

      {/* 2. INTERNATIONAL LEGAL COMPLIANCE & MARKETPLACE ACTION BAR */}
      <section className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-neutral-900 via-neutral-950 to-neutral-900 p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="rounded-full bg-sky-500/15 border border-sky-500/30 px-2.5 py-0.5 text-xs font-bold text-sky-300 flex items-center gap-1">
                🇺🇳 UN & WIPO International Law Certified
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-neutral-100">
              IdeaVault Official Company Portal
            </h3>
            <p className="text-xs text-neutral-400 max-w-2xl">
              Certified under United Nations international law, WIPO Berne Convention, and ITU anti-hacking standards. Built for global creators and enterprise acquirers with multi-currency digital settlement.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {onOpenEthicalCert && (
              <button
                onClick={onOpenEthicalCert}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950 to-teal-950 hover:from-emerald-900 hover:to-teal-900 px-4 py-2.5 text-xs font-bold text-emerald-300 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>⚖️ Certified & Fraud-Free</span>
              </button>
            )}

            {onOpenUnCert && (
              <button
                onClick={onOpenUnCert}
                className="flex-1 md:flex-initial flex items-center justify-center gap-2 rounded-xl border border-sky-500/50 bg-gradient-to-r from-sky-950 to-blue-950 hover:from-sky-900 hover:to-blue-900 px-4 py-2.5 text-xs font-bold text-sky-300 shadow-md shadow-sky-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <Globe className="h-4 w-4 text-sky-400" />
                <span>🇺🇳 UN/WIPO Legal Cert</span>
              </button>
            )}

            <button
              onClick={onEnterMarketplace}
              className="flex-1 md:flex-initial flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-4 py-2.5 text-xs font-bold text-neutral-950 shadow-md shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Enter Marketplace</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. CREATOR COPYRIGHT SOVEREIGNTY: KEEP OR SELL */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            Creator IP Sovereignty
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100">
            You Choose: Keep 100% Copyright or Monetize
          </h2>
          <p className="text-sm text-neutral-400">
            Creators on IdeaVault retain full decision authority over their intellectual property. You can keep all rights to build with partners, or sell for guaranteed cash.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Keep 100% */}
          <div className="rounded-3xl border border-emerald-500/40 bg-neutral-950 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-3 py-1 text-xs font-extrabold">
                Option 1: Retain 100%
              </span>
              <ShieldCheck className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-100">Keep 100% Copyright</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Maintain complete, unilateral ownership of your idea. Use the platform to showcase your concept, find technical co-founders or developers, and establish prior art without transferring any equity.
            </p>
            <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Zero copyright transferred to anyone</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Find hardware/software builders</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>Timestamped cryptographic filing</span>
              </div>
            </div>
          </div>

          {/* Card 2: Sell Full Buyout */}
          <div className="rounded-3xl border border-amber-500/40 bg-neutral-950 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 px-3 py-1 text-xs font-extrabold">
                Option 2: Cash Buyout
              </span>
              <DollarSign className="h-6 w-6 text-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-100">Sell Full Buyout (100%)</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Transfer 100% of commercial ownership, patent blueprints, and technical rights to an acquirer for an immediate, guaranteed upfront cash sum deposited into escrow. 0% future royalty.
            </p>
            <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Upfront cash paid into escrow</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Direct withdrawal to Khalti or Bank</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-amber-400" />
                <span>Clean 100% legal assignment covenant</span>
              </div>
            </div>
          </div>

          {/* Card 3: 15% Perpetual Royalty */}
          <div className="rounded-3xl border border-sky-500/40 bg-neutral-950 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 px-3 py-1 text-xs font-extrabold">
                Option 3: Licensing Split
              </span>
              <Scale className="h-6 w-6 text-sky-400" />
            </div>
            <h3 className="text-lg font-bold text-neutral-100">License with 15% Royalty</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Retain your moral authorship rights while licensing manufacturing and commercial rights to a tech partner. You earn an automatic, legally binding 15% perpetual royalty on all gross retail sales.
            </p>
            <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-300 space-y-1.5">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
                <span>Retain original moral credit</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
                <span>Continuous 15% royalties on unit sales</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-sky-400" />
                <span>Automated multi-currency distribution</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. TERMS & CONDITIONS, SEPARATE COPYRIGHT RULES & 5-STRIKE POLICY */}
      <section className="rounded-3xl border-2 border-neutral-800 bg-neutral-950 p-6 sm:p-10 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <AlertOctagon className="h-5 w-5 text-red-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-100">
                Terms of Use, Copyright Rules & 5-Strike Policy
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
              Strict governance rules protecting creators and buyers under UNCITRAL, WIPO, and Nepal Law.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-3 text-xs text-emerald-300 font-bold flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Fund Protection: Earned money will NEVER be kept by company</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          {/* Rules Pillar */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-neutral-100 text-sm flex items-center gap-2">
              <FileText className="h-4 w-4 text-amber-400" />
              <span>Core Platform Laws to Maintain</span>
            </h3>

            <div className="space-y-3 text-neutral-400 text-xs">
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 space-y-1">
                <strong className="text-neutral-200 block">1. Zero Plagiarism & Prior Art Verification:</strong>
                <span>Submissions must be original. Copying existing protected patents or scraping other users' posts triggers automatic copyright infringement penalties.</span>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 space-y-1">
                <strong className="text-neutral-200 block">2. In-App Escrow Integrity:</strong>
                <span>Attempts to circumvent escrow to avoid royalties or commit fraud are prohibited under Nepal Penal Code 2074 (Cheating & Fraud).</span>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 space-y-1">
                <strong className="text-neutral-200 block">3. Authentic Creator Transparency:</strong>
                <span>Deceptive bots pretending to be humans are banned. Real creators own their works; AI seed sparks are transparently labeled.</span>
              </div>
            </div>
          </div>

          {/* 5-Strike Escalation & Termination Guarantee */}
          <div className="space-y-4">
            <h3 className="font-extrabold text-neutral-100 text-sm flex items-center gap-2">
              <Ban className="h-4 w-4 text-red-400" />
              <span>The 5-Strike Escalation System</span>
            </h3>

            <div className="space-y-3 text-xs text-neutral-400">
              <div className="rounded-xl border border-amber-500/30 bg-neutral-900/60 p-3.5 space-y-1">
                <strong className="text-amber-300 block">Strikes 1 to 5 (Progressive Warnings):</strong>
                <span>For each rule violation, a formal strike is logged. An automated evidentiary dossier (IP log, payload hash, timestamps) is emailed directly to the violator.</span>
              </div>

              <div className="rounded-xl border border-red-500/40 bg-neutral-900/60 p-3.5 space-y-1">
                <strong className="text-red-300 block">6th Rule Breach (Direct Account Termination):</strong>
                <span>If 5 strikes are reached and another law is breached, the account is immediately terminated. Official legal termination notice with all evidence is sent via email.</span>
              </div>

              <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 space-y-1.5 text-emerald-300">
                <strong className="text-emerald-300 flex items-center gap-1.5 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>Mandatory Payout Remittance Guarantee:</span>
                </strong>
                <p className="text-[11px] leading-relaxed text-neutral-300">
                  The company will strictly <strong>NEVER keep or seize their earned money</strong>. Even upon complete account termination, all legitimate funds earned by the user are automatically wired directly to their registered Khalti Digital Wallet or domestic bank account.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOUNDER SPOTLIGHT & LEGAL CERTIFICATION */}
      <section className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300 font-extrabold text-lg">
            MK
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-neutral-100">
                Medha Koirala
              </h3>
              <span className="rounded-full bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                Founder & Owner
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
              IdeaVault was conceived and architected by Medha Koirala in Nepal with permanent copyright ownership, registered and protected under intellectual property legislation and WIPO international conventions.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenSiteCopyright}
            className="rounded-2xl border border-amber-500/40 bg-amber-950/50 hover:bg-amber-900/50 text-amber-300 font-bold px-4 py-2.5 text-xs transition-colors flex items-center gap-1.5"
          >
            <Award className="h-4 w-4" />
            <span>View Certificate</span>
          </button>

          <button
            onClick={onOpenLegalGuide}
            className="rounded-2xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold px-4 py-2.5 text-xs transition-colors flex items-center gap-1.5"
          >
            <Scale className="h-4 w-4" />
            <span>Legal FAQ</span>
          </button>
        </div>
      </section>

      {/* 7. BOTTOM CALL TO ACTION */}
      <section className="text-center rounded-3xl border border-neutral-800 bg-neutral-900/40 p-8 sm:p-12 space-y-5">
        <h2 className="text-2xl sm:text-4xl font-extrabold text-neutral-100">
          Start Exploring Original Ideas or Post Yours Free
        </h2>
        <p className="text-sm text-neutral-400 max-w-xl mx-auto">
          Explore the 18 initial seed ideas, review automatic 15% royalty contracts, or post an original invention.
        </p>
        <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={onEnterMarketplace}
            className="rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-extrabold px-6 py-3 text-sm transition-all shadow-lg shadow-amber-500/20 active:scale-95"
          >
            Enter Marketplace Feed
          </button>
          <button
            onClick={onOpenCreateIdea}
            className="rounded-2xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 text-neutral-100 font-bold px-6 py-3 text-sm transition-all active:scale-95"
          >
            Post an Idea (Free)
          </button>
        </div>
      </section>
    </div>
  );
};
