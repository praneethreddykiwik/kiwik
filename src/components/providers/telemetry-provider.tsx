"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function TelemetryProvider() {
  const pathname = usePathname();
  const sessionIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Get or initialize persistent session ID for current browser tab/window
    let sessId = sessionStorage.getItem("kiwik_visitor_session");
    if (!sessId) {
      sessId = `sess_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      sessionStorage.setItem("kiwik_visitor_session", sessId);
    }
    sessionIdRef.current = sessId;

    const userAgent = navigator.userAgent;
    const isMobile = /Mobile|Android|iPhone|iPod/i.test(userAgent);
    const isTablet = /Tablet|iPad/i.test(userAgent);
    const deviceType = isMobile ? "mobile" : isTablet ? "tablet" : "desktop";

    let browserName = "Chrome";
    if (userAgent.includes("Firefox")) browserName = "Firefox";
    else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) browserName = "Safari";
    else if (userAgent.includes("Edg")) browserName = "Edge";

    const sendPing = () => {
      if (!sessionIdRef.current) return;
      fetch("/api/visitors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: sessionIdRef.current,
          pathname: pathname || "/",
          deviceType,
          browserName
        })
      }).catch(() => {});
    };

    // Initial ping on route load
    sendPing();

    // 15-second heartbeat ping while tab is active
    const interval = setInterval(sendPing, 15000);

    return () => clearInterval(interval);
  }, [pathname]);

  return null;
}
