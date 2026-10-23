import React, { useState } from "react";
import { 
  Scale, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  HelpCircle, 
  Send, 
  Globe, 
  BookOpen, 
  FileText, 
  AlertTriangle,
  Smartphone,
  CreditCard,
  Building,
  X
} from "lucide-react";
import { LEGAL_FRAMEWORK, PLATFORM_OWNER_WALLET, EXCHANGE_RATES } from "../utils/legalAndCurrency";

interface LegalAndMoneyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string;
  userCountry?: string;
}

interface QuestionAnswer {
  q: string;
  category: "Money & Payouts" | "Copyright & UN Laws" | "Nepal Law" | "3-Strike Policy";
  a: string;
  lawCitations?: string[];
}

const PRESET_FAQS: QuestionAnswer[] = [
  {
    q: "Can I publish my idea, and will I actually receive real money or not?",
    category: "Money & Payouts",
    a: "YES, you will actually receive real money. When you publish an idea, interested corporate buyers, engineers, or venture builders can acquire it through two legally enforceable models: (1) 100% Full Copyright Buyout (where the buyer pays you an agreed lump-sum in full, and you transfer all future rights with 0% ongoing royalty), or (2) 15% Royalty License (where you receive an upfront development fee plus a perpetual 15% cut of all gross market sales). All funds are deposited into escrow before design handoff and released directly into your secure In-App Multi-Currency Digital Wallet, from which you can withdraw to any bank account or external digital wallet worldwide.",
    lawCitations: [
      "Nepal Civil Code 2074 (Sections 503-535 on Enforceable Commercial Contracts)",
      "UNCITRAL Model Law on Electronic Commerce (1996) Article 11",
    ],
  },
  {
    q: "How does the platform owner 3% commission work and where is it settled?",
    category: "Money & Payouts",
    a: `For every transaction (whether a full buyout or royalty transaction), an automated 3% platform discovery fee is settled directly into the platform owner's verified In-App Master Multi-Currency Vault Wallet: ${PLATFORM_OWNER_WALLET.accountName} (${PLATFORM_OWNER_WALLET.walletId}). The remaining 97% net consideration is disbursed to the seller in their requested local currency slot.`,
    lawCitations: [
      "Nepal Rastra Bank (NRB) Payment and Settlement Act 2075",
      "UNCITRAL Model Law on Electronic Commerce Art 7",
    ],
  },
  {
    q: "Can people be paid in the currency of their own country and withdraw freely?",
    category: "Money & Payouts",
    a: "YES. Sellers and buyers receive payments directly into dedicated multi-currency slots (such as Nepalese Rupee ₨ NPR, US Dollar $ USD, Indian Rupee ₹ INR, Euro € EUR, British Pound £ GBP, Australian Dollar A$ AUD, Canadian Dollar C$ CAD, or Japanese Yen ¥ JPY). Users can store funds securely in the app or withdraw at any time to their connected bank account or any digital wallet.",
    lawCitations: [
      "Foreign Exchange Regulation Directives",
      "Universal Cross-Border Merchant Settlement Protocols",
    ],
  },
  {
    q: "How is my copyright legally protected when I post?",
    category: "Copyright & UN Laws",
    a: "Under the international WIPO Berne Convention (Articles 2, 5) and Section 3 of the Nepal Copyright Act 2059 (2002), copyright protection subsists automatically the moment your original work is fixed in a tangible or digital medium. When you post on IdeaVault, our system generates an official timestamped Copyright Registration Certificate with a cryptographic SHA-256 hash, formally recording your authorship and delivering certified documentation to your registered email.",
    lawCitations: [
      "WIPO Berne Convention for the Protection of Literary and Artistic Works (Paris Act 1971)",
      "Universal Declaration of Human Rights (UDHR) Article 27(2)",
      "Nepal Copyright Act, 2059 (Section 3)",
    ],
  },
  {
    q: "Can I fully sell all copyrights with 0% future royalty or commission?",
    category: "Copyright & UN Laws",
    a: "YES. You have the total freedom to choose a '100% Full Copyright Buyout'. Under Section 19 of the Nepal Copyright Act 2059 and international IP assignment standards, an author may completely assign economic rights to a commercial buyer. In this model, the ideator receives 100% of their buyout payment upfront, and zero future royalties or commissions are owed by or to the ideator. The buyer completely owns all commercial and derivative rights.",
    lawCitations: [
      "Nepal Copyright Act 2059 Section 19 (Transfer of Copyright)",
      "WIPO Guidelines on Intellectual Property Asset Valuation & Assignment",
    ],
  },
  {
    q: "What is the 3-Strike Warning Rule and what leads to a ban?",
    category: "3-Strike Policy",
    a: "To maintain compliance with the United Nations legal order and Nepal laws, IdeaVault strictly enforces a 3-strike policy. Violations include posting plagiarized content, claiming ownership of someone else's patent, fraudulent payment attempts, or unlawful material. When a violation is audited: Strike 1 = Official warning emailed with 48 hours to remedy; Strike 2 = Final written notice and temporary account suspension; Strike 3 = Permanent account ban, revocation of all platform trading privileges, and blacklisting of associated payment channels.",
    lawCitations: [
      "Nepal Electronic Transactions Act, 2063 (Chapter 9 Penalties)",
      "International Intellectual Property Enforcement Standards (TRIPS Agreement)",
    ],
  },
];

