import React, { useState } from "react";
import { Idea, UserProfile, AccountUploadedFile } from "../types";
import {
  Briefcase,
  Sparkles,
  TrendingUp,
  X,
  Send,
  FileText,
  Award,
  Upload,
  CheckCircle2,
  AlertCircle,
  QrCode,
  Trash2,
} from "lucide-react";
import confetti from "canvas-confetti";
import { EXCHANGE_RATES } from "../utils/legalAndCurrency";
import { isSitePublishedLive } from "../utils/syncEngine";

interface ProductionRoomModalProps {
  idea: Idea | null;
  currentUser: UserProfile;
  ownerProfile?: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSimulateSale: (
    ideaId: string,
    saleAmount: number,
    realBankOrQrRefId: string,
    paymentProofFile: AccountUploadedFile
  ) => void;
  onAddProductionNote: (ideaId: string, note: string) => void;
}

export const ProductionRoomModal: React.FC<ProductionRoomModalProps> = ({
  idea,
  currentUser,
  ownerProfile,
  isOpen,
  onClose,
  onSimulateSale,
  onAddProductionNote,
}) => {
  const [noteInput, setNoteInput] = useState("");
  const [isExpanding, setIsExpanding] = useState(false);
  const [aiRoadmap, setAiRoadmap] = useState<any>(null);

  // Verified Real-Money Settlement States (No Fake Simulation Buttons)
  const [paidGrossAmountUsd, setPaidGrossAmountUsd] = useState<string>("");
  const [realPaymentRefId, setRealPaymentRefId] = useState<string>("");
  const [paymentProofFile, setPaymentProofFile] = useState<AccountUploadedFile | null>(null);
  const [settlementError, setSettlementError] = useState<string | null>(null);
  const [settlementSuccess, setSettlementSuccess] = useState<string | null>(null);

  if (!isOpen || !idea) return null;

  const isPublished = isSitePublishedLive();
  const totalSales = idea.marketSales?.totalProductSales || 0;
  const creatorCommission = idea.marketSales?.commissionEarned || totalSales * 0.15;
  const platformCommissionUsd = idea.marketSales?.platformCommissionEarned || totalSales * 0.03;
  const platformCommissionNpr = Math.round(platformCommissionUsd * EXCHANGE_RATES.NPR.rate);
  const builderShare = totalSales - creatorCommission - platformCommissionUsd;

  const parsedInputUsd = Math.max(0, parseFloat(paidGrossAmountUsd) || 0);
  const previewCreatorUsd = Math.round(parsedInputUsd * 0.15 * 100) / 100;
  const previewOwnerUsd = Math.round(parsedInputUsd * 0.03 * 100) / 100;
  const previewOwnerNpr = Math.round(previewOwnerUsd * EXCHANGE_RATES.NPR.rate * 100) / 100;

  const ownerQrConfig = ownerProfile?.wallet?.ownerQrAccount;

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddProductionNote(
      idea.id,
      `[${currentUser.name} (${currentUser.role === "creator_ideator" ? "Creator" : "Producer"})]: ${noteInput.trim()}`
    );
    setNoteInput("");
  };

  const handleUploadReceipt = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPaymentProofFile({
          id: `proof-sale-${Date.now()}`,
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          kind: file.type.startsWith("image/") ? "image" : "document",
          dataUrl: reader.result,
          uploadedAt: new Date().toLocaleString(),
        });
        setSettlementError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitVerifiedSale = (e: React.FormEvent) => {
    e.preventDefault();
    setSettlementError(null);
    setSettlementSuccess(null);

    if (!isPublished) {
      setSettlementError(
        "Site is not published yet: Real-money commercial settlements activate once IdeaVault is published live."
      );
      return;
    }

    const amt = parseFloat(paidGrossAmountUsd);
    if (isNaN(amt) || amt <= 0) {
      setSettlementError("Enter the actual real-money customer payment amount received.");
      return;
    }
    if (realPaymentRefId.trim().length < 6) {
      setSettlementError(
        "Enter the real Bank / Wallet / QR Transaction Reference ID (at least 6 characters)."
      );
      return;
    }
    if (!paymentProofFile) {
      setSettlementError(
        "Upload the actual payment receipt image or settlement document before recording earnings."
      );
      return;
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
    });

    onSimulateSale(idea.id, amt, realPaymentRefId.trim(), paymentProofFile);
    setSettlementSuccess(
      `Verified real-money payment recorded (Ref #${realPaymentRefId.trim()}). 15% Creator Royalty settled and 3% Owner Commission wired in Nepali Currency (₨${previewOwnerNpr.toLocaleString()} NPR) to Owner QR Account.`
    );
    setPaidGrossAmountUsd("");
    setRealPaymentRefId("");
    setPaymentProofFile(null);
  };

  const handleAIBrainstorm = async () => {
    setIsExpanding(true);
    try {
      const res = await fetch("/api/ai/expand-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: idea.title,
          description: idea.description,
          category: idea.category,
        }),
      });
      const data = await res.json();
      setAiRoadmap(data);
    } catch (err) {
      console.error("Failed to expand idea:", err);
    } finally {
      setIsExpanding(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="production-room-modal"
        className="relative w-full max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[88vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                  Co-Production Room &amp; Verified Real-Money Royalty Settlement
                </h2>
                <span className="text-xs font-semibold text-emerald-400">
                  · Active Contract
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {idea.title} · Ideator: <span className="text-neutral-200 font-semibold">{idea.creator.name}</span>
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

        {/* Modal Main Content */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Live Verified Sales & 15% Royalty + 3% Nepali NPR Owner QR Wire Panel */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-neutral-950 to-neutral-950 p-5 shadow-lg space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  Verified Real-Money Commercial Sales
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  <div className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-mono">
                    ${totalSales.toLocaleString()}
                  </div>
                  <span className="text-xs text-neutral-400">
                    Receipt-Verified Gross Revenue (Zero Unpaid Estimates)
                  </span>
                </div>
              </div>

              {/* 3-Way Distribution Cards */}
              <div className="flex items-center gap-3 flex-wrap">
                <div className="rounded-xl bg-neutral-900/90 border border-amber-500/40 p-3 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                    Ideator Royalty (15%)
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">
                    ${creatorCommission.toLocaleString()} USD
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Paid to {idea.creator.name}
                  </div>
                </div>

                <div className="rounded-xl bg-neutral-900/90 border border-sky-500/40 p-3 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block">
                    Owner QR Wire (3% in NPR ₨)
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold text-sky-400 font-mono">
                    ₨{platformCommissionNpr.toLocaleString()} NPR
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Wired in Nepali Currency (${platformCommissionUsd.toLocaleString()} eqv)
                  </div>
                </div>

                <div className="rounded-xl bg-neutral-900/90 border border-neutral-700 p-3 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 block">
                    Builder Share (82%)
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold text-neutral-200 font-mono">
                    ${builderShare.toLocaleString()} USD
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Production &amp; operations
                  </div>
                </div>
              </div>
            </div>

            {/* Mandatory Verified Real-Money Settlement Form (Replaces Fake Simulation Buttons) */}
            <form
              onSubmit={handleSubmitVerifiedSale}
              className="pt-4 border-t border-neutral-800/80 space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-100">
                    Submit Verified Real-Money Royalty &amp; Owner NPR QR Settlement
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Earnings are never displayed from fake clicks—actual money must be paid, with bank/QR transaction ID and uploaded receipt proof attached.
                  </p>
                </div>
                {ownerQrConfig?.qrImageDataUrl && (
                  <div className="flex items-center gap-2 rounded-xl border border-amber-500/40 bg-neutral-900 px-3 py-1.5 text-[11px]">
                    <img
                      src={ownerQrConfig.qrImageDataUrl}
                      alt="Owner NPR QR"
                      className="h-8 w-8 rounded bg-white p-0.5 object-contain"
                    />
                    <div>
                      <div className="font-bold text-amber-300">Owner NPR ₨ QR</div>
                      <div className="text-[10px] text-neutral-400">{ownerQrConfig.qrProviderName}</div>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Actual Paid Gross Revenue (USD eqv)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={paidGrossAmountUsd}
                    onChange={(e) => setPaidGrossAmountUsd(e.target.value)}
                    placeholder="Enter actual paid amount"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs font-mono text-neutral-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Bank / Wallet / QR Transaction Ref ID
                  </label>
                  <input
                    type="text"
                    value={realPaymentRefId}
                    onChange={(e) => setRealPaymentRefId(e.target.value)}
                    placeholder="e.g. FONEPAY-98472610"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs font-mono text-neutral-100 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Upload Payment Receipt (Image or PDF/Doc)
                  </label>
                  {paymentProofFile ? (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3 py-1.5">
                      <span className="truncate text-[11px] text-emerald-300 font-medium">
                        {paymentProofFile.name}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPaymentProofFile(null)}
                        className="text-neutral-400 hover:text-red-400 ml-2"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-1.5 rounded-xl border border-dashed border-neutral-700 hover:border-amber-400 bg-neutral-950 px-3 py-2 text-xs font-semibold text-amber-300 cursor-pointer transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Receipt / Statement</span>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx,.txt"
                        onChange={handleUploadReceipt}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {parsedInputUsd > 0 && (
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <span className="text-neutral-300">
                    Creator 15% Wire: <strong className="font-mono text-amber-300">${previewCreatorUsd.toLocaleString()} USD</strong>
                  </span>
                  <span className="text-sky-300 flex items-center gap-1.5">
                    <QrCode className="h-3.5 w-3.5" />
                    <span>
                      Owner 3% Wire in Nepali Currency:{" "}
                      <strong className="font-mono">₨{previewOwnerNpr.toLocaleString()} NPR</strong>
                    </span>
                  </span>
                </div>
              )}

              {settlementError && (
                <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-300 flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  <span>{settlementError}</span>
                </div>
              )}

              {settlementSuccess && (
                <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                  <span>{settlementSuccess}</span>
                </div>
              )}

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!isPublished || !paymentProofFile || realPaymentRefId.trim().length < 6 || parsedInputUsd <= 0}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:cursor-not-allowed px-5 py-2.5 text-xs font-bold text-neutral-950 transition-colors cursor-pointer"
                >
                  {isPublished
                    ? "Verify Receipt & Wire Real-Money Settlement (NPR ₨ Owner QR)"
                    : "Settlement Inactive Until Site Published"}
                </button>
              </div>
            </form>
          </div>

          {/* Dual Columns: Creator Expressing Idea & Production Milestones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-400" />
                  Creator Co-Production &amp; Idea Depth
                </h3>
                <button
                  onClick={handleAIBrainstorm}
                  disabled={isExpanding}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 disabled:opacity-50"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isExpanding ? "animate-spin" : ""}`} />
                  <span>{isExpanding ? "Analyzing..." : "Production Roadmap"}</span>
                </button>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3 min-h-[160px] max-h-[260px] overflow-y-auto">
                <div className="text-xs text-neutral-400 italic">
                  Pursuant to Section 3 of your agreement, the original creator ({idea.creator.name}) provides direct product advisory input to preserve the authentic design vision.
                </div>
                {(idea.productionNotes || []).map((note, idx) => (
                  <div key={idx} className="rounded-lg bg-neutral-900 p-2.5 text-xs text-neutral-200 border border-neutral-800">
                    {note}
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendNote} className="flex gap-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Creator / Buyer: Express further idea specifications, feedback, or test results..."
                  className="flex-1 rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-neutral-950 transition-all shrink-0"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
                <Award className="h-4 w-4 text-emerald-400" />
                Commercialization Roadmap
              </h3>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-200">1. Contract Executed &amp; Payment Verified</div>
                    <div className="text-[11px] text-neutral-400">Real-money receipt verified and 3% wired in NPR ₨ to Owner QR</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-200">2. Creator Consultation &amp; Prototype CAD</div>
                    <div className="text-[11px] text-neutral-400">Specifications reviewed with {idea.creator.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-amber-300">3. Commercial Production &amp; Distribution</div>
                    <div className="text-[11px] text-neutral-400">Active market sales generated across channels</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 font-bold text-xs">
                    4
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-400">4. Receipt-Verified Royalty Payouts</div>
                    <div className="text-[11px] text-neutral-500">15% creator share + 3% NPR ₨ Owner QR wire on verified statements</div>
                  </div>
                </div>
              </div>

              {aiRoadmap && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs space-y-2">
                  <div className="font-bold text-amber-300">Suggested Commercialization Vectors:</div>
                  <ul className="list-disc pl-4 space-y-1 text-neutral-300">
                    {(aiRoadmap.productionPlan || []).map((step: string, i: number) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ul>
                  {aiRoadmap.salesStrategy && (
                    <div className="text-neutral-300 pt-1">
                      <span className="font-semibold text-amber-400">Sales Strategy:</span> {aiRoadmap.salesStrategy}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 bg-neutral-950 px-6 py-3.5 flex items-center justify-between text-xs text-neutral-400">
          <div>
            Contract ID: <span className="font-mono text-neutral-300">{idea.contract?.id || "CON-ACTIVE"}</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs font-semibold text-neutral-200 transition-colors"
          >
            Close Workspace
          </button>
        </div>
      </div>
    </div>
  );
};
