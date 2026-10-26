import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "@/src/shared/hooks";
import type { GetClientsParams } from "../../actions/objects/requests";
import type { ClientsFilterProps } from "../filter";

export function useClientsTableFilter({
  props,
}: {
  props: ClientsFilterProps;
}) {
  const { size, params, onFilterChange } = props;

  const filterForm = useForm<GetClientsParams>({
    defaultValues: {
      id_state: params.id_state,
      id_type: params.id_type,
      id_number: params.id_number,
      name: params.name || "",
    },
  });

  const { watch, reset } = filterForm;

  const id_state = watch("id_state");
  const id_type = watch("id_type");
  const id_number = watch("id_number");
  const name = watch("name");

  const debounced_name = useDebounce(name, 500);

  // Stable callback ref: keeps the effect below independent of the handler's
  // render-time identity so filter changes only refetch on real input changes.
  const on_filter_change_ref = useRef(onFilterChange);
  on_filter_change_ref.current = onFilterChange;

  const handleReset = () => {
    reset({
      id_state: undefined,
      id_type: undefined,
      id_number: undefined,
      name: "",
    });
  };

  useEffect(() => {
    const query: GetClientsParams = {
      page: 1,
      size,
    };
    if (id_state && String(id_state) !== "all")
      query.id_state = Number(id_state);
    if (id_type && String(id_type) !== "all") query.id_type = Number(id_type);
    if (id_number && String(id_number) !== "all")
      query.id_number = Number(id_number);
    if (debounced_name) query.name = debounced_name;

    on_filter_change_ref.current(query);
  }, [size, id_state, id_type, id_number, debounced_name]);

  return {
    filterForm,
    handleReset,
  };
}
