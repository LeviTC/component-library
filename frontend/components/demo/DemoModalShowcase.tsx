"use client";

import { useState } from "react";
import { Button, Modal, type ModalSize } from "@/components/library";

export function DemoModalShowcase() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<ModalSize>("md");
  const closeDemoModal = () => setModalOpen(false);

  return (
    <>
      <section
        className="mx-auto flex w-full max-w-6xl flex-col items-center gap-3"
        aria-labelledby="modal-heading"
      >
        <h2
          id="modal-heading"
          className="m-0 text-center font-mono text-sm font-bold text-neutral-800"
        >
          Modal — tamaños sm / md / lg
        </h2>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            id="demo-modal-open-sm"
            variant="secondary"
            size="sm"
            onClick={() => {
              setModalSize("sm");
              setModalOpen(true);
            }}
          >
            Pequeño
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
            Mediano
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
            Grande
          </Button>
        </div>
      </section>

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
        <p className="m-0 font-mono text-sm">
          Header, cuerpo y footer configurables. Cierra con la X, pulsando fuera
          del diálogo (overlay) o la tecla Escape.
        </p>
      </Modal>
    </>
  );
}
