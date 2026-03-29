import { render, screen, within } from "@testing-library/react";
import Card from "../Card";

describe("Card", () => {
  it("renderiza cuerpo y usa article por defecto", () => {
    const { container } = render(<Card>Contenido</Card>);
    const article = container.querySelector("article.brutalist-card");
    expect(article).toBeInTheDocument();
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  it("aplica props: borderVariant, tone, as y className", () => {
    const { container } = render(
      <Card
        as="section"
        borderVariant="thick"
        tone="secondary"
        className="mi-card"
      >
        X
      </Card>,
    );
    const el = container.querySelector("section.brutalist-card");
    expect(el).toBeInTheDocument();
    expect(el?.className).toMatch(/brutalist-card--thick/);
    expect(el?.className).toMatch(/brutalist-card--tone-secondary/);
    expect(el?.className).toMatch(/mi-card/);
  });

  it("renderiza header como string en h3 y footer", () => {
    render(
      <Card header="Título" footer={<span data-testid="ft">Pie</span>}>
        Cuerpo
      </Card>,
    );
    expect(
      screen.getByRole("heading", { level: 3, name: "Título" }),
    ).toBeInTheDocument();
    expect(screen.getByTestId("ft")).toHaveTextContent("Pie");
    expect(screen.getByText("Cuerpo")).toBeInTheDocument();
  });

  it("usa imageSrc con Next Image mockeado", () => {
    render(
      <Card imageSrc="https://example.com/x.jpg" imageAlt="demo">
        Texto
      </Card>,
    );
    const img = screen.getByTestId("next-image");
    expect(img).toHaveAttribute("src", "https://example.com/x.jpg");
    expect(img).toHaveAttribute("alt", "demo");
    const media = document.querySelector(".brutalist-card-media");
    expect(media).toBeTruthy();
    expect(media && within(media as HTMLElement).getByTestId("next-image")).toBe(
      img,
    );
  });

  it("prioriza image personalizado sobre imageSrc", () => {
    render(
      <Card
        image={<div data-testid="custom-img">IMG</div>}
        imageSrc="https://example.com/ignored.jpg"
      >
        H
      </Card>,
    );
    expect(screen.getByTestId("custom-img")).toBeInTheDocument();
    expect(screen.queryByTestId("next-image")).not.toBeInTheDocument();
  });
});
