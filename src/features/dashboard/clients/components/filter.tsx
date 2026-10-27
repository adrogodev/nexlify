import { FormProvider } from "react-hook-form";
import { Button, Input } from "@/src/shared/ui";
import type { GetClientsParams } from "../actions/objects/requests";
import { CLIENT_STATE_OPTIONS } from "../constants/client-states.constants";
import { useClientsTableFilter } from "./hooks";

export interface ClientsFilterProps {
  size: number;
  params: GetClientsParams;
  onFilterChange: (filters: GetClientsParams) => void;
}

export const ClientsFilterComponent = ({
  props,
}: {
  props: ClientsFilterProps;
}) => {
  const { id_types, filterForm, register, handleReset } = useClientsTableFilter(
    { props },
  );

  return (
    <FormProvider {...filterForm}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-wrap gap-2.5 justify-between items-center bg-white p-4 shadow-sm border border-gray-100"
        aria-label="Filtrar clientes"
      >
        <div className="flex flex-col gap-1 w-full sm:w-40">
          <label htmlFor="id_state" className="sr-only">
            Estado del cliente
          </label>
          <select
            id="id_state"
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
            {...register("id_state")}
          >
            <option value="">Estado: todos</option>
            {CLIENT_STATE_OPTIONS.map((state) => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 w-full sm:w-48">
          <label htmlFor="id_type" className="sr-only">
            Tipo de identificación
          </label>
          <select
            id="id_type"
            className="h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
            {...register("id_type")}
          >
            <option value="">Tipo: todos</option>
            {id_types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.value}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1 w-full md:w-40">
          <label htmlFor="id_number" className="sr-only">
            Número de identificación
          </label>
          <Input
            id="id_number"
            placeholder="N° identificación"
            {...register("id_number")}
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-48">
          <label htmlFor="name" className="sr-only">
            Buscar cliente por nombre
          </label>
          <Input
            id="name"
            className="w-full"
            placeholder="Buscar por nombre..."
            {...register("name")}
          />
        </div>

        <Button type="button" variant="outline" size="sm" onClick={handleReset}>
          Limpiar filtros
        </Button>
      </form>
    </FormProvider>
  );
};

export default ClientsFilterComponent;
