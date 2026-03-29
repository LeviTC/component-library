"use client";

import { Input } from "@/components/library";
import { DemoSection, DemoSubBlock } from "@/components/demo/DemoSection";

export function DemoInputShowcase() {
  return (
    <DemoSection
      id="input-heading"
      eyebrow="02 · Input"
      title="Tipos, validación y accesibilidad"
      description="Etiquetas visibles, mensajes de ayuda y estados default, error y success. El campo deshabilitado muestra el estilo inactivo."
      tone="sky"
    >
      <div className="grid gap-8 lg:grid-cols-2">
        <DemoSubBlock
          label="Campos de formulario"
          hint="text · email · password"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Input
              id="demo-input-text"
              label="Texto"
              type="text"
              name="demo-text"
              placeholder="Escribe algo…"
              validationState="default"
            />
            <Input
              id="demo-input-email"
              label="Email"
              type="email"
              name="demo-email"
              placeholder="correo@ejemplo.com"
              validationState="error"
              message="Formato de email no válido"
              defaultValue="no-es-email"
            />
            <Input
              id="demo-input-password"
              label="Contraseña"
              type="password"
              name="demo-password"
              placeholder=""
              validationState="success"
              message="Contraseña segura"
            />
            <Input
              id="demo-input-disabled"
              label="Deshabilitado"
              type="text"
              name="demo-disabled"
              placeholder="No editable"
              disabled
            />
          </div>
        </DemoSubBlock>
        <div className="flex flex-col justify-center rounded border-2 border-dashed border-neutral-400 bg-white/60 p-5 font-mono text-sm leading-relaxed text-neutral-600 shadow-[3px_3px_0_0_#a3a3a3] sm:p-6">
          <p className="m-0 font-bold text-neutral-800">Notas</p>
          <ul className="m-0 mt-3 list-disc space-y-2 pl-5">
            <li>
              <code className="text-neutral-900">validationState</code> controla
              borde y mensaje.
            </li>
            <li>
              Los inputs envían eventos de tracking al enfocar o al salir del
              campo (demo).
            </li>
            <li>
              Usa <code className="text-neutral-900">label</code> siempre para
              enlazar con el control.
            </li>
          </ul>
        </div>
      </div>
    </DemoSection>
  );
}
