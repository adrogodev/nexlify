"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui";
import type { IEmailDetail } from "../actions/email.actions";
import { diffuseEmailAction, retryEmailAction } from "../actions/email.actions";

export function EmailDetailActions({
  detail,
  on_done,
}: {
  detail: IEmailDetail;
  on_done: () => void;
}) {
  const [is_retiring, set_is_retiring] = useState(false);

  const can_retry =
    detail.state === "FAILED" ||
    detail.state === "WARNING" ||
    detail.state === "RETRYING";

  const handle_retry = async () => {
    set_is_retiring(true);
    const result = await retryEmailAction(detail.email_uuid);
    set_is_retiring(false);
    if (result.ok) {
      toast.success(result.message ?? "Reintento programado");
      on_done();
    } else {
      const detail_msg =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail_msg || "No se pudo reintentar el envío");
    }
  };

  return (
    <div className="flex items-center gap-2">
      {can_retry && (
        <Button size="sm" onClick={handle_retry} disabled={is_retiring}>
          {is_retiring ? "Reintentando…" : "Reintentar envío"}
        </Button>
      )}
    </div>
  );
}

export function DiffuseForm({ on_done }: { on_done?: () => void }) {
  const [recipients, set_recipients] = useState("");
  const [subject, set_subject] = useState("");
  const [html, set_html] = useState("");
  const [is_sending, set_is_sending] = useState(false);

  const handle_diffuse = async () => {
    const list = recipients
      .split(/[,;\n]/)
      .map((r) => r.trim())
      .filter(Boolean);
    if (list.length === 0 || !subject) {
      toast.error("Ingresa al menos un destinatario y un asunto");
      return;
    }
    set_is_sending(true);
    const result = await diffuseEmailAction({
      recipients: list,
      subject,
      html: html || undefined,
    });
    set_is_sending(false);
    if (result.ok && result.data) {
      toast.success(`Difusión encolada: ${result.data.queued} emails`);
      on_done?.();
    } else {
      const detail_msg =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail_msg || "No se pudo iniciar la difusión");
    }
  };

  const input_class =
    "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handle_diffuse();
      }}
      className="border border-gray-100 rounded-md p-4 shadow-sm bg-white grid grid-cols-1 gap-3"
      aria-label="Difusión masiva"
    >
      <h2 className="text-lg font-semibold">
        Difusión masiva (quedan en cola por el scheduler)
      </h2>
      <div className="flex flex-col gap-1">
        <label htmlFor="diff-recipients" className="text-sm font-medium">
          Destinatarios (separados por coma o salto de línea)
        </label>
        <textarea
          id="diff-recipients"
          className="min-h-20 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          value={recipients}
          onChange={(e) => set_recipients(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="diff-subject" className="text-sm font-medium">
          Asunto
        </label>
        <input
          id="diff-subject"
          className={input_class}
          value={subject}
          onChange={(e) => set_subject(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="diff-html" className="text-sm font-medium">
          HTML (opcional)
        </label>
        <textarea
          id="diff-html"
          className="min-h-20 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-[3px]"
          value={html}
          onChange={(e) => set_html(e.target.value)}
        />
      </div>
      <div className="flex justify-end">
        <Button type="submit" size="sm" disabled={is_sending}>
          {is_sending ? "Encolando…" : "Encolar difusión"}
        </Button>
      </div>
    </form>
  );
}
