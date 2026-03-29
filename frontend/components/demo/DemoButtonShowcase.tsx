"use client";

import { Button, PlusIcon } from "@/components/library";
import { DemoSection, DemoSubBlock } from "@/components/demo/DemoSection";

export function DemoButtonShowcase() {
  return (
    <DemoSection
      id="btn-heading"
      eyebrow="01 · Button"
      title="Variantes, estados e iconos"
      description="Tres variantes de color, estado de carga, deshabilitado y botón con icono a la izquierda."
      tone="lime"
    >
      <div className="flex flex-col gap-8">
        <DemoSubBlock label="Variantes" hint="primary · secondary · danger">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              id="demo-btn-primary"
              variant="primary"
              onClick={() => {
                /* demo */
              }}
            >
              Primary
            </Button>
            <Button
              id="demo-btn-secondary"
              variant="secondary"
              onClick={() => {
                /* demo */
              }}
            >
              Secondary
            </Button>
            <Button
              id="demo-btn-danger"
              variant="danger"
              onClick={() => {
                /* demo */
              }}
            >
              Danger
            </Button>
          </div>
        </DemoSubBlock>
        <DemoSubBlock label="Estados especiales" hint="loading · disabled">
          <div className="flex flex-wrap items-center gap-3">
            <Button id="demo-btn-loading" variant="secondary" loading>
              Cargando…
            </Button>
            <Button id="demo-btn-disabled" variant="danger" disabled>
              Deshabilitado
            </Button>
          </div>
        </DemoSubBlock>
        <DemoSubBlock label="Con icono" hint="startIcon">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              id="demo-btn-icon"
              variant="primary"
              startIcon={<PlusIcon />}
              onClick={() => {}}
            >
              Añadir
            </Button>
          </div>
        </DemoSubBlock>
      </div>
    </DemoSection>
  );
}
