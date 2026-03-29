import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Input from "../Input";

describe("Input", () => {
  it("renderiza label vinculado al campo", () => {
    render(<Input label="Correo" name="email" />);
    const input = screen.getByRole("textbox", { name: "Correo" });
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("brutalist-input");
    expect(input).toHaveAttribute("id");
  });

  it("usa el id explícito en el input", () => {
    render(<Input id="login-email" label="Email" name="e" />);
    expect(screen.getByRole("textbox", { name: "Email" })).toHaveAttribute(
      "id",
      "login-email",
    );
  });

  it("respeta props: type email, validationState, message y size", () => {
    render(
      <Input
        label="E"
        name="e"
        type="email"
        validationState="error"
        message="Mal"
        size="lg"
      />,
    );
    const input = screen.getByRole("textbox", { name: "E" });
    expect(input).toHaveAttribute("type", "email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input.className).toMatch(/brutalist-input--lg/);
    expect(input.className).toMatch(/brutalist-input--error/);
    expect(screen.getByRole("alert")).toHaveTextContent("Mal");
  });

  it("permite escribir y dispara onChange", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(
      <Input label="Nombre" name="n" onChange={onChange} defaultValue="" />,
    );
    const input = screen.getByRole("textbox", { name: "Nombre" });
    await user.type(input, "Ana");
    expect(onChange).toHaveBeenCalled();
    expect(input).toHaveValue("Ana");
  });

  it("password: alterna visibilidad con el botón toggle", async () => {
    const user = userEvent.setup();
    render(
      <Input label="Clave" name="p" type="password" defaultValue="sec" />,
    );
    const input = screen.getByLabelText("Clave");
    expect(input).toHaveAttribute("type", "password");
    const toggle = screen.getByRole("button", { name: "Mostrar contraseña" });
    await user.click(toggle);
    expect(screen.getByRole("button", { name: "Ocultar contraseña" })).toBeInTheDocument();
    expect(screen.getByLabelText("Clave")).toHaveAttribute("type", "text");
  });

  it("no muestra toggle si showPasswordToggle es false", () => {
    render(
      <Input
        label="Clave"
        name="p"
        type="password"
        showPasswordToggle={false}
      />,
    );
    expect(
      screen.queryByRole("button", { name: "Mostrar contraseña" }),
    ).not.toBeInTheDocument();
  });

  it("deshabilitado no recibe foco de escritura", () => {
    render(<Input label="X" name="x" disabled />);
    expect(screen.getByRole("textbox", { name: "X" })).toBeDisabled();
  });
});
