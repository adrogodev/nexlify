"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui";
import { getMySubscriptionsAction } from "../actions/subscriptions.actions";
import type { IOwnedWebhookEndpoint } from "../actions/webhooks.actions";
import {
  getMyWebhookEndpointsAction,
  registerWebhookEndpointAction,
  updateWebhookEndpointAction,
} from "../actions/webhooks.actions";

const input_class =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

export function WebhooksTemplate() {
  const [endpoints, set_endpoints] = useState<IOwnedWebhookEndpoint[]>([]);
  const [subscriptions, set_subscriptions] = useState<number>(0);
  const [url, set_url] = useState("");
  const [is_loading, set_is_loading] = useState(true);
  const [is_saving, set_is_saving] = useState(false);
  const [registered_secret, set_registered_secret] = useState<string | null>(
    null,
  );

  const load = useCallback(async () => {
    set_is_loading(true);
    const [endpoints_result, subs_result] = await Promise.all([
      getMyWebhookEndpointsAction(),
      getMySubscriptionsAction(),
    ]);
    set_endpoints(
      endpoints_result.ok && endpoints_result.data ? endpoints_result.data : [],
    );
    set_subscriptions(
      subs_result.ok && subs_result.data ? subs_result.data.length : 0,
    );
    set_is_loading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handle_register = async () => {
    set_is_saving(true);
    const result = await registerWebhookEndpointAction({ url });
    set_is_saving(false);
    if (result.ok && result.data) {
      set_registered_secret(result.data.secret);
      toast.success(result.message ?? "Webhook registrado");
      set_url("");
      load();
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo registrar el webhook");
    }
  };

  const handle_toggle = async (endpoint: IOwnedWebhookEndpoint) => {
    const result = await updateWebhookEndpointAction({
      endpoint_uuid: endpoint.endpoint_uuid,
      is_active: !endpoint.is_active,
    });
    if (result.ok) {
      toast.success("Webhook actualizado");
      load();
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo actualizar el webhook");
    }
  };

  return (
    <section className="w-full max-w-4xl p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Webhooks</h1>
        <Link
          href="/dashboard/subscriptions"
          className="text-sm underline underline-offset-2"
          aria-label="Gestionar suscripciones"
        >
          Suscripciones ({subscriptions})
        </Link>
      </header>

      <div className="border border-gray-100 rounded-md p-4 shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-3">Registrar endpoint</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handle_register();
          }}
          className="flex flex-col sm:flex-row gap-3 items-start"
          aria-label="Registrar webhook"
        >
          <div className="flex flex-col gap-1 flex-1 min-w-64">
            <label htmlFor="wh-url" className="text-sm font-medium">
              URL de notificación
            </label>
            <input
              id="wh-url"
              className={input_class}
              placeholder="https://miapp.com/webhook"
              value={url}
              onChange={(e) => set_url(e.target.value)}
              required
            />
          </div>
          <Button type="submit" size="sm" disabled={is_saving} className="mt-5">
            {is_saving ? "Registrando…" : "Registrar"}
          </Button>
        </form>

        {registered_secret && (
          <output className="mt-4 block rounded-md border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-medium">
              Secret de firma (se muestra una única vez):
            </p>
            <code className="block mt-1 text-xs break-all select-all">
              {registered_secret}
            </code>
          </output>
        )}
      </div>

      <div className="rounded-md border border-gray-100 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-sm" aria-busy={is_loading}>
          <caption className="sr-only">Listado de webhooks</caption>
          <thead className="bg-gray-50 text-left">
            <tr>
              {["URL", "Activo", "Acciones"].map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="px-4 py-3 font-medium text-gray-700"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {is_loading && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  Cargando…
                </td>
              </tr>
            )}
            {!is_loading &&
              endpoints.length > 0 &&
              endpoints.map((endpoint) => (
                <tr
                  key={endpoint.endpoint_uuid}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 break-all">{endpoint.url}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {endpoint.is_active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handle_toggle(endpoint)}
                    >
                      {endpoint.is_active ? "Desactivar" : "Activar"}
                    </Button>
                  </td>
                </tr>
              ))}
            {!is_loading && endpoints.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No hay webhooks para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default WebhooksTemplate;
