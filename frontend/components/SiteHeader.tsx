"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/library";
import { logoutApi } from "@/lib/auth-api";
import { getAuthToken } from "@/lib/auth-storage";
import { downloadTrackingExport } from "@/lib/export-tracking";

function subscribeToStorage(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export default function SiteHeader() {
  usePathname();
  const router = useRouter();
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  /** Re-render tras logout en la misma ruta (`storage` no dispara en la misma pestaña). */
  const [authEpoch, bumpAuthEpoch] = useState(0);

  const loggedIn = useSyncExternalStore(
    subscribeToStorage,
    () => !!getAuthToken(),
    () => false,
  );
  void authEpoch;

  const handleLogout = async () => {
    await logoutApi();
    bumpAuthEpoch((n) => n + 1);
    router.push("/");
    router.refresh();
  };

  const handleExport = async (format: "csv" | "json") => {
    setExportMsg(null);
    try {
      await downloadTrackingExport(format);
    } catch (e) {
      setExportMsg(e instanceof Error ? e.message : "Error al exportar");
    }
  };

  return (
    <header className="sticky top-0 z-40 border-b-4 border-neutral-900 bg-white px-4 py-3 shadow-[4px_4px_0_0_#171717]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap items-center gap-2 font-mono text-sm font-bold">
          <Link
            href="/"
            className="rounded border-2 border-neutral-900 bg-white px-3 py-1.5 text-neutral-900 shadow-[3px_3px_0_0_#171717] transition hover:translate-x-px hover:translate-y-px hover:shadow-[2px_2px_0_0_#171717]"
          >
            Demo
          </Link>
          {!loggedIn ? (
            <>
              <Link
                href="/login"
                className="rounded border-2 border-neutral-900 px-3 py-1.5 text-neutral-900 hover:bg-neutral-100"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/register"
                className="rounded border-2 border-neutral-900 px-3 py-1.5 text-neutral-900 hover:bg-neutral-100"
              >
                Registro
              </Link>
            </>
          ) : (
            <>
              <span className="hidden text-neutral-600 sm:inline">
                Sesión activa
              </span>
              <Button
                id="nav-logout"
                variant="secondary"
                size="sm"
                onClick={handleLogout}
              >
                Cerrar sesión
              </Button>
              <Button
                id="nav-export-csv"
                variant="primary"
                size="sm"
                onClick={() => void handleExport("csv")}
              >
                Exportar CSV
              </Button>
              <Button
                id="nav-export-json"
                variant="primary"
                size="sm"
                onClick={() => void handleExport("json")}
              >
                Exportar JSON
              </Button>
            </>
          )}
        </nav>
        {exportMsg ? (
          <p className="m-0 w-full font-mono text-xs text-red-700 sm:w-auto">
            {exportMsg}
          </p>
        ) : null}
      </div>
    </header>
  );
}
