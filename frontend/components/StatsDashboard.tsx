"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/library";
import {
  fetchComponentsStats,
  type ComponentsStats,
} from "@/lib/components-stats-api";
import {
  useComponentAnalytics,
  type ComponentTrackPayload,
} from "@/lib/component-analytics-context";
import { mergeComponentsStatsOptimistic } from "@/lib/merge-components-stats";
import { getAuthToken } from "@/lib/auth-storage";
import { downloadTrackingExport } from "@/lib/export-tracking";
import { StatsDashboardSkeleton } from "@/components/StatsDashboardSkeleton";

const STATS_POLL_MS = 4000;

export type StatsDashboardProps = {
  onNeedsAuthForExport: () => void;
};

export function StatsDashboard({ onNeedsAuthForExport }: StatsDashboardProps) {
  const analytics = useComponentAnalytics();
  const [stats, setStats] = useState<ComponentsStats | null>(null);
  const [pendingOptimistic, setPendingOptimistic] = useState<
    ComponentTrackPayload[]
  >([]);
  const statsRef = useRef<ComponentsStats | null>(null);
  const pendingRef = useRef<ComponentTrackPayload[]>([]);
  const fetchSeqRef = useRef(0);
  statsRef.current = stats;
  pendingRef.current = pendingOptimistic;
  const [statsError, setStatsError] = useState<string | null>(null);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const [buttonLoading, setButtonLoading] = useState<"csv" | "json" | null>(
    null,
  );

  const handleExport = async (format: "csv" | "json") => {
    setExportMsg(null);
    setButtonLoading(format);
    try {
      await downloadTrackingExport(format);
    } catch (e) {
      setExportMsg(e instanceof Error ? e.message : "Error al exportar");
    } finally {
      setButtonLoading(null);
    }
  };

  const requestExport = (format: "csv" | "json") => {
    if (!getAuthToken()) {
      onNeedsAuthForExport();
      return;
    }
    void handleExport(format);
  };

  useEffect(() => {
    if (!analytics) return;
    return analytics.subscribe((payload) => {
      setPendingOptimistic((prev) => [...prev, payload]);
    });
  }, [analytics]);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      const seq = ++fetchSeqRef.current;
      void fetchComponentsStats()
        .then((s) => {
          if (cancelled || seq !== fetchSeqRef.current) return;

          const prev = statsRef.current;
          const pend = pendingRef.current;
          const prevServer = prev?.totalEvents ?? 0;
          const minServerTotal = prevServer + pend.length;

          if (
            prev !== null &&
            pend.length > 0 &&
            s.totalEvents < minServerTotal
          ) {
            return;
          }

          if (pend.length === 0) {
            setPendingOptimistic([]);
          } else if (
            prev !== null &&
            s.totalEvents >= prevServer + pend.length
          ) {
            setPendingOptimistic([]);
          }

          setStats(s);
          setStatsError(null);
        })
        .catch((e: unknown) => {
          if (cancelled || seq !== fetchSeqRef.current) return;
          setStatsError(e instanceof Error ? e.message : "Error de red");
        });
    };
    load();
    const id = setInterval(load, STATS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const displayStats = useMemo(
    () => mergeComponentsStatsOptimistic(stats, pendingOptimistic),
    [stats, pendingOptimistic],
  );

  return (
    <section
      className="mx-auto w-full max-w-6xl rounded border-4 border-neutral-900 bg-amber-50 p-4 shadow-[6px_6px_0_0_#171717] sm:p-6"
      aria-labelledby="stats-heading"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h2
          id="stats-heading"
          className="m-0 font-mono text-lg font-bold text-neutral-900"
        >
          Estadísticas en tiempo real
        </h2>
        <div className="flex flex-wrap gap-2">
          <Button
            id="stats-export-csv"
            variant="primary"
            size="sm"
            onClick={() => requestExport("csv")}
            loading={buttonLoading === "csv"}
          >
            Exportar CSV
          </Button>
          <Button
            id="stats-export-json"
            variant="secondary"
            size="sm"
            onClick={() => requestExport("json")}
            loading={buttonLoading === "json"}
          >
            Exportar JSON
          </Button>
        </div>
      </div>
      {exportMsg ? (
        <p className="m-0 mb-3 font-mono text-sm text-red-800" role="alert">
          {exportMsg}
        </p>
      ) : null}

      {displayStats ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717]">
            <p className="m-0 text-xs font-bold uppercase text-neutral-500">
              Total interacciones
            </p>
            <p className="m-0 mt-1 text-3xl font-bold tabular-nums text-neutral-900">
              {displayStats.totalEvents}
            </p>
            <p className="m-0 mt-2 text-xs text-neutral-600">
              Actualizado:{" "}
              {new Date(displayStats.updatedAt).toLocaleTimeString("es", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>
          <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717] sm:col-span-2 lg:col-span-1">
            <p className="m-0 text-xs font-bold uppercase text-neutral-500">
              Último evento
            </p>
            {displayStats.lastEvent ? (
              <ul className="m-0 mt-2 list-none space-y-1 p-0 text-sm text-neutral-800">
                <li>
                  <span className="font-bold">
                    {displayStats.lastEvent.componentName}
                  </span>{" "}
                  · {displayStats.lastEvent.action}
                  {displayStats.lastEvent.variant != null &&
                  displayStats.lastEvent.variant !== ""
                    ? ` · ${displayStats.lastEvent.variant}`
                    : ""}
                </li>
                <li className="text-xs text-neutral-600">
                  {new Date(displayStats.lastEvent.at).toLocaleString("es")}
                </li>
              </ul>
            ) : (
              <p className="m-0 mt-2 text-sm text-neutral-600">
                Aún no hay eventos registrados.
              </p>
            )}
          </div>
          <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717] sm:col-span-2 lg:col-span-2">
            <p className="m-0 text-xs font-bold uppercase text-neutral-500">
              Por componente
            </p>
            <ul className="m-0 mt-2 max-h-32 list-none space-y-1 overflow-auto p-0 text-sm">
              {displayStats.byComponent.length === 0 ? (
                <li className="text-neutral-600">—</li>
              ) : (
                displayStats.byComponent.map((row) => (
                  <li
                    key={row.name}
                    className="flex justify-between gap-2 border-b border-neutral-200 pb-1"
                  >
                    <span>{row.name}</span>
                    <span className="tabular-nums font-bold">{row.count}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
          <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717] lg:col-span-1">
            <p className="m-0 text-xs font-bold uppercase text-neutral-500">
              Por acción
            </p>
            <ul className="m-0 mt-2 max-h-32 list-none space-y-1 overflow-auto p-0 text-sm">
              {displayStats.byAction.length === 0 ? (
                <li className="text-neutral-600">—</li>
              ) : (
                displayStats.byAction.map((row) => (
                  <li
                    key={row.action}
                    className="flex justify-between gap-2 border-b border-neutral-200 pb-1"
                  >
                    <span>{row.action}</span>
                    <span className="tabular-nums font-bold">{row.count}</span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      ) : !statsError ? (
        <StatsDashboardSkeleton />
      ) : null}
      <p className="m-0 mt-4 font-mono text-xs text-neutral-600">
        Descarga el historial de tracking en CSV o JSON con los botones de esta
        sección (requiere haber iniciado sesión).
      </p>
    </section>
  );
}
