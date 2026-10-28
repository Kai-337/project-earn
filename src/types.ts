export type CategoryType =
  | "All Ideas"
  | "Tech & AI Software"
  | "Physical Hardware & Robotics"
  | "Green Tech & Sustainability"
  | "Creative Media & Gaming"
  | "Health, Bio & Fitness"
  | "Consumer Products & Lifestyle"
  | "Everyday Life Hacks & Tools";

export type TaskType =
  | "act_performance"
  | "design_prototype"
  | "market_validation"
  | "engineering"
  | "creator_consultation";

export type CurrencyCode = "USD" | "NPR" | "INR" | "EUR" | "GBP" | "AUD" | "CAD" | "JPY" | "PLN";

export type SaleModelType = "keep_copyright" | "full_buyout" | "licensed_fixed_term" | "royalty_split";

export interface CopyrightFiling {
  certificateId: string;
  registeredAt: string;
  authorName: string;
  authorCountry: string;
  authorEmail: string;
  governingLaws: string[];
  cryptographicHash: string;
  saleModel: SaleModelType;
  ownershipStatus: "registered_to_author" | "fully_assigned_to_buyer";
  buyerName?: string;
  buyerCompany?: string;
  assignmentDate?: string;
  documentsDelivered: boolean;
  legalPreamble: string;
}

export interface BuyerMatch {
  id: string;
  name: string;
  handle: string;
  company: string;
  avatar: string;
  matchScore: number;
  reason: string;
  budgetUsd: number;
  country: string;
  preferredCurrency: CurrencyCode;
  verifiedBuilder: boolean;
  pastCreations: string[];
  contactStatus: "available" | "offer_sent" | "ready_to_buy";
  industry?: string;
  offerType?: string;
  bidAmountUsd?: number;
  verifiedCapital?: boolean;
  matchConfidence?: number;
  notes?: string;
}

export interface StrikeRecord {
  id: string;
  date: string;
  strikeNumber: number; // 1, 2, 3, 4, 5, or 6 (termination)
  reason: string;
  violatedLaw: string;
  evidenceSummary: string; // Dossier of logs, screenshots, IP or payload proof
  evidenceFileHashes?: string[];
  emailNoticeSentTo: string;
  actionTaken: "warning_strike_1" | "warning_strike_2" | "warning_strike_3" | "warning_strike_4" | "final_warning_strike_5" | "direct_termination_funds_wired";
  fundsRemittedAmount?: number;
  fundsRemittedCurrency?: CurrencyCode;
  fundsRemittedDestination?: string;
  acknowledgedByEmail: boolean;
}

export interface Task {
  id: string;
  ideaId: string;
  title: string;
  description: string;
  type: TaskType;
  reward: number; // in USD
  status: "open" | "in_progress" | "submitted" | "completed" | "paid";
  assignedToName?: string;
  applicantCount: number;
  dueDate: string;
  deliverables?: string;
}

export interface AccountUploadedFile {
  id: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  kind: "image" | "document";
  dataUrl: string;
  uploadedAt: string;
}

// Payout Accounts: Real-World Bank Account or Real-World Digital Wallet Only
export interface WithdrawalMethod {
  id: string;
  type: "bank" | "digital_wallet";
  providerName: string; // User-selected Digital Wallet or Any Bank Account
  accountIdentifier: string; // Account Number, IBAN, Phone, or Email
  accountHolderName: string;
  routingOrSwiftOrBranch?: string;
  currency: CurrencyCode;
  isDefault: boolean;
  verifiedAt: string;
  notes?: string;
  qrImageDataUrl?: string;
  uploadedFiles?: AccountUploadedFile[];
}

// In-App Digital Wallet: Chronological Transaction Ledger
export interface WalletTransaction {
  id: string;
  type:
    | "sale_received"
    | "royalty_received"
    | "task_payout"
    | "qr_scanner_payment"
    | "withdrawal"
    | "direct_transfer"
    | "currency_exchange"
    | "platform_discovery_fee"
    | "owner_qr_auto_wire";
  amount: number;
  currency: CurrencyCode;
  counterparty: string;
  counterpartyRole?: string;
  description: string;
  timestamp: string;
  status: "completed" | "processing" | "escrow_secured";
  referenceId: string;
  txHash: string;
  qrPayload?: string;
  realBankOrQrRefId?: string;
  paymentProofFile?: AccountUploadedFile;
  wiredOwnerNprAmount?: number;
}

export interface OwnerQrAccountConfig {
  accountHolderName: string;
  qrProviderName: string; // Chosen by owner (no pre-selected bank)
  qrAccountId: string; // Phone, Merchant ID, or QR Account identifier
  qrImageDataUrl?: string; // Uploaded real QR image for automatic NPR wiring
  currency: CurrencyCode; // Always NPR (Nepalese Rupee) for Owner automatic wire
  autoWireEnabled: boolean;
  updatedAt: string;
}

