import React, { useState } from "react";
import {
  Search,
  Globe,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  X,
  FileCode2,
  Share2,
} from "lucide-react";

interface SearchEngineGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenPromoVideo?: () => void;
}

export const SearchEngineGuideModal: React.FC<SearchEngineGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenPromoVideo,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<number, boolean>>({});

  if (!isOpen) return null;

  const origin =
    typeof window !== "undefined" && window.location.origin
      ? window.location.origin
      : "https://your-domain.com";

  const sitemapUrl = `${origin}/sitemap.xml`;
  const robotsUrl = `${origin}/robots.txt`;

  const copyValue = (key: string, value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2200);
  };

  const toggleStep = (step: number) => {
    setCompletedSteps((prev) => ({ ...prev, [step]: !prev[step] }));
  };

  const steps = [
    {
      num: 1,
      title: "Click 'Deploy' & Connect a Registered Public Domain (.com, .app, or free .com.np)",
      engine: "Required for ALL Search Engines",
      detail:
        "Right now your app runs on Google Cloud Run's *.run.app hosting URL (which works immediately when pasted into any browser address bar). However, Google and Bing only rank permanent public domains in search results — so register a domain such as ideavault.com, ideavault.app, or a FREE Nepali .com.np domain at register.com.np and connect it to your deployed Cloud Run service.",
    },
    {
      num: 2,
      title: "Google Search Console — Index on Google, Brave Search & Startpage",
      engine: "Google (88%+ Global Search Traffic)",
      detail:
        'Go to search.google.com/search-console → click "Add Property" → paste your live https:// domain → verify ownership via DNS TXT record → open "Sitemaps" on the left menu → submit /sitemap.xml → paste your homepage URL in the top "URL Inspection" bar and click "Request Indexing". Google usually crawls within 24–72 hours.',
    },
    {
      num: 3,
      title: "Bing Webmaster Tools — Automatically Covers Bing, DuckDuckGo, Yahoo & Ecosia",
      engine: "Bing + DuckDuckGo + Yahoo + Ecosia + Copilot",
      detail:
        'DuckDuckGo, Yahoo, and Ecosia do NOT have separate submission forms — they pull directly from Bing\'s index! Go to bing.com/webmasters → click "Import from Google Search Console" (takes 30 seconds) → submit /sitemap.xml and click "URL Submission". One step gets you onto 4 search engines at once.',
    },
    {
      num: 4,
      title: "Publish 3–5 Real Public Backlinks (So Crawlers Trust Your New Domain)",
      engine: "Authority & Fast Ranking",
      detail:
        "Brand-new websites with zero incoming links stay buried even after indexing. Upload your IdeaVault Promo Video to YouTube Shorts, TikTok, Instagram Reels, and LinkedIn with your live clickable URL in the description/profile, and post a launch page on Product Hunt, Indie Hackers, and Reddit (r/SideProject, r/startups, r/Nepal).",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl border border-neutral-800 bg-neutral-900 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-950 px-5 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-neutral-100">
                Appear on Every Search Engine — Step-by-Step Guide
              </h2>
              <p className="text-xs text-neutral-400">
                Built-in technical SEO status + real-world indexing checklist for Google, Bing, DuckDuckGo &amp; Yahoo
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
        <div className="p-5 sm:p-6 max-h-[76vh] overflow-y-auto space-y-5">
          {/* Current Live Hosting URL Card */}
          <div className="rounded-xl border border-amber-500/30 bg-neutral-950 p-4 space-y-2">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <Globe className="h-4 w-4 text-amber-400" />
                Your Current Live App URL (Opens Directly in Any Browser)
              </span>
              <button
                type="button"
                onClick={() => copyValue("origin", origin)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 px-2.5 py-1 text-[11px] font-semibold text-amber-300 cursor-pointer"
              >
                {copiedKey === "origin" ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copiedKey === "origin" ? "Copied Live URL!" : "Copy Live URL"}</span>
              </button>
            </div>
            <div className="rounded-lg bg-neutral-900/90 border border-neutral-800 px-3 py-2 font-mono text-xs text-neutral-100 break-all">
              {origin}
            </div>
            <p className="text-[11px] text-neutral-400 leading-relaxed">
              Official Website view: <span className="font-mono text-neutral-200">{origin}/website</span>
            </p>
          </div>

          {/* Already Built Into Your App Banner */}
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/25 p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-emerald-300 flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                Technical SEO Already Configured &amp; Live in IdeaVault
              </span>
              <span className="text-[11px] font-mono text-emerald-400">Crawler-Ready</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
              <div className="rounded-lg bg-neutral-950/90 border border-neutral-800 p-2.5 flex items-center justify-between gap-2">
                <div className="truncate">
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Live XML Sitemap</div>
                  <div className="font-mono text-[11px] text-amber-300 truncate">{sitemapUrl}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyValue("sitemap", sitemapUrl)}
                    className="rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 p-1.5 text-neutral-300 cursor-pointer"
                    title="Copy Sitemap URL"
                  >
                    {copiedKey === "sitemap" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <a
                    href="/sitemap.xml"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 p-1.5 text-amber-400"
                    title="View live /sitemap.xml"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              <div className="rounded-lg bg-neutral-950/90 border border-neutral-800 p-2.5 flex items-center justify-between gap-2">
                <div className="truncate">
                  <div className="text-[10px] text-neutral-500 uppercase font-semibold">Crawler Robots File</div>
                  <div className="font-mono text-[11px] text-amber-300 truncate">{robotsUrl}</div>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => copyValue("robots", robotsUrl)}
                    className="rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 p-1.5 text-neutral-300 cursor-pointer"
                    title="Copy robots.txt URL"
                  >
                    {copiedKey === "robots" ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                  <a
                    href="/robots.txt"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 p-1.5 text-amber-400"
                    title="View live /robots.txt"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] text-neutral-300 pt-1">
              <span className="rounded-md bg-neutral-900 border border-neutral-800 px-2 py-0.5 flex items-center gap-1">
                <FileCode2 className="h-3 w-3 text-amber-400" /> Schema.org JSON-LD (WebSite + WebApplication + FAQPage)
              </span>
              <span className="rounded-md bg-neutral-900 border border-neutral-800 px-2 py-0.5 flex items-center gap-1">
                <Globe className="h-3 w-3 text-emerald-400" /> OpenGraph &amp; Twitter Share Meta Tags
              </span>
            </div>
          </div>

          {/* 4 Actionable Steps That Actually Work */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
              4 Exact Steps You Must Complete So Search Engines Index You
            </h3>

            {steps.map((s) => {
              const done = Boolean(completedSteps[s.num]);
              return (
                <div
                  key={s.num}
                  onClick={() => toggleStep(s.num)}
                  className={`rounded-xl border p-4 transition-all cursor-pointer ${
                    done
                      ? "border-emerald-500/40 bg-emerald-950/20"
                      : "border-neutral-800 bg-neutral-950 hover:border-neutral-700"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-extrabold ${
                        done
                          ? "bg-emerald-500 text-neutral-950"
                          : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      }`}
                    >
                      {done ? "✓" : s.num}
                    </div>
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm font-bold text-neutral-100">{s.title}</span>
                        <span className="text-[10px] font-semibold rounded-md bg-neutral-900 border border-neutral-800 px-2 py-0.5 text-amber-300">
                          {s.engine}
                        </span>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">{s.detail}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-neutral-800 bg-neutral-950 px-5 sm:px-6 py-3.5">
          {onOpenPromoVideo ? (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenPromoVideo();
              }}
              className="flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 px-3.5 py-2 text-xs font-bold text-amber-300 cursor-pointer"
            >
              <Share2 className="h-3.5 w-3.5" />
              <span>Open Promo Video Studio for Backlinks</span>
            </button>
          ) : (
            <div />
          )}

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-amber-500 hover:bg-amber-400 px-5 py-2 text-xs font-extrabold text-neutral-950 cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
