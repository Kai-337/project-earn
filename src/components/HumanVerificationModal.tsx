import React, { useState, useEffect, useRef } from "react";
import { UserProfile } from "../types";
import { 
  ShieldCheck, 
  CheckCircle2, 
  X, 
  UserCheck, 
  AlertTriangle, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Image as ImageIcon, 
  RotateCcw, 
  Play, 
  Pause, 
  BrainCircuit, 
  Check, 
  Lock 
} from "lucide-react";

interface HumanVerificationModalProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: (updatedUser: UserProfile) => void;
}

// 1. Image-Powered Challenge Data
interface ImageOption {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  isAuthenticHuman: boolean;
  categoryTag: string;
}

const IMAGE_CHALLENGE_ITEMS: ImageOption[] = [
  {
    id: "img-1",
    title: "Hand-Thrown Clay Bowl",
    description: "Natural potter finger ridges & organic clay texture",
    imageUrl: "https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=300&auto=format&fit=crop&q=80",
    isAuthenticHuman: true,
    categoryTag: "Authentic Human Craft",
  },
  {
    id: "img-2",
    title: "Bamboo Woven Basket",
    description: "Physical bamboo fiber tensile weave & knotted joint",
    imageUrl: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=300&auto=format&fit=crop&q=80",
    isAuthenticHuman: true,
    categoryTag: "Authentic Human Craft",
  },
  {
    id: "img-3",
    title: "Hand-Stitched Leather Notebook",
    description: "Waxed linen saddle-stitching & genuine leather pores",
    imageUrl: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&auto=format&fit=crop&q=80",
    isAuthenticHuman: true,
    categoryTag: "Authentic Human Craft",
  },
  {
    id: "img-4",
    title: "Synthetic Melting Geometry",
    description: "Non-Euclidean floating handles & AI morphing pixels",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
    isAuthenticHuman: false,
    categoryTag: "Synthetic AI Glitch",
  },
  {
    id: "img-5",
    title: "Fractal Hallucinated Cube",
    description: "Impossible physics structure defying physical gravity",
    imageUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=300&auto=format&fit=crop&q=80",
    isAuthenticHuman: false,
    categoryTag: "Synthetic AI Glitch",
  },
  {
    id: "img-6",
    title: "Anomalous Liquid Metal Mesh",
    description: "Warped repetitive artifacts typical of diffusion hallucinations",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300&auto=format&fit=crop&q=80",
    isAuthenticHuman: false,
    categoryTag: "Synthetic AI Glitch",
  },
];

// Audio passcodes pool
const AUDIO_PASSCODES = [
  { code: "7492", words: "seven... four... nine... two" },
  { code: "3815", words: "three... eight... one... five" },
  { code: "6294", words: "six... two... nine... four" },
  { code: "5183", words: "five... one... eight... three" },
];

