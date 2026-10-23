import React, { useState } from "react";
import { Idea, UserProfile, ProductionMessage } from "../types";
import { 
  Briefcase, 
  Sparkles, 
  DollarSign, 
  TrendingUp, 
  X, 
  Send, 
  FileText, 
  CheckCircle2, 
  Award,
  Layers,
  ShoppingBag
} from "lucide-react";
import confetti from "canvas-confetti";

interface ProductionRoomModalProps {
  idea: Idea | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSimulateSale: (ideaId: string, saleAmount: number) => void;
  onAddProductionNote: (ideaId: string, note: string) => void;
}

export const ProductionRoomModal: React.FC<ProductionRoomModalProps> = ({
  idea,
  currentUser,
  isOpen,
  onClose,
  onSimulateSale,
  onAddProductionNote,
}) => {
  const [noteInput, setNoteInput] = useState("");
  const [isExpanding, setIsExpanding] = useState(false);
  const [aiRoadmap, setAiRoadmap] = useState<any>(null);
  const [saleInput, setSaleInput] = useState<number>(2500);

  if (!isOpen || !idea) return null;

  const totalSales = idea.marketSales?.totalProductSales || 0;
  const creatorCommission = idea.marketSales?.commissionEarned || (totalSales * 0.15);
  const platformCommission = idea.marketSales?.platformCommissionEarned || (totalSales * 0.03);
  const builderShare = totalSales - creatorCommission - platformCommission;

  const handleSendNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteInput.trim()) return;
    onAddProductionNote(idea.id, `[${currentUser.name} (${currentUser.role === 'creator_ideator' ? 'Creator' : 'Producer'})]: ${noteInput.trim()}`);
    setNoteInput("");
  };

  const handleSimulate = (amount: number) => {
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.5 },
    });
    onSimulateSale(idea.id, amount);
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
                  Co-Production Room & 15% Royalty Ledger
                </h2>
                <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                  Active Contract
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                {idea.title} • Ideator: <span className="text-neutral-200 font-semibold">{idea.creator.name}</span>
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
          {/* Live Sales & 15% Royalty Distribution Panel */}
          <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-neutral-950 to-neutral-950 p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  Live Market Commercial Sales Tracker
                </span>
                <div className="mt-1 flex items-baseline gap-3">
                  <div className="text-2xl sm:text-3xl font-extrabold text-neutral-100 font-mono">
                    ${totalSales.toLocaleString()}
                  </div>
                  <span className="text-xs text-neutral-400">Total Product Sales Worldwide</span>
                </div>
              </div>

              {/* 3-Way Distribution Cards */}
              <div className="flex items-center gap-3 flex-wrap">
                {/* Creator 15% Royalty Tally */}
                <div className="rounded-xl bg-neutral-900/90 border border-amber-500/40 p-3 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                    Ideator Royalty (15%)
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold text-amber-400 font-mono">
                    +${creatorCommission.toLocaleString()} USD
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    To {idea.creator.name}
                  </div>
                </div>

                {/* Platform Creator 3% Commission */}
                <div className="rounded-xl bg-neutral-900/90 border border-sky-500/40 p-3 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300 block">
                    Platform Creator (3%)
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold text-sky-400 font-mono">
                    +${platformCommission.toLocaleString()} USD
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Tech discovery bridge
                  </div>
                </div>

                {/* Tech Builder 82% Operating Share */}
                <div className="rounded-xl bg-neutral-900/90 border border-neutral-700 p-3 text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300 block">
                    Builder Share (82%)
                  </span>
                  <div className="text-lg sm:text-xl font-extrabold text-neutral-200 font-mono">
                    +${builderShare.toLocaleString()} USD
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Production & ops
                  </div>
                </div>
              </div>
            </div>

            {/* Simulation of Real Market Sales */}
            <div className="mt-4 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-neutral-300 flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-amber-400" />
                <span>Simulate customer orders to trigger automated 15% Ideator & 3% Platform payouts:</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleSimulate(500)}
                  className="rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-colors"
                >
                  +$500 (+$75 / +$15)
                </button>
                <button
                  onClick={() => handleSimulate(2500)}
                  className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-3 py-1.5 text-xs font-bold text-neutral-950 transition-colors"
                >
                  +$2,500 (+$375 / +$75)
                </button>
                <button
                  onClick={() => handleSimulate(10000)}
                  className="rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-xs font-bold text-neutral-950 transition-colors"
                >
                  +$10,000 (+$1,500 / +$300)
                </button>
              </div>
            </div>
          </div>

          {/* Dual Columns: Creator Expressing Idea & Production Milestones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Creator Idea Expansion & Advisory Thread */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-neutral-200 uppercase tracking-wider flex items-center gap-2">
                  <FileText className="h-4 w-4 text-amber-400" />
                  Creator Co-Production & Idea Depth
                </h3>
                <button
                  onClick={handleAIBrainstorm}
                  disabled={isExpanding}
                  className="flex items-center gap-1 text-xs font-semibold text-amber-400 hover:text-amber-300 disabled:opacity-50"
                >
                  <Sparkles className={`h-3.5 w-3.5 ${isExpanding ? "animate-spin" : ""}`} />
                  <span>{isExpanding ? "Analyzing..." : "AI Production Roadmap"}</span>
                </button>
              </div>

              {/* Advisory notes feed */}
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

              {/* Add Note Input */}
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

            {/* Right: Production Milestones & AI Go-To-Market Plan */}
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
                    <div className="font-semibold text-neutral-200">1. Contract Executed & Escrow Locked</div>
                    <div className="text-[11px] text-neutral-400">15% Perpetual Sales Commission legally bound</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-xs">
                    ✓
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-200">2. Creator Consultation & Prototype CAD</div>
                    <div className="text-[11px] text-neutral-400">Specifications reviewed with {idea.creator.name}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 font-bold text-xs">
                    3
                  </div>
                  <div>
                    <div className="font-semibold text-amber-300">3. Commercial Production & Distribution</div>
                    <div className="text-[11px] text-neutral-400">Active market sales generated across channels</div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-neutral-400 font-bold text-xs">
                    4
                  </div>
                  <div>
                    <div className="font-semibold text-neutral-400">4. Automated Monthly Payouts</div>
                    <div className="text-[11px] text-neutral-500">15% calculated on each monthly sales statement</div>
                  </div>
                </div>
              </div>

              {/* AI GTM Output if generated */}
              {aiRoadmap && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs space-y-2">
                  <div className="font-bold text-amber-300">AI Suggested Commercialization Vectors:</div>
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
            Contract ID: <span className="font-mono text-neutral-300">{idea.contract?.id || "CON-74291-ACTIVE"}</span>
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
