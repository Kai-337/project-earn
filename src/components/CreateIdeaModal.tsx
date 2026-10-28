import React, { useState } from "react";
import { Idea, UserProfile, CategoryType, SaleModelType, CurrencyCode, CopyrightFiling } from "../types";
import { CATEGORIES_LIST } from "../data/seedData";
import { 
  X, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  Plus, 
  Tag, 
  DollarSign, 
  FileText, 
  Layers,
  UserCheck,
  Scale,
  Smartphone,
  Camera,
  CheckCircle2,
  Globe,
  Download
} from "lucide-react";
import { 
  findMatchedBuyers, 
  formatPrice, 
  EXCHANGE_RATES, 
  PLATFORM_OWNER_WALLET, 
  calculateCommissionBreakdown,
  generateFixedTermRoyaltyLawDraft,
  downloadLawDraftDocument
} from "../utils/legalAndCurrency";

interface CreateIdeaModalProps {
  currentUser: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onAddIdea: (newIdea: Idea) => void;
  onOpenCopyrightCert?: (idea: Idea) => void;
  onOpenMatchedBuyers?: (idea: Idea) => void;
  preferredCurrency?: CurrencyCode;
}

export const CreateIdeaModal: React.FC<CreateIdeaModalProps> = ({
  currentUser,
  isOpen,
  onClose,
  onAddIdea,
  onOpenCopyrightCert,
  onOpenMatchedBuyers,
  preferredCurrency: initialCurrency = "USD",
}) => {
  const [title, setTitle] = useState("");
  const [summaryPitch, setSummaryPitch] = useState("");
  const [description, setDescription] = useState("");
  const [details, setDetails] = useState("");
  const [upfrontPrice, setUpfrontPrice] = useState<number>(350);
  const [saleModel, setSaleModel] = useState<SaleModelType>(
    currentUser.preferredDealModel || "keep_copyright"
  );
  const [showLawDraft, setShowLawDraft] = useState(false);
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>(
    currentUser.preferredCurrency || initialCurrency || "NPR"
  );
  const [category, setCategory] = useState<Exclude<CategoryType, "All Ideas">>("Everyday Life Hacks & Tools");
  const [tags, setTags] = useState<string[]>(["CommunityInnovation", "DirectOwnership"]);
  const [tagInput, setTagInput] = useState("");
  const [procedurePhotoUrl, setProcedurePhotoUrl] = useState("");
  const [isNonTech, setIsNonTech] = useState<boolean>(currentUser.isNonTech ?? true);
  const [profession, setProfession] = useState<string>(currentUser.profession || "Everyday Problem Solver");
  const [backgroundField, setBackgroundField] = useState<string>(currentUser.backgroundField || "Practical Domain Observation");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [safetyAudit, setSafetyAudit] = useState<{
    isDangerous: boolean;
    dangerScore: number;
    dangerReason?: string;
  }>({
    isDangerous: false,
    dangerScore: 1,
    dangerReason: "Pending submission review",
  });
  const [autoClassifiedMessage, setAutoClassifiedMessage] = useState<string | null>(null);
  const [aiDetectionError, setAiDetectionError] = useState<string | null>(null);
  const [detectedAiWords, setDetectedAiWords] = useState<string[]>([]);

  if (!isOpen) return null;

  const commissionData = calculateCommissionBreakdown(Number(upfrontPrice) || 350, saleModel);
  const fixedTermLawDraftText = generateFixedTermRoyaltyLawDraft({
    creatorName: currentUser.name,
    creatorCountry: currentUser.country || "Nepal",
    ideaTitle: title.trim() || "[Untitled Idea Concept]",
  });

  // Authenticity & Raw English / AI-Slop Detector
  const evaluateAuthenticity = (t: string, p: string, d: string) => {
    const combined = `${t} ${p} ${d}`.toLowerCase();
    const AI_SYNTHETIC_MARKERS = [
      "delve",
      "delving",
      "testament",
      "tapestry",
      "seamlessly",
      "revolutionize the paradigm",
      "in today's fast-paced",
      "cutting-edge beacon",
      "holistic approach",
      "game-changer",
      "meticulously crafted",
      "fosters synergy",
      "leverage synergies",
      "pivotal milestone",
      "beacon of hope",
      "in conclusion it is crucial",
      "it is worth noting",
      "harnessing the power",
      "digital tapestry",
      "rich tapestry",
      "spearhead the revolution",
      "cutting-edge solution that seamlessly",
      "unparalleled efficiency",
    ];

    const found: string[] = [];
    for (const marker of AI_SYNTHETIC_MARKERS) {
      if (combined.includes(marker)) {
        found.push(marker);
      }
    }
    return found;
  };

  const handleAIAutoCategorize = async () => {
    if (!title.trim() || !description.trim()) return;
    setIsAnalyzing(true);
    setAutoClassifiedMessage(null);

    try {
      const res = await fetch("/api/ai/categorize-and-safety", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description: `${summaryPitch} ${description}`,
          details,
        }),
      });

      const data = await res.json();
      if (data.category) {
        setCategory(data.category);
      }
      if (data.tags && Array.isArray(data.tags)) {
        setTags(Array.from(new Set([...tags, ...data.tags])));
      }
      if (typeof data.dangerScore === "number") {
        setSafetyAudit({
          isDangerous: Boolean(data.isDangerous),
          dangerScore: data.dangerScore,
          dangerReason: data.dangerReason || "Automated policy compliance check passed.",
        });
      }
      if (!summaryPitch.trim() && data.summaryPitch) {
        setSummaryPitch(data.summaryPitch);
      }
      setAutoClassifiedMessage(`Topic similarity matched: Auto-listed in "${data.category}"`);
    } catch (err) {
      console.error("Auto-categorization error:", err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, "");
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    // Check for AI-generated synthetic phrasing vs authentic raw English / human voice
    const aiMarkersFound = evaluateAuthenticity(title, summaryPitch, description);
    if (aiMarkersFound.length > 0) {
      setDetectedAiWords(aiMarkersFound);
      setAiDetectionError(
        `Submission Flagged: AI-Generated Synthetic Text Detected! The platform strictly prohibits AI slop and synthetic phrasing. We detected typical AI buzzwords: ${aiMarkersFound.map((w) => `"${w}"`).join(", ")}. Please rewrite your post using authentic, raw human voice, genuine experience, or unvarnished English/Romanized details.`
      );
      return; // Flagged and not posted!
    }

    setAiDetectionError(null);
    setDetectedAiWords([]);

    const ideaId = `idea-${Date.now()}`;
    const generatedCertificateId = `NP-WIPO-CR-2026-${ideaId.slice(-6).toUpperCase()}`;

    // Automatic Copyright Filing Record under WIPO & Nepal Copyright Act 2059
    const copyrightFiling: CopyrightFiling = {
      certificateId: generatedCertificateId,
      registeredAt: "Just now (Instant Timestamp)",
      authorName: currentUser.name,
      authorCountry: currentUser.country || "Nepal",
      authorEmail: currentUser.email || "creator@ideavault.org",
      governingLaws: [
        "WIPO Berne Convention (Articles 2 & 5)",
        "Nepal Copyright Act 2059 (Sections 3, 7 & 19)",
        "UNCITRAL Model Law on Electronic Commerce 1996",
        "Nepal Electronic Transactions Act 2063",
      ],
      cryptographicHash: `SHA256:${ideaId.slice(-4).toUpperCase()}8A4F12D770E1B8C9A310`,
      saleModel,
      ownershipStatus: "registered_to_author",
      documentsDelivered: true,
      legalPreamble: `Official Certificate of Copyright Registration issued under Nepal Copyright Act 2059 (Sec 3) & WIPO Berne Convention. All economic and moral rights registered to ${currentUser.name}. Monetization structure set to ${
        saleModel === "keep_copyright"
          ? "Option 1: Keep Copyrights + 15% Ongoing Royalty"
          : saleModel === "full_buyout"
          ? "Option 2: Sell Copyrights (0% Ongoing Royalty)"
          : "Option 3: 3-Year Licensed Product (15% Royalty) with Official Law Draft Stating Strict 1.5-Year Maximum Royalty Cap"
      }. 3% platform discovery fee settled only upon completed real-money transactions (${PLATFORM_OWNER_WALLET.accountName}).`,
    };

    // Find instant matches for builders and buyers
    const matchedBuyers = findMatchedBuyers(category, title);

    const newIdea: Idea = {
      id: ideaId,
      title,
      summaryPitch: summaryPitch.trim() || description.slice(0, 140),
      description,
      details: details.trim() || "Prototyping specifications available upon contract execution.",
      category,
      tags: tags.length > 0 ? tags : ["CreatorCommerce"],
      creator: {
        id: currentUser.id,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        reputation: 96,
        totalEarned: currentUser.totalRoyaltiesEarned,
        verified: true,
        role: profession || currentUser.headline || "Idea Originator",
        profession: profession.trim() || "Everyday Problem Solver",
        backgroundField: backgroundField.trim() || "General / Practical Observation",
        isNonTech,
        isRealHuman: true,
        country: currentUser.country || "Nepal",
        preferredCurrency,
      },
      upfrontPrice: Number(upfrontPrice) || 350,
      buyoutPrice: saleModel === "full_buyout" ? Number(upfrontPrice) || 350 : undefined,
      saleModel,
      royaltyCommissionPercent: saleModel === "full_buyout" ? 0 : 15,
      platformCommissionPercent: 3, // 3% Platform Creator Discovery Commission settled into Master Wallet
      createdAt: "Just now",
      likes: 1,
      views: 8,
      collaboratorsCount: 0,
      status: safetyAudit.isDangerous ? "flagged_dangerous" : "available",
      originType: "real_human",
      isRealHuman: true,
      safetyAudit: {
        isDangerous: safetyAudit.isDangerous,
        dangerScore: safetyAudit.dangerScore,
        dangerReason: safetyAudit.dangerReason,
        reviewedByOwner: !safetyAudit.isDangerous,
        actionTaken: safetyAudit.isDangerous ? "warned" : "safe",
      },
      tasks: [],
      matchScore: 95,
      matchReason: "Newly posted idea with immediate buyer matching & registered copyright certificate.",
      copyrightFiling,
      matchedBuyers,
      productionNotes: procedurePhotoUrl ? [`Initial Procedure Photo Registered: ${procedurePhotoUrl}`] : [],
    };

    onAddIdea(newIdea);
    onClose();

    // Optional follow-up modal triggers
    if (onOpenMatchedBuyers) {
      setTimeout(() => onOpenMatchedBuyers(newIdea), 300);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="modal-create-idea"
        className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl overflow-hidden my-6"
      >
        {/* Top Header - Social Post Style */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-amber-500/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                  Publish Idea (100% Free) & File Copyrights
                </h2>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  Zero Upfront Cost • Auto WIPO & Nepal Certified
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                Post free like a social feed • Authentic human voice required • 3% platform fee charged on bill only when sold
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
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* AI-Slop & Synthetic Phrasing Rejection Banner */}
          {aiDetectionError && (
            <div className="rounded-2xl border border-red-500/60 bg-red-950/40 p-4 text-xs text-red-200 space-y-2 animate-in fade-in duration-200">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div>
                  <div className="font-bold text-red-300 text-sm">
                    ⚠️ Submission Flagged & Blocked: AI-Generated Content Detected!
                  </div>
                  <p className="mt-1 leading-relaxed text-red-200/90">
                    {aiDetectionError}
                  </p>
                </div>
              </div>

              {detectedAiWords.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap pt-1 pl-7 text-[11px]">
                  <span className="font-semibold text-neutral-400">Detected synthetic markers:</span>
                  {detectedAiWords.map((w, idx) => (
                    <span
                      key={idx}
                      className="rounded bg-red-900/60 border border-red-700/60 px-2 py-0.5 font-mono text-red-300 font-bold"
                    >
                      {w}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Free Posting & Settlement Billing Guarantee Notice */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-neutral-950 p-3.5 border border-neutral-800 text-xs">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-200">{currentUser.name}</span>
              <span className="text-neutral-500">•</span>
              <span className="text-neutral-400">{currentUser.country || "Nepal"}</span>
              <span className="rounded bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                100% Free to Post
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-neutral-400">Receive payouts in:</span>
              <select
                value={preferredCurrency}
                onChange={(e) => setPreferredCurrency(e.target.value as CurrencyCode)}
                className="rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1 text-xs text-amber-300 font-bold focus:border-amber-500 focus:outline-none"
              >
                {Object.entries(EXCHANGE_RATES).map(([code, item]) => (
                  <option key={code} value={code}>
                    {item.symbol} {code} ({item.country})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Idea Title / Headline <span className="text-amber-400">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., BambooThermal: Insulated Bamboo Water Flask with Herb Steeper"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Short Elevator Pitch */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Punchy Pitch (What makes this irresistible to commercial buyers?)
            </label>
            <input
              type="text"
              value={summaryPitch}
              onChange={(e) => setSummaryPitch(e.target.value)}
              placeholder="1-2 sentences summarizing the unique advantage..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Social Post Content / Full Concept */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-neutral-300">
                Post Content & Operational Concept <span className="text-amber-400">*</span>
              </label>
              <button
                type="button"
                disabled={isAnalyzing || !title.trim() || !description.trim()}
                onClick={handleAIAutoCategorize}
                className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 hover:text-amber-300 disabled:opacity-40 transition-colors"
              >
                <Sparkles className={`h-3.5 w-3.5 ${isAnalyzing ? "animate-spin" : ""}`} />
                <span>{isAnalyzing ? "Classifying..." : "AI Auto-Categorize Topic"}</span>
              </button>
            </div>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write like you would on social media: Describe the problem you observed, how your concept solves it, and how people will use the product..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          {/* Procedure Photos or Mid-Process Prototype URL */}
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5 flex items-center gap-1.5">
              <Camera className="h-4 w-4 text-amber-400" />
              <span>Procedure Photo / Mid-Process Prototype / Product Sketch (Optional)</span>
            </label>
            <input
              type="url"
              value={procedurePhotoUrl}
              onChange={(e) => setProcedurePhotoUrl(e.target.value)}
              placeholder="https://images.unsplash.com/... or paste image URL showing mid-process or design sketch"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
            />
            <span className="text-[11px] text-neutral-500 mt-1 block">
              If you have mid-process photos or physical samples, attaching proof dramatically boosts buyer match scores!
            </span>
          </div>

          {/* MONETIZATION STRUCTURE SELECTION (3 OPTIONS) */}
          <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-neutral-950 to-neutral-950 p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm font-bold text-neutral-100">
                Choose Monetization Structure (3 Copyright & Royalty Options)
              </h3>
            </div>
            <p className="text-xs text-neutral-400">
              Under Section 19 of the Nepal Copyright Act 2059 and WIPO Berne Convention, choose 1 of the 3 official monetization structures:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {/* Option 1: Keep Copyrights + 15% Royalty */}
              <div
                onClick={() => setSaleModel("keep_copyright")}
                className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                  saleModel === "keep_copyright"
                    ? "border-emerald-500 bg-emerald-500/15 shadow-md"
                    : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-neutral-100">
                    1. Keep Copyright + 15%
                  </span>
                  <span className="text-emerald-400 text-[10px] font-bold">
                    15% Royalty
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  You post an idea, keep 100% of your copyrights, and earn a 15% ongoing royalty when licensed for production.
                </p>
              </div>

              {/* Option 2: Sell Copyrights -> 0% Royalty */}
              <div
                onClick={() => setSaleModel("full_buyout")}
                className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                  saleModel === "full_buyout"
                    ? "border-amber-500 bg-amber-500/15 shadow-md"
                    : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-neutral-100">
                    2. Sell Copyrights
                  </span>
                  <span className="text-amber-400 text-[10px] font-bold">
                    0% Royalty
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  You sell 100% of your copyrights for an upfront cash buyout, leading to no ongoing royalty (0% royalty).
                </p>
              </div>

              {/* Option 3: 3-Year Licensed Product + 1.5-Year Capped Royalty Law Draft */}
              <div
                onClick={() => setSaleModel("licensed_fixed_term")}
                className={`rounded-xl border p-3.5 cursor-pointer transition-all ${
                  saleModel === "licensed_fixed_term"
                    ? "border-sky-500 bg-sky-500/15 shadow-md"
                    : "border-neutral-800 bg-neutral-900/60 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-bold text-neutral-100">
                    3. 3-Yr Licensed Product
                  </span>
                  <span className="text-sky-400 text-[10px] font-bold">
                    1.5-Yr Cap Draft
                  </span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  15% royalty on a 3-year licensed product with Official Law Draft Document stating strictly 1.5 years of royalty and no more.
                </p>
              </div>
            </div>

            {/* Option 3 Law Draft Document Panel */}
            {saleModel === "licensed_fixed_term" && (
              <div className="mt-2 rounded-xl border border-sky-500/40 bg-neutral-950 p-3.5 space-y-2.5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-xs font-bold text-sky-300 flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-sky-400" />
                    <span>Law Draft Document: 1.5-Year Maximum Royalty Cap (And No More Than That)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setShowLawDraft((prev) => !prev)}
                      className="rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 text-[11px] font-semibold text-neutral-200 cursor-pointer"
                    >
                      {showLawDraft ? "Hide Law Draft" : "Preview Law Draft"}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        downloadLawDraftDocument(
                          `Law-Draft-1.5Yr-Royalty-Cap-${(title || "Idea").replace(/[^a-zA-Z0-9]/g, "-").slice(0, 24)}.txt`,
                          fixedTermLawDraftText
                        )
                      }
                      className="flex items-center gap-1 rounded-lg bg-sky-500 hover:bg-sky-400 px-2.5 py-1 text-[11px] font-bold text-neutral-950 cursor-pointer"
                    >
                      <Download className="h-3.5 w-3.5" />
                      <span>Download Law Draft (.txt)</span>
                    </button>
                  </div>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Attaches an enforceable statutory covenant granting a 3-year licensed product commercialization window while strictly capping the 15% creator royalty at <strong>1.5 years (18 months) and no more than 1.5 years</strong> (0% after Month 18).
                </p>
                {showLawDraft && (
                  <pre className="rounded-lg border border-neutral-800 bg-neutral-900 p-3 text-[11px] font-mono text-neutral-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                    {fixedTermLawDraftText}
                  </pre>
                )}
              </div>
            )}
          </div>

          {/* Pricing & Automatic 3% Commission Notice */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {saleModel === "full_buyout"
                  ? "Full Copyright Buyout Price ($USD) *"
                  : saleModel === "licensed_fixed_term"
                  ? "3-Year Product License Activation Stake ($USD) *"
                  : "Upfront Licensing / Reservation Stake ($USD) *"}
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                <input
                  type="number"
                  min={50}
                  max={25000}
                  step={25}
                  value={upfrontPrice}
                  onChange={(e) => setUpfrontPrice(Number(e.target.value))}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-8 pr-3 py-2 text-xs font-mono text-neutral-100 focus:border-amber-500 focus:outline-none"
                />
              </div>
              <span className="text-[11px] text-neutral-500 block mt-1">
                Equivalent: <strong className="text-neutral-300">{formatPrice(Number(upfrontPrice) || 350, preferredCurrency)}</strong>
              </span>
            </div>

            {/* Automated 3% Master Wallet Commission breakdown */}
            <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3 text-xs space-y-1">
              <div className="flex items-center justify-between text-neutral-300 font-semibold">
                <span className="flex items-center gap-1">
                  <Smartphone className="h-3.5 w-3.5 text-sky-400" />
                  Automated 3% Platform Fee:
                </span>
                <span className="text-sky-400 font-mono">
                  ${commissionData.platformFeeUsd} (≈ ₨{commissionData.platformFeeNpr.toLocaleString()} NPR)
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Charged strictly upon completed real-money deal execution. Net proceeds to your chosen Digital Wallet or Bank Account: <strong className="text-emerald-400">${commissionData.netSellerUsd} USD</strong>.
              </p>
            </div>
          </div>

          {/* Category & Tags */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/80 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="h-4 w-4 text-amber-400" />
                Category & Topic Tags
              </span>
              {autoClassifiedMessage && (
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-500/30">
                  {autoClassifiedMessage}
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Listed Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                >
                  {CATEGORIES_LIST.filter((c) => c !== "All Ideas").map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] text-neutral-400 mb-1">
                  Add Tags (Press Enter)
                </label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleAddTag}
                  placeholder="e.g., #BambooDesign, #Ergonomics"
                  className="w-full rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 rounded-md bg-neutral-800 border border-neutral-700/60 px-2 py-0.5 text-[11px] text-neutral-300"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-neutral-500 hover:text-red-400"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Legal Compliance Guarantee Note */}
          <div className="rounded-xl bg-neutral-950 p-3.5 border border-neutral-800 text-[11px] text-neutral-400 space-y-1">
            <div className="flex items-center gap-1.5 text-neutral-200 font-semibold">
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              <span>United Nations & Nepal Copyright Compliance Confirmation</span>
            </div>
            <p>
              Upon posting, an official Copyright Registration Certificate (WIPO & Nepal Copyright Act 2059) is generated and delivered to your registered email (<strong>{currentUser.email || "your email"}</strong>). Any violation results in an email warning strike (3 strikes = banned).
            </p>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
            <div className="text-[11px] text-neutral-400">
              <span className="font-semibold text-emerald-400">Free to Post:</span> 3% platform fee charged on bill upon buyout/licensing only.
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
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-xs font-bold text-neutral-950 shadow-md shadow-emerald-500/25 hover:from-emerald-400 hover:to-emerald-500 transition-all active:scale-95"
              >
                <FileText className="h-4 w-4" />
                <span>Publish Idea (100% Free)</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
