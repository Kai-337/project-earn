import React, { useState } from "react";
import { 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  BookOpen, 
  Globe, 
  FileText, 
  AlertTriangle,
  Lock,
  ExternalLink,
  Smartphone
} from "lucide-react";

interface LegalCrossCheckModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalCrossCheckModal: React.FC<LegalCrossCheckModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [filterRegion, setFilterRegion] = useState<"all" | "nepal" | "international">("all");

  if (!isOpen) return null;

  const STATUTORY_PROVISIONS = [
    {
      region: "nepal",
      statute: "Nepal Penal Code, 2074 (2017) [मुलुकी अपराध संहिता, २०७४]",
      section: "Section 249 (Offence of Cheating / Thagi & Fraud - ठगी गर्न नहुने)",
      penalty: "Imprisonment up to 7 years and fine up to ₨70,000 NPR, plus restitution of entire proceeds.",
      crossCheckCompliance: "IdeaVault enforces escrow holding and strict identity verification to eliminate fraudulent attempts. Any scam attempt to divert payment or misrepresent ownership is immediately frozen and referred to legal authorities.",
      status: "100% Compliant & Active",
    },
    {
      region: "nepal",
      statute: "Nepal Electronic Transactions Act, 2063 (2006) [विद्युतीय कारोबार ऐन, २०६३]",
      section: "Section 44 (Alteration of Computer Source Code) & Section 45 (Unauthorized Access & Fraud)",
      penalty: "Imprisonment up to 3 years or fine up to ₨200,000 NPR or both.",
      crossCheckCompliance: "All idea filings, SHA-256 cryptographic hashes, and digital signatures are immutable. Tampering with idea timestamps or contracts is legally prohibited and forensically tracked.",
      status: "100% Compliant & Active",
    },
    {
      region: "nepal",
      statute: "Nepal Copyright Act, 2059 (2002) [प्रतिलिपि अधिकार ऐन, २०५९]",
      section: "Section 3 (Immediate Subsistence), Section 19 (Transfer & Assignment), Section 25/27 (Infringement Remedies)",
      penalty: "Civil damages, immediate statutory injunction, confiscation of infringing products, and criminal fines up to ₨100,000 NPR.",
      crossCheckCompliance: "Immediate copyright protection is granted for free upon idea posting. Section 19 legalizes 100% Full Copyright Buyouts and 15% royalty co-production agreements.",
      status: "100% Compliant & Active",
    },
    {
      region: "nepal",
      statute: "Nepal Consumer Protection Act, 2075 (2018) [उपभोक्ता संरक्षण ऐन, २०७५]",
      section: "Sections 16 & 18 (Prohibition of Misleading Pricing & Unfair Platform Practices)",
      penalty: "Immediate regulatory stop-order and fines up to ₨300,000 NPR.",
      crossCheckCompliance: "Posting is completely free! The 3% platform discovery fee is clearly disclosed and charged strictly at the settlement bill when a sale takes place, guaranteeing zero surprise charges.",
      status: "100% Compliant & Active",
    },
    {
      region: "international",
      statute: "UNCITRAL Model Law on Electronic Commerce (1996)",
      section: "Articles 6, 7 & 8 (Legal Recognition of Electronic Signatures and Data Messages)",
      penalty: "International invalidation of deceptive electronic transactions.",
      crossCheckCompliance: "Digital contracts and bills executed between creators and buyers hold full legal equivalence to paper contracts across international jurisdictions.",
      status: "100% Compliant & Active",
    },
    {
      region: "international",
      statute: "WTO TRIPS Agreement (Trade-Related Aspects of Intellectual Property Rights)",
      section: "Articles 9, 10 & 41 (Enforcement of Intellectual Property Rights)",
      penalty: "Bilateral trade remedies and multilateral civil sanctions.",
      crossCheckCompliance: "Mandates effective procedures to prevent infringement, protecting both Nepali domestic creators and international commercial tech builders.",
      status: "100% Compliant & Active",
    },
    {
      region: "international",
      statute: "WIPO Berne Convention for the Protection of Literary and Artistic Works",
      section: "Article 5(1) & (2) (National Treatment and Absence of Formalities)",
      penalty: "Universal international copyright subsistence across 181 member states.",
      crossCheckCompliance: "Ideas conceived and published on IdeaVault enjoy reciprocal protection worldwide. Foreign buyers must respect the original ideator's moral and economic rights.",
      status: "100% Compliant & Active",
    },
  ];

  const filtered = STATUTORY_PROVISIONS.filter((item) => {
    if (filterRegion === "all") return true;
    return item.region === filterRegion;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="modal-legal-cross-check"
        className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                  Fraud-Free Compliance Audit
                </span>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-semibold text-emerald-300">
                  Nepal Laws & International Treaties
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                Statutory Cross-Check & Fraud-Free Certification
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

        {/* Region Filter */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/60 px-6 py-3">
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setFilterRegion("all")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                filterRegion === "all"
                  ? "bg-amber-500 text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              }`}
            >
              All Laws ({STATUTORY_PROVISIONS.length})
            </button>
            <button
              onClick={() => setFilterRegion("nepal")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                filterRegion === "nepal"
                  ? "bg-amber-500 text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              }`}
            >
              Nepal Law Provisions (4)
            </button>
            <button
              onClick={() => setFilterRegion("international")}
              className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                filterRegion === "international"
                  ? "bg-amber-500 text-neutral-950 shadow-sm"
                  : "text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200"
              }`}
            >
              International Treaties (3)
            </button>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            <span>0 Fraud Injunctions Active</span>
          </div>
        </div>

        {/* Content List */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {filtered.map((item, idx) => (
            <div 
              key={idx}
              className="rounded-xl border border-neutral-800 bg-neutral-950/90 p-4 space-y-2 hover:border-neutral-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded bg-neutral-800 border border-neutral-700 px-2 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                    {item.region === "nepal" ? "Nepal Statutory Law" : "International Treaty"}
                  </span>
                  <h3 className="text-sm font-bold text-neutral-100 mt-1">
                    {item.statute}
                  </h3>
                  <div className="text-xs font-medium text-emerald-400/90 mt-0.5">
                    {item.section}
                  </div>
                </div>

                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 shrink-0">
                  {item.status}
                </span>
              </div>

              <div className="rounded-lg bg-neutral-900/90 p-3 border border-neutral-800/80 text-xs text-neutral-300">
                <span className="font-semibold text-neutral-200">How IdeaVault Complies: </span>
                <span>{item.crossCheckCompliance}</span>
              </div>

              <div className="text-[11px] text-red-400/90 flex items-start gap-1.5 pt-1">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-red-400" />
                <span>Statutory Penalty for Violation: {item.penalty}</span>
              </div>
            </div>
          ))}

          {/* Digital Wallet & Pricing Clarity Notice */}
          <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4 text-xs text-sky-200 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-sky-300">
              <Smartphone className="h-4 w-4" />
              <span>Transparent 3% Settlement Platform Fee & Multi-Currency Digital Wallet</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              In full compliance with Nepal Consumer Protection Act 2075 and Payment & Settlement Act 2075, 
              <strong> posting is completely free</strong>. The platform commission (3%) is only charged at the settlement bill when a sale 
              actually takes place, with automated transparent routing to the Platform Owner's In-App Master Vault Wallet (Medha Koirala), 
              from which on-demand domestic bank withdrawals and Khalti Digital Wallet payouts can be executed.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-3">
          <span className="text-xs text-neutral-500">
            Certified by IdeaVault Trust & Legal Safety Directorate
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 hover:bg-neutral-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
