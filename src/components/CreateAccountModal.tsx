import React, { useState, useEffect } from "react";
import {
  UserProfile,
  CurrencyCode,
  AccountCreationType,
  CategoryType,
  AccountUploadedFile,
  OwnerQrAccountConfig,
} from "../types";
import {
  EXCHANGE_RATES,
  generateFixedTermRoyaltyLawDraft,
  downloadLawDraftDocument,
} from "../utils/legalAndCurrency";
import { CATEGORIES_LIST } from "../data/seedData";
import { isSitePublishedLive } from "../utils/syncEngine";
import {
  UserPlus,
  X,
  CheckCircle2,
  AlertCircle,
  Mail,
  Phone,
  User,
  Scale,
  Lightbulb,
  Briefcase,
  Building2,
  Wallet,
  Plus,
  FileText,
  Download,
  Upload,
  Image as ImageIcon,
  QrCode,
  Crown,
  Trash2,
} from "lucide-react";

interface CreateAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccountCreated: (user: UserProfile) => void;
  initialAccountType?: AccountCreationType;
  currentOwner?: UserProfile;
  onUpdateOwnerAccount?: (updatedOwner: UserProfile) => void;
}

const COUNTRIES: { name: string; code: CurrencyCode; dial: string }[] = [
  { name: "Nepal", code: "NPR", dial: "+977" },
  { name: "United States", code: "USD", dial: "+1" },
  { name: "India", code: "INR", dial: "+91" },
  { name: "United Kingdom", code: "GBP", dial: "+44" },
  { name: "European Union", code: "EUR", dial: "+49" },
  { name: "Australia", code: "AUD", dial: "+61" },
  { name: "Canada", code: "CAD", dial: "+1" },
  { name: "Japan", code: "JPY", dial: "+81" },
  { name: "Poland", code: "PLN", dial: "+48" },
];

