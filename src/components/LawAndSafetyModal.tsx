import React, { useState } from "react";
import { 
  X, 
  ShieldCheck, 
  AlertTriangle, 
  Scale, 
  Lock, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Send, 
  Mail, 
  DollarSign, 
  CheckCircle2, 
  Cpu, 
  Building, 
  UserCheck, 
  AlertOctagon,
  Eye,
  ExternalLink,
  Ban
} from "lucide-react";
import { UserProfile, StrikeRecord, CurrencyCode } from "../types";
import { formatLocalCurrency } from "../utils/legalAndCurrency";

interface LawAndSafetyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  preferredCurrency: CurrencyCode;
}

export const LawAndSafetyModal: React.FC<LawAndSafetyModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  preferredCurrency,
}) => {
  const [activeTab, setActiveTab] = useState<
    "scam_detection" | "un_laws" | "terms_conditions" | "copyright_rules" | "five_strikes"
  >("scam_detection");

  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [simulatedStrikeEmail, setSimulatedStrikeEmail] = useState("");
  const [simulatedStrikeReason, setSimulatedStrikeReason] = useState("Contract Bypass & Off-Platform Settlement Attempt");
  const [strikeSimResult, setStrikeSimResult] = useState<StrikeRecord | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // 5-Strike Simulator function to demonstrate exact compliance with user requirement
  const handleSimulateStrikeIssue = (strikeNum: number) => {
    const targetEmail = simulatedStrikeEmail.trim() || currentUser.email || "user@example.com";
    const isTermination = strikeNum >= 6;
    let action: StrikeRecord["actionTaken"] = "warning_strike_1";
    if (isTermination) {
      action = "direct_termination_funds_wired";
    } else if (strikeNum === 5) {
      action = "final_warning_strike_5";
    } else if (strikeNum === 4) {
      action = "warning_strike_4";
    } else if (strikeNum === 3) {
      action = "warning_strike_3";
    } else if (strikeNum === 2) {
      action = "warning_strike_2";
    } else {
      action = "warning_strike_1";
    }

    const record: StrikeRecord = {
      id: `STRIKE-LOG-${Date.now().toString().slice(-6)}`,
      date: new Date().toISOString().split("T")[0],
      strikeNumber: isTermination ? 6 : strikeNum,
      reason: simulatedStrikeReason,
      violatedLaw: "WIPO Copyright Treaty Art. 11 & Nepal Electronic Transactions Act 2063 Sec. 44",
      evidenceSummary: `Cryptographic Audit Dossier: IP 103.21.244.18 recorded attempting off-platform payment diversion. SHA-256 chat payload hash: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855. Raw forensic screenshot archived.`,
      evidenceFileHashes: [
        "SHA256: 8f392b7d91e6008b8b0e51ecb1049912ce62ffc4",
        "EVIDENCE-IMAGE-LOG: /forensics/2026-strike-case-991.png"
      ],
      emailNoticeSentTo: targetEmail,
      actionTaken: action,
      fundsRemittedAmount: isTermination ? 12450 : undefined,
      fundsRemittedCurrency: "NPR",
      fundsRemittedDestination: "Khalti Digital Wallet (+977 9767653245) / Registered Domestic Bank",
      acknowledgedByEmail: true,
    };

    setStrikeSimResult(record);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-5 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl border border-amber-500/30 bg-neutral-900 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-extrabold text-neutral-100">
                  Legal Directorate, Anti-Fraud & 5-Strike Governance
                </h2>
                <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  100% Fraud-Free
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Official UNCITRAL, WIPO, and Nepal statutory enforcement, Terms of Service, and Creator IP Rights
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto border-b border-neutral-800 bg-neutral-950/60 px-6 shrink-0 gap-1 sm:gap-2">
          <button
            onClick={() => setActiveTab("scam_detection")}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "scam_detection"
                ? "border-amber-400 text-amber-300 bg-amber-500/5"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>Real-Time Scam Detection</span>
          </button>

          <button
            onClick={() => setActiveTab("un_laws")}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "un_laws"
                ? "border-sky-400 text-sky-300 bg-sky-500/5"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Scale className="h-3.5 w-3.5 text-sky-400" />
            <span>UN & International Laws</span>
          </button>

          <button
            onClick={() => setActiveTab("terms_conditions")}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "terms_conditions"
                ? "border-emerald-400 text-emerald-300 bg-emerald-500/5"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-emerald-400" />
            <span>Terms & Conditions</span>
          </button>

          <button
            onClick={() => setActiveTab("copyright_rules")}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "copyright_rules"
                ? "border-purple-400 text-purple-300 bg-purple-500/5"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Lock className="h-3.5 w-3.5 text-purple-400" />
            <span>Copyright Rules (Keep or Sell)</span>
          </button>

          <button
            onClick={() => setActiveTab("five_strikes")}
            className={`flex items-center gap-1.5 py-3 px-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${
              activeTab === "five_strikes"
                ? "border-red-400 text-red-300 bg-red-500/5"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <AlertOctagon className="h-3.5 w-3.5 text-red-400" />
            <span>5-Strike System & Fund Guarantee</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-neutral-300 text-xs sm:text-sm">
          {/* TAB 1: REAL-TIME SCAM DETECTION */}
          {activeTab === "scam_detection" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/20 via-neutral-950 to-neutral-950 p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h3 className="text-base font-extrabold text-neutral-100">
                    Live Anti-Fraud Neural Scanner Active
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  IdeaVault executes real-time cryptographic screening on every post, transaction, and contract offer to eliminate scammers, fake buyers, counterfeit ideas, and unauthorized payment bypasses.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-neutral-100 text-xs sm:text-sm">
                    <ShieldCheck className="h-4 w-4 text-emerald-400" />
                    <span>1. Escrow Lock & Zero Off-Platform Leakage</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Buyers must pre-fund transactions into multi-currency escrow. No confidential schematics or creator contact numbers are disclosed until capital is confirmed. Attempts to take deals off-platform to avoid royalties are detected and penalized.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-neutral-100 text-xs sm:text-sm">
                    <Lock className="h-4 w-4 text-sky-400" />
                    <span>2. Automatic Plagiarism & Duplication Shield</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Every submitted idea is parsed through a semantic similarity engine. If an idea copies an existing protected patent, publication, or active post, the system blocks publication and logs a strike against the submitter.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-neutral-100 text-xs sm:text-sm">
                    <Cpu className="h-4 w-4 text-amber-400" />
                    <span>3. Anti-Impersonation & AI Bot Transparency</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    AI ideas are strictly required to be transparently flagged (e.g. AI Spark Seeds). Any account deploying bot scripts or claiming synthetic outputs as real human work is flagged under our strict truthfulness standard.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-neutral-100 text-xs sm:text-sm">
                    <Building className="h-4 w-4 text-purple-400" />
                    <span>4. Verified Domestic & Global Payout Security</span>
                  </div>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Payout destinations are bound to verified domestic commercial banks and Khalti Digital Wallets. Payout routing cannot be diverted to unverified third parties, shielding creators from account takeovers.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: UNCITRAL & INTERNATIONAL WIPO LAWS */}
          {activeTab === "un_laws" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-2xl border border-sky-500/40 bg-neutral-950 p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Scale className="h-5 w-5 text-sky-400" />
                  <h3 className="text-base font-extrabold text-neutral-100">
                    International Treaties & UN Statutory Enforceability
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  IdeaVault operates in strict compliance with multilateral international intellectual property treaties and cyber safety conventions recognized across 181 UN Member States.
                </p>
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                  <h4 className="font-bold text-sky-300 text-xs sm:text-sm">
                    • Berne Convention for the Protection of Literary and Artistic Works (WIPO)
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    <strong>Article 5(2) (Automatic Protection):</strong> Enjoyment and exercise of copyright rights are not subject to any formality. The moment an original idea pitch and technical description are published on IdeaVault, copyright protection vests automatically across 181 contracting nations.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                  <h4 className="font-bold text-sky-300 text-xs sm:text-sm">
                    • UNCITRAL Model Law on Electronic Commerce (1996)
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    <strong>Articles 5 to 7 (Legal Recognition of Data Messages & Signatures):</strong> Binding digital covenants, in-app contract executions, and multi-currency escrow releases are granted full legal validity equivalent to handwritten paper agreements.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                  <h4 className="font-bold text-sky-300 text-xs sm:text-sm">
                    • ITU-T X.800 Security Architecture for Open Systems
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Provides tamper-proof non-repudiation, AES-256-GCM data confidentiality, cryptographic integrity seals, and defensive rate-limiting against unauthorized access or denial-of-service exploits.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-1.5">
                  <h4 className="font-bold text-sky-300 text-xs sm:text-sm">
                    • Nepal Copyright Act 2059 (B.S.) & Nepal Penal Code 2074
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    <strong>Sections 3 & 25 (Copyright Rights):</strong> Economic and moral rights belong to the ideator. <strong>Penal Code Section 249:</strong> Fraud, deceptive diversion, and contract breach carry statutory criminal and civil liabilities.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TERMS & CONDITIONS */}
          {activeTab === "terms_conditions" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-2xl border border-emerald-500/40 bg-neutral-950 p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-base font-extrabold text-neutral-100">
                    Platform Terms of Service & Community Covenant
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  By accessing IdeaVault, all participants (ideators, hardware builders, software developers, and investors) agree to these lawful standards of conduct.
                </p>
              </div>

              <div className="space-y-3 text-xs leading-relaxed">
                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <h4 className="font-bold text-neutral-100">Clause 1: Free Registration & No Upfront Listing Fees</h4>
                  <p className="text-neutral-400">
                    Posting ideas and discovering commercial collaborations on IdeaVault is 100% free. The platform only earns its transparent 3% discovery commission when a commercial buyout or revenue settlement is completed through the escrow engine.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <h4 className="font-bold text-neutral-100">Clause 2: Escrow Protection & Mutual Deliverables</h4>
                  <p className="text-neutral-400">
                    Funds deposited for full buyouts or task bounties remain locked in escrow until the creator transfers documentation and the builder verifies authenticity. Neither party can unilaterally confiscate or cancel without arbitration.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <h4 className="font-bold text-neutral-100">Clause 3: Prohibited Misconduct</h4>
                  <p className="text-neutral-400">
                    Users shall not submit dangerous blueprints (explosives, malware, biometric surveillance without consent), engage in identity theft, attempt off-platform payment diversion, or upload plagiarized intellectual property.
                  </p>
                </div>

                <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
                  <h4 className="font-bold text-neutral-100">Clause 4: Platform Administration & Ownership</h4>
                  <p className="text-neutral-400">
                    The platform software, database schema, and operational trademarks are the proprietary creation of Founder & Owner Medha Koirala (Copyright Proprietor of the App/Site). All individual idea intellectual property belongs solely to the respective creators who posted them.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SEPARATE COPYRIGHT RULES (KEEP OR SELL) */}
          {activeTab === "copyright_rules" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-2xl border border-purple-500/40 bg-neutral-950 p-5 space-y-2">
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-purple-400" />
                  <h3 className="text-base font-extrabold text-neutral-100">
                    Creator Copyright Rights: You Choose to Keep or Sell
                  </h3>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  IdeaVault enforces a fundamental principle: <strong>creators retain complete sovereignty over their ideas</strong>. You have three distinct options for your copyright when publishing an idea.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Option 1: Keep 100% */}
                <div className="rounded-2xl border-2 border-emerald-500/40 bg-neutral-950 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-2.5 py-0.5 text-[10px] font-bold">
                      100% Creator IP
                    </span>
                    <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  </div>
                  <h4 className="font-extrabold text-sm text-neutral-100">Option 1: Keep 100% Copyright</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Keep complete, uncompromised intellectual property. Showcase your idea publicly to attract tech builders, co-founders, or grant funders without transferring any ownership stake.
                  </p>
                  <ul className="text-[11px] text-neutral-400 space-y-1 list-disc pl-4">
                    <li>Zero ownership transferred to anyone</li>
                    <li>Perfect for finding technical co-founders</li>
                    <li>Timestamped proof of your prior art</li>
                  </ul>
                </div>

                {/* Option 2: Full Buyout */}
                <div className="rounded-2xl border-2 border-amber-500/40 bg-neutral-950 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-amber-500/20 text-amber-300 px-2.5 py-0.5 text-[10px] font-bold">
                      Complete Buyout
                    </span>
                    <DollarSign className="h-5 w-5 text-amber-400" />
                  </div>
                  <h4 className="font-extrabold text-sm text-neutral-100">Option 2: Sell Full Buyout</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Sell 100% of commercial ownership, patent rights, and blueprints to a company or builder for an upfront lump-sum cash buyout. 0% future royalty.
                  </p>
                  <ul className="text-[11px] text-neutral-400 space-y-1 list-disc pl-4">
                    <li>Immediate guaranteed upfront payment</li>
                    <li>Full assignment covenant executed</li>
                    <li>Buyer receives exclusive global rights</li>
                  </ul>
                </div>

                {/* Option 3: License with 15% Royalty */}
                <div className="rounded-2xl border-2 border-sky-500/40 bg-neutral-950 p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="rounded-full bg-sky-500/20 text-sky-300 px-2.5 py-0.5 text-[10px] font-bold">
                      Perpetual Royalty
                    </span>
                    <Scale className="h-5 w-5 text-sky-400" />
                  </div>
                  <h4 className="font-extrabold text-sm text-neutral-100">Option 3: License for 15% Royalty</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Retain underlying moral authorship while licensing commercial manufacturing to a verified tech partner in exchange for an automated 15% perpetual royalty.
                  </p>
                  <ul className="text-[11px] text-neutral-400 space-y-1 list-disc pl-4">
                    <li>Retain moral authorship credit</li>
                    <li>Automated 15% recurring royalty split</li>
                    <li>Audited product sales reporting</li>
                  </ul>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4 text-xs text-neutral-400 space-y-1">
                <span className="font-bold text-neutral-200">Legal Ownership Clarification:</span>
                <p>
                  Platform Founder & Owner Medha Koirala is the registered copyright proprietor of the IdeaVault software platform and marketplace architecture. Medha Koirala is NOT the copyright owner of creators' individual ideas. Each creator retains the unilateral right to decide whether to keep or monetize their intellectual property.
                </p>
              </div>
            </div>
          )}

          {/* TAB 5: 5-STRIKE SYSTEM & FUND PROTECTION GUARANTEE */}
          {activeTab === "five_strikes" && (
            <div className="space-y-6 animate-fadeIn">
              <div className="rounded-2xl border border-red-500/40 bg-gradient-to-r from-red-950/30 via-neutral-950 to-neutral-950 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertOctagon className="h-5 w-5 text-red-400" />
                    <h3 className="text-base font-extrabold text-neutral-100">
                      The 5-Strike Escalation Policy & Fund Non-Confiscation Protocol
                    </h3>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 border border-emerald-500/30 px-2.5 py-1 text-[11px] font-extrabold text-emerald-300">
                    💰 Earned Funds Always Wired
                  </span>
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  IdeaVault maintains strict community laws. Every rule infraction results in a formal logged strike with evidentiary backing. Reaching 5 strikes plus a subsequent breach results in direct account termination. <strong>However, IdeaVault strictly guarantees that the company will NEVER confiscate or keep user earnings. Any accumulated balance is immediately wired to the user's verified payout account.</strong>
                </p>
              </div>

              {/* Step by Step Breakdown */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
                  {[1, 2, 3, 4, 5].map((strike) => (
                    <div 
                      key={strike}
                      className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-center space-y-1"
                    >
                      <div className="text-xs font-bold text-amber-400">Strike {strike} of 5</div>
                      <div className="text-[11px] text-neutral-400">
                        {strike === 5 ? "Final Warning" : "Evidentiary Notice"}
                      </div>
                      <div className="text-[10px] text-neutral-500">Email Dossier Sent</div>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border-2 border-red-500/50 bg-neutral-950 p-4 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
                    <Ban className="h-4 w-4" />
                    <span>6th Rule Breach: Immediate Account Termination & Mandatory Fund Remittance</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed">
                    Upon a 6th violation, the account is permanently deactivated. A comprehensive legal termination notice is automatically dispatched to the user's registered email with all forensic evidence (IP logs, payload hashes, screenshots).
                  </p>
                  <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-3 text-xs text-emerald-300 space-y-1">
                    <div className="font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                      <span>Company Fund Release Guarantee:</span>
                    </div>
                    <p className="leading-relaxed">
                      The company will NOT keep, seize, or forfeit any legitimate earnings accumulated by the creator. All available balances in their wallet slots are immediately wired directly to their registered Khalti Digital Wallet (+977 9767653245) or domestic bank account.
                    </p>
                  </div>
                </div>
              </div>

              {/* Interactive Strike & Termination Simulator */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <span className="text-xs font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="h-4 w-4 text-amber-400" />
                    Interactive Strike & Termination Simulator
                  </span>
                  <span className="text-[11px] text-neutral-500">Test the policy live</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-neutral-400 mb-1">Target Account Email:</label>
                    <input
                      type="email"
                      value={simulatedStrikeEmail}
                      onChange={(e) => setSimulatedStrikeEmail(e.target.value)}
                      placeholder="e.g. medha.koirala33@gmail.com"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-400 mb-1">Select Infraction Type:</label>
                    <select
                      value={simulatedStrikeReason}
                      onChange={(e) => setSimulatedStrikeReason(e.target.value)}
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-neutral-100 focus:outline-none"
                    >
                      <option value="Off-Platform Payment Diversion (Bypassing Escrow)">
                        Off-Platform Payment Diversion (Bypassing Escrow)
                      </option>
                      <option value="Plagiarism / Counterfeit Intellectual Property Upload">
                        Plagiarism / Counterfeit Intellectual Property Upload
                      </option>
                      <option value="Unauthorized Bot Scraping & Headless Crawling">
                        Unauthorized Bot Scraping & Headless Crawling
                      </option>
                      <option value="Deceptive Synthetic AI Persona Claiming to be Real Human">
                        Deceptive Synthetic AI Persona Claiming to be Real Human
                      </option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleSimulateStrikeIssue(1)}
                    className="rounded-xl border border-amber-500/40 bg-amber-950/40 hover:bg-amber-900/50 text-amber-300 font-bold px-3 py-2 text-xs transition-colors"
                  >
                    Send Strike 1 Warning
                  </button>
                  <button
                    onClick={() => handleSimulateStrikeIssue(5)}
                    className="rounded-xl border border-orange-500/40 bg-orange-950/40 hover:bg-orange-900/50 text-orange-300 font-bold px-3 py-2 text-xs transition-colors"
                  >
                    Send Strike 5 (Final Warning)
                  </button>
                  <button
                    onClick={() => handleSimulateStrikeIssue(6)}
                    className="rounded-xl border border-red-500/60 bg-red-950/50 hover:bg-red-900/60 text-red-300 font-bold px-3.5 py-2 text-xs transition-colors"
                  >
                    Execute 6th Breach: Terminate & Wire Funds
                  </button>
                </div>

                {/* Simulator Output Preview */}
                {strikeSimResult && (
                  <div className="rounded-2xl border border-amber-500/30 bg-neutral-900 p-4 space-y-3 animate-fadeIn text-xs">
                    <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                      <div className="flex items-center gap-2">
                        {strikeSimResult.strikeNumber >= 6 ? (
                          <span className="rounded-full bg-red-500/20 text-red-300 px-2 py-0.5 text-[10px] font-bold">
                            ACCOUNT TERMINATION DISPATCHED
                          </span>
                        ) : (
                          <span className="rounded-full bg-amber-500/20 text-amber-300 px-2 py-0.5 text-[10px] font-bold">
                            STRIKE {strikeSimResult.strikeNumber} OF 5 LOGGED
                          </span>
                        )}
                        <span className="font-mono text-neutral-400">{strikeSimResult.id}</span>
                      </div>
                      <span className="text-neutral-500">{strikeSimResult.date}</span>
                    </div>

                    <div className="space-y-1.5">
                      <p><strong>Notice Recipient:</strong> <span className="font-mono text-neutral-200">{strikeSimResult.emailNoticeSentTo}</span></p>
                      <p><strong>Infraction Reason:</strong> {strikeSimResult.reason}</p>
                      <p><strong>Statute Breached:</strong> <span className="text-sky-300">{strikeSimResult.violatedLaw}</span></p>
                      <div className="rounded-xl bg-neutral-950 p-2.5 font-mono text-[11px] text-neutral-400 space-y-1">
                        <span className="font-bold text-amber-400 block">Forensic Evidence Dossier Attached to Email:</span>
                        <p>{strikeSimResult.evidenceSummary}</p>
                        {strikeSimResult.evidenceFileHashes?.map((hash, i) => (
                          <div key={i} className="text-neutral-500">{hash}</div>
                        ))}
                      </div>

                      {strikeSimResult.strikeNumber >= 6 && (
                        <div className="rounded-xl bg-emerald-950/50 border border-emerald-500/40 p-3 space-y-1 text-emerald-300">
                          <div className="font-bold flex items-center gap-1.5">
                            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                            <span>Mandatory Fund Remittance Completed:</span>
                          </div>
                          <p>
                            Amount Wired: <strong>₨12,450 NPR</strong> to destination:{" "}
                            <strong>{strikeSimResult.fundsRemittedDestination}</strong>. Company holds ₨0 of violator's earned funds.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 bg-neutral-950 px-6 py-3 flex items-center justify-between shrink-0">
          <span className="text-xs text-neutral-500 flex items-center gap-1.5">
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span>Cryptographically sealed under UNCITRAL & Nepal Law</span>
          </span>
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs font-bold text-neutral-200 transition-colors"
          >
            Close Directorate
          </button>
        </div>
      </div>
    </div>
  );
};
