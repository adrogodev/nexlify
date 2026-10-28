import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateUserAction, updateUserStateAction } from "./users.actions";

vi.mock("@/src/lib/clients/fetch/server/client.serve", () => ({
  fetchServerClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("@/src/lib/handlers/api-errors.handler", () => ({
  handleApiResponseError: vi.fn(async () => ({ code: "MOCKED_ERROR" })),
}));

const { fetchServerClient } = await import(
  "@/src/lib/clients/fetch/server/client.serve"
);

const mocked_put = vi.mocked(fetchServerClient.put);

type PutResult = {
  data: { message?: string; data?: unknown };
  status: number;
};
const put_result = (result: PutResult) =>
  mocked_put.mockResolvedValue(result as never);

describe("updateUserStateAction", () => {
  beforeEach(() => {
    mocked_put.mockReset();
  });

  it("sends only the state field for the user id", async () => {
    put_result({
      status: 200,
      data: { data: { id_user: 7 }, message: "Usuario actualizado" },
    });

    const result = await updateUserStateAction(7, true);

    expect(mocked_put).toHaveBeenCalledWith("/users/7", { state: true });
    expect(result).toEqual({
      ok: true,
      data: { id_user: 7 },
      message: "Usuario actualizado",
    });
  });

  it("returns ok:false with fallback message on non-200", async () => {
    put_result({ status: 500, data: {} });

    const result = await updateUserStateAction(7, false);

    expect(result).toEqual({
      ok: false,
      message: "No se pudo deshabilitar el usuario",
    });
  });

  it("returns ok:false with handled error on rejection", async () => {
    mocked_put.mockRejectedValue(new Error("network"));

    const result = await updateUserStateAction(7, true);

    expect(result).toEqual({ ok: false, error: { code: "MOCKED_ERROR" } });
  });
});

describe("updateUserAction (regression: state update must not affect profile update)", () => {
  beforeEach(() => {
    mocked_put.mockReset();
  });

  it("still sends profile params without state", async () => {
    put_result({
      status: 200,
      data: { data: { id_user: 3 }, message: "ok" },
    });

    const result = await updateUserAction({
      id_user: 3,
      first_name: "Ana",
      email: "ana@test.com",
    });

    expect(mocked_put).toHaveBeenCalledWith("/users/3", {
      first_name: "Ana",
      email: "ana@test.com",
    });
    expect(result).toEqual({
      ok: true,
      data: { id_user: 3 },
      message: "ok",
    });
  });
});
