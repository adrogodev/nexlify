import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  downloadEmailAttachmentAction,
  getEmailDetailAction,
} from "./email.actions";

vi.mock("@/src/lib/clients/fetch/server/client.serve", () => ({
  fetchServerClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

vi.mock("@/src/lib/handlers/api-errors.handler", () => ({
  handleApiResponseError: vi.fn(async () => ({ code: "MOCKED_ERROR" })),
}));

const { fetchServerClient } = await import(
  "@/src/lib/clients/fetch/server/client.serve"
);

const mocked_get = vi.mocked(fetchServerClient.get);

describe("downloadEmailAttachmentAction", () => {
  beforeEach(() => {
    mocked_get.mockReset();
  });

  it("requests the attachment endpoint by email id and index", async () => {
    mocked_get.mockResolvedValue({
      status: 200,
      data: {
        data: {
          filename: "report.pdf",
          content_type: "application/pdf",
          size_bytes: 4,
          content_base64: "AAAA",
        },
      },
    } as never);

    const result = await downloadEmailAttachmentAction("email-uuid-1", 0);

    expect(mocked_get).toHaveBeenCalledWith(
      "/email/email-uuid-1/attachments/0",
    );
    expect(result).toEqual({
      ok: true,
      data: {
        filename: "report.pdf",
        content_type: "application/pdf",
        size_bytes: 4,
        content_base64: "AAAA",
      },
    });
  });

  it("returns ok:false with fallback message when the index does not exist", async () => {
    mocked_get.mockResolvedValue({
      status: 404,
      data: {},
    } as never);

    const result = await downloadEmailAttachmentAction("email-uuid-1", 99);

    expect(result).toEqual({
      ok: false,
      message: "No se pudo descargar el adjunto del email",
    });
  });
});

describe("getEmailDetailAction (regression: untouched read path of the email feature)", () => {
  beforeEach(() => {
    mocked_get.mockReset();
  });

  it("still fetches the email detail by uuid", async () => {
    mocked_get.mockResolvedValue({
      status: 200,
      data: { data: { email_uuid: "email-uuid-1", subject: "hola" } },
    } as never);

    const result = await getEmailDetailAction("email-uuid-1");

    expect(mocked_get).toHaveBeenCalledWith("/email/email-uuid-1");
    expect(result).toEqual({
      ok: true,
      data: { email_uuid: "email-uuid-1", subject: "hola" },
    });
  });
});
