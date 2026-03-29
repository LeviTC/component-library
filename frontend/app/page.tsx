"use client";

import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Input,
  Modal,
  PlusIcon,
  type ModalSize,
} from "@/components/library";
import {
  fetchComponentsStats,
  type ComponentsStats,
} from "@/lib/components-stats-api";

const STATS_POLL_MS = 4000;

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSize, setModalSize] = useState<ModalSize>("md");
  const closeDemoModal = () => setModalOpen(false);
  const [stats, setStats] = useState<ComponentsStats | null>(null);
  const [statsError, setStatsError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = () => {
      void fetchComponentsStats()
        .then((s) => {
          if (!cancelled) {
            setStats(s);
            setStatsError(null);
          }
        })
        .catch((e: unknown) => {
          if (!cancelled) {
            setStatsError(e instanceof Error ? e.message : "Error de red");
          }
        });
    };
    load();
    const id = setInterval(load, STATS_POLL_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col gap-10 bg-white px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-6xl">
        <h1 className="m-0 mb-2 font-mono text-2xl font-bold text-neutral-900 sm:text-3xl">
          Component Library — Demo
        </h1>
        <p className="m-0 max-w-3xl font-mono text-sm text-neutral-600">
          Interactúa con los componentes: el tracking se envía al API de forma
          transparente. Las estadísticas se actualizan automáticamente cada pocos
          segundos.
        </p>
      </div>

      <section
        className="mx-auto w-full max-w-6xl rounded border-4 border-neutral-900 bg-amber-50 p-4 shadow-[6px_6px_0_0_#171717] sm:p-6"
        aria-labelledby="stats-heading"
      >
        <div className="flex justify-between items-center">
          <h2
            id="stats-heading"
            className="m-0 mb-4 font-mono text-lg font-bold text-neutral-900"
          >
            Estadísticas en tiempo real
          </h2>

          <div className="flex gap-5">
            <Button
              id="stats-export-csv"
              variant="primary"
              size="sm"
              // onClick={() => void handleExport("csv")}
            >
              Exportar CSV
            </Button>
            <Button
              id="stats-export-json"
              variant="secondary"
              size="sm"
              // onClick={() => void handleExport("json")}
            >
              Exportar JSON
            </Button>
          </div>
        </div>
        {statsError ? (
          <p className="m-0 font-mono text-sm text-red-800" role="alert">
            {statsError} — comprueba que el backend esté en marcha y{" "}
            <code className="rounded bg-white px-1">NEXT_PUBLIC_API_URL</code>{" "}
            sea correcto.
          </p>
        ) : null}
        
        {stats ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717]">
              <p className="m-0 text-xs font-bold uppercase text-neutral-500">
                Total interacciones
              </p>
              <p className="m-0 mt-1 text-3xl font-bold tabular-nums text-neutral-900">
                {stats.totalEvents}
              </p>
              <p className="m-0 mt-2 text-xs text-neutral-600">
                Actualizado:{" "}
                {new Date(stats.updatedAt).toLocaleTimeString("es", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                })}
              </p>
            </div>
            <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717] sm:col-span-2 lg:col-span-1">
              <p className="m-0 text-xs font-bold uppercase text-neutral-500">
                Último evento
              </p>
              {stats.lastEvent ? (
                <ul className="m-0 mt-2 list-none space-y-1 p-0 text-sm text-neutral-800">
                  <li>
                    <span className="font-bold">{stats.lastEvent.componentName}</span>{" "}
                    · {stats.lastEvent.action}
                    {stats.lastEvent.variant != null && stats.lastEvent.variant !== ""
                      ? ` · ${stats.lastEvent.variant}`
                      : ""}
                  </li>
                  <li className="text-xs text-neutral-600">
                    {new Date(stats.lastEvent.at).toLocaleString("es")}
                  </li>
                </ul>
              ) : (
                <p className="m-0 mt-2 text-sm text-neutral-600">
                  Aún no hay eventos registrados.
                </p>
              )}
            </div>
            <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717] sm:col-span-2 lg:col-span-2">
              <p className="m-0 text-xs font-bold uppercase text-neutral-500">
                Por componente
              </p>
              <ul className="m-0 mt-2 max-h-32 list-none space-y-1 overflow-auto p-0 text-sm">
                {stats.byComponent.length === 0 ? (
                  <li className="text-neutral-600">—</li>
                ) : (
                  stats.byComponent.map((row) => (
                    <li
                      key={row.name}
                      className="flex justify-between gap-2 border-b border-neutral-200 pb-1"
                    >
                      <span>{row.name}</span>
                      <span className="tabular-nums font-bold">{row.count}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            <div className="rounded border-2 border-neutral-900 bg-white p-4 font-mono shadow-[3px_3px_0_0_#171717] lg:col-span-1">
              <p className="m-0 text-xs font-bold uppercase text-neutral-500">
                Por acción
              </p>
              <ul className="m-0 mt-2 max-h-32 list-none space-y-1 overflow-auto p-0 text-sm">
                {stats.byAction.length === 0 ? (
                  <li className="text-neutral-600">—</li>
                ) : (
                  stats.byAction.map((row) => (
                    <li
                      key={row.action}
                      className="flex justify-between gap-2 border-b border-neutral-200 pb-1"
                    >
                      <span>{row.action}</span>
                      <span className="tabular-nums font-bold">{row.count}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        ) : !statsError ? (
          <p className="m-0 font-mono text-sm text-neutral-600">Cargando…</p>
        ) : null}
        <p className="m-0 mt-4 font-mono text-xs text-neutral-600">
          Exporta CSV o JSON desde la barra superior tras iniciar sesión.
        </p>
      </section>

      <section className="mx-auto flex w-full max-w-6xl flex-col gap-4" aria-labelledby="btn-heading">
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

      <section className="mx-auto w-full max-w-6xl" aria-labelledby="card-heading">
        <h2
          id="card-heading"
          className="m-0 mb-4 text-center font-mono text-sm font-bold text-neutral-800"
        >
          Card — bordes, tonos e imagen
        </h2>
        <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Card
            borderVariant="solid"
            tone="primary"
            header="Sólido · primary"
            footer={
              <Button id="demo-card-action-solid" size="sm" variant="primary">
                Acción
              </Button>
            }
          >
            <p className="m-0 text-sm">
              Variante <code className="font-bold">solid</code>.
            </p>
          </Card>
          <Card borderVariant="thick" tone="secondary" header="Thick · secondary">
            <p className="m-0 text-sm">Borde grueso y sombra secundaria.</p>
          </Card>
          <Card
            borderVariant="double"
            tone="danger"
            header="Double · danger"
            footer={
              <Button id="demo-card-more-double" size="sm" variant="secondary">
                Más
              </Button>
            }
          >
            <p className="m-0 text-sm">Doble borde y tono danger.</p>
          </Card>
          <Card
            borderVariant="accent"
            tone="primary"
            header="Accent · primary"
            footer={
              <Button id="demo-card-view-accent" size="sm" variant="danger">
                Ver
              </Button>
            }
          >
            <p className="m-0 text-sm">
              Variante <code className="font-bold">accent</code>.
            </p>
          </Card>
          <Card
            className="sm:col-span-2 lg:col-span-1 xl:col-span-1"
            tone="secondary"
            imageSrc="https://picsum.photos/seed/brutalist-card/600/340"
            imageAlt="Imagen de ejemplo"
            header="Con imagen"
            footer={
              <Button id="demo-card-detail-image" size="sm" variant="secondary">
                Detalle
              </Button>
            }
          >
            <p className="m-0 text-sm">
              <code className="font-bold">imageSrc</code> sobre el cuerpo.
            </p>
          </Card>
        </div>
      </section>

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
    </div>
  );
}
