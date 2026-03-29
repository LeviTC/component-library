import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "../Modal";

describe("Modal", () => {
  it("no renderiza el diálogo cuando open es false", () => {
    render(
      <Modal open={false} onClose={jest.fn()} title="T">
        C
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renderiza título y contenido cuando open es true", async () => {
    render(
      <Modal open onClose={jest.fn()} title="Mi modal">
        <p>Contenido</p>
      </Modal>,
    );
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    expect(screen.getByRole("heading", { name: "Mi modal" })).toBeInTheDocument();
    expect(screen.getByText("Contenido")).toBeInTheDocument();
  });

  it("respeta props: size en clase, hideCloseButton y ariaLabel sin título", async () => {
    render(
      <Modal
        open
        onClose={jest.fn()}
        size="lg"
        hideCloseButton
        ariaLabel="Diálogo sin título"
      >
        X
      </Modal>,
    );
    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });
    const dialog = screen.getByRole("dialog");
    expect(dialog.className).toMatch(/brutalist-modal-panel--lg/);
    expect(dialog).toHaveAttribute("aria-label", "Diálogo sin título");
    expect(
      screen.queryByRole("button", { name: "Cerrar modal" }),
    ).not.toBeInTheDocument();
  });

  it("cierra con el botón X", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} title="T">
        B
      </Modal>,
    );
    await waitFor(() => screen.getByRole("dialog"));
    await user.click(screen.getByRole("button", { name: "Cerrar modal" }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("cierra con Escape", async () => {
    const user = userEvent.setup();
    const onClose = jest.fn();
    render(
      <Modal open onClose={onClose} title="T">
        B
      </Modal>,
    );
    await waitFor(() => screen.getByRole("dialog"));
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalled();
  });
});
