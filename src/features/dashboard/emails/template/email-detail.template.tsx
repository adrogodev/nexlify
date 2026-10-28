"use client";

import { Download } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/src/shared/ui";
import type { IEmailDetail } from "../actions/email.actions";
import {
  downloadEmailAttachmentAction,
  getEmailDetailAction,
} from "../actions/email.actions";
import { EmailDetailActions } from "./email-actions.templates";

const SKELETON_ROWS = [1, 2, 3, 4, 5, 6] as const;

export function EmailDetailTemplate({ email_id }: { email_id: string }) {
  const [detail, set_detail] = useState<IEmailDetail | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [is_attachment_loading, set_is_attachment_loading] = useState<
    number | null
  >(null);
  const [error, set_error] = useState<string | null>(null);

  const handle_download_attachment = useCallback(
    async (attachment_index: number) => {
      set_is_attachment_loading(attachment_index);
      const result = await downloadEmailAttachmentAction(
        email_id,
        attachment_index,
      );
      set_is_attachment_loading(null);
      if (!result.ok || !result.data?.content_base64) return;

      try {
        const binary_string = atob(result.data.content_base64);
        const bytes = new Uint8Array(binary_string.length);
        for (let i = 0; i < binary_string.length; i += 1) {
          bytes[i] = binary_string.charCodeAt(i);
        }
        const blob = new Blob([bytes], {
          type: result.data.content_type || "application/octet-stream",
        });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = result.data.filename || `adjunto-${attachment_index}`;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        URL.revokeObjectURL(url);
      } catch (_err) {
        set_error("No se pudo procesar la descarga del adjunto");
      }
    },
    [email_id],
  );

  const load = useCallback(async () => {
    set_is_loading(true);
    const result = await getEmailDetailAction(email_id);
    set_is_loading(false);
    if (result.ok && result.data) {
      set_detail(result.data);
      set_error(null);
    } else {
      set_error(
        "error" in result
          ? String(result.error ?? "")
          : (result.message ?? null),
      );
      set_detail(null);
    }
  }, [email_id]);

  useEffect(() => {
    load();
  }, [load]);

  if (is_loading) {
    return (
      <div className="animate-pulse space-y-4 p-4" aria-busy="true">
        <div className="h-8 w-64 rounded bg-gray-100" />
        {SKELETON_ROWS.map((row) => (
          <div
            key={`email-detail-skeleton-${row}`}
            className="h-6 rounded bg-gray-50"
          />
        ))}
      </div>
    );
  }

  if (!detail) {
    return (
      <div role="alert" className="p-4">
        <p className="text-sm text-red-500">
          {error ?? "No se pudo cargar el detalle"}
        </p>
        <Link
          href="/dashboard/emails"
          className="text-sm underline mt-2 inline-block"
        >
          Volver
        </Link>
      </div>
    );
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: "Código", value: detail.short_code },
    { label: "Estado", value: detail.state ?? "—" },
    { label: "De", value: detail.from_email },
    { label: "Para", value: detail.to_email },
    { label: "Dirección", value: detail.direction ?? "—" },
    { label: "Intentos", value: String(detail.attempts ?? "—") },
    {
      label: "Enviado",
      value: detail.sent_at
        ? new Date(detail.sent_at).toLocaleString("es-CO")
        : "—",
    },
    {
      label: "Creado",
      value: detail.created_at
        ? new Date(detail.created_at).toLocaleString("es-CO")
        : "—",
    },
  ];

  return (
    <section className="w-full max-w-4xl p-4 space-y-4">
      <header className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/emails"
            aria-label="Volver a la bandeja"
            className="text-lg"
          >
            ←
          </Link>
          <h1 className="text-xl font-bold">{detail.subject}</h1>
        </div>
        <EmailDetailActions detail={detail} on_done={load} />
      </header>

      <dl className="grid grid-cols-1 gap-4 p-4 shadow-sm border border-gray-100 rounded-md sm:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-gray-700">{row.label}</dt>
            <dd className="text-sm text-gray-900">{row.value}</dd>
          </div>
        ))}
      </dl>

      {detail.attachments.length > 0 && (
        <div className="border border-gray-100 rounded-md p-4 shadow-sm bg-white">
          <h2 className="text-lg font-semibold mb-2">
            Adjuntos ({detail.attachments.length})
          </h2>
          <ul className="text-sm space-y-1">
            {detail.attachments.map((att, index) => (
              <li
                key={`${att.filename}-${index}`}
                className="flex items-center justify-between gap-2"
              >
                <span>
                  {att.filename} — {att.content_type ?? "?"}{" "}
                  {att.size_bytes != null ? `(${att.size_bytes} bytes)` : ""}
                </span>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={is_attachment_loading === index}
                  onClick={() => handle_download_attachment(index)}
                  aria-label={`Descargar adjunto ${att.filename}`}
                >
                  <Download className="h-4 w-4" aria-hidden="true" />
                  {is_attachment_loading === index
                    ? "Descargando…"
                    : "Descargar"}
                </Button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border border-gray-100 rounded-md p-4 shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-2">Historial de envíos</h2>
        {detail.logs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sin registros aún</p>
        ) : (
          <ul className="text-sm space-y-2">
            {detail.logs.map((log) => (
              <li key={String(log.id_log)} className="flex gap-2 items-start">
                <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700 mt-0.5">
                  {log.level ?? "?"}
                </span>
                <span>
                  {log.message}
                  <span className="text-xs text-muted-foreground block">
                    intento {log.attempt} —{" "}
                    {log.created_at
                      ? new Date(log.created_at).toLocaleString("es-CO")
                      : "—"}
                    {log.smtp_host ? ` (${log.smtp_host})` : ""}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}

export default EmailDetailTemplate;
