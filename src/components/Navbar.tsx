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
  LayoutDashboard,
  UserPlus,
  Briefcase as InvestorIcon,
  Lightbulb,
  Film,
  Search
} from "lucide-react";
import { EXCHANGE_RATES, formatPrice } from "../utils/legalAndCurrency";
import { AccountCreationType } from "../types";
import { Upload } from "lucide-react";
import { IdeaVaultLogo } from "./IdeaVaultLogo";

interface NavbarProps {
  currentUser: UserProfile;
  activeTab: "website" | "feed" | "foryou" | "tasks" | "contracts" | "moderation";
  setActiveTab: (tab: "website" | "feed" | "foryou" | "tasks" | "contracts" | "moderation") => void;
  onOpenStandaloneWebsite: () => void;
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
  onOpenCreateAccount?: (accountType: AccountCreationType) => void;
  onOpenLegalDocs?: () => void;
  onOpenPromoVideo?: () => void;
  onOpenSeoGuide?: () => void;
  preferredCurrency: CurrencyCode;
  onSelectCurrency: (curr: CurrencyCode) => void;
  flaggedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  onOpenStandaloneWebsite,
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
  onOpenCreateAccount,
  onOpenLegalDocs,
  onOpenPromoVideo,
  onOpenSeoGuide,
  preferredCurrency,
  onSelectCurrency,
  flaggedCount,
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-800/80 bg-neutral-950/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-3 sm:px-6 py-2.5 gap-2 flex-wrap lg:flex-nowrap">
        {/* Brand Group (Left): Iconic Vault-Bulb Keyhole Emblem & Brand Title */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onOpenStandaloneWebsite}
            className="group cursor-pointer transition-transform hover:scale-105 active:scale-95"
            title="Open Official IdeaVault Website"
          >
            <IdeaVaultLogo size="sm" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("foryou")}
            className="text-left tracking-tight text-neutral-100 text-base sm:text-lg hover:text-amber-300 transition-colors cursor-pointer mr-0.5 font-bold"
            title="IdeaVault Marketplace Home"
          >
            Idea<span className="text-amber-400 font-extrabold">Vault</span>
          </button>
        </div>

        {/* Center Primary Navigation Tabs: Clean, Direct & Uncrowded */}
        <nav className="flex items-center gap-1 rounded-xl bg-neutral-900/90 p-1 border border-neutral-800 text-xs font-medium order-3 lg:order-2 overflow-x-auto">
          {/* Website Button: Immediately opens the full standalone IdeaVault App Website */}
          <button
            id="nav-website"
            type="button"
            onClick={onOpenStandaloneWebsite}
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all cursor-pointer border border-amber-500/40 bg-amber-500/15 hover:bg-amber-500 hover:text-neutral-950 text-amber-300 font-bold shadow-sm"
            title="Open Official IdeaVault Website"
          >
            <Globe className="h-4 w-4 shrink-0" />
            <span>Website</span>
            <ExternalLink className="h-3 w-3 opacity-80 shrink-0" />
          </button>

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

          {/* Promo Video Studio Quick Button */}
          {onOpenPromoVideo && (
            <button
              id="btn-nav-promo-video"
              type="button"
              onClick={onOpenPromoVideo}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-neutral-900/90 hover:bg-neutral-800 px-2 sm:px-2.5 py-1.5 text-xs font-bold text-amber-300 hover:text-amber-200 transition-all cursor-pointer"
              title="Watch & Download Official IdeaVault Promotional Video"
            >
              <Film className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              <span className="hidden xl:inline">Promo Video</span>
            </button>
          )}

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

          {/* Create Account Button (Investor or Idea Poster) */}
          {onOpenCreateAccount && (
            <button
              id="btn-nav-create-account"
              onClick={() => onOpenCreateAccount("idea_poster")}
              className="flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 px-2.5 sm:px-3 py-1.5 text-xs font-bold text-emerald-300 transition-all cursor-pointer shrink-0"
              title="Create Account: Choose 1. Investor Account or 2. Idea Poster Account"
            >
              <UserPlus className="h-3.5 w-3.5 text-emerald-400" />
              <span className="hidden md:inline">Sign Up</span>
            </button>
          )}

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

          {/* Verified Owner Profile (Medha Koirala) */}
          <div className="relative">
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-neutral-900/90 p-1 sm:px-2 sm:py-1 cursor-pointer hover:border-amber-500/70 transition-all"
              title="Founder & Owner Account"
            >
              <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 font-black text-xs shadow-md shadow-amber-500/30 overflow-hidden">
                {currentUser.avatar &&
                currentUser.avatar.startsWith("data:image/") &&
                !currentUser.avatar.startsWith("data:image/svg+xml") ? (
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span>MK</span>
                )}
              </div>

              <div className="text-left hidden lg:block">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-semibold text-neutral-200 truncate max-w-[90px]">
                    {currentUser.name || "Medha K."}
                  </span>
                </div>
                <div className="text-[10px] text-neutral-400 font-mono">
                  {currentUser.balance > 0 ? formatPrice(currentUser.balance, preferredCurrency) : "Owner"}
                </div>
              </div>
            </button>

            {/* Owner Account Card */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-neutral-800 bg-neutral-900/98 p-3.5 shadow-2xl backdrop-blur-xl z-50 animate-fadeIn">
                <div className="flex items-start justify-between pb-3 border-b border-neutral-800">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-700 text-neutral-950 font-black text-sm shadow-md shadow-amber-500/30 overflow-hidden shrink-0">
                      {currentUser.avatar &&
                      currentUser.avatar.startsWith("data:image/") &&
                      !currentUser.avatar.startsWith("data:image/svg+xml") ? (
                        <img
                          src={currentUser.avatar}
                          alt={currentUser.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span>MK</span>
                      )}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-neutral-100 flex items-center gap-1.5">
                        {currentUser.name || "Medha Koirala"}
                        <Crown className="h-3 w-3 text-amber-400 fill-current" />
                      </div>
                      <div className="text-[11px] text-neutral-400">{currentUser.email || "medha.koirala33@gmail.com"}</div>
                      <div className="text-[10px] text-amber-400 font-medium">
                        {currentUser.uploadedFiles?.length
                          ? `${currentUser.uploadedFiles.length} file(s) attached`
                          : "Founder & Owner"}
                        {currentUser.wallet?.ownerQrAccount?.qrImageDataUrl ? " · NPR QR Active" : ""}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="text-neutral-500 hover:text-neutral-300 p-1"
                  >
                    ✕
                  </button>
                </div>

                {/* Quick Owner Utilities */}
                <div className="mt-3 space-y-1.5 text-xs">
                  {onOpenCreateAccount && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenCreateAccount("owner");
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-2">
                        <Upload className="h-4 w-4" />
                        My Owner Uploads &amp; NPR QR Code
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenEarningsDashboard();
                    }}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-neutral-950 border border-neutral-800 text-amber-300 hover:bg-neutral-800 transition-colors cursor-pointer"
                  >
                    <span className="flex items-center gap-2 font-bold">
                      <LayoutDashboard className="h-4 w-4 text-amber-400" />
                      Earnings Dashboard (All &amp; Owner)
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
                      <QrCode className="h-4 w-4 text-emerald-400" />
                      Owner NPR QR &amp; Digital Wallet
                    </span>
                    <span className="font-mono tabular-nums text-[11px] text-neutral-400">
                      ₨{Math.round((currentUser.wallet?.currencySlots?.NPR || 0)).toLocaleString()} NPR
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setIsProfileMenuOpen(false);
                      onOpenAdvancedOwnerControl();
                    }}
                    className="w-full flex items-center gap-2 p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-sky-300 border border-neutral-800 transition-colors font-semibold cursor-pointer"
                  >
                    <Crown className="h-4 w-4 text-amber-400" />
                    <span>Owner Command Console</span>
                  </button>

                  {onOpenLegalDocs && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenLegalDocs();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-amber-300 border border-neutral-800 transition-colors font-semibold cursor-pointer"
                    >
                      <Scale className="h-4 w-4 text-amber-400" />
                      <span>Copyright Legal Documents (All 4 Deeds)</span>
                    </button>
                  )}

                  {onOpenPromoVideo && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenPromoVideo();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 transition-colors font-semibold cursor-pointer"
                    >
                      <Film className="h-4 w-4 text-amber-400" />
                      <span>Promo Video Studio (Play &amp; Download)</span>
                    </button>
                  )}

                  {onOpenSeoGuide && (
                    <button
                      onClick={() => {
                        setIsProfileMenuOpen(false);
                        onOpenSeoGuide();
                      }}
                      className="w-full flex items-center gap-2 p-2 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-emerald-300 border border-neutral-800 transition-colors font-semibold cursor-pointer"
                    >
                      <Search className="h-4 w-4 text-emerald-400" />
                      <span>Search Engine Indexing Guide (SEO)</span>
                    </button>
                  )}

                  {onOpenCreateAccount && (
                    <div className="pt-2 mt-2 border-t border-neutral-800 grid grid-cols-2 gap-1.5">
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenCreateAccount("investor");
                        }}
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-500/30 font-semibold transition-colors cursor-pointer"
                      >
                        <InvestorIcon className="h-3.5 w-3.5" />
                        <span>Investor Account</span>
                      </button>
                      <button
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenCreateAccount("idea_poster");
                        }}
                        className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 border border-amber-500/30 font-semibold transition-colors cursor-pointer"
                      >
                        <Lightbulb className="h-3.5 w-3.5" />
                        <span>Idea Poster Account</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
