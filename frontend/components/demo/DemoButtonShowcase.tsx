"use client";

import { Button, ChevronRightIcon, PlusIcon } from "@/components/library";
import { DemoSection, DemoSubBlock } from "@/components/demo/DemoSection";

export function DemoButtonShowcase() {
  return (
    <DemoSection
      id="btn-heading"
      eyebrow="01 · Button"
      title="Variantes, tamaños e iconos"
      description="Variantes primary, secondary y danger en sm, md y lg; estados loading y disabled; startIcon y endIcon."
      tone="lime"
    >
      <div className="flex flex-col gap-8">
        <DemoSubBlock
          label="Variantes y tamaños"
          hint="primary · secondary · danger × sm · md · lg"
        >
          <div className="flex flex-col gap-4">
            {(["sm", "md", "lg"] as const).map((size) => (
              <div
                key={size}
                className="flex flex-wrap items-center gap-3 border-b border-neutral-200 pb-4 last:border-b-0 last:pb-0 sm:gap-4"
              >
                <span
                  className="min-w-9 font-mono text-xs font-bold uppercase tabular-nums text-neutral-500"
                  title={`Tamaño ${size}`}
                >
                  {size}
                </span>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    id={`demo-btn-primary-${size}`}
                    variant="primary"
                    size={size}
                    onClick={() => undefined}
                  >
                    Primary
                  </Button>
                  <Button
                    id={`demo-btn-secondary-${size}`}
                    variant="secondary"
                    size={size}
                    onClick={() => undefined}
                  >
                    Secondary
                  </Button>
                  <Button
                    id={`demo-btn-danger-${size}`}
                    variant="danger"
                    size={size}
                    onClick={() => undefined}
                  >
                    Danger
                  </Button>
                </div>
              </div>
            ))}
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
        <DemoSubBlock label="Con iconos" hint="startIcon · endIcon">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              id="demo-btn-icon-start"
              variant="primary"
              startIcon={<PlusIcon />}
              onClick={() => {}}
            >
              Añadir
            </Button>
            <Button
              id="demo-btn-icon-end"
              variant="secondary"
              endIcon={<ChevronRightIcon />}
              onClick={() => {}}
            >
              Continuar
            </Button>
            <Button
              id="demo-btn-icon-both"
              variant="danger"
              size="sm"
              startIcon={<PlusIcon />}
              endIcon={<ChevronRightIcon />}
              onClick={() => {}}
            >
              Ambos
            </Button>
          </div>
        </DemoSubBlock>
      </div>
    </DemoSection>
  );
}
