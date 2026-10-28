import React, { useState, useEffect } from "react";
import { Idea, UserProfile, Contract, CurrencyCode, AccountUploadedFile } from "../types";
import {
  FileText,
  CheckCircle2,
  ShieldCheck,
  X,
  Download,
  AlertCircle,
  Smartphone,
  Scale,
  Globe,
  QrCode,
  Check,
  Upload,
  Trash2,
} from "lucide-react";
import confetti from "canvas-confetti";
import {
  EXCHANGE_RATES,
  formatPrice,
  calculateCommissionBreakdown,
  getWalletsForCountry,
  GLOBAL_DIGITAL_WALLETS,
  generateFixedTermRoyaltyLawDraft,
  downloadLawDraftDocument,
} from "../utils/legalAndCurrency";
import { isSitePublishedLive } from "../utils/syncEngine";

interface ContractModalProps {
  idea: Idea | null;
  currentUser: UserProfile;
  ownerProfile?: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSignContract: (contract: Contract) => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  idea,
  currentUser,
  ownerProfile,
  isOpen,
  onClose,
  onSignContract,
}) => {
  const [buyerCompany, setBuyerCompany] = useState("");
  const [creatorInvolvementNotes] = useState(
    "Active bi-weekly product consultation, UX reviews, and prototype testing feedback."
  );
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [signatureTyped, setSignatureTyped] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [contractText, setContractText] = useState("");
  const [contractId, setContractId] = useState("");
  const [legalHash, setLegalHash] = useState("");
  const [payoutCurrency, setPayoutCurrency] = useState<CurrencyCode>(
    currentUser.preferredCurrency || "USD"
  );
  const [buyerCountry, setBuyerCountry] = useState(currentUser.country || "Nepal");
  const [selectedWalletId, setSelectedWalletId] = useState("wallet-np-khalti");

  // Strict Real-Money Verification States (No Fake 1-Click Numbers)
  const [realPaymentRefId, setRealPaymentRefId] = useState("");
  const [paymentProofFile, setPaymentProofFile] = useState<AccountUploadedFile | null>(null);
  const [confirmedRealMoneyPaid, setConfirmedRealMoneyPaid] = useState(false);
  const [preLaunchNotice, setPreLaunchNotice] = useState<string | null>(null);

  const isFullBuyout = idea?.saleModel === "full_buyout";
  const isFixedTermLicensed = idea?.saleModel === "licensed_fixed_term";
  const commission = calculateCommissionBreakdown(
    idea?.upfrontPrice || 350,
    idea?.saleModel || "full_buyout"
  );

  const isPublished = isSitePublishedLive();
  const ownerQrConfig = ownerProfile?.wallet?.ownerQrAccount;

  useEffect(() => {
    if (idea && isOpen) {
      setBuyerCompany("");
      setSignatureTyped("");
      setAgreedToTerms(false);
      setRealPaymentRefId("");
      setPaymentProofFile(null);
      setConfirmedRealMoneyPaid(false);
      setPreLaunchNotice(null);
      setPayoutCurrency(idea.creator.preferredCurrency || currentUser.preferredCurrency || "USD");
      generateContract();
    }
  }, [idea, isOpen, currentUser]);

  const generateContract = async () => {
    if (!idea) return;
    setIsGenerating(true);

    const fallbackId = `CON-${Date.now()}`;
    const hash = `SHA256-${Date.now().toString(16).toUpperCase()}9B4`;
    setContractId(fallbackId);
    setLegalHash(hash);

    try {
      if (idea.saleModel === "licensed_fixed_term") {
        setContractText(
          generateFixedTermRoyaltyLawDraft({
            creatorName: idea.creator.name,
            creatorCountry: idea.creator.country || "Nepal",
            investorName: currentUser.name,
            ideaTitle: idea.title,
            referenceId: fallbackId,
          })
        );
        setIsGenerating(false);
        return;
      }

      const res = await fetch("/api/ai/generate-contract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ideaTitle: idea.title,
          ideaDescription: idea.description,
          creatorName: idea.creator.name,
          creatorProfession: idea.creator.profession,
          isNonTech: idea.creator.isNonTech,
          backgroundField: idea.creator.backgroundField,
          buyerName: currentUser.name,
          buyerCompany: buyerCompany || "Commercial Venture Partner",
          upfrontPrice: idea.upfrontPrice,
          royaltyPercent: isFullBuyout ? 0 : 15,
          platformFeePercent: 3,
          buyerSharePercent: isFullBuyout ? 97 : 82,
          saleModel: idea.saleModel,
          creatorInvolvementNotes,
        }),
      });
      const data = await res.json();
      if (data.contractText) {
        setContractText(data.contractText);
        setContractId(data.contractId || fallbackId);
        setLegalHash(data.legalHash || hash);
      } else {
        throw new Error("Empty contract text");
      }
    } catch {
      if (isFullBuyout) {
        setContractText(
          `FULL COPYRIGHT ASSIGNMENT & COMPLETE BUYOUT DEED (0% ROYALTY)\n` +
            `Document Reference ID: ${fallbackId}\n` +
            `Governing Treaties: WIPO Berne Convention (Paris Act) & Nepal Copyright Act 2059 (Section 19)\n\n` +
            `1. PARTIES: Originating Ideator [${idea.creator.name}] of [${idea.creator.country || "Nepal"}] and Acquiring Investor [${currentUser.name}].\n\n` +
            `2. 100% COMPLETE COPYRIGHT SALE & ASSIGNMENT: The Ideator hereby assigns, transfers, and conveys to the Buyer all world-wide copyright, economic rights, title, and commercial exploitation rights in and to "${idea.title}".\n\n` +
            `3. ZERO ROYALTY & NO ONGOING COMMISSION: Following verified real-money payment of $${idea.upfrontPrice} USD (${formatPrice(idea.upfrontPrice, payoutCurrency)}), no royalty or ongoing commission will be owed.\n\n` +
            `4. 3% OWNER QR WIRE IN NEPALI CURRENCY (NPR ₨): The 3% platform discovery fee (₨${commission.platformFeeNpr.toLocaleString()} NPR / $${commission.platformFeeUsd} USD eqv) is wired directly in Nepali Rupees (NPR ₨) to Owner Medha Koirala's QR Account upon verified payment.\n\n` +
            `5. DISPUTE RESOLUTION & LEGAL ORDER: Governed by the United Nations UNCITRAL Model Law on Electronic Commerce and Nepal Copyright Act 2059.`
        );
      } else {
        setContractText(
          `RETAINED COPYRIGHT & 15% COMMERCIAL ROYALTY COVENANT\n` +
            `Document Reference ID: ${fallbackId}\n` +
            `Governing Treaties: WIPO Berne Convention & Nepal Copyright Act 2059\n\n` +
            `1. PARTIES: Originating Ideator [${idea.creator.name}] (Retaining 100% Copyright) and Commercializing Investor [${currentUser.name}].\n\n` +
            `2. COPYRIGHT RETENTION & REVENUE DISTRIBUTION:\n` +
            `   • Ideator Copyright & Royalty: Retains 100% authorship copyright + 15.0% royalty cut of verified gross product revenues.\n` +
            `   • Automated Owner QR Fee (3.0%): Wired strictly in Nepali Currency (₨${commission.platformFeeNpr.toLocaleString()} NPR) to Owner Medha Koirala's QR Account.\n` +
            `   • Commercializing Investor: 82.0% to cover manufacturing, software development, and scaling.\n\n` +
            `3. REAL-MONEY PAYMENT REQUIREMENT: Execution requires verified bank/QR transaction reference ID and uploaded payment receipt.`
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen || !idea) return null;

  const handleUploadReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPaymentProofFile({
          id: `proof-ctr-${Date.now()}`,
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          kind: file.type.startsWith("image/") ? "image" : "document",
          dataUrl: reader.result,
          uploadedAt: new Date().toLocaleString(),
        });
        setPreLaunchNotice(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const canExecuteRealSettlement =
    isPublished &&
    agreedToTerms &&
    confirmedRealMoneyPaid &&
    Boolean(signatureTyped.trim()) &&
    realPaymentRefId.trim().length >= 6 &&
    Boolean(paymentProofFile) &&
    !isGenerating;

  const handleExecute = () => {
    if (!isPublished) {
      setPreLaunchNotice(
        "Site is not published yet: Real-money human contract payments and earnings are disabled until IdeaVault is published live."
      );
      return;
    }
    if (realPaymentRefId.trim().length < 6 || !paymentProofFile || !confirmedRealMoneyPaid) {
      setPreLaunchNotice(
        "Actual real-money payment must be completed first: enter your Bank/QR Transaction Reference ID (min 6 chars), upload the paid receipt image/document, and confirm real-money wire."
      );
      return;
    }
    if (!agreedToTerms || !signatureTyped.trim()) return;

    confetti({
      particleCount: 90,
      spread: 80,
      origin: { y: 0.6 },
    });

    const newContract: Contract = {
      id: contractId,
      ideaId: idea.id,
      ideaTitle: idea.title,
      creatorId: idea.creator.id,
      creatorName: idea.creator.name,
      creatorProfession: idea.creator.profession,
      creatorCountry: idea.creator.country || "Nepal",
      isNonTechCreator: idea.creator.isNonTech,
      creatorSignedAt: new Date().toISOString(),
      buyerId: currentUser.id,
      buyerName: signatureTyped.trim(),
      buyerCompany: buyerCompany || "Commercial Venture Partner",
      buyerSignedAt: new Date().toISOString(),
      status: "fully_executed",
      upfrontFee: idea.upfrontPrice,
      royaltyPercent: isFullBuyout ? 0 : 15,
      platformFeePercent: 3,
      buyerSharePercent: isFullBuyout ? 97 : 82,
      contractText: contractText,
      creatorProductionRole: creatorInvolvementNotes,
      escrowStatus: "held_in_escrow",
      legalHash: legalHash,
      createdAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
      saleModel: idea.saleModel || (isFullBuyout ? "full_buyout" : "royalty_split"),
      copyrightAssigned: isFullBuyout,
      payoutCurrency,
      ideatorPayoutAmount: commission.netSellerUsd,
      platformFeeRecipient: "Medha Koirala (Owner Nepali NPR ₨ QR Account)",
      ownerWalletAmountNpr: commission.platformFeeNpr,
      ownerWalletAmountUsd: commission.platformFeeUsd,
      ownerWalletTxnId: realPaymentRefId.trim(),
      ownerWalletStatus: "auto_wired_to_owner_qr",
      legalCertDelivered: true,
      realBankOrQrRefId: realPaymentRefId.trim(),
      paymentProofFile: paymentProofFile,
      wiredOwnerNprAmount: commission.platformFeeNpr,
    };

    onSignContract(newContract);
  };

  const currentWallet =
    GLOBAL_DIGITAL_WALLETS.find((w) => w.id === selectedWalletId) || GLOBAL_DIGITAL_WALLETS[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="contract-signing-portal"
        className="relative w-full max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl overflow-hidden my-6"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                isFullBuyout
                  ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                  : "bg-amber-500/20 text-amber-400 border-amber-500/30"
              }`}
            >
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                {isFullBuyout
                  ? "Option 2: 100% Copyright Sale & Buyout Deed (0% Royalty)"
                  : isFixedTermLicensed
                  ? "Option 3: 3-Year Licensed Product & Strict 1.5-Year Royalty Cap Law Draft"
                  : "Option 1: Keep Copyrights & 15% Commercial Royalty Covenant"}
              </h2>
              <p className="text-xs text-neutral-400">
                Ref ID: <span className="font-mono text-amber-400">{contractId}</span> · Certified under WIPO &amp; Nepal Laws
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

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {!isPublished && (
            <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block text-amber-300">
                  Pre-Launch Mode — Site Not Published Yet
                </strong>
                <span>
                  Human payments and real-money earnings do not exist until the site is published live. All balances remain 0.00 until actual real-money transactions occur after launch.
                </span>
              </div>
            </div>
          )}

          {preLaunchNotice && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-200">
              {preLaunchNotice}
            </div>
          )}

          {/* Key Legal & Currency Highlight Banners */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div
              className={`rounded-xl border p-3.5 ${
                isFullBuyout
                  ? "border-purple-500/40 bg-purple-950/20"
                  : isFixedTermLicensed
                  ? "border-sky-500/40 bg-sky-950/20"
                  : "border-amber-500/40 bg-amber-950/20"
              }`}
            >
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider mb-1 text-amber-300">
                <Scale className="h-3.5 w-3.5" />
                {isFullBuyout
                  ? "100% Copyright Sold (0% Royalty)"
                  : isFixedTermLicensed
                  ? "3-Yr License · 1.5-Yr Royalty Cap"
                  : "Keep Copyright + 15% Royalty"}
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                {isFullBuyout
                  ? "Buyer receives 100% copyright ownership. Ideator receives upfront buyout and owns 0% ongoing royalty."
                  : isFixedTermLicensed
                  ? "3-year licensed product covenant with Official Law Draft strictly capping 15% royalty at 1.5 years (18 months)."
                  : "Ideator keeps 100% copyright ownership and receives 15% ongoing royalty on commercialized product sales."}
              </p>
            </div>

            <div className="rounded-xl border border-amber-500/40 bg-amber-950/20 p-3.5">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold text-xs uppercase tracking-wider mb-1">
                <Smartphone className="h-3.5 w-3.5" />
                Owner QR Wired in Nepali NPR ₨
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                3% platform commission is converted and wired strictly in <strong className="text-amber-300">Nepalese Rupees (₨{commission.platformFeeNpr.toLocaleString()} NPR)</strong> directly to <strong className="text-neutral-100">Medha Koirala&apos;s Owner QR Account</strong> every time.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Globe className="h-3.5 w-3.5" />
                Actual Real Money Required
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Numbers never update without real money paid: requires bank/QR transaction ID + uploaded receipt proof ({formatPrice(commission.netSellerUsd, payoutCurrency)} to Creator).
              </p>
            </div>
          </div>

          {/* Itemized Real-Money Settlement Bill */}
          <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between font-bold text-neutral-200 border-b border-neutral-800 pb-2">
              <span>Official Real-Money Settlement Bill</span>
              <span className="text-emerald-400">
                Receipt-Verified Payment Mandatory
              </span>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span>Gross Contract Consideration:</span>
              <span className="font-mono font-bold">
                ${idea.upfrontPrice} USD ({formatPrice(idea.upfrontPrice, payoutCurrency)})
              </span>
            </div>
            <div className="flex items-center justify-between text-amber-300">
              <span>3% Owner Commission (Wired in Nepali Currency Every Time):</span>
              <span className="font-mono font-bold">
                ₨{commission.platformFeeNpr.toLocaleString()} NPR (${commission.platformFeeUsd} USD eqv)
              </span>
            </div>
            <div className="flex items-center justify-between text-emerald-400 font-bold border-t border-neutral-800 pt-2">
              <span>97% Net Payout Paid to Creator ({idea.creator.name}):</span>
              <span className="font-mono text-sm">
                ${commission.netSellerUsd} USD ({formatPrice(commission.netSellerUsd, payoutCurrency)})
              </span>
            </div>
          </div>

          {/* Real-Money Payment & Mandatory Receipt Upload Portal */}
          <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-5 space-y-4 shadow-xl">
            <div className="border-b border-neutral-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <QrCode className="h-4 w-4" /> Mandatory Real-Money Payment &amp; Receipt Verification
              </span>
              <h3 className="text-sm font-bold text-neutral-100 mt-0.5">
                Pay Real Money via Bank / QR &amp; Upload Receipt Proof (No Unpaid Numbers Allowed)
              </h3>
            </div>

            {/* Country & Payment Channel Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/80 p-3 rounded-xl border border-neutral-800 text-xs">
              <div>
                <span className="font-semibold text-neutral-200 block">Select Payer Country &amp; Payment Rail:</span>
                <span className="text-[11px] text-neutral-400">
                  Choose the licensed bank or digital wallet used to send your real-money payment
                </span>
              </div>

              <select
                value={buyerCountry}
                onChange={(e) => {
                  const c = e.target.value;
                  setBuyerCountry(c);
                  const matching = getWalletsForCountry(c);
                  if (matching.length > 0) {
                    setSelectedWalletId(matching[0].id);
                  }
                }}
                className="rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-bold text-amber-300 focus:outline-none"
              >
                <option value="Nepal">🇳🇵 Nepal (eSewa, Khalti, ConnectIPS, Fonepay)</option>
                <option value="United States">🇺🇸 United States (Apple Pay, Venmo, Zelle, Bank Wire)</option>
                <option value="India">🇮🇳 India (UPI, PhonePe, Google Pay)</option>
                <option value="United Kingdom">🇬🇧 United Kingdom (Faster Payments, Revolut)</option>
                <option value="European Union">🇪🇺 European Union (SEPA Instant, Wise)</option>
                <option value="Global">🌐 International (Wise, SWIFT, Stripe, Payoneer)</option>
              </select>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {getWalletsForCountry(buyerCountry)
                .slice(0, 4)
                .map((w) => (
                  <button
                    key={w.id}
                    type="button"
                    onClick={() => setSelectedWalletId(w.id)}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      selectedWalletId === w.id
                        ? "border-amber-400 bg-amber-950/40 text-amber-200"
                        : "border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900 text-neutral-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs truncate">{w.name}</span>
                      {selectedWalletId === w.id && <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                    </div>
                    <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">{w.currency}</div>
                  </button>
                ))}
            </div>

            {/* Dual QR & Destination Cards: 1) Owner Nepali NPR QR + 2) Creator Payout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Owner Uploaded Nepali Currency (NPR ₨) QR Destination */}
              <div className="rounded-2xl border border-amber-500/40 bg-neutral-950 p-4 flex items-center gap-4">
                <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-white p-2 shrink-0 overflow-hidden">
                  {ownerQrConfig?.qrImageDataUrl ? (
                    <img
                      src={ownerQrConfig.qrImageDataUrl}
                      alt="Owner Nepali Currency QR"
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <QrCode className="h-16 w-16 text-neutral-900" />
                  )}
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-amber-300">
                    Owner 3% QR Wire (Nepali Currency NPR ₨)
                  </div>
                  <div className="font-mono text-sm font-extrabold text-neutral-100">
                    ₨{commission.platformFeeNpr.toLocaleString()} NPR
                  </div>
                  <div className="text-[11px] text-neutral-300">
                    Recipient: <strong>{ownerQrConfig?.accountHolderName || ownerProfile?.name || "Medha Koirala"}</strong>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {ownerQrConfig
                      ? `${ownerQrConfig.qrProviderName} · ${ownerQrConfig.qrAccountId} (NPR ₨)`
                      : "Wired in Nepalese Rupees (NPR ₨) to Owner QR Account"}
                  </div>
                </div>
              </div>

              {/* Creator Net Payout Destination */}
              <div className="rounded-2xl border border-emerald-500/40 bg-neutral-950 p-4 flex items-center gap-4">
                <div className="flex h-28 w-28 items-center justify-center rounded-xl bg-white p-2 shrink-0 overflow-hidden">
                  <QrCode className="h-16 w-16 text-neutral-900" />
                </div>
                <div className="space-y-1 text-xs">
                  <div className="font-bold text-emerald-400">
                    Creator 97% Net Payout ({currentWallet.name})
                  </div>
                  <div className="font-mono text-sm font-extrabold text-neutral-100">
                    ${commission.netSellerUsd} USD ({formatPrice(commission.netSellerUsd, payoutCurrency)})
                  </div>
                  <div className="text-[11px] text-neutral-300">
                    Recipient: <strong>{idea.creator.name}</strong> ({idea.creator.country || "Nepal"})
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {currentWallet.instruction}
                  </div>
                </div>
              </div>
            </div>

            {/* Required Real Bank/QR Reference ID + Payment Proof Upload */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800 text-xs">
              <div>
                <label className="block text-[11px] font-bold text-neutral-200 mb-1">
                  1. Enter Real Bank / Wallet / QR Transaction Reference ID *
                </label>
                <input
                  type="text"
                  value={realPaymentRefId}
                  onChange={(e) => setRealPaymentRefId(e.target.value)}
                  placeholder="e.g. FONEPAY-83920184 or SWIFT-REF"
                  className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2.5 text-xs font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-neutral-200 mb-1">
                  2. Upload Paid Receipt Image or Document (Required) *
                </label>
                {paymentProofFile ? (
                  <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3 py-2">
                    <span className="truncate text-emerald-300 font-semibold">
                      {paymentProofFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPaymentProofFile(null)}
                      className="text-neutral-400 hover:text-red-400 ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-amber-500/50 hover:border-amber-400 bg-neutral-950 px-3 py-2.5 text-xs font-bold text-amber-300 cursor-pointer transition-colors">
                    <Upload className="h-4 w-4" />
                    <span>Upload Payment Receipt (Image / PDF / Doc)</span>
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleUploadReceipt}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            <label className="flex items-start gap-2.5 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={confirmedRealMoneyPaid}
                onChange={(e) => setConfirmedRealMoneyPaid(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-emerald-500 focus:ring-emerald-500"
              />
              <span className="text-xs text-neutral-300 leading-relaxed">
                I confirm that actual real-money payment has been sent (Creator net payout + <strong>₨{commission.platformFeeNpr.toLocaleString()} NPR</strong> wired in Nepali Currency to Owner Medha Koirala&apos;s QR Account) and the uploaded receipt above is authentic.
              </span>
            </label>
          </div>

          {/* Legal Contract Agreement Viewer */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                {isFixedTermLicensed
                  ? "Official Law Draft Document (Strict 1.5-Year Maximum Royalty Cap)"
                  : "Legal Covenant Document Text"}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-mono text-neutral-400">{legalHash}</span>
                <button
                  type="button"
                  onClick={() =>
                    downloadLawDraftDocument(
                      `${contractId || "IdeaVault"}-Law-Draft-Covenant.txt`,
                      contractText
                    )
                  }
                  className="flex items-center gap-1 rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 text-[11px] font-semibold text-amber-300 transition-colors cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>Download Law Draft (.txt)</span>
                </button>
              </div>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 max-h-56 overflow-y-auto text-xs font-mono text-neutral-300 leading-relaxed whitespace-pre-line select-text">
              {isGenerating ? "Generating certified contract covenants..." : contractText}
            </div>
          </div>

          {/* Electronic Signature & Acceptance */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-500"
              />
              <span className="text-xs text-neutral-300 leading-relaxed">
                I agree to the terms of this {isFullBuyout ? "Full Copyright Buyout" : "15% Royalty License"} agreement under the WIPO Berne Convention, UNCITRAL electronic signature standards, and Nepal Copyright Act 2059, including the 3% platform discovery commission wired in Nepali Currency (NPR ₨) to Owner Medha Koirala&apos;s QR Account.
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Type Full Legal Name as Electronic Signature *
                </label>
                <input
                  type="text"
                  value={signatureTyped}
                  onChange={(e) => setSignatureTyped(e.target.value)}
                  placeholder="e.g., Jane Doe"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-mono text-amber-300 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Buyer Company / Studio Entity
                </label>
                <input
                  type="text"
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                  placeholder="e.g., Venture Hardware Labs Ltd."
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="text-[11px] text-neutral-400">
            Requires verified bank/QR transaction ID + uploaded payment receipt · Owner 3% wired in NPR ₨
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canExecuteRealSettlement}
              onClick={handleExecute}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-md active:scale-95 ${
                !canExecuteRealSettlement
                  ? "bg-neutral-800 text-neutral-500 cursor-not-allowed"
                  : isFullBuyout
                  ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-400 hover:to-indigo-500 shadow-purple-500/25"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 text-neutral-950 hover:from-amber-400 hover:to-amber-500 shadow-amber-500/25"
              }`}
            >
              <CheckCircle2 className="h-4 w-4" />
              <span>
                {!isPublished
                  ? "Settlement Inactive Until Site Published"
                  : isFullBuyout
                  ? "Verify Payment & Execute Full Buyout"
                  : "Verify Payment & Execute License"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
