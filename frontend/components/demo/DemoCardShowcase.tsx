"use client";

import { Button, Card } from "@/components/library";
import { DemoSection } from "@/components/demo/DemoSection";

export function DemoCardShowcase() {
  return (
    <DemoSection
      id="card-heading"
      eyebrow="03 · Card"
      title="Bordes, tonos e imagen"
      description="Variantes de borde (solid, thick, double), tonos de marca y tarjeta con imagen superior opcional."
      tone="violet"
    >
      <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
            Variante <code className="font-bold">solid</code> con sombra
            contundente.
          </p>
        </Card>
        <Card
          borderVariant="thick"
          tone="secondary"
          header="Thick · secondary"
        >
          <p className="m-0 text-sm">
            Borde grueso y paleta secundaria para jerarquía suave.
          </p>
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
          <p className="m-0 text-sm">Doble trazo y tono de alerta o acción crítica.</p>
        </Card>
        <Card
          className="sm:col-span-2 lg:col-span-3 xl:col-span-1"
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
            Prop <code className="font-bold">imageSrc</code> con{" "}
            <code className="font-bold">imageAlt</code> obligatorio para
            accesibilidad.
          </p>
        </Card>
      </div>
    </DemoSection>
  );
}
