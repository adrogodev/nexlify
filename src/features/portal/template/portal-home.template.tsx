"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button } from "@/src/shared/ui";
import { portalLogoutAction } from "../actions/portal-auth.actions";
import { getPortalClientDataAction } from "../actions/portal-data.actions";

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
    </section>
  );
}

export default PortalHomeTemplate;
