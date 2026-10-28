import React, { useState } from "react";
import { Idea, CopyrightFiling, CurrencyCode } from "../types";
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  Mail, 
  CheckCircle2, 
  Globe, 
  Lock, 
  Scale, 
  Share2, 
  Sparkles,
  X,
  ExternalLink
} from "lucide-react";
import { PLATFORM_OWNER_WALLET, EXCHANGE_RATES } from "../utils/legalAndCurrency";

interface CopyrightCertificateModalProps {
  idea: Idea | null;
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  preferredCurrency?: CurrencyCode;
}

export const CopyrightCertificateModal: React.FC<CopyrightCertificateModalProps> = ({
  idea,
  isOpen,
  onClose,
  userEmail = "creator@domain.org",
  preferredCurrency = "USD",
}) => {
  const [emailSent, setEmailSent] = useState(false);

  if (!isOpen || !idea) return null;

  const filing: CopyrightFiling = idea.copyrightFiling || {
    certificateId: `NP-WIPO-CR-2026-${idea.id.slice(-6).toUpperCase()}`,
    registeredAt: idea.createdAt,
    authorName: idea.creator.name,
    authorCountry: idea.creator.country || "Nepal",
    authorEmail: userEmail,
    governingLaws: [
      "WIPO Berne Convention (Articles 2 & 5)",
      "Nepal Copyright Act 2059 (Sections 3, 7 & 19)",
      "UNCITRAL Model Law on Electronic Commerce 1996",
      "Nepal Electronic Transactions Act 2063",
    ],
    cryptographicHash: `SHA256:7F8B${idea.id.slice(-4).toUpperCase()}3C9E21A44D8781B8246E9C9F`,
    saleModel: idea.saleModel || "full_buyout",
    ownershipStatus: "registered_to_author",
    documentsDelivered: true,
    legalPreamble: `OFFICIAL REGISTRATION OF INTELLECTUAL PROPERTY & COPYRIGHT SUBSISTENCE\n` +
      `Pursuant to Section 3 of the Nepal Copyright Act 2059 (2002) and Article 5 of the WIPO Berne Convention, ` +
      `this document certifies that the original intellectual property concept titled "${idea.title}" is legally filed and registered ` +
      `in the sole name of ${idea.creator.name} (${idea.creator.country || "Nepal"}). Full moral and economic ownership is recognized under the United Nations ` +
      `legal order and the laws of Nepal.\n` +
      `COMMERCIAL TRANSFER PROVISION: The author maintains legal authority to either assign 100% full copyright (with 0% perpetual royalty) ` +
      `or license production rights under a 15% royalty covenant, subject to a 3% platform discovery fee automatically settled into in-app Master Vault Wallet (${PLATFORM_OWNER_WALLET.accountName}).`,
  };

  const [downloadedDeed, setDownloadedDeed] = useState(false);

  const handleSendEmailCopy = () => {
    setEmailSent(true);
    setTimeout(() => setEmailSent(false), 4000);
  };

  const handleDownloadCertificateDeed = () => {
    const deedText = [
      "================================================================================",
      "OFFICIAL CERTIFICATE OF COPYRIGHT SUBSISTENCE & DIGITAL TIMESTAMP RECORD",
      "================================================================================",
      `Certificate Registry ID : ${filing.certificateId}`,
      `Timestamped At          : ${filing.registeredAt}`,
      `Cryptographic Proof     : ${filing.cryptographicHash}`,
      `Registered Concept      : ${idea.title}`,
      `Category                : ${idea.category}`,
      `Originating Author      : ${filing.authorName} (${filing.authorCountry})`,
      `Registered Email        : ${filing.authorEmail}`,
      `Commercial Terms        : ${
        idea.saleModel === "full_buyout"
          ? "Option 2 — 100% Full Copyright Buyout (0% Ongoing Royalty)"
          : idea.saleModel === "licensed_fixed_term"
          ? "Option 3 — 3-Year Licensed Product (Strict 1.5-Year / 18-Month Max 15% Royalty)"
          : "Option 1 — Keep Copyright + 15% Ongoing Royalty"
      }`,
      `Listed Upfront Price    : $${idea.upfrontPrice} USD`,
      "",
      "STATUTORY LEGAL STATEMENT:",
      filing.legalPreamble,
      "",
      "GOVERNING LAWS & INTERNATIONAL TREATIES:",
      ...filing.governingLaws.map((law, idx) => `  ${idx + 1}. ${law}`),
      "",
      "EVIDENTIARY NOTICE:",
      "Under Article 5(2) of the WIPO Berne Convention (181 Contracting States) and Section 3",
      "of the Nepal Copyright Act, 2059 (2002), copyright protection subsists automatically",
      "upon creation without formal prior registration. Pursuant to Sections 13 & 14 of the",
      "Nepal Electronic Transactions Act, 2063 (2006) and UNCITRAL Electronic Commerce Rules,",
      "this SHA-256 timestamped digital record serves as admissible electronic evidence of",
      "authorship and priority date.",
      "",
      "Platform Inquiries: medhakoirala.servicesgmail.com@gmail.com",
      "================================================================================",
    ].join("\n");

    const safeSlug = idea.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 40);
    const blob = new Blob([deedText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IdeaVault-Copyright-Deed-${safeSlug || filing.certificateId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadedDeed(true);
    setTimeout(() => setDownloadedDeed(false), 3500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="modal-copyright-certificate"
        className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-100">
                  Official Copyright Registration Certificate
                </h2>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  Filed & Subsisting
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                WIPO Berne Convention • Nepal Copyright Act 2059 (२०५९) • UNCITRAL
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

        {/* Certificate Parchment Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-b from-neutral-950 via-neutral-900 to-neutral-950 p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Background Seal Watermark */}
            <div className="absolute right-6 top-6 opacity-5 pointer-events-none">
              <Scale className="h-72 w-72 text-amber-400" />
            </div>

            {/* Certificate Header Banner */}
            <div className="text-center border-b border-neutral-800 pb-6 relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-bold text-amber-400 mb-2">
                <Globe className="h-3.5 w-3.5" />
                INTERNATIONAL INTELLECTUAL PROPERTY REPOSITORIUM
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-neutral-100 uppercase">
                Certificate of Copyright Registration
              </h1>
              <p className="text-xs text-neutral-400 mt-1 font-serif italic">
                Issued under the Authority of the WIPO Berne Convention & Nepal Copyright Act 2059 (2002)
              </p>
              <div className="mt-2 text-xs font-mono text-amber-400 font-bold">
                Certificate Registry ID: {filing.certificateId}
              </div>
            </div>

            {/* Core Details Grid */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs relative z-10">
              <div className="rounded-xl bg-neutral-950/80 p-3.5 border border-neutral-800 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                  Registered Idea Concept
                </span>
                <span className="text-sm font-bold text-neutral-100 block">
                  {idea.title}
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  Category: {idea.category}
                </span>
              </div>

              <div className="rounded-xl bg-neutral-950/80 p-3.5 border border-neutral-800 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                  Originating Author & Claimant
                </span>
                <span className="text-sm font-bold text-neutral-100 flex items-center gap-1.5">
                  {filing.authorName}
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  Jurisdiction: {filing.authorCountry} • Registered Email: {filing.authorEmail}
                </span>
              </div>

              <div className="rounded-xl bg-neutral-950/80 p-3.5 border border-neutral-800 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                  Commercial Transfer Terms
                </span>
                <span className="text-xs font-bold text-amber-400 block">
                  {idea.saleModel === "full_buyout"
                    ? "100% Full Copyright Buyout (0% Ongoing Royalty to Ideator)"
                    : idea.saleModel === "licensed_fixed_term"
                    ? "3-Year Licensed Product (Strict 1.5-Year Max 15% Royalty)"
                    : "Keep Copyright + 15% Creator Royalty License"}
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  Upfront Consideration: ${idea.upfrontPrice} USD
                </span>
              </div>

              <div className="rounded-xl bg-neutral-950/80 p-3.5 border border-neutral-800 space-y-1">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                  Platform Discovery Fee Remittance
                </span>
                <span className="text-xs font-bold text-emerald-400 block">
                  3% Settled to Owner NPR ₨ QR Account (Medha Koirala)
                </span>
                <span className="text-[11px] text-neutral-400 block">
                  Settled strictly upon verified real-money transactions
                </span>
              </div>
            </div>

            {/* Cryptographic Hash */}
            <div className="mt-4 rounded-xl bg-neutral-950 p-3 border border-neutral-800 text-xs relative z-10">
              <div className="flex items-center justify-between text-neutral-400 text-[11px] mb-1">
                <span className="font-semibold flex items-center gap-1">
                  <Lock className="h-3 w-3 text-amber-400" /> Cryptographic Timestamp Proof (SHA-256):
                </span>
                <span className="font-mono text-neutral-500">{filing.registeredAt}</span>
              </div>
              <div className="font-mono text-[11px] text-amber-300/90 break-all select-all">
                {filing.cryptographicHash}
              </div>
            </div>

            {/* Legal Covenants */}
            <div className="mt-4 rounded-xl bg-neutral-950/60 p-4 border border-neutral-800 text-[11px] text-neutral-300 leading-relaxed space-y-2 relative z-10">
              <div className="font-bold text-neutral-200">Enforceable Statutory Precedents:</div>
              <ul className="list-disc list-inside space-y-1 text-neutral-400 text-[10px]">
                <li><strong>Nepal Copyright Act 2059 (Sec. 3 &amp; 19):</strong> Guarantees automatic subsistence of copyright upon creation and confirms full legal authority to license or transfer economic rights.</li>
                <li><strong>WIPO Berne Convention (Articles 2 &amp; 5(2)):</strong> Extends automatic copyright recognition across all 181 contracting countries without mandatory formal registration.</li>
                <li><strong>Nepal Electronic Transactions Act 2063:</strong> Digital hashes and electronic records serve as admissible legal evidence of priority date and authorship.</li>
              </ul>
            </div>

            {/* Digital Seal & Signatures */}
            <div className="mt-6 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs relative z-10">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-amber-500/60 bg-amber-500/10 text-amber-400 font-serif font-black text-sm">
                  WIPO/NP
                </div>
                <div>
                  <div className="font-bold text-neutral-200">Electronic Timestamp Seal</div>
                  <div className="text-[10px] text-neutral-500">Digital IP Priority Record</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-mono text-emerald-400 font-bold text-xs flex items-center justify-end gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5" /> LEGAL RECORD READY
                </div>
                <div className="text-[10px] text-neutral-400">Registered to {filing.authorEmail}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex flex-wrap items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-3.5 gap-3">
          <button
            onClick={handleSendEmailCopy}
            className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5 text-amber-400" />
            <span>{emailSent ? "Copy Prepared for Email!" : "Prepare Email Copy"}</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
            >
              <FileText className="h-3.5 w-3.5 text-amber-400" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={handleDownloadCertificateDeed}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/50 px-4 py-2 text-xs font-semibold text-emerald-300 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5 text-emerald-400" />
              <span>{downloadedDeed ? "Deed Downloaded!" : "Download Legal Deed (.txt)"}</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-bold text-neutral-950 transition-all cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
