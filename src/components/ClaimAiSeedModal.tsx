import React, { useState } from "react";
import { Idea, UserProfile } from "../types";
import { 
  X, 
  UserCheck, 
  Sparkles, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Briefcase,
  FileSignature
} from "lucide-react";

interface ClaimAiSeedModalProps {
  idea: Idea | null;
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onClaimSuccess: (updatedIdea: Idea) => void;
}

export const ClaimAiSeedModal: React.FC<ClaimAiSeedModalProps> = ({
  idea,
  currentUser,
  isOpen,
  onClose,
  onClaimSuccess,
}) => {
  if (!isOpen || !idea) return null;

  const [humanPerspective, setHumanPerspective] = useState("");
  const [profession, setProfession] = useState(currentUser.profession || "Domain Specialist");
  const [upfrontPrice, setUpfrontPrice] = useState<number>(idea.upfrontPrice);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const updatedIdea: Idea = {
      ...idea,
      originType: "real_human",
      isRealHuman: true,
      creator: {
        id: currentUser.id,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        reputation: 96,
        totalEarned: currentUser.totalRoyaltiesEarned,
        verified: true,
        role: profession || currentUser.headline || "Verified Real Human Creator",
        profession: profession || currentUser.profession || "Verified Real Creator",
        backgroundField: currentUser.backgroundField || "Real World Industry Experience",
        isNonTech: currentUser.isNonTech ?? true,
      },
      upfrontPrice,
      description: `${idea.description}\n\n[Human Domain Expertise Added by ${currentUser.name} (${profession})]: ${humanPerspective || "Adopted and validated from real-world workflow requirements."}`,
      productionNotes: [
        ...(idea.productionNotes || []),
        `Originally seeded by AI Spark; Adopted & humanized by ${currentUser.name} (${profession}) with full 15% royalty contract rights.`,
      ],
      aiSeedInfo: {
        ...(idea.aiSeedInfo || {
          isAiPosingAsAi: true,
          botName: "IdeaVault AI Spark",
          decayIndex: 0,
          lureHook: "AI seed adopted by human",
          openForAdoption: false,
        }),
        openForAdoption: false,
        claimedByHuman: true,
        claimedByHumanName: currentUser.name,
      },
    };

    setTimeout(() => {
      setIsSubmitting(false);
      onClaimSuccess(updatedIdea);
      onClose();
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="modal-claim-ai-seed"
        className="relative w-full max-w-2xl rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <UserCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                  Adopt & Expand Seed with Practical Insight
                </h2>
                <span className="rounded-md bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                  Practical Domain Addition
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Transform synthetic AI spark into an authentic human-led commercial venture with 15% royalty
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Original AI Seed summary banner */}
          <div className="rounded-xl bg-violet-950/40 border border-violet-800/40 p-3.5 text-xs text-violet-200">
            <div className="flex items-center gap-2 font-bold text-violet-300 mb-1">
              <Bot className="h-4 w-4" />
              <span>Target AI Concept: {idea.title}</span>
            </div>
            <p className="text-neutral-300 line-clamp-2 leading-relaxed">
              {idea.summaryPitch}
            </p>
            {idea.aiSeedInfo?.lureHook && (
              <div className="mt-2 text-[11px] text-violet-400/90 font-mono">
                Lure Target: {idea.aiSeedInfo.lureHook}
              </div>
            )}
          </div>

          {/* Real Human Creator Info */}
          <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-800 space-y-3">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
              <UserCheck className="h-3.5 w-3.5" />
              Claiming As Verified Real Human Creator
            </div>

            <div className="flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-10 w-10 rounded-full object-cover ring-2 ring-emerald-500/50"
              />
              <div>
                <div className="text-sm font-bold text-neutral-100">{currentUser.name}</div>
                <div className="text-xs text-neutral-400">{currentUser.handle} • Real Human Creator</div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Your Real-World Profession / Domain <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                required
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                placeholder="e.g. ICU Nurse, Civil Contractor, Agronomist, High School Physics Teacher"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Practical Human Insights */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Your Real-World Human Insight & Practical Adaptations <span className="text-amber-400">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={humanPerspective}
              onChange={(e) => setHumanPerspective(e.target.value)}
              placeholder="Explain how your real-world experience improves this idea (e.g. 'In clinical practice, patients will require this to be waterproof and under 2 lbs...' or 'On construction sites, this needs to withstand heavy vibration...')"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-emerald-500 focus:outline-none leading-relaxed"
            />
          </div>

          {/* Upfront License Fee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Upfront License Stake (USD)
              </label>
              <input
                type="number"
                min={50}
                max={50000}
                value={upfrontPrice}
                onChange={(e) => setUpfrontPrice(Number(e.target.value))}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs sm:text-sm font-mono text-neutral-100 focus:border-emerald-500 focus:outline-none"
              />
            </div>

            <div className="rounded-xl bg-amber-950/20 border border-amber-800/30 p-3 text-xs text-amber-200">
              <span className="font-bold block text-amber-300 mb-0.5">15% Lifetime Royalty</span>
              Guaranteed by binding contract on all commercial sales once built by a tech producer.
            </div>
          </div>

          {/* 20% Sunsetting explanation */}
          <div className="rounded-xl bg-neutral-950 p-3 border border-neutral-800 text-[11px] text-neutral-400 leading-relaxed">
            <strong className="text-neutral-200">Notice:</strong> Claiming this AI seed converts it into a verified real human post. 
            This will immediately advance the community transition, <span className="text-amber-300 font-semibold">retiring 20% of remaining AI seeds</span> from the general feed.
          </div>

          {/* Submit CTA */}
          <div className="pt-3 border-t border-neutral-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !humanPerspective.trim()}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 px-5 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 shadow-lg shadow-emerald-500/20 disabled:opacity-50 active:scale-95 transition-all"
            >
              <FileSignature className="h-4 w-4" />
              <span>{isSubmitting ? "Converting Concept..." : "Adopt Concept & Apply Insight (15% Royalty)"}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
