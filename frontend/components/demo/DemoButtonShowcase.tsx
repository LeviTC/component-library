"use client";

import { Button, PlusIcon } from "@/components/library";

export function DemoButtonShowcase() {
  return (
    <section
      className="mx-auto flex w-full max-w-6xl flex-col gap-4"
      aria-labelledby="btn-heading"
    >
      <h2
        id="btn-heading"
        className="m-0 text-center font-mono text-sm font-bold text-neutral-800"
      >
        Button — variantes, estados e iconos
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-3">
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
        <Button
          id="demo-btn-icon"
          variant="primary"
          startIcon={<PlusIcon />}
          onClick={() => {}}
        >
          Con icono
        </Button>
        <Button id="demo-btn-loading" variant="secondary" loading>
          Cargando…
        </Button>
        <Button id="demo-btn-disabled" variant="danger" disabled>
          Deshabilitado
        </Button>
      </div>
    </section>
  );
}
