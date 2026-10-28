import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  getPortalClientDataAction,
  updatePortalClientAction,
} from "./portal-data.actions";

vi.mock("@/src/lib/clients/fetch/server/portal.serve", () => ({
  fetchPortalClient: {
    get: vi.fn(),
    put: vi.fn(),
  },
}));

vi.mock("@/src/lib/handlers/api-errors.handler", () => ({
  handleApiResponseError: vi.fn(async () => ({ code: "MOCKED_ERROR" })),
}));

const { fetchPortalClient } = await import(
  "@/src/lib/clients/fetch/server/portal.serve"
);

const mocked_put = vi.mocked(fetchPortalClient.put);
const mocked_get = vi.mocked(fetchPortalClient.get);

describe("updatePortalClientAction", () => {
  beforeEach(() => {
    mocked_put.mockReset();
    mocked_get.mockReset();
  });

  it("puts profile fields without id_client (portal session, never admin)", async () => {
    mocked_put.mockResolvedValue({
      status: 200,
      data: { message: "Perfil actualizado exitosamente" },
    } as never);

    const result = await updatePortalClientAction({
      name: "E2E Runner SA",
      email: "runner@e2e.test",
      cell_callsign: "+57",
      cell_phone: "3110000000",
    });

    expect(mocked_put).toHaveBeenCalledTimes(1);
    const [url, body] = mocked_put.mock.calls[0];
    expect(url).toBe("/client/update");
    expect(body).toEqual({
      name: "E2E Runner SA",
      email: "runner@e2e.test",
      cell_callsign: "+57",
      cell_phone: "3110000000",
    });
    expect(body).not.toHaveProperty("id_client");
    expect(result).toEqual({
      ok: true,
      message: "Perfil actualizado exitosamente",
    });
  });

  it("returns ok:false with fallback message on non-200", async () => {
    mocked_put.mockResolvedValue({
      status: 403,
      data: {},
    } as never);

    const result = await updatePortalClientAction({ name: "x" });

    expect(result).toEqual({
      ok: false,
      message: "No se pudo actualizar el perfil del cliente",
    });
  });
});

describe("getPortalClientDataAction (regression: untouched read path of the portal feature)", () => {
  beforeEach(() => {
    mocked_get.mockReset();
  });

  it("still fetches client data", async () => {
    mocked_get.mockResolvedValue({
      status: 200,
      data: { data: { name: "Silver", username: "silver" } },
    } as never);

    const result = await getPortalClientDataAction();

    expect(mocked_get).toHaveBeenCalledWith("/client/data");
    expect(result).toEqual({
      ok: true,
      data: { name: "Silver", username: "silver" },
    });
  });
});
