"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button, Input } from "@/src/shared/ui";
import { getIdTypesAction, registerClientAction } from "../actions";
import type { IMasterData } from "../actions/objects/responses";

type RegisterClientFormValues = {
  id_type: string;
  id_number: string;
  name: string;
  email: string;
  cell_callsign: string;
  cell_phone: string;
  user_first_name: string;
  user_second_name: string;
  user_first_surname: string;
  user_second_surname: string;
};

const input_class =
  "h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none";

export function RegisterClientTemplate() {
  const router = useRouter();
  const [id_types, set_id_types] = useState<IMasterData[]>([]);
  const [is_submitting, set_is_submitting] = useState(false);

  const form = useForm<RegisterClientFormValues>({
    defaultValues: {
      id_type: "",
      id_number: "",
      name: "",
      email: "",
      cell_callsign: "+57",
      cell_phone: "",
      user_first_name: "",
      user_second_name: "",
      user_first_surname: "",
      user_second_surname: "",
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = form;

  useEffect(() => {
    getIdTypesAction().then((result) => {
      if (result.ok && result.data) set_id_types(result.data);
    });
  }, []);

  const on_submit = handleSubmit(async (values) => {
    set_is_submitting(true);
    const result = await registerClientAction({
      id_type: Number(values.id_type),
      id_number: values.id_number,
      name: values.name,
      email: values.email,
      cell_callsign: values.cell_callsign,
      cell_phone: values.cell_phone,
      user_first_name: values.user_first_name,
      user_second_name: values.user_second_name || undefined,
      user_first_surname: values.user_first_surname,
      user_second_surname: values.user_second_surname || undefined,
    });
    set_is_submitting(false);

    if (result.ok) {
      toast.success(result.message ?? "Cliente registrado exitosamente");
      router.push("/dashboard/clients");
    } else {
      const detail =
        "error" in result
          ? `${result.message ?? ""} ${result.error ?? ""}`.trim()
          : result.message;
      toast.error(detail || "No se pudo registrar el cliente");
    }
  });

  return (
    <section className="w-full max-w-2xl p-4">
      <header className="mb-4">
        <h1 className="text-xl font-bold">Registrar cliente</h1>
      </header>

      <form
        onSubmit={on_submit}
        noValidate
        className="grid grid-cols-1 gap-4 p-4 shadow-sm border border-gray-100 rounded-md sm:grid-cols-2 bg-white"
      >
        <div className="flex flex-col gap-1 sm:col-span-2">
          <label htmlFor="name" className="text-sm font-medium">
            Nombre de la empresa
          </label>
          <input
            id="name"
            className={input_class}
            placeholder="Nombre comercial"
            {...register("name", { required: true })}
            aria-invalid={Boolean(errors.name)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="id_type" className="text-sm font-medium">
            Tipo de identificación
          </label>
          <select
            id="id_type"
            className={input_class}
            {...register("id_type", { required: true })}
          >
            <option value="">Seleccione…</option>
            {id_types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.value}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="id_number" className="text-sm font-medium">
            Número de identificación
          </label>
          <Input
            id="id_number"
            placeholder="NIT / NUIP"
            {...register("id_number", { required: true })}
            aria-invalid={Boolean(errors.id_number)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="contacto@empresa.com"
            {...register("email", { required: true })}
            aria-invalid={Boolean(errors.email)}
          />
        </div>

        <div className="flex gap-2">
          <div className="flex flex-col gap-1 w-24">
            <label htmlFor="cell_callsign" className="text-sm font-medium">
              Indicativo
            </label>
            <Input
              id="cell_callsign"
              placeholder="+57"
              {...register("cell_callsign", { required: true })}
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <label htmlFor="cell_phone" className="text-sm font-medium">
              Teléfono
            </label>
            <Input
              id="cell_phone"
              placeholder="3000000000"
              {...register("cell_phone", { required: true })}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="user_first_name" className="text-sm font-medium">
            Primer nombre (contacto)
          </label>
          <Input
            id="user_first_name"
            {...register("user_first_name", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="user_second_name" className="text-sm font-medium">
            Segundo nombre
          </label>
          <Input id="user_second_name" {...register("user_second_name")} />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="user_first_surname" className="text-sm font-medium">
            Primer apellido
          </label>
          <Input
            id="user_first_surname"
            {...register("user_first_surname", { required: true })}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="user_second_surname" className="text-sm font-medium">
            Segundo apellido
          </label>
          <Input
            id="user_second_surname"
            {...register("user_second_surname")}
          />
        </div>

        <div className="flex gap-2 justify-end sm:col-span-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => router.back()}
            disabled={is_submitting}
          >
            Cancelar
          </Button>
          <Button type="submit" size="sm" disabled={is_submitting}>
            {is_submitting ? "Registrando…" : "Registrar cliente"}
          </Button>
        </div>
      </form>
    </section>
  );
}

export default RegisterClientTemplate;