// In-App Digital Wallet: Secured Multi-Currency Slots & Controls
export interface UserDigitalWallet {
  walletId: string;
  vaultAccountId?: string; // e.g. "VAULT-NP-2059-..."
  securityPin: string; // 4-digit PIN for withdrawals and QR scanner checkout
  biometricsEnabled: boolean;
  isLocked: boolean;
  // Multi-Currency Slots: dedicated slot for storing different currencies
  currencySlots: Record<CurrencyCode, number>;
  withdrawalMethods: WithdrawalMethod[];
  ownerQrAccount?: OwnerQrAccountConfig;
  transactions: WalletTransaction[];
  totalDepositedUsd?: number;
  totalWithdrawnUsd?: number;
  totalEarnedUsd?: number;
}

export interface Contract {
  id: string;
  ideaId: string;
  ideaTitle: string;
  creatorId: string;
  creatorName: string;
  creatorProfession?: string;
  creatorCountry?: string;
  isNonTech?: boolean;
  isNonTechCreator?: boolean;
  creatorSignedAt?: string;
  buyerId: string;
  buyerName: string;
  buyerCompany?: string;
  buyerSignedAt?: string;
  status: "draft" | "pending_buyer" | "pending_creator" | "fully_executed" | "in_production" | "market_launched";
  upfrontFee: number;
  royaltyPercent: number; // 15% standard or 0% in full buyout
  platformFeePercent: number; // 3% commission to platform creator for providing discovery engine
  buyerSharePercent: number; // 82% in royalty or 97% net in full buyout
  contractText: string;
  creatorProductionRole: string;
  escrowStatus: "held_in_escrow" | "released_to_creator" | "milestone_active";
  legalHash: string;
  createdAt: string;
  // Full Buyout & Copyright Sale terms
  saleModel?: SaleModelType;
  copyrightAssigned?: boolean;
  // Multi-Currency & In-App Digital Wallet Settlement
  payoutCurrency?: CurrencyCode;
  ideatorPayoutAmount?: number;
  platformFeeRecipient?: string; // "IdeaVault Master Vault Wallet (Medha Koirala)"
  ownerWalletAmountNpr: number;
  ownerWalletAmountUsd: number;
  ownerWalletTxnId: string;
  ownerWalletStatus: "settled_in_app_wallet" | "transferred" | "auto_wired_to_owner_qr";
  legalCertDelivered?: boolean;
  realBankOrQrRefId?: string;
  paymentProofFile?: AccountUploadedFile;
  wiredOwnerNprAmount?: number;
  // Backward compatibility fields
  ownerEsewaPhone?: string;
  ownerEsewaAmountNpr?: number;
  ownerEsewaTxnId?: string;
  ownerEsewaStatus?: "wired_automatically" | "settled";
}

export interface Idea {
  id: string;
  title: string;
  summaryPitch: string;
  description: string;
  details: string; // deeper technical/artistic expansion
  category: Exclude<CategoryType, "All Ideas">;
  tags: string[];
  creator: {
    id: string;
    name: string;
    handle: string;
    avatar: string;
    reputation: number;
    totalEarned: number;
    verified: boolean;
    role: string;
    profession?: string; // e.g., "ICU Head Nurse", "High School Science Teacher", "Executive Chef"
    isNonTech?: boolean; // true if creator comes from outside tech
    backgroundField?: string; // e.g., "Healthcare", "Education", "Culinary", "Trades", "Arts"
    isRealHuman?: boolean; // true when verified real human
    originType?: "real_human" | "ai_seed"; // transparent origin distinction
    country?: string;
    email?: string;
    preferredCurrency?: CurrencyCode;
  };
  upfrontPrice: number; // USD required to secure exclusivity/production license
  buyoutPrice?: number; // USD required for 100% full copyright sale with 0% royalty
  saleModel?: SaleModelType; // "full_buyout" or "royalty_split"
  royaltyCommissionPercent: number; // Standard 15% to Ideator (or 0% if full buyout)
  platformCommissionPercent: number; // 3% to Platform Creator (Secure In-App Master Wallet)
  createdAt: string;
  likes: number;
  views: number;
  collaboratorsCount: number;
  status:
    | "available"
    | "contract_pending"
    | "under_contract"
    | "in_production"
    | "market_launched"
    | "flagged_dangerous"
    | "removed_by_admin";
  safetyAudit: {
    isDangerous: boolean;
    dangerScore: number; // 0 to 100
    dangerReason?: string;
    reviewedByOwner?: boolean;
    actionTaken?: "safe" | "warned" | "removed";
  };
  tasks: Task[];
  contract?: Contract;
  marketSales?: {
    totalProductSales: number; // Gross sales in market
    commissionEarned: number; // 15% to Ideator
    platformCommissionEarned: number; // 3% to Platform Creator Master Wallet
    quarterlyRevenue: number;
    unitsSold: number;
    launchDate: string;
    lastPayoutDate: string;
  };
  // Matching recommendation metadata for current user
  matchScore?: number;
  matchReason?: string;
  productionNotes?: string[];
  // Copyright Filing Document & Matched Buyers
  copyrightFiling?: CopyrightFiling;
  matchedBuyers?: BuyerMatch[];
  // Real Human vs AI Origin Tracking & 20% Sunsetting Engine
  originType: "real_human" | "ai_seed";
  isRealHuman: boolean;
  aiSeedInfo?: {
    isAiPosingAsAi: boolean; // strictly transparent: AI posing as AI, never deceptive
    botName: string;
    decayIndex: number; // 0 to 4 (each real human post retires 1 step / 20%)
    lureHook: string; // what commercial space this seed aims to lure humans into
    openForAdoption: boolean;
    claimedByHuman?: boolean;
    claimedByHumanName?: string;
  };
}

