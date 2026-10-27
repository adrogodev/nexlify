"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Input } from "@/src/shared/ui";
import type { ITemplateInfo } from "../actions/templates.actions";
import {
  createTemplateAction,
  getTemplatesAction,
} from "../actions/templates.actions";

const SKELETON_ROWS = [1, 2, 3, 4] as const;

export function TemplatesTemplate() {
  const [items, set_items] = useState<ITemplateInfo[]>([]);
  const [total_items, set_total_items] = useState(0);
  const [page, set_page] = useState(1);
  const [is_loading, set_is_loading] = useState(true);

  const [is_creating, set_is_creating] = useState(false);
  const [draft, set_draft] = useState({ subject: "", template: "" });

  const load = useCallback(async (target_page: number) => {
    set_is_loading(true);
    const result = await getTemplatesAction({ page: target_page, limit: 10 });
    set_is_loading(false);
    if (result.ok && result.data) {
      set_items(result.data.data);
      set_total_items(result.data.total_items);
    } else {
      set_items([]);
    }
  }, []);

  useEffect(() => {
    load(page);
  }, [load, page]);

  const handle_create = async () => {
    set_is_creating(true);
    const result = await createTemplateAction({
      subject: draft.subject || undefined,
      template: draft.template || undefined,
      is_active: true,
    });
    set_is_creating(false);
    if (result.ok) {
      toast.success(result.message ?? "Plantilla creada");
      set_draft({ subject: "", template: "" });
      load(1);
      set_page(1);
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo crear la plantilla");
    }
  };

  const total_page = Math.ceil(total_items / 10);

  return (
    <section className="w-full h-full p-4 space-y-4">
      <header>
        <h1 className="text-xl font-bold">Plantillas de email</h1>
      </header>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          handle_create();
        }}
        className="border border-gray-100 rounded-md p-4 shadow-sm bg-white grid grid-cols-1 gap-3"
        aria-label="Crear plantilla"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="tpl-subject" className="text-sm font-medium">
            Asunto
          </label>
          <Input
            id="tpl-subject"
            value={draft.subject}
            onChange={(e) => set_draft({ ...draft, subject: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="tpl-body" className="text-sm font-medium">
            Cuerpo (HTML)
          </label>
          <textarea
            id="tpl-body"
            className="min-h-24 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
            value={draft.template}
            onChange={(e) => set_draft({ ...draft, template: e.target.value })}
          />
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={is_creating}>
            {is_creating ? "Creando…" : "Crear plantilla"}
          </Button>
        </div>
      </form>

      <div className="rounded-md border border-gray-100 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-sm" aria-busy={is_loading}>
          <caption className="sr-only">Listado de plantillas</caption>
          <thead className="bg-gray-50 text-left">
            <tr>
              {["Nombre", "Asunto", "Estado", "Editar"].map((header) => (
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
                <td colSpan={4}>
                  <div className="space-y-2 p-4">
                    {SKELETON_ROWS.map((row) => (
                      <div
                        key={`template-skeleton-${row}`}
                        className="h-8 w-full rounded bg-gray-50"
                      />
                    ))}
                  </div>
                </td>
              </tr>
            )}
            {!is_loading &&
              items.length > 0 &&
              items.map((item) => (
                <tr
                  key={item.id_template}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{item.name ?? "—"}</td>
                  <td className="px-4 py-3">{item.subject ?? "—"}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
                      {item.is_active ? "Activa" : "Inactiva"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/templates/${item.id_template}`}
                      className="font-medium underline-offset-2 hover:underline"
                      aria-label={`Editar plantilla ${item.name ?? item.id_template}`}
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            {!is_loading && items.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No hay plantillas para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav
        className="flex items-center justify-between p-1"
        aria-label="Paginación de plantillas"
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

export default TemplatesTemplate;