export const CreateAccountModal: React.FC<CreateAccountModalProps> = ({
  isOpen,
  onClose,
  onAccountCreated,
  initialAccountType = "idea_poster",
  currentOwner,
  onUpdateOwnerAccount,
}) => {
  const isPublished = isSitePublishedLive();

  const [accountType, setAccountType] = useState<AccountCreationType>(initialAccountType);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("Nepal");
  const [phone, setPhone] = useState("+977 ");
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>("NPR");

  // Uploaded Profile Image + Uploaded Documents / Images (Available on EVERY Account Option)
  const [profileImageDataUrl, setProfileImageDataUrl] = useState<string>("");
  const [uploadedFiles, setUploadedFiles] = useState<AccountUploadedFile[]>([]);
  const [accountQrDataUrl, setAccountQrDataUrl] = useState<string>("");

  // Owner Specific Nepali Currency (NPR) QR Auto-Wire Fields
  const [ownerQrProvider, setOwnerQrProvider] = useState<string>("");
  const [ownerQrAccountId, setOwnerQrAccountId] = useState<string>("");
  const [ownerSavedSuccess, setOwnerSavedSuccess] = useState<string | null>(null);

  // Idea Poster specific fields
  const [profession, setProfession] = useState("");
  const [preferredDealModel, setPreferredDealModel] = useState<
    "keep_copyright" | "full_buyout" | "licensed_fixed_term"
  >("keep_copyright");
  const [showLawDraftPreview, setShowLawDraftPreview] = useState(false);

  // Investor specific fields (All Available Sectors + Custom Sector Input)
  const [investorCompany, setInvestorCompany] = useState("");
  const [selectedInterests, setSelectedInterests] = useState<string[]>([
    "Physical Hardware & Robotics",
    "Tech & AI Software",
  ]);
  const [customSectors, setCustomSectors] = useState<string[]>([]);
  const [customSectorInput, setCustomSectorInput] = useState("");

  const [agreedToRules, setAgreedToRules] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preLaunchInfo, setPreLaunchInfo] = useState<string | null>(null);

  // Populate fields appropriately when switching between Investor, Idea Poster, and Owner Account
  useEffect(() => {
    if (isOpen) {
      setAccountType(initialAccountType);
      setError(null);
      setPreLaunchInfo(null);
      setOwnerSavedSuccess(null);
    }
  }, [isOpen, initialAccountType]);

  useEffect(() => {
    if (!isOpen) return;
    setError(null);
    setPreLaunchInfo(null);
    setOwnerSavedSuccess(null);

    if (accountType === "owner" && currentOwner) {
      setName(currentOwner.name || "Medha Koirala");
      setEmail(currentOwner.email || "medha.koirala33@gmail.com");
      setCountry(currentOwner.country || "Nepal");
      setPhone(currentOwner.phone || "+977 ");
      setPreferredCurrency("NPR");
      setProfession(currentOwner.profession || "Founder & Copyright Proprietor");
      const hasCustomPhoto =
        currentOwner.avatar &&
        currentOwner.avatar.startsWith("data:image/") &&
        !currentOwner.avatar.startsWith("data:image/svg+xml");
      setProfileImageDataUrl(hasCustomPhoto ? currentOwner.avatar : "");
      setUploadedFiles(currentOwner.uploadedFiles || []);
      setAccountQrDataUrl(
        currentOwner.wallet?.ownerQrAccount?.qrImageDataUrl ||
          currentOwner.receiveQrImageDataUrl ||
          ""
      );
      setOwnerQrProvider(currentOwner.wallet?.ownerQrAccount?.qrProviderName || "");
      setOwnerQrAccountId(currentOwner.wallet?.ownerQrAccount?.qrAccountId || "");
      setAgreedToRules(true);
    } else if (accountType !== "owner") {
      if (name === (currentOwner?.name || "Medha Koirala")) {
        setName("");
        setEmail("");
        setProfileImageDataUrl("");
        setUploadedFiles([]);
        setAccountQrDataUrl("");
        setAgreedToRules(false);
      }
    }
  }, [accountType, isOpen, currentOwner]);

  if (!isOpen) return null;

  const selectableCategories = CATEGORIES_LIST.filter(
    (c): c is Exclude<CategoryType, "All Ideas"> => c !== "All Ideas"
  );

  const handleCountryChange = (cName: string) => {
    setCountry(cName);
    const found = COUNTRIES.find((c) => c.name === cName);
    if (found) {
      if (accountType !== "owner") {
        setPreferredCurrency(found.code);
      }
      setPhone(found.dial + " ");
    }
  };

  // Profile Image Upload Handler (Every Account Option)
  const handleProfilePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setProfileImageDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Supporting Documents or Images Upload Handler (Every Account Option)
  const handleFilesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          const isImage = file.type.startsWith("image/");
          const newDoc: AccountUploadedFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            name: file.name,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size,
            kind: isImage ? "image" : "document",
            dataUrl: reader.result,
            uploadedAt: new Date().toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            }),
          };
          setUploadedFiles((prev) => [...prev, newDoc]);
        }
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const handleRemoveUploadedFile = (id: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.id !== id));
  };

  // QR Image Upload Handler (Owner NPR QR + Investor/Poster Receive QR)
  const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setAccountQrDataUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const allStandardSelected = selectableCategories.every((cat) =>
    selectedInterests.includes(cat)
  );

  const toggleInterest = (cat: string) => {
    setSelectedInterests((prev) =>
      prev.includes(cat) ? prev.filter((item) => item !== cat) : [...prev, cat]
    );
  };

  const handleToggleAllSectors = () => {
    if (allStandardSelected) {
      setSelectedInterests([]);
    } else {
      setSelectedInterests([...selectableCategories]);
    }
  };

  const handleAddCustomSector = () => {
    const trimmed = customSectorInput.trim();
    if (!trimmed) return;
    if (!customSectors.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
      setCustomSectors((prev) => [...prev, trimmed]);
    }
    setCustomSectorInput("");
  };

  const handleRemoveCustomSector = (sectorToRemove: string) => {
    setCustomSectors((prev) => prev.filter((s) => s !== sectorToRemove));
  };

  const lawDraftText = generateFixedTermRoyaltyLawDraft({
    creatorName: name.trim() || "[Idea Poster Legal Name]",
    creatorCountry: country,
    investorName: "[Acquiring Investor / Commercial Licensee]",
    ideaTitle: "[Licensed Product Under 3-Year Term]",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setPreLaunchInfo(null);
    setOwnerSavedSuccess(null);

    if (!name.trim() || !email.trim()) {
      setError("Please enter your full name and valid email address.");
      return;
    }

    const readableRomanRegex = /^[\p{L}\p{N}\s._'-]+$/u;
    if (!readableRomanRegex.test(name.trim())) {
      setError("Profile name must use readable text (English or Roman script of any language).");
      return;
    }

    // OWNER ACCOUNT SAVE (Works immediately in both Pre-Launch and Live Published modes)
    if (accountType === "owner") {
      if (!currentOwner || !onUpdateOwnerAccount) {
        setError("Owner profile reference unavailable.");
        return;
      }

      const fallbackAvatar =
        currentOwner.avatar ||
        `data:image/svg+xml;utf8,${encodeURIComponent(
          `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="#b45309"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#0a0a0a" font-family="sans-serif" font-weight="800" font-size="42">MK</text></svg>`
        )}`;

      const nextOwnerQr: OwnerQrAccountConfig | undefined =
        accountQrDataUrl || ownerQrProvider.trim() || ownerQrAccountId.trim()
          ? {
              accountHolderName: name.trim(),
              qrProviderName: ownerQrProvider.trim() || "Personal Nepali QR Account",
              qrAccountId: ownerQrAccountId.trim() || phone.trim() || "Direct NPR QR",
              qrImageDataUrl: accountQrDataUrl || undefined,
              currency: "NPR", // Always Nepali Currency (NPR) every time
              autoWireEnabled: true,
              updatedAt: new Date().toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              }),
            }
          : currentOwner.wallet?.ownerQrAccount;

      const updatedOwner: UserProfile = {
        ...currentOwner,
        name: name.trim(),
        email: email.trim(),
        country: country || "Nepal",
        phone: phone.trim(),
        profession: profession.trim() || "Founder & Copyright Proprietor",
        preferredCurrency: "NPR",
        avatar: profileImageDataUrl || fallbackAvatar,
        uploadedFiles,
        receiveQrImageDataUrl: accountQrDataUrl || undefined,
        isSiteOwner: true,
        isPermanentOwner: true,
        role: "site_owner",
        accountType: "owner",
        wallet: {
          ...currentOwner.wallet,
          ownerQrAccount: nextOwnerQr,
        },
      };

      onUpdateOwnerAccount(updatedOwner);
      setOwnerSavedSuccess(
        "Owner Account saved! Your uploaded images/documents and Nepali Currency (NPR ₨) QR code are active—every real-money payment's 3% commission wires to your QR in NPR."
      );
      return;
    }

    if (!agreedToRules) {
      setError("Please accept the legal terms below to continue.");
      return;
    }

    if (!isPublished) {
      setPreLaunchInfo(
        `Pre-Launch Mode: The ${
          accountType === "investor" ? "Investor" : "Idea Poster"
        } account form (including image & document uploads) is ready, and external human accounts activate automatically once IdeaVault is published live.`
      );
      return;
    }

    const cleanHandle = `@${name.toLowerCase().replace(/[^\p{L}\p{N}]/gu, "_").slice(0, 24)}`;
    const initialsSvg = `data:image/svg+xml;utf8,${encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120"><rect width="120" height="120" rx="24" fill="${
        accountType === "investor" ? "#064e3b" : "#78350f"
      }"/><text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="#f8fafc" font-family="sans-serif" font-weight="700" font-size="42">${name
        .trim()
        .slice(0, 2)
        .toUpperCase()}</text></svg>`
    )}`;

    const isInvestor = accountType === "investor";

    const newUser: UserProfile = {
      id: `user-${isInvestor ? "inv" : "poster"}-${Date.now()}`,
      name: name.trim(),
      handle: cleanHandle,
      avatar: profileImageDataUrl || initialsSvg,
      role: isInvestor ? "builder_buyer" : "creator_ideator",
      accountType: isInvestor ? "investor" : "idea_poster",
      headline: isInvestor
        ? `${investorCompany.trim() || "Independent Angel Investor"} · Verified Investor`
        : `${profession.trim() || "Domain Creator"} · Idea Poster`,
      profession: isInvestor
        ? investorCompany.trim() || "Commercial Investor & Acquirer"
        : profession.trim() || "Independent Idea Creator",
      investorCompany: isInvestor ? investorCompany.trim() || "Independent Investor" : undefined,
      customInvestmentSectors: isInvestor && customSectors.length > 0 ? customSectors : undefined,
      preferredDealModel,
      backgroundField: isInvestor
        ? "Venture Acquisition & Product Commercialization"
        : profession.trim() || "Domain Problem Solving",
      isNonTech: !isInvestor,
      isRealHuman: true,
      passedHumanVerification: false,
      interests:
        [...selectedInterests, ...customSectors].length > 0
          ? Array.from(new Set([...selectedInterests, ...customSectors]))
          : ["Consumer Products & Lifestyle", "Everyday Life Hacks & Tools"],
      skills: isInvestor
        ? ["Capital Allocation", "Product Scaling", "IP Acquisition"]
        : ["Original Ideation", "Frontline Domain Insight"],
      balance: 0,
      escrowBalance: 0,
      totalRoyaltiesEarned: 0,
      activeContractsCount: 0,
      isSiteOwner: false,
      email: email.trim(),
      country,
      phone: phone.trim(),
      preferredCurrency,
      uploadedFiles,
      receiveQrImageDataUrl: accountQrDataUrl || undefined,
      wallet: {
        walletId: `VAULT-${Date.now().toString().slice(-6)}`,
        vaultAccountId: `VAULT-${name.replace(/[^a-zA-Z0-9]/g, "").slice(0, 8).toUpperCase()}${Date.now().toString().slice(-4)}`,
        securityPin: "2059",
        biometricsEnabled: true,
        isLocked: false,
        currencySlots: { USD: 0, NPR: 0, INR: 0, EUR: 0, GBP: 0, AUD: 0, CAD: 0, JPY: 0, PLN: 0 },
        withdrawalMethods: [],
        transactions: [],
      },
      strikesCount: 0,
      isBanned: false,
      strikeRecords: [],
      agreedToUnAndNepalLaws: true,
    };

    onAccountCreated(newUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="modal-create-account"
        className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              {accountType === "owner" ? (
                <Crown className="h-5 w-5" />
              ) : (
                <UserPlus className="h-5 w-5" />
              )}
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                {accountType === "owner"
                  ? "My Owner Account — Uploads & Nepali Currency (NPR) Auto-Wire QR"
                  : "Account Setup & Document / Image Uploads"}
              </h2>
              <p className="text-xs text-neutral-400">
                Investor Account, Idea Poster Account, and Owner Account ({currentOwner?.name || "Medha Koirala"})
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {!isPublished && accountType !== "owner" && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-950/25 p-3.5 text-xs text-amber-200 flex items-start gap-2.5">
              <AlertCircle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold text-amber-300 block">
                  Pre-Launch Preview — Zero External Human Accounts Active Yet
                </strong>
                <span>
                  External Investor and Idea Poster sign-ups activate once published. Switch to <strong>My Owner Account</strong> right below to save your own photos, documents, and Nepali QR code immediately.
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-500/40 bg-red-950/30 p-3 text-xs text-red-300 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {preLaunchInfo && (
            <div className="rounded-xl border border-sky-500/40 bg-sky-950/30 p-3.5 text-xs text-sky-200 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0 mt-0.5" />
              <span>{preLaunchInfo}</span>
            </div>
          )}

          {ownerSavedSuccess && (
            <div className="rounded-xl border border-emerald-500/40 bg-emerald-950/35 p-3.5 text-xs text-emerald-200 flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{ownerSavedSuccess}</span>
            </div>
          )}

          {/* ACCOUNT OPTIONS SELECTOR (Investor, Idea Poster, AND My Owner Account) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-neutral-300">
              Select Account Option <span className="text-amber-400">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Option 1: Investor Account */}
              <button
                type="button"
                id="select-account-investor"
                onClick={() => setAccountType("investor")}
                className={`text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                  accountType === "investor"
                    ? "border-emerald-500 bg-emerald-950/30 shadow-md"
                    : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Briefcase className={`h-4 w-4 ${accountType === "investor" ? "text-emerald-400" : "text-neutral-400"}`} />
                    <span className="text-xs font-bold text-neutral-100">1. Investor Account</span>
                  </div>
                  {accountType === "investor" && (
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Acquire copyrights or license products with real-money payments &amp; document uploads.
                </p>
              </button>

              {/* Option 2: Idea Poster Account */}
              <button
                type="button"
                id="select-account-idea-poster"
                onClick={() => setAccountType("idea_poster")}
                className={`text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                  accountType === "idea_poster"
                    ? "border-amber-500 bg-amber-950/30 shadow-md"
                    : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Lightbulb className={`h-4 w-4 ${accountType === "idea_poster" ? "text-amber-400" : "text-neutral-400"}`} />
                    <span className="text-xs font-bold text-neutral-100">2. Idea Poster Account</span>
                  </div>
                  {accountType === "idea_poster" && (
                    <CheckCircle2 className="h-4 w-4 text-amber-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Post ideas free, upload sketches/docs &amp; receive real-money buyouts or 15% royalties.
                </p>
              </button>

              {/* Option 3: My Owner Account */}
              <button
                type="button"
                id="select-account-owner"
                onClick={() => setAccountType("owner")}
                className={`text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                  accountType === "owner"
                    ? "border-sky-500 bg-sky-950/30 shadow-md"
                    : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5">
                    <Crown className={`h-4 w-4 ${accountType === "owner" ? "text-amber-400" : "text-neutral-400"}`} />
                    <span className="text-xs font-bold text-neutral-100">My Owner Account</span>
                  </div>
                  {accountType === "owner" && (
                    <CheckCircle2 className="h-4 w-4 text-sky-400 shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Upload your photo, documents &amp; Nepali Currency (NPR ₨) QR code for automatic wires.
                </p>
              </button>
            </div>
          </div>

          {/* Full Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {accountType === "investor"
                  ? "Investor Full Name"
                  : accountType === "owner"
                  ? "Owner Full Legal Name"
                  : "Creator / Idea Poster Name"}{" "}
                <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full legal name"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-10 pr-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Email Address <span className="text-amber-400">*</span>
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-10 pr-3.5 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Country & Real-Money ISO-4217 Currency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Country <span className="text-amber-400">*</span>
              </label>
              <select
                value={country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 focus:border-amber-500 focus:outline-none"
              >
                {COUNTRIES.map((c) => (
                  <option key={c.name} value={c.name}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                {accountType === "owner"
                  ? "Owner Wire Currency (Locked NPR)"
                  : accountType === "investor"
                  ? "Settlement Currency"
                  : "Payout Currency"}{" "}
                <span className="text-amber-400">*</span>
              </label>
              {accountType === "owner" ? (
                <div className="w-full rounded-xl border border-amber-500/40 bg-neutral-950 px-3 py-2.5 text-sm font-bold text-amber-300">
                  ₨ NPR — Nepalese Rupee (Always)
                </div>
              ) : (
                <select
                  value={preferredCurrency}
                  onChange={(e) => setPreferredCurrency(e.target.value as CurrencyCode)}
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2.5 text-sm text-neutral-100 focus:border-amber-500 focus:outline-none"
                >
                  {Object.entries(EXCHANGE_RATES).map(([code, info]) => (
                    <option key={code} value={code}>
                      {info.symbol} {code} — {info.country}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+977 98XXXXXXXX"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-10 pr-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none font-mono tabular-nums"
                />
              </div>
            </div>
          </div>

          {/* UNIVERSAL UPLOAD SECTION: PROFILE IMAGE + DOCUMENTS OR IMAGES (EVERY ACCOUNT OPTION) */}
          <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-800 pb-3">
              <div>
                <h3 className="text-xs font-bold text-neutral-100 flex items-center gap-2">
                  <Upload className="h-4 w-4 text-amber-400" />
                  <span>Upload Profile Image &amp; Supporting Documents or Images</span>
                </h3>
                <p className="text-[11px] text-neutral-400 mt-0.5">
                  Available on every account option (Investor, Idea Poster, and Owner). Attach photos, IDs, PDFs, sketches, or registration documents.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Upload Profile / Account Image */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 flex items-center gap-3.5">
                <div className="h-14 w-14 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden shrink-0">
                  {profileImageDataUrl ? (
                    <img
                      src={profileImageDataUrl}
                      alt="Account Profile"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-neutral-500" />
                  )}
                </div>
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="text-xs font-semibold text-neutral-200">
                    Account Profile Image
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 px-3 py-1.5 text-[11px] font-semibold text-neutral-100 transition-colors">
                      <Upload className="h-3.5 w-3.5 text-amber-400" />
                      <span>{profileImageDataUrl ? "Change Image" : "Upload Image"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleProfilePhotoUpload}
                        className="hidden"
                      />
                    </label>
                    {profileImageDataUrl && (
                      <button
                        type="button"
                        onClick={() => setProfileImageDataUrl("")}
                        className="text-[11px] text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. Upload Documents or Images (Multi-File) */}
              <div className="rounded-xl border border-neutral-800 bg-neutral-900/60 p-3.5 flex flex-col justify-center space-y-2">
                <div className="text-xs font-semibold text-neutral-200">
                  Upload Document or Image Files
                </div>
                <p className="text-[11px] text-neutral-400">
                  Supports PNG, JPG, WEBP, PDF, DOC, DOCX, or TXT files.
                </p>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 px-3.5 py-1.5 text-xs font-bold text-neutral-950 transition-colors">
                    <FileText className="h-3.5 w-3.5" />
                    <span>+ Upload Document or Image</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*,.pdf,.doc,.docx,.txt"
                      onChange={handleFilesUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Uploaded Files List */}
            {uploadedFiles.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-neutral-800/80">
                <div className="text-[11px] font-semibold text-neutral-300">
                  Attached Account Documents &amp; Images ({uploadedFiles.length})
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {uploadedFiles.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between gap-2 rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        {file.kind === "image" ? (
                          <img
                            src={file.dataUrl}
                            alt={file.name}
                            className="h-8 w-8 rounded object-cover shrink-0 border border-neutral-700"
                          />
                        ) : (
                          <FileText className="h-5 w-5 text-sky-400 shrink-0" />
                        )}
                        <div className="min-w-0">
                          <div className="font-medium text-neutral-200 truncate">{file.name}</div>
                          <div className="text-[10px] text-neutral-500">
                            {Math.max(1, Math.round(file.sizeBytes / 1024))} KB · {file.uploadedAt}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={file.dataUrl}
                          download={file.name}
                          className="rounded bg-neutral-800 hover:bg-neutral-700 px-2 py-1 text-[10px] font-semibold text-neutral-200"
                        >
                          Save
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveUploadedFile(file.id)}
                          className="p-1 text-neutral-400 hover:text-red-400"
                          title="Remove file"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* QR CODE UPLOAD SECTION (Dedicated NPR Auto-Wire for Owner + Optional QR for Investor/Poster) */}
          {accountType === "owner" ? (
            <div className="rounded-xl border border-amber-500/40 bg-neutral-950 p-4 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-neutral-800 pb-3">
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-amber-300 flex items-center gap-2">
                    <QrCode className="h-4 w-4 text-amber-400" />
                    <span>My Owner QR Code Upload — Automatic Wire in Nepali Currency (NPR ₨)</span>
                  </h3>
                  <p className="text-[11px] text-neutral-300 mt-0.5 leading-relaxed">
                    Upload your real Nepali QR image (eSewa, Khalti, Fonepay, NepalPay, or any bank QR you hold). Every real-money transaction&apos;s 3% commission and owner sale converts and wires to this QR account in <strong>Nepalese Rupees (₨ NPR)</strong> every time.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
                <div className="flex flex-col items-center justify-center rounded-xl border border-neutral-800 bg-neutral-900 p-3 space-y-2.5">
                  <div className="h-28 w-28 rounded-xl bg-white p-2 flex items-center justify-center overflow-hidden">
                    {accountQrDataUrl ? (
                      <img
                        src={accountQrDataUrl}
                        alt="Owner NPR QR"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <QrCode className="h-14 w-14 text-neutral-900" />
                    )}
                  </div>
                  <label className="cursor-pointer rounded-lg bg-amber-500 hover:bg-amber-400 px-3 py-1.5 text-[11px] font-bold text-neutral-950 flex items-center gap-1.5 transition-colors">
                    <Upload className="h-3.5 w-3.5" />
                    <span>{accountQrDataUrl ? "Replace My NPR QR" : "Upload My NPR QR"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleQrImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div className="sm:col-span-2 space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      My Nepali QR Wallet or Bank Name (Zero Pre-Selected Banks)
                    </label>
                    <input
                      type="text"
                      value={ownerQrProvider}
                      onChange={(e) => setOwnerQrProvider(e.target.value)}
                      placeholder="e.g., eSewa QR, Khalti QR, Fonepay QR, or Your Own Bank QR"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-300 mb-1">
                      QR Phone Number / Merchant / Account ID
                    </label>
                    <input
                      type="text"
                      value={ownerQrAccountId}
                      onChange={(e) => setOwnerQrAccountId(e.target.value)}
                      placeholder="e.g., +977 98XXXXXXXX or QR Merchant ID"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs font-mono text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div className="text-[11px] text-emerald-400 font-medium">
                    Settlement Currency Locked: Nepalese Rupee (₨ NPR) — All foreign buyer payments automatically convert to NPR at live FX and wire directly to your QR.
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-white p-1.5 flex items-center justify-center overflow-hidden shrink-0">
                  {accountQrDataUrl ? (
                    <img
                      src={accountQrDataUrl}
                      alt="Account QR"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <QrCode className="h-7 w-7 text-neutral-900" />
                  )}
                </div>
                <div>
                  <div className="text-xs font-semibold text-neutral-200">
                    Optional: Upload Your Payment / Receive QR Code Image
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    Attach your wallet or bank QR image so verified counterparties can pay you directly in real money.
                  </div>
                </div>
              </div>
              <label className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-3 py-1.5 text-xs font-semibold text-neutral-200 transition-colors">
                <Upload className="h-3.5 w-3.5 text-emerald-400" />
                <span>{accountQrDataUrl ? "Change QR Image" : "Upload QR Image"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleQrImageUpload}
                  className="hidden"
                />
              </label>
            </div>
          )}

          {/* Role-Specific Configuration for Investor vs Idea Poster */}
          {accountType === "investor" && (
            <div className="rounded-xl border border-emerald-500/30 bg-neutral-950 p-4 space-y-4">
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                <span>Investor Profile &amp; Sector Selection</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Firm / Company / Angel Entity (Optional)
                </label>
                <input
                  type="text"
                  value={investorCompany}
                  onChange={(e) => setInvestorCompany(e.target.value)}
                  placeholder="e.g., Independent Angel or Venture Studio"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <label className="block text-xs font-semibold text-neutral-300">
                    Sector to Invest — Select from All Available Sectors
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleAllSectors}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold border transition-colors cursor-pointer ${
                      allStandardSelected
                        ? "border-emerald-400 bg-emerald-500/25 text-emerald-200"
                        : "border-neutral-700 bg-neutral-900 text-emerald-400 hover:bg-neutral-800"
                    }`}
                  >
                    {allStandardSelected ? "✓ All Available Sectors Selected" : "Select All Available Sectors"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {selectableCategories.map((cat) => {
                    const active = selectedInterests.includes(cat);
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => toggleInterest(cat)}
                        className={`rounded-lg px-2.5 py-1.5 text-xs font-medium border transition-colors cursor-pointer ${
                          active
                            ? "border-emerald-500 bg-emerald-500/20 text-emerald-200"
                            : "border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 pt-1 border-t border-neutral-800/80">
                <label className="block text-xs font-semibold text-neutral-300">
                  Or Type Custom Sector(s) to Invest In
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customSectorInput}
                    onChange={(e) => setCustomSectorInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddCustomSector();
                      }
                    }}
                    placeholder="Type any custom sector (e.g., Clean Water Tech, Agri-Biotech, Aviation)..."
                    className="flex-1 rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomSector}
                    className="flex items-center gap-1 rounded-xl border border-emerald-500/40 bg-emerald-500/15 hover:bg-emerald-500/25 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-colors cursor-pointer shrink-0"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Sector</span>
                  </button>
                </div>

                {customSectors.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[11px] text-neutral-400 mr-1">Custom sectors:</span>
                    {customSectors.map((sector) => (
                      <button
                        key={sector}
                        type="button"
                        onClick={() => handleRemoveCustomSector(sector)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/50 bg-emerald-950/50 px-2.5 py-1 text-xs font-medium text-emerald-200 hover:border-red-500/50 hover:text-red-200 transition-colors cursor-pointer"
                        title="Click to remove custom sector"
                      >
                        <span>{sector}</span>
                        <X className="h-3 w-3 text-neutral-400" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {accountType === "idea_poster" && (
            <div className="rounded-xl border border-amber-500/30 bg-neutral-950 p-4 space-y-4">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Lightbulb className="h-4 w-4" />
                <span>Idea Poster Domain &amp; Monetization Structure</span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1">
                  Your Real-World Field or Profession (Non-Tech Welcome)
                </label>
                <input
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g., Nurse, Chef, Machinist, Farmer, Student"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-neutral-300">
                  Choose Monetization Structure (3 Options) <span className="text-amber-400">*</span>
                </label>

                <div className="space-y-2.5">
                  <button
                    type="button"
                    onClick={() => setPreferredDealModel("keep_copyright")}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                      preferredDealModel === "keep_copyright"
                        ? "border-emerald-500 bg-emerald-950/30"
                        : "border-neutral-800 bg-neutral-900/70 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-neutral-100">
                        1. Post Idea: Keep Copyrights + 15% Royalty
                      </span>
                      <span className="text-[11px] font-semibold text-emerald-400 shrink-0">
                        Keep Copyright · 15% Royalty
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      You post an idea, keep 100% of your copyrights, and earn a 15% ongoing royalty on commercialized sales.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredDealModel("full_buyout")}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                      preferredDealModel === "full_buyout"
                        ? "border-amber-500 bg-amber-950/30"
                        : "border-neutral-800 bg-neutral-900/70 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-neutral-100">
                        2. Sell Copyrights — No Royalty (0% Royalty)
                      </span>
                      <span className="text-[11px] font-semibold text-amber-400 shrink-0">
                        Full Buyout · 0% Royalty
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      You sell 100% of the copyrights for an upfront real-money buyout sum, leading to no ongoing royalty (0% royalty).
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPreferredDealModel("licensed_fixed_term")}
                    className={`w-full text-left rounded-xl border p-3.5 transition-all cursor-pointer ${
                      preferredDealModel === "licensed_fixed_term"
                        ? "border-sky-500 bg-sky-950/30"
                        : "border-neutral-800 bg-neutral-900/70 hover:border-neutral-700"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-neutral-100">
                        3. 3-Year Licensed Product (15% Royalty) + 1.5-Year Max Royalty Law Draft
                      </span>
                      <span className="text-[11px] font-semibold text-sky-400 shrink-0">
                        Strict 1.5-Yr Royalty Cap
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1 leading-relaxed">
                      Licensed product structure for 3 years accompanied by a formal Law Draft Document stating strictly 1.5 years (18 months) of 15% royalty — and no more than 1.5 years (0% thereafter).
                    </p>
                  </button>
                </div>

                {preferredDealModel === "licensed_fixed_term" && (
                  <div className="mt-2 rounded-xl border border-sky-500/40 bg-neutral-900/90 p-3.5 space-y-2.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-sky-300">
                        <FileText className="h-4 w-4 text-sky-400" />
                        <span>Official Law Draft Document (Strict 1.5-Year Maximum Royalty Cap)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setShowLawDraftPreview((prev) => !prev)}
                          className="rounded-lg border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-2.5 py-1 text-[11px] font-semibold text-neutral-200 transition-colors cursor-pointer"
                        >
                          {showLawDraftPreview ? "Hide Law Draft" : "Read Law Draft"}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            downloadLawDraftDocument(
                              "IdeaVault-1.5-Year-Max-Royalty-Law-Draft.txt",
                              lawDraftText
                            )
                          }
                          className="flex items-center gap-1 rounded-lg bg-sky-500 hover:bg-sky-400 px-2.5 py-1 text-[11px] font-bold text-neutral-950 transition-colors cursor-pointer"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Download Law Draft (.txt)</span>
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-neutral-300 leading-relaxed">
                      Legally stipulates a <strong>3-year licensed product commercialization term</strong> where the <strong>15% royalty runs strictly for 1.5 years (18 months) and no more than that</strong>—automatically terminating to 0.00% after Month 18 under Nepal Copyright Act 2059 (Sec. 19) &amp; UNCITRAL rules.
                    </p>

                    {showLawDraftPreview && (
                      <pre className="rounded-lg border border-neutral-800 bg-neutral-950 p-3 text-[11px] font-mono text-neutral-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                        {lawDraftText}
                      </pre>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Legal Compliance & Transparent Covenant (for Investor & Idea Poster Sign-Ups) */}
          {accountType !== "owner" && (
            <>
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5 text-xs text-neutral-300 flex items-start gap-2.5">
                <Wallet className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-neutral-100 font-semibold">Real-World Money &amp; Verified Payment Receipts Required:</strong>{" "}
                  Every deal requires actual real-money transfer with verifiable transaction reference &amp; uploaded payment receipt (never simulated numbers), and 3% platform commission wires in Nepali currency (NPR ₨) to the Owner&apos;s QR account.
                </div>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Scale className="h-4 w-4 text-amber-400" />
                  <span>What You Are Signing Up For — Clear Legal Protections &amp; Fee Transparency</span>
                </div>

                <div className="divide-y divide-neutral-800/80 text-xs text-neutral-300">
                  <div className="pb-2.5 leading-relaxed">
                    <strong className="text-neutral-100">1. WIPO Berne Convention (Articles 2 &amp; 5 — International Copyright in 181 Countries):</strong>{" "}
                    Protects original ideas globally the moment they are written and timestamped here. Creators automatically hold authorship rights, and investors receive verified, dispute-free intellectual property chains.
                  </div>
                  <div className="py-2.5 leading-relaxed">
                    <strong className="text-neutral-100">2. UNCITRAL Electronic Commerce Rules (Articles 7 &amp; 11 — Valid Digital Contracts &amp; Escrow):</strong>{" "}
                    Guarantees that electronic signatures, digital buyout deeds, 15% royalty licenses, and escrow payment records signed on IdeaVault are legally binding and enforceable just like physical paper contracts.
                  </div>
                  <div className="py-2.5 leading-relaxed">
                    <strong className="text-neutral-100">3. Nepal Copyright Act 2059 (Sections 3, 7 &amp; 19 — Authorship &amp; Lawful Rights Transfer):</strong>{" "}
                    Safeguards moral and economic rights under Nepali law and legally authorizes creators to either retain 100% copyright, grant a 15% sales royalty license, or execute a complete 100% copyright buyout transfer to an investor.
                  </div>
                  <div className="pt-2.5 leading-relaxed">
                    <strong className="text-neutral-100">4. Automated 3% Platform Discovery Commission (Only Upon Completed Sales):</strong>{" "}
                    Signing up and posting ideas is 100% free ($0 upfront). The 3% platform discovery commission is settled strictly when a real-money buyout or royalty transaction actually completes, wired in Nepali Rupees (NPR ₨) to the Owner&apos;s QR account.
                  </div>
                </div>

                <label className="flex items-start gap-2.5 pt-2 border-t border-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={agreedToRules}
                    onChange={(e) => setAgreedToRules(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-neutral-700 bg-neutral-900 text-amber-500 focus:ring-amber-500"
                  />
                  <span className="text-xs text-neutral-200 leading-relaxed font-medium">
                    I have read the protections above and agree to operate under the WIPO Berne Convention, UNCITRAL electronic commerce rules, and Nepal Copyright Act 2059, with the automated 3% platform discovery commission settled strictly upon completed real-money transactions.
                  </span>
                </label>
              </div>
            </>
          )}

          {/* Submit */}
          <div className="pt-1 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl bg-neutral-800 hover:bg-neutral-700 px-4 py-2.5 text-xs font-semibold text-neutral-200 transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={accountType !== "owner" && !agreedToRules}
              className={`rounded-xl px-6 py-2.5 text-xs sm:text-sm font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${
                accountType === "investor"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-neutral-950 shadow-emerald-500/20"
                  : accountType === "owner"
                  ? "bg-gradient-to-r from-sky-500 to-amber-500 hover:from-sky-400 hover:to-amber-400 text-neutral-950 shadow-amber-500/20"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 shadow-amber-500/20"
              }`}
            >
              {accountType === "owner"
                ? "Save My Owner Uploads & NPR QR"
                : accountType === "investor"
                ? "Create Investor Account"
                : "Create Idea Poster Account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
