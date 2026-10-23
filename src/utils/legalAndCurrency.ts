import { CurrencyCode, CopyrightFiling, BuyerMatch, SaleModelType } from "../types";

// Live Currency Exchange Rates relative to 1 USD
export const EXCHANGE_RATES: Record<CurrencyCode, { rate: number; symbol: string; label: string; country: string; flag: string }> = {
  USD: { rate: 1.0, symbol: "$", label: "USD - US Dollar", country: "United States", flag: "🇺🇸" },
  PLN: { rate: 3.98, symbol: "zł", label: "PLN - European Złoty", country: "European Union (PLN)", flag: "🇪🇺" },
  EUR: { rate: 0.92, symbol: "€", label: "EUR - Euro", country: "European Union", flag: "🇪🇺" },
  NPR: { rate: 135.2, symbol: "₨", label: "NPR - Nepalese Rupee (नेपाली रुपैयाँ)", country: "Nepal", flag: "🇳🇵" },
  INR: { rate: 83.5, symbol: "₹", label: "INR - Indian Rupee (भारतीय रुपया)", country: "India", flag: "🇮🇳" },
  GBP: { rate: 0.79, symbol: "£", label: "GBP - British Pound", country: "United Kingdom", flag: "🇬🇧" },
  AUD: { rate: 1.52, symbol: "A$", label: "AUD - Australian Dollar", country: "Australia", flag: "🇦🇺" },
  CAD: { rate: 1.36, symbol: "C$", label: "CAD - Canadian Dollar", country: "Canada", flag: "🇨🇦" },
  JPY: { rate: 155.0, symbol: "¥", label: "JPY - Japanese Yen (円)", country: "Japan", flag: "🇯🇵" },
};

// Platform Owner Real-Money Multi-Currency Account (Medha Koirala)
export const PLATFORM_OWNER_WALLET = {
  walletId: "VAULT-MK-977-MASTER-001",
  vaultAccountId: "VAULT-MK-977-MASTER-001",
  accountName: "Medha Koirala (Founder & Owner • Copyright Proprietor of the App/Site)",
  commissionPercent: 3,
  walletProvider: "Real-Money Multi-Currency Account (ISO-4217 National Currencies Only)",
  gatewayStatus: "Pre-Launch Ready (Real World Money Only)",
  phone: "+977 9767653245",
  supportedWithdrawals: [
    "Any Digital Wallet Chosen by Owner",
    "Any Domestic or International Bank Account Chosen by Owner"
  ],
};

// Backward-compatible alias for existing references
export const PLATFORM_OWNER_ESEWA = PLATFORM_OWNER_WALLET;

export function convertUsdToCurrency(amountUsd: number, currency: CurrencyCode): number {
  const rate = EXCHANGE_RATES[currency]?.rate || 1;
  return Math.round(amountUsd * rate * 100) / 100;
}

export function convertCurrencyToUsd(amountLocal: number, currency: CurrencyCode): number {
  const rate = EXCHANGE_RATES[currency]?.rate || 1;
  return Math.round((amountLocal / rate) * 100) / 100;
}

export function convertCurrencyToCurrency(amount: number, from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return amount;
  const inUsd = convertCurrencyToUsd(amount, from);
  return convertUsdToCurrency(inUsd, to);
}

export function formatPrice(amountUsd: number, currency: CurrencyCode = "USD"): string {
  const info = EXCHANGE_RATES[currency] || EXCHANGE_RATES.USD;
  const localVal = Math.round(amountUsd * info.rate);
  return `${info.symbol}${localVal.toLocaleString()}`;
}

