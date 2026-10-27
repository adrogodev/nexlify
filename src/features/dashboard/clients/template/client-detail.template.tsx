"use client";

import { Link2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/src/shared/stores";
import {
  fetchClientDetail,
  selectClientsDetailView,
} from "@/src/shared/stores/slices";
import { Button } from "@/src/shared/ui";
import { updateClientStateAction } from "../actions/update-client-state.action";
import { CLIENT_STATE_OPTIONS } from "../constants/client-states.constants";

export interface ClientDetailTemplateProps {
  id_client: number;
}

const SKELETON_ROWS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export function ClientDetailTemplate({ id_client }: ClientDetailTemplateProps) {
  const dispatch = useAppDispatch();
  const { data, status, error } = useAppSelector(selectClientsDetailView);

  // Target state pick; "" means no change requested yet. The refresh flow
  // runs through fetchClientDetail so the view always reflects the backend.
  const [next_state, set_next_state] = useState("");
  const [is_updating, set_is_updating] = useState(false);

  useEffect(() => {
    dispatch(fetchClientDetail(id_client));
    set_next_state("");
  }, [dispatch, id_client]);

  const handle_state_change = async () => {
    if (!data || next_state === "") return;
    set_is_updating(true);
    const result = await updateClientStateAction({
      id_client: data.id_client,
      id_client_state: Number(next_state),
    });
    set_is_updating(false);

    if (result.ok) {
      toast.success(result.message ?? "Estado actualizado");
      dispatch(fetchClientDetail(id_client));
      set_next_state("");
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo actualizar el estado");
    }
  };

  const current_state_value = data ? String(data.id_state) : "";

  if (status === "loading" || status === "idle") {
    return (
      <div className="animate-pulse space-y-6 p-4" aria-busy="true">
        <div className="h-8 w-64 rounded bg-gray-100" />
        <dl className="grid grid-cols-1 gap-6 p-4 shadow-sm border border-gray-100 rounded-md md:grid-cols-2">
          {SKELETON_ROWS.map((row) => (
            <div
              key={`detail-skeleton-${row}`}
              className="h-6 w-full rounded bg-gray-50"
            />
          ))}
        </dl>
      </div>
    );
  }

  if (status === "error" || !data) {
    return (
      <div role="alert" className="p-4">
        <p className="text-sm text-red-500">
          {error ?? "No se pudo cargar el detalle del cliente"}
        </p>
      </div>
    );
  }

  const rows: Array<{ label: string; value: string }> = [
    { label: "Estado", value: data.state },
    {
      label: "Tipo de identificación",
      value: `${data.id_type_code} — ${data.id_type_name}`,
    },
    { label: "Número de identificación", value: data.id_number },
    { label: "Email", value: data.email },
    { label: "Teléfono", value: `${data.cell_callsign}${data.cell_phone}` },
    { label: "Usuario de acceso", value: data.admin_user || "—" },
    {
      label: "Fecha de registro",
      value: new Date(data.created_at).toLocaleDateString("es-CO", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    },
  ];

  return (
    <section className="w-full h-full">
      <header className="flex items-center justify-between gap-2 p-4">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            aria-label="Volver al listado de clientes"
          >
            <Link href="/dashboard/clients">←</Link>
          </Button>
          <h1 className="text-xl font-bold">
            <Link2 className="mr-2 inline h-4 w-4" aria-hidden="true" />
            {data.name}
          </h1>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
            {data.state}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="next_state" className="sr-only">
            Cambiar estado del cliente
          </label>
          <select
            id="next_state"
            className="h-8 rounded-md border border-input bg-transparent px-2 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
            value={next_state}
            onChange={(e) => set_next_state(e.target.value)}
          >
            <option value="">Cambiar estado…</option>
            {CLIENT_STATE_OPTIONS.filter(
              (option) => option.value !== Number(current_state_value),
            ).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <Button
            size="sm"
            onClick={handle_state_change}
            disabled={next_state === "" || is_updating}
          >
            {is_updating ? "Actualizando…" : "Aplicar"}
          </Button>
        </div>
      </header>

      <dl className="grid grid-cols-1 gap-4 p-4 shadow-sm border border-gray-100 rounded-md md:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="flex flex-col gap-1">
            <dt className="text-sm font-medium text-gray-700">{row.label}</dt>
            <dd className="text-sm text-gray-900">{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default ClientDetailTemplate;
