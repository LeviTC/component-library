"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Input } from "@/components/library";
import { registerApi } from "@/lib/auth-api";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  return EMAIL_RE.test(value.trim());
}

const MIN_PASSWORD = 6;
const MAX_PASSWORD = 20;

function getPasswordError(password: string): string | null {
  if (password.length < MIN_PASSWORD) {
    return `La contraseña debe tener al menos ${MIN_PASSWORD} caracteres`;
  }
  if (password.length > MAX_PASSWORD) {
    return "La contraseña es demasiado larga";
  }
  return null;
}

const PASSWORD_MATCH_OK = "Las contraseñas coinciden";
const EMAIL_OK = "Correo válido";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [emailBlurred, setEmailBlurred] = useState(false);
  const [passwordBlurred, setPasswordBlurred] = useState(false);
  const [confirmBlurred, setConfirmBlurred] = useState(false);

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

  const passwordFormatError = passwordBlurred ? getPasswordError(password) : null;
  const confirmFormatError = confirmBlurred ? getPasswordError(confirmPassword) : null;
  const mismatch =
    passwordBlurred &&
    confirmBlurred &&
    passwordFormatError == null &&
    confirmFormatError == null &&
    password !== confirmPassword;

  const passwordsMatchSuccess =
    passwordBlurred &&
    confirmBlurred &&
    passwordFormatError == null &&
    confirmFormatError == null &&
    password === confirmPassword &&
    password.length >= MIN_PASSWORD;

  const passwordInputState: "default" | "error" | "success" = !passwordBlurred
    ? "default"
    : passwordFormatError != null
      ? "error"
      : mismatch
        ? "error"
        : passwordsMatchSuccess
          ? "success"
          : "default";

  const confirmInputState: "default" | "error" | "success" = !confirmBlurred
    ? "default"
    : confirmFormatError != null
      ? "error"
      : mismatch
        ? "error"
        : passwordsMatchSuccess
          ? "success"
          : "default";

  const passwordInputMessage =
    passwordFormatError ??
    (mismatch ? "Las contraseñas no coinciden" : undefined) ??
    (passwordsMatchSuccess ? PASSWORD_MATCH_OK : undefined);

  const confirmInputMessage =
    confirmFormatError ??
    (mismatch ? "Las contraseñas no coinciden" : undefined) ??
    (passwordsMatchSuccess ? PASSWORD_MATCH_OK : undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setEmailBlurred(true);
    setPasswordBlurred(true);
    setConfirmBlurred(true);
    if (
      !isValidEmail(email) ||
      getPasswordError(password) != null ||
      getPasswordError(confirmPassword) != null ||
      password !== confirmPassword
    ) {
      return;
    }
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
        El registro devuelve un JWT en el navegador (p. ej. para exportar el
        tracking en CSV/JSON desde la demo).
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
          onBlur={() => setEmailBlurred(true)}
          placeholder="tu@correo.com"
          validationState={emailInputState}
          message={emailInputMessage}
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
          onBlur={() => setPasswordBlurred(true)}
          placeholder=""
          validationState={passwordInputState}
          message={passwordInputMessage}
          required
        />
        <Input
          id="register-password-confirm"
          label="Confirmar contraseña"
          type="password"
          name="password-confirm"
          autoComplete="new-password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          onBlur={() => setConfirmBlurred(true)}
          placeholder=""
          validationState={confirmInputState}
          message={confirmInputMessage}
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
