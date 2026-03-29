"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input } from "@/components/library";
import { registerApi } from "@/lib/auth-api";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await registerApi(email, password);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
      <h1 className="m-0 font-mono text-2xl font-bold text-neutral-900">
        Crear cuenta
      </h1>
      <p className="m-0 font-mono text-sm text-neutral-600">
        El registro devuelve un JWT guardado en el navegador para exportar datos.
      </p>
      <form className="flex flex-col gap-4" onSubmit={(e) => void handleSubmit(e)}>
        <Input
          id="register-email"
          label="Correo"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          validationState="default"
          required
        />
        <Input
          id="register-password"
          label="Contraseña"
          type="password"
          name="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo según validación del API"
          validationState="default"
          required
        />
        {error ? (
          <p className="m-0 font-mono text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <Button id="register-submit" type="submit" variant="primary" loading={loading}>
          Registrarme
        </Button>
      </form>
      <p className="m-0 font-mono text-sm text-neutral-600">
        ¿Ya tienes cuenta?{" "}
        <Link href="/login" className="font-bold text-neutral-900 underline">
          Inicia sesión
        </Link>
      </p>
    </main>
  );
}
