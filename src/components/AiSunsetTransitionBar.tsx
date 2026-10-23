import React from "react";
import { 
  UserCheck, 
  Bot, 
  Sparkles, 
  ShieldCheck, 
  Plus, 
  RotateCcw, 
  CheckCircle2,
  TrendingDown,
  Info
} from "lucide-react";
import { isSitePublishedLive } from "../utils/syncEngine";

interface AiSunsetTransitionBarProps {
  realHumanCount: number;
  totalAiCount: number;
  visibleAiCount: number;
  aiDisappearancePercent: number;
  humanPostsAddedCount: number;
  feedFilter: "all" | "real_humans" | "ai_seeds";
  onSetFeedFilter: (filter: "all" | "real_humans" | "ai_seeds") => void;
  onSimulateRealHumanPost: () => void;
  onResetTransition: () => void;
  onOpenCreateIdea: () => void;
}

export const AiSunsetTransitionBar: React.FC<AiSunsetTransitionBarProps> = ({
  realHumanCount,
  totalAiCount,
  visibleAiCount,
  aiDisappearancePercent,
  humanPostsAddedCount,
  feedFilter,
  onSetFeedFilter,
  onSimulateRealHumanPost,
  onResetTransition,
  onOpenCreateIdea,
}) => {
  const isPublished = isSitePublishedLive();
  const isFullyHuman = aiDisappearancePercent >= 100 || visibleAiCount === 0;

  return (
    <div 
      id="ai-sunset-transition-widget"
      className="rounded-2xl border border-neutral-800 bg-gradient-to-br from-neutral-900 via-neutral-900/95 to-neutral-950 p-5 shadow-xl transition-all"
    >
      {/* Top Banner: Core Policy & Intent */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-800/80 pb-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <UserCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap text-xs text-emerald-400 font-semibold">
              <span>1-for-1 Organic AI Removal Engine</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-emerald-300">Free Posting · 1 Human Post = 1 AI Post Removed</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-neutral-100 tracking-tight mt-0.5">
              Launch AI Seeds & Automatic 1-to-1 Replacement
            </h2>
            <p className="text-xs text-neutral-400 mt-0.5 max-w-2xl leading-relaxed">
              Before live publication, strictly 0 external human accounts and 0 human payments exist—only the 18 transparent AI launch seeds are shown. Once published live, <strong>as 1 real person posts, 1 AI seed is automatically removed</strong>.
            </p>
          </div>
        </div>

        {/* Action button: Free to post */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            id="btn-post-idea-free"
            onClick={onOpenCreateIdea}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 px-4 py-2.5 text-xs font-bold text-neutral-950 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Post Idea (100% Free)</span>
          </button>
        </div>
      </div>

      {/* 1-to-1 Live Telemetry Bar */}
      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-neutral-300">AI Seeds Removed:</span>
            <span className="font-mono tabular-nums font-bold text-amber-400">
              {Math.min(18, humanPostsAddedCount)} of 18 Removed
            </span>
            <span className="text-neutral-500 tabular-nums">({visibleAiCount} AI Seeds Active)</span>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono tabular-nums">
            <span className="text-emerald-400 font-medium">
              {realHumanCount} Real Human Ideas
            </span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-violet-400 font-medium">
              {visibleAiCount} Active AI Seeds
            </span>
          </div>
        </div>

        {/* Dynamic Progress Meter */}
        <div className="relative w-full h-3 bg-neutral-950 rounded-full overflow-hidden border border-neutral-800">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.min(100, Math.round((Math.min(18, humanPostsAddedCount) / 18) * 100))}%` }}
          />
        </div>

        {isFullyHuman ? (
          <div className="rounded-xl bg-emerald-950/50 border border-emerald-500/40 p-3 text-xs text-emerald-200 flex items-center justify-between gap-3 mt-3">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
              <span>
                <strong>100% Organic Maturity Achieved:</strong> All AI seeds have completely retired. The marketplace is powered by real human creators.
              </span>
            </div>
            <button
              onClick={onResetTransition}
              className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-emerald-100 underline shrink-0"
            >
              <RotateCcw className="h-3 w-3" />
              Reset
            </button>
          </div>
        ) : (
          <div className="text-[11px] text-neutral-400 flex items-center justify-between gap-2 pt-1">
            <span className="flex items-center gap-1 text-neutral-400">
              <Info className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              {isPublished
                ? "1-for-1 rule: Each verified human post automatically removes 1 AI seed post."
                : "Pre-launch status: Site not published yet — 0 human posts & 0 human payments."}
            </span>
            <div className="flex items-center gap-2">
              {isPublished && (
                <button
                  id="btn-simulate-real-post"
                  onClick={onSimulateRealHumanPost}
                  className="flex items-center gap-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 text-[11px] font-semibold text-amber-300 border border-neutral-700 active:scale-95 transition-all"
                >
                  <Plus className="h-3 w-3" />
                  Add Sample Post (-1 AI Seed)
                </button>
              )}
              {humanPostsAddedCount > 0 && (
                <button
                  onClick={onResetTransition}
                  className="flex items-center gap-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-2 py-1 text-[11px] text-neutral-400 hover:text-neutral-200 border border-neutral-700"
                  title="Reset to initial launch state with 18 AI seeds"
                >
                  <RotateCcw className="h-3 w-3" />
                  Reset (18 Seeds)
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Filter Tabs: All / Real Humans Only / AI Seeds */}
      <div className="mt-4 pt-3.5 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-xl bg-neutral-950 p-1 border border-neutral-800 text-xs">
          <button
            onClick={() => onSetFeedFilter("all")}
            className={`rounded-lg px-3 py-1 font-semibold transition-all ${
              feedFilter === "all"
                ? "bg-neutral-800 text-neutral-100 shadow-sm"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            All Active Ideas ({realHumanCount + visibleAiCount})
          </button>
          <button
            onClick={() => onSetFeedFilter("real_humans")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-semibold transition-all ${
              feedFilter === "real_humans"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-emerald-400 hover:text-emerald-300"
            }`}
          >
            <UserCheck className="h-3.5 w-3.5" />
            <span>Real Humans Only ({realHumanCount})</span>
          </button>
          <button
            onClick={() => onSetFeedFilter("ai_seeds")}
            disabled={visibleAiCount === 0}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1 font-semibold transition-all ${
              feedFilter === "ai_seeds"
                ? "bg-violet-600 text-white shadow-sm"
                : visibleAiCount === 0
                ? "text-neutral-600 cursor-not-allowed"
                : "text-violet-400 hover:text-violet-300"
            }`}
          >
            <Bot className="h-3.5 w-3.5" />
            <span>AI Seeds ({visibleAiCount} active)</span>
          </button>
        </div>

        <div className="text-[11px] text-neutral-500 italic">
          Transparent AI seeds are available for real humans to claim & monetize with 15% royalties.
        </div>
      </div>
    </div>
  );
};
