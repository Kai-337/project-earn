import React from "react";
import { Idea, BuyerMatch, UserProfile, CurrencyCode } from "../types";
import {
  Users,
  Building,
  Smartphone,
  X,
  FileCheck,
  QrCode,
} from "lucide-react";
import { findMatchedBuyers, formatPrice, EXCHANGE_RATES } from "../utils/legalAndCurrency";
import { isSitePublishedLive } from "../utils/syncEngine";

interface MatchedBuyersModalProps {
  idea: Idea | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onExecuteDeal: (idea: Idea, buyer: BuyerMatch, isFullBuyout: boolean) => void;
  onOpenContractForBuyer?: (idea: Idea, buyer: BuyerMatch) => void;
  preferredCurrency?: CurrencyCode;
}

export const MatchedBuyersModal: React.FC<MatchedBuyersModalProps> = ({
  idea,
  isOpen,
  onClose,
  onOpenContractForBuyer,
  preferredCurrency = "USD",
}) => {
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

  const handleOpenVerifiedPaymentPortal = (buyer: BuyerMatch) => {
    if (!isPublished) return;
    if (onOpenContractForBuyer) {
      onOpenContractForBuyer(idea, buyer);
    }
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
                  Matched Buyers &amp; Builders Ready to Acquire
                </h2>
                <span className="text-xs font-semibold text-emerald-400">
                  · {matches.length} Matches
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                All acquisitions require actual real-money payment proof &amp; wire 3% in Nepali Currency (₨{platformFeeNpr.toLocaleString()} NPR) to Owner QR
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
                {isFullBuyout
                  ? "100% Full Copyright Buyout (0% Ongoing Royalty)"
                  : idea.saleModel === "licensed_fixed_term"
                  ? "3-Year License (1.5-Year Max 15% Royalty)"
                  : "Keep Copyright + 15% Creator Royalty"}
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
          {matches.length === 0 ? (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/90 p-8 text-center space-y-3">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <Users className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-neutral-100">
                No Human Buyers or Human Payments Active Yet
              </h3>
              <p className="text-xs text-neutral-400 max-w-lg mx-auto leading-relaxed">
                Because IdeaVault is currently in pre-launch mode and not published live yet, external human buyers, human accounts, and real-money human payments do not exist yet. Once published live, verified buyers must submit real bank/QR payment receipts to acquire ideas, and the 3% commission wires to the Owner QR Account in Nepali Currency (NPR ₨) every time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-xs text-neutral-400 leading-relaxed">
                Deals never settle with simulated clicks. Clicking <strong>Proceed to Real-Money Payment &amp; Contract</strong> opens the payment verification portal where actual funds must be paid, receipt proof uploaded, and 3% (₨{platformFeeNpr.toLocaleString()} NPR) wired to Owner Medha Koirala&apos;s Nepali QR Account.
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
                          <span className="text-xs text-neutral-400">
                            · {buyer.handle} · {buyer.matchScore}% Match · {buyer.country}
                          </span>
                        </div>

                        <div className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                          <Building className="h-3.5 w-3.5 text-neutral-500" />
                          <span>{buyer.company}</span>
                        </div>

                        <p className="text-xs text-neutral-400 leading-relaxed max-w-xl">
                          {buyer.reason}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                      <button
                        onClick={() => handleOpenVerifiedPaymentPortal(buyer)}
                        className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2.5 text-xs font-bold text-neutral-950 transition-all shadow-md shadow-amber-500/20 active:scale-95 cursor-pointer"
                      >
                        <FileCheck className="h-4 w-4" />
                        <span>Proceed to Real-Money Payment &amp; Contract</span>
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
            <QrCode className="h-4 w-4 text-amber-400" />
            <span>3% commission wired in Nepali Currency (NPR ₨) to Owner QR Account (Medha Koirala)</span>
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
