import React, { useMemo, useState } from "react";
import { UserProfile, Idea, CurrencyCode, UserDigitalWallet, WalletTransaction } from "../types";
import {
  LayoutDashboard,
  X,
  Building2,
  Wallet,
  ArrowUpRight,
  ShieldCheck,
  Crown,
  Search,
  Users,
  FileText,
  TrendingUp,
  Smartphone,
  Globe
} from "lucide-react";
import { EXCHANGE_RATES, formatPrice, formatLocalCurrency, convertUsdToCurrency } from "../utils/legalAndCurrency";
import { isSitePublishedLive } from "../utils/syncEngine";

interface EarningsDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  users?: UserProfile[];
  ideas: Idea[];
  wallet: UserDigitalWallet;
  preferredCurrency: CurrencyCode;
  onOpenWallet: (initialTab?: "slots" | "scanner" | "withdraw" | "ledger") => void;
}

interface MemberEarningRow {
  id: string;
  name: string;
  handle: string;
  roleLabel: string;
  country: string;
  isOwner: boolean;
  dealsCount: number;
  tasksCount: number;
  buyoutAndUpfrontUsd: number;
  royaltiesUsd: number;
  taskRewardsUsd: number;
  platformFeesUsd: number;
  walletBalanceUsd: number;
  totalEarnedUsd: number;
}

interface LedgerEntry {
  id: string;
  recipientName: string;
  isOwner: boolean;
  category: string;
  description: string;
  counterparty: string;
  amountDisplay: string;
  amountUsd: number;
  ownerFeeUsd: number;
  creatorAndTaskUsd: number;
  timestamp: string;
  reference: string;
}

interface LineGraphPoint {
  label: string;
  totalUsd: number;
  ownerUsd: number;
  creatorTaskUsd: number;
}

