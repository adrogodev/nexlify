"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui";
import type { ISubscription } from "../actions/subscriptions.actions";
import {
  createSubscriptionAction,
  getMySubscriptionsAction,
  updateSubscriptionAction,
} from "../actions/subscriptions.actions";
import type { IOwnedWebhookEndpoint } from "../actions/webhooks.actions";
import { getMyWebhookEndpointsAction } from "../actions/webhooks.actions";

const input_class =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

export function SubscriptionsTemplate() {
  const [subs, set_subs] = useState<ISubscription[]>([]);
  const [endpoints, set_endpoints] = useState<IOwnedWebhookEndpoint[]>([]);
  const [endpoint_uuid, set_endpoint_uuid] = useState("");
  const [include_body, set_include_body] = useState("true");
  const [is_loading, set_is_loading] = useState(true);
  const [is_saving, set_is_saving] = useState(false);

  const load = useCallback(async () => {
    set_is_loading(true);
    const [subs_result, endpoints_result] = await Promise.all([
      getMySubscriptionsAction(),
      getMyWebhookEndpointsAction(),
    ]);
    set_subs(subs_result.ok && subs_result.data ? subs_result.data : []);
    set_endpoints(
      endpoints_result.ok && endpoints_result.data ? endpoints_result.data : [],
    );
    set_is_loading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handle_create = async () => {
    if (!endpoint_uuid) {
      toast.error("Selecciona un endpoint");
      return;
    }
    set_is_saving(true);
    const result = await createSubscriptionAction({
      webhook_endpoint_uuid: endpoint_uuid,
      // Backend EmailEventEnum only exposes RECEIVED_REPLY today.
      events: ["RECEIVED_REPLY"],
      include_body: include_body === "true",
    });
    set_is_saving(false);
    if (result.ok) {
      toast.success(result.message ?? "Suscripción creada");
      set_endpoint_uuid("");
      load();
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo crear la suscripción");
    }
  };

  const handle_toggle = async (sub: ISubscription) => {
    const result = await updateSubscriptionAction({
      subscription_uuid: sub.subscription_uuid,
      is_active: !sub.is_active,
    });
    if (result.ok) {
      toast.success("Suscripción actualizada");
      load();
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo actualizar la suscripción");
    }
  };

  return (
    <section className="w-full max-w-4xl p-4 space-y-4">
      <header>
        <h1 className="text-xl font-bold">Suscripciones a eventos</h1>
      </header>

      <div className="border border-gray-100 rounded-md p-4 shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-3">
          Nueva suscripción (evento: respuesta recibida)
        </h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handle_create();
          }}
          className="flex flex-col sm:flex-row gap-3 items-start"
          aria-label="Crear suscripción"
        >
          <div className="flex flex-col gap-1 flex-1 min-w-64">
            <label htmlFor="sub-endpoint" className="text-sm font-medium">
              Endpoint
            </label>
            <select
              id="sub-endpoint"
              className={input_class}
              value={endpoint_uuid}
              onChange={(e) => set_endpoint_uuid(e.target.value)}
            >
              <option value="">Seleccione…</option>
              {endpoints.map((endpoint) => (
                <option
                  key={endpoint.endpoint_uuid}
                  value={endpoint.endpoint_uuid}
                >
                  {endpoint.url}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-1 w-32">
            <label htmlFor="sub-body" className="text-sm font-medium">
              Incluir cuerpo
            </label>
            <select
              id="sub-body"
              className={input_class}
              value={include_body}
              onChange={(e) => set_include_body(e.target.value)}
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
          <Button type="submit" size="sm" disabled={is_saving} className="mt-5">
            {is_saving ? "Creando…" : "Crear suscripción"}
          </Button>
        </form>
      </div>

      <div className="rounded-md border border-gray-100 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-sm" aria-busy={is_loading}>
          <caption className="sr-only">Listado de suscripciones</caption>
          <thead className="bg-gray-50 text-left">
            <tr>
              {["Eventos", "Activa", "Acciones"].map((header) => (
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
              subs.length > 0 &&
              subs.map((sub) => (
                <tr
                  key={sub.subscription_uuid}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{sub.events?.join(", ") || "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {sub.is_active ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handle_toggle(sub)}
                    >
                      {sub.is_active ? "Desactivar" : "Activar"}
                    </Button>
                  </td>
                </tr>
              ))}
            {!is_loading && subs.length === 0 && (
              <tr>
                <td
                  colSpan={3}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No hay suscripciones para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Link
        href="/dashboard/webhooks"
        className="text-sm underline underline-offset-2"
        aria-label="Volver a webhooks"
      >
        ← Volver a webhooks
      </Link>
    </section>
  );
}

export default SubscriptionsTemplate;
