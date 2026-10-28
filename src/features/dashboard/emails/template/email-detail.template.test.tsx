import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { EmailDetailTemplate } from "./email-detail.template";

vi.mock("../actions/email.actions", () => ({
  getEmailDetailAction: vi.fn(),
  downloadEmailAttachmentAction: vi.fn(),
}));

const { getEmailDetailAction, downloadEmailAttachmentAction } = await import(
  "../actions/email.actions"
);

const detail_fixture = {
  email_uuid: "email-uuid-1",
  short_code: "NX-TEST01",
  to_email: "to@test.com",
  from_email: "from@test.com",
  subject: "E2E runner send",
  state: "SENT",
  attempts: 1,
  created_at: "2026-10-28T12:00:00.000Z",
  logs: [],
  attachments: [
    { filename: "report.pdf", content_type: "application/pdf", size_bytes: 4 },
  ],
};

describe("EmailDetailTemplate", () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => "blob:mock");
    URL.revokeObjectURL = vi.fn();
    vi.mocked(getEmailDetailAction).mockReset();
    vi.mocked(downloadEmailAttachmentAction).mockReset();
    vi.mocked(getEmailDetailAction).mockResolvedValue({
      ok: true,
      data: detail_fixture,
    } as never);
  });

  it("lists attachments with a download button", async () => {
    render(<EmailDetailTemplate email_id="email-uuid-1" />);

    expect(await screen.findByText(/report\.pdf/)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Descargar adjunto report.pdf" }),
    ).toBeInTheDocument();
    expect(downloadEmailAttachmentAction).not.toHaveBeenCalled();
  });

  it("downloads the attachment triggering a browser blob download", async () => {
    vi.mocked(downloadEmailAttachmentAction).mockResolvedValue({
      ok: true,
      data: {
        filename: "report.pdf",
        content_type: "application/pdf",
        size_bytes: 4,
        content_base64: "AAAA",
      },
    } as never);

    render(<EmailDetailTemplate email_id="email-uuid-1" />);
    await screen.findByText(/report\.pdf/);

    await userEvent.click(
      screen.getByRole("button", { name: "Descargar adjunto report.pdf" }),
    );

    await waitFor(() => {
      expect(downloadEmailAttachmentAction).toHaveBeenCalledWith(
        "email-uuid-1",
        0,
      );
      expect(URL.createObjectURL).toHaveBeenCalledWith(
        expect.objectContaining({ type: "application/pdf" }),
      );
    });
  });
});
