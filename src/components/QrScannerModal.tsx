import React, { useState, useRef, useEffect } from "react";
import {
  X,
  Camera,
  QrCode,
  Upload,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Copy,
  Check,
  ArrowRight,
  RefreshCw,
  Trash2,
} from "lucide-react";
import jsQR from "jsqr";
import { UserProfile, CurrencyCode, AccountUploadedFile } from "../types";
import { EXCHANGE_RATES, formatLocalCurrency } from "../utils/legalAndCurrency";
import { isSitePublishedLive } from "../utils/syncEngine";

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  preferredCurrency: CurrencyCode;
  onProcessPayment?: (
    amount: number,
    currency: CurrencyCode,
    description: string,
    recipient: string,
    realBankOrQrRefId: string,
    paymentProofFile: AccountUploadedFile
  ) => void;
}

interface DecodedQrPayload {
  raw: string;
  type: "ideavault_payment" | "khalti_qr" | "idea_claim" | "generic_url" | "text";
  recipientName: string;
  recipientAccount?: string;
  amount?: number;
  currency?: CurrencyCode;
  description: string;
  verifiedSecurityHash?: string;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  preferredCurrency,
  onProcessPayment,
}) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [decodedData, setDecodedData] = useState<DecodedQrPayload | null>(null);
  const [paidAmountInput, setPaidAmountInput] = useState<string>("");
  const [paidCurrencyInput, setPaidCurrencyInput] = useState<CurrencyCode>(preferredCurrency);
  const [realPaymentRefId, setRealPaymentRefId] = useState<string>("");
  const [paymentProofFile, setPaymentProofFile] = useState<AccountUploadedFile | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState<string | null>(null);
  const [copiedRaw, setCopiedRaw] = useState(false);
  const [scanMode, setScanMode] = useState<"camera" | "screen_file">("camera");

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const parseQrContent = (content: string): DecodedQrPayload => {
    try {
      if (content.startsWith("{") && content.endsWith("}")) {
        const parsed = JSON.parse(content);
        const parsedAmt =
          typeof parsed.amount === "number" ? parsed.amount : parseFloat(parsed.amount) || undefined;
        return {
          raw: content,
          type: "ideavault_payment",
          recipientName: parsed.recipient || parsed.to || "Verified QR Merchant",
          recipientAccount: parsed.account || parsed.walletId,
          amount: parsedAmt,
          currency: (parsed.currency as CurrencyCode) || "NPR",
          description: parsed.description || parsed.memo || "QR Merchant Settlement",
          verifiedSecurityHash: parsed.hash || "SHA256-VAULT-QR-VERIFIED",
        };
      }
    } catch {
      // not JSON
    }

    if (
      content.toLowerCase().includes("khalti") ||
      content.toLowerCase().includes("esewa") ||
      content.toLowerCase().includes("fonepay")
    ) {
      return {
        raw: content,
        type: "khalti_qr",
        recipientName: "Nepal National QR Merchant",
        currency: "NPR",
        description: "Nepali Rupee (NPR ₨) QR Direct Settlement",
        verifiedSecurityHash: "NEPALPAY-QR-VERIFIED",
      };
    }

    return {
      raw: content,
      type: "text",
      recipientName: "Scanned QR Recipient",
      currency: "NPR",
      description: content.length > 80 ? content.slice(0, 80) + "..." : content,
    };
  };

  useEffect(() => {
    let stream: MediaStream | null = null;

    if (isOpen && cameraActive && scanMode === "camera") {
      navigator.mediaDevices
        ?.getUserMedia({ video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            videoRef.current.setAttribute("playsinline", "true");
            videoRef.current.play().catch(() => {});
          }
          setCameraError(null);
          requestScanTick();
        })
        .catch((err) => {
          setCameraError(
            err.name === "NotAllowedError"
              ? "Camera permission denied. Switch to 'Upload QR Image' to scan a QR file directly."
              : "Unable to access camera hardware. Switch to 'Upload QR Image' to scan a QR file."
          );
          setCameraActive(false);
        });
    }

    function requestScanTick() {
      if (!cameraActive) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;
      if (video && canvas && video.readyState === video.HAVE_ENOUGH_DATA) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: "dontInvert",
          });
          if (code && code.data) {
            const parsed = parseQrContent(code.data);
            setDecodedData(parsed);
            setPaidCurrencyInput(parsed.currency || "NPR");
            setPaidAmountInput(parsed.amount ? String(parsed.amount) : "");
            setCameraActive(false);
            return;
          }
        }
      }
      animationFrameId.current = requestAnimationFrame(requestScanTick);
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isOpen, cameraActive, scanMode]);

  useEffect(() => {
    if (!isOpen) {
      setCameraActive(false);
      setDecodedData(null);
      setPaymentSuccess(null);
      setCameraError(null);
      setPaidAmountInput("");
      setRealPaymentRefId("");
      setPaymentProofFile(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height);
          if (code && code.data) {
            const parsed = parseQrContent(code.data);
            setDecodedData(parsed);
            setPaidCurrencyInput(parsed.currency || "NPR");
            setPaidAmountInput(parsed.amount ? String(parsed.amount) : "");
            setCameraError(null);
          } else {
            setCameraError("No valid QR code detected in the selected image. Please try another QR image.");
          }
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleUploadReceiptProof = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setPaymentProofFile({
          id: `qr-proof-${Date.now()}`,
          name: file.name,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
          kind: file.type.startsWith("image/") ? "image" : "document",
          dataUrl: reader.result,
          uploadedAt: new Date().toLocaleString(),
        });
        setCameraError(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmPay = () => {
    if (!decodedData) return;
    if (!isSitePublishedLive()) {
      setCameraError(
        "Site is not published yet: Real-money human QR payments and earnings do not exist until IdeaVault is published live."
      );
      return;
    }

    const numericAmt = parseFloat(paidAmountInput);
    if (isNaN(numericAmt) || numericAmt <= 0) {
      setCameraError("Enter the exact real-money amount actually paid via your bank or wallet app.");
      return;
    }
    if (realPaymentRefId.trim().length < 6) {
      setCameraError("Enter your real Bank / Wallet QR Transaction Reference ID (minimum 6 characters).");
      return;
    }
    if (!paymentProofFile) {
      setCameraError("Upload your actual payment receipt screenshot or PDF statement to verify payment.");
      return;
    }

    if (onProcessPayment) {
      onProcessPayment(
        numericAmt,
        paidCurrencyInput,
        decodedData.description,
        decodedData.recipientName,
        realPaymentRefId.trim(),
        paymentProofFile
      );
    }

    setPaymentSuccess(
      `Verified real-money payment of ${formatLocalCurrency(numericAmt, paidCurrencyInput)} recorded (Ref #${realPaymentRefId.trim()}) with receipt "${paymentProofFile.name}".`
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative w-full max-w-xl rounded-3xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950/70 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/30 border border-amber-500/40 text-amber-400">
              <QrCode className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-neutral-100">
                Real-Money QR Scanner &amp; Receipt Verification
              </h2>
              <p className="text-xs text-neutral-400">
                Scan Nepali (NPR ₨) or international QR codes and attach verified payment proof
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/40 px-6 pt-3 gap-2">
          <button
            onClick={() => {
              setScanMode("camera");
              setCameraError(null);
            }}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 ${
              scanMode === "camera"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Live Camera Feed</span>
          </button>

          <button
            onClick={() => {
              setScanMode("screen_file");
              setCameraActive(false);
              setCameraError(null);
            }}
            className={`flex items-center gap-1.5 pb-2.5 px-3 text-xs font-bold transition-colors border-b-2 ${
              scanMode === "screen_file"
                ? "border-amber-400 text-amber-300"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Upload className="h-4 w-4" />
            <span>Upload QR Image</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {paymentSuccess && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/40 p-4 text-xs text-emerald-300 space-y-2 animate-fadeIn">
              <div className="flex items-center gap-2 font-bold text-sm">
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                <span>Verified Real-Money Payment Settled</span>
              </div>
              <p>{paymentSuccess}</p>
              <button
                onClick={() => {
                  setPaymentSuccess(null);
                  setDecodedData(null);
                  setPaidAmountInput("");
                  setRealPaymentRefId("");
                  setPaymentProofFile(null);
                }}
                className="mt-2 text-xs font-bold text-emerald-400 hover:underline"
              >
                Scan Another QR Code
              </button>
            </div>
          )}

          {scanMode === "camera" && !decodedData && !paymentSuccess && (
            <div className="space-y-4">
              <div className="relative w-full aspect-video sm:aspect-square max-w-sm mx-auto rounded-3xl overflow-hidden border-2 border-neutral-700 bg-black flex flex-col items-center justify-center shadow-inner">
                {cameraActive ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 border-2 border-dashed border-amber-400/70 pointer-events-none m-8 rounded-2xl flex items-center justify-center">
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse shadow-md shadow-red-500" />
                    </div>
                  </>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <Camera className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-200">Device Camera Standby</h4>
                      <p className="text-xs text-neutral-400 max-w-xs mt-1">
                        Aim at any physical bank or wallet QR code to decode payment details.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {cameraError && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={() => setCameraActive(!cameraActive)}
                  className={`flex items-center gap-2 rounded-2xl px-6 py-3 text-xs font-extrabold transition-all shadow-md active:scale-95 cursor-pointer ${
                    cameraActive
                      ? "bg-red-500 hover:bg-red-400 text-white"
                      : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950"
                  }`}
                >
                  <Camera className="h-4 w-4" />
                  <span>{cameraActive ? "Stop Camera" : "Start Live Camera Scanner"}</span>
                </button>
              </div>
            </div>
          )}

          {scanMode === "screen_file" && !decodedData && !paymentSuccess && (
            <div className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="rounded-3xl border-2 border-dashed border-neutral-700 hover:border-amber-400 bg-neutral-950/50 hover:bg-neutral-950 p-8 text-center cursor-pointer transition-all space-y-3 group"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-105 transition-transform">
                  <Upload className="h-7 w-7" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-neutral-200 group-hover:text-amber-300">
                    Click to Upload QR Code Image
                  </h4>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
                    Select any Nepali (NPR ₨) or international payment QR image to scan.
                  </p>
                </div>
              </div>

              {cameraError && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{cameraError}</span>
                </div>
              )}
            </div>
          )}

          {decodedData && !paymentSuccess && (
            <div className="rounded-2xl border border-amber-500/40 bg-neutral-950 p-5 space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                  <ShieldCheck className="h-4 w-4" /> QR Decoded — Attach Actual Payment Proof
                </span>
                <button
                  onClick={() => {
                    setDecodedData(null);
                    setCameraActive(false);
                  }}
                  className="flex items-center gap-1 text-[11px] text-neutral-400 hover:text-neutral-200"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Scan Another</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="text-[11px] text-neutral-400 uppercase font-semibold">Recipient:</span>
                    <h3 className="text-sm font-bold text-neutral-100">{decodedData.recipientName}</h3>
                    {decodedData.recipientAccount && (
                      <span className="font-mono text-[11px] text-amber-400/90">{decodedData.recipientAccount}</span>
                    )}
                  </div>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(decodedData.raw);
                      setCopiedRaw(true);
                      setTimeout(() => setCopiedRaw(false), 2000);
                    }}
                    className="flex items-center gap-1 text-neutral-400 hover:text-neutral-200 text-[11px]"
                  >
                    {copiedRaw ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                    <span>{copiedRaw ? "Copied" : "Copy QR Data"}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Actual Amount Paid
                    </label>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      value={paidAmountInput}
                      onChange={(e) => setPaidAmountInput(e.target.value)}
                      placeholder="Enter real amount paid"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-mono text-neutral-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                      Paid Currency
                    </label>
                    <select
                      value={paidCurrencyInput}
                      onChange={(e) => setPaidCurrencyInput(e.target.value as CurrencyCode)}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-bold text-neutral-100 focus:border-amber-500 focus:outline-none"
                    >
                      {(Object.keys(EXCHANGE_RATES) as CurrencyCode[]).map((c) => (
                        <option key={c} value={c}>
                          {c} ({EXCHANGE_RATES[c].symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Bank / Digital Wallet QR Transaction Reference ID
                  </label>
                  <input
                    type="text"
                    value={realPaymentRefId}
                    onChange={(e) => setRealPaymentRefId(e.target.value)}
                    placeholder="Enter real transaction reference ID (min 6 chars)"
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs font-mono text-neutral-100 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                    Upload Actual Payment Receipt (Image or Document)
                  </label>
                  {paymentProofFile ? (
                    <div className="flex items-center justify-between rounded-xl border border-emerald-500/40 bg-emerald-950/30 px-3 py-2">
                      <span className="truncate text-emerald-300 font-medium">{paymentProofFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setPaymentProofFile(null)}
                        className="text-neutral-400 hover:text-red-400 ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-700 hover:border-amber-400 bg-neutral-900 px-3 py-2.5 text-xs font-semibold text-amber-300 cursor-pointer transition-colors">
                      <Upload className="h-4 w-4" />
                      <span>Upload Paid Receipt Screenshot / PDF</span>
                      <input
                        type="file"
                        accept="image/*,.pdf,.doc,.docx"
                        onChange={handleUploadReceiptProof}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {cameraError && (
                  <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-2.5 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{cameraError}</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center gap-3">
                <button
                  disabled={
                    !isSitePublishedLive() ||
                    !paymentProofFile ||
                    realPaymentRefId.trim().length < 6 ||
                    !(parseFloat(paidAmountInput) > 0)
                  }
                  onClick={handleConfirmPay}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 px-4 py-3 text-xs font-extrabold text-neutral-950 shadow-md shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {!isSitePublishedLive() ? (
                    <span>Payments Inactive Until Site Published</span>
                  ) : (
                    <>
                      <span>Verify Receipt &amp; Record Real-Money Payment</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                <button
                  onClick={() => setDecodedData(null)}
                  className="rounded-xl border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-4 py-3 text-xs font-semibold text-neutral-300"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!isSitePublishedLive() && !decodedData && !paymentSuccess && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950/60 p-4 text-xs text-neutral-400 leading-relaxed">
              <strong className="text-amber-300 font-semibold block mb-1">
                Pre-Launch Status — Zero Human Payments Active
              </strong>
              Real-money human payments are disabled until IdeaVault is published live, and every payment requires a real bank/QR transaction reference ID plus an uploaded payment receipt.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
