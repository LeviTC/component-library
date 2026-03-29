import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ComponentAnalyticsProvider } from "@/lib/component-analytics-context";
import Button from "../Button";
import Input from "../Input";
import Modal from "../Modal";

describe("integración: tracking → API", () => {
  const originalFetch = global.fetch;

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("Button con Provider envía POST a /api/components/track al hacer clic", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    render(
      <ComponentAnalyticsProvider>
        <Button variant="danger" onClick={() => {}}>
          Borrar
        </Button>
      </ComponentAnalyticsProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Borrar" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(String(fetchMock.mock.calls[0][0])).toContain(
      "/api/components/track",
    );
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(init.method).toBe("POST");
    expect(init.headers).toMatchObject({ "Content-Type": "application/json" });
    expect(JSON.parse(init.body as string)).toMatchObject({
      componentName: "Button",
      variant: "danger",
      action: "click",
      metadata: { elementLabel: "Borrar" },
    });
  });

  it("Button con id explícito envía elementId y elementLabel en metadata", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    render(
      <ComponentAnalyticsProvider>
        <Button
          id="demo-submit"
          trackingLabel="Enviar formulario"
          variant="primary"
          onClick={() => {}}
        >
          OK
        </Button>
      </ComponentAnalyticsProvider>,
    );

    await user.click(screen.getByRole("button", { name: "OK" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string)).toMatchObject({
      metadata: {
        elementId: "demo-submit",
        elementLabel: "Enviar formulario",
      },
    });
  });

  it("Input con Provider envía focus y blur con elementId / elementLabel", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    render(
      <ComponentAnalyticsProvider>
        <Input
          id="field-email"
          label="Correo"
          type="email"
          name="email"
          defaultValue=""
        />
      </ComponentAnalyticsProvider>,
    );

    const input = screen.getByRole("textbox", { name: "Correo" });
    await user.click(input);
    await user.tab();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
    const first = JSON.parse((fetchMock.mock.calls[0][1] as RequestInit).body as string);
    const second = JSON.parse((fetchMock.mock.calls[1][1] as RequestInit).body as string);
    expect(first).toMatchObject({
      componentName: "Input",
      action: "focus",
      metadata: { elementId: "field-email", elementLabel: "Correo" },
    });
    expect(second).toMatchObject({
      componentName: "Input",
      action: "blur",
      metadata: {
        elementId: "field-email",
        elementLabel: "Correo",
        validationState: "default",
      },
    });
  });

  it("Button sin Provider no invoca fetch (sin tracking)", async () => {
    const fetchMock = jest.fn();
    global.fetch = fetchMock as unknown as typeof fetch;
    const user = userEvent.setup();

    render(<Button onClick={() => {}}>Solo</Button>);
    await user.click(screen.getByRole("button", { name: "Solo" }));

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("Modal con Provider registra action open al pasar open a true", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    function Harness({ open }: { open: boolean }) {
      return (
        <ComponentAnalyticsProvider>
          <Modal open={open} onClose={() => {}} title="Título" size="lg">
            <p>cuerpo</p>
          </Modal>
        </ComponentAnalyticsProvider>
      );
    }

    const { rerender } = render(<Harness open={false} />);
    expect(fetchMock).not.toHaveBeenCalled();

    rerender(<Harness open />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    const init = fetchMock.mock.calls[0][1] as RequestInit;
    expect(JSON.parse(init.body as string)).toMatchObject({
      componentName: "Modal",
      variant: "lg",
      action: "open",
    });
  });

  it("Modal registra close cuando open pasa a false (cualquier vía de cierre)", async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    });
    global.fetch = fetchMock as unknown as typeof fetch;

    function Harness({ open }: { open: boolean }) {
      return (
        <ComponentAnalyticsProvider>
          <Modal open={open} onClose={() => {}} title="T" size="md">
            <p>c</p>
          </Modal>
        </ComponentAnalyticsProvider>
      );
    }

    const parseBody = (call: unknown[]) =>
      JSON.parse((call[1] as RequestInit).body as string) as {
        action?: string;
        componentName?: string;
        variant?: string;
      };

    const { rerender } = render(<Harness open />);
    await waitFor(() => expect(fetchMock).toHaveBeenCalled());
    expect(
      fetchMock.mock.calls.some((c) => parseBody(c).action === "open"),
    ).toBe(true);

    rerender(<Harness open={false} />);
    await waitFor(() =>
      expect(
        fetchMock.mock.calls.some((c) => parseBody(c).action === "close"),
      ).toBe(true),
    );
    const closeCall = fetchMock.mock.calls.find(
      (c) => parseBody(c).action === "close",
    );
    expect(closeCall).toBeTruthy();
    expect(parseBody(closeCall!)).toMatchObject({
      componentName: "Modal",
      variant: "md",
      action: "close",
    });
  });
});