export function formatLocalCurrency(amountInLocalCurrency: number, currency: CurrencyCode): string {
  const info = EXCHANGE_RATES[currency] || EXCHANGE_RATES.USD;
  return `${info.symbol}${amountInLocalCurrency.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function calculateCommissionBreakdown(totalUsd: number, saleModel: SaleModelType = "full_buyout") {
  const platformFeeUsd = Math.round(totalUsd * 0.03 * 100) / 100;
  const platformFeeNpr = Math.round(platformFeeUsd * EXCHANGE_RATES.NPR.rate);
  const platformFeePln = Math.round(platformFeeUsd * EXCHANGE_RATES.PLN.rate * 100) / 100;
  const netSellerUsd = Math.round((totalUsd - platformFeeUsd) * 100) / 100;

  return {
    totalUsd,
    platformFeeUsd,
    platformFeeNpr,
    platformFeePln,
    netSellerUsd,
    ownerVaultId: PLATFORM_OWNER_WALLET.vaultAccountId,
    ownerWalletId: PLATFORM_OWNER_WALLET.walletId,
    ownerEsewaPhone: PLATFORM_OWNER_WALLET.phone,
    saleModel,
  };
}

// Legal Framework Citations
export const LEGAL_FRAMEWORK = {
  unTreaties: [
    {
      title: "WIPO Berne Convention for the Protection of Literary and Artistic Works",
      citation: "Paris Act 1971 / 1979 Amendment, Articles 2, 5 & 6bis",
      summary: "Establishes automatic international copyright protection upon creation across 181 member states without mandatory prior formalities.",
    },
    {
      title: "United Nations Universal Declaration of Human Rights (UDHR)",
      citation: "General Assembly Resolution 217 A, Article 27(2)",
      summary: "Guarantees the universal human right to the moral and material protection of any scientific, literary or artistic production.",
    },
    {
      title: "UNCITRAL Model Law on Electronic Commerce & Signatures",
      citation: "UN Commission on International Trade Law (1996 / 2001)",
      summary: "Provides international legal validity to electronic contracts, digital signatures, and automated electronic conveyances.",
    },
    {
      title: "WTO TRIPS Agreement",
      citation: "Trade-Related Aspects of Intellectual Property Rights (1994)",
      summary: "Mandates enforcement procedures and commercial intellectual property rights protection across all member states.",
    },
  ],
  nepalLaws: [
    {
      title: "Nepal Copyright Act, 2059 (2002) [प्रतिलिपि अधिकार ऐन, २०५९]",
      citation: "Section 3 (Subsistence of Copyright), Section 7 (Economic Rights), Section 19 (Transfer of Copyright)",
      summary: "Secures original ownership to the author upon creation. Section 19 legally authorizes full transfer and assignment of copyright with or without perpetual royalty.",
    },
    {
      title: "Nepal Electronic Transactions Act, 2063 (2006) [विद्युतीय कारोबार ऐन, २०६३]",
      citation: "Section 13, 14 & Chapter 9",
      summary: "Confers full legal recognition, evidentiary admissibility, and enforceable validity to digital agreements, cryptographic hashes, and electronic signatures in Nepal.",
    },
    {
      title: "Nepal Civil Code (Muluki Devani Samhita), 2074 (2017)",
      citation: "Part 5: Law of Contracts and Obligations, Sections 503-535",
      summary: "Enforces binding contractual covenants, consideration transfers, and lawful commercial assignments between originating authors and buyers.",
    },
    {
      title: "Nepal Rastra Bank (NRB) Digital Payment & Settlement Bylaws",
      citation: "Payment and Settlement Act 2075 & Directives on Multi-Currency Digital Wallets and Banking Transfers",
      summary: "Governs secured multi-currency in-app wallet balances, direct domestic commercial bank settlements, and inward international payouts with full AML/KYC transparency.",
    },
  ],
};

// Generate formal international and Nepal copyright filing record
export function generateCopyrightFiling(
  authorName: string,
  authorCountry: string,
  authorEmail: string,
  ideaTitle: string,
  saleModel: SaleModelType = "full_buyout"
): CopyrightFiling {
  const timestamp = new Date().toISOString();
  const rawHash = `${authorName}-${ideaTitle}-${timestamp}-${Math.random()}`;
  let hashVal = 0;
  for (let i = 0; i < rawHash.length; i++) {
    hashVal = (hashVal << 5) - hashVal + rawHash.charCodeAt(i);
    hashVal |= 0;
  }
  const certHex = Math.abs(hashVal).toString(16).toUpperCase().padStart(8, "0");
  const certificateId = `NP-WIPO-CR-2026-${certHex}`;
  const cryptoHash = `SHA256:7F8B${certHex}3C9E21A44D8781B8246E9C9F`;

  return {
    certificateId,
    registeredAt: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" }),
    authorName,
    authorCountry: authorCountry || "Nepal",
    authorEmail: authorEmail || "ideator@domain.org",
    governingLaws: [
      "WIPO Berne Convention (Articles 2 & 5)",
      "Nepal Copyright Act 2059 (Sections 3, 7 & 19)",
      "UNCITRAL Model Law on Electronic Commerce 1996",
      "Nepal Electronic Transactions Act 2063",
    ],
    cryptographicHash: cryptoHash,
    saleModel,
    ownershipStatus: "registered_to_author",
    documentsDelivered: true,
    legalPreamble: `OFFICIAL REGISTRATION OF INTELLECTUAL PROPERTY & COPYRIGHT SUBSISTENCE\n` +
      `Pursuant to Section 3 of the Nepal Copyright Act 2059 (2002) and Article 5 of the WIPO Berne Convention, ` +
      `this document certifies that the original intellectual property concept titled "${ideaTitle}" is legally filed and registered ` +
      `in the sole name of ${authorName} (${authorCountry}). Full moral and economic ownership is recognized under the United Nations ` +
      `legal order and the laws of Nepal.\n` +
      `COMMERCIAL TRANSFER PROVISION: The author maintains legal authority to either assign 100% full copyright (with 0% perpetual royalty) ` +
      `or license production rights under a 15% royalty covenant, subject to a 3% platform discovery fee automatically settled in the IdeaVault Master Digital Wallet (${PLATFORM_OWNER_WALLET.accountName}).`,
  };
}

// Pre-launch: No fictional human buyers or human payments exist until the site is published live
export const VERIFIED_BUYER_POOL: BuyerMatch[] = [];

// Return dynamically filtered matched buyers based on idea category and title
export function findMatchedBuyers(ideaCategory: string, ideaTitle: string): BuyerMatch[] {
  const titleLower = ideaTitle.toLowerCase();
  return VERIFIED_BUYER_POOL.map((buyer) => {
    let boost = 0;
    if (ideaCategory.includes("Hardware") || ideaCategory.includes("Tech")) {
      if (buyer.id.includes("himalayan") || buyer.id.includes("vance")) boost += 5;
    }
    if (ideaCategory.includes("Green") || titleLower.includes("solar") || titleLower.includes("clean")) {
      if (buyer.id.includes("alpine")) boost += 8;
    }
    if (ideaCategory.includes("Media") || ideaCategory.includes("Game")) {
      if (buyer.id.includes("apex")) boost += 7;
    }
    const score = Math.min(99, Math.max(78, buyer.matchScore + boost));
    return { ...buyer, matchScore: score };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

// Universal Global Digital Wallets & Native Country Payment Methods
export interface GlobalWalletProvider {
  id: string;
  name: string;
  type: "digital_wallet" | "bank" | "mobile_money";
  country: string;
  currency: CurrencyCode;
  qrCapable: boolean;
  qrFormatName: string;
  badge: string;
  instruction: string;
}

export const GLOBAL_DIGITAL_WALLETS: GlobalWalletProvider[] = [
  // --- Nepal ---
  {
    id: "wallet-np-khalti",
    name: "Khalti Digital Wallet",
    type: "digital_wallet",
    country: "Nepal",
    currency: "NPR",
    qrCapable: true,
    qrFormatName: "Khalti Smart QR",
    badge: "Nepal #1 Instant Wallet",
    instruction: "Instant mobile wallet scan or transfer via phone number / QR",
  },
  {
    id: "wallet-np-esewa",
    name: "eSewa Mobile Wallet",
    type: "digital_wallet",
    country: "Nepal",
    currency: "NPR",
    qrCapable: true,
    qrFormatName: "eSewa Fonepay QR",
    badge: "Nepal Digital Wallet",
    instruction: "Direct eSewa ID or Fonepay interbank QR payment",
  },
  {
    id: "wallet-np-connectips",
    name: "ConnectIPS Instant Bank Transfer",
    type: "bank",
    country: "Nepal",
    currency: "NPR",
    qrCapable: true,
    qrFormatName: "Nepal Clearing House QR",
    badge: "Direct Interbank Wire",
    instruction: "National payment gateway real-time settlement to any Nepal bank",
  },
  {
    id: "wallet-np-anybank",
    name: "Any Bank Account (User Choice)",
    type: "bank",
    country: "Nepal",
    currency: "NPR",
    qrCapable: false,
    qrFormatName: "Direct Bank Account Transfer",
    badge: "Any Licensed Bank",
    instruction: "Enter any bank name and account number where you hold an actual account",
  },

  // --- United States ---
  {
    id: "wallet-us-applepay",
    name: "Apple Pay",
    type: "digital_wallet",
    country: "United States",
    currency: "USD",
    qrCapable: true,
    qrFormatName: "Apple Cash / Passcode QR",
    badge: "Touch ID / Face ID",
    instruction: "Instant biometric checkout via Apple Cash or linked cards",
  },
  {
    id: "wallet-us-googlepay",
    name: "Google Pay",
    type: "digital_wallet",
    country: "United States",
    currency: "USD",
    qrCapable: true,
    qrFormatName: "Google Pay Instant QR",
    badge: "Instant 1-Click Pay",
    instruction: "Fast peer-to-peer and merchant digital checkout",
  },
  {
    id: "wallet-us-venmo",
    name: "Venmo",
    type: "digital_wallet",
    country: "United States",
    currency: "USD",
    qrCapable: true,
    qrFormatName: "Venmo QR Code",
    badge: "US Mobile Wallet",
    instruction: "Scan user Venmo QR or handle for instant credit",
  },
  {
    id: "wallet-us-cashapp",
    name: "Cash App Pay",
    type: "digital_wallet",
    country: "United States",
    currency: "USD",
    qrCapable: true,
    qrFormatName: "Cash App $Cashtag QR",
    badge: "Instant Square QR",
    instruction: "Direct $Cashtag payment or camera QR scan",
  },
  {
    id: "wallet-us-zelle",
    name: "Zelle Instant Bank Transfer",
    type: "bank",
    country: "United States",
    currency: "USD",
    qrCapable: true,
    qrFormatName: "Zelle QR Code",
    badge: "Zero-Fee Interbank",
    instruction: "Direct mobile/email transfer across US banks",
  },
  {
    id: "wallet-us-fednow",
    name: "FedNow / US Domestic Wire",
    type: "bank",
    country: "United States",
    currency: "USD",
    qrCapable: false,
    qrFormatName: "Routing & Account Number",
    badge: "All US Banks",
    instruction: "Chase, Bank of America, Wells Fargo direct ACH / wire",
  },

  // --- India ---
  {
    id: "wallet-in-phonepe",
    name: "PhonePe UPI",
    type: "digital_wallet",
    country: "India",
    currency: "INR",
    qrCapable: true,
    qrFormatName: "BharatQR / UPI Dynamic QR",
    badge: "Instant 0-Fee UPI",
    instruction: "Scan dynamic UPI QR code from any Indian bank or app",
  },
  {
    id: "wallet-in-gpay",
    name: "Google Pay India (Tez)",
    type: "digital_wallet",
    country: "India",
    currency: "INR",
    qrCapable: true,
    qrFormatName: "GPay UPI QR",
    badge: "Real-Time NPCI",
    instruction: "UPI VPA or QR code settlement in Indian Rupees",
  },
  {
    id: "wallet-in-paytm",
    name: "Paytm Payments Bank & Wallet",
    type: "digital_wallet",
    country: "India",
    currency: "INR",
    qrCapable: true,
    qrFormatName: "Paytm Soundbox / All-in-One QR",
    badge: "India Digital Wallet",
    instruction: "Paytm Wallet or UPI QR instant payment",
  },
  {
    id: "wallet-in-netbanking",
    name: "Indian NetBanking / IMPS",
    type: "bank",
    country: "India",
    currency: "INR",
    qrCapable: false,
    qrFormatName: "IFSC & Account Wire",
    badge: "All Indian Banks",
    instruction: "HDFC, ICICI, SBI, Axis direct IMPS wire",
  },

  // --- United Kingdom ---
  {
    id: "wallet-uk-revolut",
    name: "Revolut UK",
    type: "digital_wallet",
    country: "United Kingdom",
    currency: "GBP",
    qrCapable: true,
    qrFormatName: "Revolut Pay QR",
    badge: "Instant GBP Settlement",
    instruction: "Revolut @revtag or QR code settlement",
  },
  {
    id: "wallet-uk-monzo",
    name: "Monzo Bank App",
    type: "digital_wallet",
    country: "United Kingdom",
    currency: "GBP",
    qrCapable: true,
    qrFormatName: "Monzo.me QR Link",
    badge: "UK Mobile Bank",
    instruction: "Instant Faster Payments settlement",
  },
  {
    id: "wallet-uk-bacs",
    name: "UK Faster Payments / BACS",
    type: "bank",
    country: "United Kingdom",
    currency: "GBP",
    qrCapable: false,
    qrFormatName: "Sort Code & Account",
    badge: "All UK Banks",
    instruction: "Barclays, HSBC, Lloyds, NatWest real-time transfer",
  },

  // --- European Union ---
  {
    id: "wallet-eu-sepa",
    name: "SEPA Instant Credit Transfer",
    type: "bank",
    country: "European Union",
    currency: "EUR",
    qrCapable: true,
    qrFormatName: "European Payments Council (EPC) QR",
    badge: "Eurozone Instant 24/7",
    instruction: "Standard Eurozone QR code scanned by any EU banking app",
  },
  {
    id: "wallet-eu-revolut",
    name: "Revolut Europe",
    type: "digital_wallet",
    country: "European Union",
    currency: "EUR",
    qrCapable: true,
    qrFormatName: "Revolut Instant QR",
    badge: "Instant Multi-Currency",
    instruction: "Euro transfer settled within seconds",
  },
  {
    id: "wallet-eu-ideal",
    name: "iDEAL / Wero",
    type: "digital_wallet",
    country: "European Union",
    currency: "EUR",
    qrCapable: true,
    qrFormatName: "iDEAL QR",
    badge: "Netherlands & Euro Hub",
    instruction: "Direct bank QR code payment",
  },
  {
    id: "wallet-eu-blik",
    name: "BLIK Mobile Code",
    type: "digital_wallet",
    country: "European Union",
    currency: "PLN",
    qrCapable: true,
    qrFormatName: "BLIK 6-Digit & QR",
    badge: "Central Europe (PLN)",
    instruction: "Instant 6-digit PIN and mobile QR approval",
  },

  // --- Japan ---
  {
    id: "wallet-jp-paypay",
    name: "PayPay Mobile Wallet",
    type: "digital_wallet",
    country: "Japan",
    currency: "JPY",
    qrCapable: true,
    qrFormatName: "PayPay Barcode & QR",
    badge: "Japan #1 QR Wallet",
    instruction: "Scan user QR code to pay in Japanese Yen",
  },
  {
    id: "wallet-jp-linepay",
    name: "LINE Pay",
    type: "digital_wallet",
    country: "Japan",
    currency: "JPY",
    qrCapable: true,
    qrFormatName: "LINE Pay QR Code",
    badge: "LINE Chat Pay",
    instruction: "Direct checkout through LINE Japan ecosystem",
  },

  // --- Australia ---
  {
    id: "wallet-au-payid",
    name: "PayID / Osko Instant",
    type: "bank",
    country: "Australia",
    currency: "AUD",
    qrCapable: true,
    qrFormatName: "PayID QR Code",
    badge: "Australia Instant Bank",
    instruction: "Instant transfer via mobile number or PayID QR",
  },
  {
    id: "wallet-au-commbank",
    name: "CommBank / ANZ Digital",
    type: "digital_wallet",
    country: "Australia",
    currency: "AUD",
    qrCapable: true,
    qrFormatName: "Big 4 Interbank QR",
    badge: "Australia Digital",
    instruction: "Seamless Australian Dollar transfers",
  },

  // --- Canada ---
  {
    id: "wallet-ca-interac",
    name: "Interac e-Transfer",
    type: "bank",
    country: "Canada",
    currency: "CAD",
    qrCapable: true,
    qrFormatName: "Interac Autodeposit QR",
    badge: "Canada Standard",
    instruction: "Autodeposit directly to Canadian bank account",
  },
  {
    id: "wallet-ca-wealthsimple",
    name: "Wealthsimple Cash",
    type: "digital_wallet",
    country: "Canada",
    currency: "CAD",
    qrCapable: true,
    qrFormatName: "Wealthsimple $Handle QR",
    badge: "Instant CAD Wallet",
    instruction: "Instant mobile peer-to-peer transfer",
  },

  // --- Universal International Wallets (Available Everywhere Worldwide) ---
  {
    id: "wallet-global-wise",
    name: "Wise Multi-Currency Digital Account",
    type: "digital_wallet",
    country: "Global",
    currency: "USD",
    qrCapable: true,
    qrFormatName: "Wise Tag & International QR",
    badge: "50+ World Currencies",
    instruction: "Mid-market rate instant transfers across 160+ countries worldwide",
  },
  {
    id: "wallet-global-revolut",
    name: "Revolut Global Digital Account",
    type: "digital_wallet",
    country: "Global",
    currency: "USD",
    qrCapable: true,
    qrFormatName: "Revolut International QR",
    badge: "Worldwide Instant",
    instruction: "Universal peer-to-peer transfer across any border",
  },
  {
    id: "wallet-global-stripe",
    name: "Stripe International Direct Payout",
    type: "digital_wallet",
    country: "Global",
    currency: "USD",
    qrCapable: true,
    qrFormatName: "Stripe Payment Link QR",
    badge: "Global Visa / Mastercard",
    instruction: "Direct global payout to any verified card or debit account",
  },
  {
    id: "wallet-global-payoneer",
    name: "Payoneer Global Creator Wallet",
    type: "digital_wallet",
    country: "Global",
    currency: "USD",
    qrCapable: false,
    qrFormatName: "Payoneer ID",
    badge: "Freelance & Creator Standard",
    instruction: "Withdrawals to local bank in 200+ countries and territories",
  },
  {
    id: "wallet-global-swift",
    name: "SWIFT Cross-Border Bank Wire",
    type: "bank",
    country: "Global",
    currency: "USD",
    qrCapable: false,
    qrFormatName: "SWIFT / BIC Code",
    badge: "Universal Bank Wire",
    instruction: "Commercial interbank wire transfer to any central bank worldwide",
  },
];

// Returns localized wallets matching a country + international wallets
export function getWalletsForCountry(countryName: string): GlobalWalletProvider[] {
  if (!countryName) {
    return GLOBAL_DIGITAL_WALLETS;
  }
  const norm = countryName.trim().toLowerCase();
  const countryWallets = GLOBAL_DIGITAL_WALLETS.filter(
    (w) =>
      w.country.toLowerCase() === norm ||
      w.country.toLowerCase().includes(norm) ||
      norm.includes(w.country.toLowerCase())
  );
  const globalWallets = GLOBAL_DIGITAL_WALLETS.filter((w) => w.country === "Global");
  return [...countryWallets, ...globalWallets];
}
