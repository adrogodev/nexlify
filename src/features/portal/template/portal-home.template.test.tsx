import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { PortalHomeTemplate } from "./portal-home.template";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
}));

vi.mock("../actions/portal-auth.actions", () => ({
  portalLogoutAction: vi.fn(),
}));

vi.mock("../actions/portal-data.actions", () => ({
  getPortalClientDataAction: vi.fn(),
  updatePortalClientAction: vi.fn(),
}));

const { getPortalClientDataAction, updatePortalClientAction } = await import(
  "../actions/portal-data.actions"
);

const data_fixture = {
  is_admin: false,
  id: 2,
  name: "E2E RUNNER SA",
  username: "runner",
  ip_connection: "::1",
  is_active: true,
};

describe("PortalHomeTemplate", () => {
  beforeEach(() => {
    vi.mocked(getPortalClientDataAction).mockReset();
    vi.mocked(updatePortalClientAction).mockReset();
    vi.mocked(getPortalClientDataAction).mockResolvedValue({
      ok: true,
      data: data_fixture,
    } as never);
  });

  it("renders client data and the default profile form", async () => {
    render(<PortalHomeTemplate />);

    expect(await screen.findByText("E2E RUNNER SA")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Guardar cambios/i }),
    ).toBeInTheDocument();
    expect(updatePortalClientAction).not.toHaveBeenCalled();
  });

  it("submits edited profile fields and reloads data", async () => {
    vi.mocked(updatePortalClientAction).mockResolvedValue({
      ok: true,
      message: "Perfil actualizado exitosamente",
    } as never);

    render(<PortalHomeTemplate />);
    await screen.findByText("E2E RUNNER SA");

    await userEvent.type(screen.getByLabelText("Email"), "new@e2e.test");
    await userEvent.click(
      screen.getByRole("button", { name: /Guardar cambios/i }),
    );

    await waitFor(() => {
      expect(updatePortalClientAction).toHaveBeenCalledWith({
        name: "E2E RUNNER SA",
        email: "new@e2e.test",
        cell_callsign: undefined,
        cell_phone: undefined,
      });
      expect(getPortalClientDataAction).toHaveBeenCalledTimes(2);
    });
  });
});