export const EarningsDashboardModal: React.FC<EarningsDashboardModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  users = [],
  ideas,
  wallet,
  preferredCurrency,
  onOpenWallet,
}) => {
  const [activeView, setActiveView] = useState<"overview" | "owner" | "everyone" | "ledger">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);

  const isPublished = isSitePublishedLive();
  const currencyMeta = EXCHANGE_RATES[preferredCurrency] || EXCHANGE_RATES.USD;

  // Identify Site Owner (Medha Koirala)
  const ownerProfile = useMemo(() => {
    const fromUsers = users.find((u) => u.isSiteOwner || u.id === "user_owner");
    if (currentUser.isSiteOwner) return currentUser;
    return fromUsers || currentUser;
  }, [users, currentUser]);

  const ownerWallet: UserDigitalWallet = useMemo(() => {
    const baseWallet = currentUser.isSiteOwner ? wallet : ownerProfile.wallet;
    const rawMethods = baseWallet?.withdrawalMethods || [];
    // Keep strictly payout methods explicitly added by the user (never auto-added defaults)
    const cleanMethods = rawMethods.filter(
      (m) => !m.id.startsWith("wm-mk-") && m.id.startsWith("wm-user-")
    );

    if (!isPublished) {
      return {
        walletId: baseWallet?.walletId || "VAULT-MK-977-MASTER-001",
        vaultAccountId: baseWallet?.vaultAccountId || "VAULT-MK-977-MASTER-001",
        securityPin: baseWallet?.securityPin || "2059",
        biometricsEnabled: true,
        isLocked: false,
        currencySlots: { NPR: 0, USD: 0, EUR: 0, INR: 0, GBP: 0, AUD: 0, CAD: 0, JPY: 0, PLN: 0 },
        withdrawalMethods: cleanMethods,
        transactions: [],
      };
    }

    return (
      baseWallet
        ? { ...baseWallet, withdrawalMethods: cleanMethods }
        : {
            walletId: "VAULT-MK-977-MASTER-001",
            vaultAccountId: "VAULT-MK-977-MASTER-001",
            securityPin: "2059",
            biometricsEnabled: true,
            isLocked: false,
            currencySlots: { NPR: 0, USD: 0, EUR: 0, INR: 0, GBP: 0, AUD: 0, CAD: 0, JPY: 0, PLN: 0 },
            withdrawalMethods: [],
            transactions: [],
          }
    );
  }, [currentUser.isSiteOwner, wallet, ownerProfile, isPublished]);

  // Aggregate real-money earnings ONLY when published (0 humans & 0 earnings while unpublished)
  const {
    memberRows,
    ownerRow,
    totalEcosystemEarnedUsd,
    totalOwnerEarnedUsd,
    totalCreatorDealsAndRoyaltiesUsd,
    totalTaskPayoutsUsd,
    ledgerEntries,
    monetizedIdeas,
    lineGraphSeries,
  } = useMemo(() => {
    const ownerKey = ownerProfile.id || "user_owner";
    const initialOwnerRow: MemberEarningRow = {
      id: ownerKey,
      name: ownerProfile.name || "Medha Koirala",
      handle: ownerProfile.handle || "@medha_owner",
      roleLabel: "Founder & Site Owner",
      country: ownerProfile.country || "Nepal",
      isOwner: true,
      dealsCount: 0,
      tasksCount: 0,
      buyoutAndUpfrontUsd: 0,
      royaltiesUsd: 0,
      taskRewardsUsd: 0,
      platformFeesUsd: 0,
      walletBalanceUsd: isPublished ? ownerProfile.balance || 0 : 0,
      totalEarnedUsd: 0,
    };

    // STRICT PRE-LAUNCH RULE: Until the site is published live, no external humans, no human payments, and 0.00 earnings exist.
    if (!isPublished) {
      const zeroTimeline: LineGraphPoint[] = [
        { label: "Stage 1", totalUsd: 0, ownerUsd: 0, creatorTaskUsd: 0 },
        { label: "Stage 2", totalUsd: 0, ownerUsd: 0, creatorTaskUsd: 0 },
        { label: "Stage 3", totalUsd: 0, ownerUsd: 0, creatorTaskUsd: 0 },
        { label: "Stage 4", totalUsd: 0, ownerUsd: 0, creatorTaskUsd: 0 },
        { label: "Pre-Launch", totalUsd: 0, ownerUsd: 0, creatorTaskUsd: 0 },
      ];
      return {
        memberRows: [initialOwnerRow],
        ownerRow: initialOwnerRow,
        totalEcosystemEarnedUsd: 0,
        totalOwnerEarnedUsd: 0,
        totalCreatorDealsAndRoyaltiesUsd: 0,
        totalTaskPayoutsUsd: 0,
        ledgerEntries: [] as LedgerEntry[],
        monetizedIdeas: [] as Idea[],
        lineGraphSeries: zeroTimeline,
      };
    }

    const map = new Map<string, MemberEarningRow>();
    map.set(ownerKey, initialOwnerRow);

    for (const u of users) {
      if (u.id === "bot_ai_seed" || u.isRealHuman === false) continue;
      const key = u.isSiteOwner ? ownerKey : u.id;
      if (!map.has(key)) {
        map.set(key, {
          id: u.id,
          name: u.name,
          handle: u.handle,
          roleLabel:
            u.role === "builder_buyer"
              ? "Builder & Buyer"
              : u.profession || "Creator & Ideator",
          country: u.country || "Global",
          isOwner: Boolean(u.isSiteOwner),
          dealsCount: u.activeContractsCount || 0,
          tasksCount: 0,
          buyoutAndUpfrontUsd: 0,
          royaltiesUsd: 0,
          taskRewardsUsd: 0,
          platformFeesUsd: 0,
          walletBalanceUsd: u.balance || 0,
          totalEarnedUsd: 0,
        });
      }
    }

    let computedOwnerPlatformFeesUsd = 0;
    const entries: LedgerEntry[] = [];
    const activeMonetizedIdeas: Idea[] = [];

    for (const idea of ideas) {
      const hasContract = Boolean(idea.contract);
      const hasMarketSales = Boolean(idea.marketSales && idea.marketSales.totalProductSales > 0);
      const completedTasks = (idea.tasks || []).filter(
        (t) => t.status === "completed" || t.status === "paid"
      );

      if (hasContract || hasMarketSales) {
        activeMonetizedIdeas.push(idea);
      }

      const isHumanCreator =
        idea.originType === "real_human" ||
        idea.isRealHuman ||
        Boolean(idea.aiSeedInfo?.claimedByHuman) ||
        hasContract ||
        hasMarketSales;

      const creatorId =
        idea.creator.id === ownerProfile.id || idea.creator.name === ownerProfile.name
          ? ownerKey
          : idea.creator.id;

      if (isHumanCreator && creatorId !== "bot_ai_seed" && !map.has(creatorId)) {
        map.set(creatorId, {
          id: creatorId,
          name: idea.aiSeedInfo?.claimedByHumanName || idea.creator.name,
          handle: idea.creator.handle,
          roleLabel: idea.creator.profession || idea.creator.role || "Creator & Ideator",
          country: idea.creator.country || "Global",
          isOwner: false,
          dealsCount: 0,
          tasksCount: 0,
          buyoutAndUpfrontUsd: 0,
          royaltiesUsd: 0,
          taskRewardsUsd: 0,
          platformFeesUsd: 0,
          walletBalanceUsd: 0,
          totalEarnedUsd: 0,
        });
      }

      if (idea.contract) {
        const netCreatorUsd =
          idea.contract.ideatorPayoutAmount ??
          Math.round(idea.contract.upfrontFee * 0.97 * 100) / 100;
        const ownerFeeUsd =
          idea.contract.ownerWalletAmountUsd ??
          Math.round(idea.contract.upfrontFee * 0.03 * 100) / 100;

        computedOwnerPlatformFeesUsd += ownerFeeUsd;

        const targetCreatorRow = map.get(creatorId);
        if (targetCreatorRow) {
          targetCreatorRow.buyoutAndUpfrontUsd += netCreatorUsd;
          targetCreatorRow.dealsCount += 1;
        }

        const ownerRecord = map.get(ownerKey);
        if (ownerRecord && creatorId !== ownerKey) {
          ownerRecord.dealsCount += 1;
        }

        entries.push({
          id: `led-con-creator-${idea.contract.id}`,
          recipientName: idea.contract.creatorName,
          isOwner: creatorId === ownerKey,
          category:
            idea.contract.saleModel === "full_buyout"
              ? "97% Full Buyout Payout"
              : "97% License Upfront Payout",
          description: idea.title,
          counterparty: `${idea.contract.buyerName}${idea.contract.buyerCompany ? ` (${idea.contract.buyerCompany})` : ""}`,
          amountDisplay: formatPrice(netCreatorUsd, preferredCurrency),
          amountUsd: netCreatorUsd,
          ownerFeeUsd: creatorId === ownerKey ? netCreatorUsd : 0,
          creatorAndTaskUsd: creatorId === ownerKey ? 0 : netCreatorUsd,
          timestamp: idea.contract.createdAt || "Executed",
          reference: idea.contract.id,
        });

        entries.push({
          id: `led-con-owner-${idea.contract.id}`,
          recipientName: `${ownerProfile.name} (Owner Master Vault)`,
          isOwner: true,
          category: "3% Platform Discovery Fee",
          description: idea.title,
          counterparty: `${idea.contract.buyerName} → ${idea.contract.creatorName}`,
          amountDisplay: formatPrice(ownerFeeUsd, preferredCurrency),
          amountUsd: ownerFeeUsd,
          ownerFeeUsd: ownerFeeUsd,
          creatorAndTaskUsd: 0,
          timestamp: idea.contract.createdAt || "Settled",
          reference: idea.contract.ownerWalletTxnId || idea.contract.id,
        });
      }

      if (idea.marketSales && idea.marketSales.totalProductSales > 0) {
        const creatorRoyaltyUsd = idea.marketSales.commissionEarned || 0;
        const ownerMarketFeeUsd =
          idea.marketSales.platformCommissionEarned ??
          Math.round(idea.marketSales.totalProductSales * 0.03 * 100) / 100;

        computedOwnerPlatformFeesUsd += ownerMarketFeeUsd;

        const targetCreatorRow = map.get(creatorId);
        if (targetCreatorRow) {
          targetCreatorRow.royaltiesUsd += creatorRoyaltyUsd;
        }

        if (creatorRoyaltyUsd > 0) {
          entries.push({
            id: `led-roy-creator-${idea.id}`,
            recipientName: idea.creator.name,
            isOwner: creatorId === ownerKey,
            category: "15% Sales Royalty",
            description: `${idea.title} ($${idea.marketSales.totalProductSales.toLocaleString()} gross sales)`,
            counterparty: "Retail Product Sales",
            amountDisplay: formatPrice(creatorRoyaltyUsd, preferredCurrency),
            amountUsd: creatorRoyaltyUsd,
            ownerFeeUsd: creatorId === ownerKey ? creatorRoyaltyUsd : 0,
            creatorAndTaskUsd: creatorId === ownerKey ? 0 : creatorRoyaltyUsd,
            timestamp: idea.marketSales.lastPayoutDate || "Settled",
            reference: `ROY-${idea.id.toUpperCase()}`,
          });
        }

        if (ownerMarketFeeUsd > 0) {
          entries.push({
            id: `led-roy-owner-${idea.id}`,
            recipientName: `${ownerProfile.name} (Owner Master Vault)`,
            isOwner: true,
            category: "3% Market Royalty Fee",
            description: `${idea.title} ($${idea.marketSales.totalProductSales.toLocaleString()} gross sales)`,
            counterparty: "Platform Royalty Settlement",
            amountDisplay: formatPrice(ownerMarketFeeUsd, preferredCurrency),
            amountUsd: ownerMarketFeeUsd,
            ownerFeeUsd: ownerMarketFeeUsd,
            creatorAndTaskUsd: 0,
            timestamp: idea.marketSales.lastPayoutDate || "Settled",
            reference: `PFEE-${idea.id.toUpperCase()}`,
          });
        }
      }

      for (const task of completedTasks) {
        const assigneeName = task.assignedToName || "Task Contributor";
        const matchedUser = users.find(
          (u) => u.name.toLowerCase() === assigneeName.toLowerCase()
        );
        const assigneeKey = matchedUser
          ? matchedUser.isSiteOwner
            ? ownerKey
            : matchedUser.id
          : `contributor_${assigneeName.toLowerCase().replace(/\s+/g, "_")}`;

        if (!map.has(assigneeKey)) {
          map.set(assigneeKey, {
            id: assigneeKey,
            name: assigneeName,
            handle: `@${assigneeName.toLowerCase().replace(/[^a-z0-9]/g, "")}`,
            roleLabel: "Task Contributor",
            country: "Global",
            isOwner: false,
            dealsCount: 0,
            tasksCount: 0,
            buyoutAndUpfrontUsd: 0,
            royaltiesUsd: 0,
            taskRewardsUsd: 0,
            platformFeesUsd: 0,
            walletBalanceUsd: task.reward,
            totalEarnedUsd: 0,
          });
        }

        const contributorRow = map.get(assigneeKey)!;
        contributorRow.taskRewardsUsd += task.reward;
        contributorRow.tasksCount += 1;

        entries.push({
          id: `led-task-${task.id}`,
          recipientName: assigneeName,
          isOwner: assigneeKey === ownerKey,
          category: "Task Bounty Payout",
          description: `${task.title} (${idea.title})`,
          counterparty: "Task Escrow Release",
          amountDisplay: formatPrice(task.reward, preferredCurrency),
          amountUsd: task.reward,
          ownerFeeUsd: assigneeKey === ownerKey ? task.reward : 0,
          creatorAndTaskUsd: assigneeKey === ownerKey ? 0 : task.reward,
          timestamp: task.dueDate || "Completed",
          reference: task.id.toUpperCase(),
        });
      }
    }

    const ownerEntry = map.get(ownerKey)!;
    ownerEntry.platformFeesUsd = Math.max(
      computedOwnerPlatformFeesUsd,
      ownerProfile.platformRevenueEarned || 0
    );

    const allWalletTxs: { ownerName: string; isOwner: boolean; tx: WalletTransaction }[] = [];
    for (const u of users) {
      if (u.id === "bot_ai_seed") continue;
      for (const tx of u.wallet?.transactions || []) {
        allWalletTxs.push({
          ownerName: u.name,
          isOwner: Boolean(u.isSiteOwner),
          tx,
        });
      }
    }
    if (entries.length === 0 && allWalletTxs.length > 0) {
      for (const item of allWalletTxs) {
        const rate = EXCHANGE_RATES[item.tx.currency]?.rate || 1;
        const usdEq = Math.round((item.tx.amount / rate) * 100) / 100;
        entries.push({
          id: item.tx.id,
          recipientName: item.ownerName,
          isOwner: item.isOwner,
          category: item.tx.type.replace(/_/g, " "),
          description: item.tx.description,
          counterparty: item.tx.counterparty,
          amountDisplay: formatLocalCurrency(item.tx.amount, item.tx.currency),
          amountUsd: usdEq,
          ownerFeeUsd: item.isOwner ? usdEq : 0,
          creatorAndTaskUsd: item.isOwner ? 0 : usdEq,
          timestamp: item.tx.timestamp,
          reference: item.tx.referenceId,
        });
      }
    }

    let sumEcosystem = 0;
    let sumCreatorDealsRoyalties = 0;
    let sumTasks = 0;

    for (const row of map.values()) {
      const itemizedSum =
        row.buyoutAndUpfrontUsd +
        row.royaltiesUsd +
        row.taskRewardsUsd +
        row.platformFeesUsd;
      row.totalEarnedUsd = Math.round(Math.max(itemizedSum, row.walletBalanceUsd) * 100) / 100;

      sumEcosystem += row.totalEarnedUsd;
      sumCreatorDealsRoyalties += row.buyoutAndUpfrontUsd + row.royaltiesUsd;
      sumTasks += row.taskRewardsUsd;
    }

    const sortedRows = Array.from(map.values()).sort((a, b) => {
      if (a.isOwner && !b.isOwner) return -1;
      if (!a.isOwner && b.isOwner) return 1;
      return b.totalEarnedUsd - a.totalEarnedUsd;
    });

    // Build cumulative line graph points from real settlements (or flat 0 baseline if none yet)
    const graphPoints: LineGraphPoint[] = [
      { label: "Launch", totalUsd: 0, ownerUsd: 0, creatorTaskUsd: 0 },
    ];
    if (entries.length === 0) {
      graphPoints.push(
        { label: "Q1", totalUsd: 0, ownerUsd: 0, creatorTaskUsd: 0 },
        { label: "Q2", totalUsd: 0, ownerUsd: 0, creatorTaskUsd: 0 },
        { label: "Q3", totalUsd: 0, ownerUsd: 0, creatorTaskUsd: 0 },
        { label: "Live", totalUsd: Math.round(sumEcosystem * 100) / 100, ownerUsd: ownerEntry.totalEarnedUsd, creatorTaskUsd: Math.round((sumCreatorDealsRoyalties + sumTasks) * 100) / 100 }
      );
    } else {
      let runningTotal = 0;
      let runningOwner = 0;
      let runningCreator = 0;
      entries.slice().reverse().forEach((e, idx) => {
        runningTotal = Math.round((runningTotal + e.amountUsd) * 100) / 100;
        runningOwner = Math.round((runningOwner + e.ownerFeeUsd) * 100) / 100;
        runningCreator = Math.round((runningCreator + e.creatorAndTaskUsd) * 100) / 100;
        graphPoints.push({
          label: `Tx #${idx + 1}`,
          totalUsd: runningTotal,
          ownerUsd: runningOwner,
          creatorTaskUsd: runningCreator,
        });
      });
    }

    return {
      memberRows: sortedRows,
      ownerRow: ownerEntry,
      totalEcosystemEarnedUsd: Math.round(sumEcosystem * 100) / 100,
      totalOwnerEarnedUsd: ownerEntry.totalEarnedUsd,
      totalCreatorDealsAndRoyaltiesUsd: Math.round(sumCreatorDealsRoyalties * 100) / 100,
      totalTaskPayoutsUsd: Math.round(sumTasks * 100) / 100,
      ledgerEntries: entries,
      monetizedIdeas: activeMonetizedIdeas,
      lineGraphSeries: graphPoints,
    };
  }, [ideas, users, ownerProfile, preferredCurrency, isPublished]);

  const filteredMemberRows = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return memberRows;
    return memberRows.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.handle.toLowerCase().includes(q) ||
        r.roleLabel.toLowerCase().includes(q) ||
        r.country.toLowerCase().includes(q)
    );
  }, [memberRows, searchQuery]);

  if (!isOpen) return null;

  const hasOwnerPayoutMethod = ownerWallet.withdrawalMethods.length > 0;
  const primaryOwnerMethod = ownerWallet.withdrawalMethods[0];

  // SVG Line Graph Geometry
  const svgWidth = 680;
  const svgHeight = 230;
  const padLeft = 86;
  const padRight = 28;
  const padTop = 24;
  const padBottom = 38;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const maxUsdOnChart = Math.max(
    ...lineGraphSeries.map((p) => Math.max(p.totalUsd, p.ownerUsd, p.creatorTaskUsd)),
    0
  );
  // If max is 0 (unpublished or no transactions yet), use a clean scale ceiling of 100 USD equivalent so 0.00 sits cleanly on the bottom axis
  const yCeilingUsd = maxUsdOnChart > 0 ? maxUsdOnChart * 1.15 : 100;

  const getPointX = (index: number) => {
    if (lineGraphSeries.length <= 1) return padLeft;
    return padLeft + (index / (lineGraphSeries.length - 1)) * plotW;
  };

  const getPointY = (usdVal: number) => {
    if (maxUsdOnChart === 0) return padTop + plotH;
    const ratio = Math.max(0, Math.min(1, usdVal / yCeilingUsd));
    return padTop + plotH - ratio * plotH;
  };

  const totalPolyline = lineGraphSeries
    .map((p, idx) => `${getPointX(idx)},${getPointY(p.totalUsd)}`)
    .join(" ");
  const ownerPolyline = lineGraphSeries
    .map((p, idx) => `${getPointX(idx)},${getPointY(p.ownerUsd)}`)
    .join(" ");
  const creatorPolyline = lineGraphSeries
    .map((p, idx) => `${getPointX(idx)},${getPointY(p.creatorTaskUsd)}`)
    .join(" ");

  const yTicksUsd = maxUsdOnChart > 0
    ? [yCeilingUsd, yCeilingUsd * 0.66, yCeilingUsd * 0.33, 0]
    : [100, 50, 25, 0];

  const activePoint =
    hoveredPointIdx !== null && lineGraphSeries[hoveredPointIdx]
      ? lineGraphSeries[hoveredPointIdx]
      : lineGraphSeries[lineGraphSeries.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div
        id="earnings-dashboard-modal"
        className="relative w-full max-w-5xl rounded-3xl border border-neutral-800 bg-neutral-950 shadow-2xl overflow-hidden my-4 max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 bg-neutral-950 px-6 py-5 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-neutral-950 font-bold shrink-0">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-neutral-100 tracking-tight">
                Real-Money Earnings Line Graph &amp; Owner Dashboard
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">
                Real-world national currencies only ({currencyMeta.symbol} {preferredCurrency}) · {isPublished ? "Live Published Mode" : "Unpublished Pre-Launch (0 Humans · 0.00 Earnings)"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              onClick={() => {
                onClose();
                onOpenWallet("withdraw");
              }}
              className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold px-3.5 py-2 text-xs transition-colors cursor-pointer"
            >
              <Wallet className="h-3.5 w-3.5" />
              <span>Digital Wallet / Any Bank</span>
            </button>

            <button
              onClick={onClose}
              className="rounded-xl p-2 text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100 transition-colors cursor-pointer"
              title="Close Dashboard"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Interactive View Selector */}
        <div className="border-b border-neutral-800 bg-neutral-900/50 px-6 py-3 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800 overflow-x-auto">
            <button
              onClick={() => setActiveView("overview")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeView === "overview"
                  ? "bg-amber-500 text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Line Graph &amp; Overview
            </button>
            <button
              onClick={() => setActiveView("owner")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeView === "owner"
                  ? "bg-amber-500 text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Owner Vault ({ownerRow.name})
            </button>
            <button
              onClick={() => setActiveView("everyone")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeView === "everyone"
                  ? "bg-amber-500 text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Participants ({isPublished ? memberRows.length : "Owner Only"})
            </button>
            <button
              onClick={() => setActiveView("ledger")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeView === "ledger"
                  ? "bg-amber-500 text-neutral-950 font-bold"
                  : "text-neutral-400 hover:text-neutral-200"
              }`}
            >
              Real-Money Ledger ({ledgerEntries.length})
            </button>
          </div>

          <div className="relative w-full sm:w-56">
            <Search className="h-3.5 w-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search owner or participant..."
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 pl-8 pr-3 py-1.5 text-xs text-neutral-200 placeholder:text-neutral-500 focus:outline-none focus:border-amber-500/60"
            />
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Pre-Launch Enforcement Notice when Unpublished */}
          {!isPublished && (
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/70 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-bold text-neutral-100 flex items-center gap-2">
                  <Globe className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Site Not Published Yet — Zero External Humans &amp; Zero Human Payments</span>
                </div>
                <p className="text-neutral-400 leading-relaxed">
                  Until IdeaVault is published live, no external human accounts, human payments, or pre-existing earnings exist. Only real-world money ({Object.keys(EXCHANGE_RATES).join(", ")}) is used when published, and you choose your own Digital Wallet or Any Bank Account.
                </p>
              </div>
              <span className="shrink-0 rounded-lg border border-neutral-700 bg-neutral-950 px-3 py-1.5 font-mono tabular-nums font-semibold text-neutral-300">
                {currencyMeta.symbol}0.00 {preferredCurrency}
              </span>
            </div>
          )}

          {/* Top 4 Real-Money KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="text-xs font-medium text-neutral-400">
                Total Platform Earnings
              </div>
              <div className="text-xl sm:text-2xl font-bold text-neutral-100 font-mono tabular-nums mt-1.5">
                {formatLocalCurrency(convertUsdToCurrency(totalEcosystemEarnedUsd, preferredCurrency), preferredCurrency)}
              </div>
              <div className="text-[11px] text-neutral-500 font-mono tabular-nums mt-1">
                ${totalEcosystemEarnedUsd.toFixed(2)} USD real money
              </div>
            </div>

            <div className="rounded-2xl border border-amber-500/35 bg-neutral-900/60 p-4">
              <div className="text-xs font-medium text-amber-300 flex items-center justify-between">
                <span>Owner Earnings ({ownerRow.name})</span>
                <Crown className="h-3.5 w-3.5 text-amber-400 shrink-0" />
              </div>
              <div className="text-xl sm:text-2xl font-bold text-amber-300 font-mono tabular-nums mt-1.5">
                {formatLocalCurrency(convertUsdToCurrency(totalOwnerEarnedUsd, preferredCurrency), preferredCurrency)}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                3% platform fees + personal deals
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="text-xs font-medium text-emerald-400">
                Creators (97% Deals &amp; 15% Royalties)
              </div>
              <div className="text-xl sm:text-2xl font-bold text-emerald-400 font-mono tabular-nums mt-1.5">
                {formatLocalCurrency(convertUsdToCurrency(totalCreatorDealsAndRoyaltiesUsd, preferredCurrency), preferredCurrency)}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                {isPublished ? "Verified real-money payouts" : "0 human payments pre-launch"}
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-4">
              <div className="text-xs font-medium text-sky-400">
                Task Bounties (Real Fiat Money)
              </div>
              <div className="text-xl sm:text-2xl font-bold text-sky-400 font-mono tabular-nums mt-1.5">
                {formatLocalCurrency(convertUsdToCurrency(totalTaskPayoutsUsd, preferredCurrency), preferredCurrency)}
              </div>
              <div className="text-[11px] text-neutral-400 mt-1">
                {isPublished ? "Completed escrow releases" : "0 human payouts pre-launch"}
              </div>
            </div>
          </div>

          {/* REAL-MONEY EARNINGS LINE GRAPH (Primary Visualization) */}
          <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Real-Money Earnings Line Graph ({preferredCurrency})</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Tracks actual world-currency earnings across the platform and for Owner {ownerRow.name} ({isPublished ? "Live Settlements" : "0.00 Baseline Before Site Publication"})
                </p>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5 text-neutral-200">
                  <span className="h-0.5 w-4 bg-emerald-400 inline-block" />
                  <span>Total Platform</span>
                </div>
                <div className="flex items-center gap-1.5 text-amber-300">
                  <span className="h-0.5 w-4 bg-amber-400 inline-block" />
                  <span>Owner ({ownerRow.name})</span>
                </div>
                <div className="flex items-center gap-1.5 text-sky-300">
                  <span className="h-0.5 w-4 bg-sky-400 inline-block" />
                  <span>Creators &amp; Tasks</span>
                </div>
              </div>
            </div>

            {/* Active Point Readout Bar */}
            <div className="rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-neutral-400 font-medium">
                Point: <strong className="text-neutral-200">{activePoint.label}</strong>
              </span>
              <div className="flex flex-wrap items-center gap-4 font-mono tabular-nums">
                <span className="text-emerald-400">
                  Total: <strong>{formatLocalCurrency(convertUsdToCurrency(activePoint.totalUsd, preferredCurrency), preferredCurrency)}</strong>
                </span>
                <span className="text-amber-300">
                  Owner: <strong>{formatLocalCurrency(convertUsdToCurrency(activePoint.ownerUsd, preferredCurrency), preferredCurrency)}</strong>
                </span>
                <span className="text-sky-300">
                  Creators/Tasks: <strong>{formatLocalCurrency(convertUsdToCurrency(activePoint.creatorTaskUsd, preferredCurrency), preferredCurrency)}</strong>
                </span>
              </div>
            </div>

            {/* SVG Line Chart */}
            <div className="w-full rounded-xl border border-neutral-800 bg-neutral-950 p-3 overflow-x-auto">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full min-w-[500px] h-56 select-none"
                role="img"
                aria-label="Real-Money Earnings Line Graph"
              >
                {/* Horizontal Grid Lines & Real-Currency Y-Axis Labels */}
                {yTicksUsd.map((tickUsd, i) => {
                  const yPos =
                    maxUsdOnChart === 0
                      ? padTop + (i / (yTicksUsd.length - 1)) * plotH
                      : getPointY(tickUsd);
                  const convertedVal = convertUsdToCurrency(tickUsd, preferredCurrency);
                  return (
                    <g key={i}>
                      <line
                        x1={padLeft}
                        y1={yPos}
                        x2={svgWidth - padRight}
                        y2={yPos}
                        stroke={tickUsd === 0 ? "#525252" : "#262626"}
                        strokeWidth={tickUsd === 0 ? "1.5" : "1"}
                        strokeDasharray={tickUsd === 0 ? undefined : "4 4"}
                      />
                      <text
                        x={padLeft - 10}
                        y={yPos + 3.5}
                        textAnchor="end"
                        fill="#a3a3a3"
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {currencyMeta.symbol}
                        {convertedVal.toLocaleString(undefined, {
                          minimumFractionDigits: convertedVal === 0 ? 2 : 0,
                          maximumFractionDigits: convertedVal < 10 ? 2 : 0,
                        })}
                      </text>
                    </g>
                  );
                })}

                {/* Creator & Tasks Line (Sky) */}
                <polyline
                  fill="none"
                  stroke="#38bdf8"
                  strokeWidth="2.25"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={creatorPolyline}
                />

                {/* Total Platform Earnings Line (Emerald) */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="2.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={totalPolyline}
                />

                {/* Owner Earnings Line (Amber) */}
                <polyline
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="2.5"
                  strokeDasharray={maxUsdOnChart === 0 ? "6 4" : undefined}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points={ownerPolyline}
                />

                {/* Interactive Data Nodes & X-Axis Labels */}
                {lineGraphSeries.map((pt, idx) => {
                  const x = getPointX(idx);
                  const yTotal = getPointY(pt.totalUsd);
                  const yOwner = getPointY(pt.ownerUsd);
                  const isHovered = hoveredPointIdx === idx;

                  return (
                    <g
                      key={idx}
                      onMouseEnter={() => setHoveredPointIdx(idx)}
                      onMouseLeave={() => setHoveredPointIdx(null)}
                      className="cursor-pointer"
                    >
                      {isHovered && (
                        <line
                          x1={x}
                          y1={padTop}
                          x2={x}
                          y2={padTop + plotH}
                          stroke="#525252"
                          strokeWidth="1"
                          strokeDasharray="3 3"
                        />
                      )}
                      <circle
                        cx={x}
                        cy={yTotal}
                        r={isHovered ? 5.5 : 4}
                        fill="#10b981"
                        stroke="#0a0a0a"
                        strokeWidth="1.5"
                      />
                      <circle
                        cx={x}
                        cy={yOwner}
                        r={isHovered ? 4.5 : 3.2}
                        fill="#f59e0b"
                        stroke="#0a0a0a"
                        strokeWidth="1.2"
                      />
                      <text
                        x={x}
                        y={svgHeight - 12}
                        textAnchor="middle"
                        fill={isHovered ? "#f59e0b" : "#a3a3a3"}
                        fontSize="10"
                        fontFamily="monospace"
                      >
                        {pt.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>
          </section>

          {/* OWNER MASTER VAULT & PAYOUT OPTIONS (Zero Auto-Added Banks) */}
          {(activeView === "overview" || activeView === "owner") && (
            <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-neutral-800">
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <Crown className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Owner Master Vault — {ownerRow.name}</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    3% real-money commission on every published sale · Vault ID {ownerWallet.vaultAccountId || ownerWallet.walletId}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenWallet("withdraw");
                    }}
                    className="flex items-center gap-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 px-3.5 py-2 text-xs font-bold text-neutral-950 transition-colors cursor-pointer"
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>{hasOwnerPayoutMethod ? "Manage Digital Wallet / Bank" : "+ Add Digital Wallet or Any Bank"}</span>
                    <ArrowUpRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-xs text-neutral-400">3% Platform Commission Earned</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-amber-300">
                    {formatLocalCurrency(convertUsdToCurrency(ownerRow.platformFeesUsd, preferredCurrency), preferredCurrency)}
                  </div>
                  <div className="text-[11px] text-neutral-500 font-mono tabular-nums">
                    ${ownerRow.platformFeesUsd.toFixed(2)} USD · {formatLocalCurrency(Math.round(ownerRow.platformFeesUsd * EXCHANGE_RATES.NPR.rate * 100) / 100, "NPR")}
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-neutral-400">Owner Personal Idea &amp; Task Revenue</div>
                  <div className="text-lg font-bold font-mono tabular-nums text-emerald-400">
                    {formatLocalCurrency(
                      convertUsdToCurrency(
                        ownerRow.buyoutAndUpfrontUsd + ownerRow.royaltiesUsd + ownerRow.taskRewardsUsd,
                        preferredCurrency
                      ),
                      preferredCurrency
                    )}
                  </div>
                  <div className="text-[11px] text-neutral-500">
                    Direct buyouts, 15% royalties &amp; tasks
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-neutral-400">Linked Payout Destination</div>
                  <div className="text-sm font-semibold text-neutral-200 flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5 text-sky-400 shrink-0" />
                    <span>
                      {hasOwnerPayoutMethod
                        ? `${primaryOwnerMethod.providerName} (${primaryOwnerMethod.type === "bank" ? "Bank" : "Digital Wallet"})`
                        : "None Added Yet (Your Choice)"}
                    </span>
                  </div>
                  <div className="text-[11px] text-neutral-400">
                    {hasOwnerPayoutMethod
                      ? `${primaryOwnerMethod.accountIdentifier} · ${primaryOwnerMethod.currency}`
                      : "Add any Digital Wallet or any Bank Account you personally use"}
                  </div>
                </div>
              </div>

              {/* Owner Real-World National Currency Slots */}
              <div className="pt-4 border-t border-neutral-800/80 space-y-2.5">
                <div className="text-xs font-semibold text-neutral-300">
                  Real-World National Currency Balances (ISO-4217 Fiat Only)
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {(["NPR", "USD", "INR", "EUR", "GBP"] as CurrencyCode[]).map((curr) => {
                    const slotVal = ownerWallet.currencySlots[curr] || 0;
                    return (
                      <div key={curr} className="rounded-xl border border-neutral-800 bg-neutral-950 p-3">
                        <div className="flex items-center justify-between text-[11px] text-neutral-400">
                          <span>{curr}</span>
                          <span>{EXCHANGE_RATES[curr]?.symbol}</span>
                        </div>
                        <div className="text-sm font-mono tabular-nums font-bold text-neutral-100 mt-1">
                          {formatLocalCurrency(slotVal, curr)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          )}

          {/* PARTICIPANTS EARNINGS TABLE */}
          {(activeView === "overview" || activeView === "everyone") && (
            <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <Users className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Earnings by Account ({preferredCurrency})</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {isPublished
                      ? "Real-money earnings across verified human creators, task contributors, and Owner"
                      : "Unpublished Pre-Launch: Only Owner account registered at 0.00 (no external real humans until published)"}
                  </p>
                </div>
                <span className="text-xs text-neutral-400 font-mono tabular-nums">
                  {filteredMemberRows.length} {filteredMemberRows.length === 1 ? "account" : "accounts"}
                </span>
              </div>

              <div className="overflow-x-auto rounded-xl border border-neutral-800 bg-neutral-950">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-neutral-800 text-neutral-400 font-semibold">
                      <th className="py-3 px-4">Account</th>
                      <th className="py-3 px-3">Role &amp; Country</th>
                      <th className="py-3 px-3 text-right">97% Deals</th>
                      <th className="py-3 px-3 text-right">15% Royalties</th>
                      <th className="py-3 px-3 text-right">Task Bounties</th>
                      <th className="py-3 px-3 text-right">3% Owner Fee</th>
                      <th className="py-3 px-4 text-right">Total Earned</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800/80">
                    {filteredMemberRows.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-8 text-center text-neutral-400">
                          No matching accounts found for &ldquo;{searchQuery}&rdquo;.
                        </td>
                      </tr>
                    ) : (
                      filteredMemberRows.map((row) => (
                        <tr
                          key={row.id}
                          className={
                            row.isOwner
                              ? "bg-amber-950/15 hover:bg-amber-950/25 transition-colors"
                              : "hover:bg-neutral-900/60 transition-colors"
                          }
                        >
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-neutral-100 flex items-center gap-1.5">
                              <span>{row.name}</span>
                              {row.isOwner && (
                                <Crown className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-500">
                              {row.handle}
                              {row.dealsCount > 0 ? ` · ${row.dealsCount} deals` : ""}
                              {row.tasksCount > 0 ? ` · ${row.tasksCount} tasks` : ""}
                            </div>
                          </td>
                          <td className="py-3.5 px-3 text-neutral-300">
                            <div>{row.roleLabel}</div>
                            <div className="text-[11px] text-neutral-500">{row.country}</div>
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-neutral-200">
                            {formatLocalCurrency(convertUsdToCurrency(row.buyoutAndUpfrontUsd, preferredCurrency), preferredCurrency)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-neutral-200">
                            {formatLocalCurrency(convertUsdToCurrency(row.royaltiesUsd, preferredCurrency), preferredCurrency)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-neutral-200">
                            {formatLocalCurrency(convertUsdToCurrency(row.taskRewardsUsd, preferredCurrency), preferredCurrency)}
                          </td>
                          <td className="py-3.5 px-3 text-right font-mono tabular-nums text-amber-300">
                            {row.isOwner
                              ? formatLocalCurrency(convertUsdToCurrency(row.platformFeesUsd, preferredCurrency), preferredCurrency)
                              : "—"}
                          </td>
                          <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-emerald-400">
                            {formatLocalCurrency(convertUsdToCurrency(row.totalEarnedUsd, preferredCurrency), preferredCurrency)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          {/* REAL-MONEY PAYOUT LEDGER */}
          {(activeView === "overview" || activeView === "ledger") && (
            <section className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>Real-Money Payment &amp; Commission Ledger</span>
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {isPublished
                      ? `Verified real-money settlements (${monetizedIdeas.length} monetized ideas)`
                      : "0 human payments recorded — site is not published yet"}
                  </p>
                </div>
                <span className="text-xs text-neutral-400 font-mono tabular-nums">
                  {ledgerEntries.length} {ledgerEntries.length === 1 ? "payment" : "payments"}
                </span>
              </div>

              {ledgerEntries.length === 0 ? (
                <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 text-center space-y-1.5">
                  <div className="text-sm font-semibold text-neutral-200">
                    No Human Payments or Earnings Yet
                  </div>
                  <p className="text-xs text-neutral-400 max-w-lg mx-auto">
                    {isPublished
                      ? `When real buyers acquire ideas or release task escrow in world currencies (${preferredCurrency}, USD, NPR, EUR, INR, etc.), itemized payouts appear here and on the line graph.`
                      : "Because IdeaVault has not been published yet, human payments do not exist and all balances remain at 0.00."}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-neutral-800 rounded-xl border border-neutral-800 bg-neutral-950 overflow-hidden">
                  {ledgerEntries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                    >
                      <div className="space-y-0.5">
                        <div className="font-semibold text-neutral-100">
                          {entry.recipientName}
                          <span className="text-neutral-500 font-normal"> · {entry.category}</span>
                        </div>
                        <div className="text-[11px] text-neutral-400">
                          {entry.description} · From {entry.counterparty} · Ref {entry.reference}
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0">
                        <div
                          className={`font-mono tabular-nums font-bold text-sm ${
                            entry.isOwner ? "text-amber-300" : "text-emerald-400"
                          }`}
                        >
                          +{entry.amountDisplay}
                        </div>
                        <div className="text-[11px] text-neutral-500">
                          {entry.timestamp}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 bg-neutral-950 px-6 py-4 shrink-0">
          <div className="text-xs text-neutral-400 flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
            <span>Real-World National Currencies Only · User-Selected Digital Wallet or Any Bank Account</span>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-800 hover:bg-neutral-700 px-4 py-2 text-xs font-semibold text-neutral-200 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
