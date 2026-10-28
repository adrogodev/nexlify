"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import type { IEmailDetail } from "../actions/email.actions";
import { getEmailDetailAction } from "../actions/email.actions";
import { EmailDetailActions } from "./email-actions.templates";

const SKELETON_ROWS = [1, 2, 3, 4, 5, 6] as const;

export function EmailDetailTemplate({ email_id }: { email_id: string }) {
  const [detail, set_detail] = useState<IEmailDetail | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

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
            {detail.attachments.map((att) => (
              <li key={att.filename}>
                {att.filename} — {att.content_type ?? "?"}{" "}
                {att.size_bytes != null ? `(${att.size_bytes} bytes)` : ""}
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
