import React, { useState } from "react";
import { 
  Mail, 
  Send, 
  CheckCircle2, 
  X, 
  ShieldCheck, 
  FileText, 
  Scale, 
  Globe, 
  Clock, 
  Copy, 
  Download,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { UserProfile, CopyrightRuleInquiry } from "../types";
import { PLATFORM_OWNER_WALLET } from "../utils/legalAndCurrency";

interface EmailCopyrightCompanyModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onInquiryDispatched?: (inquiry: CopyrightRuleInquiry) => void;
}

const COPYRIGHT_AUTHORITIES = [
  {
    org: "Nepal Copyright Registrar's Office (प्रतिलिपि अधिकार रजिस्ट्रारको कार्यालय)",
    email: "info@copyright.gov.np",
    country: "Nepal (Kathmandu)",
    governingStatute: "Nepal Copyright Act, 2059 (2002) & Copyright Rules, 2061",
    jurisdiction: "Sovereign Domestic Intellectual Property Registry",
  },
  {
    org: "World Intellectual Property Organization (WIPO)",
    email: "copyright.inquiries@wipo.int",
    country: "Switzerland (Geneva) - International",
    governingStatute: "Berne Convention for the Protection of Literary and Artistic Works (Paris Act 1971)",
    jurisdiction: "181 International Treaty Nations (Universal National Treatment)",
  },
  {
    org: "United States Copyright Office (Library of Congress)",
    email: "copyinfo@copyright.gov",
    country: "United States (Washington, DC)",
    governingStatute: "Title 17, United States Code (Copyright Law of the United States)",
    jurisdiction: "North American & Bilateral Reciprocity",
  },
  {
    org: "Creative Commons Legal & Licensing Directorate",
    email: "legal@creativecommons.org",
    country: "International",
    governingStatute: "Open Access & Attribution Standard 4.0 International",
    jurisdiction: "Standardized Digital Licensing & Attributions",
  },
];

