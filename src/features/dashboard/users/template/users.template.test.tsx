import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { UsersTemplate } from "./users.template";

const users_fixture = [
  {
    id_user: 7,
    first_name: "Runner",
    first_surname: "E2E",
    email: "r@e2e.test",
    id_client: null,
    state: true,
  },
  {
    id_user: 9,
    first_name: "Otro",
    first_surname: "User",
    email: "o@e2e.test",
    id_client: 2,
    state: false,
  },
];

vi.mock("../actions/users.actions", () => ({
  getUsersAction: vi.fn(),
  updateUserStateAction: vi.fn(),
}));

const { getUsersAction, updateUserStateAction } = await import(
  "../actions/users.actions"
);

describe("UsersTemplate", () => {
  beforeEach(() => {
    vi.mocked(getUsersAction).mockReset();
    vi.mocked(updateUserStateAction).mockReset();
    vi.mocked(getUsersAction).mockResolvedValue({
      ok: true,
      data: { total_items: 2, page: 1, data: users_fixture },
    } as never);
  });

  it("renders the Estado column with a badge and toggle per user", async () => {
    render(<UsersTemplate />);

    expect(await screen.findByText("Activo")).toBeInTheDocument();
    expect(screen.getByText("Inactivo")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Deshabilitar usuario 7" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Habilitar usuario 9" }),
    ).toBeInTheDocument();
  });

  it("toggles user state and refreshes the list", async () => {
    vi.mocked(updateUserStateAction).mockResolvedValue({
      ok: true,
      data: null,
      message: "Usuario actualizado",
    } as never);

    render(<UsersTemplate />);
    await screen.findByText("Activo");

    await userEvent.click(
      screen.getByRole("button", { name: "Deshabilitar usuario 7" }),
    );

    await waitFor(() => {
      expect(updateUserStateAction).toHaveBeenCalledWith(7, false);
      expect(getUsersAction).toHaveBeenCalledTimes(2);
    });
  });
});
