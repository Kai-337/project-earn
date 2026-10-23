import React, { useState } from "react";
import { Idea, BuyerMatch, UserProfile, CurrencyCode } from "../types";
import { 
  Users, 
  CheckCircle2, 
  Sparkles, 
  DollarSign, 
  Building, 
  Briefcase, 
  ShieldCheck, 
  Send, 
  ExternalLink,
  Smartphone,
  X,
  FileCheck,
  Scale
} from "lucide-react";
import { findMatchedBuyers, formatPrice, PLATFORM_OWNER_WALLET, EXCHANGE_RATES } from "../utils/legalAndCurrency";
import { isSitePublishedLive } from "../utils/syncEngine";

interface MatchedBuyersModalProps {
  idea: Idea | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onExecuteDeal: (idea: Idea, buyer: BuyerMatch, isFullBuyout: boolean) => void;
  preferredCurrency?: CurrencyCode;
}

export const MatchedBuyersModal: React.FC<MatchedBuyersModalProps> = ({
  idea,
  currentUser,
  isOpen,
  onClose,
  onExecuteDeal,
  preferredCurrency = "USD",
}) => {
  const [selectedBuyer, setSelectedBuyer] = useState<BuyerMatch | null>(null);
  const [dealSuccessNotice, setDealSuccessNotice] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !idea) return null;

  const isPublished = isSitePublishedLive();
  const matches = isPublished
    ? idea.matchedBuyers && idea.matchedBuyers.length > 0
      ? idea.matchedBuyers
      : findMatchedBuyers(idea.category, idea.title)
    : [];

  const isFullBuyout = idea.saleModel === "full_buyout";
  const upfrontPriceUsd = idea.upfrontPrice;
  const platformFeeUsd = Math.round(upfrontPriceUsd * 0.03 * 100) / 100;
  const platformFeeNpr = Math.round(platformFeeUsd * EXCHANGE_RATES.NPR.rate);

  const handleAcquireClick = (buyer: BuyerMatch) => {
    if (!isPublished) return;
    setSelectedBuyer(buyer);
    setIsProcessing(true);

    setTimeout(() => {
      onExecuteDeal(idea, buyer, isFullBuyout);
      setIsProcessing(false);
      setDealSuccessNotice(
        `SUCCESS! ${buyer.name} (${buyer.company}) has executed the ${isFullBuyout ? "100% Full Copyright Buyout" : "15% Royalty License"} agreement. Net real-money funds deposited to ${idea.creator.name}'s digital wallet slot in ${preferredCurrency}. Automated 3% discovery fee ($${platformFeeUsd} USD / ₨${platformFeeNpr.toLocaleString()} NPR) settled into Master Wallet!`
      );
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="modal-matched-buyers"
        className="relative w-full max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-neutral-950 shadow-md shadow-amber-500/20">
              <Users className="h-6 w-6 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-100">
                  Matched Buyers & Builders Ready to Acquire
                </h2>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  {matches.length} Verified Matches Found
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Matched according to domain expertise, acquisition budget, and production tooling capability
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

        {/* Financial Model Banner */}
        <div className="border-b border-neutral-800 bg-neutral-950/60 p-4 px-6 text-xs flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
              Active Concept
            </span>
            <strong className="text-sm text-neutral-100">{idea.title}</strong>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                Acquisition Model
              </span>
              <span className="text-xs font-bold text-amber-400">
                {isFullBuyout ? "100% Full Copyright Buyout (0% Ongoing Royalty)" : "15% Creator Royalty License"}
              </span>
            </div>

            <div className="border-l border-neutral-800 pl-4 text-right">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-semibold block">
                Upfront Price
              </span>
              <span className="text-sm font-extrabold text-neutral-100 font-mono">
                {formatPrice(upfrontPriceUsd, preferredCurrency)}
              </span>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
          {dealSuccessNotice ? (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-6 text-center space-y-3 animate-in fade-in">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-bold text-neutral-100">Deal Completed & Legally Executed!</h3>
              <p className="text-xs text-neutral-300 max-w-xl mx-auto leading-relaxed">
                {dealSuccessNotice}
              </p>
              <div className="pt-2">
                <button
                  onClick={onClose}
                  className="rounded-xl bg-emerald-500 hover:bg-emerald-400 px-6 py-2.5 text-xs font-bold text-neutral-950"
                >
                  View Updated Status in Marketplace
                </button>
              </div>
            </div>
          ) : matches.length === 0 ? (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-8 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-100">
                No Human Buyers or Human Payments Active Yet
              </h3>
              <p className="text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
                Because IdeaVault is currently in pre-launch mode and not published live yet, external human buyers, human accounts, and real-money human payments do not exist yet. Once published live, verified corporate buyers and builders can acquire ideas using real-world national currencies (NPR, USD, INR, EUR, GBP, AUD, CAD, JPY, PLN) settled to your Digital Wallet or Any Bank Account.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-neutral-400 leading-relaxed">
                These verified corporate buyers, manufacturers, and hardware labs have real-money capital in escrow to acquire your idea.
                Upon clicking <strong>Execute Buyout Deal</strong>, legal copyright transfer documents under the WIPO Berne Convention & Nepal Copyright Act 2059 are generated, 3% is settled into the Platform Master Wallet, and net proceeds are delivered to the ideator's multi-currency wallet slot.
              </div>

              <div className="grid grid-cols-1 gap-4">
                {matches.map((buyer) => (
                  <div
                    key={buyer.id}
                    className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-5 hover:border-neutral-700 transition-all shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5">
                      <img
                        src={buyer.avatar}
                        alt={buyer.name}
                        className="h-12 w-12 rounded-xl object-cover ring-2 ring-neutral-700 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-sm font-bold text-neutral-100">{buyer.name}</h4>
                          <span className="text-xs text-neutral-400">{buyer.handle}</span>
                          <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                            {buyer.matchScore}% Match
                          </span>
                          <span className="rounded-full bg-neutral-800 px-2 py-0.5 text-[10px] text-neutral-400">
                            {buyer.country}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5 text-neutral-500" />
                          <span>{buyer.company}</span>
                        </div>

                        <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
                          {buyer.reason}
                        </p>

                        <div className="flex items-center gap-2 pt-1 text-[11px] text-neutral-500">
                          <span>Past successes:</span>
                          {buyer.pastCreations.map((p, idx) => (
                            <span key={idx} className="rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-neutral-300">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                      <div>
                        <span className="text-[10px] uppercase text-neutral-500 font-semibold block">
                          Verified Budget
                        </span>
                        <span className="text-sm font-extrabold text-emerald-400 font-mono">
                          {formatPrice(buyer.budgetUsd, buyer.preferredCurrency)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleAcquireClick(buyer)}
                        disabled={isProcessing}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs font-bold text-neutral-950 transition-all shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50"
                      >
                        <FileCheck className="h-4 w-4" />
                        <span>{isProcessing && selectedBuyer?.id === buyer.id ? "Securing..." : "Execute Buyout Deal"}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Smartphone className="h-4 w-4 text-emerald-400" />
            <span>Automated 3% discovery fee settled into Master Vault Wallet (Medha Koirala)</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-800 px-4 py-2 font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
