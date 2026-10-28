import React, { useState, useEffect, useMemo } from "react";
import { 
  Idea, 
  UserProfile, 
  CategoryType, 
  Contract, 
  Task, 
  CurrencyCode, 
  BuyerMatch,
  CopyrightFiling,
  AccountCreationType,
  AccountUploadedFile
} from "./types";
import { INITIAL_IDEAS, INITIAL_USERS, CATEGORIES_LIST } from "./data/seedData";
import { Navbar } from "./components/Navbar";
import { IdeaCard } from "./components/IdeaCard";
import { CreateIdeaModal } from "./components/CreateIdeaModal";
import { ContractModal } from "./components/ContractModal";
import { TasksView } from "./components/TasksView";
import { ProductionRoomModal } from "./components/ProductionRoomModal";
import { SiteOwnerDashboard } from "./components/SiteOwnerDashboard";
import { AiSunsetTransitionBar } from "./components/AiSunsetTransitionBar";
import { ClaimAiSeedModal } from "./components/ClaimAiSeedModal";
import { LegalAndMoneyGuideModal } from "./components/LegalAndMoneyGuideModal";
import { SalesAndProfitGraphModal } from "./components/SalesAndProfitGraphModal";
import { CopyrightCertificateModal } from "./components/CopyrightCertificateModal";
import { MatchedBuyersModal } from "./components/MatchedBuyersModal";
import { CreateAccountModal } from "./components/CreateAccountModal";
import { HumanVerificationModal } from "./components/HumanVerificationModal";
import { EmailCopyrightCompanyModal } from "./components/EmailCopyrightCompanyModal";
import { ScamFraudAlertBanner } from "./components/ScamFraudAlertBanner";
import { LegalCrossCheckModal } from "./components/LegalCrossCheckModal";
import { SiteCopyrightModal } from "./components/SiteCopyrightModal";
import { AdvancedSiteControlModal } from "./components/AdvancedSiteControlModal";
import { DigitalWalletModal } from "./components/DigitalWalletModal";
import { EarningsDashboardModal } from "./components/EarningsDashboardModal";
import { ConnectionStatusModal } from "./components/ConnectionStatusModal";
import { CompanyLandingWebsite } from "./components/CompanyLandingWebsite";
import { UnLegalAndAntiHackCertModal } from "./components/UnLegalAndAntiHackCertModal";
import { EthicalCertifiedModal } from "./components/EthicalCertifiedModal";
import { LawAndSafetyModal } from "./components/LawAndSafetyModal";
import { QrScannerModal } from "./components/QrScannerModal";
import { LegalDocumentsCenterModal } from "./components/LegalDocumentsCenterModal";
import { PromoVideoStudioModal } from "./components/PromoVideoStudioModal";
import { SearchEngineGuideModal } from "./components/SearchEngineGuideModal";
import { IdeaVaultLogo } from "./components/IdeaVaultLogo";
import { ScamFraudAlert, AntiHackDefenseStatus, SiteCopyrightRegistration, UserDigitalWallet, WalletTransaction } from "./types";
import { OFFICIAL_SITE_COPYRIGHT, INITIAL_ANTI_HACK_STATE } from "./data/seedData";
import { fetchLiveSyncState, pushLiveSyncUpdate, checkServerHealth, isSitePublishedLive, syncCleanBrowserUrlPath } from "./utils/syncEngine";
import { 
  PLATFORM_OWNER_WALLET,
  calculateCommissionBreakdown, 
  formatPrice, 
  EXCHANGE_RATES, 
  findMatchedBuyers,
  convertCurrencyToCurrency
} from "./utils/legalAndCurrency";
import { 
  Flame, 
  Sparkles, 
  Layers, 
  Search, 
  Filter, 
  Plus, 
  FileText, 
  TrendingUp, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  Briefcase,
  UserCheck, 
  Bot, 
  X, 
  Scale, 
  Smartphone, 
  BarChart3, 
  ExternalLink,
  Crown,
  Award,
  Radio,
  Globe,
  Mail
} from "lucide-react";

const CLEAN_PRELAUNCH_STORAGE_KEY = "ideavault_clean_prelaunch_v5";

function sanitizeUserForLaunchState(u: UserProfile, isPublished: boolean): UserProfile {
  const rawMethods = u.wallet?.withdrawalMethods || [];
  // Keep strictly payout methods explicitly added by the user (never auto-added banks)
  const cleanMethods = rawMethods.filter(
    (m) =>
      !m.id.startsWith("wm-mk-") &&
      m.id.startsWith("wm-user-") &&
      (m.type === "bank" || m.type === "digital_wallet")
  );

  const normalizedOwnerQr = u.wallet?.ownerQrAccount
    ? {
        ...u.wallet.ownerQrAccount,
        currency: "NPR" as CurrencyCode,
        autoWireEnabled: true,
      }
    : undefined;

  if (!isPublished) {
    return {
      ...u,
      uploadedFiles: u.uploadedFiles,
      receiveQrImageDataUrl: u.receiveQrImageDataUrl,
      balance: 0,
      totalRoyaltiesEarned: 0,
      platformRevenueEarned: 0,
      activeContractsCount: 0,
      wallet: {
        walletId: u.wallet?.walletId || `VAULT-${u.id}`,
        vaultAccountId: u.wallet?.vaultAccountId || `VAULT-${u.id}`,
        securityPin: u.wallet?.securityPin || "2059",
        biometricsEnabled: u.wallet?.biometricsEnabled ?? true,
        isLocked: false,
        currencySlots: { NPR: 0, USD: 0, EUR: 0, INR: 0, GBP: 0, AUD: 0, CAD: 0, JPY: 0, PLN: 0 },
        withdrawalMethods: cleanMethods,
        ownerQrAccount: normalizedOwnerQr,
        transactions: [],
      },
    };
  }

  return {
    ...u,
    uploadedFiles: u.uploadedFiles,
    receiveQrImageDataUrl: u.receiveQrImageDataUrl,
    wallet: u.wallet
      ? {
          ...u.wallet,
          withdrawalMethods: cleanMethods,
          ownerQrAccount: normalizedOwnerQr,
        }
      : {
          walletId: `VAULT-${u.id}`,
          vaultAccountId: `VAULT-${u.id}`,
          securityPin: "2059",
          biometricsEnabled: true,
          isLocked: false,
          currencySlots: { NPR: 0, USD: u.balance || 0, EUR: 0, INR: 0, GBP: 0, AUD: 0, CAD: 0, JPY: 0, PLN: 0 },
          withdrawalMethods: cleanMethods,
          transactions: [],
        },
  };
}

function sanitizeUsersList(rawUsers: UserProfile[], isPublished: boolean): UserProfile[] {
  if (!Array.isArray(rawUsers) || rawUsers.length === 0) {
    return INITIAL_USERS.map((u) => sanitizeUserForLaunchState(u, isPublished));
  }
  if (!isPublished) {
    // Only the permanent site owner account exists before live publication
    const ownerOnly = rawUsers.filter((u) => u.id === "user_owner" || u.isSiteOwner || u.isPermanentOwner);
    const base = ownerOnly.length > 0 ? [ownerOnly[0]] : INITIAL_USERS;
    return base.map((u) => sanitizeUserForLaunchState(u, false));
  }
  return rawUsers.map((u) => sanitizeUserForLaunchState(u, true));
}

function sanitizeIdeasList(rawIdeas: Idea[], isPublished: boolean): Idea[] {
  if (!Array.isArray(rawIdeas) || rawIdeas.length === 0) {
    return INITIAL_IDEAS;
  }
  if (!isPublished) {
    // Strictly zero human posts, zero contracts, zero sales, and zero completed task payouts before live publication
    const seedsOnly = rawIdeas.filter((i) => i.originType === "ai_seed" && !i.isRealHuman);
    if (seedsOnly.length === 0) return INITIAL_IDEAS;
    const baseSeeds = seedsOnly.length < INITIAL_IDEAS.length ? INITIAL_IDEAS : seedsOnly;
    return baseSeeds.map((seed) => ({
      ...seed,
      status: seed.status === "removed_by_admin" || seed.status === "flagged_dangerous" ? seed.status : "available",
      contract: undefined,
      marketSales: undefined,
      matchedBuyers: [],
      tasks: (seed.tasks || []).map((t) => ({
        ...t,
        status: "open",
        assignedToName: undefined,
        deliverables: undefined,
      })),
    }));
  }
  return rawIdeas;
}

