"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input } from "@/components/library";
import { loginApi } from "@/lib/auth-api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

const EMAIL_OK = "Correo válido";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);

  const emailInvalid = emailBlurred && !isValidEmail(email);
  const emailSuccess = emailBlurred && isValidEmail(email);
  const emailInputState: "default" | "error" | "success" = emailInvalid
    ? "error"
    : emailSuccess
      ? "success"
      : "default";
  const emailInputMessage = emailInvalid
    ? "Correo electrónico no válido"
    : emailSuccess
      ? EMAIL_OK
      : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailBlurred(true);
    if (!isValidEmail(email)) {
      return;
    }
    setLoading(true);
    try {
      await loginApi(email, password);
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-10">
      <h1 className="m-0 font-mono text-2xl font-bold text-neutral-900">
        Iniciar sesión
      </h1>
      <p className="m-0 font-mono text-sm text-neutral-600">
        Tras iniciar sesión podrás exportar el tracking en CSV o JSON desde el
        panel de estadísticas en la página principal.
      </p>
      <form className="flex flex-col gap-4" onSubmit={(e) => void handleSubmit(e)}>
        <Input
          id="login-email"
          label="Correo"
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setEmailBlurred(true)}
          placeholder="tu@correo.com"
          validationState={emailInputState}
          message={emailInputMessage}
          required
        />
        <Input
          id="login-password"
          label="Contraseña"
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder=""
          validationState="default"
          required
        />
        {error ? (
          <p className="m-0 font-mono text-sm text-red-700" role="alert">
            {error}
          </p>
        ) : null}
        <Button id="login-submit" type="submit" variant="primary" loading={loading}>
          Entrar
        </Button>
      </form>
      <p className="m-0 font-mono text-sm text-neutral-600">
        ¿No tienes cuenta?{" "}
        <Link href="/register" className="font-bold text-neutral-900 underline">
          Regístrate
        </Link>
      </p>
    </main>
  );
}