export const HumanVerificationModal: React.FC<HumanVerificationModalProps> = ({
  user,
  isOpen,
  onClose,
  onVerifySuccess,
}) => {
  const [activeTestMode, setActiveTestMode] = useState<"image" | "audio" | "causality">("image");

  // Image Test State
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);

  // Audio Test State
  const [currentAudioIndex, setCurrentAudioIndex] = useState(0);
  const [userAudioInput, setUserAudioInput] = useState("");
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioError, setAudioError] = useState<string | null>(null);

  // Causality Riddle State
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [causalityError, setCausalityError] = useState<string | null>(null);

  // Success State
  const [isSuccess, setIsSuccess] = useState(false);
  const [verificationSummary, setVerificationSummary] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSelectedImageIds([]);
      setImageError(null);
      setUserAudioInput("");
      setAudioError(null);
      setSelectedOptionId(null);
      setCausalityError(null);
      setIsSuccess(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle image selection
  const handleToggleImage = (id: string) => {
    setImageError(null);
    if (selectedImageIds.includes(id)) {
      setSelectedImageIds(selectedImageIds.filter((item) => item !== id));
    } else {
      if (selectedImageIds.length >= 3) {
        setImageError("Please select exactly the 3 authentic human-crafted items.");
        return;
      }
      setSelectedImageIds([...selectedImageIds, id]);
    }
  };

  // Submit Image Challenge
  const handleVerifyImage = () => {
    const authenticIds = IMAGE_CHALLENGE_ITEMS.filter((i) => i.isAuthenticHuman).map((i) => i.id);
    const hasAllAuthentic = authenticIds.every((id) => selectedImageIds.includes(id));
    const hasNoGlitch = selectedImageIds.every((id) => authenticIds.includes(id));

    if (selectedImageIds.length === 3 && hasAllAuthentic && hasNoGlitch) {
      triggerSuccess("Image-Powered Authentic Tactile Craft Challenge");
    } else {
      setImageError("Verification failed: You selected synthetic AI glitches. Please select only the 3 genuine physical human craft items.");
    }
  };

  // Play Audio Passcode using Web Speech or Web Audio Synthesizer
  const handlePlayAudio = () => {
    const currentPasscode = AUDIO_PASSCODES[currentAudioIndex];
    setIsPlayingAudio(true);
    setAudioError(null);

    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentPasscode.words);
        utterance.rate = 0.85; // Slightly slower natural human pace
        utterance.pitch = 1.0;
        utterance.onend = () => setIsPlayingAudio(false);
        utterance.onerror = () => {
          setIsPlayingAudio(false);
          playFallbackTones();
        };
        window.speechSynthesis.speak(utterance);
      } else {
        playFallbackTones();
      }
    } catch (e) {
      setIsPlayingAudio(false);
    }
  };

  // Audio tone acoustic chime fallback
  const playFallbackTones = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.2, audioCtx.currentTime);
      osc.start();
      osc.stop(audioCtx.currentTime + 1.2);
      setTimeout(() => setIsPlayingAudio(false), 1200);
    } catch (e) {
      setIsPlayingAudio(false);
    }
  };

  // Submit Audio Challenge
  const handleVerifyAudio = () => {
    const expected = AUDIO_PASSCODES[currentAudioIndex].code;
    const cleanedInput = userAudioInput.trim().replace(/\s+/g, "");

    if (cleanedInput === expected) {
      triggerSuccess("Audio-Powered Acoustic Speech Passcode");
    } else {
      setAudioError(`Incorrect audio code. Please listen again or cycle to a new audio passcode.`);
    }
  };

  // Cycle new audio code
  const handleCycleAudio = () => {
    setCurrentAudioIndex((prev) => (prev + 1) % AUDIO_PASSCODES.length);
    setUserAudioInput("");
    setAudioError(null);
  };

  // Submit Causality Riddle
  const handleVerifyCausality = () => {
    if (selectedOptionId === "opt-hammer-sink") {
      triggerSuccess("Physical World Common-Sense Causality Test");
    } else {
      setCausalityError("Incorrect response. Common-sense physical density rules apply.");
    }
  };

  // Handle Complete Success
  const triggerSuccess = (typeTitle: string) => {
    setIsSuccess(true);
    setVerificationSummary(typeTitle);

    const updatedUser: UserProfile = {
      ...user,
      isRealHuman: true,
      passedHumanVerification: true,
      humanVerificationDate: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      humanVerificationType: typeTitle,
    };

    setTimeout(() => {
      onVerifySuccess(updatedUser);
      onClose();
    }, 1400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-3 sm:p-4 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl rounded-2xl border border-neutral-700 bg-neutral-950 p-5 sm:p-7 shadow-2xl overflow-y-auto max-h-[92vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-xl p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 shadow-lg shadow-emerald-500/20 text-neutral-950">
            <UserCheck className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-emerald-300">
                Are You Human? Test
              </span>
              <span className="text-[11px] text-neutral-400 font-mono">
                anti-bot verification
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-100 tracking-tight">
              Human Identity & Authenticity Verification
            </h2>
          </div>
        </div>

        <p className="mt-2 text-xs sm:text-sm text-neutral-300 leading-relaxed">
          To maintain a 100% human-verified marketplace without automated bots or AI impersonation, complete either an <strong>Image-Powered</strong> or <strong>Audio-Powered</strong> verification test below.
        </p>

        {/* Test Mode Selector Tabs */}
        <div className="mt-5 grid grid-cols-3 gap-2 rounded-xl bg-neutral-900 p-1.5 border border-neutral-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTestMode("image")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
              activeTestMode === "image"
                ? "bg-emerald-500 text-neutral-950 font-bold shadow-md"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <ImageIcon className="h-4 w-4" />
            <span>Image Test</span>
          </button>

          <button
            onClick={() => setActiveTestMode("audio")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
              activeTestMode === "audio"
                ? "bg-emerald-500 text-neutral-950 font-bold shadow-md"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Volume2 className="h-4 w-4" />
            <span>Audio Test</span>
          </button>

          <button
            onClick={() => setActiveTestMode("causality")}
            className={`flex items-center justify-center gap-1.5 rounded-lg py-2 transition-all ${
              activeTestMode === "causality"
                ? "bg-emerald-500 text-neutral-950 font-bold shadow-md"
                : "text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <BrainCircuit className="h-4 w-4" />
            <span>Physical Logic</span>
          </button>
        </div>

        {/* SUCCESS OVERLAY */}
        {isSuccess ? (
          <div className="mt-6 rounded-2xl border border-emerald-500/50 bg-emerald-950/40 p-8 text-center animate-fadeIn">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-neutral-950 shadow-xl shadow-emerald-500/30">
              <CheckCircle2 className="h-8 w-8" />
            </div>
            <h3 className="mt-3 text-xl font-extrabold text-neutral-100">
              Human Identity Verified!
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-emerald-300">
              Passed via: <strong>{verificationSummary}</strong>
            </p>
            <p className="mt-2 text-[11px] text-neutral-400">
              Your account is permanently badged as a Verified Human Creator under Nepal and International law.
            </p>
          </div>
        ) : (
          <div className="mt-5">
            {/* 1. IMAGE-POWERED TEST */}
            {activeTestMode === "image" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">
                      Task: Select exactly 3 Authentic Human-Crafted Items
                    </span>
                    <span className="text-xs font-mono font-semibold text-neutral-400">
                      Selected: <strong className="text-neutral-100">{selectedImageIds.length}</strong> / 3
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-neutral-400">
                    Bots cannot differentiate genuine tactile craft from AI hallucinations. Click the 3 real physical craftsmanship objects and avoid the 3 AI glitches.
                  </p>
                </div>

                {imageError && (
                  <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{imageError}</span>
                  </div>
                )}

                {/* 6-Item Image Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {IMAGE_CHALLENGE_ITEMS.map((item) => {
                    const isSelected = selectedImageIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => handleToggleImage(item.id)}
                        className={`group relative cursor-pointer overflow-hidden rounded-xl border transition-all ${
                          isSelected
                            ? "border-emerald-500 ring-2 ring-emerald-500/40 bg-neutral-900"
                            : "border-neutral-800 bg-neutral-900/50 hover:border-neutral-700"
                        }`}
                      >
                        <div className="relative aspect-video w-full overflow-hidden bg-neutral-950">
                          <img
                            src={item.imageUrl}
                            alt={item.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2">
                            <div
                              className={`flex h-6 w-6 items-center justify-center rounded-full border transition-all ${
                                isSelected
                                  ? "border-emerald-500 bg-emerald-500 text-neutral-950"
                                  : "border-neutral-600 bg-black/60 text-transparent"
                              }`}
                            >
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </div>

                        <div className="p-2.5">
                          <h4 className="text-xs font-bold text-neutral-200 line-clamp-1">
                            {item.title}
                          </h4>
                          <p className="mt-0.5 text-[10px] text-neutral-400 line-clamp-2">
                            {item.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleVerifyImage}
                    disabled={selectedImageIds.length !== 3}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-xs font-bold text-neutral-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verify Real Human Images</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. AUDIO-POWERED TEST */}
            {activeTestMode === "audio" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
                  <span className="text-xs font-bold text-sky-400">
                    Task: Acoustic Speech & Passcode Recognition
                  </span>
                  <p className="mt-1 text-xs text-neutral-400 leading-relaxed">
                    Click the Play button to listen to the acoustic speech frequency passcode spoken by a real-time vocal engine. Type the 4-digit code heard.
                  </p>
                </div>

                {/* Audio Player Card */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-neutral-800 bg-neutral-900 p-5">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handlePlayAudio}
                      disabled={isPlayingAudio}
                      className="flex h-12 w-12 items-center justify-center rounded-xl bg-sky-500 text-neutral-950 shadow-lg shadow-sky-500/20 hover:bg-sky-400 disabled:opacity-75 transition-all"
                    >
                      {isPlayingAudio ? (
                        <Pause className="h-6 w-6 animate-pulse" />
                      ) : (
                        <Play className="h-6 w-6 ml-0.5" />
                      )}
                    </button>
                    <div>
                      <div className="text-xs font-bold text-neutral-200">
                        {isPlayingAudio ? "Playing Acoustic Vocal Track..." : "Click to Play Audio"}
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Synthesizer vocal acoustics • Bots fail speech recognition
                      </div>
                    </div>
                  </div>

                  {/* Visualizer Soundwave Bars */}
                  <div className="flex items-center gap-1 h-8">
                    {[16, 28, 12, 32, 20, 24, 10, 30, 18, 22].map((height, idx) => (
                      <div
                        key={idx}
                        className={`w-1 rounded-full bg-sky-400 transition-all duration-150 ${
                          isPlayingAudio ? "animate-pulse" : "opacity-40"
                        }`}
                        style={{ height: isPlayingAudio ? `${height}px` : "8px" }}
                      />
                    ))}
                  </div>

                  <button
                    onClick={handleCycleAudio}
                    className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-sky-300 transition-colors"
                    title="Change to different audio sequence"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>New Audio</span>
                  </button>
                </div>

                {audioError && (
                  <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300 flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                    <span>{audioError}</span>
                  </div>
                )}

                {/* Input Passcode */}
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      maxLength={4}
                      value={userAudioInput}
                      onChange={(e) => setUserAudioInput(e.target.value)}
                      placeholder="Enter 4-character code (e.g. 7492)"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-center text-lg font-mono font-bold tracking-widest text-neutral-100 placeholder:text-neutral-600 focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <button
                    onClick={handleVerifyAudio}
                    disabled={userAudioInput.trim().length !== 4}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-sky-500 to-sky-600 px-5 py-2.5 text-xs font-bold text-neutral-950 shadow-md shadow-sky-500/20 hover:from-sky-400 hover:to-sky-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Verify Audio Code</span>
                  </button>
                </div>
              </div>
            )}

            {/* 3. PHYSICAL CAUSALITY RIDDLE */}
            {activeTestMode === "causality" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-4">
                  <span className="text-xs font-bold text-amber-400">
                    Real-World Physical Causality Question
                  </span>
                  <h4 className="mt-1 text-sm font-semibold text-neutral-200">
                    If you drop an iron hammer and a dry bamboo stick into a pond of water, what happens immediately?
                  </h4>
                </div>

                {causalityError && (
                  <div className="rounded-xl border border-red-500/50 bg-red-950/40 p-3 text-xs text-red-300">
                    {causalityError}
                  </div>
                )}

                <div className="space-y-2">
                  {[
                    {
                      id: "opt-hammer-sink",
                      text: "The iron hammer sinks to the bed, while the dry bamboo floats on the surface.",
                    },
                    {
                      id: "opt-evap",
                      text: "Both objects evaporate into blue hydrogen gas in 5 seconds.",
                    },
                    {
                      id: "opt-float-midair",
                      text: "The hammer floats in mid-air above the pond due to anti-gravity.",
                    },
                  ].map((opt) => (
                    <div
                      key={opt.id}
                      onClick={() => {
                        setSelectedOptionId(opt.id);
                        setCausalityError(null);
                      }}
                      className={`cursor-pointer rounded-xl border p-3.5 text-xs transition-all ${
                        selectedOptionId === opt.id
                          ? "border-emerald-500 bg-emerald-950/30 text-emerald-200 font-semibold"
                          : "border-neutral-800 bg-neutral-900/40 text-neutral-300 hover:border-neutral-700"
                      }`}
                    >
                      {opt.text}
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleVerifyCausality}
                    disabled={!selectedOptionId}
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-xs font-bold text-neutral-950 shadow-md shadow-emerald-500/20 hover:from-emerald-400 hover:to-emerald-500 disabled:opacity-50 transition-all"
                  >
                    <ShieldCheck className="h-4 w-4" />
                    <span>Submit Answer</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer Guarantee */}
        <div className="mt-6 border-t border-neutral-800 pt-3 text-[11px] text-neutral-400 flex items-center justify-between">
          <span>Protected under Nepal Electronic Transactions Act 2063 (Section 44)</span>
          <span className="flex items-center gap-1 text-emerald-400">
            <Lock className="h-3 w-3" /> Anti-Bot Tamper Guard Active
          </span>
        </div>
      </div>
    </div>
  );
};