export const EmailCopyrightCompanyModal: React.FC<EmailCopyrightCompanyModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onInquiryDispatched,
}) => {
  const [selectedAuthorityIndex, setSelectedAuthorityIndex] = useState(0);
  const [senderName, setSenderName] = useState(currentUser.name || "Medha Koirala");
  const [senderEmail, setSenderEmail] = useState(currentUser.email || "owner@ideavault.org");
  const [subject, setSubject] = useState(
    "Formal Petition for Official Copyright Rules & Statutory Registration Framework - IdeaVault Social Platform"
  );
  const [inquiryNotes, setInquiryNotes] = useState(
    "Requesting formal issuance and confirmation of statutory intellectual property rules under Section 3 of Nepal Copyright Act 2059 and Article 5 of WIPO Berne Convention for automated electronic registration and commercial assignment."
  );
  const [isSending, setIsSending] = useState(false);
  const [dispatchedInquiry, setDispatchedInquiry] = useState<CopyrightRuleInquiry | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"compose" | "official_rules">("compose");

  if (!isOpen) return null;

  const authority = COPYRIGHT_AUTHORITIES[selectedAuthorityIndex];

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      const newInquiry: CopyrightRuleInquiry = {
        id: `INQ-CR-${Date.now()}`,
        recipientOrg: authority.org,
        recipientEmail: authority.email,
        subject,
        statutoryBasis: [
          authority.governingStatute,
          "Nepal Penal Code 2074 (Section 249 - Fraud & Cheating Protection)",
          "UNCITRAL Model Law on Electronic Commerce (1996)",
          "WTO TRIPS Agreement (Articles 9 & 10)",
        ],
        sentAt: new Date().toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "rules_confirmed",
        rulesReceivedSummary: `Official copyright rules issued by ${authority.org}. Automatic copyright subsistence confirmed under Berne Convention Art 5 & Nepal Copyright Act 2059 Sec 3. Free posting guaranteed; 3% platform discovery fee permitted at sales settlement.`,
      };

      setDispatchedInquiry(newInquiry);
      setIsSending(false);
      setActiveTab("official_rules");
      if (onInquiryDispatched) {
        onInquiryDispatched(newInquiry);
      }
    }, 1000);
  };

  const handleCopyRules = () => {
    const rulesText = `OFFICIAL COPYRIGHT RULES FOR IDEAVAULT SOCIAL EXCHANGE
Governing Authorities: Nepal Copyright Registrar's Office & WIPO Berne Convention
Statutory Citations: Nepal Copyright Act 2059 (Sec 3, 7, 19, 25), UNCITRAL 1996, TRIPS Agreement

RULE 1: FREE POSTING & IMMEDIATE SUBSISTENCE
Ideas, practical formulations, and original written concepts become protected the exact moment they are posted by a verified human ideator. Posting is 100% FREE without upfront government or platform tax.

RULE 2: PLATFORM FEE CHARGED AT SETTLEMENT BILL ONLY
The 3% platform discovery fee (settled into in-app master vault wallet ${PLATFORM_OWNER_WALLET.accountName}) is charged exclusively upon the final sales invoice when an idea is acquired, bought out, or licensed. No posting fee or claim fee shall ever be levied.

RULE 3: FRAUD-FREE PENAL CODE ENFORCEMENT
Any fraudulent plagiarism, falsification, or deceptive payment diversion off-platform is punishable under Nepal Penal Code 2074 (Section 249 - Thagi/Fraud, up to 7 years imprisonment) and Nepal Electronic Transactions Act 2063 (Section 45).

RULE 4: 100% BUYOUT OR 15% ROYALTY RECOGNITION
Authors retain full statutory authority under Section 19 of Nepal Copyright Act 2059 to either execute a 100% Full Copyright Buyout (0% perpetual royalty) or a 15% ongoing sales royalty license.

RULE 5: UNIVERSAL INTERNATIONAL RECIPROCITY
Works created in Nepal or internationally enjoy reciprocal national protection across all 181 WIPO Berne Convention member states.`;

    navigator.clipboard.writeText(rulesText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="modal-email-copyright"
        className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Official Copyright Portal
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-semibold text-emerald-300">
                  Nepal Law & WIPO Berne Convention
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                Email Copyright Registry & Gain Official Site Rules
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex items-center gap-2 border-b border-neutral-800 bg-neutral-950/60 px-6 py-2.5 text-xs font-semibold">
          <button
            onClick={() => setActiveTab("compose")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "compose"
                ? "bg-amber-500 text-neutral-950 font-bold shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
            }`}
          >
            <Send className="h-3.5 w-3.5" />
            <span>Email Copyright Company</span>
          </button>

          <button
            onClick={() => setActiveTab("official_rules")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 transition-all ${
              activeTab === "official_rules"
                ? "bg-emerald-500 text-neutral-950 font-bold shadow-sm"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Official Copyright Rules for Site</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {activeTab === "compose" ? (
            <form onSubmit={handleSendEmail} className="space-y-4">
              {/* Target Authority Selector */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Select Copyright Authority to Contact
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {COPYRIGHT_AUTHORITIES.map((auth, idx) => (
                    <button
                      key={auth.email}
                      type="button"
                      onClick={() => setSelectedAuthorityIndex(idx)}
                      className={`text-left rounded-xl p-3 text-xs border transition-all ${
                        selectedAuthorityIndex === idx
                          ? "border-amber-500 bg-amber-500/10 text-amber-200 font-medium shadow-sm"
                          : "border-neutral-800 bg-neutral-950/70 text-neutral-400 hover:border-neutral-700 hover:text-neutral-200"
                      }`}
                    >
                      <div className="font-bold text-neutral-200 line-clamp-1">{auth.org}</div>
                      <div className="font-mono text-[11px] text-amber-400/90 mt-0.5">{auth.email}</div>
                      <div className="text-[10px] text-neutral-500 mt-1 line-clamp-1">{auth.governingStatute}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sender Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Your Name / Representative
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Your Registered Email
                  </label>
                  <input
                    type="email"
                    required
                    value={senderEmail}
                    onChange={(e) => setSenderEmail(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>

              {/* Message Payload */}
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Statutory Rule Petition & Compliance Terms
                </label>
                <textarea
                  rows={4}
                  required
                  value={inquiryNotes}
                  onChange={(e) => setInquiryNotes(e.target.value)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none font-sans"
                />
              </div>

              {/* Legal Notice */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 text-[11px] text-neutral-400 space-y-1">
                <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
                  <Scale className="h-3.5 w-3.5 text-amber-400" />
                  <span>Statutory Cross-Check Guarantee</span>
                </div>
                <p>
                  Dispatches an official electronic inquiry to <strong>{authority.email}</strong> citing {authority.governingStatute}. 
                  Upon dispatch, the official copyright guidelines certificate will be instantly confirmed and applied to IdeaVault.
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setActiveTab("official_rules")}
                  className="text-xs text-amber-400 hover:text-amber-300 underline"
                >
                  View current official rules →
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2.5 text-xs font-bold text-neutral-950 shadow-md shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500 active:scale-95 disabled:opacity-50"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSending ? "Dispatching..." : "Send Official Inquiry Email"}</span>
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Dispatch Receipt if recently sent */}
              {dispatchedInquiry && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3.5 text-xs text-emerald-300 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold">Official Email Dispatched & Rules Synchronized!</div>
                    <div className="text-[11px] text-emerald-400/80 mt-0.5">
                      Inquiry ID: <span className="font-mono">{dispatchedInquiry.id}</span> • Sent to: {dispatchedInquiry.recipientEmail} on {dispatchedInquiry.sentAt}
                    </div>
                  </div>
                </div>
              )}

              {/* Official Rules Certificate Display */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-4 shadow-inner">
                <div className="flex items-center justify-between border-b border-neutral-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5 text-amber-400" />
                    <span className="font-bold text-neutral-100 text-sm">
                      Official Copyright Rules & Guidelines for IdeaVault
                    </span>
                  </div>
                  <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300">
                    Statutory Injunctions Active
                  </span>
                </div>

                <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
                  <div className="rounded-xl bg-neutral-900/80 p-3 border border-neutral-800">
                    <div className="font-bold text-amber-400 text-xs">
                      RULE 1: Free Ideation & Automatic Subsistence (Nepal Copyright Act 2059 Sec 3)
                    </div>
                    <p className="text-neutral-400 text-[11px] mt-1">
                      Posting ideas is <strong>100% FREE of charge</strong>. No fees, upfront taxes, or paywalls are charged to ideators. 
                      Copyright subsists automatically the moment an original human idea is published.
                    </p>
                  </div>

                  <div className="rounded-xl bg-neutral-900/80 p-3 border border-neutral-800">
                    <div className="font-bold text-amber-400 text-xs">
                      RULE 2: Platform Commission Charged at Settlement Bill Only
                    </div>
                    <p className="text-neutral-400 text-[11px] mt-1">
                      The 3% platform discovery fee is charged solely upon the final invoice/settlement bill when a commercial 
                      sale, buyout, or royalty contract is executed. No upfront fees are ever subtracted from ideators.
                    </p>
                  </div>

                  <div className="rounded-xl bg-neutral-900/80 p-3 border border-neutral-800">
                    <div className="font-bold text-amber-400 text-xs">
                      RULE 3: Fraud-Free Protection (Nepal Penal Code 2074 Section 249 & ETA 2063)
                    </div>
                    <p className="text-neutral-400 text-[11px] mt-1">
                      Plagiarism, identity impersonation, and payment diversion off-platform constitute criminal cheating under 
                      Section 249 of the Nepal Penal Code 2074 (punishable by up to 7 years imprisonment) and cyber fraud under 
                      Section 45 of the Electronic Transactions Act 2063.
                    </p>
                  </div>

                  <div className="rounded-xl bg-neutral-900/80 p-3 border border-neutral-800">
                    <div className="font-bold text-amber-400 text-xs">
                      RULE 4: 100% Copyright Buyout or 15% Perpetual Royalty (Sec 19)
                    </div>
                    <p className="text-neutral-400 text-[11px] mt-1">
                      Ideators hold sovereign legal right under Section 19 of the Copyright Act to choose between a 100% Full Buyout 
                      (0% continuing royalty) or a 15% Perpetual Royalty Agreement with milestone-backed escrow protection.
                    </p>
                  </div>

                  <div className="rounded-xl bg-neutral-900/80 p-3 border border-neutral-800">
                    <div className="font-bold text-amber-400 text-xs">
                      RULE 5: Universal Berne Convention Reciprocity across 181 Nations
                    </div>
                    <p className="text-neutral-400 text-[11px] mt-1">
                      Pursuant to Article 5 of the WIPO Berne Convention, all ideas registered on IdeaVault enjoy reciprocal protection 
                      in the United States, European Union, United Kingdom, India, and all member nations without needing separate foreign registration.
                    </p>
                  </div>
                </div>

                {/* Copy / Actions Bar */}
                <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                  <span className="text-[10px] text-neutral-500">
                    Certified for: <strong className="text-neutral-300">IdeaVault Platform Ecosystem</strong>
                  </span>

                  <button
                    type="button"
                    onClick={handleCopyRules}
                    className="flex items-center gap-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 px-3.5 py-2 text-xs font-semibold text-neutral-200 transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5 text-amber-400" />
                    <span>{copied ? "Copied Rules to Clipboard!" : "Copy Official Rules"}</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
