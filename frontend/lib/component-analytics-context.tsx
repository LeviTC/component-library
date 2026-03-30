"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from "react";
import { getApiBaseUrl } from "./api-config";

export interface ComponentTrackPayload {
  componentName: string;
  variant?: string;
  action: string;
  metadata?: Record<string, unknown>;
}

type TrackListener = (payload: ComponentTrackPayload) => void;

type Ctx = {
  track: (payload: ComponentTrackPayload) => void;
  /** Suscripción síncrona antes del POST (p. ej. UI optimista). */
  subscribe: (listener: TrackListener) => () => void;
};

const ComponentAnalyticsContext = createContext<Ctx | null>(null);

export function ComponentAnalyticsProvider({ children }: { children: ReactNode }) {
  const listenersRef = useRef(new Set<TrackListener>());

  const subscribe = useCallback((listener: TrackListener) => {
    listenersRef.current.add(listener);
    return () => listenersRef.current.delete(listener);
  }, []);

  const track = useCallback((payload: ComponentTrackPayload) => {
    listenersRef.current.forEach((listener) => {
      try {
        listener(payload);
      } catch {
        /* no romper el tracking si un suscriptor falla */
      }
    });
    const base = getApiBaseUrl();
    void fetch(`${base}/api/components/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    }).catch(() => {
    });
  }, []);

  const value = useMemo(() => ({ track, subscribe }), [track, subscribe]);

  return (
    <ComponentAnalyticsContext.Provider value={value}>
      {children}
    </ComponentAnalyticsContext.Provider>
  );
}

export function useComponentAnalytics(): Ctx | null {
  return useContext(ComponentAnalyticsContext);
}
