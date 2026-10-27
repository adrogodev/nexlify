"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui";
import {
  addSmtpServerAction,
  getConfigurationAction,
} from "../actions/configuration.action";
import {
  addConfigurationAction,
  updateConfigurationAction,
} from "../actions/configuration-write.action";
import type { IPlatformConfiguration } from "../actions/objects";

const input_class =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

export function SettingsTemplate() {
  const [config, set_config] = useState<IPlatformConfiguration | null>(null);
  const [loaded, set_loaded] = useState(false);

  const reload = useCallback(async () => {
    const result = await getConfigurationAction();
    set_loaded(true);
    if (result.ok && result.data) set_config(result.data);
    else set_config(null);
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  return (
    <section className="w-full p-4 space-y-6">
      <header>
        <h1 className="text-xl font-bold">Configuración</h1>
      </header>

      {!loaded && (
        <p className="text-sm text-muted-foreground">Cargando configuración…</p>
      )}

      {loaded && <SmtpCard config={config} on_done={reload} />}

      {loaded &&
        (config ? (
          <ConfigurationForm config={config} on_done={reload} />
        ) : (
          <ConfigurationFormCreate on_done={reload} />
        ))}
    </section>
  );
}

function SmtpCard({
  config,
  on_done,
}: {
  config: IPlatformConfiguration | null;
  on_done: () => void;
}) {
  const [provider, set_provider] = useState("");
  const [host, set_host] = useState("");
  const [port, set_port] = useState("587");
  const [is_saving, set_is_saving] = useState(false);

  const has_server = Boolean(config?.smtp?.provider);

  const handle_add = async () => {
    set_is_saving(true);
    const result = await addSmtpServerAction({
      provider,
      host,
      port: Number(port),
    });
    set_is_saving(false);
    if (result.ok) {
      toast.success(result.message ?? "Servidor SMTP registrado");
      set_provider("");
      set_host("");
      set_port("587");
      on_done();
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo registrar el servidor SMTP");
    }
  };

  return (
    <div className="border border-gray-100 rounded-md p-4 shadow-sm bg-white">
      <h2 className="text-lg font-semibold mb-2">Servidor SMTP</h2>
      {has_server && (
        <p className="text-sm text-muted-foreground mb-3">
          Actual: <span className="font-medium">{config?.smtp?.provider}</span>
          {config?.smtp?.name ? ` — ${config.smtp.name}` : ""}
          {config?.smtp?.port != null ? ` (puerto ${config.smtp.port})` : ""}
        </p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handle_add();
        }}
        className="flex flex-col sm:flex-row gap-3 items-start"
        aria-label="Registrar servidor SMTP"
      >
        <div className="flex flex-col gap-1 flex-1 min-w-36">
          <label htmlFor="smtp-provider" className="text-sm font-medium">
            Proveedor
          </label>
          <input
            id="smtp-provider"
            className={input_class}
            placeholder="gmail"
            value={provider}
            onChange={(e) => set_provider(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-48">
          <label htmlFor="smtp-host" className="text-sm font-medium">
            Host
          </label>
          <input
            id="smtp-host"
            className={input_class}
            placeholder="smtp.gmail.com"
            value={host}
            onChange={(e) => set_host(e.target.value)}
            required
          />
        </div>
        <div className="flex flex-col gap-1 w-24">
          <label htmlFor="smtp-port" className="text-sm font-medium">
            Puerto
          </label>
          <input
            id="smtp-port"
            className={input_class}
            inputMode="numeric"
            placeholder="587"
            value={port}
            onChange={(e) => set_port(e.target.value)}
            required
          />
        </div>
        <Button type="submit" size="sm" disabled={is_saving} className="mt-5">
          {is_saving ? "Guardando…" : "Registrar servidor"}
        </Button>
      </form>
    </div>
  );
}

function ConfigurationFormCreate({ on_done }: { on_done: () => void }) {
  const [values, set_values] = useState({
    sender_email: "",
    sender_name: "",
    reply_to_email: "",
    mail_application_password: "",
  });
  const [is_saving, set_is_saving] = useState(false);

  const handle_add = async () => {
    set_is_saving(true);
    const result = await addConfigurationAction({
      sender_email: values.sender_email,
      sender_name: values.sender_name,
      reply_to_email: values.reply_to_email || undefined,
      mail_application_password: values.mail_application_password,
    });
    set_is_saving(false);
    if (result.ok) {
      toast.success(result.message ?? "Configuración creada");
      on_done();
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo crear la configuración");
    }
  };

  return (
    <ConfigCard
      title="Configuración de envío (crear)"
      fields={[
        {
          id: "cfg-email",
          label: "Email de envío",
          value: values.sender_email,
          onChange: (v) => set_values({ ...values, sender_email: v }),
          required: true,
        },
        {
          id: "cfg-name",
          label: "Nombre del remitente",
          value: values.sender_name,
          onChange: (v) => set_values({ ...values, sender_name: v }),
          required: true,
        },
        {
          id: "cfg-reply",
          label: "Reply-to (opcional)",
          value: values.reply_to_email,
          onChange: (v) => set_values({ ...values, reply_to_email: v }),
        },
        {
          id: "cfg-pass",
          label: "Contraseña de aplicación",
          value: values.mail_application_password,
          onChange: (v) =>
            set_values({ ...values, mail_application_password: v }),
          required: true,
        },
      ]}
      on_submit={handle_add}
      is_saving={is_saving}
    />
  );
}

function ConfigurationForm({
  config,
  on_done,
}: {
  config: IPlatformConfiguration;
  on_done: () => void;
}) {
  const [values, set_values] = useState({
    sender_email: config.sender.sender_email ?? "",
    sender_name: config.sender.sender_name ?? "",
    reply_to_email: config.sender.reply_to_email ?? "",
    mail_application_password: "",
    daily_send_limit: config.limits.daily_send_limit?.toString?.() ?? "",
    max_retries: config.limits.max_retries?.toString?.() ?? "",
    retry_interval_seconds:
      config.limits.retry_interval_seconds?.toString?.() ?? "",
  });
  const [is_saving, set_is_saving] = useState(false);

  const handle_update = async () => {
    set_is_saving(true);
    const result = await updateConfigurationAction({
      sender_email: values.sender_email,
      sender_name: values.sender_name,
      reply_to_email: values.reply_to_email || undefined,
      mail_application_password: values.mail_application_password || undefined,
      daily_send_limit: values.daily_send_limit
        ? Number(values.daily_send_limit)
        : undefined,
      max_retries: values.max_retries ? Number(values.max_retries) : undefined,
      retry_interval_seconds: values.retry_interval_seconds
        ? Number(values.retry_interval_seconds)
        : undefined,
    });
    set_is_saving(false);
    if (result.ok) {
      toast.success(result.message ?? "Configuración actualizada");
      on_done();
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo actualizar la configuración");
    }
  };

  return (
    <ConfigCard
      title="Límites y envío (actualizar)"
      fields={[
        {
          id: "cfg-email",
          label: "Email de envío",
          value: values.sender_email,
          onChange: (v) => set_values({ ...values, sender_email: v }),
        },
        {
          id: "cfg-name",
          label: "Nombre del remitente",
          value: values.sender_name,
          onChange: (v) => set_values({ ...values, sender_name: v }),
        },
        {
          id: "cfg-reply",
          label: "Reply-to (opcional)",
          value: values.reply_to_email,
          onChange: (v) => set_values({ ...values, reply_to_email: v }),
        },
        {
          id: "cfg-pass",
          label: "Contraseña de aplicación (vacío = no cambia)",
          value: values.mail_application_password,
          onChange: (v) =>
            set_values({ ...values, mail_application_password: v }),
        },
        {
          id: "cfg-daily",
          label: "Límite diario",
          value: values.daily_send_limit,
          onChange: (v) => set_values({ ...values, daily_send_limit: v }),
        },
        {
          id: "cfg-retries",
          label: "Reintentos",
          value: values.max_retries,
          onChange: (v) => set_values({ ...values, max_retries: v }),
        },
        {
          id: "cfg-interval",
          label: "Intervalo de reintento (seg)",
          value: values.retry_interval_seconds,
          onChange: (v) => set_values({ ...values, retry_interval_seconds: v }),
        },
      ]}
      on_submit={handle_update}
      is_saving={is_saving}
    />
  );
}

function ConfigCard({
  title,
  fields,
  on_submit,
  is_saving,
}: {
  title: string;
  fields: Array<{
    id: string;
    label: string;
    value: string;
    onChange: (v: string) => void;
    required?: boolean;
  }>;
  on_submit: () => void;
  is_saving: boolean;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        on_submit();
      }}
      className="border border-gray-100 rounded-md p-4 shadow-sm bg-white"
      aria-label={title}
    >
      <h2 className="text-lg font-semibold mb-3">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {fields.map((field) => (
          <div key={field.id} className="flex flex-col gap-1">
            <label htmlFor={field.id} className="text-sm font-medium">
              {field.label}
            </label>
            <input
              id={field.id}
              className={input_class}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              required={field.required}
            />
          </div>
        ))}
      </div>
      <div className="flex justify-end mt-4">
        <Button type="submit" size="sm" disabled={is_saving}>
          {is_saving ? "Guardando…" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}

export default SettingsTemplate;