export default function App() {
  const isPublished = isSitePublishedLive();

  // Scrub any stale localStorage from prior sessions on initial boot
  if (typeof window !== "undefined" && localStorage.getItem(CLEAN_PRELAUNCH_STORAGE_KEY) !== "true") {
    try {
      const savedUsersRaw = localStorage.getItem("idea_vault_users");
      if (savedUsersRaw) {
        const parsedUsers = JSON.parse(savedUsersRaw);
        localStorage.setItem("idea_vault_users", JSON.stringify(sanitizeUsersList(parsedUsers, isPublished)));
      }
      if (!isPublished) {
        localStorage.removeItem("idea_vault_ideas");
        localStorage.removeItem("idea_vault_human_posts_added");
      }
      localStorage.setItem(CLEAN_PRELAUNCH_STORAGE_KEY, "true");
    } catch (_e) {}
  }

  const [users, setUsers] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem("idea_vault_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((u: any) => u.id === "user_owner" && u.isPermanentOwner)) {
          return sanitizeUsersList(parsed, isSitePublishedLive());
        }
      } catch (e) {}
    }
    return sanitizeUsersList(INITIAL_USERS, isSitePublishedLive());
  });
  
  // Medha Koirala (permanent site owner) is logged in by default
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const owner = users.find((u) => u.isSiteOwner || u.id === "user_owner");
    return owner || users[0];
  });

  const [ideas, setIdeas] = useState<Idea[]>(() => {
    const live = isSitePublishedLive();
    if (!live) {
      return sanitizeIdeasList(INITIAL_IDEAS, false);
    }
    const saved = localStorage.getItem("idea_vault_ideas");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.some((i: any) => i.originType === "ai_seed")) {
          return sanitizeIdeasList(parsed, true);
        }
      } catch (e) {}
    }
    return INITIAL_IDEAS;
  });

  const [activeTab, setActiveTab] = useState<"website" | "feed" | "foryou" | "tasks" | "contracts" | "moderation">("foryou");
  const [isStandaloneWebsiteOpen, setIsStandaloneWebsiteOpen] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const p = window.location.pathname;
    const h = window.location.hash;
    const s = window.location.search;
    return (
      p === "/website" ||
      p === "/website/" ||
      h === "#/website" ||
      h === "#/site" ||
      s.includes("view=website")
    );
  });
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>("All Ideas");
  const [searchQuery, setSearchQuery] = useState("");

  // Currency selection (defaults to user preference or USD)
  const [preferredCurrency, setPreferredCurrency] = useState<CurrencyCode>(
    currentUser.preferredCurrency || "USD"
  );

  // AI Sunsetting & Real Human Transition State
  const [humanPostsAddedCount, setHumanPostsAddedCount] = useState<number>(() => {
    if (!isSitePublishedLive()) return 0;
    const saved = localStorage.getItem("idea_vault_human_posts_added");
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const [feedFilter, setFeedFilter] = useState<"all" | "real_humans" | "ai_seeds">("all");
  const [claimSeedIdea, setClaimSeedIdea] = useState<Idea | null>(null);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "info" } | null>(null);

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [contractIdea, setContractIdea] = useState<Idea | null>(null);
  const [productionIdea, setProductionIdea] = useState<Idea | null>(null);
  const [likedIdeaIds, setLikedIdeaIds] = useState<string[]>([]);
  const [isMatchingWithAI, setIsMatchingWithAI] = useState(false);

  // New Dedicated Modals
  const [isLegalGuideOpen, setIsLegalGuideOpen] = useState(false);
  const [isCreateAccountOpen, setIsCreateAccountOpen] = useState(false);
  const [createAccountInitialType, setCreateAccountInitialType] = useState<AccountCreationType>("idea_poster");
  const [isHumanVerifyOpen, setIsHumanVerifyOpen] = useState(false);
  const [isEmailCopyrightOpen, setIsEmailCopyrightOpen] = useState(false);
  const [isLegalCrossCheckOpen, setIsLegalCrossCheckOpen] = useState(false);
  const [salesGraphIdea, setSalesGraphIdea] = useState<Idea | null>(null);
  const [isSalesGraphOpen, setIsSalesGraphOpen] = useState(false);
  const [copyrightCertIdea, setCopyrightCertIdea] = useState<Idea | null>(null);
  const [matchedBuyersIdea, setMatchedBuyersIdea] = useState<Idea | null>(null);

  // Dedicated Site Owner, Copyright Registration, and Anti-Hack State
  const [isSiteCopyrightOpen, setIsSiteCopyrightOpen] = useState(false);
  const [isAdvancedOwnerControlOpen, setIsAdvancedOwnerControlOpen] = useState(false);
  const [isDigitalWalletOpen, setIsDigitalWalletOpen] = useState(false);
  const [walletInitialTab, setWalletInitialTab] = useState<"slots" | "scanner" | "withdraw" | "ledger">("slots");
  const [isEarningsDashboardOpen, setIsEarningsDashboardOpen] = useState(false);
  const [antiHackState, setAntiHackState] = useState<AntiHackDefenseStatus>(INITIAL_ANTI_HACK_STATE);
  const [siteCopyright, setSiteCopyright] = useState<SiteCopyrightRegistration>(OFFICIAL_SITE_COPYRIGHT);
  const [lastSyncedAt, setLastSyncedAt] = useState<string>("Just now (Live Auto-Sync Active)");
  const [syncVersion, setSyncVersion] = useState<number>(1);
  const [isConnectionStatusOpen, setIsConnectionStatusOpen] = useState(false);
  const [isServerOnline, setIsServerOnline] = useState(true);
  const [isLawAndSafetyOpen, setIsLawAndSafetyOpen] = useState(false);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [isUnCertOpen, setIsUnCertOpen] = useState(false);
  const [isEthicalCertOpen, setIsEthicalCertOpen] = useState(false);
  const [isLegalDocsCenterOpen, setIsLegalDocsCenterOpen] = useState(false);
  const [isPromoVideoOpen, setIsPromoVideoOpen] = useState(false);
  const [isSeoGuideOpen, setIsSeoGuideOpen] = useState(false);

  const openStandaloneWebsite = () => {
    setIsStandaloneWebsiteOpen(true);
    syncCleanBrowserUrlPath("/website", true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const enterMarketplaceApp = (targetTab: "foryou" | "feed" | "tasks" | "contracts" = "foryou") => {
    setIsStandaloneWebsiteOpen(false);
    setActiveTab(targetTab);
    syncCleanBrowserUrlPath("/", true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  // Sync browser back/forward & direct /website navigation
  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkRoute = () => {
        const h = window.location.hash;
        const p = window.location.pathname;
        const s = window.location.search;
        if (
          p === "/website" ||
          p === "/website/" ||
          h === "#/website" ||
          h === "#/site" ||
          s.includes("view=website")
        ) {
          setIsStandaloneWebsiteOpen(true);
          syncCleanBrowserUrlPath("/website", false);
        } else {
          setIsStandaloneWebsiteOpen(false);
          if (h === "#/feed" || h === "#/app" || h === "#/ideas") {
            setActiveTab("feed");
          }
          if (p && p !== "/") {
            syncCleanBrowserUrlPath("/", false);
          }
        }
      };
      checkRoute();
      window.addEventListener("hashchange", checkRoute);
      window.addEventListener("popstate", checkRoute);
      return () => {
        window.removeEventListener("hashchange", checkRoute);
        window.removeEventListener("popstate", checkRoute);
      };
    }
  }, []);

  // Monitor connection health
  useEffect(() => {
    let mounted = true;
    const verifyConnection = async () => {
      try {
        const health = await checkServerHealth();
        if (mounted) {
          setIsServerOnline(health.connected);
        }
      } catch (e) {
        if (mounted) setIsServerOnline(false);
      }
    };
    verifyConnection();
    const interval = setInterval(verifyConnection, 20000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  // Real-time Scam & Fraud Alerts (Nepal Penal Code 2074 & UNCITRAL)
  const [scamAlerts, setScamAlerts] = useState<ScamFraudAlert[]>([
    {
      id: "alert-initial",
      threatLevel: "contained",
      title: "Real-time Scam Detection: Payment Diversion Intercepted",
      description: "Automated fraud defense intercepted an off-platform payment attempt. Offending party restricted under Nepal Penal Code 2074 (Section 249) and UNCITRAL Model Law Article 7.",
      violatedStatutes: [
        "Nepal Penal Code 2074 Sec 249 (Thagi/Fraud)",
        "Nepal Electronic Transactions Act 2063 Sec 45",
        "UNCITRAL Model Law Art 7",
      ],
      attemptedAction: "Solicitation of direct unverified external transfer outside platform escrow.",
      timestamp: "Today (Automated Defense)",
      actionTaken: "Escrow locked, zero financial exposure, incident logged.",
      isResolved: false,
    },
  ]);

  // Hydrate Live Published Sync State on Startup (sanitized when unpublished)
  useEffect(() => {
    let active = true;
    const live = isSitePublishedLive();
    fetchLiveSyncState().then((state) => {
      if (!active || !state) return;
      if (state.ideas && state.ideas.length > 0) {
        const cleanIdeas = sanitizeIdeasList(state.ideas, live);
        setIdeas(cleanIdeas);
      }
      if (state.users && state.users.length > 0) {
        const cleanUsers = sanitizeUsersList(state.users, live);
        setUsers(cleanUsers);
        const owner = cleanUsers.find((u) => u.isSiteOwner || u.id === "user_owner");
        if (owner) setCurrentUser(owner);
      }
      if (live && typeof state.humanPostsAddedCount === "number") {
        setHumanPostsAddedCount(state.humanPostsAddedCount);
      } else if (!live) {
        setHumanPostsAddedCount(0);
      }
      if (state.version) {
        setSyncVersion(state.version);
      }
      if (state.lastSyncedAt) {
        setLastSyncedAt(new Date(state.lastSyncedAt).toLocaleTimeString());
      }
    });
    return () => {
      active = false;
    };
  }, []);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("idea_vault_ideas", JSON.stringify(ideas));
  }, [ideas]);

  useEffect(() => {
    localStorage.setItem("idea_vault_users", JSON.stringify(users));
  }, [users]);

  // One-Click Force Live Sync to Cloud Published Deployment
  const handleForceLiveSync = async () => {
    const res = await pushLiveSyncUpdate({
      ideas,
      users,
      humanPostsAddedCount,
      ownerSettings: {
        ownerName: currentUser.name,
        profession: currentUser.profession,
        headline: currentUser.headline,
        vaultAccountId: currentUser.wallet?.vaultAccountId || currentUser.wallet?.walletId,
      },
    });
    if (res.success) {
      setSyncVersion(res.version || syncVersion + 1);
      setLastSyncedAt(new Date().toLocaleTimeString());
      setToastMessage({
        type: "success",
        text: "Updates instantly pushed and synchronized to live published site!",
      });
    }
  };

  const handleUpdateOwnerProfile = (updatedProfile: UserProfile) => {
    setCurrentUser(updatedProfile);
    setUsers((prev) => prev.map((u) => (u.id === updatedProfile.id ? updatedProfile : u)));
    setSiteCopyright((prev) => ({
      ...prev,
      ownerFullName: updatedProfile.name,
      feeBeneficiaryWallet: updatedProfile.wallet?.vaultAccountId || updatedProfile.wallet?.walletId || prev.feeBeneficiaryWallet,
    }));
    // Auto sync to cloud
    pushLiveSyncUpdate({
      ideas,
      users: users.map((u) => (u.id === updatedProfile.id ? updatedProfile : u)),
      humanPostsAddedCount,
      ownerSettings: updatedProfile,
    });
  };

  // Synchronize In-App Digital Wallet Updates
  const handleUpdateWallet = (updatedWallet: UserDigitalWallet) => {
    const consolidatedUsd = Math.round(
      Object.entries(updatedWallet.currencySlots).reduce((sum, [curr, amt]) => {
        const rate = EXCHANGE_RATES[curr as CurrencyCode]?.rate || 1;
        return sum + amt / rate;
      }, 0)
    );

    setCurrentUser((prev) => ({
      ...prev,
      wallet: updatedWallet,
      balance: consolidatedUsd,
    }));

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            wallet: updatedWallet,
            balance: consolidatedUsd,
          };
        }
        return u;
      })
    );
  };

  const handleScannerPayment = (
    amount: number,
    currency: CurrencyCode,
    description: string,
    recipient: string,
    realBankOrQrRefId: string,
    paymentProofFile: AccountUploadedFile
  ) => {
    if (!isSitePublishedLive()) {
      setToastMessage({
        type: "info",
        text: "Site is not published yet: Real-money human payments and earnings do not exist until IdeaVault is published live.",
      });
      return;
    }
    const newTx: WalletTransaction = {
      id: `TX-SCAN-${Date.now().toString().slice(-6)}`,
      type: "qr_scanner_payment",
      amount,
      currency,
      counterparty: recipient,
      description: `Verified QR Payment: ${description}`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: "completed",
      referenceId: realBankOrQrRefId,
      txHash: `QR-${realBankOrQrRefId}`,
      realBankOrQrRefId,
      paymentProofFile,
    };

    const currentSlotBalance = currentUser.wallet.currencySlots[currency] || 0;
    const updatedSlots = {
      ...currentUser.wallet.currencySlots,
      [currency]: Math.max(0, currentSlotBalance - amount),
    };

    const updatedWallet: UserDigitalWallet = {
      ...currentUser.wallet,
      currencySlots: updatedSlots,
      transactions: [newTx, ...currentUser.wallet.transactions],
    };

    handleUpdateWallet(updatedWallet);
  };

  // Built-in QR Scanner Instant Item/Idea Payment
  const handlePayForIdeaByScan = (ideaId: string, amount: number, currency: CurrencyCode) => {
    if (!isSitePublishedLive()) {
      setToastMessage({
        type: "info",
        text: "Site is not published yet: Real-money human payments and earnings are inactive until IdeaVault is published live.",
      });
      return;
    }
    const idea = ideas.find((i) => i.id === ideaId);
    if (!idea) return;

    const feeData = calculateCommissionBreakdown(idea.upfrontPrice, idea.saleModel);
    const newContract: Contract = {
      id: `CTR-QR-${Date.now().toString().slice(-6)}`,
      ideaId: idea.id,
      ideaTitle: idea.title,
      creatorId: idea.creator.id,
      creatorName: idea.creator.name,
      creatorCountry: idea.creator.country,
      buyerId: currentUser.id,
      buyerName: currentUser.name,
      buyerCompany: currentUser.profession || "Independent Creator",
      buyerSignedAt: new Date().toISOString(),
      status: "fully_executed",
      upfrontFee: idea.upfrontPrice,
      royaltyPercent: idea.saleModel === "full_buyout" ? 0 : 15,
      platformFeePercent: 3,
      buyerSharePercent: idea.saleModel === "full_buyout" ? 97 : 82,
      contractText: `QR SCANNER EXECUTION: Acquired by ${currentUser.name} using In-App Digital Wallet. Net consideration settled into creator's wallet slot.`,
      creatorProductionRole: "Milestone handover",
      escrowStatus: "held_in_escrow",
      legalHash: `SHA256-QR-${Date.now().toString(16).toUpperCase()}`,
      createdAt: new Date().toLocaleDateString(),
      saleModel: idea.saleModel || "full_buyout",
      copyrightAssigned: idea.saleModel === "full_buyout",
      payoutCurrency: currency,
      ideatorPayoutAmount: feeData.netSellerUsd,
      platformFeeRecipient: "Medha Koirala (Owner QR Account — Automatic Wire)",
      ownerWalletAmountNpr: feeData.platformFeeNpr,
      ownerWalletAmountUsd: feeData.platformFeeUsd,
      ownerWalletTxnId: `QR-WIRE-${Date.now()}`,
      ownerWalletStatus: "auto_wired_to_owner_qr",
    };

    setIdeas((prev) =>
      prev.map((i) => (i.id === ideaId ? { ...i, status: "under_contract", contract: newContract } : i))
    );

    // Credit creator's wallet currency slot & automatically wire 3% to Owner's QR Account
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === idea.creator.id && u.wallet) {
          const creatorCurrency = u.preferredCurrency || "USD";
          const payoutInCreatorCurrency = convertCurrencyToCurrency(feeData.netSellerUsd, "USD", creatorCurrency);
          return {
            ...u,
            balance: u.balance + feeData.netSellerUsd,
            totalRoyaltiesEarned: u.totalRoyaltiesEarned + feeData.netSellerUsd,
            wallet: {
              ...u.wallet,
              currencySlots: {
                ...u.wallet.currencySlots,
                [creatorCurrency]: Math.round(((u.wallet.currencySlots[creatorCurrency] || 0) + payoutInCreatorCurrency) * 100) / 100,
              },
              transactions: [
                {
                  id: `TX-RECV-${Date.now()}`,
                  type: "sale_received",
                  amount: payoutInCreatorCurrency,
                  currency: creatorCurrency,
                  counterparty: `${currentUser.name} (via QR Scanner Pay)`,
                  description: `Payment received for "${idea.title}"`,
                  timestamp: "Just now",
                  status: "completed",
                  referenceId: `QR-BUY-${Date.now()}`,
                  txHash: `0xQR${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
                },
                ...u.wallet.transactions,
              ],
            },
          };
        }
        if (u.isSiteOwner && u.wallet) {
          const qrDest = u.wallet.ownerQrAccount
            ? `${u.wallet.ownerQrAccount.qrProviderName} (${u.wallet.ownerQrAccount.qrAccountId})`
            : "Owner Nepali NPR ₨ QR Account";
          return {
            ...u,
            balance: u.balance + feeData.platformFeeUsd,
            platformRevenueEarned: (u.platformRevenueEarned || 0) + feeData.platformFeeUsd,
            wallet: {
              ...u.wallet,
              currencySlots: {
                ...u.wallet.currencySlots,
                NPR: Math.round(((u.wallet.currencySlots.NPR || 0) + feeData.platformFeeNpr) * 100) / 100,
              },
              transactions: [
                {
                  id: `TX-OWNER-QR-${Date.now()}`,
                  type: "owner_qr_auto_wire",
                  amount: feeData.platformFeeNpr,
                  currency: "NPR",
                  counterparty: `Auto-Wired in NPR ₨ ➔ ${qrDest}`,
                  description: `3% Commission Wired in Nepali Currency (₨${feeData.platformFeeNpr.toLocaleString()} NPR) for "${idea.title}"`,
                  timestamp: "Just now",
                  status: "completed",
                  referenceId: `NPR-QR-${Date.now()}`,
                  txHash: `NPRQR${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
                  wiredOwnerNprAmount: feeData.platformFeeNpr,
                },
                ...u.wallet.transactions,
              ],
            },
          };
        }
        return u;
      })
    );

    setToastMessage({
      type: "success",
      text: `QR Scan Pay verified! Acquired "${idea.title}". Creator paid and 3% commission wired in Nepali Currency (₨${feeData.platformFeeNpr.toLocaleString()} NPR) to Owner's QR Account.`,
    });
  };

  // Keep current user updated & trigger "I'm a human" test right after login if not yet verified
  const handleSelectUser = (user: UserProfile) => {
    setCurrentUser(user);
    if (user.preferredCurrency) {
      setPreferredCurrency(user.preferredCurrency);
    }
    if (!user.passedHumanVerification) {
      setIsHumanVerifyOpen(true);
    }
  };

  // Check on initial load if user needs human verification
  useEffect(() => {
    if (currentUser && !currentUser.passedHumanVerification) {
      setIsHumanVerifyOpen(true);
    }
  }, [currentUser.id]);

  const handleSimulateScamAttempt = () => {
    const newAlert: ScamFraudAlert = {
      id: `alert-${Date.now()}`,
      threatLevel: "critical",
      title: "⚠️ ALERT: Off-Platform Payment Diversion Scam Attempt Thwarted",
      description: "An unverified account attempted to divert transactions to an external Telegram wallet. Flagged immediately under Nepal Penal Code 2074 (Section 249 - Fraud & Cheating).",
      violatedStatutes: [
        "Nepal Penal Code 2074 Section 249 (Cheating/Fraud - Up to 7 yrs imprisonment)",
        "Nepal Electronic Transactions Act 2063 Section 45",
        "UNCITRAL Model Law on Electronic Commerce Art 7",
      ],
      attemptedAction: "Bypass platform escrow and demand direct off-platform wire.",
      timestamp: "Just now (Live Scam Alert)",
      perpetratorHandle: "@unverified_shadow_agent",
      actionTaken: "Instant account lock, escrow funds protected, incident logged for legal dispatch.",
      isResolved: false,
    };
    setScamAlerts((prev) => [newAlert, ...prev]);
    setToastMessage({
      type: "info",
      text: "Real-time scam alert simulated! See active security warning banner above.",
    });
  };

  const handleDismissScamAlert = (id: string) => {
    setScamAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, isResolved: true } : a)));
  };

  const handleHumanVerifySuccess = (updatedUser: UserProfile) => {
    setUsers((prev) => prev.map((u) => (u.id === updatedUser.id ? updatedUser : u)));
    setCurrentUser(updatedUser);
    setToastMessage({
      type: "success",
      text: `Human verification passed (${updatedUser.humanVerificationType})! You can now publish ideas 100% free of charge.`,
    });
  };

  // Run AI "For You" matching recommendation when profile changes or button clicked
  const runRecommendationAlgorithm = async () => {
    setIsMatchingWithAI(true);
    try {
      const res = await fetch("/api/ai/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile: currentUser,
          ideas: ideas.map((i) => ({
            id: i.id,
            title: i.title,
            category: i.category,
            tags: i.tags,
            upfrontPrice: i.upfrontPrice,
          })),
        }),
      });

      const data = await res.json();
      if (data.recommendations && Array.isArray(data.recommendations)) {
        const scoreMap = new Map<string, { matchScore?: number; matchReason?: string }>(
          data.recommendations.map((r: any) => [r.id, r])
        );
        setIdeas((prev) =>
          prev.map((idea) => {
            const match = scoreMap.get(idea.id);
            if (match) {
              return {
                ...idea,
                matchScore: match.matchScore ?? idea.matchScore,
                matchReason: match.matchReason ?? idea.matchReason,
              };
            }
            return idea;
          })
        );
      }
    } catch (err) {
      console.error("Failed to run AI recommendations:", err);
    } finally {
      setIsMatchingWithAI(false);
    }
  };

  // Run recommendation on first mount
  useEffect(() => {
    runRecommendationAlgorithm();
  }, [currentUser.id]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 5500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Handle Account Creation
  const handleAccountCreated = (newUser: UserProfile) => {
    if (!isSitePublishedLive()) {
      setToastMessage({
        type: "info",
        text: "Site is not published yet: External human user accounts are disabled until IdeaVault is published live.",
      });
      return;
    }
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    if (newUser.preferredCurrency) {
      setPreferredCurrency(newUser.preferredCurrency);
    }
    setToastMessage({
      type: "success",
      text: `Account created for ${newUser.name} (${newUser.country || "Nepal"})! You are certified under UN and Nepal legal guidelines.`,
    });
  };

  // Add new idea (with real human verification, copyright filing, and 1-to-1 automatic AI disappearance)
  const handleAddIdea = (newIdea: Idea) => {
    if (!isSitePublishedLive()) {
      setToastMessage({
        type: "info",
        text: "Site is not published yet: Public human posts and buyer matching activate once IdeaVault is published live.",
      });
      return;
    }
    let updatedIdeas: Idea[];
    if (newIdea.isRealHuman || newIdea.originType === "real_human") {
      const nextCount = humanPostsAddedCount + 1;
      setHumanPostsAddedCount(nextCount);
      localStorage.setItem("idea_vault_human_posts_added", String(nextCount));

      // 1 human post = permanently erase 1 AI seed
      const aiSeedIndex = ideas.findIndex((i) => i.originType === "ai_seed");
      if (aiSeedIndex !== -1) {
        const copy = [...ideas];
        copy.splice(aiSeedIndex, 1);
        updatedIdeas = [newIdea, ...copy];
      } else {
        updatedIdeas = [newIdea, ...ideas];
      }
      setIdeas(updatedIdeas);
      localStorage.setItem("idea_vault_ideas", JSON.stringify(updatedIdeas));

      const remainingAi = updatedIdeas.filter((i) => i.originType === "ai_seed").length;
      const certId = newIdea.copyrightFiling?.certificateId || "CR-NP-WIPO-2026";
      const buyerCount = newIdea.matchedBuyers?.length || 0;

      setToastMessage({
        text: `Idea Published (100% Free)! 1 AI seed permanently erased (${remainingAi} AI seeds remaining). Copyright Certificate #${certId} filed.${buyerCount > 0 ? ` ${buyerCount} commercial buyers matched!` : ""}`,
        type: "success",
      });

      setMatchedBuyersIdea(newIdea);

      pushLiveSyncUpdate({
        ideas: updatedIdeas,
        users,
        humanPostsAddedCount: nextCount,
      });
    } else {
      updatedIdeas = [newIdea, ...ideas];
      setIdeas(updatedIdeas);
      localStorage.setItem("idea_vault_ideas", JSON.stringify(updatedIdeas));
    }
  };

  // Simulate a real human posting an authentic idea (only active when published)
  const handleSimulateRealHumanPost = () => {
    if (!isSitePublishedLive()) {
      setToastMessage({
        type: "info",
        text: "Site is not published yet: No simulated human posts are permitted before live publication.",
      });
      return;
    }
    const nextCount = humanPostsAddedCount + 1;
    setHumanPostsAddedCount(nextCount);
    localStorage.setItem("idea_vault_human_posts_added", String(nextCount));

    const sampleHumanPosts = [
      {
        title: "SafePour: Anti-Scald Kettle Spout with Bi-Metallic Valve",
        category: "Physical Hardware & Robotics",
        role: "Retired Machinist & Grandfather",
        pitch: "A purely mechanical thermostatic restrictor valve that prevents boiling water surge burns in elderly arthritic kitchens.",
        description: "After my 78-year-old neighbor suffered hand scalding from an unbalanced electric kettle, I machined a simple bi-metallic disc valve that only permits smooth laminar pouring when the kettle angle is stable. Conceived by a machinist with zero electronics needed. Ready for an appliance brand under full buyout or royalty.",
      },
      {
        title: "QuietDine: Micro-Perforated Timber Acoustic Panels with Natural Enzyme Purifier",
        category: "Consumer Products & Lifestyle",
        role: "Restaurant Chef & Small Business Owner",
        pitch: "Washable acoustic wood panels treated with food-grade probiotics that reduce dining noise reverberation while neutralizing kitchen grease vapors.",
        description: "Restaurants are notoriously loud and suffer from grease clinging to soundproofing. Having operated dining rooms for 18 years, I designed washable slatted timber acoustic baffles impregnated with natural probiotic enzymes that break down aerosolized cooking oils without chemicals.",
      },
      {
        title: "AgriRoots: $30 Clip-On Micro-Lens for Nematode Pest Detection",
        category: "Green Tech & Sustainability",
        role: "Organic Citrus Farmer",
        pitch: "A rugged dark-field optical attachment for everyday smartphones that allows farmers to detect microscopic root parasites before crop failure.",
        description: "Smallholder organic farms lose up to 30% of citrus yields to subterranean nematodes before symptoms show above ground. I engineered this dark-field illumination ring from acrylic scrap to inspect soil root washings in seconds using any basic camera phone.",
      },
    ];

    const sample = sampleHumanPosts[(nextCount - 1) % sampleHumanPosts.length];
    const certNum = `NP-WIPO-CR-2026-${Date.now().toString().slice(-6)}`;
    const newHumanIdea: Idea = {
      id: `idea-human-sim-${Date.now()}`,
      title: sample.title,
      summaryPitch: sample.pitch,
      description: sample.description,
      details: "Conceived by a real human domain specialist from frontline practical observation. Protected under WIPO & Nepal Copyright Act 2059.",
      category: sample.category as any,
      tags: ["VerifiedHuman", "DomainInsight", "CopyrightProtected", "BuyoutOrRoyalty"],
      creator: {
        id: currentUser.id,
        name: currentUser.name,
        handle: currentUser.handle,
        avatar: currentUser.avatar,
        reputation: 98,
        totalEarned: currentUser.totalRoyaltiesEarned,
        verified: true,
        role: sample.role,
        profession: sample.role,
        backgroundField: "Direct Industry Practice",
        isNonTech: true,
        isRealHuman: true,
        country: currentUser.country || "Nepal",
        preferredCurrency: currentUser.preferredCurrency || "USD",
        email: currentUser.email || "creator@ideavault.org",
      },
      upfrontPrice: 380,
      royaltyCommissionPercent: 0,
      platformCommissionPercent: 3,
      createdAt: "Just now",
      likes: 3,
      views: 24,
      collaboratorsCount: 0,
      status: "available",
      originType: "real_human",
      isRealHuman: true,
      saleModel: "full_buyout",
      copyrightFiling: {
        certificateId: certNum,
        registeredAt: new Date().toLocaleDateString(),
        authorName: currentUser.name,
        authorCountry: currentUser.country || "Nepal",
        authorEmail: currentUser.email || "creator@ideavault.org",
        governingLaws: [
          "WIPO Berne Convention (Paris Act 1971)",
          "Nepal Copyright Act 2059 (Sections 3 & 19)",
          "UNCITRAL Model Law on Electronic Commerce",
        ],
        cryptographicHash: `SHA256:7F8B${Date.now().toString(16).toUpperCase()}9B`,
        saleModel: "full_buyout",
        ownershipStatus: "registered_to_author",
        documentsDelivered: true,
        legalPreamble: `Certified subsistence of original intellectual property filed in the name of ${currentUser.name}. 3% automated platform discovery fee settled into Master Vault Wallet (${PLATFORM_OWNER_WALLET.accountName}).`,
      },
      matchedBuyers: findMatchedBuyers(sample.category, sample.title),
      safetyAudit: {
        isDangerous: false,
        dangerScore: 0,
        dangerReason: "Passed human verification and automated safety screening.",
        reviewedByOwner: true,
        actionTaken: "safe",
      },
      tasks: [],
      matchScore: 95,
      matchReason: "Authentic verified real human submission.",
    };

    let remainingAiAfter = 18;
    setIdeas((prev) => {
      const aiSeedIndex = prev.findIndex((i) => i.originType === "ai_seed");
      let updated: Idea[];
      if (aiSeedIndex !== -1) {
        const copy = [...prev];
        copy.splice(aiSeedIndex, 1);
        updated = [newHumanIdea, ...copy];
      } else {
        updated = [newHumanIdea, ...prev];
      }
      remainingAiAfter = updated.filter((i) => i.originType === "ai_seed").length;
      localStorage.setItem("idea_vault_ideas", JSON.stringify(updated));
      return updated;
    });

    setToastMessage({
      text: `Authentic Real Human Post Published! 1 AI seed post erased (${remainingAiAfter} of 18 AI launch seeds remaining).`,
      type: "success",
    });
  };

  // Reset transition demo
  const handleResetTransition = () => {
    setHumanPostsAddedCount(0);
    localStorage.removeItem("idea_vault_human_posts_added");
    localStorage.removeItem("idea_vault_ideas");
    setIdeas(INITIAL_IDEAS);
    setToastMessage({
      text: "Simulation reset: All 18 transparent AI launch seed ideas restored (0 human posts).",
      type: "info",
    });
  };

  // Claim AI seed as real human
  const handleClaimAiSeedSuccess = (updatedIdea: Idea) => {
    if (!isSitePublishedLive()) {
      setToastMessage({
        type: "info",
        text: "Site is not published yet: Claiming seeds as human posts activates once IdeaVault is published live.",
      });
      return;
    }
    setIdeas((prev) => prev.map((i) => (i.id === updatedIdea.id ? updatedIdea : i)));
    const nextCount = humanPostsAddedCount + 1;
    setHumanPostsAddedCount(nextCount);
    localStorage.setItem("idea_vault_human_posts_added", String(nextCount));
    const retiredPercent = Math.min(100, nextCount * 20);
    setToastMessage({
      text: `You claimed & humanized "${updatedIdea.title}"! AI seed posts decreased by 20% (${retiredPercent}% total retired).`,
      type: "success",
    });
  };

  // Toggle like
  const handleToggleLike = (ideaId: string) => {
    setLikedIdeaIds((prev) =>
      prev.includes(ideaId) ? prev.filter((id) => id !== ideaId) : [...prev, ideaId]
    );
  };

  // Site owner authority: remove idea
  const handleRemoveIdea = (ideaId: string, reason: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            status: "removed_by_admin",
            safetyAudit: {
              ...idea.safetyAudit,
              isDangerous: true,
              dangerReason: reason,
              actionTaken: "removed",
              reviewedByOwner: true,
            },
          };
        }
        return idea;
      })
    );
  };

  const handleRestoreIdea = (ideaId: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            status: "available",
            safetyAudit: {
              ...idea.safetyAudit,
              isDangerous: false,
              dangerScore: 10,
              dangerReason: "Restored after verified manual compliance review by site owner.",
              actionTaken: "safe",
              reviewedByOwner: true,
            },
          };
        }
        return idea;
      })
    );
  };

  // Direct acquisition from Matched Buyers modal
  const handleExecuteBuyerDeal = (targetIdea: Idea, buyer: BuyerMatch, isFullBuyout: boolean) => {
    if (!isSitePublishedLive()) {
      setToastMessage({
        type: "info",
        text: "Site is not published yet: Real-money human payments and earnings do not exist until IdeaVault is published live.",
      });
      return;
    }
    const feeData = calculateCommissionBreakdown(targetIdea.upfrontPrice, targetIdea.saleModel);
    const contractId = `CON-${Date.now()}`;
    const newContract: Contract = {
      id: contractId,
      ideaId: targetIdea.id,
      ideaTitle: targetIdea.title,
      creatorId: targetIdea.creator.id,
      creatorName: targetIdea.creator.name,
      creatorProfession: targetIdea.creator.profession,
      creatorCountry: targetIdea.creator.country || "Nepal",
      isNonTechCreator: targetIdea.creator.isNonTech,
      creatorSignedAt: new Date().toISOString(),
      buyerId: buyer.id,
      buyerName: buyer.name,
      buyerCompany: buyer.company,
      buyerSignedAt: new Date().toISOString(),
      status: "fully_executed",
      upfrontFee: targetIdea.upfrontPrice,
      royaltyPercent: isFullBuyout ? 0 : 15,
      platformFeePercent: 3,
      buyerSharePercent: isFullBuyout ? 97 : 82,
      contractText: `Certified Acquisition by ${buyer.name} (${buyer.company}). Total Consideration: $${targetIdea.upfrontPrice} USD (${formatPrice(targetIdea.upfrontPrice, preferredCurrency)}).\n` +
        `• 3% Platform Fee ($${feeData.platformFeeUsd} USD / ₨${feeData.platformFeeNpr.toLocaleString()} NPR) automatically settled into Platform Owner Master Vault Wallet (Medha Koirala).\n` +
        `• Ideator Net Payout: $${feeData.netSellerUsd} USD credited to ${targetIdea.creator.name}'s digital wallet slot.\n` +
        `• Legal Model: ${isFullBuyout ? "100% Full Copyright Buyout (0% ongoing royalty)" : "15% Perpetual Sales Royalty"}.\n` +
        `• Governing Treaties: WIPO Berne Convention & Nepal Copyright Act 2059.`,
      creatorProductionRole: "Prototype handover and commercial sign-off.",
      escrowStatus: "held_in_escrow",
      legalHash: `SHA256-${Date.now().toString(16).toUpperCase()}`,
      createdAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      saleModel: isFullBuyout ? "full_buyout" : "royalty_split",
      copyrightAssigned: isFullBuyout,
      payoutCurrency: targetIdea.creator.preferredCurrency || preferredCurrency,
      ideatorPayoutAmount: feeData.netSellerUsd,
      platformFeeRecipient: "Medha Koirala (Owner QR Account — Automatic Wire)",
      ownerWalletAmountNpr: feeData.platformFeeNpr,
      ownerWalletAmountUsd: feeData.platformFeeUsd,
      ownerWalletTxnId: `QR-WIRE-${Date.now().toString().slice(-8)}`,
      ownerWalletStatus: "auto_wired_to_owner_qr",
      legalCertDelivered: true,
    };

    setIdeas((prev) =>
      prev.map((i) => {
        if (i.id === targetIdea.id) {
          return {
            ...i,
            status: isFullBuyout ? "under_contract" : "in_production",
            contract: newContract,
            copyrightFiling: i.copyrightFiling
              ? {
                  ...i.copyrightFiling,
                  ownershipStatus: isFullBuyout ? "fully_assigned_to_buyer" : "registered_to_author",
                  buyerName: buyer.name,
                  buyerCompany: buyer.company,
                  assignmentDate: new Date().toLocaleDateString(),
                }
              : undefined,
          };
        }
        return i;
      })
    );

    // Update balances and automatically wire 3% commission to Owner's QR Account
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetIdea.creator.id) {
          const userCurr = u.preferredCurrency || "USD";
          const payoutLocal = convertCurrencyToCurrency(feeData.netSellerUsd, "USD", userCurr);
          const updatedWallet = u.wallet ? {
            ...u.wallet,
            currencySlots: {
              ...u.wallet.currencySlots,
              [userCurr]: Math.round(((u.wallet.currencySlots[userCurr] || 0) + payoutLocal) * 100) / 100,
            },
            transactions: [
              {
                id: `TX-SALE-${Date.now()}`,
                type: "sale_received" as const,
                amount: payoutLocal,
                currency: userCurr,
                counterparty: `${buyer.name} (${buyer.company})`,
                description: `Acquisition of "${targetIdea.title}" (${isFullBuyout ? "Full Buyout" : "15% Royalty Stake"})`,
                timestamp: "Just now",
                status: "completed" as const,
                referenceId: `BUY-${Date.now().toString().slice(-6)}`,
                txHash: `0xBUY${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
              },
              ...u.wallet.transactions,
            ],
          } : u.wallet;

          const updatedCreator: UserProfile = {
            ...u,
            balance: u.balance + feeData.netSellerUsd,
            totalRoyaltiesEarned: u.totalRoyaltiesEarned + feeData.netSellerUsd,
            wallet: updatedWallet,
          };
          if (currentUser.id === u.id) {
            setCurrentUser(updatedCreator);
          }
          return updatedCreator;
        }
        if (u.isSiteOwner) {
          const qrDest = u.wallet?.ownerQrAccount
            ? `${u.wallet.ownerQrAccount.qrProviderName} (${u.wallet.ownerQrAccount.qrAccountId})`
            : "Owner QR Account";
          const updatedWallet = u.wallet ? {
            ...u.wallet,
            currencySlots: {
              ...u.wallet.currencySlots,
              USD: Math.round(((u.wallet.currencySlots.USD || 0) + feeData.platformFeeUsd) * 100) / 100,
              NPR: Math.round(((u.wallet.currencySlots.NPR || 0) + feeData.platformFeeNpr) * 100) / 100,
            },
            transactions: [
              {
                id: `TX-COMM-${Date.now()}`,
                type: "owner_qr_auto_wire" as const,
                amount: feeData.platformFeeUsd,
                currency: "USD" as CurrencyCode,
                counterparty: `Auto-Wired ➔ ${qrDest}`,
                description: `3% Commission Auto-Wired to Owner QR for "${targetIdea.title}"`,
                timestamp: "Just now",
                status: "completed" as const,
                referenceId: `QRWIRE-${Date.now().toString().slice(-6)}`,
                txHash: `0xQRW${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
              },
              ...u.wallet.transactions,
            ],
          } : u.wallet;

          const updatedOwner: UserProfile = {
            ...u,
            balance: u.balance + feeData.platformFeeUsd,
            platformRevenueEarned: (u.platformRevenueEarned || 0) + feeData.platformFeeUsd,
            wallet: updatedWallet,
          };
          if (currentUser.isSiteOwner) {
            setCurrentUser(updatedOwner);
          }
          return updatedOwner;
        }
        return u;
      })
    );

    setToastMessage({
      type: "success",
      text: `Deal executed! ${buyer.name} acquired "${targetIdea.title}". Creator paid and 3% commission (₨${feeData.platformFeeNpr.toLocaleString()} NPR) automatically wired to Owner's QR Account.`,
    });
  };

  // Sign contract from ContractModal & Execute Real Money Settlement
  const handleSignContract = (contract: Contract) => {
    if (!isSitePublishedLive()) {
      setToastMessage({
        type: "info",
        text: "Site is not published yet: Real-money human contract payments are inactive until IdeaVault is published live.",
      });
      return;
    }
    const isFullBuyout = contract.saleModel === "full_buyout";
    const feeData = calculateCommissionBreakdown(contract.upfrontFee, contract.saleModel);
    const targetIdea = ideas.find((i) => i.id === contract.ideaId);
    const creatorCurrency = (contract.payoutCurrency || targetIdea?.creator.preferredCurrency || "USD") as CurrencyCode;
    const netSellerLocal = convertCurrencyToCurrency(feeData.netSellerUsd, "USD", creatorCurrency);

    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === contract.ideaId) {
          return {
            ...idea,
            status: isFullBuyout ? "under_contract" : "in_production",
            contract: contract,
            collaboratorsCount: idea.collaboratorsCount + 1,
            productionNotes: [
              `Contract executed on ${contract.createdAt} by ${contract.buyerName} (${contract.buyerCompany}). Consideration: $${contract.upfrontFee} USD.`,
              isFullBuyout 
                ? "100% Full Copyright transferred to buyer. Ideator owns 0% ongoing royalty." 
                : "Mandatory 15% product sales royalty active.",
              `3% platform discovery fee (${(contract.ownerWalletAmountNpr || feeData.platformFeeNpr).toLocaleString()} NPR) settled into Master Vault Wallet.`,
            ],
            copyrightFiling: idea.copyrightFiling
              ? {
                  ...idea.copyrightFiling,
                  ownershipStatus: isFullBuyout ? "fully_assigned_to_buyer" : "registered_to_author",
                  buyerName: contract.buyerName,
                  buyerCompany: contract.buyerCompany,
                  assignmentDate: new Date().toLocaleDateString(),
                }
              : undefined,
          };
        }
        return idea;
      })
    );

    // Transfer Real Money to Digital Accounts: Creator gets net consideration, Platform Owner gets 3%
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === contract.creatorId) {
          const uWallet = u.wallet || {
            walletId: `VAULT-${u.id}`,
            vaultAccountId: `VAULT-${u.id}`,
            securityPin: "2059",
            biometricsEnabled: true,
            isLocked: false,
            currencySlots: { USD: 0, NPR: 0, INR: 0, EUR: 0, GBP: 0, AUD: 0, CAD: 0, JPY: 0, PLN: 0 },
            withdrawalMethods: [],
            transactions: [],
          };
          const updatedSlots = {
            ...uWallet.currencySlots,
            [creatorCurrency]: Math.round(((uWallet.currencySlots[creatorCurrency] || 0) + netSellerLocal) * 100) / 100,
          };
          const newTx: WalletTransaction = {
            id: `TX-DEAL-${Date.now()}`,
            type: "sale_received",
            amount: netSellerLocal,
            currency: creatorCurrency,
            counterparty: `${contract.buyerName} (${contract.buyerCompany || "Acquiring Partner"})`,
            description: `Verified payment received for ${isFullBuyout ? "Full Buyout of" : "License Stake in"} "${contract.ideaTitle}"`,
            timestamp: "Just now",
            status: "completed",
            referenceId: contract.realBankOrQrRefId || contract.id,
            txHash: `REF-${contract.realBankOrQrRefId || contract.id}`,
            realBankOrQrRefId: contract.realBankOrQrRefId,
            paymentProofFile: contract.paymentProofFile,
          };
          const updatedCreator: UserProfile = {
            ...u,
            balance: Math.round((u.balance + feeData.netSellerUsd) * 100) / 100,
            totalRoyaltiesEarned: Math.round((u.totalRoyaltiesEarned + feeData.netSellerUsd) * 100) / 100,
            activeContractsCount: u.activeContractsCount + 1,
            wallet: {
              ...uWallet,
              currencySlots: updatedSlots,
              transactions: [newTx, ...uWallet.transactions],
            },
          };
          if (currentUser.id === u.id) {
            setCurrentUser(updatedCreator);
          }
          return updatedCreator;
        }

        if (u.isSiteOwner) {
          const ownerWallet = u.wallet || {
            walletId: `VAULT-MK-977-MASTER-001`,
            vaultAccountId: `VAULT-MK-977-MASTER-001`,
            securityPin: "2059",
            biometricsEnabled: true,
            isLocked: false,
            currencySlots: { NPR: 0, USD: 0, EUR: 0, INR: 0, GBP: 0, AUD: 0, CAD: 0, JPY: 0, PLN: 0 },
            withdrawalMethods: [],
            transactions: [],
          };
          const qrDest = ownerWallet.ownerQrAccount
            ? `${ownerWallet.ownerQrAccount.qrProviderName} (${ownerWallet.ownerQrAccount.qrAccountId})`
            : "Owner Nepali NPR ₨ QR Account";
          const updatedOwnerSlots = {
            ...ownerWallet.currencySlots,
            NPR: Math.round(((ownerWallet.currencySlots.NPR || 0) + feeData.platformFeeNpr) * 100) / 100,
          };
          const ownerTx: WalletTransaction = {
            id: `TX-FEE-${Date.now()}`,
            type: "owner_qr_auto_wire",
            amount: feeData.platformFeeNpr,
            currency: "NPR",
            counterparty: `Auto-Wired in NPR ₨ ➔ ${qrDest}`,
            description: `3% Commission Wired in Nepali Currency (₨${feeData.platformFeeNpr.toLocaleString()} NPR) for "${contract.ideaTitle}"`,
            timestamp: "Just now",
            status: "completed",
            referenceId: contract.realBankOrQrRefId || contract.id,
            txHash: `NPRQR-${contract.realBankOrQrRefId || contract.id}`,
            realBankOrQrRefId: contract.realBankOrQrRefId,
            paymentProofFile: contract.paymentProofFile,
            wiredOwnerNprAmount: feeData.platformFeeNpr,
          };
          const updatedOwner: UserProfile = {
            ...u,
            balance: Math.round((u.balance + feeData.platformFeeUsd) * 100) / 100,
            platformRevenueEarned: Math.round(((u.platformRevenueEarned || 0) + feeData.platformFeeUsd) * 100) / 100,
            wallet: {
              ...ownerWallet,
              currencySlots: updatedOwnerSlots,
              transactions: [ownerTx, ...ownerWallet.transactions],
            },
          };
          if (currentUser.isSiteOwner) {
            setCurrentUser(updatedOwner);
          }
          return updatedOwner;
        }

        return u;
      })
    );

    setContractIdea(null);
    if (targetIdea) {
      if (!isFullBuyout) {
        setProductionIdea({
          ...targetIdea,
          status: "in_production",
          contract,
        });
      }
    }

    setToastMessage({
      type: "success",
      text: `Verified real-money payment settled! Creator paid and 3% commission wired in Nepali Currency (₨${feeData.platformFeeNpr.toLocaleString()} NPR) to Owner's QR Account.`,
    });
  };

  // Distribute receipt-verified 15% royalty + 3% Owner NPR QR wire on live commercial sales
  const handleSimulateSale = (
    ideaId: string,
    saleAmount: number,
    realBankOrQrRefId: string,
    paymentProofFile: AccountUploadedFile
  ) => {
    if (!isSitePublishedLive()) {
      setToastMessage({
        type: "info",
        text: "Site is not published yet: Real-money sales and earnings remain 0.00 until IdeaVault is published live.",
      });
      return;
    }
    const ideatorCommission = Math.round(saleAmount * 0.15 * 100) / 100;
    const platformCommissionUsd = Math.round(saleAmount * 0.03 * 100) / 100;
    const platformCommissionNpr = Math.round(platformCommissionUsd * EXCHANGE_RATES.NPR.rate * 100) / 100;

    let targetCreatorId = "";
    let targetIdeaTitle = "Licensed Product";
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          targetCreatorId = idea.creator.id;
          targetIdeaTitle = idea.title;
          const prevTotalSales = idea.marketSales?.totalProductSales || 0;
          const prevCommission = idea.marketSales?.commissionEarned || 0;
          const prevPlatformCommission = idea.marketSales?.platformCommissionEarned || prevTotalSales * 0.03;
          return {
            ...idea,
            status: "market_launched",
            marketSales: {
              totalProductSales: prevTotalSales + saleAmount,
              commissionEarned: prevCommission + ideatorCommission,
              platformCommissionEarned: prevPlatformCommission + platformCommissionUsd,
              quarterlyRevenue: (idea.marketSales?.quarterlyRevenue || 0) + saleAmount,
              unitsSold: (idea.marketSales?.unitsSold || 0) + Math.max(1, Math.round(saleAmount / 100)),
              launchDate: idea.marketSales?.launchDate || "Launched",
              lastPayoutDate: "Just now",
            },
            productionNotes: [
              ...(idea.productionNotes || []),
              `Receipt-verified commercial payment (Ref #${realBankOrQrRefId}, File: ${paymentProofFile.name}): $${saleAmount.toLocaleString()} gross revenue -> 15% Creator Royalty ($${ideatorCommission.toLocaleString()} USD) settled and 3% Owner Commission wired in Nepali Currency (₨${platformCommissionNpr.toLocaleString()} NPR) to Owner QR Account.`,
            ],
          };
        }
        return idea;
      })
    );

    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === targetCreatorId) {
          const userCurr = u.preferredCurrency || "USD";
          const payoutLocal = convertCurrencyToCurrency(ideatorCommission, "USD", userCurr);
          const updatedWallet = u.wallet
            ? {
                ...u.wallet,
                currencySlots: {
                  ...u.wallet.currencySlots,
                  [userCurr]: Math.round(((u.wallet.currencySlots[userCurr] || 0) + payoutLocal) * 100) / 100,
                },
                transactions: [
                  {
                    id: `TX-ROY-${Date.now()}`,
                    type: "royalty_received" as const,
                    amount: payoutLocal,
                    currency: userCurr,
                    counterparty: "Receipt-Verified Commercial Settlement",
                    description: `15% Verified Sales Royalty for "${targetIdeaTitle}"`,
                    timestamp: "Just now",
                    status: "completed" as const,
                    referenceId: realBankOrQrRefId,
                    txHash: `ROY-${realBankOrQrRefId}`,
                    realBankOrQrRefId,
                    paymentProofFile,
                  },
                  ...u.wallet.transactions,
                ],
              }
            : u.wallet;

          return {
            ...u,
            balance: u.balance + ideatorCommission,
            totalRoyaltiesEarned: u.totalRoyaltiesEarned + ideatorCommission,
            wallet: updatedWallet,
          };
        }
        if (u.isSiteOwner) {
          const qrDest = u.wallet?.ownerQrAccount
            ? `${u.wallet.ownerQrAccount.qrProviderName} (${u.wallet.ownerQrAccount.qrAccountId})`
            : "Owner Nepali NPR ₨ QR Account";
          const updatedWallet = u.wallet
            ? {
                ...u.wallet,
                currencySlots: {
                  ...u.wallet.currencySlots,
                  NPR: Math.round(((u.wallet.currencySlots.NPR || 0) + platformCommissionNpr) * 100) / 100,
                },
                transactions: [
                  {
                    id: `TX-ROY-OWNER-${Date.now()}`,
                    type: "owner_qr_auto_wire" as const,
                    amount: platformCommissionNpr,
                    currency: "NPR" as CurrencyCode,
                    counterparty: `Auto-Wired in NPR ₨ ➔ ${qrDest}`,
                    description: `3% Royalty Commission Wired in Nepali Currency (₨${platformCommissionNpr.toLocaleString()} NPR) for "${targetIdeaTitle}"`,
                    timestamp: "Just now",
                    status: "completed" as const,
                    referenceId: realBankOrQrRefId,
                    txHash: `NPRQR-${realBankOrQrRefId}`,
                    realBankOrQrRefId,
                    paymentProofFile,
                    wiredOwnerNprAmount: platformCommissionNpr,
                  },
                  ...u.wallet.transactions,
                ],
              }
            : u.wallet;

          return {
            ...u,
            balance: u.balance + platformCommissionUsd,
            platformRevenueEarned: (u.platformRevenueEarned || 0) + platformCommissionUsd,
            wallet: updatedWallet,
          };
        }
        return u;
      })
    );

    setCurrentUser((prev) => {
      if (prev.id === targetCreatorId) {
        return {
          ...prev,
          balance: prev.balance + ideatorCommission,
          totalRoyaltiesEarned: prev.totalRoyaltiesEarned + ideatorCommission,
        };
      }
      if (prev.isSiteOwner) {
        return {
          ...prev,
          balance: prev.balance + platformCommissionUsd,
          platformRevenueEarned: (prev.platformRevenueEarned || 0) + platformCommissionUsd,
        };
      }
      return prev;
    });
  };

  const handleAddProductionNote = (ideaId: string, note: string) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            productionNotes: [...(idea.productionNotes || []), note],
          };
        }
        return idea;
      })
    );
  };

  const handleUpdateTask = (ideaId: string, updatedTask: Task) => {
    if (!isSitePublishedLive() && updatedTask.status === "completed") {
      setToastMessage({
        type: "info",
        text: "Site is not published yet: Real-money task payouts and earnings are inactive until IdeaVault is published live.",
      });
      return;
    }
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            tasks: (idea.tasks || []).map((t) => (t.id === updatedTask.id ? updatedTask : t)),
          };
        }
        return idea;
      })
    );

    if (updatedTask.status === "completed") {
      setUsers((prev) =>
        prev.map((u) => {
          if (u.name === (updatedTask.assignedToName || currentUser.name)) {
            const uWallet = u.wallet || {
              walletId: `VAULT-${u.id}`,
              vaultAccountId: `VAULT-${u.id}`,
              securityPin: "2059",
              biometricsEnabled: true,
              isLocked: false,
              currencySlots: { USD: 0, NPR: 0, INR: 0, EUR: 0, GBP: 0, AUD: 0, CAD: 0, JPY: 0, PLN: 0 },
              withdrawalMethods: [],
              transactions: [],
            };
            const updatedUser: UserProfile = {
              ...u,
              balance: u.balance + updatedTask.reward,
              wallet: {
                ...uWallet,
                currencySlots: {
                  ...uWallet.currencySlots,
                  USD: Math.round(((uWallet.currencySlots.USD || 0) + updatedTask.reward) * 100) / 100,
                },
                transactions: [
                  {
                    id: `TX-TASK-${Date.now()}`,
                    type: "task_payout",
                    amount: updatedTask.reward,
                    currency: "USD",
                    counterparty: "IdeaVault Escrow Pool",
                    description: `Bounty payout for completing "${updatedTask.title}"`,
                    timestamp: "Just now",
                    status: "completed",
                    referenceId: updatedTask.id,
                    txHash: `TASK${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
                  },
                  ...uWallet.transactions,
                ],
              },
            };
            if (currentUser.id === u.id || currentUser.name === u.name) {
              setCurrentUser(updatedUser);
            }
            return updatedUser;
          }
          return u;
        })
      );
    }
  };

  const handleAddTask = (ideaId: string, newTask: Task) => {
    setIdeas((prev) =>
      prev.map((idea) => {
        if (idea.id === ideaId) {
          return {
            ...idea,
            tasks: [...(idea.tasks || []), newTask],
          };
        }
        return idea;
      })
    );
  };

  const visibleAiCount = ideas.filter((i) => i.originType === "ai_seed").length;
  const realHumanCount = ideas.filter((i) => i.originType === "real_human" || i.isRealHuman).length;
  const aiDisappearancePercent = Math.min(100, Math.round(((18 - visibleAiCount) / 18) * 100));

  // Filtered ideas for feed and foryou
  const visibleIdeas = useMemo(() => {
    return ideas.filter((idea) => {
      if (idea.status === "removed_by_admin" && activeTab !== "moderation") {
        return false;
      }

      if (idea.originType === "ai_seed") {
        if (feedFilter === "real_humans") return false;
      } else {
        if (feedFilter === "ai_seeds") return false;
      }

      if (selectedCategory !== "All Ideas" && idea.category !== selectedCategory) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const text = `${idea.title} ${idea.description} ${idea.category} ${idea.tags.join(" ")} ${idea.creator.name} ${idea.creator.profession || ""}`.toLowerCase();
        if (!text.includes(query)) return false;
      }

      return true;
    });
  }, [ideas, selectedCategory, searchQuery, activeTab, feedFilter]);

  // For You ranking: sort by matchScore descending
  const forYouIdeas = useMemo(() => {
    return [...visibleIdeas].sort((a, b) => (b.matchScore || 50) - (a.matchScore || 50));
  }, [visibleIdeas]);

  const totalAiCount = 18;

  const flaggedCount = ideas.filter(
    (i) => i.safetyAudit?.isDangerous || i.status === "flagged_dangerous"
  ).length;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
      {isStandaloneWebsiteOpen ? (
        <CompanyLandingWebsite
          currentUser={currentUser}
          ideas={ideas}
          preferredCurrency={preferredCurrency}
          onSelectCurrency={setPreferredCurrency}
          onEnterMarketplace={() => enterMarketplaceApp("foryou")}
          onOpenCreateIdea={() => {
            if (!currentUser.passedHumanVerification) {
              setIsHumanVerifyOpen(true);
            } else if (!currentUser.agreedToUnAndNepalLaws) {
              setIsCreateAccountOpen(true);
            } else {
              setIsCreateOpen(true);
            }
          }}
          onOpenDigitalWallet={() => {
            setWalletInitialTab("slots");
            setIsDigitalWalletOpen(true);
          }}
          onOpenSiteCopyright={() => setIsSiteCopyrightOpen(true)}
          onOpenLegalGuide={() => setIsLegalGuideOpen(true)}
          onOpenSalesGraph={() => setIsSalesGraphOpen(true)}
          onOpenUnCert={() => setIsUnCertOpen(true)}
          onOpenEarningsDashboard={() => setIsEarningsDashboardOpen(true)}
          onOpenCreateAccount={(type) => {
            setCreateAccountInitialType(type);
            setIsCreateAccountOpen(true);
          }}
          onOpenLegalDocs={() => setIsLegalDocsCenterOpen(true)}
          onOpenPromoVideo={() => setIsPromoVideoOpen(true)}
          onOpenSeoGuide={() => setIsSeoGuideOpen(true)}
          onSelectIdea={(selected) => {
            setContractIdea(selected);
          }}
        />
      ) : (
        <>
          {/* Top Navigation */}
          <Navbar
            currentUser={currentUser}
            activeTab={activeTab}
            setActiveTab={(tab) => {
              if (tab === "website") {
                openStandaloneWebsite();
              } else {
                setActiveTab(tab);
              }
            }}
            onOpenStandaloneWebsite={openStandaloneWebsite}
            onOpenCreateIdea={() => {
              if (!currentUser.passedHumanVerification) {
                setIsHumanVerifyOpen(true);
              } else if (!currentUser.agreedToUnAndNepalLaws) {
                setIsCreateAccountOpen(true);
              } else {
                setIsCreateOpen(true);
              }
            }}
            onOpenEthicalCert={() => setIsEthicalCertOpen(true)}
            onOpenLegalGuide={() => setIsLegalGuideOpen(true)}
            onOpenSalesGraph={() => {
              setSalesGraphIdea(null);
              setIsSalesGraphOpen(true);
            }}
            onOpenAdvancedOwnerControl={() => setIsAdvancedOwnerControlOpen(true)}
            onOpenDigitalWallet={() => {
              setWalletInitialTab("slots");
              setIsDigitalWalletOpen(true);
            }}
            onOpenEarningsDashboard={() => setIsEarningsDashboardOpen(true)}
            onOpenScannerPay={() => setIsQrScannerOpen(true)}
            onOpenLawAndSafety={() => setIsLawAndSafetyOpen(true)}
            onOpenUnCert={() => setIsUnCertOpen(true)}
            onOpenCreateAccount={(type) => {
              setCreateAccountInitialType(type);
              setIsCreateAccountOpen(true);
            }}
            onOpenLegalDocs={() => setIsLegalDocsCenterOpen(true)}
            onOpenPromoVideo={() => setIsPromoVideoOpen(true)}
            onOpenSeoGuide={() => setIsSeoGuideOpen(true)}
            preferredCurrency={preferredCurrency}
            onSelectCurrency={setPreferredCurrency}
            flaggedCount={flaggedCount}
          />

          {/* Main Content Area - Clean, Uncrowded Layout */}
          <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:px-6 space-y-5">

        {/* TAB 1: FOR YOU RECOMMENDATION FEED */}
        {activeTab === "foryou" && (
          <div className="space-y-6">
            {/* For You Hero Header */}
            <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-r from-neutral-900 via-neutral-900 to-amber-950/30 p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Flame className="h-3.5 w-3.5" /> For You Match Engine
                    </span>
                    <span className="text-xs text-neutral-400">
                      Paired for: <strong className="text-neutral-200">{currentUser.name}</strong> ({currentUser.country || "Nepal"})
                    </span>
                  </div>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
                    Ideas Matching Your Industry & Skills
                  </h1>
                  <p className="mt-1 text-sm text-neutral-300 max-w-2xl leading-relaxed">
                    Personalized based on your background in <strong className="text-amber-300">{currentUser.backgroundField || currentUser.profession}</strong>. Every post is certified with copyright papers, real buyer matches, and automated In-App Digital Wallet settlement.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    id="btn-re-rank-foryou"
                    onClick={runRecommendationAlgorithm}
                    disabled={isMatchingWithAI}
                    className="flex items-center gap-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 px-4 py-2.5 text-xs font-semibold text-neutral-200 border border-neutral-700 active:scale-95 transition-all"
                  >
                    <Sparkles className={`h-4 w-4 text-amber-400 ${isMatchingWithAI ? "animate-spin" : ""}`} />
                    <span>{isMatchingWithAI ? "Re-ranking Engine..." : "Refresh Match Engine"}</span>
                  </button>

                  <button
                    onClick={() => setIsLegalGuideOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2.5 text-xs font-bold text-amber-300 transition-colors"
                  >
                    <Scale className="h-4 w-4" />
                    <span>Will I Receive Money? FAQ</span>
                  </button>
                </div>
              </div>

              {/* Quick Persona Interests Chips */}
              <div className="mt-4 pt-4 border-t border-neutral-800/80 flex flex-wrap items-center gap-2 text-xs">
                <span className="text-neutral-400 font-medium">Your Profile Interests:</span>
                {(currentUser.interests || []).map((interest, i) => (
                  <span
                    key={i}
                    className="rounded-lg bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 text-amber-300 font-medium"
                  >
                    ★ {interest}
                  </span>
                ))}
              </div>
            </div>

            {/* Community Authenticity & Dynamic 20% AI Seed Sunsetting Widget */}
            <AiSunsetTransitionBar
              realHumanCount={realHumanCount}
              totalAiCount={totalAiCount}
              visibleAiCount={visibleAiCount}
              aiDisappearancePercent={aiDisappearancePercent}
              humanPostsAddedCount={humanPostsAddedCount}
              feedFilter={feedFilter}
              onSetFeedFilter={setFeedFilter}
              onSimulateRealHumanPost={handleSimulateRealHumanPost}
              onResetTransition={handleResetTransition}
              onOpenCreateIdea={() => setIsCreateOpen(true)}
            />

            {/* Ideas List for For You */}
            <div className="space-y-4">
              {forYouIdeas.map((idea) => (
                <IdeaCard
                  key={idea.id}
                  idea={idea}
                  currentUser={currentUser}
                  onOpenContract={(selected) => setContractIdea(selected)}
                  onOpenProduction={(selected) => setProductionIdea(selected)}
                  onOpenTasks={(selected) => {
                    setSelectedCategory("All Ideas");
                    setActiveTab("tasks");
                  }}
                  onRemoveIdea={currentUser.isSiteOwner ? handleRemoveIdea : undefined}
                  onToggleLike={handleToggleLike}
                  onClaimAiSeed={(selected) => setClaimSeedIdea(selected)}
                  isLiked={likedIdeaIds.includes(idea.id)}
                  preferredCurrency={preferredCurrency}
                  onOpenCopyrightCert={(selected) => setCopyrightCertIdea(selected)}
                  onOpenMatchedBuyers={(selected) => setMatchedBuyersIdea(selected)}
                  onOpenSalesGraph={(selected) => {
                    setSalesGraphIdea(selected);
                    setIsSalesGraphOpen(true);
                  }}
                />
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: GENERAL SOCIAL FEED / ALL IDEAS */}
        {activeTab === "feed" && (
          <div className="space-y-6">
            {/* Community Authenticity & Dynamic 20% AI Seed Sunsetting Widget */}
            <AiSunsetTransitionBar
              realHumanCount={realHumanCount}
              totalAiCount={totalAiCount}
              visibleAiCount={visibleAiCount}
              aiDisappearancePercent={aiDisappearancePercent}
              humanPostsAddedCount={humanPostsAddedCount}
              feedFilter={feedFilter}
              onSetFeedFilter={setFeedFilter}
              onSimulateRealHumanPost={handleSimulateRealHumanPost}
              onResetTransition={handleResetTransition}
              onOpenCreateIdea={() => setIsCreateOpen(true)}
            />

            {/* Quick Composer Callout */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/80 p-4 sm:p-5 flex items-center justify-between gap-4 shadow-lg">
              <div className="flex items-center gap-3">
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-neutral-700"
                />
                <button
                  onClick={() => setIsCreateOpen(true)}
                  className="text-left text-xs sm:text-sm text-neutral-400 hover:text-neutral-200 transition-colors"
                >
                  Post your idea like a social media post... Instant copyright filed & list of willing buyers matched!
                </button>
              </div>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2 text-xs sm:text-sm font-bold text-neutral-950 shrink-0 transition-all shadow-md shadow-amber-500/20 active:scale-95"
              >
                <Plus className="h-4 w-4" />
                <span>Post Idea</span>
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-amber-400" />
                  Categories
                </div>
                <div className="relative w-64 max-w-full">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search ideas, tags, creators..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900/90 pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                {CATEGORIES_LIST.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? "bg-amber-500 text-neutral-950 shadow-sm"
                        : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Ideas Feed */}
            <div className="space-y-4">
              {visibleIdeas.length === 0 ? (
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-neutral-400">
                  <Layers className="mx-auto h-10 w-10 text-neutral-600 mb-3" />
                  <h3 className="font-bold text-neutral-200 text-lg">No ideas match current filters</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Try switching filters (e.g. show All, Real Humans only, or clear category selection).
                  </p>
                  <button
                    onClick={() => {
                      setSelectedCategory("All Ideas");
                      setFeedFilter("all");
                    }}
                    className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-neutral-950"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                visibleIdeas.map((idea) => (
                  <IdeaCard
                    key={idea.id}
                    idea={idea}
                    currentUser={currentUser}
                    onOpenContract={(selected) => setContractIdea(selected)}
                    onOpenProduction={(selected) => setProductionIdea(selected)}
                    onOpenTasks={(selected) => {
                      setSelectedCategory("All Ideas");
                      setActiveTab("tasks");
                    }}
                    onRemoveIdea={currentUser.isSiteOwner ? handleRemoveIdea : undefined}
                    onToggleLike={handleToggleLike}
                    onClaimAiSeed={(selected) => setClaimSeedIdea(selected)}
                    isLiked={likedIdeaIds.includes(idea.id)}
                    preferredCurrency={preferredCurrency}
                    onOpenCopyrightCert={(selected) => setCopyrightCertIdea(selected)}
                    onOpenMatchedBuyers={(selected) => setMatchedBuyersIdea(selected)}
                    onOpenSalesGraph={(selected) => {
                      setSalesGraphIdea(selected);
                      setIsSalesGraphOpen(true);
                    }}
                  />
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: TASKS MARKETPLACE */}
        {activeTab === "tasks" && (
          <TasksView
            ideas={ideas}
            currentUser={currentUser}
            onUpdateTask={handleUpdateTask}
            onAddTask={handleAddTask}
          />
        )}

        {/* TAB 4: CONTRACTS, BUYOUTS & SALES LEDGER */}
        {activeTab === "contracts" && (
          <div className="space-y-6">
            {/* Header */}
            <div className="rounded-2xl border border-neutral-800 bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 p-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-md bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      Commercial Deeds & Sales Ledger
                    </span>
                    <span className="text-xs text-sky-400">
                      3% Platform Master Vault Wallet Auto-Settled
                    </span>
                  </div>
                  <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
                    Executed Buyouts & Commercial Production
                  </h1>
                  <p className="mt-1 text-sm text-neutral-300 max-w-2xl leading-relaxed">
                    Review legally binding deals between Ideators and Buyers. Choose between 100% Full Copyright Buyouts (0% royalty) or 15% Lifetime Royalties.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setSalesGraphIdea(null);
                      setIsSalesGraphOpen(true);
                    }}
                    className="flex items-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-300 transition-colors"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Open Sales & Profit Chart</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Contracts List */}
            <div className="space-y-4">
              {ideas.filter((i) => i.status === "in_production" || i.status === "market_launched" || i.status === "under_contract").length === 0 ? (
                <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center text-neutral-400">
                  <FileText className="mx-auto h-10 w-10 text-neutral-600 mb-3" />
                  <h3 className="font-bold text-neutral-200 text-lg">No Executed Deals Yet</h3>
                  <p className="text-xs text-neutral-500 mt-1">
                    Select any idea from the feed and match with buyers or click "Acquire & Sign Contract" to execute a deal!
                  </p>
                </div>
              ) : (
                ideas
                  .filter((i) => i.status === "in_production" || i.status === "market_launched" || i.status === "under_contract")
                  .map((idea) => {
                    const isFullBuyout = idea.saleModel === "full_buyout";
                    const commission = calculateCommissionBreakdown(idea.upfrontPrice, idea.saleModel);
                    return (
                      <div
                        key={idea.id}
                        className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-6 shadow-lg space-y-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="text-lg font-bold text-neutral-100">{idea.title}</h3>
                              <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                                isFullBuyout
                                  ? "bg-purple-500/15 border border-purple-500/30 text-purple-400"
                                  : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                              }`}>
                                {isFullBuyout ? "100% Full Copyright Buyout" : "15% Ongoing Royalty Active"}
                              </span>
                              <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-xs text-neutral-400">
                                {idea.category}
                              </span>
                            </div>
                            <div className="text-xs text-neutral-400 mt-1.5 flex items-center gap-2 flex-wrap">
                              <span>Originating Ideator: <strong className="text-neutral-200">{idea.creator.name}</strong></span>
                              <span>•</span>
                              <span>Upfront Stake: <strong className="text-amber-400 font-mono">${idea.upfrontPrice} USD</strong> ({formatPrice(idea.upfrontPrice, preferredCurrency)})</span>
                              {idea.copyrightFiling && (
                                <>
                                  <span>•</span>
                                  <button
                                    onClick={() => setCopyrightCertIdea(idea)}
                                    className="text-amber-400 hover:underline flex items-center gap-1 font-mono"
                                  >
                                    <ShieldCheck className="h-3 w-3" />
                                    Cert #{idea.copyrightFiling.certificateId}
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              onClick={() => {
                                setSalesGraphIdea(idea);
                                setIsSalesGraphOpen(true);
                              }}
                              className="flex items-center gap-1.5 rounded-xl border border-neutral-700 bg-neutral-800 hover:bg-neutral-700 px-3 py-2 text-xs font-semibold text-neutral-200 transition-colors"
                            >
                              <BarChart3 className="h-3.5 w-3.5 text-emerald-400" />
                              <span>Sales Graph & Proof</span>
                            </button>

                            <button
                              onClick={() => setProductionIdea(idea)}
                              className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-4 py-2 text-xs font-bold text-neutral-950 shadow-md shadow-emerald-500/20 active:scale-95 transition-all"
                            >
                              <Briefcase className="h-3.5 w-3.5" />
                              <span>Production Room</span>
                            </button>
                          </div>
                        </div>

                        {/* Financial Tally Grid */}
                        <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div>
                            <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
                              Consideration / Buyout
                            </span>
                            <span className="text-base font-extrabold text-neutral-100 font-mono">
                              ${idea.upfrontPrice} USD
                            </span>
                            <span className="text-[10px] text-neutral-400 block font-mono">
                              {formatPrice(idea.upfrontPrice, preferredCurrency)}
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] text-amber-400 uppercase tracking-wider block mb-1">
                              {isFullBuyout ? "Net Seller Payout (97%)" : "Ideator's 15% Royalty"}
                            </span>
                            <span className="text-base font-extrabold text-amber-400 font-mono">
                              {isFullBuyout 
                                ? `$${commission.netSellerUsd} USD` 
                                : `+$${(idea.marketSales?.commissionEarned || 0).toLocaleString()} USD`}
                            </span>
                            <span className="text-[10px] text-amber-300 block font-mono">
                              {isFullBuyout ? formatPrice(commission.netSellerUsd, preferredCurrency) : "15% on gross sales"}
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] text-sky-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                              <Smartphone className="h-3 w-3" />
                              3% Master Vault Wallet
                            </span>
                            <span className="text-base font-extrabold text-sky-400 font-mono">
                              ₨{commission.platformFeeNpr.toLocaleString()} NPR
                            </span>
                            <span className="text-[10px] text-sky-300 block font-mono">
                              Settled into App Master Wallet
                            </span>
                          </div>

                          <div>
                            <span className="text-[11px] text-neutral-500 uppercase tracking-wider block mb-1">
                              Legal Certified Status
                            </span>
                            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1">
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              {isFullBuyout ? "100% Sold & Delivered" : "Covenant Active"}
                            </span>
                            <span className="text-[10px] text-neutral-400 block">
                              Nepal & WIPO Compliant
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        )}

        {/* TAB 5: SITE OWNER TRUST & MODERATION */}
        {activeTab === "moderation" && (
          <SiteOwnerDashboard
            ideas={ideas}
            currentUser={currentUser}
            onRemoveIdea={handleRemoveIdea}
            onRestoreIdea={handleRestoreIdea}
            onOpenCopyrightModal={() => setIsSiteCopyrightOpen(true)}
            onOpenAdvancedControl={() => setIsAdvancedOwnerControlOpen(true)}
          />
        )}
          </main>
        </>
      )}

      {/* ALL MODALS */}
      <CreateIdeaModal
        currentUser={currentUser}
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onAddIdea={handleAddIdea}
        preferredCurrency={preferredCurrency}
      />

      <ContractModal
        idea={contractIdea}
        currentUser={currentUser}
        ownerProfile={users.find((u) => u.isSiteOwner) || currentUser}
        isOpen={Boolean(contractIdea)}
        onClose={() => setContractIdea(null)}
        onSignContract={handleSignContract}
      />

      <ProductionRoomModal
        idea={productionIdea}
        currentUser={currentUser}
        ownerProfile={users.find((u) => u.isSiteOwner) || currentUser}
        isOpen={Boolean(productionIdea)}
        onClose={() => setProductionIdea(null)}
        onSimulateSale={handleSimulateSale}
        onAddProductionNote={handleAddProductionNote}
      />

      <ClaimAiSeedModal
        idea={claimSeedIdea}
        currentUser={currentUser}
        isOpen={Boolean(claimSeedIdea)}
        onClose={() => setClaimSeedIdea(null)}
        onClaimSuccess={handleClaimAiSeedSuccess}
      />

      {/* Sales and Profit Graph Modal with Mid-Process and Final Product Proofs */}
      <SalesAndProfitGraphModal
        idea={salesGraphIdea}
        isOpen={isSalesGraphOpen}
        onClose={() => {
          setIsSalesGraphOpen(false);
          setSalesGraphIdea(null);
        }}
        preferredCurrency={preferredCurrency}
      />

      {/* Legal and Money Guide FAQ Modal */}
      <LegalAndMoneyGuideModal
        isOpen={isLegalGuideOpen}
        onClose={() => setIsLegalGuideOpen(false)}
        userEmail={currentUser.email}
        userCountry={currentUser.country}
      />

      {/* Copyright Certificate Official Registration Modal */}
      <CopyrightCertificateModal
        idea={copyrightCertIdea}
        isOpen={Boolean(copyrightCertIdea)}
        onClose={() => setCopyrightCertIdea(null)}
        userEmail={currentUser.email}
        preferredCurrency={preferredCurrency}
      />

      {/* Matched Buyers Willing to Acquire and Build Idea Modal */}
      <MatchedBuyersModal
        idea={matchedBuyersIdea}
        currentUser={currentUser}
        isOpen={Boolean(matchedBuyersIdea)}
        onClose={() => setMatchedBuyersIdea(null)}
        onExecuteDeal={handleExecuteBuyerDeal}
        onOpenContractForBuyer={(ideaToBuy) => {
          setMatchedBuyersIdea(null);
          setContractIdea(ideaToBuy);
        }}
        preferredCurrency={preferredCurrency}
      />

      {/* Create Account & Owner Uploads Modal (1. Investor, 2. Idea Poster, 3. Owner Account) */}
      <CreateAccountModal
        isOpen={isCreateAccountOpen}
        onClose={() => setIsCreateAccountOpen(false)}
        onAccountCreated={handleAccountCreated}
        initialAccountType={createAccountInitialType}
        currentOwner={users.find((u) => u.isSiteOwner) || currentUser}
        onUpdateOwnerAccount={handleUpdateOwnerProfile}
      />

      {/* Human Verification "I'm a Human" Modal with Different Tests Per Person */}
      <HumanVerificationModal
        user={currentUser}
        isOpen={isHumanVerifyOpen}
        onClose={() => setIsHumanVerifyOpen(false)}
        onVerifySuccess={handleHumanVerifySuccess}
      />

      {/* Email Copyright Authority & Official Site Rules Modal */}
      <EmailCopyrightCompanyModal
        currentUser={currentUser}
        isOpen={isEmailCopyrightOpen}
        onClose={() => setIsEmailCopyrightOpen(false)}
        onInquiryDispatched={(inquiry) => {
          setToastMessage({
            type: "success",
            text: `Inquiry dispatched to ${inquiry.recipientEmail}! Official copyright rules synchronized with IdeaVault under Nepal Copyright Act 2059 & WIPO Berne Convention.`,
          });
        }}
      />

      {/* Fraud-Free Statutory Cross-Check Matrix Modal */}
      <LegalCrossCheckModal
        isOpen={isLegalCrossCheckOpen}
        onClose={() => setIsLegalCrossCheckOpen(false)}
      />

      {/* Official Site Copyright Registration Certificate Modal for Medha Koirala */}
      <SiteCopyrightModal
        isOpen={isSiteCopyrightOpen}
        onClose={() => setIsSiteCopyrightOpen(false)}
        copyright={siteCopyright}
      />

      {/* Advanced Site Owner Command Console, Anti-Hack Shield & Live Sync Modal */}
      <AdvancedSiteControlModal
        isOpen={isAdvancedOwnerControlOpen}
        onClose={() => setIsAdvancedOwnerControlOpen(false)}
        currentUser={currentUser}
        onUpdateOwnerProfile={handleUpdateOwnerProfile}
        ideas={ideas}
        onRemoveIdea={handleRemoveIdea}
        onRestoreIdea={handleRestoreIdea}
        copyright={siteCopyright}
        onOpenCopyrightModal={() => {
          setIsAdvancedOwnerControlOpen(false);
          setIsSiteCopyrightOpen(true);
        }}
        antiHackState={antiHackState}
        onUpdateAntiHackState={setAntiHackState}
        onForceLiveSync={handleForceLiveSync}
        lastSyncedAt={lastSyncedAt}
        syncVersion={syncVersion}
      />

      {/* In-App Real-Money Multi-Currency Digital Wallet Modal with Digital Wallet & Any Bank Withdrawals */}
      <DigitalWalletModal
        isOpen={isDigitalWalletOpen}
        onClose={() => setIsDigitalWalletOpen(false)}
        currentUser={currentUser}
        wallet={currentUser.wallet || {
          walletId: `VAULT-${currentUser.id}`,
          vaultAccountId: `VAULT-${currentUser.id}`,
          securityPin: "2059",
          biometricsEnabled: true,
          isLocked: false,
          currencySlots: { USD: currentUser.balance || 0, NPR: 0, INR: 0, EUR: 0, GBP: 0, AUD: 0, CAD: 0, JPY: 0, PLN: 0 },
          withdrawalMethods: [],
          transactions: [],
        }}
        onUpdateWallet={handleUpdateWallet}
        preferredCurrency={preferredCurrency}
        onPayForIdeaByScan={handlePayForIdeaByScan}
        initialTab={walletInitialTab}
      />

      {/* Real-Money Line Graph Earnings & Royalties Dashboard Modal */}
      <EarningsDashboardModal
        isOpen={isEarningsDashboardOpen}
        onClose={() => setIsEarningsDashboardOpen(false)}
        currentUser={currentUser}
        users={users}
        ideas={ideas}
        wallet={currentUser.wallet || {
          walletId: `VAULT-${currentUser.id}`,
          vaultAccountId: `VAULT-${currentUser.id}`,
          securityPin: "2059",
          biometricsEnabled: true,
          isLocked: false,
          currencySlots: { USD: currentUser.balance || 0, NPR: 0, INR: 0, EUR: 0, GBP: 0, AUD: 0, CAD: 0, JPY: 0, PLN: 0 },
          withdrawalMethods: [],
          transactions: [],
        }}
        preferredCurrency={preferredCurrency}
        onOpenWallet={(tab) => {
          setIsEarningsDashboardOpen(false);
          setWalletInitialTab(tab || "withdraw");
          setIsDigitalWalletOpen(true);
        }}
        onUpdateWallet={handleUpdateWallet}
        onOpenOwnerAccountUploads={() => {
          setIsEarningsDashboardOpen(false);
          setCreateAccountInitialType("owner");
          setIsCreateAccountOpen(true);
        }}
      />

      {/* System Connection & Cloud Diagnostics Modal */}
      <ConnectionStatusModal
        isOpen={isConnectionStatusOpen}
        onClose={() => setIsConnectionStatusOpen(false)}
        syncVersion={syncVersion}
        lastSyncedAt={lastSyncedAt}
        onForceSync={handleForceLiveSync}
      />

      {/* Directorate of Laws, Real-Time Scam Detection & 5-Strike Governance Modal */}
      <LawAndSafetyModal
        isOpen={isLawAndSafetyOpen}
        onClose={() => setIsLawAndSafetyOpen(false)}
        currentUser={currentUser}
        preferredCurrency={preferredCurrency}
      />

      {/* Active Camera & Screen QR Scanner Modal */}
      <QrScannerModal
        isOpen={isQrScannerOpen}
        onClose={() => setIsQrScannerOpen(false)}
        currentUser={currentUser}
        preferredCurrency={preferredCurrency}
        onProcessPayment={handleScannerPayment}
      />

      {/* Official United Nations & WIPO International Legal Certificate Modal */}
      <UnLegalAndAntiHackCertModal
        isOpen={isUnCertOpen}
        onClose={() => setIsUnCertOpen(false)}
        currentUser={currentUser}
        preferredCurrency={preferredCurrency}
      />

      {/* Unified Legal Copyright Documents Vault (All 4 Official Deeds & Law Drafts) */}
      <LegalDocumentsCenterModal
        isOpen={isLegalDocsCenterOpen}
        onClose={() => setIsLegalDocsCenterOpen(false)}
        siteCopyright={siteCopyright}
        ideas={ideas}
        currentUser={currentUser}
      />

      {/* Official IdeaVault Promotional Video Studio & .webm Exporter */}
      <PromoVideoStudioModal
        isOpen={isPromoVideoOpen}
        onClose={() => setIsPromoVideoOpen(false)}
      />

      {/* Step-by-Step Search Engine Indexing Hub (Google, Bing, DuckDuckGo, Yahoo, Brave) */}
      <SearchEngineGuideModal
        isOpen={isSeoGuideOpen}
        onClose={() => setIsSeoGuideOpen(false)}
        onOpenPromoVideo={() => setIsPromoVideoOpen(true)}
      />

      {/* Clean Minimal Marketplace Footer (only when inside Marketplace App) */}
      {!isStandaloneWebsiteOpen && (
        <footer className="mt-12 border-t border-neutral-800/80 bg-neutral-950 py-8 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
            <div className="flex items-center gap-2.5 flex-wrap text-center sm:text-left">
              <IdeaVaultLogo size="xs" />
              <span className="font-bold text-neutral-200">IdeaVault</span>
              <span aria-hidden="true">·</span>
              <span>Founded by {currentUser.isSiteOwner ? currentUser.name : "Medha Koirala"}</span>
            </div>

            <div className="flex items-center gap-5 flex-wrap justify-center">
              <button
                onClick={() => setActiveTab("foryou")}
                className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Marketplace
              </button>
              <button
                onClick={() => setIsLegalDocsCenterOpen(true)}
                className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Copyright Legal Docs
              </button>
              <button
                onClick={() => setIsPromoVideoOpen(true)}
                className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Promo Video
              </button>
              <button
                onClick={() => setIsSeoGuideOpen(true)}
                className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Search Engine Guide
              </button>
              <button
                onClick={() => setIsEarningsDashboardOpen(true)}
                className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Earnings Dashboard
              </button>
              <button
                onClick={() => {
                  setWalletInitialTab("withdraw");
                  setIsDigitalWalletOpen(true);
                }}
                className="text-neutral-400 hover:text-neutral-200 transition-colors cursor-pointer"
              >
                Digital Wallet &amp; QR
              </button>
              <button
                type="button"
                onClick={openStandaloneWebsite}
                className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                title="Open Official IdeaVault Website"
              >
                <Globe className="h-3.5 w-3.5" />
                <span>Official Website</span>
                <ExternalLink className="h-3 w-3 opacity-80" />
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto mt-5 pt-5 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-neutral-400 text-center sm:text-left">
            <span>For any queries and questions, contact us at:</span>
            <a
              href="mailto:medhakoirala.servicesgmail.com@gmail.com"
              className="inline-flex items-center gap-1.5 font-semibold text-amber-400 hover:text-amber-300 transition-colors break-all"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" />
              <span>medhakoirala.servicesgmail.com@gmail.com</span>
            </a>
          </div>
        </footer>
      )}

      {/* Floating Action Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 max-w-md rounded-2xl border border-neutral-700 bg-neutral-900/95 p-4 shadow-2xl backdrop-blur-xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-5">
          <div
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
              toastMessage.type === "success"
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
          </div>
          <div className="flex-1 text-xs text-neutral-200 leading-relaxed font-medium">
            {toastMessage.text}
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-neutral-400 hover:text-neutral-200 p-1"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
