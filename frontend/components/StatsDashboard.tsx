"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/library";
import {
  fetchComponentsStats,
  type ComponentsStats,
} from "@/lib/components-stats-api";
import { getAuthToken } from "@/lib/auth-storage";
import { downloadTrackingExport } from "@/lib/export-tracking";

const STATS_POLL_MS = 4000;

export type StatsDashboardProps = {
  onNeedsAuthForExport: () => void;
};

export function StatsDashboard({ onNeedsAuthForExport }: StatsDashboardProps) {
  const [stats, setStats] = useState<ComponentsStats | null>(null);
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
    let cancelled = false;
    const load = () => {
      void fetchComponentsStats()
        .then((s) => {
          if (!cancelled) {
            setStats(s);
            setStatsError(null);
          }
        })
        .catch((e: unknown) => {
          if (!cancelled) {
            setStatsError(e instanceof Error ? e.message : "Error de red");
          }
        });
    };
    load();
    const id = setInterval(load, STATS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

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
      {statsError ? (
        <p className="m-0 font-mono text-sm text-red-800" role="alert">
          {statsError} — comprueba que el backend esté en marcha y{" "}
          <code className="rounded bg-white px-1">NEXT_PUBLIC_API_URL</code>{" "}
          sea correcto.
        </p>
      ) : null}

      {stats ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717]">
            <p className="m-0 text-xs font-bold uppercase text-neutral-500">
              Total interacciones
            </p>
            <p className="m-0 mt-1 text-3xl font-bold tabular-nums text-neutral-900">
              {stats.totalEvents}
            </p>
            <p className="m-0 mt-2 text-xs text-neutral-600">
              Actualizado:{" "}
              {new Date(stats.updatedAt).toLocaleTimeString("es", {
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
            {stats.lastEvent ? (
              <ul className="m-0 mt-2 list-none space-y-1 p-0 text-sm text-neutral-800">
                <li>
                  <span className="font-bold">
                    {stats.lastEvent.componentName}
                  </span>{" "}
                  · {stats.lastEvent.action}
                  {stats.lastEvent.variant != null &&
                  stats.lastEvent.variant !== ""
                    ? ` · ${stats.lastEvent.variant}`
                    : ""}
                </li>
                <li className="text-xs text-neutral-600">
                  {new Date(stats.lastEvent.at).toLocaleString("es")}
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
              {stats.byComponent.length === 0 ? (
                <li className="text-neutral-600">—</li>
              ) : (
                stats.byComponent.map((row) => (
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
              {stats.byAction.length === 0 ? (
                <li className="text-neutral-600">—</li>
              ) : (
                stats.byAction.map((row) => (
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
        <p className="m-0 font-mono text-sm text-neutral-600">Cargando…</p>
      ) : null}
      <p className="m-0 mt-4 font-mono text-xs text-neutral-600">
        Descarga el historial de tracking en CSV o JSON con los botones de esta
        sección (requiere haber iniciado sesión).
      </p>
    </section>
  );
}
