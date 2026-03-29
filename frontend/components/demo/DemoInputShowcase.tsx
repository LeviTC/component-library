"use client";

import { Input } from "@/components/library";

export function DemoInputShowcase() {
  return (
    <section
      className="mx-auto flex w-full max-w-4xl flex-wrap items-end justify-center gap-3"
      aria-labelledby="input-heading"
    >
      <h2
        id="input-heading"
        className="sr-only m-0 w-full text-center font-mono text-sm font-bold"
      >
        Input — tipos y validación
      </h2>
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
    </section>
  );
}
