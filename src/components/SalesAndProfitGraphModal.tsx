import React, { useState } from "react";
import { Idea, CurrencyCode } from "../types";
import { 
  TrendingUp, 
  DollarSign, 
  BarChart3, 
  Layers, 
  Camera, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  Sliders, 
  Sparkles, 
  X,
  PackageCheck,
  Hammer,
  AlertCircle
} from "lucide-react";
import { formatPrice, convertUsdToCurrency, PLATFORM_OWNER_WALLET, EXCHANGE_RATES } from "../utils/legalAndCurrency";

interface SalesAndProfitGraphModalProps {
  idea?: Idea | null;
  isOpen: boolean;
  onClose: () => void;
  preferredCurrency?: CurrencyCode;
}

interface ProcedureProofItem {
  id: string;
  stage: "mid_process" | "final_product";
  title: string;
  caption: string;
  imageUrl: string;
  postedBy: string;
  date: string;
  verifiedProduction: boolean;
}

export const SalesAndProfitGraphModal: React.FC<SalesAndProfitGraphModalProps> = ({
  idea,
  isOpen,
  onClose,
  preferredCurrency = "USD",
}) => {
  const [activeTab, setActiveTab] = useState<"graph" | "procedure">("graph");

  // Simulation parameters (0 actual units sold pre-launch)
  const [unitsSold, setUnitsSold] = useState<number>(0);
  const [sellingPrice, setSellingPrice] = useState<number>(39.99);
  const [manufacturingCost, setManufacturingCost] = useState<number>(11.5);
  const [toolingCost, setToolingCost] = useState<number>(0);
  const [upfrontIdeaFee, setUpfrontIdeaFee] = useState<number>(idea?.upfrontPrice || 0);
  const [royaltyPercent, setRoyaltyPercent] = useState<number>(idea?.saleModel === "full_buyout" ? 0 : 15);

  // Procedure upload state (empty until site is published and real builders fabricate)
  const [procedureList, setProcedureList] = useState<ProcedureProofItem[]>([]);

  const [newProofStage, setNewProofStage] = useState<"mid_process" | "final_product">("mid_process");
  const [newProofTitle, setNewProofTitle] = useState("");
  const [newProofCaption, setNewProofCaption] = useState("");
  const [newProofImageUrl, setNewProofImageUrl] = useState("");
  const [showAddProofForm, setShowAddProofForm] = useState(false);

  if (!isOpen) return null;

  // Financial Calculations
  const grossSalesRevenue = unitsSold * sellingPrice;
  const totalVariableCost = unitsSold * manufacturingCost;
  const fixedCosts = toolingCost + upfrontIdeaFee;
  const totalInputCost = fixedCosts + totalVariableCost;

  // Royalties & Platform Commissions
  const creatorRoyaltyAmount = (grossSalesRevenue * royaltyPercent) / 100;
  const platformFeeAmount = grossSalesRevenue * 0.03;
  const platformFeeNpr = Math.round(platformFeeAmount * EXCHANGE_RATES.NPR.rate);

  // Net Profit / Loss
  const netProfit = grossSalesRevenue - totalInputCost - creatorRoyaltyAmount - platformFeeAmount;
  const isProfitable = netProfit > 0;
  const profitMarginPercent = grossSalesRevenue > 0 ? (netProfit / grossSalesRevenue) * 100 : 0;

  // Break-even units calculation
  const contributionMarginPerUnit = sellingPrice - manufacturingCost - (sellingPrice * (royaltyPercent + 3)) / 100;
  const breakEvenUnits = contributionMarginPerUnit > 0 ? Math.ceil(fixedCosts / contributionMarginPerUnit) : 0;

  // Generate SVG chart data points across 0 to 1200 units
  const chartSteps = [0, 200, 400, 600, 800, 1000, 1200];
  const maxUnits = 1200;
  const maxVal = Math.max(1200 * sellingPrice, fixedCosts + 1200 * manufacturingCost, 10000);

  const getY = (val: number) => {
    const clamped = Math.max(-5000, Math.min(val, maxVal));
    // map 0 to maxVal to 180 to 20
    const ratio = clamped / maxVal;
    return Math.max(20, Math.min(190, 185 - ratio * 165));
  };

  const getX = (u: number) => {
    return 50 + (u / maxUnits) * 480;
  };

  // Build SVG path strings
  const revenuePoints = chartSteps.map((u) => `${getX(u)},${getY(u * sellingPrice)}`).join(" ");
  const costPoints = chartSteps
    .map((u) => {
      const c = fixedCosts + u * manufacturingCost + (u * sellingPrice * (royaltyPercent + 3)) / 100;
      return `${getX(u)},${getY(c)}`;
    })
    .join(" ");

  const currentUnitX = getX(unitsSold);
  const currentRevenueY = getY(grossSalesRevenue);
  const currentCostY = getY(totalInputCost + creatorRoyaltyAmount + platformFeeAmount);

  const handleAddProcedureProof = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProofTitle.trim() || !newProofCaption.trim()) return;

    const newProof: ProcedureProofItem = {
      id: `proc-${Date.now()}`,
      stage: newProofStage,
      title: newProofTitle.trim(),
      caption: newProofCaption.trim(),
      imageUrl:
        newProofImageUrl.trim() ||
        (newProofStage === "mid_process"
          ? "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80"
          : "https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80"),
      postedBy: "Verified Builder / Creator",
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      verifiedProduction: true,
    };

    setProcedureList([newProof, ...procedureList]);
    setNewProofTitle("");
    setNewProofCaption("");
    setNewProofImageUrl("");
    setShowAddProofForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        id="modal-sales-profit-graph"
        className="relative w-full max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <TrendingUp className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-100">
                  Sales, Profit & Loss Engine & Procedure Proof
                </h2>
                {idea && (
                  <span className="rounded-full bg-amber-500/20 border border-amber-500/30 px-2.5 py-0.5 text-[10px] font-bold text-amber-300">
                    {idea.title}
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-400">
                Input costs vs. output sales • Net profit/loss curve • Proof of fabrication & success procedure
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-neutral-800 bg-neutral-950/80 px-6 pt-2">
          <button
            onClick={() => setActiveTab("graph")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "graph"
                ? "border-emerald-500 text-emerald-400 bg-emerald-500/10 rounded-t-lg"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <BarChart3 className="h-4 w-4" />
            <span>Sales & Profit/Loss Graph</span>
          </button>
          <button
            onClick={() => setActiveTab("procedure")}
            className={`flex items-center gap-2 border-b-2 px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
              activeTab === "procedure"
                ? "border-amber-500 text-amber-400 bg-amber-500/10 rounded-t-lg"
                : "border-transparent text-neutral-400 hover:text-neutral-200"
            }`}
          >
            <Camera className="h-4 w-4" />
            <span>Success & Procedure Proof Photos ({procedureList.length})</span>
          </button>
        </div>

        {/* Tab 1: Sales & Profit/Loss Graph */}
        {activeTab === "graph" && (
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Top Stat Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                  Total Gross Revenue (Output)
                </span>
                <span className="text-xl font-extrabold text-neutral-100 font-mono">
                  {formatPrice(grossSalesRevenue, preferredCurrency)}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  {unitsSold.toLocaleString()} units @ ${sellingPrice}/ea
                </span>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                  Total Input Costs (Fixed + Mfg)
                </span>
                <span className="text-xl font-extrabold text-amber-400 font-mono">
                  {formatPrice(totalInputCost, preferredCurrency)}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  R&D ${upfrontIdeaFee} + Tooling ${toolingCost} + Mfg
                </span>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                  Net Commercial Profit / Loss
                </span>
                <span
                  className={`text-xl font-extrabold font-mono ${
                    isProfitable ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {isProfitable ? "+" : ""}
                  {formatPrice(netProfit, preferredCurrency)}
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  {profitMarginPercent.toFixed(1)}% net margin • {isProfitable ? "Profitable" : "In Investment Phase"}
                </span>
              </div>

              <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-3.5">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block mb-1">
                  Break-Even Threshold
                </span>
                <span className="text-xl font-extrabold text-sky-400 font-mono">
                  {breakEvenUnits.toLocaleString()} units
                </span>
                <span className="text-[10px] text-neutral-500 block mt-0.5">
                  {unitsSold >= breakEvenUnits ? "✓ Passed break-even" : `${breakEvenUnits - unitsSold} units to break-even`}
                </span>
              </div>
            </div>

            {/* Interactive SVG Graph Area */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 text-xs">
                  <div className="flex items-center gap-1.5 text-neutral-200">
                    <span className="h-3 w-3 rounded-full bg-emerald-400 inline-block" />
                    <span>Gross Sales Revenue (Output)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-200">
                    <span className="h-3 w-3 rounded-full bg-rose-400 inline-block" />
                    <span>Total Input Costs (Capital + Mfg)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-neutral-200">
                    <span className="h-3 w-3 rounded-full bg-sky-400 inline-block" />
                    <span>Break-Even Marker</span>
                  </div>
                </div>
                <span className="text-[11px] text-neutral-400 font-mono">
                  Units Sold: <strong className="text-amber-400">{unitsSold}</strong>
                </span>
              </div>

              {/* The SVG Visualization */}
              <div className="relative w-full h-56 bg-neutral-900/60 rounded-xl border border-neutral-800/80 p-2 overflow-hidden">
                <svg viewBox="0 0 560 210" className="w-full h-full">
                  {/* Grid Lines */}
                  <line x1="50" y1="20" x2="530" y2="20" stroke="#333" strokeDasharray="3 3" />
                  <line x1="50" y1="75" x2="530" y2="75" stroke="#333" strokeDasharray="3 3" />
                  <line x1="50" y1="130" x2="530" y2="130" stroke="#333" strokeDasharray="3 3" />
                  <line x1="50" y1="185" x2="530" y2="185" stroke="#555" />

                  {/* Y Axis Labels */}
                  <text x="10" y="25" fill="#777" fontSize="9" fontFamily="monospace">
                    ${Math.round(maxVal / 1000)}k
                  </text>
                  <text x="10" y="80" fill="#777" fontSize="9" fontFamily="monospace">
                    ${Math.round((maxVal * 0.66) / 1000)}k
                  </text>
                  <text x="10" y="135" fill="#777" fontSize="9" fontFamily="monospace">
                    ${Math.round((maxVal * 0.33) / 1000)}k
                  </text>
                  <text x="25" y="188" fill="#777" fontSize="9" fontFamily="monospace">
                    $0
                  </text>

                  {/* Cost Curve (Rose) */}
                  <polyline
                    fill="none"
                    stroke="#f43f5e"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points={costPoints}
                  />

                  {/* Revenue Curve (Emerald) */}
                  <polyline
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="3"
                    strokeLinecap="round"
                    points={revenuePoints}
                  />

                  {/* Current Units Vertical Guideline */}
                  <line
                    x1={currentUnitX}
                    y1="20"
                    x2={currentUnitX}
                    y2="185"
                    stroke="#eab308"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />

                  {/* Intersection / Current Dots */}
                  <circle cx={currentUnitX} cy={currentRevenueY} r="5" fill="#10b981" stroke="#fff" strokeWidth="1.5" />
                  <circle cx={currentUnitX} cy={currentCostY} r="5" fill="#f43f5e" stroke="#fff" strokeWidth="1.5" />

                  {/* Break-even line */}
                  {breakEvenUnits <= maxUnits && (
                    <g>
                      <line
                        x1={getX(breakEvenUnits)}
                        y1="20"
                        x2={getX(breakEvenUnits)}
                        y2="185"
                        stroke="#38bdf8"
                        strokeWidth="1.5"
                        strokeDasharray="2 2"
                      />
                      <text
                        x={getX(breakEvenUnits) - 25}
                        y="15"
                        fill="#38bdf8"
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="bold"
                      >
                        BE: {breakEvenUnits}
                      </text>
                    </g>
                  )}

                  {/* X Axis Unit ticks */}
                  {chartSteps.map((u) => (
                    <text
                      key={u}
                      x={getX(u) - 10}
                      y="202"
                      fill="#777"
                      fontSize="9"
                      fontFamily="monospace"
                    >
                      {u}
                    </text>
                  ))}
                </svg>
              </div>

              {/* Automated In-App Digital Master Wallet 3% Commission Notice */}
              <div className="rounded-xl border border-sky-500/30 bg-sky-950/20 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-neutral-200">
                    Platform Discovery Fee (3%): <strong className="text-sky-400 font-mono tabular-nums">${platformFeeAmount.toFixed(2)} USD (≈ ₨{platformFeeNpr.toLocaleString()} NPR)</strong>
                  </span>
                </div>
                <div className="text-[11px] text-neutral-400 font-mono">
                  Settled into Platform Owner Master Wallet: <strong className="text-sky-300">{PLATFORM_OWNER_WALLET.accountName}</strong>
                </div>
              </div>
            </div>

            {/* Interactive Simulation Sliders */}
            <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Sliders className="h-4 w-4" />
                What-If Financial Simulator (Pre-Launch Baseline: 0 Units Sold)
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span>Units Produced & Sold</span>
                    <span className="font-mono tabular-nums text-amber-400 font-bold">{unitsSold} units</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1200"
                    step="10"
                    value={unitsSold}
                    onChange={(e) => setUnitsSold(parseInt(e.target.value, 10))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span>Retail Selling Price / Unit</span>
                    <span className="font-mono text-emerald-400 font-bold">${sellingPrice}</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="1"
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span>Manufacturing Cost / Unit</span>
                    <span className="font-mono text-rose-400 font-bold">${manufacturingCost}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    step="0.5"
                    value={manufacturingCost}
                    onChange={(e) => setManufacturingCost(parseFloat(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span>Tooling & Setup Budget ($)</span>
                    <span className="font-mono text-neutral-200 font-bold">${toolingCost}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="5000"
                    step="100"
                    value={toolingCost}
                    onChange={(e) => setToolingCost(parseInt(e.target.value, 10))}
                    className="w-full accent-neutral-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span>Upfront Idea Acquisition Stake ($)</span>
                    <span className="font-mono text-neutral-200 font-bold">${upfrontIdeaFee}</span>
                  </div>
                  <input
                    type="range"
                    min="50"
                    max="2500"
                    step="50"
                    value={upfrontIdeaFee}
                    onChange={(e) => setUpfrontIdeaFee(parseInt(e.target.value, 10))}
                    className="w-full accent-neutral-500 cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-neutral-300 mb-1">
                    <span>Creator Royalty Model</span>
                    <span className="font-mono text-amber-300 font-bold">
                      {royaltyPercent === 0 ? "0% (Full Buyout)" : `${royaltyPercent}% Royalty`}
                    </span>
                  </div>
                  <select
                    value={royaltyPercent}
                    onChange={(e) => setRoyaltyPercent(parseInt(e.target.value, 10))}
                    className="w-full rounded-lg border border-neutral-700 bg-neutral-900 px-2.5 py-1.5 text-xs text-neutral-200 focus:border-amber-500 focus:outline-none"
                  >
                    <option value={0}>0% - 100% Full Copyright Buyout</option>
                    <option value={15}>15% - Standard Creator Royalty</option>
                    <option value={10}>10% - Volume Production Tier</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Success & Procedure Proof Showcase */}
        {activeTab === "procedure" && (
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-neutral-100 flex items-center gap-2">
                  <PackageCheck className="h-5 w-5 text-emerald-400" />
                  <span>Verified Procedure & Production Proof Gallery</span>
                </h3>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Builders and creators who succeed post mid-process fabrication photos, prototype iterations, and final market products.
                </p>
              </div>

              <button
                onClick={() => setShowAddProofForm(!showAddProofForm)}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-3.5 py-2 text-xs font-bold text-neutral-950 transition-all shadow-md shadow-amber-500/20"
              >
                <Camera className="h-4 w-4" />
                <span>{showAddProofForm ? "Close Form" : "Post Procedure Proof"}</span>
              </button>
            </div>

            {/* Add Proof Form */}
            {showAddProofForm && (
              <form
                onSubmit={handleAddProcedureProof}
                className="rounded-2xl border border-amber-500/30 bg-neutral-950 p-5 space-y-4 animate-in fade-in"
              >
                <div className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Hammer className="h-4 w-4" />
                  Add Production Procedure Milestone or Final Product Photo
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">
                      Milestone Stage *
                    </label>
                    <select
                      value={newProofStage}
                      onChange={(e) => setNewProofStage(e.target.value as any)}
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                    >
                      <option value="mid_process">Mid-Process Prototype / Tooling / Workshop Photo</option>
                      <option value="final_product">Final Manufactured Product in Hand</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-neutral-300 mb-1">
                      Step Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newProofTitle}
                      onChange={(e) => setNewProofTitle(e.target.value)}
                      placeholder="e.g., CNC Milling of valve body, 3D casing test"
                      className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-neutral-100 focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Procedure Description & Results *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={newProofCaption}
                    onChange={(e) => setNewProofCaption(e.target.value)}
                    placeholder="Detail the manufacturing steps taken, materials used (e.g. food-grade 316 steel, polycarbonate), temperature tolerances tested, and outcome."
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-300 mb-1">
                    Photo Image URL (or Leave Blank for Auto-Stock Workshop Visual)
                  </label>
                  <input
                    type="url"
                    value={newProofImageUrl}
                    onChange={(e) => setNewProofImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-neutral-700 bg-neutral-900 px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddProofForm(false)}
                    className="rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-neutral-300 hover:bg-neutral-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-bold text-neutral-950"
                  >
                    Publish Proof Update
                  </button>
                </div>
              </form>
            )}

            {/* Proof Gallery Cards */}
            {procedureList.length === 0 ? (
              <div className="rounded-2xl border border-neutral-800 bg-neutral-950/80 p-8 text-center space-y-2">
                <PackageCheck className="mx-auto h-9 w-9 text-neutral-500" />
                <h4 className="text-sm font-bold text-neutral-200">No Human Production Proofs Yet (Pre-Launch)</h4>
                <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                  Since the site is not published live yet, zero human builder fabrication posts or commercial product payouts exist. Real-world production proofs appear here once the site is published.
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {procedureList.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-neutral-800 bg-neutral-950/80 overflow-hidden shadow-lg hover:border-neutral-700 transition-all flex flex-col"
                >
                  <div className="relative h-48 w-full bg-neutral-900 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold shadow-md ${
                          item.stage === "mid_process"
                            ? "bg-amber-500 text-neutral-950"
                            : "bg-emerald-500 text-neutral-950"
                        }`}
                      >
                        {item.stage === "mid_process" ? "Mid-Process Prototype" : "Final Manufactured Product"}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="rounded-full bg-neutral-950/80 backdrop-blur-sm border border-neutral-700 px-2 py-0.5 text-[10px] text-neutral-300 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        Verified Proof
                      </span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="text-sm font-bold text-neutral-100">{item.title}</h4>
                      <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                        {item.caption}
                      </p>
                    </div>

                    <div className="border-t border-neutral-800/80 pt-2.5 flex items-center justify-between text-[11px] text-neutral-500">
                      <span>By: <strong className="text-neutral-300">{item.postedBy}</strong></span>
                      <span>{item.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>Real-time financial modeling compliant with Nepal Rastra Bank & UNCITRAL rules</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-800 px-4 py-2 font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
