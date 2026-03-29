import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../Button";

describe("Button", () => {
  it("renderiza el texto hijo y la clase base", () => {
    render(<Button>Guardar</Button>);
    const btn = screen.getByRole("button", { name: "Guardar" });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toMatch(/brutalist-btn/);
    expect(btn.className).toMatch(/brutalist-btn--md/);
    expect(btn.className).toMatch(/brutalist-btn--primary/);
  });

  it("respeta props: variant, size y disabled", () => {
    render(
      <Button variant="danger" size="sm" disabled>
        Borrar
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Borrar" });
    expect(btn).toBeDisabled();
    expect(btn.className).toMatch(/brutalist-btn--danger/);
    expect(btn.className).toMatch(/brutalist-btn--sm/);
  });

  it("dispara onClick al hacer clic cuando está habilitado", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(<Button onClick={onClick}>OK</Button>);
    await user.click(screen.getByRole("button", { name: "OK" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("no dispara onClick si está deshabilitado", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        No
      </Button>,
    );
    await user.click(screen.getByRole("button", { name: "No" }));
    expect(onClick).not.toHaveBeenCalled();
  });

  it("expone id en el DOM (prop o generado)", () => {
    const { rerender } = render(<Button>Gen</Button>);
    expect(screen.getByRole("button", { name: "Gen" })).toHaveAttribute(
      "id",
    );
    rerender(<Button id="mi-boton">Con id</Button>);
    expect(screen.getByRole("button", { name: "Con id" })).toHaveAttribute(
      "id",
      "mi-boton",
    );
  });

  it("admite type submit para formularios", () => {
    render(
      <form>
        <Button type="submit">Enviar</Button>
      </form>,
    );
    expect(screen.getByRole("button", { name: "Enviar" })).toHaveAttribute(
      "type",
      "submit",
    );
  });

  it("en loading muestra estado ocupado y no ejecuta onClick", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <Button loading onClick={onClick}>
        Enviar
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Enviar" });
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toBeDisabled();
    await user.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });
});
