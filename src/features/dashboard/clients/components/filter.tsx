import { FormProvider } from "react-hook-form";
import { Button, Input } from "@/src/shared/ui";
import type { GetClientsParams } from "../actions/objects/requests";
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
  const { filterForm, handleReset } = useClientsTableFilter({ props });

  return (
    <FormProvider {...filterForm}>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="flex flex-col md:flex-row gap-2.5 justify-between items-center bg-white p-4 shadow-sm border border-gray-100"
        aria-label="Filtrar clientes por nombre"
      >
        <label htmlFor="name" className="sr-only">
          Buscar cliente por nombre
        </label>
        <Input
          id="name"
          className="relative w-full md:w-72"
          placeholder="Buscar por nombre..."
          {...filterForm.register("name")}
        />

        <Button type="button" variant="outline" size="sm" onClick={handleReset}>
          Limpiar filtros
        </Button>
      </form>
    </FormProvider>
  );
};

export default ClientsFilterComponent;
