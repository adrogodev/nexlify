"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Skeleton } from "@/src/shared/ui";
import type { IUserInfo } from "../actions/users.actions";
import {
  getUsersAction,
  updateUserStateAction,
} from "../actions/users.actions";

const SKELETON_ROWS = [1, 2, 3, 4, 5] as const;
const LIMITED_SIZE = 10;

const TABLE_HEADERS = [
  "Nombre",
  "Email",
  "Teléfono",
  "Cliente",
  "Estado",
] as const;

export function UsersTemplate() {
  const [items, set_items] = useState<IUserInfo[]>([]);
  const [total, set_total] = useState(0);
  const [page, set_page] = useState(1);
  const [is_loading, set_is_loading] = useState(true);
  const [is_toggling_id, set_is_toggling_id] = useState<number | null>(null);

  const load_list = useCallback(async () => {
    set_is_loading(true);
    const result = await getUsersAction({ page, limit: LIMITED_SIZE });
    if (result.ok && result.data) {
      set_items(result.data.data ?? []);
      set_total(result.data.total_items);
    } else {
      set_items([]);
    }
    set_is_loading(false);
  }, [page]);

  useEffect(() => {
    load_list();
  }, [load_list]);

  const handle_toggle_state = useCallback(
    async (user: IUserInfo, next_state: boolean) => {
      set_is_toggling_id(user.id_user);
      const result = await updateUserStateAction(user.id_user, next_state);
      set_is_toggling_id(null);
      if (result.ok) {
        toast.success(
          result.message ??
            (next_state ? "Usuario habilitado" : "Usuario deshabilitado"),
        );
        load_list();
      } else {
        toast.error(
          "message" in result
            ? (result.message ?? "No se pudo actualizar el estado")
            : "No se pudo actualizar el estado",
        );
      }
    },
    [load_list],
  );

  const total_page = Math.ceil(total / LIMITED_SIZE);

  return (
    <section className="w-full h-full p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Usuarios</h1>
        <Button asChild size="sm">
          <Link
            href="/dashboard/users/new"
            aria-label="Crear nuevo usuario"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Nuevo usuario
          </Link>
        </Button>
      </header>

      <div className="rounded-md border border-gray-100 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-sm" aria-busy={is_loading}>
          <caption className="sr-only">Listado de usuarios</caption>
          <thead className="bg-gray-50 text-left">
            <tr>
              {TABLE_HEADERS.map((header) => (
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
                <td colSpan={TABLE_HEADERS.length}>
                  <div className="space-y-2 p-4">
                    {SKELETON_ROWS.map((row) => (
                      <Skeleton
                        key={`users-skeleton-${row}`}
                        className="h-8 w-full"
                      />
                    ))}
                  </div>
                </td>
              </tr>
            )}
            {!is_loading &&
              items.length > 0 &&
              items.map((user) => (
                <tr
                  key={user.id_user}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">
                    {[user.first_name, user.first_surname]
                      .filter(Boolean)
                      .join(" ") || "—"}
                  </td>
                  <td className="px-4 py-3">{user.email ?? "—"}</td>
                  <td className="px-4 py-3">
                    {user.cell_phone
                      ? `${user.cell_callsign ?? ""}${user.cell_phone}`
                      : "—"}
                  </td>
                  <td className="px-4 py-3">{user.id_client ?? "—"}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                          user.state
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.state ? "Activo" : "Inactivo"}
                      </span>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={is_toggling_id === user.id_user || is_loading}
                        onClick={() => handle_toggle_state(user, !user.state)}
                        aria-label={
                          user.state
                            ? `Deshabilitar usuario ${user.id_user}`
                            : `Habilitar usuario ${user.id_user}`
                        }
                      >
                        {user.state ? "Deshabilitar" : "Habilitar"}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            {!is_loading && items.length === 0 && (
              <tr>
                <td
                  colSpan={TABLE_HEADERS.length}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No hay usuarios para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav
        className="flex items-center justify-between p-1"
        aria-label="Paginación de usuarios"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => set_page(page - 1)}
          disabled={page <= 1 || is_loading}
          aria-label="Página anterior"
        >
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          Página {page} de {Math.max(total_page, 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => set_page(page + 1)}
          disabled={page >= total_page || is_loading}
          aria-label="Página siguiente"
        >
          Siguiente
        </Button>
      </nav>
    </section>
  );
}

export default UsersTemplate;
