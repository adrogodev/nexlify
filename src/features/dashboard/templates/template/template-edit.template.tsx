"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/src/shared/ui";
import type { ITemplateInfo } from "../actions/templates.actions";
import {
  getTemplatesAction,
  updateTemplateAction,
} from "../actions/templates.actions";

export function TemplateEditTemplate({ id_template }: { id_template: string }) {
  const router = useRouter();
  const id = id_template;

  const [item, set_item] = useState<ITemplateInfo | null>(null);
  const [not_found, set_not_found] = useState(false);
  const [draft, set_draft] = useState({
    subject: "",
    template: "",
    is_active: "true",
  });
  const [is_saving, set_is_saving] = useState(false);

  useEffect(() => {
    if (!id) return;
    getTemplatesAction({ page: 1, limit: 100 }).then((result) => {
      if (!result.ok || !result.data) {
        set_not_found(true);
        return;
      }
      const found =
        (result.data.data as ITemplateInfo[]).find(
          (t) => t.id_template === id,
        ) ?? null;
      if (!found) {
        set_not_found(true);
        return;
      }
      set_item(found);
      set_draft({
        subject: found.subject ?? "",
        template: found.template ?? "",
        is_active: found.is_active ? "true" : "false",
      });
    });
  }, [id]);

  const handle_save = async () => {
    if (!item) return;
    set_is_saving(true);
    const result = await updateTemplateAction({
      id: item.id_template,
      subject: draft.subject,
      template: draft.template,
      is_active: draft.is_active === "true",
    });
    set_is_saving(false);
    if (result.ok) {
      toast.success(result.message ?? "Plantilla actualizada");
      router.push("/dashboard/templates");
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo actualizar la plantilla");
    }
  };

  const input_class =
    "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

  return (
    <section className="w-full max-w-3xl p-4 space-y-4">
      <header>
        <h1 className="text-xl font-bold">
          Editar plantilla {item?.name ? `— ${item.name}` : ""}
        </h1>
      </header>

      {not_found && (
        <p role="alert" className="text-sm text-red-500">
          Plantilla no encontrada
        </p>
      )}

      {item && !not_found && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handle_save();
          }}
          className="border border-gray-100 rounded-md p-4 shadow-sm bg-white grid grid-cols-1 gap-3"
          aria-label="Editar plantilla"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="tpl-edit-subject" className="text-sm font-medium">
              Asunto
            </label>
            <input
              id="tpl-edit-subject"
              className={input_class}
              value={draft.subject}
              onChange={(e) => set_draft({ ...draft, subject: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="tpl-edit-active" className="text-sm font-medium">
              Estado
            </label>
            <select
              id="tpl-edit-active"
              className={input_class}
              value={draft.is_active}
              onChange={(e) =>
                set_draft({ ...draft, is_active: e.target.value })
              }
            >
              <option value="true">Activa</option>
              <option value="false">Inactiva</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="tpl-edit-body" className="text-sm font-medium">
              Cuerpo (HTML)
            </label>
            <textarea
              id="tpl-edit-body"
              className="min-h-48 rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              value={draft.template}
              onChange={(e) =>
                set_draft({ ...draft, template: e.target.value })
              }
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              disabled={is_saving}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={is_saving}>
              {is_saving ? "Guardando…" : "Guardar cambios"}
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}

export default TemplateEditTemplate;
