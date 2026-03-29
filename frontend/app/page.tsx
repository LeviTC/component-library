"use client";
import { useState } from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  PlusIcon,
  type ModalSize,
} from "@/components/library";

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<ModalSize>("md");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-10 bg-white p-6">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button
          variant="primary"
          // disabled={true}
          onClick={() => alert("Primary button clicked")}
        >
          Primary
        </Button>

        <Button
          variant="secondary"
          // loading={true}
          onClick={() => alert("Secondary button clicked")}
        >
          Secondary
        </Button>
        <Button variant="danger" onClick={() => alert("Danger button clicked")}>
          Danger
        </Button>

        <Button
          variant="primary"
          startIcon={<PlusIcon />}
          onClick={() => alert("Botón con icono")}
        >
          Con icono
        </Button>
      </div>

      <div className="flex w-full max-w-4xl flex-wrap items-end justify-center gap-3">
        <Input
          label="Texto"
          type="text"
          name="demo-text"
          placeholder="Escribe algo…"
          validationState="default"
        />
        <Input
          label="Email"
          type="email"
          name="demo-email"
          placeholder="correo@ejemplo.com"
          validationState="error"
          message="Formato de email no válido"
          defaultValue="no-es-email"
        />
        <Input
          label="Contraseña"
          type="password"
          name="demo-password"
          placeholder=""
          validationState="success"
          message="Contraseña segura"
        />
        <Input
          label="Deshabilitado"
          type="text"
          name="demo-disabled"
          placeholder="No editable"
          disabled
        />
      </div>

      <div className="w-full max-w-6xl">
        <p className="mb-4 text-center font-mono text-sm font-bold text-neutral-800">
          Card (bordes + imagen opcional)
        </p>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <Card
            borderVariant="solid"
            tone="primary"
            header="Sólido · tone primary"
            footer={<Button size="sm" variant="primary">Acción</Button>}
          >
            <p className="m-0">
              Prop <code className="font-bold">tone</code>: <code className="font-bold">primary</code> |{" "}
              <code className="font-bold">secondary</code> | <code className="font-bold">danger</code>.
            </p>
          </Card>
          <Card borderVariant="thick" tone="secondary" header="Thick · tone secondary">
            <p className="m-0">
              Variante <code className="font-bold">thick</code> con segunda sombra en amarillo.
            </p>
          </Card>
          <Card borderVariant="double" tone="danger" header="Double · tone danger" footer={<Button size="sm" variant="secondary">Más</Button>}>
            <p className="m-0">
              Variante <code className="font-bold">double</code> y sombra en rojo.
            </p>
          </Card>
          <Card
            tone="secondary"
            imageSrc="https://picsum.photos/seed/brutalist-card/600/340"
            imageAlt="Imagen de ejemplo"
            header="Imagen · tone secondary"
            footer={<Button size="sm" variant="danger">Ver</Button>}
          >
            <p className="m-0">
              <code className="font-bold">imageSrc</code> / <code className="font-bold">image</code> arriba del header.
            </p>
          </Card>
        </div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-center font-mono text-sm font-bold text-neutral-800">
          Modal (sm / md / lg)
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button
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
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={`Modal ${modalSize.toUpperCase()}`}
        size={modalSize}
        footer={
          <>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Aceptar
            </Button>
          </>
        }
      >
        <p className="m-0 font-mono">
          Cuerpo del modal: header, contenido y footer configurables. Cierra con
          la X, pulsando fuera (overlay) o la tecla Escape.
        </p>
      </Modal>
    </div>
  );
}
