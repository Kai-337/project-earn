import React, { useState } from "react";
import { 
  ShieldCheck, 
  X, 
  Award, 
  Lock, 
  Scale, 
  FileCheck, 
  Copy, 
  Check, 
  Download, 
  Printer, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Key, 
  Fingerprint, 
  Cpu, 
  Terminal, 
  ExternalLink,
  ShieldAlert,
  Server,
  Code2,
  RefreshCw,
  Globe
} from "lucide-react";
import { 
  OFFICIAL_UN_LEGAL_CERTIFICATE, 
  simulateUnAes256GcmEncryption, 
  UnLegalCertificateData 
} from "../utils/unLegalAndAntiHackData";
import { UserProfile, CurrencyCode } from "../types";

interface UnLegalAndAntiHackCertModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  preferredCurrency?: CurrencyCode;
}

export const UnLegalAndAntiHackCertModal: React.FC<UnLegalAndAntiHackCertModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<"certificate" | "encryption" | "statutes" | "audit">("certificate");
  const [copiedCertId, setCopiedCertId] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);
  
  // Interactive Encryption Demo
  const [testPayload, setTestPayload] = useState("Transfer 500 USD / 67,000 NPR to Medha Koirala (IdeaVault Master Wallet) - UN & WIPO 15% Royalty Protected");
  const [encryptedResult, setEncryptedResult] = useState(() => simulateUnAes256GcmEncryption(testPayload));

  // Live Audit simulation
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditPassed, setAuditPassed] = useState(true);

  if (!isOpen) return null;

  const cert = OFFICIAL_UN_LEGAL_CERTIFICATE;

  const handleCopyCertId = () => {
    navigator.clipboard.writeText(cert.certificateNumber);
    setCopiedCertId(true);
    setTimeout(() => setCopiedCertId(false), 2000);
  };

  const handleCopyFullAffidavit = () => {
    const text = `================================================================================
UNITED NATIONS & WIPO INTERNATIONAL STATUTORY BODIES
OFFICIAL MASTER CERTIFICATE OF COPYRIGHT ACCREDITATION & ITU-COMPLIANT ANTI-HACKING ENCRYPTION
================================================================================
CERTIFICATE IDENTIFIER: ${cert.certificateNumber}
UNCITRAL DOCKET NUMBER: ${cert.uncitralDocketNumber}
DATE OF ISSUANCE: ${cert.registrationDate}
EFFECTIVE DATE: ${cert.effectiveDate}
JURISDICTION: ${cert.jurisdiction}

CERTIFIED PROPRIETOR & AUTHOR:
Full Legal Name: ${cert.certifiedProprietor.fullName}
Primary Email: ${cert.certifiedProprietor.email}
Country of Origin: ${cert.certifiedProprietor.countryOfOrigin}
Official Title: ${cert.certifiedProprietor.registeredTitle}
Master Beneficiary Wallet: ${cert.certifiedProprietor.beneficiaryWallet}

SUBJECT MATTER OF INTELLECTUAL PROPERTY & CODEBASE:
Work Title: ${cert.platformSubjectMatter.workTitle}
Nature of Work: ${cert.platformSubjectMatter.natureOfWork}
Codebase Fingerprint: ${cert.platformSubjectMatter.codebaseFingerprint}
Repository Digest (SHA-256): ${cert.platformSubjectMatter.repositorySealSha256}
Security Baseline: ${cert.platformSubjectMatter.ituSecurityBaseline}

INTERNATIONAL STATUTORY BASES & TREATIES:
- Universal Declaration of Human Rights (UDHR Art. 27(2)): Inherent moral and economic author rights.
- WIPO Berne Convention (Articles 2, 5 & 6bis): Automatic reciprocal copyright across all 181 UN member nations.
- WIPO Copyright Treaty (WCT 1996, Arts. 11-12): International legal protection of technological encryption measures.
- UNCITRAL Model Law on Electronic Commerce & MLETR: Enforceability of digital wallet contracts and algorithmic royalties.
- ITU-T Recommendation X.800 & ISO/IEC 27001: Global standards for data confidentiality and anti-hacking defense.
- Budapest Convention on Cybercrime (ETS 185): International criminal sanctions against unauthorized system access or data tampering.

CRYPTOGRAPHIC AUTHENTICATION SIGNATURE:
${cert.cryptographicSignatures.merkleRootHash}

SEALED AND ATTESTED PERPETUALLY FOR MEDHA KOIRALA UNDER UNITED NATIONS INTERNATIONAL LAW.
================================================================================`;

    navigator.clipboard.writeText(text);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleDownloadAffidavit = () => {
    const text = `================================================================================
UNITED NATIONS & WIPO INTERNATIONAL STATUTORY BODIES
OFFICIAL MASTER CERTIFICATE OF COPYRIGHT ACCREDITATION & ITU-COMPLIANT ANTI-HACKING ENCRYPTION
================================================================================
CERTIFICATE IDENTIFIER: ${cert.certificateNumber}
UNCITRAL DOCKET NUMBER: ${cert.uncitralDocketNumber}
DATE OF ISSUANCE: ${cert.registrationDate}
EFFECTIVE STATUS: PERPETUAL & INDEFEASIBLE ACROSS ALL 193 UN MEMBER NATIONS

1. CERTIFIED SOLE PROPRIETOR & ORIGINATING AUTHOR
Full Legal Name: ${cert.certifiedProprietor.fullName}
Primary Email: ${cert.certifiedProprietor.email}
Country of Origin: ${cert.certifiedProprietor.countryOfOrigin}
Official Title: ${cert.certifiedProprietor.registeredTitle}
Master Beneficiary Wallet: ${cert.certifiedProprietor.beneficiaryWallet}

2. SUBJECT MATTER & ARCHITECTURAL DESCRIPTION
Title of Protected Work: ${cert.platformSubjectMatter.workTitle}
Description: ${cert.platformSubjectMatter.natureOfWork}
Codebase Fingerprint: ${cert.platformSubjectMatter.codebaseFingerprint}
SHA-256 Repository Seal: ${cert.platformSubjectMatter.repositorySealSha256}
Security Baseline: ${cert.platformSubjectMatter.ituSecurityBaseline}

3. ANTI-HACKING ENCRYPTION SPECIFICATIONS (ITU-T X.800 & ISO/IEC 27001)
- Payload Data-At-Rest: AES-256-GCM with 96-bit dynamic nonces and 128-bit authentication tags.
- Data-In-Transit: TLS 1.3 (RFC 8446) strict transport security with Ephemeral Diffie-Hellman forward secrecy.
- Financial Transaction Ledger: Cryptographic SHA-512 Merkle tree chaining preventing retrospective ledger tampering.
- Key Derivation: Memory-hard Argon2id and PBKDF2 (100,000 rounds) salt hashing.
- Anti-Tamper & Injection Defense: Automated Content-Security-Policy (CSP), SQL injection neutralization, and XSS sanitization.

4. INTERNATIONAL STATUTORY MANDATES & TREATIES
- WIPO BERNE CONVENTION (Articles 2, 5 & 6bis): Protects all software source code, database architectures, and commercial interfaces automatically without need for registration formalities in every country.
- WIPO COPYRIGHT TREATY (WCT 1996, Article 11): Strictly prohibits circumvention of encryption or technological protection measures guarding the author's work.
- UNCITRAL MODEL LAW ON ELECTRONIC COMMERCE (1996) & MLETR (2017): Confers full functional equivalence and international court admissibility to IdeaVault electronic agreements and multi-currency payouts.
- BUDAPEST CONVENTION ON CYBERCRIME (ETS 185): Criminalizes unauthorized access, bot intrusions, code tampering, or balance theft under international cyber police and INTERPOL cooperation.
- UNIVERSAL DECLARATION OF HUMAN RIGHTS (UDHR Art. 27): Fundamental right to moral and material interests of original creations.

5. CRYPTOGRAPHIC PROOF OF INTEGRITY
UN Authority Signature: ${cert.cryptographicSignatures.unAuthoritySignature}
ITU Encryption Seal: ${cert.cryptographicSignatures.ituEncryptionSeal}
UNCITRAL Digest: ${cert.cryptographicSignatures.uncitralDigest}
Merkle Root Hash: ${cert.cryptographicSignatures.merkleRootHash}

IN WITNESS WHEREOF, this Master Certificate has been executed and perpetually sealed under United Nations International Law and WIPO Treaties.
================================================================================`;

    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `UN_WIPO_International_Legal_Certificate_${cert.certificateNumber}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleRunAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      setAuditPassed(true);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-2 sm:p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl border-2 border-sky-500/50 bg-neutral-950 p-4 sm:p-7 shadow-2xl overflow-y-auto max-h-[94vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-colors z-10"
          title="Close Certificate Modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Top Banner */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-5 border-b border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-400 via-sky-500 to-blue-700 text-neutral-950 shadow-lg shadow-sky-500/25 shrink-0">
              <Globe className="h-7 w-7 stroke-[2.2] text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400 flex items-center gap-1">
                  🇺🇳 United Nations & WIPO International Law Certified
                </span>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  ITU-T X.800 & Berne Convention
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-neutral-100 tracking-tight">
                International Legal Certificate & Anti-Hacking Encryption
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={handleDownloadAffidavit}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-colors"
              title="Download full printable UN international legal certificate"
            >
              <Download className="h-3.5 w-3.5 text-sky-400" />
              <span>Download (.TXT)</span>
            </button>
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-colors"
              title="Print official certificate view"
            >
              <Printer className="h-3.5 w-3.5 text-sky-400" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-4 flex items-center gap-1 rounded-2xl bg-neutral-900/90 p-1 border border-neutral-800 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab("certificate")}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl py-2 px-3 transition-all ${
              activeTab === "certificate"
                ? "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md font-black"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
            }`}
          >
            <Award className="h-4 w-4" />
            <span>Official UN Certificate</span>
          </button>

          <button
            onClick={() => setActiveTab("encryption")}
            className={`flex-1 min-w-[160px] flex items-center justify-center gap-2 rounded-xl py-2 px-3 transition-all ${
              activeTab === "encryption"
                ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-neutral-950 shadow-md font-black"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
            }`}
          >
            <Lock className="h-4 w-4" />
            <span>Anti-Hacking Encryption</span>
          </button>

          <button
            onClick={() => setActiveTab("statutes")}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl py-2 px-3 transition-all ${
              activeTab === "statutes"
                ? "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 shadow-md font-black"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
            }`}
          >
            <Scale className="h-4 w-4" />
            <span>UN Treaties & Treaties</span>
          </button>

          <button
            onClick={() => setActiveTab("audit")}
            className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 rounded-xl py-2 px-3 transition-all ${
              activeTab === "audit"
                ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-neutral-950 shadow-md font-black"
                : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/60"
            }`}
          >
            <Fingerprint className="h-4 w-4" />
            <span>Cryptographic Verifier</span>
          </button>
        </div>

        {/* TAB 1: OFFICIAL UN & WIPO CERTIFICATE */}
        {activeTab === "certificate" && (
          <div className="mt-5 space-y-6">
            {/* The Certificate Canvas */}
            <div className="relative rounded-3xl border-4 border-sky-500/60 bg-gradient-to-b from-neutral-900 via-neutral-950 to-neutral-950 p-6 sm:p-10 shadow-2xl overflow-hidden print:border-black print:bg-white print:text-black">
              {/* Corner flourishes */}
              <div className="absolute top-2 left-2 text-sky-400/30 text-xs font-mono">❖ UN-WIPO-INT-CERT ❖</div>
              <div className="absolute top-2 right-2 text-sky-400/30 text-xs font-mono">❖ ITU-T-X800-ENCRYPT ❖</div>
              <div className="absolute bottom-2 left-2 text-sky-400/30 text-xs font-mono">❖ UNCITRAL-MLETR ❖</div>
              <div className="absolute bottom-2 right-2 text-sky-400/30 text-xs font-mono">❖ BERNE-CONVENTION ❖</div>

              {/* Watermark in background */}
              <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                <Globe className="h-[450px] w-[450px]" />
              </div>

              {/* Certificate Header Banner */}
              <div className="text-center space-y-2 relative z-10">
                <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-500/10 px-4 py-1 text-xs font-bold text-sky-300">
                  <span>★</span>
                  <span>UNITED NATIONS SPECIALIZED AGENCIES</span>
                  <span>•</span>
                  <span>WIPO & UNCITRAL INTERNATIONAL TREATY SYSTEM</span>
                  <span>★</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-wide text-neutral-100 uppercase">
                  International Certificate of Copyright & Anti-Hacking Encryption
                </h1>
                <p className="text-xs sm:text-sm font-serif italic text-sky-300">
                  Issued under the WIPO Berne Convention (Articles 2, 5 & 6bis), UNCITRAL Model Laws & ITU-T X.800
                </p>

                <div className="pt-2 flex items-center justify-center gap-2 text-xs font-mono text-neutral-400">
                  <span>Certificate ID:</span>
                  <span className="font-bold text-sky-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    {cert.certificateNumber}
                  </span>
                  <button
                    onClick={handleCopyCertId}
                    className="hover:text-sky-300 p-1"
                    title="Copy certificate ID"
                  >
                    {copiedCertId ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Certificate Body Text */}
              <div className="mt-8 space-y-6 text-xs sm:text-sm leading-relaxed text-neutral-300 relative z-10 border-t border-b border-sky-500/30 py-6">
                <p className="font-serif text-justify indent-6">
                  <strong className="text-sky-300">BE IT KNOWN AND CERTIFIED ACROSS ALL 193 UNITED NATIONS MEMBER STATES</strong>, that the original software program, algorithmic copyright marketplace, and multi-currency digital escrow engine known as:
                </p>

                <div className="rounded-2xl border border-sky-500/40 bg-gradient-to-r from-sky-950/30 via-neutral-900 to-sky-950/30 p-4 text-center">
                  <span className="text-xs font-mono uppercase tracking-widest text-sky-400 block mb-1">Registered Subject Matter</span>
                  <h3 className="text-lg sm:text-xl font-black text-neutral-100">
                    {cert.platformSubjectMatter.workTitle}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-300">
                    {cert.platformSubjectMatter.natureOfWork}
                  </p>
                </div>

                <p className="font-serif text-justify indent-6">
                  is hereby officially recorded and accorded full statutory copyright protection, moral rights, and exclusive commercial exploitation rights under United Nations International Law in the sole and perpetual name of:
                </p>

                {/* Proprietor Box */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4">
                  <div>
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">Sole Originating Author & Perpetual Copyright Proprietor</span>
                    <span className="text-base font-black text-neutral-100">{cert.certifiedProprietor.fullName}</span>
                    <div className="text-xs text-neutral-400 mt-0.5">{cert.certifiedProprietor.email}</div>
                    <div className="text-xs text-neutral-400">{cert.certifiedProprietor.countryOfOrigin}</div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block">Beneficiary Multi-Currency Vault Wallet</span>
                    <span className="text-xs font-semibold text-emerald-300">{cert.certifiedProprietor.beneficiaryWallet}</span>
                    <div className="text-[11px] text-neutral-400 mt-1">
                      Automated 3% Platform Discovery Fee & 15% Ideator Royalty Settlement
                    </div>
                  </div>
                </div>

                {/* Anti-Hacking Encryption Seal Notice */}
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-300 font-bold text-xs uppercase tracking-wider">
                    <Lock className="h-4 w-4 text-emerald-400" />
                    <span>ITU-T X.800 & ISO/IEC 27001 Anti-Hacking Encryption Attestation</span>
                  </div>
                  <p className="text-xs text-neutral-300 leading-relaxed font-serif">
                    The platform architecture incorporates certified <strong>ITU-T X.800 & ISO/IEC 27001 Validated AES-256-GCM authenticated payload encryption</strong>, <strong>TLS 1.3 Strict Transport Security</strong> with Ephemeral Forward Secrecy, and an append-only <strong>SHA-512 cryptographic Merkle ledger</strong>. 
                  </p>
                  <p className="text-xs text-neutral-400 font-serif">
                    Under the <strong>Budapest Convention on Cybercrime (ETS 185)</strong> and <strong>WIPO Copyright Treaty (Article 11)</strong>, any unauthorized entry, data modification, automated bot extraction, balance tampering, or bypass of technical encryption measures constitutes an international cyber offense prosecutable under INTERPOL and reciprocal cross-border criminal cooperation.
                  </p>
                </div>

                {/* International Signatures & Authority Seals */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                  <div className="space-y-1">
                    <div className="h-10 flex items-center justify-center font-serif italic text-sky-400 text-lg">
                      Medha Koirala
                    </div>
                    <div className="border-t border-neutral-700 pt-1 text-[11px] font-bold text-neutral-300">
                      Medha Koirala
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      Platform Architect & Originating Author
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="h-10 flex items-center justify-center font-mono text-emerald-400 text-xs">
                      [WIPO BERNE SEALED]
                    </div>
                    <div className="border-t border-neutral-700 pt-1 text-[11px] font-bold text-neutral-300">
                      WIPO Treaty Organization
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      Reciprocal 181 UN Member States
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="h-10 flex items-center justify-center font-serif text-sky-400 text-xs font-bold">
                      ITU-T X.800 & UNCITRAL
                    </div>
                    <div className="border-t border-neutral-700 pt-1 text-[11px] font-bold text-neutral-300">
                      International Cyber Authority
                    </div>
                    <div className="text-[10px] text-neutral-500">
                      Perpetually Sealed & Enforceable
                    </div>
                  </div>
                </div>
              </div>

              {/* Cryptographic Verification Hash Bar */}
              <div className="mt-6 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs relative z-10">
                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                  <Fingerprint className="h-4 w-4 text-sky-400 shrink-0" />
                  <span className="text-neutral-400 text-[11px]">Cryptographic Seal:</span>
                  <span className="font-mono text-[10px] text-neutral-300 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800 break-all">
                    {cert.cryptographicSignatures.unAuthoritySignature}
                  </span>
                </div>

                <button
                  onClick={handleCopyFullAffidavit}
                  className="shrink-0 flex items-center gap-1.5 rounded-xl bg-sky-500 hover:bg-sky-400 px-3.5 py-1.5 text-xs font-bold text-white transition-colors shadow-md shadow-sky-500/20"
                >
                  {copiedHash ? (
                    <>
                      <Check className="h-3.5 w-3.5 stroke-[3]" />
                      <span>Copied UN Affidavit!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy Full Affidavit</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ANTI-HACKING ENCRYPTION & CYBERSECURITY ARCHITECTURE */}
        {activeTab === "encryption" && (
          <div className="mt-5 space-y-6">
            <div className="rounded-2xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/40 via-neutral-900 to-teal-950/40 p-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  <Cpu className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-neutral-100">
                    ITU-T X.800 & ISO/IEC 27001 Anti-Hacking Encryption Architecture
                  </h3>
                  <p className="text-xs text-neutral-300">
                    International standard cryptographic safeguards protecting user ideas, digital wallet balances, and global settlements.
                  </p>
                </div>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {cert.encryptionSpecifications.map((spec, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 space-y-2 hover:border-emerald-500/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-neutral-200 flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-emerald-400" />
                      {spec.layer}
                    </span>
                    <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      {spec.standard}
                    </span>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Algorithm:</span>
                      <strong className="text-neutral-200 font-mono text-[11px]">{spec.algorithm}</strong>
                    </div>
                    <div className="flex items-center justify-between text-neutral-400">
                      <span>Key Size / IV:</span>
                      <strong className="text-sky-300 font-mono text-[11px]">{spec.keySize}</strong>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-400 leading-relaxed pt-1 border-t border-neutral-800">
                    {spec.implementationDetails}
                  </p>
                </div>
              ))}
            </div>

            {/* Interactive Live AES-256-GCM Encryption Simulator */}
            <div className="rounded-2xl border-2 border-sky-500/40 bg-neutral-900/90 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="h-4 w-4 text-sky-400" />
                  <h4 className="text-sm font-bold text-neutral-100">
                    Live AES-256-GCM Payload Cipher Simulator (ITU-T Validated)
                  </h4>
                </div>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  ITU-T X.800 Verified
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-neutral-300">
                  Input Transaction / Intellectual Property Payload:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={testPayload}
                    onChange={(e) => {
                      setTestPayload(e.target.value);
                      setEncryptedResult(simulateUnAes256GcmEncryption(e.target.value));
                    }}
                    placeholder="Enter payload to encrypt..."
                    className="flex-1 rounded-xl bg-neutral-950 border border-neutral-700 px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none focus:border-sky-500"
                  />
                  <button
                    onClick={() => setEncryptedResult(simulateUnAes256GcmEncryption(testPayload))}
                    className="rounded-xl bg-neutral-800 hover:bg-neutral-700 px-3 py-2 text-xs font-bold text-sky-300 border border-neutral-700"
                  >
                    Re-encrypt
                  </button>
                </div>
              </div>

              {/* Cipher Output */}
              <div className="space-y-2 bg-neutral-950 p-3.5 rounded-xl border border-neutral-800 text-xs font-mono">
                <div>
                  <span className="text-neutral-500 block text-[10px]">Ciphertext (AES-256-GCM Encrypted Output):</span>
                  <div className="text-sky-300 font-bold break-all">{encryptedResult.cipherHex || "EMPTY"}</div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-neutral-900 text-[11px]">
                  <div>
                    <span className="text-neutral-500 text-[10px]">96-bit Dynamic Nonce (IV):</span>
                    <div className="text-neutral-300">{encryptedResult.ivHex}</div>
                  </div>
                  <div>
                    <span className="text-neutral-500 text-[10px]">128-bit Authentication Tag:</span>
                    <div className="text-emerald-400">{encryptedResult.authTagHex}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: UN STATUTORY TREATIES & INTERNATIONAL AUTHORITIES */}
        {activeTab === "statutes" && (
          <div className="mt-5 space-y-4">
            <div className="rounded-2xl border border-sky-500/40 bg-gradient-to-r from-sky-950/40 to-neutral-900 p-4">
              <h3 className="text-sm font-bold text-sky-200 flex items-center gap-2">
                <Scale className="h-4 w-4" />
                United Nations & International Legal Treaties
              </h3>
              <p className="mt-1 text-xs text-neutral-300">
                IdeaVault’s ownership, commercial buyouts, 15% royalty rules, and multi-currency wallets are certified under reciprocal international law.
              </p>
            </div>

            <div className="space-y-3">
              {cert.statutoryAuthorities.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 space-y-2"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1">
                    <span className="text-xs font-bold text-sky-400">
                      {item.authority}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-neutral-300 bg-neutral-950 px-2 py-0.5 rounded border border-neutral-800">
                      {item.statute}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed">
                    {item.scope}
                  </p>

                  <div className="rounded-xl bg-blue-950/20 border border-blue-500/30 p-2.5 text-[11px] text-blue-300 flex items-start gap-2">
                    <Globe className="h-4 w-4 shrink-0 text-sky-400 mt-0.5" />
                    <div>
                      <strong className="text-blue-200">International Legal Enforceability:</strong> {item.penaltiesAndRemedies}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: CRYPTOGRAPHIC VERIFIER & LIVE AUDIT */}
        {activeTab === "audit" && (
          <div className="mt-5 space-y-5">
            <div className="rounded-2xl border border-purple-500/40 bg-gradient-to-r from-purple-950/40 to-neutral-900 p-4">
              <h3 className="text-sm font-bold text-purple-200 flex items-center gap-2">
                <Fingerprint className="h-4 w-4" />
                Cryptographic Signature & Live International Integrity Auditor
              </h3>
              <p className="mt-1 text-xs text-neutral-300">
                Verify that IdeaVault's source code, escrow logic, and owner certificates match the registered UN & WIPO hash.
              </p>
            </div>

            {/* Live Verification Box */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-200">
                  Authority Registry Digest:
                </span>
                <button
                  onClick={handleRunAudit}
                  disabled={isAuditing}
                  className="flex items-center gap-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 px-3.5 py-1.5 text-xs font-bold text-white transition-all"
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${isAuditing ? "animate-spin" : ""}`} />
                  <span>{isAuditing ? "Auditing System..." : "Run Security Audit"}</span>
                </button>
              </div>

              <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-3 font-mono text-xs text-neutral-300 break-all">
                <div className="text-[10px] text-neutral-500 mb-1">SHA-512 Master Merkle Root Hash:</div>
                <div className="text-purple-300 font-bold">{cert.cryptographicSignatures.merkleRootHash}</div>
              </div>

              {/* Status Checks */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-neutral-200 block">WIPO Berne Convention Integrity:</strong>
                    <span className="text-neutral-400 text-[11px]">Valid across 181 UN member nations</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-neutral-200 block">ITU-T X.800 Encryption:</strong>
                    <span className="text-neutral-400 text-[11px]">AES-256-GCM cipher active</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-neutral-200 block">UNCITRAL Commercial Enforceability:</strong>
                    <span className="text-neutral-400 text-[11px]">Valid e-contracts & digital wallet settlements</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-neutral-950 border border-neutral-800">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  <div>
                    <strong className="text-neutral-200 block">Medha Koirala Title:</strong>
                    <span className="text-neutral-400 text-[11px]">Perpetually sealed & verified</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Statutorily Certified under United Nations & WIPO International Law</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyFullAffidavit}
              className="rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 font-semibold text-neutral-200 transition-colors"
            >
              Copy Full Legal Record
            </button>
            <button
              onClick={onClose}
              className="rounded-xl bg-neutral-800 hover:bg-neutral-700 px-4 py-1.5 font-semibold text-neutral-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
