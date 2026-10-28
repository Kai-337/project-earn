import React, { useState } from "react";
import {
  ArrowRight,
  ShieldCheck,
  Wallet,
  Scale,
  Globe,
  CheckCircle2,
  DollarSign,
  Layers,
  QrCode,
  ExternalLink,
  Lightbulb,
  LayoutDashboard,
  Briefcase,
  UserPlus,
  Download,
  Calculator,
  Mail,
  Film,
  Search,
  FileText
} from "lucide-react";
import { Idea, UserProfile, CurrencyCode, AccountCreationType } from "../types";
import {
  formatPrice,
  EXCHANGE_RATES,
  calculateCommissionBreakdown,
  generateFixedTermRoyaltyLawDraft,
  downloadLawDraftDocument
} from "../utils/legalAndCurrency";
import { getWebsiteLaunchHref } from "../utils/syncEngine";
import { IdeaVaultLogo } from "./IdeaVaultLogo";

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
  onOpenEarningsDashboard?: () => void;
  onOpenCreateAccount?: (accountType: AccountCreationType) => void;
  onOpenLegalDocs?: () => void;
  onOpenPromoVideo?: () => void;
  onOpenSeoGuide?: () => void;
}

export const CompanyLandingWebsite: React.FC<CompanyLandingWebsiteProps> = ({
  currentUser,
  ideas,
  preferredCurrency,
  onSelectCurrency,
  onEnterMarketplace,
  onOpenCreateIdea,
  onOpenDigitalWallet,
  onSelectIdea,
  onOpenEarningsDashboard,
  onOpenCreateAccount,
  onOpenLegalDocs,
  onOpenPromoVideo,
  onOpenSeoGuide,
}) => {
  const [calcPriceUsd, setCalcPriceUsd] = useState<number>(2500);
  const [calcModel, setCalcModel] = useState<"keep_copyright" | "full_buyout" | "fixed_term_18m">("keep_copyright");

  const calcBreakdown = calculateCommissionBreakdown(
    calcPriceUsd,
    calcModel === "full_buyout" ? "full_buyout" : "royalty_split"
  );
  const calcPlatformFeeNpr = Math.round(calcBreakdown.platformFeeUsd * EXCHANGE_RATES.NPR.rate);

  const showcaseIdeas = ideas
    .filter((i) => i.status !== "removed_by_admin" && i.status !== "flagged_dangerous")
    .slice(0, 3);

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      {/* DEDICATED STANDALONE OFFICIAL WEBSITE HEADER */}
      <header className="sticky top-0 z-40 w-full border-b border-neutral-800/90 bg-neutral-950/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 flex-wrap">
          {/* Left: Official Website Brand Lockup */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="flex items-center gap-2.5 cursor-pointer group"
              title="IdeaVault Official Website"
            >
              <IdeaVaultLogo size="sm" className="group-hover:scale-105 transition-transform" />
              <div className="text-left">
                <div className="text-base sm:text-lg font-extrabold tracking-tight text-neutral-100 group-hover:text-amber-300 transition-colors">
                  Idea<span className="text-amber-400">Vault</span>
                  <span className="ml-2 text-[11px] font-semibold text-neutral-400">Official Website</span>
                </div>
              </div>
            </button>
          </div>

          {/* Center: Website Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-neutral-300">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("website-featured-ideas")}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Featured Ideas
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("website-accounts")}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Investor &amp; Poster Accounts
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("website-monetization")}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Royalties &amp; Pricing
            </button>
            <button
              type="button"
              onClick={() => scrollToSection("website-calculator")}
              className="hover:text-amber-300 transition-colors cursor-pointer"
            >
              Payout Calculator
            </button>
          </nav>

          {/* Right: Website Actions & Enter App CTA */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900 px-2 py-1.5 text-xs">
              <select
                value={preferredCurrency}
                onChange={(e) => onSelectCurrency(e.target.value as CurrencyCode)}
                className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer text-xs"
                title="Display currency"
              >
                {Object.entries(EXCHANGE_RATES).map(([code, item]) => (
                  <option key={code} value={code} className="bg-neutral-900 text-neutral-100">
                    {item.symbol} {code}
                  </option>
                ))}
              </select>
            </div>

            <a
              href={getWebsiteLaunchHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
              title="Open IdeaVault Website in a separate browser tab"
            >
              <ExternalLink className="h-3.5 w-3.5 text-amber-400" />
              <span>New Tab</span>
            </a>

            {onOpenCreateAccount && (
              <button
                type="button"
                onClick={() => onOpenCreateAccount("idea_poster")}
                className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 px-3 py-1.5 text-xs font-bold text-emerald-300 transition-colors cursor-pointer"
              >
                <UserPlus className="h-3.5 w-3.5" />
                <span>Sign Up</span>
              </button>
            )}

            <button
              type="button"
              onClick={onEnterMarketplace}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-3.5 py-1.5 text-xs font-extrabold text-neutral-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <span>Launch App</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </header>

      {/* MAIN OFFICIAL WEBSITE BODY */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-14 sm:space-y-20 animate-fadeIn">
        {/* 1. HERO SECTION */}
        <section className="relative overflow-hidden rounded-3xl border border-neutral-800 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 p-6 sm:p-14 shadow-2xl">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6">
            <div className="flex justify-center">
              <IdeaVaultLogo size="hero" />
            </div>

            <p className="text-xs font-semibold uppercase tracking-widest text-amber-400">
              IdeaVault · Global Idea &amp; Product Licensing Marketplace
            </p>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-100 leading-[1.12]">
              Turn Original Everyday Ideas Into{" "}
              <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                Commercial Tech Products
              </span>
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 max-w-2xl mx-auto leading-relaxed">
              IdeaVault connects creators and frontline problem solvers with investors, engineers, and commercial builders to license or acquire original product ideas with real-money settlements.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={onEnterMarketplace}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-6 py-3.5 text-sm font-extrabold text-neutral-950 shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
              >
                <span>Enter Marketplace App</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <button
                type="button"
                onClick={onOpenCreateIdea}
                className="flex items-center gap-2 rounded-2xl border border-neutral-700 bg-neutral-900/90 hover:bg-neutral-800 px-6 py-3.5 text-sm font-bold text-neutral-100 transition-all active:scale-95 cursor-pointer"
              >
                <span>Post Your Idea (Free)</span>
              </button>

              {onOpenPromoVideo && (
                <button
                  type="button"
                  onClick={onOpenPromoVideo}
                  className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-5 py-3.5 text-sm font-bold text-amber-300 transition-all active:scale-95 cursor-pointer"
                >
                  <Film className="h-4 w-4 text-amber-400" />
                  <span>Watch / Download Promo Video</span>
                </button>
              )}

              {onOpenLegalDocs && (
                <button
                  type="button"
                  onClick={onOpenLegalDocs}
                  className="flex items-center gap-2 rounded-2xl border border-neutral-700 bg-neutral-900/90 hover:bg-neutral-800 px-5 py-3.5 text-sm font-bold text-neutral-200 transition-all active:scale-95 cursor-pointer"
                >
                  <FileText className="h-4 w-4 text-amber-400" />
                  <span>Copyright Legal Documents</span>
                </button>
              )}

              {onOpenEarningsDashboard && (
                <button
                  type="button"
                  onClick={onOpenEarningsDashboard}
                  className="flex items-center gap-2 rounded-2xl border border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 px-4 py-3.5 text-xs font-bold text-neutral-300 transition-all active:scale-95 cursor-pointer"
                >
                  <LayoutDashboard className="h-4 w-4 text-amber-400" />
                  <span>Earnings Dashboard</span>
                </button>
              )}

              {onOpenSeoGuide && (
                <button
                  type="button"
                  onClick={onOpenSeoGuide}
                  className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-950/30 hover:bg-emerald-900/40 px-4 py-3.5 text-xs font-bold text-emerald-300 transition-all cursor-pointer"
                >
                  <Search className="h-4 w-4 text-emerald-400" />
                  <span>Search Engine Guide</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 2. FEATURED MARKETPLACE IDEAS SHOWCASE */}
        <section id="website-featured-ideas" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5" />
                Live Marketplace Preview
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100">
                Featured Licensable Product Ideas
              </h2>
              <p className="text-sm text-neutral-400">
                Browse categorized concepts ready for 100% buyout or 15% commercial royalty partnership.
              </p>
            </div>
            <button
              type="button"
              onClick={onEnterMarketplace}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
            >
              <span>View All {ideas.length} Ideas in App</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {showcaseIdeas.map((idea) => (
              <div
                key={idea.id}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 hover:border-amber-500/40 p-5 flex flex-col justify-between space-y-4 transition-all"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-semibold text-amber-300">{idea.category}</span>
                    <span className="font-mono font-bold text-emerald-400">
                      {formatPrice(idea.upfrontPrice, preferredCurrency)}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-neutral-100 line-clamp-2">{idea.title}</h3>
                  <p className="text-xs text-neutral-400 line-clamp-3 leading-relaxed">
                    {idea.summaryPitch || idea.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-neutral-800 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-neutral-400">
                    {idea.saleModel === "full_buyout" ? "100% Copyright Buyout" : "15% Creator Royalty"}
                  </span>
                  <button
                    type="button"
                    onClick={() => onSelectIdea(idea)}
                    className="inline-flex items-center gap-1 rounded-xl bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 px-3 py-1.5 text-xs font-bold text-amber-300 transition-colors cursor-pointer"
                  >
                    <span>Inspect Deal</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. TWO ACCOUNT TYPES: 1. INVESTOR & 2. IDEA POSTER */}
        <section id="website-accounts" className="space-y-6 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
              Account Registration Options
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100">
              Join as an Investor or as an Idea Poster
            </h2>
            <p className="text-sm text-neutral-400">
              Every account option supports uploading images, supporting documents, and QR payment codes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Account Type 1: Investor */}
            <div className="rounded-3xl border border-emerald-500/40 bg-neutral-900/40 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
                      <Briefcase className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-100">
                      1. Investor Account
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-emerald-400">
                    Acquire &amp; Fund Ideas
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Built for angel investors, companies, engineers, and venture studios looking to discover original frontline ideas and acquire 100% copyrights or enter 82%/15% commercial royalty partnerships.
                </p>
                <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-300 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Type custom sector or choose from all available sectors</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Settle deals in verified ISO-4217 national currencies</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Upload profile image, verification documents/images, and payout QR</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenCreateAccount?.("investor")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-5 py-3 text-xs sm:text-sm font-bold text-neutral-950 shadow-md shadow-emerald-500/20 transition-all cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Create Investor Account</span>
              </button>
            </div>

            {/* Account Type 2: Idea Poster */}
            <div className="rounded-3xl border border-amber-500/40 bg-neutral-900/40 p-6 sm:p-8 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
                      <Lightbulb className="h-5 w-5" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-neutral-100">
                      2. Idea Poster Account
                    </h3>
                  </div>
                  <span className="text-xs font-semibold text-amber-400">
                    100% Free to Post
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                  Built for everyday problem solvers, non-technical professionals, students, and creators to post original ideas for free with instant SHA-256 copyright filing and get paid by investors.
                </p>
                <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-300 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>$0 posting fee — 3% discovery commission only upon completed sale</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>Choose copyright retention + 15% royalty, full buyout, or 3-yr license</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                    <span>Upload concept images, supporting documents, and receive QR code</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onOpenCreateAccount?.("idea_poster")}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 px-5 py-3 text-xs sm:text-sm font-bold text-neutral-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
              >
                <UserPlus className="h-4 w-4" />
                <span>Create Idea Poster Account</span>
              </button>
            </div>
          </div>
        </section>

        {/* 4. THREE MONETIZATION STRUCTURES */}
        <section id="website-monetization" className="space-y-6 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Three Clear Monetization Structures
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100">
              Choose How Your Idea Copyright &amp; Royalties Work
            </h2>
            <p className="text-sm text-neutral-400">
              Every idea posted on IdeaVault follows one of three commercial structures, with the 3% discovery commission wired in Nepali Currency (NPR ₨) to the Owner QR Account upon verified real-money sales.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Keep Copyrights + 15% Royalty */}
            <div className="rounded-3xl border border-emerald-500/40 bg-neutral-900/40 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-emerald-300 text-xs font-extrabold">
                  Structure 1 · Keep Copyright + 15%
                </span>
                <ShieldCheck className="h-6 w-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-neutral-100">
                1. Keep Copyrights &amp; Earn 15% Royalty
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                You post your original idea, keep 100% of your copyrights, and receive a 15% ongoing royalty on commercialized product sales (with 82% to the commercializing partner and 3% platform discovery commission on completed sales).
              </p>
              <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-300 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>You retain 100% copyright ownership</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>15% ongoing royalty on receipt-verified sales</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                  <span>Timestamped SHA-256 copyright filing</span>
                </div>
              </div>
            </div>

            {/* Card 2: Sell Copyrights -> 0% Royalty */}
            <div className="rounded-3xl border border-amber-500/40 bg-neutral-900/40 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-amber-300 text-xs font-extrabold">
                  Structure 2 · Sell Copyright (0% Royalty)
                </span>
                <DollarSign className="h-6 w-6 text-amber-400" />
              </div>
              <h3 className="text-lg font-bold text-neutral-100">
                2. Sell Copyrights — No Royalty (0%)
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                You sell 100% of the copyrights to an acquiring investor for a lump-sum upfront cash buyout settled with verified real-money payment proof, leading to no ongoing royalty (0% future royalty).
              </p>
              <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-300 space-y-1.5">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>100% upfront buyout paid in real money</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Zero ongoing royalty (0% after buyout)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span>Withdraw to any Digital Wallet or Bank Account</span>
                </div>
              </div>
            </div>

            {/* Card 3: 3-Year Licensed Product + 1.5-Year Capped Royalty Law Draft */}
            <div className="rounded-3xl border border-sky-500/40 bg-neutral-900/40 p-6 flex flex-col justify-between space-y-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sky-300 text-xs font-extrabold">
                    Structure 3 · 3-Yr License + 1.5-Yr Cap
                  </span>
                  <Scale className="h-6 w-6 text-sky-400" />
                </div>
                <h3 className="text-lg font-bold text-neutral-100">
                  3. 3-Year Licensed Product + 1.5-Year Max Royalty Law Draft
                </h3>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Commercialize as a 3-year licensed product with a binding Official Law Draft Document explicitly stating <strong>1.5 years (18 months) of 15% royalty — and strictly no more than 1.5 years</strong> (0% thereafter).
                </p>
                <div className="pt-2 border-t border-neutral-800 text-xs text-neutral-300 space-y-1.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span>3-year licensed product commercialization</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span>Strict 1.5-year (18-month) cap on 15% royalty</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span>Includes Official Law Draft Document (.txt)</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  downloadLawDraftDocument(
                    "IdeaVault-1.5-Year-Max-Royalty-Law-Draft.txt",
                    generateFixedTermRoyaltyLawDraft({
                      creatorName: currentUser.name,
                      creatorCountry: currentUser.country || "Nepal",
                    })
                  )
                }
                className="w-full flex items-center justify-center gap-1.5 rounded-xl border border-sky-500/40 bg-sky-950/40 hover:bg-sky-900/50 px-3.5 py-2.5 text-xs font-bold text-sky-300 transition-colors cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Download 1.5-Yr Royalty Cap Law Draft</span>
              </button>
            </div>
          </div>
        </section>

        {/* 5. INTERACTIVE REAL-MONEY PAYOUT & ROYALTY CALCULATOR */}
        <section id="website-calculator" className="rounded-3xl border border-neutral-800 bg-neutral-900/50 p-6 sm:p-8 space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Calculator className="h-3.5 w-3.5" />
                Transparent Real-Money Settlement Preview
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-100 mt-1">
                Interactive Deal &amp; Commission Calculator
              </h2>
            </div>

            <div className="flex items-center gap-1.5 rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs">
              <button
                type="button"
                onClick={() => setCalcModel("keep_copyright")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  calcModel === "keep_copyright" ? "bg-emerald-500 text-neutral-950" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                1. Keep Copyright (15%)
              </button>
              <button
                type="button"
                onClick={() => setCalcModel("full_buyout")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  calcModel === "full_buyout" ? "bg-amber-500 text-neutral-950" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                2. Full Buyout (0%)
              </button>
              <button
                type="button"
                onClick={() => setCalcModel("fixed_term_18m")}
                className={`px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                  calcModel === "fixed_term_18m" ? "bg-sky-500 text-neutral-950" : "text-neutral-400 hover:text-neutral-200"
                }`}
              >
                3. 3-Yr / 1.5-Yr Cap
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-neutral-300">
                Deal / Product Sales Amount (USD Base): <strong className="text-amber-300 font-mono">${calcPriceUsd.toLocaleString()}</strong>
              </label>
              <input
                type="range"
                min={100}
                max={50000}
                step={100}
                value={calcPriceUsd}
                onChange={(e) => setCalcPriceUsd(Number(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer"
              />
              <div className="flex justify-between text-[11px] font-mono text-neutral-500">
                <span>$100</span>
                <span>{formatPrice(calcPriceUsd, preferredCurrency)}</span>
                <span>$50,000</span>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-400">
                {calcModel === "full_buyout"
                  ? "Idea Poster Net Buyout (97%)"
                  : calcModel === "fixed_term_18m"
                  ? "Idea Poster 15% Royalty (Max 1.5 Yrs)"
                  : "Idea Poster Net Upfront / 15% Royalty"}
              </div>
              <div className="text-xl font-extrabold font-mono text-neutral-100">
                {calcModel === "full_buyout"
                  ? formatPrice(calcBreakdown.netSellerUsd, preferredCurrency)
                  : formatPrice(Math.round(calcPriceUsd * 0.15 * 100) / 100, preferredCurrency)}
              </div>
              <div className="text-[11px] text-neutral-400">
                {calcModel === "full_buyout"
                  ? "Paid to creator's Digital Wallet or Bank Account"
                  : calcModel === "fixed_term_18m"
                  ? "15% for strictly 18 months (0% thereafter)"
                  : "Creator keeps 100% copyright + 15% ongoing sales royalty"}
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/30 bg-neutral-950 p-4 space-y-1">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-400">
                3% Platform Commission (Owner NPR QR)
              </div>
              <div className="text-xl font-extrabold font-mono text-amber-300">
                ₨{calcPlatformFeeNpr.toLocaleString()} NPR
              </div>
              <div className="text-[11px] text-neutral-400">
                Auto-wired in Nepali Currency (NPR ₨) upon receipt-verified payment
              </div>
            </div>
          </div>
        </section>

        {/* 6. FOUNDER & OWNER ACCOUNT UPLOADS */}
        <section className="rounded-3xl border border-neutral-800 bg-neutral-900/40 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {currentUser.isSiteOwner &&
            currentUser.avatar &&
            currentUser.avatar.startsWith("data:image/") &&
            !currentUser.avatar.startsWith("data:image/svg+xml") ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-14 w-14 rounded-2xl object-cover ring-2 ring-amber-500/40 shrink-0"
              />
            ) : (
              <div className="h-14 w-14 rounded-2xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-300 font-extrabold text-lg">
                MK
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-neutral-100">
                  {currentUser.isSiteOwner ? currentUser.name : "Medha Koirala"}
                </h3>
                <span className="text-xs font-medium text-neutral-400">
                  · Founder &amp; Owner
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-1 max-w-xl leading-relaxed">
                IdeaVault was founded by Medha Koirala to give everyday creators and builders a direct, practical place to license and commercialize original ideas with verified real-money settlements.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {currentUser.isSiteOwner && onOpenCreateAccount && (
              <button
                type="button"
                onClick={() => onOpenCreateAccount("owner")}
                className="flex items-center gap-2 rounded-2xl border border-amber-500/40 bg-neutral-900 hover:bg-neutral-800 text-amber-300 font-bold px-4 py-2.5 text-xs transition-all cursor-pointer"
              >
                <QrCode className="h-4 w-4 text-amber-400" />
                <span>Owner Account: Upload Docs/Images &amp; NPR QR</span>
              </button>
            )}
            <button
              type="button"
              onClick={onOpenDigitalWallet}
              className="flex items-center gap-1.5 rounded-2xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-bold px-4 py-2.5 text-xs transition-all cursor-pointer"
            >
              <Wallet className="h-3.5 w-3.5 text-emerald-400" />
              <span>Digital Wallet</span>
            </button>
            <button
              type="button"
              onClick={onEnterMarketplace}
              className="rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-5 py-2.5 text-xs transition-all cursor-pointer"
            >
              Launch Marketplace App
            </button>
          </div>
        </section>
      </div>

      {/* OFFICIAL WEBSITE FOOTER */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
            <IdeaVaultLogo size="xs" />
            <span className="font-bold text-neutral-200">IdeaVault</span>
            <span>·</span>
            <span>Founded by {currentUser.isSiteOwner ? currentUser.name : "Medha Koirala"}</span>
          </div>

          <div className="flex items-center gap-5 flex-wrap justify-center">
            <button
              type="button"
              onClick={onEnterMarketplace}
              className="hover:text-neutral-200 transition-colors cursor-pointer font-semibold text-amber-300"
            >
              Marketplace App
            </button>
            {onOpenEarningsDashboard && (
              <button
                type="button"
                onClick={onOpenEarningsDashboard}
                className="hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Earnings Dashboard
              </button>
            )}
            <button
              type="button"
              onClick={onOpenDigitalWallet}
              className="hover:text-neutral-200 transition-colors cursor-pointer"
            >
              Digital Wallet &amp; QR
            </button>
            {onOpenLegalDocs && (
              <button
                type="button"
                onClick={onOpenLegalDocs}
                className="hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Copyright Legal Docs
              </button>
            )}
            {onOpenPromoVideo && (
              <button
                type="button"
                onClick={onOpenPromoVideo}
                className="hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Promo Video
              </button>
            )}
            {onOpenSeoGuide && (
              <button
                type="button"
                onClick={onOpenSeoGuide}
                className="hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Search Engine Guide
              </button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-5 pt-5 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400 text-center sm:text-left">
          <span>For any queries and questions, contact us at:</span>
          <a
            href="mailto:medhakoirala.servicesgmail.com@gmail.com"
            className="inline-flex items-center gap-1.5 font-semibold text-amber-400 hover:text-amber-300 transition-colors break-all"
          >
            <Mail className="h-3.5 w-3.5 shrink-0" />
            <span>medhakoirala.servicesgmail.com@gmail.com</span>
          </a>
        </div>
      </footer>
    </div>
  );
};
