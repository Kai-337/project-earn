import React, { useState } from "react";
import { UserProfile, CurrencyCode } from "../types";
import { 
  ShieldAlert, 
  FileText, 
  Briefcase, 
  PlusCircle, 
  Flame, 
  Layers, 
  Globe, 
  Scale, 
  ShieldCheck, 
  Crown, 
  Wallet, 
  QrCode, 
  TrendingUp, 
  CheckCircle2,
  Camera,
  BarChart3,
  AlertTriangle,
  Lock,
  ExternalLink,
  LayoutDashboard
} from "lucide-react";
import { EXCHANGE_RATES, formatPrice } from "../utils/legalAndCurrency";
import { getWebsiteLaunchHref } from "../utils/syncEngine";

interface NavbarProps {
  currentUser: UserProfile;
  activeTab: "website" | "feed" | "foryou" | "tasks" | "contracts" | "moderation";
  setActiveTab: (tab: "website" | "feed" | "foryou" | "tasks" | "contracts" | "moderation") => void;
  onOpenCreateIdea: () => void;
  onOpenEthicalCert: () => void;
  onOpenUnCert?: () => void;
  onOpenLegalGuide: () => void;
  onOpenSalesGraph: () => void;
  onOpenAdvancedOwnerControl: () => void;
  onOpenDigitalWallet: () => void;
  onOpenEarningsDashboard: () => void;
  onOpenScannerPay: () => void;
  onOpenLawAndSafety: () => void;
  onOpenWebsiteLink?: () => void;
  preferredCurrency: CurrencyCode;
  onSelectCurrency: (curr: CurrencyCode) => void;
  flaggedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenCreateIdea,
  onOpenEthicalCert,
  onOpenUnCert,
  onOpenLegalGuide,
  onOpenSalesGraph,
  onOpenAdvancedOwnerControl,
  onOpenDigitalWallet,
  onOpenEarningsDashboard,
  onOpenScannerPay,
  onOpenLawAndSafety,
  onOpenWebsiteLink,
  preferredCurrency,
  onSelectCurrency,
  flaggedCount,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-2.5 gap-2 flex-wrap lg:flex-nowrap">
        {/* Brand Group (Left): Bespoke IV Emblem, Brand Title & Laws & Safety Shield Button */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Bespoke Modern IV Monogram / Vault Emblem */}
          <div 
            onClick={() => setActiveTab("website")}
            className="group relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-md shadow-amber-500/20 shrink-0 cursor-pointer hover:shadow-amber-500/40 transition-all active:scale-95 border border-amber-400/40"
            title="IdeaVault - Official Website"
          >
            <svg 
              viewBox="0 0 32 32" 
              className="h-5 w-5 fill-neutral-950 group-hover:scale-105 transition-transform"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Vault Shield contour */}
              <path d="M16 3L5 7v9c0 7.2 4.7 13.9 11 15.5 6.3-1.6 11-8.3 11-15.5V7L16 3z" fill="#0a0a0a" />
              {/* Stylized IV Monogram */}
              {/* 'I' stem */}
              <rect x="10.5" y="11" width="2.5" height="10" rx="1" fill="#f59e0b" />
              {/* 'V' chevron */}
              <path d="M15.5 11h2.4l2.8 7.2 2.8-7.2H26l-4.1 10h-2.3l-4.1-10z" fill="#f59e0b" />
              {/* Central Keyhole Sparkle */}
              <circle cx="16" cy="18" r="1.2" fill="#fef3c7" />
            </svg>
          </div>

          <button
            onClick={() => setActiveTab("website")}
            className="text-left tracking-tight text-neutral-100 text-base sm:text-lg hover:text-amber-300 transition-colors cursor-pointer mr-0.5 font-bold"
          >
            Idea<span className="text-amber-400 font-extrabold">Vault</span>
          </button>

          {/* Dedicated Shield Button: Laws & Real-Time Safety (Double-click or click to open) */}
          <button
            id="btn-nav-law-shield"
            onClick={onOpenLawAndSafety}
            onDoubleClick={onOpenLawAndSafety}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-neutral-900 to-amber-950/40 hover:from-amber-900/40 hover:to-neutral-850 px-2.5 py-1.5 text-xs font-bold text-amber-300 shadow-sm shadow-amber-500/10 active:scale-95 transition-all cursor-pointer"
            title="🛡️ Laws & Safety Directorate: Real-time scam detection, fraud-free guarantees, UN/WIPO legal rules, and 5-strike fund protection. (Click or double-click to view)"
          >
            <ShieldCheck className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">🛡️ Laws & Safety</span>
            <span className="sm:hidden">🛡️ Laws</span>
          </button>

          {/* Certified & Fraud-Free Button */}
          <button
            id="btn-nav-certified-fraud-free"
            onClick={onOpenEthicalCert}
            className="hidden md:flex items-center gap-1.5 rounded-xl border border-emerald-500/50 bg-emerald-950/50 hover:bg-emerald-900/60 px-2 py-1.5 text-xs font-semibold text-emerald-300 transition-all cursor-pointer"
            title="View Official 100% Fraud-Free & Ethical AI Certification"
          >
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span>Fraud-Free</span>
          </button>
        </div>

        {/* Center Primary Navigation Tabs: Clean, Direct & Uncrowded */}
        <nav className="flex items-center gap-1 rounded-xl bg-neutral-900/90 p-1 border border-neutral-800 text-xs font-medium order-3 lg:order-2 overflow-x-auto">
          {/* Functional Website Button: Opens root domain when mapped, or custom route on preview */}
          <a
            id="nav-website"
            href={getWebsiteLaunchHref()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setActiveTab("website")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
              activeTab === "website"
                ? "bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-black shadow-sm"
                : "text-amber-400 hover:text-amber-300 hover:bg-neutral-800/60 font-bold"
            }`}
            title="Open IdeaVault Website in another tab"
          >
            <Globe className="h-4 w-4 shrink-0" />
            <span>Website</span>
            <ExternalLink className="h-3 w-3 opacity-75 shrink-0" />
          </a>

          <button
            id="nav-foryou"
            onClick={() => setActiveTab("foryou")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
              activeTab === "foryou"
                ? "bg-amber-500 text-neutral-950 font-bold shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
            }`}
          >
            <Flame className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">For You</span>
          </button>

          <button
            id="nav-feed"
            onClick={() => setActiveTab("feed")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
              activeTab === "feed"
                ? "bg-amber-500 text-neutral-950 font-bold shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
            }`}
          >
            <Layers className="h-4 w-4 shrink-0" />
            <span>Ideas</span>
          </button>

          <button
            id="nav-tasks"
            onClick={() => setActiveTab("tasks")}
            className={`hidden md:flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
              activeTab === "tasks"
                ? "bg-amber-500 text-neutral-950 font-bold shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
            }`}
          >
            <Briefcase className="h-4 w-4 shrink-0" />
            <span>Tasks</span>
          </button>

          <button
            id="nav-contracts"
            onClick={() => setActiveTab("contracts")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer ${
              activeTab === "contracts"
                ? "bg-amber-500 text-neutral-950 font-bold shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/50"
            }`}
          >
            <FileText className="h-4 w-4 shrink-0" />
            <span className="hidden sm:inline">Contracts</span>
          </button>

          <button
            id="nav-moderation"
            onClick={() => setActiveTab("moderation")}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all relative cursor-pointer ${
              activeTab === "moderation"
                ? "bg-red-500/90 text-white font-bold shadow-sm"
                : "text-neutral-400 hover:text-red-400 hover:bg-neutral-800/50"
            }`}
            title="Trust & Safety Moderation"
          >
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span className="hidden lg:inline">Safety</span>
            {flaggedCount > 0 && (
              <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                {flaggedCount}
              </span>
            )}
          </button>
        </nav>

        {/* Right Action Tools: Organized, Clean & Functional */}
        <div className="flex items-center gap-1.5 sm:gap-2 order-2 lg:order-3 shrink-0">
          {/* Digital Wallet Button */}
          <button
            id="btn-nav-digital-wallet"
            onClick={onOpenDigitalWallet}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900/90 hover:bg-neutral-800 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-neutral-200 hover:text-emerald-300 transition-all cursor-pointer"
            title="Real-Money Multi-Currency Wallet (Digital Wallet or Any Bank Account)"
          >
            <Wallet className="h-3.5 w-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Wallet</span>
          </button>

          {/* Global & Owner Earnings Dashboard Button */}
          <button
            id="btn-nav-earnings"
            onClick={onOpenEarningsDashboard}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/50 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
            title="Open Global & Owner Earnings Dashboard (Everyone's Earnings + Medha Koirala Master Vault)"
          >
            <LayoutDashboard className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          {/* Live Camera & Screen QR Scanner Button */}
          <button
            id="btn-nav-scanner-pay"
            onClick={onOpenScannerPay}
            className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-neutral-900/90 hover:bg-neutral-800 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-neutral-200 hover:text-amber-300 transition-all cursor-pointer"
            title="Live Camera & Screen QR Code Scanner"
          >
            <QrCode className="h-3.5 w-3.5 text-amber-400" />
            <span className="hidden sm:inline">Scan QR</span>
          </button>

          {/* Currency Switcher */}
          <div className="flex items-center rounded-xl border border-neutral-800 bg-neutral-900 px-1.5 sm:px-2 py-1 text-xs">
            <select
              value={preferredCurrency}
              onChange={(e) => onSelectCurrency(e.target.value as CurrencyCode)}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer text-xs"
              title="Select currency for valuation and payouts"
            >
              {Object.entries(EXCHANGE_RATES).map(([code, item]) => (
                <option key={code} value={code} className="bg-neutral-900 text-neutral-100">
                  {item.symbol} {code}
                </option>
              ))}
            </select>
          </div>

          {/* Post Idea Button (Free) */}
          <button
            id="btn-post-idea-header"
            onClick={onOpenCreateIdea}
            className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-2.5 sm:px-3 py-1.5 text-xs font-extrabold text-neutral-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all active:scale-95 shrink-0 cursor-pointer"
            title="Post a new original idea (Free with automatic copyright filing)"
          >
            <PlusCircle className="h-3.5 w-3.5 font-bold" />
            <span className="hidden sm:inline">Post Idea</span>
          </button>

          {/* Verified Owner Profile (Medha Koirala) - Clean typography, no shouting, MK Monogram */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-neutral-900/90 p-1 sm:px-2 sm:py-1 cursor-pointer hover:border-amber-500/70 transition-all"
              title="Founder & Owner • Copyright Proprietor of the App/Site"
            >
              {/* Monogram Initial Avatar (MK) - No stock photo */}
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/30">
                <span>MK</span>
                <div className="absolute -top-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-amber-400 text-neutral-950 shadow">
                  <Crown className="h-2 w-2 fill-current" />
                </div>
              </div>

              <div className="text-left hidden lg:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-neutral-200 truncate max-w-[90px]">
                    Medha K.
                  </span>
                  <span className="rounded bg-amber-500/20 px-1 py-0.2 text-[9px] font-bold text-amber-300 border border-amber-500/30">
                    Founder
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  {currentUser.balance > 0 ? formatPrice(currentUser.balance, preferredCurrency) : "Pre-Launch"}
                </div>
              </div>
            </button>

            {/* Owner Account Card (Clean display, no multi-persona switcher) */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl border border-neutral-800 bg-neutral-900/98 p-3.5 shadow-2xl backdrop-blur-xl z-50 animate-fadeIn">
                <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 font-black text-sm shadow-md shadow-amber-500/30">
                      MK
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                        Medha Koirala
                        <Crown className="h-3 w-3 text-amber-400 fill-current" />
                      </div>
                      <div className="text-[11px] text-neutral-400">medha.koirala33@gmail.com</div>
                      <div className="text-[10px] text-amber-400 font-medium">Founder & Owner • Copyright Proprietor</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="text-neutral-500 hover:text-neutral-300 p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Profile Photo Pending Notice */}
                <div className="mt-3 rounded-xl bg-neutral-950/70 border border-neutral-800 p-2.5 flex items-center gap-2 text-xs text-neutral-300">
                  <Camera className="h-4 w-4 text-amber-400 shrink-0" />
                  <div className="flex-1 text-[11px]">
                    <span className="text-neutral-200 font-semibold block">Profile Photo:</span>
                    <span className="text-neutral-400">Photo pending upload. Displaying verified MK monogram.</span>
                  </div>
                </div>

                {/* Quick Owner Utilities */}
                <div className="mt-3 space-y-1.5 text-xs">
                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenEarningsDashboard();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-300 hover:bg-amber-900/40 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-bold">
                      <LayoutDashboard className="h-4 w-4 text-amber-400" />
                      Earnings Dashboard (All & Owner)
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenDigitalWallet();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-900/40 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-bold">
                      <Wallet className="h-4 w-4 text-emerald-400" />
                      Digital Wallet & Any Bank
                    </span>
                    <span className="font-mono tabular-nums text-[11px] text-neutral-400">
                      {formatPrice(currentUser.balance || 0, preferredCurrency)}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenLawAndSafety();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-amber-300 border border-neutral-800 transition-colors font-semibold"
                  >
                    <ShieldCheck className="h-4 w-4 text-amber-400" />
                    <span>Laws & 5-Strike Policy</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenAdvancedOwnerControl();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-sky-300 border border-neutral-800 transition-colors font-semibold"
                  >
                    <Crown className="h-4 w-4 text-amber-400" />
                    <span>Owner Command Console</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenSalesGraph();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors"
                  >
                    <BarChart3 className="h-4 w-4 text-emerald-400" />
                    <span>Pre-Launch Metrics</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
