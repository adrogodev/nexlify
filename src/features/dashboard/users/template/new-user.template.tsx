"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { getIdTypesAction } from "@/src/features/dashboard/clients/actions";
import { Button, Input } from "@/src/shared/ui";
import { createUserAction } from "../actions/users.actions";

type CreateUserFormValues = {
  id_type: string;
  id_number: string;
  first_name: string;
  second_name: string;
  first_surname: string;
  second_surname: string;
  email: string;
  cell_callsign: string;
  cell_phone: string;
};

const input_class =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

export function NewUserTemplate() {
  const router = useRouter();
  const [id_type_options, set_id_type_options] = useState<
    Array<{ id: number; value: string }>
  >([]);
  const [is_saving, set_is_saving] = useState(false);

  const form = useForm<CreateUserFormValues>({
    defaultValues: {
      id_type: "",
      id_number: "",
      first_name: "",
      second_name: "",
      first_surname: "",
      second_surname: "",
      email: "",
      cell_callsign: "+57",
      cell_phone: "",
    },
  });
  const { register, handleSubmit } = form;

  useEffect(() => {
    getIdTypesAction().then((result) => {
      if (result.ok && result.data)
        set_id_type_options(
          result.data.map((t) => ({ id: t.id, value: t.value })),
        );
    });
  }, []);

  const on_submit = handleSubmit(async (values) => {
    set_is_saving(true);
    const result = await createUserAction({
      id_type: values.id_type ? Number(values.id_type) : undefined,
      id_number: values.id_number || undefined,
      first_name: values.first_name || undefined,
      second_name: values.second_name || undefined,
      first_surname: values.first_surname || undefined,
      second_surname: values.second_surname || undefined,
      email: values.email || undefined,
      cell_callsign: values.cell_callsign || undefined,
      cell_phone: values.cell_phone || undefined,
    });
    set_is_saving(false);
    if (result.ok) {
      toast.success(result.message ?? "Usuario creado");
      router.push("/dashboard/users");
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo crear el usuario");
    }
  });

  return (
    <section className="w-full max-w-2xl p-4">
      <header className="mb-4">
        <h1 className="text-xl font-bold">Nuevo usuario</h1>
      </header>

      <form
        onSubmit={on_submit}
        noValidate
        className="grid grid-cols-1 gap-4 p-4 shadow-sm border border-gray-100 rounded-md sm:grid-cols-2 bg-white"
        aria-label="Crear usuario"
      >
        <div className="flex flex-col gap-1">
          <label htmlFor="u-id-type" className="text-sm font-medium">
            Tipo de identificación
          </label>
          <select
            id="u-id-type"
            className={input_class}
            {...register("id_type")}
          >
            <option value="">Seleccione…</option>
            {id_type_options.map((type) => (
              <option key={type.id} value={type.id}>
                {type.value}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="u-id-number" className="text-sm font-medium">
            Número de identificación
          </label>
          <Input id="u-id-number" {...register("id_number")} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="u-first-name" className="text-sm font-medium">
            Primer nombre
          </label>
          <Input id="u-first-name" {...register("first_name")} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="u-second-name" className="text-sm font-medium">
            Segundo nombre
          </label>
          <Input id="u-second-name" {...register("second_name")} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="u-first-surname" className="text-sm font-medium">
            Primer apellido
          </label>
          <Input id="u-first-surname" {...register("first_surname")} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="u-second-surname" className="text-sm font-medium">
            Segundo apellido
          </label>
          <Input id="u-second-surname" {...register("second_surname")} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="u-email" className="text-sm font-medium">
            Email
          </label>
          <Input id="u-email" type="email" {...register("email")} />
        </div>
        <div className="flex gap-2">
          <div className="flex flex-col gap-1 w-24">
            <label htmlFor="u-callsign" className="text-sm font-medium">
              Indicativo
            </label>
            <Input id="u-callsign" {...register("cell_callsign")} />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="u-phone" className="text-sm font-medium">
              Teléfono
            </label>
            <Input id="u-phone" {...register("cell_phone")} />
          </div>
        </div>

        <div className="flex gap-2 justify-end sm:col-span-2">
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
            {is_saving ? "Creando…" : "Crear usuario"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default NewUserTemplate;
