"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Modal } from "@/components/library";
import { DemoButtonShowcase } from "@/components/demo/DemoButtonShowcase";
import { DemoCardShowcase } from "@/components/demo/DemoCardShowcase";
import { DemoInputShowcase } from "@/components/demo/DemoInputShowcase";
import { DemoModalShowcase } from "@/components/demo/DemoModalShowcase";
import { StatsDashboard } from "@/components/StatsDashboard";

export default function Home() {
  const router = useRouter();
  const [exportAuthModalOpen, setExportAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[linear-gradient(165deg,#f8fafc_0%,#eef2ff_35%,#fff7ed_70%,#fafafa_100%)] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-12">
        <header className="relative overflow-hidden rounded border-4 border-neutral-900 bg-white px-6 py-8 shadow-[10px_10px_0_0_#171717] sm:px-10 sm:py-10">
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border-4 border-neutral-900 bg-amber-200 opacity-90 sm:h-40 sm:w-40"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute bottom-4 right-16 h-3 w-24 rotate-[-8deg] bg-neutral-900 sm:w-32"
            aria-hidden
          />
          <p className="m-0 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-600">
            Examen técnico
          </p>
          <h1 className="m-0 mt-2 max-w-2xl font-mono text-3xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-4xl">
            Component Library — Demo
          </h1>
          <p className="m-0 mt-4 max-w-2xl font-mono text-sm leading-relaxed text-neutral-700">
            Interactúa con los componentes: el tracking se envía al API de forma
            transparente. Las estadísticas se actualizan solas cada pocos
            segundos; exporta CSV/JSON tras iniciar sesión.
          </p>
        </header>

        <StatsDashboard
          onNeedsAuthForExport={() => setExportAuthModalOpen(true)}
        />

        <DemoButtonShowcase />
        <DemoInputShowcase />
        <DemoCardShowcase />
        <DemoModalShowcase />
      </div>

      <Modal
        open={exportAuthModalOpen}
        onClose={() => setExportAuthModalOpen(false)}
        title="Exportar tracking"
        size="md"
        footer={
          <>
            <Button
              id="export-auth-close"
              variant="secondary"
              onClick={() => setExportAuthModalOpen(false)}
            >
              Cerrar
            </Button>
            <Button
              id="export-auth-register"
              variant="secondary"
              onClick={() => {
                setExportAuthModalOpen(false);
                router.push("/register");
              }}
            >
              Registrarme
            </Button>
            <Button
              id="export-auth-login"
              variant="primary"
              onClick={() => {
                setExportAuthModalOpen(false);
                router.push("/login");
              }}
            >
              Iniciar sesión
            </Button>
          </>
        }
      >
        <p className="m-0 font-mono text-sm leading-relaxed text-neutral-800">
          Para descargar el historial en <strong>CSV</strong> o{" "}
          <strong>JSON</strong> necesitas una cuenta. Inicia sesión o
          regístrate; después podrás usar de nuevo los botones de exportar en esta
          sección.
        </p>
      </Modal>
    </div>
  );
}
