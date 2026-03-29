"use client";

import { useState } from "react";
import { Button, Modal, type ModalSize } from "@/components/library";
import { DemoSection, DemoSubBlock } from "@/components/demo/DemoSection";

export function DemoModalShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<ModalSize>("md");
  const closeDemoModal = () => setModalOpen(false);

  return (
    <>
      <DemoSection
        id="modal-heading"
        eyebrow="04 · Modal"
        title="Tamaños y cierre accesible"
        description="Diálogo con overlay, foco atrapado, tecla Escape y tres anchos predefinidos: sm, md y lg."
        tone="orange"
      >
        <DemoSubBlock
          label="Abrir ejemplo"
          hint="elige un tamaño"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              <Button
                id="demo-modal-open-sm"
                variant="secondary"
                size="sm"
                onClick={() => {
                  setModalSize("sm");
                  setModalOpen(true);
                }}
              >
                Pequeño (sm)
              </Button>
              <Button
                id="demo-modal-open-md"
                variant="primary"
                size="sm"
                onClick={() => {
                  setModalSize("md");
                  setModalOpen(true);
                }}
              >
                Mediano (md)
              </Button>
              <Button
                id="demo-modal-open-lg"
                variant="danger"
                size="sm"
                onClick={() => {
                  setModalSize("lg");
                  setModalOpen(true);
                }}
              >
                Grande (lg)
              </Button>
            </div>
            <p className="m-0 max-w-md font-mono text-xs leading-relaxed text-neutral-600">
              Cierra con la X, clic fuera (overlay) o{" "}
              <kbd className="rounded border border-neutral-400 bg-neutral-100 px-1.5 py-0.5 font-mono text-[10px] font-bold text-neutral-800">
                Esc
              </kbd>
              . El tracking registra el cierre.
            </p>
          </div>
        </DemoSubBlock>
      </DemoSection>

      <Modal
        open={modalOpen}
        onClose={closeDemoModal}
        title={`Modal ${modalSize.toUpperCase()}`}
        size={modalSize}
        footer={
          <>
            <Button
              id="demo-modal-cancel"
              variant="secondary"
              onClick={closeDemoModal}
            >
              Cancelar
            </Button>
            <Button
              id="demo-modal-accept"
              variant="primary"
              onClick={closeDemoModal}
            >
              Aceptar
            </Button>
          </>
        }
      >
        <p className="m-0 font-mono text-sm leading-relaxed">
          Header, cuerpo y footer configurables. Este bloque representa el
          contenido principal del diálogo.
        </p>
      </Modal>
    </>
  );
}
