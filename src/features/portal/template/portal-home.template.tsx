"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui";
import { portalLogoutAction } from "../actions/portal-auth.actions";
import {
  getPortalClientDataAction,
  updatePortalClientAction,
} from "../actions/portal-data.actions";

interface IClientData {
  is_admin: boolean;
  id: number;
  name: string;
  username: string;
  ip_connection: string;
  is_active: boolean;
}

export function PortalHomeTemplate() {
  const router = useRouter();
  const [data, set_data] = useState<IClientData | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  const load = useCallback(async () => {
    set_is_loading(true);
    const result = await getPortalClientDataAction();
    set_is_loading(false);
    if (result.ok && result.data) {
      set_data(result.data);
      set_error(null);
    } else {
      set_error(
        "error" in result
          ? String(result.error ?? "")
          : (result.message ?? null),
      );
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handle_logout = async () => {
    await portalLogoutAction();
    router.push("/portal/login");
  };

  const [is_saving_profile, set_is_saving_profile] = useState(false);

  const handle_save_profile = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      const form_data = new FormData(event.currentTarget);
      set_is_saving_profile(true);
      const result = await updatePortalClientAction({
        name: String(form_data.get("name") ?? "").trim() || undefined,
        email: String(form_data.get("email") ?? "").trim() || undefined,
        cell_callsign:
          String(form_data.get("cell_callsign") ?? "").trim() || undefined,
        cell_phone:
          String(form_data.get("cell_phone") ?? "").trim() || undefined,
      });
      set_is_saving_profile(false);
      if (result.ok) {
        toast.success(result.message ?? "Perfil actualizado exitosamente");
        load();
      } else {
        toast.error(
          "message" in result
            ? (result.message ?? "No se pudo actualizar el perfil")
            : "No se pudo actualizar el perfil",
        );
      }
    },
    [load],
  );

  return (
    <section className="w-full max-w-xl mx-auto p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Mi portal</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={handle_logout}
          aria-label="Cerrar sesión"
        >
          Cerrar sesión
        </Button>
      </header>

      {is_loading && (
        <p className="text-sm text-muted-foreground">Cargando datos…</p>
      )}

      {!is_loading && !data && (
        <div role="alert" className="space-y-2">
          <p className="text-sm text-red-500">{error ?? "Sesión no válida"}</p>
          <Button asChild size="sm">
            <a href="/portal/login">Ir a iniciar sesión</a>
          </Button>
        </div>
      )}

      {data && (
        <dl className="grid grid-cols-1 gap-3 p-4 border border-gray-100 rounded-md shadow-sm bg-white sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-gray-700">Cliente</dt>
            <dd className="text-sm">{data.name}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-gray-700">Usuario</dt>
            <dd className="text-sm">{data.username}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-gray-700">Conexión IP</dt>
            <dd className="text-sm">{data.ip_connection}</dd>
          </div>
          <div className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-gray-700">Estado</dt>
            <dd className="text-sm">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                {data.is_active ? "Activo" : "Inactivo"}
              </span>
            </dd>
          </div>
        </dl>
      )}

      {data && (
        <form
          onSubmit={handle_save_profile}
          className="space-y-3 p-4 border border-gray-100 rounded-md shadow-sm bg-white"
        >
          <h2 className="text-lg font-semibold">Editar datos</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label
                htmlFor="pf-name"
                className="text-sm font-medium text-gray-700"
              >
                Nombre
              </label>
              <input
                id="pf-name"
                name="name"
                type="text"
                defaultValue={data.name}
                className="border border-gray-200 rounded px-2 py-1 text-sm"
                placeholder="Nombre del cliente"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="pf-email"
                className="text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="pf-email"
                name="email"
                type="email"
                className="border border-gray-200 rounded px-2 py-1 text-sm"
                placeholder="nuevo email (opcional)"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="pf-cell-callsign"
                className="text-sm font-medium text-gray-700"
              >
                Indicativo
              </label>
              <input
                id="pf-cell-callsign"
                name="cell_callsign"
                type="text"
                className="border border-gray-200 rounded px-2 py-1 text-sm"
                placeholder="+57 (opcional)"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label
                htmlFor="pf-cell-phone"
                className="text-sm font-medium text-gray-700"
              >
                Teléfono
              </label>
              <input
                id="pf-cell-phone"
                name="cell_phone"
                type="text"
                className="border border-gray-200 rounded px-2 py-1 text-sm"
                placeholder="Teléfono (opcional)"
              />
            </div>
          </div>
          <Button type="submit" size="sm" disabled={is_saving_profile}>
            {is_saving_profile ? "Guardando…" : "Guardar cambios"}
          </Button>
        </form>
      )}
    </section>
  );
}

export default PortalHomeTemplate;
