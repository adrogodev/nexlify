"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getConfigurationAction } from "@/src/features/dashboard/settings/actions/configuration.action";
import { Button } from "@/src/shared/ui";
import { sendEmailAction } from "../actions/email.actions";

export function SendEmailTemplate() {
  const router = useRouter();
  const [values, set_values] = useState({
    from: "",
    to: "",
    subject: "",
    html: "",
  });
  const [is_sending, set_is_sending] = useState(false);

  useEffect(() => {
    getConfigurationAction().then((result) => {
      if (result.ok && result.data) {
        set_values((v) => ({ ...v, from: result.data!.sender.sender_email }));
      }
    });
  }, []);

  const handle_send = async () => {
    const list = values.to
      .split(/[,;\n]/)
      .map((r) => r.trim())
      .filter(Boolean);
    if (!values.from || list.length === 0 || !values.subject) {
      toast.error("Completa remitente, al menos un destinatario y asunto");
      return;
    }
    set_is_sending(true);
    const result = await sendEmailAction({
      from: values.from,
      to: list,
      subject: values.subject,
      html: values.html || undefined,
    });
    set_is_sending(false);
    if (result.ok) {
      toast.success(result.message ?? "Email enviado");
      router.push("/dashboard/emails");
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo enviar el email");
    }
  };

  const input_class =
    "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

  return (
    <section className="w-full max-w-2xl p-4 space-y-4">
      <header>
        <h1 className="text-xl font-bold">Enviar email</h1>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handle_send();
        }}
        className="border border-gray-100 rounded-md p-4 shadow-sm bg-white grid grid-cols-1 gap-3"
        aria-label="Enviar email"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="em-from" className="text-sm font-medium">
            De
          </label>
          <input
            id="em-from"
            className={input_class}
            value={values.from}
            onChange={(e) => set_values({ ...values, from: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="em-to" className="text-sm font-medium">
            Para (separados por coma o salto de línea)
          </label>
          <textarea
            id="em-to"
            className="min-h-16 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
            value={values.to}
            onChange={(e) => set_values({ ...values, to: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="em-subject" className="text-sm font-medium">
            Asunto
          </label>
          <input
            id="em-subject"
            className={input_class}
            value={values.subject}
            onChange={(e) => set_values({ ...values, subject: e.target.value })}
            required
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="em-html" className="text-sm font-medium">
            HTML (opcional)
          </label>
          <textarea
            id="em-html"
            className="min-h-32 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none"
            value={values.html}
            onChange={(e) => set_values({ ...values, html: e.target.value })}
          />
        </div>
        <div className="flex gap-2 justify-end">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            disabled={is_sending}
          >
            Cancelar
          </Button>
          <Button type="submit" size="sm" disabled={is_sending}>
            {is_sending ? "Enviando…" : "Enviar"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default SendEmailTemplate;