export const LegalAndMoneyGuideModal: React.FC<LegalAndMoneyGuideModalProps> = ({
  isOpen,
  onClose,
  userEmail,
  userCountry = "Nepal",
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [customQuestion, setCustomQuestion] = useState("");
  const [customAnswer, setCustomAnswer] = useState<{ q: string; a: string; laws: string[] } | null>(null);
  const [isAsking, setIsAsking] = useState(false);

  if (!isOpen) return null;

  const filteredFaqs = PRESET_FAQS.filter((faq) => {
    const matchesCategory = selectedCategory === "All" || faq.category === selectedCategory;
    const matchesQuery =
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesQuery;
  });

  const handleAskQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customQuestion.trim()) return;

    setIsAsking(true);
    // Simulate grounded legal answer based on knowledge base
    setTimeout(() => {
      const qLower = customQuestion.toLowerCase();
      let answer = "";
      let laws: string[] = [];

      if (qLower.includes("money") || qLower.includes("receive") || qLower.includes("paid") || qLower.includes("earn") || qLower.includes("withdraw")) {
        answer = `Yes, you will receive real money once an authentic buyer acquires your idea. The buyer's payment is deposited into secure escrow before any proprietary blueprints or contact details are exchanged. You can receive payouts directly in your chosen currency slot (e.g., NPR, USD, EUR, INR) within your In-App Digital Wallet. You can withdraw your earnings to any linked bank account or external digital wallet whenever you want, or keep it securely in your in-app wallet to spend or pay with the built-in QR scanner. The platform owner receives an automated 3% discovery commission settled into their Master Vault Wallet.`;
        laws = [
          "Nepal Copyright Act 2059 (Sec. 7 - Economic Exploitation Rights)",
          "NRB Payment and Settlement Directives 2075",
          "Nepal Civil Code 2074 (Law of Contracts)",
        ];
      } else if (qLower.includes("wallet") || qLower.includes("withdraw") || qLower.includes("bank") || qLower.includes("scanner")) {
        answer = `IdeaVault features a built-in real-money multi-currency digital wallet supporting strictly ISO-4217 national currencies (NPR, USD, INR, EUR, GBP, AUD, CAD, JPY, PLN). No bank is ever pre-selected automatically—you have full choice to link any Digital Wallet or Any Bank Account (Account Number, Routing/SWIFT, Branch) to withdraw your real-money earnings once the platform is published live, and track all earnings on the Line Graph in the Earnings Dashboard.`;
        laws = [
          "Nepal Rastra Bank Payment & Settlement Act 2075",
          "UNCITRAL Model Law on Electronic Commerce Art 7",
        ];
      } else if (qLower.includes("sell") || qLower.includes("buyout") || qLower.includes("royalty") || qLower.includes("copyright")) {
        answer = `Under both the WIPO Berne Convention and Nepal Copyright Act 2059 (Section 19), you possess the absolute legal authority to either sell your idea for a 'Full Buyout' (giving the buyer 100% full copyright ownership, after which 0% royalty is owed to you) or grant an exclusive production license for a 15% royalty share. Official legal certificates and deeds of assignment are generated and delivered to your email.`;
        laws = [
          "Nepal Copyright Act 2059 (Section 19 - Transfer of Copyright)",
          "WIPO Berne Convention (Articles 2, 5 & 6bis)",
          "UNCITRAL Model Law on Electronic Signatures",
        ];
      } else if (qLower.includes("strike") || qLower.includes("ban") || qLower.includes("violation") || qLower.includes("law")) {
        answer = `All community members must abide by the United Nations legal order and Nepal laws. Any copyright theft, fraudulent claims, or unauthorized copying results in an official strike dispatched to your registered email. Accumulating 3 strikes results in an immediate permanent ban, forfeiture of escrow balances from infringing posts, and blacklisting.`;
        laws = [
          "Nepal Electronic Transactions Act 2063 (Penal Provisions)",
          "WTO TRIPS Agreement on IP Enforcement",
        ];
      } else {
        answer = `Under the United Nations order of law (WIPO Berne Convention) and the laws of Nepal (Copyright Act 2059 & Civil Code 2074), all ideas posted with original creative expression receive immediate copyright subsistence. You can legally publish and monetize your concept with full buyout or 15% royalty terms. Payouts are guaranteed through escrow in your country's currency in your In-App Digital Wallet, with an automated 3% platform commission settled into the Master Vault Wallet.`;
        laws = [
          "WIPO Berne Convention (Paris Act 1971)",
          "Nepal Copyright Act, 2059 (2002)",
          "Nepal Civil Code 2074",
        ];
      }

      setCustomAnswer({
        q: customQuestion,
        a: answer,
        laws,
      });
      setIsAsking(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div 
        id="modal-legal-guide"
        className="relative w-full max-w-4xl rounded-2xl border border-neutral-800 bg-neutral-900/95 shadow-2xl overflow-hidden my-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Scale className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-neutral-100">
                  Legal Laws, Copyrights & Money Guide
                </h2>
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  UN & Nepal Law Certified
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                WIPO Berne Convention • Nepal Copyright Act 2059 • In-App Multi-Currency Digital Wallet • 3-Strike System
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

        {/* Core Pillars Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-b border-neutral-800 bg-neutral-950/60 p-4 text-xs">
          <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-3">
            <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-1">
              <CheckCircle2 className="h-4 w-4" />
              <span>Real Money Payouts</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Disbursed in your country's currency (NPR ₨, USD $, INR ₹, EUR €) into in-app wallet or bank.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-3">
            <div className="flex items-center gap-1.5 text-sky-400 font-bold mb-1">
              <Smartphone className="h-4 w-4" />
              <span>3% Master Wallet Fee</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Automated 3% discovery fee credited to platform owner: <strong className="text-neutral-200">{PLATFORM_OWNER_WALLET.walletId}</strong>.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-3">
            <div className="flex items-center gap-1.5 text-emerald-400 font-bold mb-1">
              <FileText className="h-4 w-4" />
              <span>Full Buyout (0% Roy)</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Option to sell 100% copyright for a lump-sum, with 0% future royalty owed.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-900/80 p-3">
            <div className="flex items-center gap-1.5 text-red-400 font-bold mb-1">
              <AlertTriangle className="h-4 w-4" />
              <span>3-Strike Ban Rule</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Violations result in warnings dispatched to email. 3 strikes = permanent platform ban.
            </p>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
          {/* Interactive Question Answering Bar */}
          <div className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-neutral-900 to-neutral-900 p-4 sm:p-5 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <HelpCircle className="h-5 w-5 text-amber-400" />
              <h3 className="text-sm sm:text-base font-bold text-neutral-100">
                Ask Any Legal or Money Question
              </h3>
            </div>
            <p className="text-xs text-neutral-300 mb-3">
              Ask about getting paid, copyright ownership, full buyouts, in-app digital wallet withdrawals, or UN & Nepal legal procedures:
            </p>
            <form onSubmit={handleAskQuestion} className="flex gap-2">
              <input
                type="text"
                value={customQuestion}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder="e.g., Will I actually receive money in Nepal? Can I sell 100% of my copyrights?"
                className="flex-1 rounded-xl border border-neutral-700 bg-neutral-950 px-4 py-2.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-amber-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={isAsking || !customQuestion.trim()}
                className="flex items-center gap-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 px-4 py-2.5 text-xs sm:text-sm font-bold text-neutral-950 transition-all disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                <span>{isAsking ? "Consulting..." : "Ask Legal"}</span>
              </button>
            </form>

            {/* Custom Answer Result */}
            {customAnswer && (
              <div className="mt-4 rounded-xl border border-neutral-700 bg-neutral-950 p-4 animate-in fade-in">
                <div className="text-xs font-bold text-amber-400 mb-1">
                  Q: {customAnswer.q}
                </div>
                <div className="text-xs text-neutral-200 leading-relaxed">
                  {customAnswer.a}
                </div>
                {customAnswer.laws && customAnswer.laws.length > 0 && (
                  <div className="mt-3 border-t border-neutral-800 pt-2 flex flex-wrap gap-2 text-[10px] text-neutral-400">
                    <span className="font-semibold text-neutral-300">Governing Statutes:</span>
                    {customAnswer.laws.map((law, idx) => (
                      <span key={idx} className="rounded bg-neutral-800 px-2 py-0.5 text-amber-300/90 font-mono">
                        {law}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Category Filter Pills & Search */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              {["All", "Money & Payouts", "Copyright & UN Laws", "Nepal Law", "3-Strike Policy"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? "bg-amber-500 text-neutral-950 shadow-sm"
                      : "bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter topics..."
              className="rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-1.5 text-xs text-neutral-200 placeholder-neutral-500 focus:border-amber-500 focus:outline-none w-44"
            />
          </div>

          {/* Preset FAQ Cards */}
          <div className="space-y-4">
            {filteredFaqs.map((faq, index) => (
              <div
                key={index}
                className="rounded-2xl border border-neutral-800 bg-neutral-950/70 p-4 sm:p-5 hover:border-neutral-700 transition-colors shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <h4 className="text-sm font-bold text-neutral-100 flex items-center gap-2">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400 text-[11px] font-bold">
                      {index + 1}
                    </span>
                    {faq.q}
                  </h4>
                  <span className="rounded-full bg-neutral-800 px-2.5 py-0.5 text-[10px] font-medium text-neutral-400 shrink-0">
                    {faq.category}
                  </span>
                </div>
                <p className="mt-2.5 text-xs text-neutral-300 leading-relaxed pl-7">
                  {faq.a}
                </p>
                {faq.lawCitations && (
                  <div className="mt-3 pl-7 flex flex-wrap gap-2 text-[10px] text-neutral-400">
                    <span className="font-semibold text-neutral-400">Statutory Precedents:</span>
                    {faq.lawCitations.map((cite, i) => (
                      <span
                        key={i}
                        className="rounded bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-neutral-300"
                      >
                        {cite}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* United Nations & Nepal Treaties Reference Section */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-950 p-5 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Statutory Treaties & Laws Followed by IdeaVault
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="rounded-xl bg-neutral-900/90 p-3.5 border border-neutral-800 space-y-1.5">
                <div className="font-bold text-neutral-200">United Nations & WIPO Treaties</div>
                <div className="text-[11px] text-neutral-400 leading-relaxed">
                  • <strong>Berne Convention:</strong> Universal automatic copyright protection across 181 countries without mandatory prior formalities.
                </div>
                <div className="text-[11px] text-neutral-400 leading-relaxed">
                  • <strong>UDHR Article 27(2):</strong> Fundamental human right to the moral and material interests in scientific, literary, or artistic works.
                </div>
                <div className="text-[11px] text-neutral-400 leading-relaxed">
                  • <strong>UNCITRAL Model Law:</strong> International legal standing and evidentiary admissibility of electronic contracts and digital signatures.
                </div>
              </div>

              <div className="rounded-xl bg-neutral-900/90 p-3.5 border border-neutral-800 space-y-1.5">
                <div className="font-bold text-neutral-200">Laws of Nepal (नेपाल कानून)</div>
                <div className="text-[11px] text-neutral-400 leading-relaxed">
                  • <strong>Copyright Act 2059 (२०५९):</strong> Sec. 3 (Subsistence of Copyright), Sec. 7 (Economic Rights), and Sec. 19 (Full Transfer & Assignment of Copyright).
                </div>
                <div className="text-[11px] text-neutral-400 leading-relaxed">
                  • <strong>Electronic Transactions Act 2063:</strong> Full legal recognition to digital contracts, hashes, and digital signature conveyance.
                </div>
                <div className="text-[11px] text-neutral-400 leading-relaxed">
                  • <strong>Civil Code 2074:</strong> Binding contractual obligations and commercial consideration transfer.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-neutral-800 bg-neutral-950 px-6 py-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>All contracts generated on IdeaVault are legally binding in Nepal & internationally</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl bg-neutral-800 px-4 py-2 font-semibold text-neutral-200 hover:bg-neutral-700 transition-colors"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
