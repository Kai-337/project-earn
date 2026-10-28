import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  Play,
  Pause,
  RotateCcw,
  Download,
  Volume2,
  VolumeX,
  Film,
  Copy,
  Check,
  X,
  Smartphone,
  Monitor,
  Loader2,
} from "lucide-react";
import { drawIdeaVaultLogoOnCanvas } from "./IdeaVaultLogo";

interface PromoVideoStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type VideoAspect = "16:9" | "9:16";

const TOTAL_DURATION_SEC = 24;

interface PromoScene {
  start: number;
  end: number;
  kicker: string;
  headline: string;
  subline: string;
  bullets: string[];
  accent: string;
}

const PROMO_SCENES: PromoScene[] = [
  {
    start: 0,
    end: 4.8,
    kicker: "STOP LETTING GREAT IDEAS GO UNBUILT",
    headline: "Have a Brilliant Everyday Idea?",
    subline: "Most creators have game-changing product concepts — but lack capital or engineering teams.",
    bullets: ["Zero coding required to pitch", "Timestamped authorship from Day 1"],
    accent: "#f59e0b",
  },
  {
    start: 4.8,
    end: 9.6,
    kicker: "INTRODUCING IDEAVAULT MARKETPLACE",
    headline: "Where Idea Posters Meet Real Investors",
    subline: "Create an Idea Poster Account to pitch for $0 — or an Investor Account to acquire vetted concepts.",
    bullets: ["1. Idea Poster Account (Post Free)", "2. Investor Account (Custom Sectors)"],
    accent: "#10b981",
  },
  {
    start: 9.6,
    end: 14.8,
    kicker: "TRANSPARENT COMMERCIAL CONTRACTS",
    headline: "3 Ways to Monetize Your Concept",
    subline: "Protected under WIPO Berne Convention, UNCITRAL & Nepal Copyright Act 2059.",
    bullets: [
      "Keep Copyright + 15% Sales Royalty",
      "100% Full Copyright Buyout (0% Royalty)",
      "3-Yr License (Strict 1.5-Yr Max 15% Royalty)",
    ],
    accent: "#38bdf8",
  },
  {
    start: 14.8,
    end: 19.6,
    kicker: "VERIFIED REAL-MONEY PAYOUTS",
    headline: "Direct Multi-Currency & QR Settlement",
    subline: "Settle in NPR ₨, USD $, EUR €, INR ₹, GBP £ directly to verified Digital Wallets & Bank Accounts.",
    bullets: ["Instant QR & Bank Receipt Verification", "Only 3% fee on completed real sales"],
    accent: "#a78bfa",
  },
  {
    start: 19.6,
    end: 24.0,
    kicker: "LAUNCH YOUR IDEA OR INVEST TODAY",
    headline: "Join IdeaVault Today",
    subline: "Post your first original idea for free or license tomorrow's next commercial product.",
    bullets: ["Post Original Ideas Free ($0)", "Queries: medhakoirala.servicesgmail.com@gmail.com"],
    accent: "#f59e0b",
  },
];

