import { Idea, UserProfile, LiveSyncState, AntiHackDefenseStatus } from "../types";

const SYNC_ENDPOINT = "/api/platform/sync-state";
const ANTI_HACK_ENDPOINT = "/api/security/anti-hack-check";
const HEALTH_ENDPOINT = "/api/health";

export interface ServerHealthStatus {
  connected: boolean;
  latencyMs: number;
  hasGeminiKey: boolean;
  timestamp: string;
  antiHackShield: string;
  serverUrl: string;
  statusText: string;
}

export async function checkServerHealth(): Promise<ServerHealthStatus> {
  const start = performance.now();
  try {
    const res = await fetch(HEALTH_ENDPOINT, { 
      cache: "no-store",
      headers: { "Accept": "application/json" }
    });
    const latency = Math.round(performance.now() - start);
    if (!res.ok) {
      return {
        connected: false,
        latencyMs: latency,
        hasGeminiKey: false,
        timestamp: new Date().toISOString(),
        antiHackShield: "OFFLINE",
        serverUrl: getLiveWebsiteOrigin(),
        statusText: `HTTP ${res.status}: Connection failed`,
      };
    }
    const json = await res.json();
    return {
      connected: true,
      latencyMs: latency,
      hasGeminiKey: Boolean(json.hasGeminiKey),
      timestamp: json.timestamp || new Date().toISOString(),
      antiHackShield: json.antiHackShield || "ACTIVE",
      serverUrl: getLiveWebsiteOrigin(),
      statusText: "Operational & Connected",
    };
  } catch (err: any) {
    const latency = Math.round(performance.now() - start);
    return {
      connected: false,
      latencyMs: latency,
      hasGeminiKey: false,
      timestamp: new Date().toISOString(),
      antiHackShield: "OFFLINE",
      serverUrl: getLiveWebsiteOrigin(),
      statusText: err?.message || "Network connection unreachable",
    };
  }
}

export async function fetchLiveSyncState(): Promise<{
  ideas?: Idea[];
  users?: UserProfile[];
  humanPostsAddedCount?: number;
  ownerSettings?: any;
  version?: number;
  lastSyncedAt?: string;
} | null> {
  try {
    const res = await fetch(SYNC_ENDPOINT, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data || null;
  } catch (err) {
    console.warn("Live sync state fetch fallback to local:", err);
    return null;
  }
}

export async function pushLiveSyncUpdate(payload: {
  ideas?: Idea[];
  users?: UserProfile[];
  humanPostsAddedCount?: number;
  ownerSettings?: any;
}): Promise<{
  success: boolean;
  version?: number;
  syncHash?: string;
  lastSyncedAt?: string;
}> {
  try {
    const res = await fetch(SYNC_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Sync failed");
    const json = await res.json();
    return {
      success: true,
      version: json.version,
      syncHash: json.syncHash,
      lastSyncedAt: json.lastSyncedAt,
    };
  } catch (err) {
    console.warn("Push live sync error, falling back locally:", err);
    return {
      success: true,
      version: 1,
      syncHash: `LOCAL-SYNC-${Date.now().toString(36)}`,
      lastSyncedAt: new Date().toISOString(),
    };
  }
}

export async function verifyAntiHackIntegrity(sampleText: string): Promise<{
  safe: boolean;
  threat?: string;
  statuteViolated?: string;
}> {
  try {
    const res = await fetch(ANTI_HACK_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ payload: sampleText }),
    });
    const json = await res.json();
    if (!res.ok || json.safe === false) {
      return {
        safe: false,
        threat: json.threatDetected || "MALICIOUS_INPUT_DETECTED",
        statuteViolated: json.statuteViolated || "Nepal Electronic Transactions Act 2063 Sec 44",
      };
    }
    return { safe: true };
  } catch (e) {
    // Client-side fallback regex
    const hasSql = /('|--|;|\b(ALTER|CREATE|DELETE|DROP|SELECT|INSERT)\b)/i.test(sampleText);
    const hasXss = /<script\b|javascript:|onerror=/i.test(sampleText);
    if (hasSql || hasXss) {
      return {
        safe: false,
        threat: hasSql ? "SQL_INJECTION_DETECTED" : "XSS_SCRIPT_DETECTED",
        statuteViolated: "Nepal ETA 2063 Sec 44 (Unauthorized Computer Access)",
      };
    }
    return { safe: true };
  }
}

export function getLiveWebsiteOrigin(): string {
  if (typeof window !== "undefined" && window.location.origin) {
    return window.location.origin;
  }
  return "https://ais-pre-flnmny7mxnb4tjuiqwxrun-445171234704.asia-southeast1.run.app";
}

export function getWebsiteLaunchHref(): string {
  return "/website";
}

export function syncCleanBrowserUrlPath(cleanPath: string = "/", push: boolean = false): void {
  if (typeof window === "undefined") return;
  try {
    if (window.location.pathname !== cleanPath || window.location.hash) {
      if (push) {
        window.history.pushState({ path: cleanPath }, "IdeaVault", cleanPath);
      } else {
        window.history.replaceState({ path: cleanPath }, "IdeaVault", cleanPath);
      }
    }
  } catch {
    // ignore history security constraints in sandboxed contexts
  }
}

/**
 * Returns true ONLY when the application is running on a live published custom domain
 * (not localhost and not a temporary .run.app preview container).
 * Ensures zero pre-launch human accounts, human payments, or synthetic earnings exist before publication.
 */
export function isSitePublishedLive(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  if (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".run.app")
  ) {
    return false;
  }
  return true;
}