export type AccountCreationType = "investor" | "idea_poster" | "owner";

export interface UserProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  role: "creator_ideator" | "builder_buyer" | "site_owner";
  accountType?: "investor" | "idea_poster" | "owner";
  headline: string;
  profession?: string;
  investorCompany?: string;
  customInvestmentSectors?: string[];
  preferredDealModel?: "keep_copyright" | "full_buyout" | "licensed_fixed_term";
  backgroundField?: string;
  isNonTech?: boolean;
  isRealHuman: boolean; // No AI posing as real people
  interests: string[];
  skills: string[];
  balance: number; // Available cash in USD representation
  escrowBalance: number;
  totalRoyaltiesEarned: number;
  platformRevenueEarned?: number; // 3% discovery royalties earned by the platform creator
  activeContractsCount: number;
  isSiteOwner: boolean;
  isPermanentOwner?: boolean; // Permanent owner tag cannot be altered or revoked
  ownerCustomTitle?: string;
  // In-App Digital Wallet
  wallet: UserDigitalWallet;
  // Uploaded Account Images, Supporting Documents & Receive Payment QR
  uploadedFiles?: AccountUploadedFile[];
  receiveQrImageDataUrl?: string;
  // Account verification, country, preferred currency, and legal status
  email?: string;
  country?: string;
  phone?: string;
  preferredCurrency: CurrencyCode;
  esewaPhone?: string; // Kept as optional legacy reference
  strikesCount: number; // 0 to 3
  isBanned: boolean;
  strikeRecords?: StrikeRecord[];
  passedHumanVerification?: boolean; // Completed interactive "I'm a human" test
  humanVerificationDate?: string;
  humanVerificationType?: string; // e.g. "Visual Craft Pattern", "Physical Logic Riddle", etc.
  agreedToUnAndNepalLaws: boolean;
}

export interface ScamFraudAlert {
  id: string;
  threatLevel: "critical" | "warning" | "contained";
  title: string;
  description: string;
  violatedStatutes: string[];
  attemptedAction: string;
  timestamp: string;
  perpetratorHandle?: string;
  actionTaken: string;
  isResolved: boolean;
}

export interface CopyrightRuleInquiry {
  id: string;
  recipientOrg: string;
  recipientEmail: string;
  subject: string;
  statutoryBasis: string[];
  sentAt: string;
  status: "sent" | "delivered" | "rules_confirmed";
  rulesReceivedSummary: string;
}

export interface ProductionMessage {
  id: string;
  ideaId: string;
  senderName: string;
  senderRole: "Creator (Ideator)" | "Buyer (Producer)" | "Platform Escrow" | "AI Copilot";
  timestamp: string;
  content: string;
  type: "text" | "milestone" | "sales_report" | "idea_expansion";
}

export interface SiteCopyrightRegistration {
  certificateNumber: string; // e.g., "NP-CR-2059-MEDHA-KOIRALA-IDEA-VAULT-001"
  platformName: string;
  ownerFullName: string;
  ownerEmail: string;
  ownerCountry: string;
  filingDate: string;
  governingLaws: string[];
  cryptographicSignature: string;
  status: "officially_registered_and_sealed" | "provisional";
  rightsGranted: string[];
  feeBeneficiaryWallet: string; // "IdeaVault Master Vault Multi-Currency Wallet (Medha Koirala)"
  isPerpetual: boolean;
  // Backward compatibility
  esewaBeneficiary?: string;
}

export interface LiveSyncState {
  lastSyncedAt: string;
  syncStatus: "live_synchronized" | "syncing" | "cloud_connected";
  syncHash: string;
  versionCount: number;
  publishedUrl: string;
  autoSyncEnabled: boolean;
}

export interface AntiHackDefenseStatus {
  shieldActive: boolean;
  tamperIntegrityVerified: boolean;
  activeAttacksBlocked: number;
  sqlInjectionProtection: boolean;
  xssSanitizationActive: boolean;
  rateLimiterActive: boolean;
  emergencyLockdown: boolean;
  auditLog: {
    id: string;
    timestamp: string;
    event: string;
    sourceNode: string;
    sourceIp?: string;
    defenseAction: string;
    statuteViolated: string;
  }[];
}