function wrapCanvasText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const words = text.split(" ");
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export const PromoVideoStudioModal: React.FC<PromoVideoStudioModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [aspect, setAspect] = useState<VideoAspect>("16:9");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordProgress, setRecordProgress] = useState(0);
  const [downloadedUrl, setDownloadedUrl] = useState<string | null>(null);
  const [copiedCaption, setCopiedCaption] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastFrameTsRef = useRef<number | null>(null);
  const timeRef = useRef<number>(0);

  // Web Audio ambient soundtrack refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const audioDestRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const chordTimerRef = useRef<number | null>(null);

  const width = aspect === "16:9" ? 1280 : 720;
  const height = aspect === "16:9" ? 720 : 1280;

  const stopAudio = useCallback(() => {
    if (chordTimerRef.current !== null) {
      window.clearInterval(chordTimerRef.current);
      chordTimerRef.current = null;
    }
  }, []);

  const ensureAudioContext = useCallback(() => {
    if (!audioCtxRef.current && typeof window !== "undefined") {
      const AudioContextClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const dest = ctx.createMediaStreamDestination();
        audioCtxRef.current = ctx;
        audioDestRef.current = dest;
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
  }, []);

  const playWarmChord = useCallback(
    (chordIndex: number) => {
      if (isMuted && !isRecording) return;
      ensureAudioContext();
      const ctx = audioCtxRef.current;
      if (!ctx) return;

      const chords = [
        [261.63, 329.63, 392.0, 493.88], // Cmaj7
        [220.0, 261.63, 329.63, 392.0], // Am7
        [174.61, 220.0, 261.63, 349.23], // Fmaj7
        [196.0, 246.94, 293.66, 392.0], // G6
      ];
      const freqs = chords[chordIndex % chords.length];
      const now = ctx.currentTime;

      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.0001, now);
        gain.gain.exponentialRampToValueAtTime(0.035, now + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.3);

        osc.connect(gain);
        if (!isMuted) {
          gain.connect(ctx.destination);
        }
        if (audioDestRef.current) {
          gain.connect(audioDestRef.current);
        }

        osc.start(now);
        osc.stop(now + 2.4);
      });
    },
    [ensureAudioContext, isMuted, isRecording]
  );

  // Ambient music loop while playing
  useEffect(() => {
    if (!isOpen || !isPlaying) {
      stopAudio();
      return;
    }
    let step = 0;
    playWarmChord(step);
    chordTimerRef.current = window.setInterval(() => {
      step += 1;
      playWarmChord(step);
    }, 2400);

    return () => {
      stopAudio();
    };
  }, [isOpen, isPlaying, playWarmChord, stopAudio]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (downloadedUrl) URL.revokeObjectURL(downloadedUrl);
    };
  }, [downloadedUrl, stopAudio]);

  const drawFrame = useCallback(
    (t: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const isVertical = aspect === "9:16";
      const w = canvas.width;
      const h = canvas.height;

      const sceneIdx = Math.min(
        PROMO_SCENES.length - 1,
        Math.max(
          0,
          PROMO_SCENES.findIndex((s) => t >= s.start && t <= s.end)
        )
      );
      const scene = PROMO_SCENES[sceneIdx] || PROMO_SCENES[0];
      const localT = Math.max(0, t - scene.start);
      const sceneDur = scene.end - scene.start;
      const enterProgress = Math.min(1, localT / 0.55);
      const easeOut = 1 - Math.pow(1 - enterProgress, 3);

      // 1. Deep Obsidian Gradient Background
      const bgGrad = ctx.createLinearGradient(0, 0, w, h);
      bgGrad.addColorStop(0, "#09090b");
      bgGrad.addColorStop(0.55, "#111827");
      bgGrad.addColorStop(1, "#09090b");
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Animated Ambient Glow Orbs
      const orbX = w * 0.5 + Math.cos(t * 0.7) * (w * 0.22);
      const orbY = h * 0.35 + Math.sin(t * 0.5) * (h * 0.14);
      const radGrad = ctx.createRadialGradient(orbX, orbY, 20, orbX, orbY, w * 0.55);
      radGrad.addColorStop(0, `${scene.accent}33`);
      radGrad.addColorStop(1, "rgba(9,9,11,0)");
      ctx.fillStyle = radGrad;
      ctx.fillRect(0, 0, w, h);

      // Subtle architectural grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.035)";
      ctx.lineWidth = 1;
      const gridStep = isVertical ? 64 : 80;
      for (let gx = 0; gx < w; gx += gridStep) {
        ctx.beginPath();
        ctx.moveTo(gx, 0);
        ctx.lineTo(gx, h);
        ctx.stroke();
      }
      for (let gy = 0; gy < h; gy += gridStep) {
        ctx.beginPath();
        ctx.moveTo(0, gy);
        ctx.lineTo(w, gy);
        ctx.stroke();
      }

      const padX = isVertical ? 56 : 96;
      const topBarY = isVertical ? 76 : 62;

      // 3. Top Brand Header (Iconic Vault-Bulb Keyhole Logo + IdeaVault)
      ctx.save();
      drawIdeaVaultLogoOnCanvas(ctx, padX, topBarY - 28, 48);

      ctx.textAlign = "left";
      ctx.font = "800 26px sans-serif";
      ctx.fillStyle = "#f8fafc";
      ctx.fillText("Idea", padX + 60, topBarY + 4);
      const ideaWidth = ctx.measureText("Idea").width;
      ctx.fillStyle = "#fbbf24";
      ctx.fillText("Vault", padX + 60 + ideaWidth, topBarY + 4);

      // Scene counter on top right
      ctx.textAlign = "right";
      ctx.font = "600 16px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText(`0${sceneIdx + 1} / 0${PROMO_SCENES.length}`, w - padX, topBarY + 2);
      ctx.restore();

      // 4. Kicker Label
      const contentStartY = isVertical ? 230 : 175;
      const slideOffset = (1 - easeOut) * 32;

      ctx.save();
      ctx.globalAlpha = easeOut;
      ctx.textAlign = "left";
      ctx.font = `800 ${isVertical ? 17 : 18}px sans-serif`;
      ctx.fillStyle = scene.accent;
      ctx.fillText(scene.kicker, padX, contentStartY + slideOffset);

      // 5. Main Kinetic Headline
      ctx.font = `900 ${isVertical ? 52 : 60}px sans-serif`;
      ctx.fillStyle = "#ffffff";
      const headlineLines = wrapCanvasText(ctx, scene.headline, w - padX * 2);
      let cursorY = contentStartY + (isVertical ? 64 : 68) + slideOffset;
      const lineHeight = isVertical ? 62 : 70;
      headlineLines.forEach((line) => {
        ctx.fillText(line, padX, cursorY);
        cursorY += lineHeight;
      });

      // 6. Subtitle Copy
      cursorY += 10;
      ctx.font = `500 ${isVertical ? 24 : 25}px sans-serif`;
      ctx.fillStyle = "#cbd5e1";
      const subLines = wrapCanvasText(ctx, scene.subline, w - padX * 2);
      subLines.forEach((line) => {
        ctx.fillText(line, padX, cursorY);
        cursorY += isVertical ? 36 : 38;
      });

      // 7. Feature Cards / Value Bullets
      cursorY += isVertical ? 36 : 28;
      scene.bullets.forEach((bullet, bIdx) => {
        const cardDelay = Math.min(1, Math.max(0, (localT - 0.2 - bIdx * 0.14) / 0.45));
        const cardEase = 1 - Math.pow(1 - cardDelay, 3);
        const cardY = cursorY + bIdx * (isVertical ? 82 : 68) + (1 - cardEase) * 20;
        const cardH = isVertical ? 66 : 54;

        ctx.save();
        ctx.globalAlpha = cardEase;
        ctx.fillStyle = "rgba(24, 24, 27, 0.88)";
        ctx.strokeStyle = `${scene.accent}66`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.roundRect(padX, cardY, w - padX * 2, cardH, 14);
        ctx.fill();
        ctx.stroke();

        // Check circle
        ctx.fillStyle = scene.accent;
        ctx.beginPath();
        ctx.arc(padX + 28, cardY + cardH / 2, 10, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#09090b";
        ctx.font = "900 13px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("✓", padX + 28, cardY + cardH / 2 + 4.5);

        ctx.textAlign = "left";
        ctx.fillStyle = "#f8fafc";
        ctx.font = `700 ${isVertical ? 22 : 22}px sans-serif`;
        ctx.fillText(bullet, padX + 52, cardY + cardH / 2 + 8);
        ctx.restore();
      });
      ctx.restore();

      // 8. Bottom Footer Bar & Progress Timeline
      const footerY = h - (isVertical ? 86 : 54);
      ctx.save();
      ctx.fillStyle = "#94a3b8";
      ctx.font = `600 ${isVertical ? 17 : 16}px sans-serif`;
      ctx.textAlign = "left";
      ctx.fillText("Post Ideas Free ($0) · WIPO & Nepal Copyright Act 2059", padX, footerY);

      if (!isVertical) {
        ctx.textAlign = "right";
        ctx.fillStyle = "#fbbf24";
        ctx.fillText("medhakoirala.servicesgmail.com@gmail.com", w - padX, footerY);
      } else {
        ctx.fillStyle = "#fbbf24";
        ctx.fillText("medhakoirala.servicesgmail.com@gmail.com", padX, footerY + 28);
      }

      // Scene progress bar at very bottom
      ctx.fillStyle = "rgba(255,255,255,0.1)";
      ctx.fillRect(0, h - 8, w, 8);
      const overallProgress = Math.min(1, t / TOTAL_DURATION_SEC);
      ctx.fillStyle = scene.accent;
      ctx.fillRect(0, h - 8, w * overallProgress, 8);

      // Subtle scene pulse indicator
      const sceneRatio = Math.min(1, localT / sceneDur);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillRect(0, h - 8, w * overallProgress * sceneRatio, 2);
      ctx.restore();
    },
    [aspect]
  );

  // Main animation loop
  useEffect(() => {
    if (!isOpen) return;

    const tick = (timestamp: number) => {
      if (lastFrameTsRef.current === null) {
        lastFrameTsRef.current = timestamp;
      }
      const delta = (timestamp - lastFrameTsRef.current) / 1000;
      lastFrameTsRef.current = timestamp;

      if (isPlaying && !isRecording) {
        timeRef.current += delta;
        if (timeRef.current >= TOTAL_DURATION_SEC) {
          timeRef.current = 0;
        }
        setCurrentTime(timeRef.current);
      }

      drawFrame(timeRef.current);
      rafRef.current = requestAnimationFrame(tick);
    };

    lastFrameTsRef.current = null;
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isOpen, isPlaying, isRecording, drawFrame]);

  // Redraw immediately when aspect changes
  useEffect(() => {
    if (isOpen) {
      drawFrame(timeRef.current);
    }
  }, [aspect, isOpen, drawFrame]);

  const handleRestart = () => {
    timeRef.current = 0;
    setCurrentTime(0);
    setIsPlaying(true);
  };

  // Real .webm HD Video + Audio Exporter
  const handleRecordAndDownload = async () => {
    const canvas = canvasRef.current;
    if (!canvas || isRecording) return;

    ensureAudioContext();
    setIsRecording(true);
    setIsPlaying(false);
    setRecordProgress(0);
    if (downloadedUrl) {
      URL.revokeObjectURL(downloadedUrl);
      setDownloadedUrl(null);
    }

    const canvasStream = canvas.captureStream(30);
    const combinedTracks: MediaStreamTrack[] = [...canvasStream.getVideoTracks()];
    if (audioDestRef.current) {
      const audioTracks = audioDestRef.current.stream.getAudioTracks();
      combinedTracks.push(...audioTracks);
    }
    const mixedStream = new MediaStream(combinedTracks);

    const mimeCandidates = [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
    ];
    const selectedMime =
      mimeCandidates.find((m) => typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(m)) || "";

    const chunks: BlobPart[] = [];
    const recorder = selectedMime
      ? new MediaRecorder(mixedStream, { mimeType: selectedMime, videoBitsPerSecond: 4_500_000 })
      : new MediaRecorder(mixedStream);

    recorder.ondataavailable = (ev) => {
      if (ev.data && ev.data.size > 0) {
        chunks.push(ev.data);
      }
    };

    const finishedPromise = new Promise<void>((resolve) => {
      recorder.onstop = () => resolve();
    });

    recorder.start(200);

    // Render full 24-second timeline smoothly while triggering chords
    const fps = 30;
    const totalFrames = TOTAL_DURATION_SEC * fps;
    let lastChordIdx = -1;

    for (let f = 0; f <= totalFrames; f++) {
      const simT = (f / totalFrames) * TOTAL_DURATION_SEC;
      timeRef.current = simT;
      setCurrentTime(simT);
      setRecordProgress(Math.round((f / totalFrames) * 100));
      drawFrame(simT);

      const chordSlot = Math.floor(simT / 2.4);
      if (chordSlot !== lastChordIdx) {
        lastChordIdx = chordSlot;
        playWarmChord(chordSlot);
      }

      await new Promise((r) => setTimeout(r, 1000 / fps));
    }

    recorder.stop();
    await finishedPromise;

    const blob = new Blob(chunks, { type: selectedMime || "video/webm" });
    const url = URL.createObjectURL(blob);
    setDownloadedUrl(url);

    const a = document.createElement("a");
    a.href = url;
    a.download = `IdeaVault-Promo-${aspect === "16:9" ? "Landscape-16x9" : "Reels-TikTok-9x16"}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setIsRecording(false);
    timeRef.current = 0;
    setCurrentTime(0);
    setIsPlaying(true);
  };

  const socialCaption = `Have an original product idea — or looking to invest in the next breakthrough concept? 🚀\n\nOn IdeaVault, Idea Posters publish original ideas for FREE with instant SHA-256 timestamped copyright records, and Investors license or acquire them under 3 transparent structures:\n1️⃣ Keep Copyright + 15% Sales Royalty\n2️⃣ 100% Full Copyright Buyout\n3️⃣ 3-Year Product License (1.5-Year Max Royalty Cap)\n\n📩 Contact: medhakoirala.servicesgmail.com@gmail.com\n#IdeaVault #StartupIdeas #Investors #ProductLicensing #Entrepreneurs #Innovation #NepalTech`;

  const handleCopyCaption = () => {
    navigator.clipboard.writeText(socialCaption);
    setCopiedCaption(true);
    setTimeout(() => setCopiedCaption(false), 2500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-5 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <Film className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                IdeaVault Official Promo Video Studio
              </h2>
              <p className="text-xs text-neutral-400">
                Watch &amp; download HD promotional videos for YouTube, TikTok, Instagram Reels, LinkedIn &amp; X
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 max-h-[78vh] overflow-y-auto space-y-5">
          {/* Format Switcher + Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isRecording}
                onClick={() => setAspect("16:9")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition-all cursor-pointer ${
                  aspect === "16:9"
                    ? "bg-amber-500 text-neutral-950 border-amber-400"
                    : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:bg-neutral-800"
                }`}
              >
                <Monitor className="h-3.5 w-3.5" />
                <span>16:9 YouTube / Website / LinkedIn</span>
              </button>

              <button
                type="button"
                disabled={isRecording}
                onClick={() => setAspect("9:16")}
                className={`flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold border transition-all cursor-pointer ${
                  aspect === "9:16"
                    ? "bg-amber-500 text-neutral-950 border-amber-400"
                    : "bg-neutral-950 text-neutral-300 border-neutral-800 hover:bg-neutral-800"
                }`}
              >
                <Smartphone className="h-3.5 w-3.5" />
                <span>9:16 TikTok / Reels / Shorts</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={isRecording}
                onClick={() => {
                  ensureAudioContext();
                  setIsPlaying((p) => !p);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-950 hover:bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-200 cursor-pointer"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5 text-amber-400" /> : <Play className="h-3.5 w-3.5 text-emerald-400" />}
                <span>{isPlaying ? "Pause" : "Play"}</span>
              </button>

              <button
                type="button"
                disabled={isRecording}
                onClick={handleRestart}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-950 hover:bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-200 cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-amber-400" />
                <span>Restart</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  ensureAudioContext();
                  setIsMuted((m) => !m);
                }}
                className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-950 hover:bg-neutral-800 px-3 py-2 text-xs font-semibold text-neutral-200 cursor-pointer"
              >
                {isMuted ? <VolumeX className="h-3.5 w-3.5 text-neutral-400" /> : <Volume2 className="h-3.5 w-3.5 text-emerald-400" />}
                <span>{isMuted ? "Muted" : "Music On"}</span>
              </button>
            </div>
          </div>

          {/* Canvas Video Viewport */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-3 flex flex-col items-center justify-center">
            <canvas
              ref={canvasRef}
              width={width}
              height={height}
              className={`rounded-xl border border-neutral-800 shadow-2xl bg-neutral-950 ${
                aspect === "16:9" ? "w-full aspect-video" : "max-h-[440px] w-auto aspect-[9/16]"
              }`}
            />

            {/* Timeline Scrubber */}
            <div className="w-full mt-3 flex items-center gap-3 px-1">
              <span className="font-mono text-[11px] text-neutral-400 w-12">
                0:{Math.floor(currentTime).toString().padStart(2, "0")}
              </span>
              <input
                type="range"
                min={0}
                max={TOTAL_DURATION_SEC}
                step={0.1}
                disabled={isRecording}
                value={currentTime}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  timeRef.current = val;
                  setCurrentTime(val);
                  drawFrame(val);
                }}
                className="flex-1 accent-amber-500 cursor-pointer"
              />
              <span className="font-mono text-[11px] text-neutral-400 w-12 text-right">
                0:{TOTAL_DURATION_SEC}
              </span>
            </div>
          </div>

          {/* Ready-to-Post Social Ad Caption */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-neutral-200">
                Ready-to-Paste Ad Caption (TikTok / Instagram / YouTube / LinkedIn)
              </span>
              <button
                type="button"
                onClick={handleCopyCaption}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 text-[11px] font-semibold text-amber-300 cursor-pointer"
              >
                {copiedCaption ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedCaption ? "Caption Copied!" : "Copy Ad Caption"}</span>
              </button>
            </div>
            <pre className="whitespace-pre-wrap font-sans text-xs text-neutral-400 leading-relaxed bg-neutral-900/70 rounded-lg p-3 border border-neutral-800/80">
              {socialCaption}
            </pre>
          </div>
        </div>

        {/* Footer Export Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 bg-neutral-950 px-5 sm:px-6 py-4">
          <div className="text-xs text-neutral-400">
            {isRecording ? (
              <span className="text-amber-300 font-semibold">
                Recording HD {aspect} video + soundtrack... {recordProgress}%
              </span>
            ) : downloadedUrl ? (
              <span className="text-emerald-400 font-semibold">
                Promo video exported! Ready to upload to social platforms.
              </span>
            ) : (
              <span>Exports an HD .webm video file with ambient audio directly to your device.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={isRecording}
              onClick={handleRecordAndDownload}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 disabled:opacity-60 px-4 py-2.5 text-xs font-extrabold text-neutral-950 shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              {isRecording ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Rendering Video ({recordProgress}%)...</span>
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  <span>Download {aspect} Promo Video (.webm)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-4 py-2.5 text-xs font-bold text-neutral-200 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
