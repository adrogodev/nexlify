"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Input } from "@/src/shared/ui";
import type {
  IGeneratedNexlifyKey,
  IOwnedNexlifyKey,
} from "../actions/nexlify-keys.actions";
import {
  generateNexlifyKeyAction,
  getMyNexlifyKeysAction,
  revokeNexlifyKeyAction,
} from "../actions/nexlify-keys.actions";

const SKELETON_ROWS = [1, 2, 3] as const;

export function NexlifyKeysTemplate() {
  const [keys, set_keys] = useState<IOwnedNexlifyKey[]>([]);
  const [is_loading, set_is_loading] = useState(true);
  const [id_client_input, set_id_client_input] = useState("");
  const [is_generating, set_is_generating] = useState(false);
  const [generated, set_generated] = useState<IGeneratedNexlifyKey | null>(
    null,
  );

  // Stable reference so the mount effect fetches once; state setters are stable.
  const load = useCallback(async () => {
    set_is_loading(true);
    const result = await getMyNexlifyKeysAction();
    set_is_loading(false);
    set_keys(result.ok && result.data ? result.data : []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handle_generate = async () => {
    set_is_generating(true);
    const result = await generateNexlifyKeyAction(
      id_client_input ? { id_client: Number(id_client_input) } : undefined,
    );
    set_is_generating(false);
    if (result.ok && result.data) {
      set_generated(result.data);
      toast.success(result.message ?? "Clave generada");
      load();
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo generar la clave");
    }
  };

  const handle_revoke = async (id_nexlify_key: number) => {
    const result = await revokeNexlifyKeyAction(id_nexlify_key);
    if (result.ok) {
      toast.success(result.message ?? "Clave revocada");
      load();
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo revocar la clave");
    }
  };

  return (
    <section className="w-full max-w-4xl p-4 space-y-4">
      <header>
        <h1 className="text-xl font-bold">Nexlify Keys</h1>
      </header>

      <div className="border border-gray-100 rounded-md p-4 shadow-sm bg-white">
        <h2 className="text-lg font-semibold mb-3">Generar nueva clave</h2>
        <div className="flex flex-col sm:flex-row gap-3 items-start">
          <div className="flex flex-col gap-1 flex-1 min-w-56">
            <label htmlFor="key-client" className="text-sm font-medium">
              ID del cliente (vacío = para la identidad del token)
            </label>
            <Input
              id="key-client"
              inputMode="numeric"
              placeholder="Ej: 1"
              value={id_client_input}
              onChange={(e) => set_id_client_input(e.target.value)}
            />
          </div>
          <Button
            size="sm"
            onClick={handle_generate}
            disabled={is_generating}
            className="mt-5"
          >
            {is_generating ? "Generandoâ€¦" : "Generar clave"}
          </Button>
        </div>

        {generated && (
          <output className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3">
            <p className="text-sm font-medium">
              Se muestra una única vez, guarda con seguridad:
            </p>
            <code className="block mt-1 text-xs break-all select-all">
              {generated.api_key}
            </code>
          </output>
        )}
      </div>

      <div className="rounded-md border border-gray-100 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-sm" aria-busy={is_loading}>
          <caption className="sr-only">Listado de claves</caption>
          <thead className="bg-gray-50 text-left">
            <tr>
              {["Clave", "Cliente", "Estado", "Creada", "Acciones"].map(
                (header) => (
                  <th
                    key={header}
                    scope="col"
                    className="px-4 py-3 font-medium text-gray-700"
                  >
                    {header}
                  </th>
                ),
              )}
            </tr>
          </thead>
          <tbody>
            {is_loading && (
              <tr>
                <td colSpan={5}>
                  <div className="space-y-2 p-4">
                    {SKELETON_ROWS.map((row) => (
                      <div
                        key={`keys-skeleton-${row}`}
                        className="h-8 w-full rounded bg-gray-50"
                      />
                    ))}
                  </div>
                </td>
              </tr>
            )}
            {!is_loading &&
              keys.length > 0 &&
              keys.map((key) => (
                <tr
                  key={key.id_nexlify_key}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    {key.api_key_masked}
                  </td>
                  <td className="px-4 py-3">{key.id_client}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {key.state ? "Activa" : "Revocada"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {key.created_at
                      ? new Date(key.created_at).toLocaleDateString("es-CO")
                      : "â€”"}
                  </td>
                  <td className="px-4 py-3">
                    {key.state && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handle_revoke(key.id_nexlify_key)}
                      >
                        Revocar
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            {!is_loading && keys.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No hay claves para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default NexlifyKeysTemplate;
