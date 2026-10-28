"use client";

import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Button, Skeleton } from "@/src/shared/ui";
import type { IEmailListItem } from "../actions/email.actions";
import { getEmailsAction } from "../actions/email.actions";
import { EMAIL_STATE_OPTIONS } from "../constants/email-states.constants";
import type { TEmailState } from "../types/email-states.types";

const SKELETON_ROWS = [1, 2, 3, 4, 5] as const;
const LIMITED_SIZE = 10;

const TABLE_HEADERS = [
  "Código",
  "Para",
  "Asunto",
  "Estado",
  "Intentos",
  "Creado",
] as const;

const input_class =
  "h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

export function EmailsTemplate() {
  const [items, set_items] = useState<IEmailListItem[]>([]);
  const [total, set_total] = useState(0);
  const [page, set_page] = useState(1);
  const [state, set_state] = useState<TEmailState | "">("");
  const [is_loading, set_is_loading] = useState(true);

  const load = useCallback(
    async (target_page: number, target_state: TEmailState | "") => {
      set_is_loading(true);
      const result = await getEmailsAction({
        page: target_page,
        limit: LIMITED_SIZE,
        state: target_state || undefined,
      });
      set_is_loading(false);
      if (result.ok && result.data) {
        set_items(result.data.data ?? []);
        set_total(result.data.total_items);
      } else {
        set_items([]);
      }
    },
    [],
  );

  useEffect(() => {
    load(page, state);
  }, [load, page, state]);

  const total_page = Math.ceil(total / LIMITED_SIZE);

  return (
    <section className="w-full h-full p-4 space-y-4">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Emails</h1>
        <Button asChild size="sm">
          <Link
            href="/dashboard/emails/send"
            aria-label="Enviar nuevo email"
            className="flex items-center gap-1"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Enviar email
          </Link>
        </Button>
      </header>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="email-state" className="text-sm font-medium">
            Estado:
          </label>
          <select
            id="email-state"
            className={input_class}
            value={state}
            onChange={(e) => {
              set_state(e.target.value as TEmailState | "");
              set_page(1);
            }}
          >
            <option value="">todos</option>
            {EMAIL_STATE_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="rounded-md border border-gray-100 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-sm" aria-busy={is_loading}>
          <caption className="sr-only">Listado de emails</caption>
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
                        key={`emails-skeleton-${row}`}
                        className="h-8 w-full"
                      />
                    ))}
                  </div>
                </td>
              </tr>
            )}
            {!is_loading &&
              items.length > 0 &&
              items.map((email) => (
                <tr
                  key={email.email_uuid}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-mono text-xs">
                    <Link
                      href={`/dashboard/emails/${email.email_uuid}`}
                      aria-label={`Ver detalle del email ${email.short_code}`}
                      className="underline-offset-2 hover:underline"
                    >
                      {email.short_code}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{email.to_email}</td>
                  <td className="px-4 py-3">{email.subject}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {email.state ?? "—"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{email.attempts ?? "—"}</td>
                  <td className="px-4 py-3">
                    {email.created_at
                      ? new Date(email.created_at).toLocaleString("es-CO")
                      : "—"}
                  </td>
                </tr>
              ))}
            {!is_loading && items.length === 0 && (
              <tr>
                <td
                  colSpan={TABLE_HEADERS.length}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No hay emails para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav
        className="flex items-center justify-between p-1"
        aria-label="Paginación de emails"
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

export default EmailsTemplate;
