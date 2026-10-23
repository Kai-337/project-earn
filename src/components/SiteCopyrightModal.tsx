import React, { useState } from "react";
import { SiteCopyrightRegistration } from "../types";
import { 
  ShieldCheck, 
  X, 
  FileCheck, 
  Copy, 
  Check, 
  Download, 
  Award, 
  Scale, 
  Lock, 
  Sparkles,
  Smartphone
} from "lucide-react";

interface SiteCopyrightModalProps {
  isOpen: boolean;
  onClose: () => void;
  copyright: SiteCopyrightRegistration;
}

export const SiteCopyrightModal: React.FC<SiteCopyrightModalProps> = ({
  isOpen,
  onClose,
  copyright,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(
      `IdeaVault Master Platform Copyright Registration\nCertificate ID: ${copyright.certificateNumber}\nRegistered Owner: ${copyright.ownerFullName} (${copyright.ownerEmail})\nCountry: ${copyright.ownerCountry}\nCryptographic Signature: ${copyright.cryptographicSignature}\nStatutes: Nepal Copyright Act 2059 & WIPO Berne Convention`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const text = `================================================================================
OFFICIAL CERTIFICATE OF COPYRIGHT REGISTRATION & PLATFORM OWNERSHIP
GOVERNMENT OF NEPAL COPYRIGHT REGIME & WIPO BERNE CONVENTION
================================================================================

CERTIFICATE REGISTRATION ID: ${copyright.certificateNumber}
REGISTRATION DATE: ${copyright.filingDate}
STATUS: OFFICIALLY REGISTERED & PERPETUALLY SEALED

PROPRIETOR / AUTHOR:
Full Legal Name: ${copyright.ownerFullName}
Email: ${copyright.ownerEmail}
Country of Origin: ${copyright.ownerCountry}
Beneficiary Master Wallet: ${copyright.feeBeneficiaryWallet || "IdeaVault Master Multi-Currency Vault Wallet"}

SUBJECT MATTER OF INTELLECTUAL PROPERTY:
Work Title: ${copyright.platformName}
Nature of Work: Original Software Architecture, Idea Exchange & Task Marketplace Engine,
                Dynamic 1:1 Real Human Sunsetting Mechanism, Automated 15% Ideator
                Royalty Covenant & 3% Platform Discovery Fee Structure.

STATUTORY FOUNDATIONS & INTERNATIONAL RECIPROCITY:
${copyright.governingLaws.map((law, idx) => `[${idx + 1}] ${law}`).join("\n")}

EXCLUSIVE RIGHTS REGISTERED TO PROPRIETOR:
${copyright.rightsGranted.map((r, idx) => ` - ${r}`).join("\n")}

CRYPTOGRAPHIC TAMPER-PROOF SIGNATURE:
${copyright.cryptographicSignature}

SEALED AND ATTESTED PERPETUALLY FOR MEDHA KOIRALA.
================================================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `IdeaVault_Site_Copyright_Certificate_${copyright.ownerFullName.replace(/\s+/g, "_")}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-3xl border-2 border-amber-500/40 bg-neutral-950 p-6 sm:p-8 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Certificate Golden Seal & Header */}
        <div className="text-center pb-6 border-b border-neutral-800">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-700 shadow-xl shadow-amber-500/30 text-neutral-950 mb-3">
            <Award className="h-9 w-9 stroke-[2.2]" />
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-bold text-amber-400 mb-2">
            <ShieldCheck className="h-4 w-4" />
            Official Certificate of Copyright Registration
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
            IdeaVault Platform Copyright Ownership
          </h2>
          <p className="mt-1 text-xs sm:text-sm text-neutral-400">
            Registered under the Nepal Copyright Act 2059 (B.S.) & WIPO Berne Convention
          </p>
        </div>

        {/* Certificate Main Parchment Card */}
        <div className="mt-6 rounded-2xl border border-amber-500/30 bg-gradient-to-b from-neutral-900 via-neutral-900/80 to-neutral-950 p-5 sm:p-6 space-y-5">
          {/* Certificate Metadata Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-neutral-800">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Registered Copyright Owner & Author
              </span>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-base sm:text-lg font-extrabold text-neutral-100">
                  {copyright.ownerFullName}
                </span>
                <span className="rounded bg-sky-500/20 px-1.5 py-0.5 text-[10px] font-bold text-sky-400 border border-sky-500/30">
                  Sole Proprietor
                </span>
              </div>
              <div className="text-xs text-neutral-400 font-mono mt-0.5">
                {copyright.ownerEmail} • {copyright.ownerCountry}
              </div>
            </div>

            <div className="sm:text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Official Registration Number
              </span>
              <div className="mt-1 text-xs sm:text-sm font-mono font-bold text-amber-400 break-all">
                {copyright.certificateNumber}
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-0.5 flex items-center sm:justify-end gap-1">
                <Check className="h-3 w-3" /> Sealed & Legally Active
              </div>
            </div>
          </div>

          {/* Master Wallet & Economic Rights */}
          <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-4">
            <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
              <Smartphone className="h-4 w-4 text-sky-400" />
              Perpetual Platform Discovery Commission Ownership
            </div>
            <p className="mt-1 text-xs text-neutral-300 leading-relaxed">
              The platform's <strong>3% discovery commission</strong> is registered and automatically credited to Medha Koirala's verified Master Multi-Currency Digital Wallet (<strong>{copyright.feeBeneficiaryWallet || "IdeaVault Master Vault Wallet"}</strong>) across all transactional buyouts, sales, and task royalties, with direct domestic bank and digital wallet withdrawal channels.
            </p>
          </div>

          {/* Exclusive Rights Granted */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Exclusive Unilateral Rights Granted to Medha Koirala:
            </span>
            <div className="mt-2 space-y-1.5">
              {copyright.rightsGranted.map((right, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-neutral-200">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                  <span>{right}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Statutory Foundations */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
              Governing Statutes & Treaties:
            </span>
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-neutral-300">
              {copyright.governingLaws.map((law, idx) => (
                <div key={idx} className="rounded-lg bg-neutral-950/70 p-2 border border-neutral-800 flex items-center gap-2">
                  <Scale className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                  <span className="line-clamp-1">{law}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Digital Signature */}
          <div className="rounded-xl bg-neutral-950 p-3 border border-neutral-800">
            <div className="flex items-center justify-between text-[10px] text-neutral-500 mb-1">
              <span>CRYPTOGRAPHIC MASTER HASH</span>
              <span className="text-emerald-400">HMAC-SHA256 INTACT</span>
            </div>
            <div className="font-mono text-xs text-amber-300 break-all select-all">
              {copyright.cryptographicSignature}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800">
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Lock className="h-4 w-4 text-emerald-400" />
            <span>Permanent Inalienable Registration</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyHash}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-3.5 py-2 text-xs font-semibold text-neutral-200 transition-colors"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
              <span>{copied ? "Copied Record" : "Copy Certificate"}</span>
            </button>

            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-2 text-xs font-bold text-neutral-950 shadow-md shadow-amber-500/20 hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download Official Certificate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
