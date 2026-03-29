"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { getApiBaseUrl } from "./api-config";

export interface ComponentTrackPayload {
  componentName: string;
  variant?: string;
  action: string;
  metadata?: Record<string, unknown>;
}

type Ctx = {
  track: (payload: ComponentTrackPayload) => void;
};

const ComponentAnalyticsContext = createContext<Ctx | null>(null);

export function ComponentAnalyticsProvider({ children }: { children: ReactNode }) {
  const track = useCallback((payload: ComponentTrackPayload) => {
    const base = getApiBaseUrl();
    void fetch(`${base}/api/components/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
    });
  }, []);

  const value = useMemo(() => ({ track }), [track]);

  return (
    <ComponentAnalyticsContext.Provider value={value}>
      {children}
    </ComponentAnalyticsContext.Provider>
  );
}

export function useComponentAnalytics(): Ctx | null {
  return useContext(ComponentAnalyticsContext);
}
