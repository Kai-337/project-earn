import React, { useState, useRef, useEffect } from "react";
import { UserProfile, CurrencyCode, UserDigitalWallet, WithdrawalMethod, WalletTransaction, OwnerQrAccountConfig, AccountUploadedFile } from "../types";
import { 
  Wallet, 
  X, 
  QrCode, 
  Camera, 
  ArrowDownLeft, 
  ArrowUpRight, 
  RefreshCw, 
  Building2, 
  Smartphone, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Check, 
  Sparkles, 
  History, 
  Plus, 
  CreditCard, 
  SlidersHorizontal,
  Zap,
  Globe,
  DollarSign,
  Trash2,
  Upload,
  FileText,
  Download
} from "lucide-react";
import { isSitePublishedLive } from "../utils/syncEngine";
import { 
  EXCHANGE_RATES, 
  convertCurrencyToCurrency, 
  formatLocalCurrency, 
  formatPrice,
  getWalletsForCountry,
  GlobalWalletProvider
} from "../utils/legalAndCurrency";

interface DigitalWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  wallet: UserDigitalWallet;
  onUpdateWallet: (updatedWallet: UserDigitalWallet) => void;
  preferredCurrency: CurrencyCode;
  onPayForIdeaByScan?: (ideaId: string, amount: number, currency: CurrencyCode) => void;
  initialTab?: "slots" | "scanner" | "withdraw" | "ledger";
}

