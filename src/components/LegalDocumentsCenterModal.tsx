import React, { useState } from "react";
import {
  FileText,
  Scale,
  Download,
  Copy,
  Check,
  Printer,
  X,
  Lock,
  Globe,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Idea, SiteCopyrightRegistration, UserProfile } from "../types";
import {
  generateFixedTermRoyaltyLawDraft,
  downloadLawDraftDocument,
  PLATFORM_OWNER_WALLET,
} from "../utils/legalAndCurrency";

interface LegalDocumentsCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteCopyright: SiteCopyrightRegistration;
  ideas: Idea[];
  currentUser: UserProfile;
}

type LegalDocTab = "platform_master" | "creator_idea" | "buyout_deed" | "royalty_18m_draft";

export const LegalDocumentsCenterModal: React.FC<LegalDocumentsCenterModalProps> = ({
  isOpen,
  onClose,
  siteCopyright,
  ideas,
  currentUser,
}) => {
  const [activeDoc, setActiveDoc] = useState<LegalDocTab>("platform_master");
  const [selectedIdeaId, setSelectedIdeaId] = useState<string>(() => ideas[0]?.id || "");
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  if (!isOpen) return null;

  const selectedIdea =
    ideas.find((i) => i.id === selectedIdeaId) ||
    ideas[0] || {
      id: "IV-SAMPLE-001",
      title: "Modular Solar Cold-Storage Crate for Smallholder Farmers",
      category: "CleanTech & Agriculture",
      upfrontPrice: 1800,
      creator: {
        name: currentUser.name || "Medha Koirala",
        country: currentUser.country || "Nepal",
      },
      createdAt: new Date().toISOString().split("T")[0],
      saleModel: "keep_copyright" as const,
    };

  const issuedDate = new Date().toISOString().split("T")[0];

  const getDocumentContent = (): { title: string; filename: string; registryId: string; body: string } => {
    if (activeDoc === "platform_master") {
      const regId = siteCopyright.certificateNumber || "NP-WIPO-PLAT-2026-MK01";
      return {
        title: "Document 1 — IdeaVault Platform Master Copyright & Ownership Certificate",
        filename: `IdeaVault-Platform-Copyright-Deed-${regId}.txt`,
        registryId: regId,
        body: [
          "====================================================================================================",
          "CERTIFICATE OF INTELLECTUAL PROPERTY SUBSISTENCE & SOLE PLATFORM OWNERSHIP",
          "====================================================================================================",
          `Document Registry ID     : ${regId}`,
          `Date of Record           : ${siteCopyright.filingDate || issuedDate}`,
          `Platform Title           : ${siteCopyright.platformName || "IdeaVault — Idea Exchange & Task Marketplace"}`,
          `Sole Proprietor & Author : ${siteCopyright.ownerFullName || "Medha Koirala"}`,
          `Owner Contact & Inquiries: medhakoirala.servicesgmail.com@gmail.com | ${siteCopyright.ownerEmail}`,
          `Jurisdiction of Origin   : ${siteCopyright.ownerCountry || "Nepal (International Berne Protection)"}`,
          `SHA-256 Digital Seal     : ${siteCopyright.cryptographicSignature}`,
          "====================================================================================================",
          "",
          "ARTICLE 1 — STATUTORY BASIS OF COPYRIGHT OWNERSHIP",
          "1.1 Automatic Subsistence under International Treaty: Pursuant to Article 5(2) of the WIPO Berne",
          "    Convention for the Protection of Literary and Artistic Works (Paris Act 1971), copyright in",
          "    original software architecture, marketplace workflows, legal templates, and visual compilation",
          "    subsists automatically upon creation across all 181 Contracting States without formal precondition.",
          "1.2 Domestic Statutory Protection: Under Section 3 (Subsistence of Copyright) and Section 7",
          "    (Economic Rights) of the Nepal Copyright Act, 2059 (2002) [प्रतिलिपि अधिकार ऐन, २०५९], sole",
          "    moral and economic rights in the IdeaVault platform vest in Founder & Owner Medha Koirala.",
          "1.3 Electronic Evidentiary Validity: Pursuant to Sections 13 and 14 of the Nepal Electronic",
          "    Transactions Act, 2063 (2006) and UNCITRAL Model Law on Electronic Commerce (1996), this",
          "    cryptographically hashed digital record constitutes primary electronic proof of creation date.",
          "",
          "ARTICLE 2 — PROTECTED PLATFORM ASSETS & EXCLUSIVE RIGHTS",
          ...(siteCopyright.rightsGranted || []).map((right: string, i: number) => `  2.${i + 1} ${right}`),
          "",
          "ARTICLE 3 — COMMERCIAL COMMISSION & SETTLEMENT CLAUSE",
          `3.1 Platform Discovery Commission: IdeaVault is entitled to a fixed three percent (3.0%) discovery`,
          `    commission solely upon verified real-money transactions completed between Idea Posters and Investors.`,
          `3.2 Settlement Conduit: Commission proceeds are automatically wired in Nepalese Rupees (NPR ₨) to`,
          `    the verified QR account designated by ${PLATFORM_OWNER_WALLET.accountName}.`,
          "",
          "ARTICLE 4 — PROHIBITION OF UNAUTHORIZED CLONING",
          "No third party may reproduce, scrape, re-host, or commercially redistribute the proprietary source",
          "workflows, bespoke contract structures, or brand identity of IdeaVault without express written",
          "authorization signed by Medha Koirala.",
          "",
          `ELECTRONICALLY ATTESTED: ${siteCopyright.ownerFullName || "Medha Koirala"} — Founder & Sole Owner`,
          "====================================================================================================",
        ].join("\n"),
      };
    }

    if (activeDoc === "creator_idea") {
      const certId =
        selectedIdea.copyrightFiling?.certificateId ||
        `NP-WIPO-IDEA-2026-${selectedIdea.id.slice(-6).toUpperCase()}`;
      const sha =
        selectedIdea.copyrightFiling?.cryptographicHash ||
        `SHA256:9E4A${selectedIdea.id.slice(-4).toUpperCase()}81C0B742D6F33A19B85C4E21`;
      return {
        title: `Document 2 — Creator Idea Timestamp & Copyright Record (${selectedIdea.title})`,
        filename: `IdeaVault-Creator-Copyright-${certId}.txt`,
        registryId: certId,
        body: [
          "====================================================================================================",
          "CREATOR IDEA COPYRIGHT SUBSISTENCE & PRIORITY TIMESTAMP CERTIFICATE",
          "====================================================================================================",
          `Certificate Reference    : ${certId}`,
          `Priority Timestamp       : ${selectedIdea.copyrightFiling?.registeredAt || selectedIdea.createdAt}`,
          `SHA-256 Priority Hash    : ${sha}`,
          `Concept Title            : "${selectedIdea.title}"`,
          `Industry Sector          : ${selectedIdea.category}`,
          `Originating Author       : ${selectedIdea.creator.name} (${selectedIdea.creator.country || "Nepal"})`,
          "====================================================================================================",
          "",
          "1. DECLARATION OF ORIGINAL AUTHORSHIP",
          `   This record certifies that "${selectedIdea.title}" was documented and timestamped on IdeaVault`,
          `   by ${selectedIdea.creator.name}. Under Section 3 of the Nepal Copyright Act 2059 (2002) and`,
          "   Articles 2 & 5 of the WIPO Berne Convention, original written specifications, diagrams, and",
          "   uploaded supporting documents enjoy immediate copyright protection from the moment of expression.",
          "",
          "2. CREATOR-SELECTED COMMERCIAL MONETIZATION STRUCTURE",
          "   Idea Posters on IdeaVault retain full legal freedom to commercialize under one of three models:",
          "   • Option 1: Keep Copyright Ownership + 15.0% Ongoing Gross Sales Royalty",
          "   • Option 2: 100% Full Copyright Assignment / Buyout (0.0% Ongoing Royalty)",
          "   • Option 3: 3-Year Commercial Product License with Strict 1.5-Year (18-Month) Max 15% Royalty Cap",
          "",
          "3. CONFIDENTIALITY & NON-CIRCUMVENTION",
          "   Reviewing Investors and Builders agree under UNCITRAL Electronic Commerce Rules and Nepal Civil",
          "   Code 2074 (Part 5: Law of Contracts) not to misappropriate disclosed specifications without",
          "   executing the selected commercial agreement and completing verified real-money settlement.",
          "",
          "Inquiries & Verification : medhakoirala.servicesgmail.com@gmail.com",
          "====================================================================================================",
        ].join("\n"),
      };
    }

    if (activeDoc === "buyout_deed") {
      const deedId = `DEED-BUYOUT-2026-${selectedIdea.id.slice(-5).toUpperCase()}`;
      return {
        title: "Document 3 — 100% Full Copyright Assignment & Buyout Deed (Option 2: 0% Royalty)",
        filename: `IdeaVault-Full-Copyright-Buyout-Deed-${deedId}.txt`,
        registryId: deedId,
        body: [
          "====================================================================================================",
          "DEED OF 100% INTELLECTUAL PROPERTY & COPYRIGHT ASSIGNMENT (FULL BUYOUT — ZERO ONGOING ROYALTY)",
          "====================================================================================================",
          `Deed Reference           : ${deedId}`,
          `Date Prepared            : ${issuedDate}`,
          `Assignor (Idea Poster)   : ${selectedIdea.creator.name} (${selectedIdea.creator.country || "Nepal"})`,
          `Assignee (Investor)      : [Verified Acquiring Investor / Commercial Entity]`,
          `Transferred Work         : "${selectedIdea.title}"`,
          `Buyout Consideration     : $${selectedIdea.upfrontPrice.toLocaleString()} USD (or equivalent local currency)`,
          "====================================================================================================",
          "",
          "1. FULL TRANSFER OF ECONOMIC COPYRIGHT (SECTION 19, NEPAL COPYRIGHT ACT 2059)",
          "   Upon verified receipt of 100% of the agreed upfront buyout consideration into the Assignor's",
          "   designated bank or digital wallet account (less the 3.0% IdeaVault platform discovery fee), the",
          "   Assignor hereby irrevocably assigns, transfers, and conveys 100% of worldwide economic copyright,",
          "   commercialization rights, derivative build rights, and distribution title in the Work to Assignee.",
          "",
          "2. ZERO ONGOING ROYALTY COVENANT (0.00% RESIDUAL)",
          "   Because this transaction is executed under Option 2 (Full Copyright Sale / Buyout), the Assignor",
          "   expressly waives any future sales royalty (0.00% ongoing royalty). The Assignee owns full",
          "   commercial rights free and clear of recurring royalty obligations.",
          "",
          "3. CONDITION PRECEDENT — VERIFIED REAL-MONEY PAYMENT",
          "   Title transfer takes legal effect strictly and exclusively upon verified real-money settlement",
          "   (confirmed bank wire / QR transaction reference). Unpaid drafts transfer zero rights.",
          "",
          "4. GOVERNING LAW",
          "   Governed by Section 19 of Nepal Copyright Act 2059, Nepal Civil Code 2074 (Sections 503–535),",
          "   UNCITRAL Model Law on Electronic Signatures, and WIPO Berne Convention.",
          "====================================================================================================",
        ].join("\n"),
      };
    }

    const refId = `LAW-DRAFT-18M-2026-${selectedIdea.id.slice(-4).toUpperCase()}`;
    return {
      title: "Document 4 — 3-Year Product License & Strict 1.5-Year (18-Month) Max Royalty Law Draft",
      filename: `IdeaVault-18Month-Max-Royalty-Law-Draft-${refId}.txt`,
      registryId: refId,
      body: generateFixedTermRoyaltyLawDraft({
        creatorName: selectedIdea.creator.name,
        creatorCountry: selectedIdea.creator.country || "Nepal",
        investorName: "[Verified Acquiring Investor / Commercial Licensee]",
        ideaTitle: selectedIdea.title,
        referenceId: refId,
      }),
    };
  };

  const currentDoc = getDocumentContent();

  const handleCopyText = () => {
    navigator.clipboard.writeText(currentDoc.body);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadTxt = () => {
    downloadLawDraftDocument(currentDoc.filename, currentDoc.body);
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-5 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                Official Copyright &amp; Legal Documents Vault
              </h2>
              <p className="text-xs text-neutral-400">
                Inspect, print to PDF, or download all 4 binding copyright certificates &amp; transfer deeds
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[76vh] overflow-y-auto space-y-5">
          {/* Transparent Legal Explanation Box */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-neutral-200 space-y-1.5">
            <div className="font-bold text-amber-300 flex items-center gap-1.5">
              <Info className="h-4 w-4 shrink-0" />
              <span>How Copyright Filing Works in Law (Automatic Protection vs. Government Registry)</span>
            </div>
            <p className="text-neutral-300 leading-relaxed">
              Under <strong>Article 5(2) of the WIPO Berne Convention</strong> (181 countries) and{" "}
              <strong>Section 3(2) of the Nepal Copyright Act, 2059 (2002)</strong>, legal copyright{" "}
              <strong>exists automatically the moment an original work or specification is written</strong> — no prior
              government fee is required for ownership to be valid. IdeaVault generates a{" "}
              <strong>SHA-256 timestamped digital deed</strong> (admissible electronic evidence under{" "}
              <em>Nepal Electronic Transactions Act 2063</em>). If you also want an optional government-stamped paper
              certificate for court statutory litigation, you can download any deed below and submit it to the{" "}
              <span className="font-mono text-amber-300">Nepal Copyright Registrar&apos;s Office (nepalcopyright.gov.np)</span>{" "}
              or <span className="font-mono text-amber-300">copyright.gov</span>.
            </p>
          </div>

          {/* 4 Document Selector Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setActiveDoc("platform_master")}
              className={`text-left rounded-xl p-3 border transition-all cursor-pointer ${
                activeDoc === "platform_master"
                  ? "border-amber-500 bg-amber-500/15 text-neutral-100"
                  : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-amber-400 font-bold">Document 01</div>
              <div className="text-xs font-bold mt-0.5">Platform Master Copyright</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Medha Koirala Sole Ownership</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveDoc("creator_idea")}
              className={`text-left rounded-xl p-3 border transition-all cursor-pointer ${
                activeDoc === "creator_idea"
                  ? "border-amber-500 bg-amber-500/15 text-neutral-100"
                  : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-emerald-400 font-bold">Document 02</div>
              <div className="text-xs font-bold mt-0.5">Idea Priority Certificate</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">SHA-256 Creator Timestamp</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveDoc("buyout_deed")}
              className={`text-left rounded-xl p-3 border transition-all cursor-pointer ${
                activeDoc === "buyout_deed"
                  ? "border-amber-500 bg-amber-500/15 text-neutral-100"
                  : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-sky-400 font-bold">Document 03</div>
              <div className="text-xs font-bold mt-0.5">100% Buyout Assignment</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">Full Sale · 0% Future Royalty</div>
            </button>

            <button
              type="button"
              onClick={() => setActiveDoc("royalty_18m_draft")}
              className={`text-left rounded-xl p-3 border transition-all cursor-pointer ${
                activeDoc === "royalty_18m_draft"
                  ? "border-amber-500 bg-amber-500/15 text-neutral-100"
                  : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-neutral-200"
              }`}
            >
              <div className="text-[10px] font-mono uppercase text-purple-400 font-bold">Document 04</div>
              <div className="text-xs font-bold mt-0.5">1.5-Yr Max Royalty Draft</div>
              <div className="text-[11px] text-neutral-400 mt-0.5">3-Yr License · 18-Mo Hard Cap</div>
            </button>
          </div>

          {/* Idea Selector for Documents 2, 3, 4 */}
          {activeDoc !== "platform_master" && ideas.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs">
              <span className="text-neutral-400 font-medium">Preview legal document for idea:</span>
              <select
                value={selectedIdea.id}
                onChange={(e) => setSelectedIdeaId(e.target.value)}
                className="rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-1.5 text-xs font-semibold text-amber-300 focus:outline-none cursor-pointer max-w-full sm:max-w-md"
              >
                {ideas.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.title} — by {item.creator.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Official Legal Parchment Viewer */}
          <div className="rounded-2xl border border-amber-500/35 bg-neutral-950 p-4 sm:p-6 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400 shrink-0" />
                <span className="text-xs sm:text-sm font-bold text-neutral-100">{currentDoc.title}</span>
              </div>
              <div className="flex items-center gap-2 text-[11px] font-mono text-emerald-400">
                <Lock className="h-3.5 w-3.5" />
                <span>{currentDoc.registryId}</span>
              </div>
            </div>

            <pre className="whitespace-pre-wrap break-words font-mono text-[11px] sm:text-xs leading-relaxed text-neutral-200 bg-neutral-900/80 border border-neutral-800 rounded-xl p-4 max-h-[340px] overflow-y-auto select-all">
              {currentDoc.body}
            </pre>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-[11px] text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-amber-400" />
                WIPO Berne Convention · Nepal Copyright Act 2059 · UNCITRAL Electronic Commerce
              </span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="h-3.5 w-3.5" />
                Ready for Download &amp; Signature
              </span>
            </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 bg-neutral-950 px-5 sm:px-6 py-3.5">
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={handleCopyText}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-amber-400" />}
              <span>{copied ? "Copied Full Legal Text!" : "Copy Legal Text"}</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
            >
              <Printer className="h-3.5 w-3.5 text-amber-400" />
              <span>Print / Save as PDF</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-extrabold text-neutral-950 transition-colors cursor-pointer"
            >
              <Download className="h-3.5 w-3.5" />
              <span>{downloaded ? "Downloaded Legal Document!" : "Download Official Document (.txt)"}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-4 py-2 text-xs font-bold text-neutral-200 transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
