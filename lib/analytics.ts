// lib/analytics.ts
"use client";

type Props = Record<string, unknown>;
type Queued = { event: string; props: Props; ts: string; path: string };

let timer: number | null = null;
let queue: Queued[] = [];
let bound = false;

function getPath() {
  try {
    return window.location.pathname + window.location.search;
  } catch {
    return "";
  }
}

function canBeacon() {
  return (
    typeof navigator !== "undefined" &&
    typeof navigator.sendBeacon === "function" &&
    typeof Blob !== "undefined"
  );
}

function send(payload: unknown): boolean {
  // Prefer beacon (survives unload better)
  if (canBeacon()) {
    try {
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      return navigator.sendBeacon("/api/track", blob);
    } catch {
      // fall through
    }
  }

  // Fallback fetch (keepalive helps)
  try {
    fetch("/api/track", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
    return true;
  } catch {
    return false;
  }
}

function flushNow(reason: "timer" | "pagehide" | "visibilitychange") {
  if (!queue.length) return;

  const batch = queue.slice();
  queue = [];

  const payload = {
    batch,
    ts: new Date().toISOString(),
    reason,
  };

  send(payload);
}

function scheduleFlush() {
  if (timer) window.clearTimeout(timer);
  timer = window.setTimeout(() => {
    timer = null;
    flushNow("timer");
  }, 250);
}

function bindLifecycleFlush() {
  if (bound) return;
  bound = true;

  // Flush when tab is backgrounded
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flushNow("visibilitychange");
  });

  // Flush when navigating away / closing
  window.addEventListener("pagehide", () => flushNow("pagehide"));
}

export function track(event: string, props: Props = {}) {
  try {
    if (typeof window !== "undefined") bindLifecycleFlush();

    queue.push({
      event,
      props,
      ts: new Date().toISOString(),
      path: getPath(),
    });

    scheduleFlush();
  } catch {
    // no-op
  }
}