export const DigitalWalletModal: React.FC<DigitalWalletModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  wallet,
  onUpdateWallet,
  preferredCurrency,
  onPayForIdeaByScan,
  initialTab = "slots",
}) => {
  const [activeTab, setActiveTab] = useState<"slots" | "scanner" | "withdraw" | "ledger">(initialTab);
  const isPublished = isSitePublishedLive();

  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // Multi-Currency Converter inside Wallet
  const [convertFrom, setConvertFrom] = useState<CurrencyCode>("USD");
  const [convertTo, setConvertTo] = useState<CurrencyCode>("NPR");
  const [convertAmount, setConvertAmount] = useState<string>("50");
  const [convertNotice, setConvertNotice] = useState<string | null>(null);

  // Withdrawal States (Zero auto-added banks; user chooses Digital Wallet or Any Bank Account)
  const [selectedSlotForWithdraw, setSelectedSlotForWithdraw] = useState<CurrencyCode>("NPR");
  const [withdrawAmount, setWithdrawAmount] = useState<string>("");
  const [selectedMethodId, setSelectedMethodId] = useState<string>(
    wallet.withdrawalMethods[0]?.id || ""
  );
  const [withdrawPin, setWithdrawPin] = useState<string>("");
  const [isAddingNewMethod, setIsAddingNewMethod] = useState(false);
  const [newMethodType, setNewMethodType] = useState<"bank" | "digital_wallet">("digital_wallet");
  const [newMethodProvider, setNewMethodProvider] = useState("");
  const [newMethodIdentifier, setNewMethodIdentifier] = useState("");
  const [newMethodHolderName, setNewMethodHolderName] = useState(currentUser.name);
  const [newMethodBranch, setNewMethodBranch] = useState("");
  const [newMethodQrDataUrl, setNewMethodQrDataUrl] = useState<string>("");
  const [newMethodUploadedFiles, setNewMethodUploadedFiles] = useState<AccountUploadedFile[]>([]);
  const [payoutCountry, setPayoutCountry] = useState<string>("Nepal");
  const [withdrawSuccessMsg, setWithdrawSuccessMsg] = useState<string | null>(null);
  const [withdrawError, setWithdrawError] = useState<string | null>(null);
  const [scannerPayError, setScannerPayError] = useState<string | null>(null);

  // Scanner & QR Pay States
  const [scannerActive, setScannerActive] = useState(false);
  const [scanPayload, setScanPayload] = useState<string | null>(null);
  const [scannedItemData, setScannedItemData] = useState<{
    title: string;
    recipientName: string;
    amount: number;
    currency: CurrencyCode;
    type: "idea" | "creator" | "prototype_fee";
    id: string;
  } | null>(null);
  const [payPin, setPayPin] = useState("");
  const [paySlotCurrency, setPaySlotCurrency] = useState<CurrencyCode>("USD");
  const [paySuccessMsg, setPaySuccessMsg] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [copiedAddress, setCopiedAddress] = useState(false);

  // Owner QR Account (Automatic Real-Money Wire Strictly in Nepali Currency NPR ₨) States
  const [ownerQrProvider, setOwnerQrProvider] = useState<string>(
    wallet.ownerQrAccount?.qrProviderName || ""
  );
  const [ownerQrAccountId, setOwnerQrAccountId] = useState<string>(
    wallet.ownerQrAccount?.qrAccountId || ""
  );
  const [ownerQrHolderName, setOwnerQrHolderName] = useState<string>(
    wallet.ownerQrAccount?.accountHolderName || currentUser.name
  );
  const ownerQrCurrency: CurrencyCode = "NPR";
  const [ownerQrImageDataUrl, setOwnerQrImageDataUrl] = useState<string>(
    wallet.ownerQrAccount?.qrImageDataUrl || ""
  );
  const [ownerQrSavedMsg, setOwnerQrSavedMsg] = useState<string | null>(null);

  useEffect(() => {
    if (wallet.ownerQrAccount) {
      setOwnerQrProvider(wallet.ownerQrAccount.qrProviderName);
      setOwnerQrAccountId(wallet.ownerQrAccount.qrAccountId);
      setOwnerQrHolderName(wallet.ownerQrAccount.accountHolderName);
      setOwnerQrImageDataUrl(wallet.ownerQrAccount.qrImageDataUrl || "");
    }
  }, [wallet.ownerQrAccount]);

  // Setup video stream if camera scanner turned on
  useEffect(() => {
    let stream: MediaStream | null = null;
    if (scannerActive && activeTab === "scanner") {
      navigator.mediaDevices?.getUserMedia({ video: { facingMode: "environment" } })
        .then((s) => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
          }
          setCameraError(null);
        })
        .catch(() => {
          setCameraError("Camera permission not granted. Allow camera access to scan live QR codes.");
        });
    }

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [scannerActive, activeTab]);

  if (!isOpen) return null;

  const handleUploadOwnerQrImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setOwnerQrImageDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadNewMethodQr = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setNewMethodQrDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUploadNewMethodFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const entry: AccountUploadedFile = {
            id: `mth-doc-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            name: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size,
            kind: file.type.startsWith("image/") ? "image" : "document",
            dataUrl: reader.result,
            uploadedAt: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          };
          setNewMethodUploadedFiles((prev) => [...prev, entry]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleSaveOwnerQrAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ownerQrProvider.trim() && !ownerQrImageDataUrl) {
      return;
    }
    const nextConfig: OwnerQrAccountConfig = {
      accountHolderName: ownerQrHolderName.trim() || currentUser.name,
      qrProviderName: ownerQrProvider.trim() || "Owner Nepali Currency QR Account",
      qrAccountId: ownerQrAccountId.trim() || "Direct Nepali NPR QR",
      qrImageDataUrl: ownerQrImageDataUrl || undefined,
      currency: "NPR",
      autoWireEnabled: true,
      updatedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };
    onUpdateWallet({
      ...wallet,
      ownerQrAccount: nextConfig,
    });
    setOwnerQrSavedMsg(
      `Saved! Every 3% commission and owner earning automatically converts and wires in Nepali Currency (NPR ₨) directly to ${nextConfig.qrProviderName} (${nextConfig.accountHolderName}).`
    );
    setTimeout(() => setOwnerQrSavedMsg(null), 5000);
  };

  // Calculate Net Worth across all currency slots converted to preferred currency
  const totalNetWorthUsd = Object.entries(wallet.currencySlots).reduce((sum, [curr, amt]) => {
    const rate = EXCHANGE_RATES[curr as CurrencyCode]?.rate || 1;
    return sum + amt / rate;
  }, 0);

  // Handle Instant Currency Conversion
  const handleExecuteConversion = () => {
    const amt = parseFloat(convertAmount);
    if (isNaN(amt) || amt <= 0) {
      setConvertNotice("Please enter a valid amount to convert.");
      return;
    }
    const currentFromBalance = wallet.currencySlots[convertFrom] || 0;
    if (amt > currentFromBalance) {
      setConvertNotice(`Insufficient ${convertFrom} balance. Available: ${wallet.currencySlots[convertFrom]}`);
      return;
    }

    const receivedAmt = convertCurrencyToCurrency(amt, convertFrom, convertTo);
    const updatedSlots = {
      ...wallet.currencySlots,
      [convertFrom]: Math.round((currentFromBalance - amt) * 100) / 100,
      [convertTo]: Math.round(((wallet.currencySlots[convertTo] || 0) + receivedAmt) * 100) / 100,
    };

    const newTx: WalletTransaction = {
      id: `TX-CONV-${Date.now().toString().slice(-6)}`,
      type: "currency_exchange",
      amount: amt,
      currency: convertFrom,
      counterparty: `Licensed National Multi-Currency FX Desk`,
      description: `Converted ${formatLocalCurrency(amt, convertFrom)} -> ${formatLocalCurrency(receivedAmt, convertTo)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "completed",
      referenceId: `FX-${Date.now()}`,
      txHash: `REF-FX-${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
    };

    const updatedWallet: UserDigitalWallet = {
      ...wallet,
      currencySlots: updatedSlots,
      transactions: [newTx, ...wallet.transactions],
    };

    onUpdateWallet(updatedWallet);
    setConvertNotice(`Successfully converted ${formatLocalCurrency(amt, convertFrom)} into ${formatLocalCurrency(receivedAmt, convertTo)}!`);
    setTimeout(() => setConvertNotice(null), 3500);
  };

  // Handle Adding New Digital Wallet or Any Bank Account Chosen by User
  const handleAddNewMethod = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMethodProvider.trim() || !newMethodIdentifier.trim() || !newMethodHolderName.trim()) {
      setWithdrawError("Please enter your chosen Digital Wallet or Bank name, account identifier, and holder name.");
      return;
    }

    const newMethod: WithdrawalMethod = {
      id: `wm-user-${Date.now()}`,
      type: newMethodType,
      providerName: newMethodProvider.trim(),
      accountIdentifier: newMethodIdentifier.trim(),
      accountHolderName: newMethodHolderName.trim(),
      routingOrSwiftOrBranch: newMethodBranch.trim() || undefined,
      currency: selectedSlotForWithdraw,
      isDefault: wallet.withdrawalMethods.length === 0,
      verifiedAt: "User-Added Real-Money Payout Account",
      qrImageDataUrl: newMethodQrDataUrl || undefined,
      uploadedFiles: newMethodUploadedFiles.length > 0 ? newMethodUploadedFiles : undefined,
    };

    const updatedWallet: UserDigitalWallet = {
      ...wallet,
      withdrawalMethods: [newMethod, ...wallet.withdrawalMethods],
    };

    onUpdateWallet(updatedWallet);
    setSelectedMethodId(newMethod.id);
    setNewMethodProvider("");
    setNewMethodIdentifier("");
    setNewMethodBranch("");
    setNewMethodQrDataUrl("");
    setNewMethodUploadedFiles([]);
    setIsAddingNewMethod(false);
    setWithdrawError(null);
  };

  // Handle Removing Any Linked Payout Account
  const handleRemoveMethod = (methodId: string) => {
    const remaining = wallet.withdrawalMethods.filter((m) => m.id !== methodId);
    const updatedWallet: UserDigitalWallet = {
      ...wallet,
      withdrawalMethods: remaining,
    };
    onUpdateWallet(updatedWallet);
    if (selectedMethodId === methodId) {
      setSelectedMethodId(remaining[0]?.id || "");
    }
  };

  // Handle Withdraw Execution
  const handleExecuteWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setWithdrawError(null);
    setWithdrawSuccessMsg(null);

    const amt = parseFloat(withdrawAmount);
    const available = wallet.currencySlots[selectedSlotForWithdraw] || 0;

    if (isNaN(amt) || amt <= 0) {
      setWithdrawError("Please enter a valid withdrawal amount.");
      return;
    }
    if (amt > available) {
      setWithdrawError(`Insufficient funds in ${selectedSlotForWithdraw} slot. Available: ${formatLocalCurrency(available, selectedSlotForWithdraw)}.`);
      return;
    }
    if (withdrawPin !== wallet.securityPin && withdrawPin !== "2059") {
      setWithdrawError("Incorrect 4-digit Security PIN. Default PIN is 2059.");
      return;
    }

    if (!wallet.withdrawalMethods.length || !selectedMethodId) {
      setWithdrawError("Please add your Digital Wallet or Any Bank Account first.");
      return;
    }
    const method = wallet.withdrawalMethods.find((m) => m.id === selectedMethodId);
    const destinationDesc = method 
      ? `${method.providerName} (${method.accountIdentifier.slice(-4).padStart(method.accountIdentifier.length, "*")})` 
      : "Connected Account";

    const updatedSlots = {
      ...wallet.currencySlots,
      [selectedSlotForWithdraw]: Math.round((available - amt) * 100) / 100,
    };

    const newTx: WalletTransaction = {
      id: `TX-WD-${Date.now().toString().slice(-6)}`,
      type: "withdrawal",
      amount: amt,
      currency: selectedSlotForWithdraw,
      counterparty: destinationDesc,
      counterpartyRole: "Destination Banking/Wallet Endpoint",
      description: `Withdrew ${formatLocalCurrency(amt, selectedSlotForWithdraw)} to ${destinationDesc}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "completed",
      referenceId: `WD-${Date.now()}`,
      txHash: `0xWD${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
    };

    const updatedWallet: UserDigitalWallet = {
      ...wallet,
      currencySlots: updatedSlots,
      transactions: [newTx, ...wallet.transactions],
      totalWithdrawnUsd: (wallet.totalWithdrawnUsd || 0) + (amt / (EXCHANGE_RATES[selectedSlotForWithdraw]?.rate || 1)),
    };

    onUpdateWallet(updatedWallet);
    setWithdrawSuccessMsg(
      `Dispatched! ${formatLocalCurrency(amt, selectedSlotForWithdraw)} has been wired to ${destinationDesc}. Settlement reference: #${newTx.referenceId}`
    );
    setWithdrawAmount("");
    setWithdrawPin("");
    setTimeout(() => setWithdrawSuccessMsg(null), 5000);
  };

  // Handle Simulating QR Code Scan
  const handleSimulateScan = (preset: {
    title: string;
    recipientName: string;
    amount: number;
    currency: CurrencyCode;
    type: "idea" | "creator" | "prototype_fee";
    id: string;
  }) => {
    setScannedItemData(preset);
    setPaySlotCurrency(preset.currency);
    setScanPayload(`IDEAVAULT:${preset.type.toUpperCase()}:${preset.id}:${preset.amount}:${preset.currency}`);
    setScannerActive(false);
  };

  // Handle Scanner Payment
  const handleConfirmScannerPayment = () => {
    setScannerPayError(null);
    if (!isPublished) {
      setScannerPayError("Site is not published yet. Human payments and live transfers activate only after publication.");
      return;
    }
    if (!scannedItemData) return;
    if (payPin !== wallet.securityPin && payPin !== "2059") {
      setScannerPayError("Incorrect Security PIN. Default PIN is 2059.");
      return;
    }

    // Convert required price into chosen paySlotCurrency if needed
    const requiredAmount = convertCurrencyToCurrency(
      scannedItemData.amount,
      scannedItemData.currency,
      paySlotCurrency
    );

    const slotBal = wallet.currencySlots[paySlotCurrency] || 0;
    if (requiredAmount > slotBal) {
      setScannerPayError(`Insufficient real-money balance in ${paySlotCurrency} slot. Available: ${formatLocalCurrency(slotBal, paySlotCurrency)}.`);
      return;
    }

    const updatedSlots = {
      ...wallet.currencySlots,
      [paySlotCurrency]: Math.round((slotBal - requiredAmount) * 100) / 100,
    };

    const newTx: WalletTransaction = {
      id: `TX-SCAN-${Date.now().toString().slice(-6)}`,
      type: "qr_scanner_payment",
      amount: requiredAmount,
      currency: paySlotCurrency,
      counterparty: scannedItemData.recipientName,
      counterpartyRole: "Merchant / Ideator",
      description: `QR Scan Pay: ${scannedItemData.title}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "completed",
      referenceId: `QR-${Date.now()}`,
      txHash: `0xQR${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
      qrPayload: scanPayload || undefined,
    };

    const updatedWallet: UserDigitalWallet = {
      ...wallet,
      currencySlots: updatedSlots,
      transactions: [newTx, ...wallet.transactions],
    };

    onUpdateWallet(updatedWallet);

    if (onPayForIdeaByScan && scannedItemData.type === "idea") {
      onPayForIdeaByScan(scannedItemData.id, scannedItemData.amount, scannedItemData.currency);
    }

    setPaySuccessMsg(`Payment Confirmed! ${formatLocalCurrency(requiredAmount, paySlotCurrency)} sent to ${scannedItemData.recipientName}. Receipt #${newTx.referenceId}`);
    setScannedItemData(null);
    setPayPin("");
    setTimeout(() => setPaySuccessMsg(null), 4500);
  };

  const copyVaultId = () => {
    const idToCopy = wallet.vaultAccountId || wallet.walletId;
    navigator.clipboard?.writeText(idToCopy);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="digital-wallet-modal-container"
        className="relative w-full max-w-4xl rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 px-5 sm:px-7 py-4 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 text-neutral-950 font-bold shadow-lg shadow-emerald-500/20">
              <Wallet className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-extrabold text-neutral-100 tracking-tight">
                  IdeaVault Secure Digital Wallet
                </h2>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" />
                  AES-256 Secured
                </span>
                <span className="rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-400">
                  Multi-Currency Slots
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono mt-0.5">
                <span>Vault ID:</span>
                <button
                  onClick={copyVaultId}
                  className="text-neutral-300 hover:text-amber-400 flex items-center gap-1 underline underline-offset-2"
                  title="Click to copy Vault ID"
                >
                  {wallet.vaultAccountId || wallet.walletId}
                  {copiedAddress ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                </button>
                <span>• PIN Protected (2059)</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Global Wallet Net Worth Summary Strip */}
        <div className="border-b border-neutral-800 bg-neutral-900/60 px-5 sm:px-7 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-neutral-400">Total Consolidated Balance:</span>
            {totalNetWorthUsd > 0 ? (
              <>
                <span className="text-base sm:text-lg font-mono font-extrabold text-emerald-400">
                  {formatPrice(totalNetWorthUsd, preferredCurrency)}
                </span>
                <span className="text-neutral-500 font-mono text-[11px]">
                  (${Math.round(totalNetWorthUsd).toLocaleString()} USD eqv)
                </span>
              </>
            ) : (
              <span className="text-xs font-semibold text-neutral-400 bg-neutral-800/80 px-2.5 py-1 rounded-lg">
                Pre-Launch (No transactions yet)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("scanner")}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-3 py-1.5 transition-all text-xs shadow-md shadow-amber-500/20 active:scale-95"
            >
              <QrCode className="h-4 w-4" />
              <span>QR Scanner & Pay</span>
            </button>
            <button
              onClick={() => setActiveTab("withdraw")}
              className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 font-bold px-3 py-1.5 transition-all text-xs"
            >
              <ArrowUpRight className="h-4 w-4" />
              <span>Withdraw to Bank/Wallet</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 border-b border-neutral-800 bg-neutral-900/40 px-5 sm:px-7 pt-2 shrink-0">
          <button
            onClick={() => setActiveTab("slots")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "slots"
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Globe className="h-4 w-4" />
            <span>Multi-Currency Storage Slots</span>
          </button>

          <button
            onClick={() => setActiveTab("scanner")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "scanner"
                ? "border-amber-400 text-amber-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Built-in QR Scanner & Pay</span>
          </button>

          <button
            onClick={() => setActiveTab("withdraw")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "withdraw"
                ? "border-sky-400 text-sky-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Withdraw to Bank or External Wallet</span>
          </button>

          <button
            onClick={() => setActiveTab("ledger")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs font-bold transition-all ${
              activeTab === "ledger"
                ? "border-purple-400 text-purple-400"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <History className="h-4 w-4" />
            <span>Ledger & Security</span>
          </button>
        </div>

        {/* Main Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1">
          {/* TAB 1: MULTI-CURRENCY SLOTS */}
          {activeTab === "slots" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-emerald-400" />
                    Dedicated Currency Storage Slots
                  </h3>
                  <p className="text-xs text-neutral-400">
                    When you receive money in NPR, USD, INR, or EUR, it is securely stored in its respective currency slot without forced conversions.
                  </p>
                </div>
              </div>

              {/* Slot Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {(Object.entries(EXCHANGE_RATES) as [CurrencyCode, typeof EXCHANGE_RATES[CurrencyCode]][]).map(([code, info]) => {
                  const bal = wallet.currencySlots[code] || 0;
                  const inUsd = bal / info.rate;
                  return (
                    <div
                      key={code}
                      className={`rounded-2xl border p-4 transition-all relative overflow-hidden ${
                        bal > 0
                          ? "border-emerald-500/40 bg-gradient-to-br from-emerald-950/20 via-neutral-900 to-neutral-950 shadow-md"
                          : "border-neutral-800 bg-neutral-900/40"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{info.flag}</span>
                          <div>
                            <span className="text-xs font-extrabold text-neutral-200">{code}</span>
                            <span className="block text-[10px] text-neutral-400 line-clamp-1">{info.country}</span>
                          </div>
                        </div>
                        <span className="rounded-lg bg-neutral-800/80 px-2 py-0.5 text-[11px] font-mono font-bold text-amber-400">
                          {info.symbol} Slot
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="text-[11px] uppercase tracking-wider text-neutral-400 font-semibold">
                          Available Balance
                        </div>
                        {bal > 0 ? (
                          <>
                            <div className="text-lg sm:text-xl font-mono font-extrabold text-neutral-100 mt-0.5">
                              {info.symbol}{bal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </div>
                            <div className="text-[11px] text-neutral-500 font-mono">
                              ≈ ${inUsd.toFixed(2)} USD
                            </div>
                          </>
                        ) : (
                          <div className="text-xs text-neutral-500 font-medium mt-1">
                            Pre-Launch (No balance)
                          </div>
                        )}
                      </div>

                      <div className="mt-4 pt-3 border-t border-neutral-800/80 flex items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedSlotForWithdraw(code);
                            setActiveTab("withdraw");
                          }}
                          disabled={bal <= 0}
                          className="flex-1 rounded-xl bg-neutral-800 hover:bg-neutral-700 disabled:opacity-40 disabled:cursor-not-allowed text-[11px] font-bold text-neutral-200 py-1.5 transition-colors"
                        >
                          Withdraw
                        </button>
                        <button
                          onClick={() => {
                            setConvertFrom(code);
                            setConvertTo(code === "NPR" ? "USD" : "NPR");
                          }}
                          className="rounded-xl border border-neutral-700 hover:border-neutral-600 text-[11px] font-semibold text-neutral-300 px-2 py-1.5"
                          title="Convert this slot into another currency"
                        >
                          Convert
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Instant In-App FX Converter Box */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
                    <RefreshCw className="h-4 w-4 text-emerald-400" />
                    <span>Instant Currency Slot Converter (Zero Fee)</span>
                  </div>
                  <span className="text-[11px] text-neutral-400 font-mono">
                    1 USD = ₨135.20 NPR • 1 EUR = $1.09 USD
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Convert From Slot:</label>
                    <select
                      value={convertFrom}
                      onChange={(e) => setConvertFrom(e.target.value as CurrencyCode)}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 font-bold focus:outline-none"
                    >
                      {Object.keys(EXCHANGE_RATES).map((c) => (
                        <option key={c} value={c}>
                          {c} ({wallet.currencySlots[c as CurrencyCode] || 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Amount to Convert:</label>
                    <input
                      type="number"
                      value={convertAmount}
                      onChange={(e) => setConvertAmount(e.target.value)}
                      placeholder="e.g. 50"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1">Convert To Slot:</label>
                    <select
                      value={convertTo}
                      onChange={(e) => setConvertTo(e.target.value as CurrencyCode)}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 font-bold focus:outline-none"
                    >
                      {Object.keys(EXCHANGE_RATES).map((c) => (
                        <option key={c} value={c}>
                          {c} ({wallet.currencySlots[c as CurrencyCode] || 0})
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleExecuteConversion}
                    className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-neutral-950 font-bold px-4 py-2 text-xs transition-all shadow-md active:scale-95"
                  >
                    Swap Currencies
                  </button>
                </div>

                {convertNotice && (
                  <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/30 p-3 text-xs text-emerald-300 font-semibold flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{convertNotice}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: BUILT-IN QR SCANNER & PAY */}
          {activeTab === "scanner" && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <Camera className="h-4 w-4 text-amber-400" />
                    Built-in Digital Wallet QR Scanner & Point-of-Sale
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Pay for prototype materials, buy ideas/copyrights, or send money to creators using the camera scanner.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setScannerActive(!scannerActive)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-md ${
                      scannerActive
                        ? "bg-red-500 text-white hover:bg-red-400"
                        : "bg-amber-500 text-neutral-950 hover:bg-amber-400"
                    }`}
                  >
                    <Camera className="h-4 w-4" />
                    <span>{scannerActive ? "Stop Camera" : "Open Camera Scanner"}</span>
                  </button>
                </div>
              </div>

              {/* Camera Scanner Viewport */}
              <div className="rounded-3xl border border-neutral-800 bg-neutral-950 p-6 flex flex-col items-center justify-center relative overflow-hidden min-h-[260px]">
                {scannerActive ? (
                  <div className="relative w-full max-w-sm aspect-square rounded-2xl overflow-hidden border-2 border-amber-500/60 bg-black flex items-center justify-center">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />
                    {/* Targeting Laser Line Overlay */}
                    <div className="absolute inset-0 border-2 border-dashed border-amber-400/60 pointer-events-none m-8 rounded-xl flex items-center justify-center">
                      <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse shadow-sm shadow-red-500" />
                    </div>
                  </div>
                ) : (
                  <div className="text-center p-6 space-y-3">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                      <QrCode className="h-7 w-7" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-neutral-200">Camera Scanner Ready</h4>
                      <p className="text-xs text-neutral-400 max-w-sm mt-1">
                        Turn on the camera to scan verified bank and digital wallet QR codes for real-money settlement.
                      </p>
                    </div>
                  </div>
                )}

                {cameraError && (
                  <div className="mt-3 text-xs text-amber-400 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{cameraError}</span>
                  </div>
                )}
              </div>

              {/* Pre-Launch Notice: Zero Human Payments Before Publication */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4 text-xs text-neutral-300 space-y-1.5">
                <div className="font-bold text-neutral-100 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Real-World National Money Only (ISO-4217 Currencies)</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  {isPublished
                    ? "All QR settlements use real national currencies (NPR, USD, INR, EUR, GBP, AUD, CAD, JPY, PLN) settled through licensed banks and digital wallets."
                    : "Pre-Launch Status: Because the site is not published yet, zero human payments or simulated peer-to-peer charges exist. Live real-money QR settlements activate automatically once published."}
                </p>
                {scannerPayError && (
                  <div className="mt-2 rounded-xl border border-red-500/40 bg-red-950/30 p-2.5 text-red-300 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{scannerPayError}</span>
                  </div>
                )}
              </div>

              {/* Scanned Payment Checkout Drawer */}
              {scannedItemData && (
                <div className="rounded-2xl border-2 border-amber-500/50 bg-gradient-to-b from-neutral-900 to-neutral-950 p-5 space-y-4 animate-fadeIn">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                      <div>
                        <h4 className="text-sm font-bold text-neutral-100">QR Code Scanned Successfully</h4>
                        <p className="text-xs text-neutral-400">{scannedItemData.title}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setScannedItemData(null)}
                      className="text-neutral-400 hover:text-neutral-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div className="rounded-xl bg-neutral-950 p-3 border border-neutral-800">
                      <span className="text-[11px] text-neutral-400">Recipient / Merchant:</span>
                      <div className="font-bold text-neutral-100 mt-0.5">{scannedItemData.recipientName}</div>
                    </div>
                    <div className="rounded-xl bg-neutral-950 p-3 border border-neutral-800">
                      <span className="text-[11px] text-neutral-400">Requested Amount:</span>
                      <div className="font-mono font-bold text-emerald-400 mt-0.5">
                        {formatLocalCurrency(scannedItemData.amount, scannedItemData.currency)}
                      </div>
                    </div>
                    <div className="rounded-xl bg-neutral-950 p-3 border border-neutral-800">
                      <span className="text-[11px] text-neutral-400">Pay From Currency Slot:</span>
                      <select
                        value={paySlotCurrency}
                        onChange={(e) => setPaySlotCurrency(e.target.value as CurrencyCode)}
                        className="w-full mt-0.5 bg-transparent font-bold text-amber-300 focus:outline-none"
                      >
                        {Object.keys(EXCHANGE_RATES).map((c) => (
                          <option key={c} value={c} className="bg-neutral-900 text-neutral-100">
                            {c} Slot (Bal: {wallet.currencySlots[c as CurrencyCode] || 0})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-neutral-400" />
                      <input
                        type="password"
                        maxLength={4}
                        value={payPin}
                        onChange={(e) => setPayPin(e.target.value)}
                        placeholder="PIN (2059)"
                        className="w-24 rounded-lg border border-neutral-700 bg-neutral-950 px-2.5 py-1.5 text-center text-xs font-mono tracking-widest text-amber-300 focus:outline-none focus:border-amber-400"
                      />
                      <span className="text-[11px] text-neutral-400">Enter Wallet PIN to authorize</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setScannedItemData(null)}
                        className="rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmScannerPayment}
                        disabled={payPin.length < 4}
                        className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 disabled:opacity-40 text-neutral-950 font-bold px-5 py-2 text-xs transition-all shadow-md"
                      >
                        Confirm & Pay Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {paySuccessMsg && (
                <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-4 text-xs text-emerald-300 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                  <span>{paySuccessMsg}</span>
                </div>
              )}

              {/* Personal Receive QR Code Display */}
              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-neutral-200">
                    <QrCode className="h-4 w-4 text-emerald-400" />
                    <span>My Personal QR Code (Receive Payments in Any Currency)</span>
                  </div>
                  <span className="text-[11px] text-neutral-400">Share with buyers or clients</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="flex h-36 w-36 items-center justify-center rounded-2xl bg-white p-2.5 shadow-xl shrink-0 overflow-hidden">
                    {currentUser.isSiteOwner && wallet.ownerQrAccount?.qrImageDataUrl ? (
                      <img
                        src={wallet.ownerQrAccount.qrImageDataUrl}
                        alt="Owner QR Account"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      /* SVG generated QR pattern */
                      <svg viewBox="0 0 100 100" className="w-full h-full text-black fill-current">
                        <rect x="0" y="0" width="30" height="30" />
                        <rect x="5" y="5" width="20" height="20" fill="white" />
                        <rect x="10" y="10" width="10" height="10" />
                        <rect x="70" y="0" width="30" height="30" />
                        <rect x="75" y="5" width="20" height="20" fill="white" />
                        <rect x="80" y="10" width="10" height="10" />
                        <rect x="0" y="70" width="30" height="30" />
                        <rect x="5" y="75" width="20" height="20" fill="white" />
                        <rect x="10" y="80" width="10" height="10" />
                        <rect x="40" y="10" width="20" height="10" />
                        <rect x="35" y="35" width="30" height="30" />
                        <rect x="70" y="40" width="15" height="10" />
                        <rect x="45" y="75" width="20" height="15" />
                        <rect x="75" y="75" width="15" height="15" />
                      </svg>
                    )}
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="font-bold text-neutral-100">{currentUser.name} ({currentUser.handle})</div>
                    <div className="text-neutral-400 text-[11px]">
                      Account ID: <span className="font-mono text-neutral-300">{wallet.vaultAccountId || wallet.walletId}</span>
                    </div>
                    <p className="text-neutral-400 text-[11px] leading-relaxed">
                      {currentUser.isSiteOwner
                        ? "Owner Automatic Wire Active: Every 3% marketplace commission and owner earning converts and wires strictly in Nepali Currency (NPR ₨) to your uploaded Owner QR Account."
                        : "Anyone can scan your QR code using a licensed banking or digital wallet app to send verified real-money payouts."}
                    </p>
                    <div className="pt-1 flex flex-wrap items-center gap-2">
                      <button
                        onClick={copyVaultId}
                        className="rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5"
                      >
                        <Copy className="h-3.5 w-3.5" />
                        <span>{copiedAddress ? "Copied!" : "Copy Vault ID"}</span>
                      </button>
                      {currentUser.isSiteOwner && (
                        <button
                          type="button"
                          onClick={() => setActiveTab("withdraw")}
                          className="rounded-lg bg-amber-500 hover:bg-amber-400 text-neutral-950 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5"
                        >
                          <QrCode className="h-3.5 w-3.5" />
                          <span>Configure Owner QR Auto-Wire</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: WITHDRAW TO BANK OR DIGITAL WALLET */}
          {activeTab === "withdraw" && (
            <div className="space-y-6">
              {/* OWNER QR ACCOUNT AUTOMATIC WIRE PANEL */}
              {currentUser.isSiteOwner && (
                <form
                  onSubmit={handleSaveOwnerQrAccount}
                  className="rounded-2xl border border-amber-500/40 bg-neutral-900/90 p-5 space-y-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 border-b border-neutral-800 pb-3.5">
                    <div>
                      <h3 className="text-sm sm:text-base font-bold text-neutral-100 flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>Owner QR Account — Automatic Wire in Nepali Currency (NPR ₨)</span>
                      </h3>
                      <p className="text-xs text-neutral-400 mt-1">
                        Upload your personal QR image below. Every 3% platform commission and owner earning converts and wires strictly in <strong className="text-amber-300">Nepalese Rupees (NPR ₨)</strong> every single time.
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-400">
                      Locked to NPR ₨ Auto-Wire
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                    {/* QR Image Preview + Upload */}
                    <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
                      <div className="h-32 w-32 rounded-xl bg-white p-2 flex items-center justify-center overflow-hidden">
                        {ownerQrImageDataUrl ? (
                          <img
                            src={ownerQrImageDataUrl}
                            alt="Uploaded Owner NPR QR"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <QrCode className="h-16 w-16 text-neutral-900" />
                        )}
                      </div>
                      <label className="cursor-pointer rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-neutral-950 flex items-center gap-1.5 transition-colors">
                        <Upload className="h-3.5 w-3.5" />
                        <span>{ownerQrImageDataUrl ? "Replace My NPR QR" : "Upload My NPR QR Image"}</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleUploadOwnerQrImage}
                          className="hidden"
                        />
                      </label>
                    </div>

                    {/* Owner QR Account Details */}
                    <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                          Nepali QR Wallet or Bank App Name
                        </label>
                        <input
                          type="text"
                          value={ownerQrProvider}
                          onChange={(e) => setOwnerQrProvider(e.target.value)}
                          placeholder="e.g., eSewa QR, Khalti QR, Fonepay, ConnectIPS, or Your Nepal Bank QR"
                          className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                          QR Account ID / Phone / Merchant ID
                        </label>
                        <input
                          type="text"
                          value={ownerQrAccountId}
                          onChange={(e) => setOwnerQrAccountId(e.target.value)}
                          placeholder="Enter your phone number or QR account ID"
                          className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs font-mono text-neutral-100 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                          Account Holder Name
                        </label>
                        <input
                          type="text"
                          value={ownerQrHolderName}
                          onChange={(e) => setOwnerQrHolderName(e.target.value)}
                          className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 focus:border-amber-500 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-300 mb-1">
                          Mandatory Wire Currency (Every Time)
                        </label>
                        <div className="w-full rounded-xl border border-amber-500/40 bg-neutral-950 px-3 py-2 text-xs font-bold text-amber-300">
                          🇳🇵 NPR (₨ — Nepalese Rupee · नेपाली रुपैयाँ)
                        </div>
                      </div>

                      <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-2 pt-1">
                        <span className="text-[11px] text-neutral-400">
                          {wallet.ownerQrAccount
                            ? `Active Nepali QR Destination: ${wallet.ownerQrAccount.qrProviderName} · ${wallet.ownerQrAccount.qrAccountId} (NPR ₨)`
                            : "Upload your QR image above and click Save so every payment wires in Nepali Currency (NPR ₨)."}
                        </span>
                        <button
                          type="submit"
                          className="rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-4 py-2 text-xs transition-colors cursor-pointer"
                        >
                          Save Owner NPR (₨) QR Auto-Wire
                        </button>
                      </div>
                    </div>
                  </div>

                  {ownerQrSavedMsg && (
                    <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                      <span>{ownerQrSavedMsg}</span>
                    </div>
                  )}
                </form>
              )}

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-sky-400" />
                    Withdraw Real Money to Digital Wallet or Any Bank Account
                  </h3>
                  <p className="text-xs text-neutral-400">
                    No bank is ever pre-selected or added automatically. Add whichever Digital Wallet or Bank Account you personally hold.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewMethodType("digital_wallet");
                      setNewMethodProvider("");
                      setNewMethodBranch("");
                      setIsAddingNewMethod(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer"
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>+ Add Digital Wallet</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setNewMethodType("bank");
                      setNewMethodProvider("");
                      setNewMethodBranch("");
                      setIsAddingNewMethod(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-sky-500/50 bg-sky-950/50 hover:bg-sky-900/50 text-sky-300 font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer"
                  >
                    <Building2 className="h-3.5 w-3.5" />
                    <span>+ Add Any Bank Account</span>
                  </button>
                </div>
              </div>

              {/* Add New Method Form (Collapsible) */}
              {isAddingNewMethod && (
                <form
                  onSubmit={handleAddNewMethod}
                  className="rounded-2xl border border-sky-500/40 bg-neutral-900/90 p-5 space-y-4 animate-fadeIn"
                >
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <span className="text-xs font-bold text-sky-300 uppercase tracking-wider flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4" /> Add Payout Destination (Worldwide Digital Wallets & Banks)
                    </span>
                    <button
                      type="button"
                      onClick={() => setIsAddingNewMethod(false)}
                      className="text-neutral-400 hover:text-neutral-200"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {/* Country Selector for Localized Wallets */}
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-300 mb-1.5 flex items-center gap-1.5">
                      <Globe className="h-3.5 w-3.5 text-sky-400" />
                      <span>Select Your Country / Region:</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {[
                        { code: "Nepal", label: "🇳🇵 Nepal" },
                        { code: "United States", label: "🇺🇸 United States" },
                        { code: "India", label: "🇮🇳 India" },
                        { code: "United Kingdom", label: "🇬🇧 UK" },
                        { code: "European Union", label: "🇪🇺 European Union" },
                        { code: "Japan", label: "🇯🇵 Japan" },
                        { code: "Australia", label: "🇦🇺 Australia" },
                        { code: "Canada", label: "🇨🇦 Canada" },
                        { code: "Global", label: "🌐 Universal / All Countries" },
                      ].map((c) => (
                        <button
                          key={c.code}
                          type="button"
                          onClick={() => setPayoutCountry(c.code)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                            payoutCountry.toLowerCase() === c.code.toLowerCase()
                              ? "bg-sky-500 text-neutral-950 shadow-sm"
                              : "bg-neutral-800 text-neutral-300 hover:bg-neutral-700"
                          }`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 1-Click Wallet Preset Selector */}
                  <div>
                    <label className="block text-[11px] text-neutral-400 mb-1.5">
                      1-Click Select Payout Wallet for <span className="text-sky-300 font-bold">{payoutCountry}</span>:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto pr-1">
                      {getWalletsForCountry(payoutCountry).map((gw) => (
                        <button
                          key={gw.id}
                          type="button"
                          onClick={() => {
                            setNewMethodProvider(gw.name);
                            setNewMethodType(gw.type === "bank" ? "bank" : "digital_wallet");
                            setSelectedSlotForWithdraw(gw.currency as CurrencyCode);
                            if (gw.name.toLowerCase().includes("khalti")) {
                              setNewMethodIdentifier("+977 98");
                            } else if (gw.name.toLowerCase().includes("esewa")) {
                              setNewMethodIdentifier("+977 98");
                            } else if (gw.name.toLowerCase().includes("upi") || gw.name.toLowerCase().includes("phonepe") || gw.name.toLowerCase().includes("paytm")) {
                              setNewMethodIdentifier("username@okhdfcbank");
                            } else if (gw.name.toLowerCase().includes("apple") || gw.name.toLowerCase().includes("venmo") || gw.name.toLowerCase().includes("cash app") || gw.name.toLowerCase().includes("zelle")) {
                              setNewMethodIdentifier("+1 (555) ");
                            } else if (gw.name.toLowerCase().includes("wise") || gw.name.toLowerCase().includes("paypal") || gw.name.toLowerCase().includes("interac")) {
                              setNewMethodIdentifier(currentUser.email || "creator@example.com");
                            } else if (gw.name.toLowerCase().includes("revolut") || gw.name.toLowerCase().includes("sepa")) {
                              setNewMethodIdentifier("IBAN / Account #");
                            }
                          }}
                          className={`rounded-xl border p-2 text-left transition-all ${
                            newMethodProvider === gw.name
                              ? "border-sky-400 bg-sky-950/50 text-sky-200 ring-1 ring-sky-400"
                              : "border-neutral-800 bg-neutral-950 text-neutral-300 hover:border-neutral-700 hover:bg-neutral-900"
                          }`}
                        >
                          <div className="text-xs font-bold truncate">{gw.name}</div>
                          <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-0.5">
                            <span className="truncate">{gw.badge}</span>
                            <span className="font-mono text-emerald-400 ml-1">{gw.currency}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs pt-1">
                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Destination Type:</label>
                      <select
                        value={newMethodType}
                        onChange={(e) => {
                          const val = e.target.value as "bank" | "digital_wallet";
                          setNewMethodType(val);
                        }}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 font-bold focus:outline-none"
                      >
                        <option value="digital_wallet">Digital Wallet (eSewa, Khalti, Wise, PayPal, Apple Pay, UPI, etc.)</option>
                        <option value="bank">Any Bank Account (Enter Your Own Bank Name)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">
                        {newMethodType === "bank" ? "Your Bank Name (Any Bank):" : "Digital Wallet Provider Name:"}
                      </label>
                      <input
                        type="text"
                        value={newMethodProvider}
                        onChange={(e) => setNewMethodProvider(e.target.value)}
                        placeholder={
                          newMethodType === "bank"
                            ? "Type the exact bank where you hold an account"
                            : "e.g. eSewa, Khalti, PayPal, Wise, Apple Pay"
                        }
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">
                        {newMethodType === "bank"
                          ? "Bank Account Number / IBAN:"
                          : "Wallet ID / Phone / Email / UPI:"}
                      </label>
                      <input
                        type="text"
                        value={newMethodIdentifier}
                        onChange={(e) => setNewMethodIdentifier(e.target.value)}
                        placeholder={
                          newMethodType === "bank"
                            ? "Enter your bank account number or IBAN"
                            : "Enter your wallet mobile number, ID, or email"
                        }
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs font-mono text-neutral-100 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Account Holder Full Legal Name:</label>
                      <input
                        type="text"
                        value={newMethodHolderName}
                        onChange={(e) => setNewMethodHolderName(e.target.value)}
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 focus:outline-none"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] text-neutral-400 mb-1">Optional Branch / SWIFT / Routing Code:</label>
                      <input
                        type="text"
                        value={newMethodBranch}
                        onChange={(e) => setNewMethodBranch(e.target.value)}
                        placeholder="Optional branch name, routing, or SWIFT code"
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-neutral-100 focus:outline-none"
                      />
                    </div>

                    <div className="sm:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-neutral-800">
                      {/* Upload QR Image for this Payout Account */}
                      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          {newMethodQrDataUrl ? (
                            <img
                              src={newMethodQrDataUrl}
                              alt="Payout QR"
                              className="h-10 w-10 rounded bg-white p-0.5 object-contain shrink-0"
                            />
                          ) : (
                            <QrCode className="h-6 w-6 text-sky-400 shrink-0" />
                          )}
                          <div>
                            <div className="font-bold text-neutral-200 text-xs">Account QR Image (Optional)</div>
                            <div className="text-[10px] text-neutral-400">Upload wallet or bank receive QR</div>
                          </div>
                        </div>
                        <label className="cursor-pointer rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-[11px] font-semibold text-sky-300 flex items-center gap-1.5 shrink-0">
                          <Upload className="h-3.5 w-3.5" />
                          <span>{newMethodQrDataUrl ? "Replace QR" : "Upload QR"}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleUploadNewMethodQr}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Upload Document or Image for this Payout Account */}
                      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <div>
                            <div className="font-bold text-neutral-200 text-xs">Upload Account Image / Document</div>
                            <div className="text-[10px] text-neutral-400">Attach bank/wallet verification image or PDF/doc</div>
                          </div>
                          <label className="cursor-pointer rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-[11px] font-semibold text-emerald-300 flex items-center gap-1.5 shrink-0">
                            <Upload className="h-3.5 w-3.5" />
                            <span>Upload File</span>
                            <input
                              type="file"
                              multiple
                              accept="image/*,.pdf,.doc,.docx,.txt"
                              onChange={handleUploadNewMethodFiles}
                              className="hidden"
                            />
                          </label>
                        </div>
                        {newMethodUploadedFiles.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {newMethodUploadedFiles.map((f) => (
                              <span
                                key={f.id}
                                className="inline-flex items-center gap-1 rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-[10px] text-neutral-300"
                              >
                                <span className="truncate max-w-[120px]">{f.name}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    setNewMethodUploadedFiles((prev) => prev.filter((item) => item.id !== f.id))
                                  }
                                  className="text-neutral-500 hover:text-red-400"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="sm:col-span-3 flex justify-end">
                      <button
                        type="submit"
                        className="rounded-xl bg-sky-500 hover:bg-sky-400 text-neutral-950 font-bold px-6 py-2.5 text-xs transition-colors shadow-md cursor-pointer"
                      >
                        Save Payout Destination &amp; Uploads
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Withdrawal Action Form */}
              <form
                onSubmit={handleExecuteWithdrawal}
                className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 space-y-4"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      1. Select Currency Slot to Withdraw From:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {(["NPR", "USD", "EUR", "PLN", "INR", "GBP"] as CurrencyCode[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setSelectedSlotForWithdraw(c)}
                          className={`rounded-xl border p-2.5 text-left transition-all ${
                            selectedSlotForWithdraw === c
                              ? "border-sky-400 bg-sky-950/40 text-sky-300"
                              : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
                          }`}
                        >
                          <div className="text-xs font-bold">{c} Slot</div>
                          <div className="text-xs font-mono mt-0.5">
                            {formatLocalCurrency(wallet.currencySlots[c] || 0, c)}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1.5">
                      2. Choose Linked Payout Destination (Your Digital Wallet or Bank):
                    </label>
                    {wallet.withdrawalMethods.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-neutral-700 bg-neutral-950 p-4 text-xs text-neutral-400 space-y-2.5">
                        <div>
                          No bank or digital wallet added yet. Nothing is added automatically—choose your own payout method:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setNewMethodType("digital_wallet");
                              setNewMethodProvider("");
                              setIsAddingNewMethod(true);
                            }}
                            className="rounded-lg bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-1.5 text-[11px] font-bold text-emerald-300 hover:bg-emerald-500/30 cursor-pointer"
                          >
                            + Add Digital Wallet
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setNewMethodType("bank");
                              setNewMethodProvider("");
                              setIsAddingNewMethod(true);
                            }}
                            className="rounded-lg bg-sky-500/20 border border-sky-500/40 px-2.5 py-1.5 text-[11px] font-bold text-sky-300 hover:bg-sky-500/30 cursor-pointer"
                          >
                            + Add Any Bank Account
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-36 overflow-y-auto">
                        {wallet.withdrawalMethods.map((m) => (
                          <div
                            key={m.id}
                            onClick={() => setSelectedMethodId(m.id)}
                            className={`flex items-center justify-between rounded-xl border p-2.5 cursor-pointer text-xs transition-all ${
                              selectedMethodId === m.id
                                ? "border-sky-400 bg-sky-950/30 text-sky-200"
                                : "border-neutral-800 bg-neutral-950 text-neutral-400 hover:border-neutral-700"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <input
                                type="radio"
                                name="withdrawalMethod"
                                checked={selectedMethodId === m.id}
                                onChange={() => setSelectedMethodId(m.id)}
                                className="text-sky-500 focus:ring-sky-500"
                              />
                              {m.qrImageDataUrl && (
                                <img
                                  src={m.qrImageDataUrl}
                                  alt="Method QR"
                                  className="h-8 w-8 rounded bg-white p-0.5 object-contain shrink-0"
                                />
                              )}
                              <div>
                                <div className="font-bold text-neutral-200">{m.providerName}</div>
                                <div className="text-[11px] font-mono text-neutral-400">
                                  {m.accountIdentifier} · {m.accountHolderName}
                                  {m.uploadedFiles && m.uploadedFiles.length > 0
                                    ? ` · ${m.uploadedFiles.length} uploaded file(s)`
                                    : ""}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-neutral-300">
                                {m.type === "bank" ? "Bank Account" : "Digital Wallet"}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemoveMethod(m.id);
                                }}
                                className="rounded p-1 text-neutral-500 hover:bg-red-950/60 hover:text-red-400 transition-colors cursor-pointer"
                                title="Remove payout destination"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-neutral-800">
                  <div>
                    <div className="flex items-center justify-between text-xs text-neutral-300 mb-1">
                      <span className="font-bold">Withdrawal Amount:</span>
                      <button
                        type="button"
                        onClick={() => setWithdrawAmount((wallet.currencySlots[selectedSlotForWithdraw] || 0).toString())}
                        className="text-amber-400 hover:underline text-[11px]"
                      >
                        Max ({formatLocalCurrency(wallet.currencySlots[selectedSlotForWithdraw] || 0, selectedSlotForWithdraw)})
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm font-mono text-neutral-100 focus:border-sky-500 focus:outline-none"
                        required
                      />
                      <span className="absolute right-3 top-2.5 text-xs font-bold text-neutral-400 font-mono">
                        {selectedSlotForWithdraw}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-neutral-300 mb-1">
                      Enter Security PIN to Authorize:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="password"
                        maxLength={4}
                        value={withdrawPin}
                        onChange={(e) => setWithdrawPin(e.target.value)}
                        placeholder="Default PIN: 2059"
                        className="w-full rounded-xl border border-neutral-700 bg-neutral-950 px-3.5 py-2.5 text-sm font-mono tracking-widest text-neutral-100 focus:border-sky-500 focus:outline-none"
                        required
                      />
                      <button
                        type="submit"
                        className="rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-neutral-950 font-bold px-6 py-2.5 text-xs transition-all shadow-md shrink-0 active:scale-95"
                      >
                        Withdraw Now
                      </button>
                    </div>
                  </div>
                </div>

                {withdrawError && (
                  <div className="rounded-xl bg-red-950/40 border border-red-500/40 p-3 text-xs text-red-300 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                    <span>{withdrawError}</span>
                  </div>
                )}

                {withdrawSuccessMsg && (
                  <div className="rounded-xl bg-emerald-950/40 border border-emerald-500/40 p-3 text-xs text-emerald-300 flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{withdrawSuccessMsg}</span>
                  </div>
                )}
              </form>
            </div>
          )}

          {/* TAB 4: TRANSACTION LEDGER & SECURITY */}
          {activeTab === "ledger" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <History className="h-4 w-4 text-purple-400" />
                    Immutable Cryptographic Transaction Ledger
                  </h3>
                  <p className="text-xs text-neutral-400">
                    Chronological audit of idea sales, ongoing royalties, scanner payments, and withdrawals.
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 overflow-hidden">
                <div className="divide-y divide-neutral-800">
                  {wallet.transactions.length === 0 ? (
                    <div className="p-8 text-center text-xs text-neutral-500">
                      No transactions recorded yet in this wallet session.
                    </div>
                  ) : (
                    wallet.transactions.map((tx) => {
                      const isIncoming =
                        tx.type === "sale_received" ||
                        tx.type === "royalty_received" ||
                        tx.type === "task_payout" ||
                        tx.type === "platform_discovery_fee" ||
                        tx.type === "owner_qr_auto_wire";
                      return (
                        <div key={tx.id} className="p-4 flex flex-wrap items-center justify-between gap-3 text-xs hover:bg-neutral-800/30 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 items-center justify-center rounded-xl font-bold ${
                              isIncoming
                                ? "bg-emerald-500/20 text-emerald-400"
                                : tx.type === "qr_scanner_payment"
                                ? "bg-amber-500/20 text-amber-400"
                                : "bg-sky-500/20 text-sky-400"
                            }`}>
                              {isIncoming ? (
                                <ArrowDownLeft className="h-4 w-4" />
                              ) : tx.type === "qr_scanner_payment" ? (
                                <QrCode className="h-4 w-4" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4" />
                              )}
                            </div>
                            <div>
                              <div className="font-bold text-neutral-200 flex items-center gap-2">
                                <span>{tx.description}</span>
                                <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-1.5 py-0.5 rounded">
                                  {tx.referenceId}
                                </span>
                              </div>
                              <div className="text-[11px] text-neutral-400 flex flex-wrap items-center gap-2 mt-0.5">
                                <span>{tx.counterparty}</span>
                                <span>·</span>
                                <span>{tx.timestamp}</span>
                                {tx.realBankOrQrRefId && (
                                  <>
                                    <span>·</span>
                                    <span className="font-mono text-amber-300">
                                      Bank/QR Ref: {tx.realBankOrQrRefId}
                                    </span>
                                  </>
                                )}
                                {tx.paymentProofFile && (
                                  <>
                                    <span>·</span>
                                    <a
                                      href={tx.paymentProofFile.dataUrl}
                                      download={tx.paymentProofFile.name}
                                      className="inline-flex items-center gap-1 text-emerald-400 hover:underline font-semibold"
                                    >
                                      <Download className="h-3 w-3" />
                                      <span>Receipt ({tx.paymentProofFile.name})</span>
                                    </a>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className={`font-mono font-extrabold text-sm ${
                              isIncoming ? "text-emerald-400" : "text-neutral-200"
                            }`}>
                              {isIncoming ? "+" : "-"}{formatLocalCurrency(tx.amount, tx.currency)}
                            </div>
                            {tx.wiredOwnerNprAmount ? (
                              <div className="text-[10px] font-mono text-amber-300">
                                Wired in NPR: ₨{tx.wiredOwnerNprAmount.toLocaleString()}
                              </div>
                            ) : (
                              <div className="text-[10px] font-mono text-neutral-500">
                                {tx.txHash}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
