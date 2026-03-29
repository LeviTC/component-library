"use client";

import { Button, Card } from "@/components/library";

export function DemoCardShowcase() {
  return (
    <section
      className="mx-auto w-full max-w-6xl"
      aria-labelledby="card-heading"
    >
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
        <Card
          borderVariant="thick"
          tone="secondary"
          header="Thick · secondary"
        >
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
  );
}
