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
    <div className="flex min-h-screen flex-col gap-10 bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="m-0 mb-2 font-mono text-2xl font-bold text-neutral-900 sm:text-3xl">
          Component Library — Demo
        </h1>
        <p className="m-0 max-w-3xl font-mono text-sm text-neutral-600">
          Interactúa con los componentes: el tracking se envía al API de forma
          transparente. Las estadísticas se actualizan automáticamente cada pocos
          segundos.
        </p>
      </div>

      <StatsDashboard
        onNeedsAuthForExport={() => setExportAuthModalOpen(true)}
      />

      <DemoButtonShowcase />
      <DemoInputShowcase />
      <DemoCardShowcase />
      <DemoModalShowcase />

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
