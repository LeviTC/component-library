"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useSyncExternalStore } from "react";
import { Button } from "@/components/library";
import { logoutApi } from "@/lib/auth-api";
import { getAuthToken } from "@/lib/auth-storage";

function subscribeToStorage(onChange: () => void) {
  if (typeof window === "undefined") return () => {};
  window.addEventListener("storage", onChange);
  return () => window.removeEventListener("storage", onChange);
}

export default function SiteHeader() {
  usePathname();
  const router = useRouter();
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

  return (
    <header className="sticky top-0 z-40 border-b-4 border-neutral-900 bg-white px-4 py-3 shadow-[4px_4px_0_0_#171717]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3">
        <nav className="flex flex-wrap items-center gap-2 font-mono text-sm font-bold">
          <Button
            onClick={() => router.push("/")}
            size="sm"
            variant="primary"
          >
            Demo
          </Button>
          {!loggedIn ? (
            <>
              <Button
                onClick={() => router.push("/login")}
                size="sm"
                variant="secondary"
              >
                Iniciar sesión
              </Button>
              <Button
                onClick={() => router.push("/register")}
                size="sm"
                variant="secondary"
              >
                Registro
              </Button>
            </>
          ) : (
            <>
              <Button
                id="nav-logout"
                variant="secondary"
                size="sm"
                onClick={handleLogout}
                className="ml-2"
              >
                Cerrar sesión
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
