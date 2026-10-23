import React, { useState } from "react";
import { UserProfile, CurrencyCode } from "../types";
import { EXCHANGE_RATES } from "../utils/legalAndCurrency";
import { 
  UserPlus, 
  X, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Globe, 
  CreditCard,
  Mail,
  Phone,
  User,
  Scale
} from "lucide-react";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: (user: UserProfile) => void;
}

const COUNTRIES = [
  { name: "Nepal", code: "NPR", dial: "+977" },
  { name: "United States", code: "USD", dial: "+1" },
  { name: "India", code: "INR", dial: "+91" },
  { name: "United Kingdom", code: "GBP", dial: "+44" },
  { name: "Germany (EU)", code: "EUR", dial: "+49" },
  { name: "Australia", code: "AUD", dial: "+61" },
  { name: "Canada", code: "CAD", dial: "+1" },
  { name: "Japan", code: "JPY", dial: "+81" },
];

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onAccountCreated,
}) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Nepal");
  const [phone, setPhone] = useState("+977 ");
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>("NPR");
  const [profession, setProfession] = useState("");
  const [agreedToRules, setAgreedToRules] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCountryChange = (cName: string) => {
    setCountry(cName);
    const found = COUNTRIES.find((c) => c.name === cName);
    if (found) {
      setPreferredCurrency(found.code as CurrencyCode);
      setPhone(found.dial + " ");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError("Please fill out your name and valid email.");
      return;
    }

    // Check readable Roman of any language or English
    const readableRomanRegex = /^[\p{L}\p{N}\s._'-]+$/u;
    if (!readableRomanRegex.test(name.trim())) {
      setError("Profile name should be in readable text (English or Roman script of any language, e.g. 'Ramro_Udyog', 'Maria_Smith', 'Sunil_Ktm').");
      return;
    }

    if (!agreedToRules) {
      setError("You must agree to the United Nations Legal Order and Nepal Laws compliance terms.");
      return;
    }

    const cleanHandle = `@${name.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "_").slice(0, 24)}`;
    const newUser: UserProfile = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      handle: cleanHandle,
      avatar: `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random() * 1000)}?w=150&auto=format&fit=crop&q=80`,
      role: "creator_ideator",
      headline: profession ? `${profession} • Verified Creator` : "Independent Product Creator",
      profession: profession.trim() || "Independent Creator",
      backgroundField: country === "Nepal" ? "Nepali Domain Experience" : "Domain Problem Solver",
      isNonTech: true,
      isRealHuman: true,
      passedHumanVerification: false, // Will trigger interactive "I'm a human" test right after login
      interests: ["Consumer Products & Lifestyle", "Everyday Life Hacks & Tools", "Physical Hardware & Robotics"],
      skills: ["Product Ideation", "Domain Problem Solving"],
      balance: 0, // Pre-launch zero balance until actual transactions
      escrowBalance: 0,
      totalRoyaltiesEarned: 0,
      activeContractsCount: 0,
      isSiteOwner: false,
      email: email.trim(),
      country,
      phone: phone.trim(),
      preferredCurrency,
      wallet: {
        walletId: `VAULT-${Date.now().toString().slice(-6)}`,
        vaultAccountId: `VAULT-${name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase()}${Date.now().toString().slice(-4)}`,
        securityPin: "2059",
        biometricsEnabled: true,
        isLocked: false,
        currencySlots: { USD: 0, NPR: 0, INR: 0, EUR: 0, GBP: 0, AUD: 0, CAD: 0, JPY: 0, PLN: 0 },
        withdrawalMethods: [],
        transactions: [],
      },
      strikesCount: 0,
      isBanned: false,
      strikeRecords: [],
      agreedToUnAndNepalLaws: true,
    };

    onAccountCreated(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="modal-create-account"
        className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                Create Account to Post & File Copyrights
              </h2>
              <p className="text-xs text-neutral-400">
                Required to verify authorship, deliver legal papers & receive payouts
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Full Name */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-neutral-300">
                Full Name / Creator Handle <span className="text-amber-400">*</span>
              </label>
              <span className="text-[10px] text-emerald-400 font-medium">
                Any Roman language or English accepted
              </span>
            </div>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Medha Koirala / Ramro_Udyog / Maria_Creations"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-10 pr-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              No rigid rules: Use English or any readable Roman script (e.g., Romanized Nepali like <em>Ktm_Sachetana</em>, Romanized Hindi, Spanish, French, etc.).
            </p>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Email Address <span className="text-amber-400">*</span> (For Legal Papers & Strike Notices)
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="medha.koirala33@gmail.com"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-10 pr-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
            </div>
            <p className="text-[10px] text-neutral-500 mt-1">
              Official copyright certificates, sales contracts, and any legal warnings will be dispatched to this email.
            </p>
          </div>

          {/* Country & Currency Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Your Country <span className="text-amber-400">*</span>
              </label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 focus:border-amber-500 focus:outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Payout Currency <span className="text-amber-400">*</span>
              </label>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value as CurrencyCode)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 focus:border-amber-500 focus:outline-none"
              >
                {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
                  <option key={code} value={code}>
                    {info.symbol} {code} - {info.country}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Phone / Contact number */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Phone Number {country === "Nepal" && <span className="text-emerald-400">(Nepal Contact & Digital Payouts)</span>}
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={country === "Nepal" ? "+977 98XXXXXXXX or 97XXXXXXXX" : "+1 555-0199"}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-10 pr-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none font-mono"
              />
            </div>
            <p className="text-[10px] text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="h-3 w-3" />
              Earnings store securely in your In-App Digital Wallet, with withdrawal to any commercial bank or digital wallet.
            </p>
          </div>

          {/* Profession / Role */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Your Real-World Profession or Domain <span className="text-neutral-500">(Non-tech welcomed!)</span>
            </label>
            <input
              type="text"
              value={profession}
              onChange={(e) => setProfession(e.target.value)}
              placeholder="e.g., Agriculturalist, Teacher, Electrician, Student, Chef"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Legal Compliance & 3-Strike Warning Covenant */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
              <Scale className="h-4 w-4 text-amber-400" />
              <span>United Nations Order of Law & Nepal Law Covenant</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              All members operate under the <strong>WIPO Berne Convention</strong>, <strong>UNCITRAL Model Law</strong>, and <strong>Nepal Copyright Act 2059</strong>. 
              Authorship is legally secured upon posting.
            </p>
            <div className="rounded-lg bg-neutral-950/80 p-2.5 border border-neutral-800 text-[11px] text-red-300 space-y-1">
              <div className="font-bold text-red-400">Strict 3-Strike System:</div>
              <div>• Any copyright infringement, illegal content, or policy breach triggers a legal strike dispatched to your email.</div>
              <div>• <strong>3 strikes and your account is permanently banned</strong> from all posting, selling, and contracting privileges.</div>
            </div>

            <label className="flex items-start gap-2.5 pt-1 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={agreedToRules}
                onChange={(e) => setAgreedToRules(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-950 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-[11px] text-neutral-200 leading-snug">
                I agree to the UN & Nepal legal framework, confirm all posted ideas are my authentic intellectual creations, and accept the 3-strike compliance policy.
              </span>
            </label>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={!agreedToRules}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 py-3 text-sm font-bold text-neutral-950 shadow-lg shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Create Account & Start Posting
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
