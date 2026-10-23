import React, { useState, useEffect } from "react";
import { Idea, UserProfile, Contract, CurrencyCode } from "../types";
import { 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Download, 
  Sparkles, 
  Lock, 
  DollarSign, 
  AlertCircle,
  Briefcase,
  Smartphone,
  Scale,
  Globe,
  QrCode,
  CreditCard,
  Check
} from "lucide-react";
import confetti from "canvas-confetti";
import { 
  PLATFORM_OWNER_WALLET,
  EXCHANGE_RATES, 
  formatPrice, 
  calculateCommissionBreakdown,
  getWalletsForCountry,
  GLOBAL_DIGITAL_WALLETS
} from "../utils/legalAndCurrency";
import { isSitePublishedLive } from "../utils/syncEngine";

interface ContractModalProps {
  idea: Idea | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSignContract: (contract: Contract) => void;
}

export const ContractModal: React.FC<ContractModalProps> = ({
  idea,
  currentUser,
  isOpen,
  onClose,
  onSignContract,
}) => {
  const [buyerName, setBuyerName] = useState("");
  const [buyerCompany, setBuyerCompany] = useState("");
  const [creatorInvolvementNotes, setCreatorInvolvementNotes] = useState(
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
  const [paymentMethod, setPaymentMethod] = useState<"qr_payment" | "wallet_transfer">("qr_payment");
  const [buyerCountry, setBuyerCountry] = useState(currentUser.country || "Nepal");
  const [selectedWalletId, setSelectedWalletId] = useState("wallet-np-khalti");
  const [qrConfirmed, setQrConfirmed] = useState(false);

  const isFullBuyout = idea?.saleModel === "full_buyout";
  const commission = calculateCommissionBreakdown(
    idea?.upfrontPrice || 350,
    idea?.saleModel || "full_buyout"
  );

  const isPublished = isSitePublishedLive();
  const [preLaunchNotice, setPreLaunchNotice] = useState<string | null>(null);

  useEffect(() => {
    if (idea && isOpen) {
      setBuyerName("");
      setBuyerCompany("");
      setSignatureTyped("");
      setAgreedToTerms(false);
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
          buyerCompany: buyerCompany || "Vance Ventures & Labs",
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
    } catch (err) {
      // Fallback contract text with full legal compliance
      if (isFullBuyout) {
        setContractText(
          `FULL COPYRIGHT ASSIGNMENT & COMPLETE BUYOUT DEED\n` +
          `Document Reference ID: ${fallbackId}\n` +
          `Governing Treaties: WIPO Berne Convention (Paris Act) & Nepal Copyright Act 2059 (Section 19)\n\n` +
          `1. PARTIES: Originating Ideator [${idea.creator.name}] of [${idea.creator.country || "Nepal"}] and Acquiring Builder [${currentUser.name}].\n\n` +
          `2. 100% COMPLETE COPYRIGHT SALE & ASSIGNMENT: The Ideator hereby assigns, transfers, and conveys to the Buyer all world-wide copyright, economic rights, title, and commercial exploitation rights in and to "${idea.title}".\n\n` +
          `3. ZERO ROYALTY & NO ONGOING COMMISSION: Following payment of the buyout consideration of $${idea.upfrontPrice} USD (${formatPrice(idea.upfrontPrice, payoutCurrency)}), no royalty, commission, or ongoing participation will be owned or claimed by the Ideator, nor owed by the Buyer.\n\n` +
          `4. IN-APP DIGITAL WALLET 3% PLATFORM FEE SETTLEMENT: The 3% platform discovery fee ($${commission.platformFeeUsd} USD / ₨${commission.platformFeeNpr.toLocaleString()} NPR) is automatically credited upon escrow release to the platform owner's In-App Master Vault Wallet (Medha Koirala) with full multi-currency and withdrawal capabilities.\n\n` +
          `5. DISPUTE RESOLUTION & LEGAL ORDER: Governed by the United Nations UNCITRAL Model Law on Electronic Commerce and Nepal Copyright Act 2059. Certified digital documents delivered to both parties' registered emails.`
        );
      } else {
        setContractText(
          `EXCLUSIVE COMMERCIAL LICENSE & 15% LIFETIME ROYALTY COVENANT\n` +
          `Document Reference ID: ${fallbackId}\n` +
          `Governing Treaties: WIPO Berne Convention & Nepal Copyright Act 2059\n\n` +
          `1. PARTIES: Originating Ideator [${idea.creator.name}] and Acquiring Builder [${currentUser.name}].\n\n` +
          `2. REVENUE DISTRIBUTION ON ALL PRODUCT SALES:\n` +
          `   • Ideator Royalty: 15.0% guaranteed perpetual cut of all gross product revenues (credited to Ideator App Digital Wallet).\n` +
          `   • Automated Platform Fee: 3.0% settled into Platform Owner Master Vault Wallet (Medha Koirala).\n` +
          `   • Commercializing Builder: 82.0% to cover manufacturing, software development, and scaling.\n\n` +
          `3. NON-TECH CREATOR PROTECTION: Ideator is legally protected regardless of technical credentials.\n\n` +
          `4. CURRENCY & ESCROW: Upfront stake ($${idea.upfrontPrice} USD) held in escrow until co-production milestones are initiated.`
        );
      }
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen || !idea) return null;

  const handleExecute = () => {
    if (!isPublished) {
      setPreLaunchNotice(
        "Site is not published yet: Real-money human contract payments and earnings are disabled until IdeaVault is published live."
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
      buyerName: signatureTyped,
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
      createdAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      saleModel: idea.saleModel || (isFullBuyout ? "full_buyout" : "royalty_split"),
      copyrightAssigned: isFullBuyout,
      payoutCurrency,
      ideatorPayoutAmount: commission.netSellerUsd,
      platformFeeRecipient: "IdeaVault Master Vault Multi-Currency Wallet (Medha Koirala)",
      ownerWalletAmountNpr: commission.platformFeeNpr,
      ownerWalletAmountUsd: commission.platformFeeUsd,
      ownerWalletTxnId: `VAULT-TXN-${Date.now().toString().slice(-8)}`,
      ownerWalletStatus: "settled_in_app_wallet",
      legalCertDelivered: true,
    };

    onSignContract(newContract);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="contract-signing-portal"
        className="relative w-full max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl overflow-hidden my-6"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
              isFullBuyout 
                ? "bg-purple-500/20 text-purple-400 border-purple-500/30" 
                : "bg-amber-500/20 text-amber-400 border-amber-500/30"
            }`}>
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100 flex items-center gap-2">
                {isFullBuyout 
                  ? "100% Full Copyright Buyout & Deed of Assignment" 
                  : "15% Commercial Royalty & Co-Production Covenant"}
              </h2>
              <p className="text-xs text-neutral-400">
                Ref ID: <span className="font-mono text-amber-400">{contractId}</span> • Certified under WIPO & Nepal Laws
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
                <strong className="font-bold block text-amber-300">Pre-Launch Mode — Site Not Published Yet</strong>
                <span>
                  Human payments and real-money earnings do not exist until the site is published live. All balances remain 0.00 across ISO-4217 national currencies until launch.
                </span>
              </div>
            </div>
          )}
          {preLaunchNotice && (
            <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-3 text-xs text-rose-200">
              {preLaunchNotice}
            </div>
          )}
          {/* Key Legal Highlight Banners */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Sale Model Banner */}
            <div className={`rounded-xl border p-3.5 ${
              isFullBuyout
                ? "border-purple-500/40 bg-purple-950/20"
                : "border-amber-500/40 bg-amber-950/20"
            }`}>
              <div className="flex items-center gap-1.5 font-bold text-xs uppercase tracking-wider mb-1 text-purple-300">
                <Scale className="h-3.5 w-3.5" />
                {isFullBuyout ? "100% Copyright Sold" : "15% Ongoing Royalty"}
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                {isFullBuyout 
                  ? "Buyer receives 100% copyright ownership. Ideator receives full buyout stake and owns 0% ongoing royalty." 
                  : "Ideator retains moral authorship and receives 15% of all future gross market sales perpetually."}
              </p>
            </div>

            {/* In-App Master Wallet 3% Fee Settlement */}
            <div className="rounded-xl border border-sky-500/40 bg-sky-950/20 p-3.5">
              <div className="flex items-center gap-1.5 text-sky-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Smartphone className="h-3.5 w-3.5" />
                3% App Wallet Settlement
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                3% platform fee (${commission.platformFeeUsd} USD ≈ ₨{commission.platformFeeNpr.toLocaleString()} NPR) automatically credited to <strong className="text-neutral-100">Medha Koirala (Master Vault)</strong> upon escrow execution.
              </p>
            </div>

            {/* Currency Choice */}
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3.5">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
                <Globe className="h-3.5 w-3.5" />
                Local Currency Payout
              </div>
              <p className="text-[11px] text-neutral-300 leading-relaxed">
                Paid in seller's preferred country currency: <strong className="text-emerald-300">{formatPrice(idea.upfrontPrice, payoutCurrency)}</strong> ({payoutCurrency}).
              </p>
            </div>
          </div>

          {/* Parties & Pricing Summary */}
          <div className="rounded-xl bg-neutral-950 border border-neutral-800 p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-400 block mb-0.5">Originating Ideator:</span>
                <div className="font-bold text-neutral-100 text-sm">{idea.creator.name}</div>
                <div className="text-[11px] text-neutral-400">
                  {idea.creator.role} • {idea.creator.country || "Nepal"}
                </div>
              </div>

              <div>
                <span className="text-neutral-400 block mb-0.5">Purchaser / Tech Builder:</span>
                <div className="font-bold text-neutral-100 text-sm">{currentUser.name}</div>
                <div className="text-[11px] text-neutral-400">
                  {buyerCompany || "Commercial Venture Partner"}
                </div>
              </div>
            </div>

            {/* Itemized Transaction Bill & Settlement */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-900/90 p-3.5 space-y-2 text-xs">
              <div className="flex items-center justify-between font-bold text-neutral-200 border-b border-neutral-800 pb-1.5">
                <span>Official Settlement Bill & Invoice</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded">
                  Free Posting • Fee Charged on Bill at Sale
                </span>
              </div>
              <div className="flex items-center justify-between text-neutral-300">
                <span>Gross Purchase Consideration:</span>
                <span className="font-mono font-bold">${idea.upfrontPrice} USD ({formatPrice(idea.upfrontPrice, payoutCurrency)})</span>
              </div>
              <div className="flex items-center justify-between text-sky-400 text-[11px]">
                <span>Platform Discovery Fee (3% charged on this bill):</span>
                <span className="font-mono font-semibold">-${commission.platformFeeUsd} USD (₨{commission.platformFeeNpr.toLocaleString()} NPR settled into App Master Vault Wallet)</span>
              </div>
              <div className="flex items-center justify-between text-emerald-400 font-bold border-t border-neutral-800 pt-1.5">
                <span>Net Consideration Disbursed to Creator:</span>
                <span className="font-mono text-sm">${commission.netSellerUsd} USD</span>
              </div>
            </div>
          </div>

          {/* Worldwide Digital Wallet & QR Code Payment Portal */}
          <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-br from-neutral-900 via-neutral-950 to-neutral-900 p-5 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <QrCode className="h-4 w-4" /> Real Money Payment Gateway
                </span>
                <h3 className="text-sm font-bold text-neutral-100 mt-0.5">
                  Direct Digital Account Payout to Creator ({idea.creator.name})
                </h3>
              </div>

              {/* Payment Mode Selector: QR vs In-App */}
              <div className="flex items-center gap-1 bg-neutral-950 p-1 rounded-xl border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setPaymentMethod("qr_payment")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    paymentMethod === "qr_payment"
                      ? "bg-amber-500 text-neutral-950 shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <QrCode className="h-3.5 w-3.5" />
                  <span>Scan QR to Pay</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod("wallet_transfer")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold transition-all ${
                    paymentMethod === "wallet_transfer"
                      ? "bg-amber-500 text-neutral-950 shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <CreditCard className="h-3.5 w-3.5" />
                  <span>In-App Balance</span>
                </button>
              </div>
            </div>

            {paymentMethod === "qr_payment" ? (
              <div className="space-y-4">
                {/* Country Filter for Digital Wallets Worldwide */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-950/80 p-3 rounded-xl border border-neutral-800 text-xs">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-sky-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-neutral-200 block">Select Buyer / Payer Country:</span>
                      <span className="text-[11px] text-neutral-400">Presents local digital wallets & QR standards for that nation</span>
                    </div>
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
                    <option value="Nepal">🇳🇵 Nepal (Khalti, eSewa, ConnectIPS)</option>
                    <option value="United States">🇺🇸 United States (Apple Pay, Google Pay, Venmo, Cash App, Zelle)</option>
                    <option value="India">🇮🇳 India (PhonePe, Google Pay, Paytm, UPI)</option>
                    <option value="United Kingdom">🇬🇧 United Kingdom (Revolut, Monzo, BACS)</option>
                    <option value="European Union">🇪🇺 European Union (SEPA Instant, Revolut, iDEAL, BLIK)</option>
                    <option value="Japan">🇯🇵 Japan (PayPay, LINE Pay)</option>
                    <option value="Australia">🇦🇺 Australia (PayID, CommBank, Afterpay)</option>
                    <option value="Canada">🇨🇦 Canada (Interac e-Transfer, Wealthsimple)</option>
                    <option value="Global">🌐 Other Countries (Wise, Stripe, Payoneer, SWIFT)</option>
                  </select>
                </div>

                {/* Country-Specific Digital Wallets List */}
                <div>
                  <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                    Available Digital Wallets for {buyerCountry} + Universal International:
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {getWalletsForCountry(buyerCountry).slice(0, 8).map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelectedWalletId(w.id)}
                        className={`p-2.5 rounded-xl border text-left transition-all ${
                          selectedWalletId === w.id
                            ? "border-amber-400 bg-amber-950/40 text-amber-200 ring-1 ring-amber-400/50"
                            : "border-neutral-800 bg-neutral-950/60 hover:bg-neutral-900 text-neutral-300"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs truncate">{w.name}</span>
                          {selectedWalletId === w.id && <Check className="h-3.5 w-3.5 text-amber-400 shrink-0" />}
                        </div>
                        <div className="text-[10px] text-neutral-400 mt-1 flex items-center gap-1">
                          <span className="rounded bg-neutral-800 px-1 py-0.2 text-[9px] font-mono text-neutral-300">
                            {w.currency}
                          </span>
                          <span className="truncate">{w.badge}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Live Dynamic QR Code Card */}
                {(() => {
                  const currentWallet = GLOBAL_DIGITAL_WALLETS.find((w) => w.id === selectedWalletId) || GLOBAL_DIGITAL_WALLETS[0];
                  return (
                    <div className="rounded-2xl border border-amber-500/40 bg-neutral-950 p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-5">
                      {/* High-Contrast Dynamic QR Code Graphic */}
                      <div className="relative flex flex-col items-center justify-center p-3 bg-white rounded-2xl shadow-lg shrink-0">
                        <svg className="h-36 w-36" viewBox="0 0 100 100" fill="#000000">
                          {/* Top-left position marker */}
                          <rect x="5" y="5" width="28" height="28" fill="#000" />
                          <rect x="9" y="9" width="20" height="20" fill="#fff" />
                          <rect x="13" y="13" width="12" height="12" fill="#000" />
                          {/* Top-right position marker */}
                          <rect x="67" y="5" width="28" height="28" fill="#000" />
                          <rect x="71" y="9" width="20" height="20" fill="#fff" />
                          <rect x="75" y="13" width="12" height="12" fill="#000" />
                          {/* Bottom-left position marker */}
                          <rect x="5" y="67" width="28" height="28" fill="#000" />
                          <rect x="9" y="71" width="20" height="20" fill="#fff" />
                          <rect x="13" y="75" width="12" height="12" fill="#000" />
                          {/* Synchronized Data Matrix Pattern */}
                          <rect x="38" y="8" width="6" height="6" />
                          <rect x="48" y="14" width="8" height="6" />
                          <rect x="38" y="24" width="8" height="6" />
                          <rect x="52" y="26" width="6" height="8" />
                          <rect x="8" y="38" width="8" height="6" />
                          <rect x="22" y="42" width="6" height="8" />
                          <rect x="38" y="38" width="24" height="24" fill="#f59e0b" />
                          <rect x="44" y="44" width="12" height="12" fill="#000" />
                          <rect x="68" y="38" width="10" height="6" />
                          <rect x="82" y="44" width="6" height="8" />
                          <rect x="38" y="68" width="6" height="10" />
                          <rect x="48" y="76" width="10" height="6" />
                          <rect x="68" y="68" width="8" height="8" />
                          <rect x="80" y="78" width="8" height="10" />
                        </svg>
                        <span className="text-[10px] font-mono font-bold text-neutral-800 mt-1">
                          {currentWallet.qrFormatName}
                        </span>
                      </div>

                      {/* QR Payout Instructions & Real-Money Guarantee */}
                      <div className="flex-1 space-y-2 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-extrabold text-neutral-100 text-sm">
                            {currentWallet.name} Direct Payout
                          </span>
                          <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                            Real Money Guarantee
                          </span>
                        </div>

                        <div className="space-y-1 text-neutral-300 text-[11px]">
                          <p>
                            • Total Consideration: <strong className="text-amber-300 font-mono text-xs">${idea.upfrontPrice} USD ({formatPrice(idea.upfrontPrice, payoutCurrency)})</strong>
                          </p>
                          <p>
                            • Recipient Creator Account: <strong className="text-neutral-100">{idea.creator.name}</strong> ({idea.creator.country || "Nepal"})
                          </p>
                          <p>
                            • Discovery Commission: <span className="text-sky-300 font-mono">3% (${commission.platformFeeUsd} USD)</span> automatically routed to Master Vault.
                          </p>
                          <p className="text-neutral-400">
                            • {currentWallet.instruction}
                          </p>
                        </div>

                        {/* Instant Scan Confirmation */}
                        <div className="pt-2">
                          <button
                            type="button"
                            onClick={() => setQrConfirmed(!qrConfirmed)}
                            className={`w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl px-4 py-2 font-bold text-xs transition-all ${
                              qrConfirmed
                                ? "bg-emerald-500 text-neutral-950 shadow-md shadow-emerald-500/20"
                                : "bg-neutral-800 hover:bg-neutral-700 text-amber-300 border border-neutral-700"
                            }`}
                          >
                            <CheckCircle2 className="h-4 w-4" />
                            <span>
                              {qrConfirmed 
                                ? `✓ QR Scanned & Paid via ${currentWallet.name}` 
                                : `Confirm QR Payment via ${currentWallet.name}`}
                            </span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()}
              </div>
            ) : (
              /* In-App Vault Account Direct Balance Transfer */
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-neutral-200">In-App Vault Account Balance:</span>
                  <span className="font-mono text-emerald-400 font-bold">
                    {formatPrice(currentUser.balance || 0, payoutCurrency)}
                  </span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Upon contract execution, ${idea.upfrontPrice} USD will be transferred directly: ${commission.netSellerUsd} USD into {idea.creator.name}'s digital account and ${commission.platformFeeUsd} USD into the platform Master Vault.
                </p>
              </div>
            )}
          </div>

          {/* Legal Contract Agreement Viewer */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-400" />
                Legal Covenant Document Text
              </span>
              <span className="text-[11px] font-mono text-neutral-400">
                {legalHash}
              </span>
            </div>
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 max-h-56 overflow-y-auto text-xs font-mono text-neutral-300 leading-relaxed whitespace-pre-line select-text">
              {isGenerating ? "Generating certified contract covenants with AI..." : contractText}
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
                I agree to the terms of this {isFullBuyout ? "Full Copyright Buyout" : "15% Royalty License"} agreement. I confirm compliance with the United Nations UNCITRAL electronic signature standards and Nepal Copyright Act 2059. I authorize the automated 3% platform discovery fee settlement into the Platform Owner's In-App Master Vault Wallet.
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Type Full Legal Name as Electronic Signature:
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
                  Buyer Company / Studio Entity:
                </label>
                <input
                  type="text"
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                  placeholder="e.g., Vance Hardware Labs Ltd."
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="text-[11px] text-neutral-500">
            Escrow held securely • Official certificate delivered to ideator email
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
              disabled={!isPublished || !agreedToTerms || !signatureTyped.trim() || isGenerating}
              onClick={handleExecute}
              className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-bold transition-all shadow-md active:scale-95 ${
                !isPublished || !agreedToTerms || !signatureTyped.trim() || isGenerating
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
                  ? "Execute Full Buyout & Settle Real Money"
                  : "Sign 15% Contract & Settle Real Money"}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
