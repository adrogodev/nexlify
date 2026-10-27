import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useDebounce } from "@/src/shared/hooks";
import { getIdTypesAction } from "../../actions/get-id-types.action";
import type { GetClientsParams } from "../../actions/objects/requests";
import type { IMasterData } from "../../actions/objects/responses";
import type { ClientsFilterProps } from "../filter";

/**
 * Native form inputs always yield strings, so the filter form binds to
 * string values and converts them before dispatching search params.
 */
type GetClientsFormValues = {
  id_state?: string;
  id_type?: string;
  id_number?: string;
  name?: string;
};

function to_search_query(
  size: number,
  values: GetClientsFormValues,
): GetClientsParams {
  const query: GetClientsParams = { page: 1, size };
  if (values.id_state && values.id_state !== "all")
    query.id_state = Number(values.id_state);
  if (values.id_type && values.id_type !== "all")
    query.id_type = Number(values.id_type);
  if (values.id_number) query.id_number = values.id_number;
  if (values.name) query.name = values.name;
  return query;
}

export function useClientsTableFilter({
  props,
}: {
  props: ClientsFilterProps;
}) {
  const { size, params, onFilterChange } = props;

  const filterForm = useForm<GetClientsFormValues>({
    defaultValues: {
      id_state: params.id_state ? String(params.id_state) : "",
      id_type: params.id_type ? String(params.id_type) : "",
      id_number: params.id_number ? String(params.id_number) : "",
      name: params.name || "",
    },
  });

  const { register, reset, watch } = filterForm;

  const id_state = watch("id_state");
  const id_type = watch("id_type");
  const id_number = watch("id_number");
  const name = watch("name");

  const debounced_name = useDebounce(name, 500);
  const debounced_id_number = useDebounce(id_number, 500);

  // Stable callback ref: keeps the effect below independent of the handler's
  // render-time identity so filter changes only refetch on real input changes.
  const on_filter_change_ref = useRef(onFilterChange);
  on_filter_change_ref.current = onFilterChange;

  const [id_types, set_id_types] = useState<IMasterData[]>([]);

  useEffect(() => {
    let cancelled = false;
    getIdTypesAction().then((result) => {
      if (result.ok && result.data && !cancelled) set_id_types(result.data);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleReset = () => {
    reset({
      id_state: "",
      id_type: "",
      id_number: "",
      name: "",
    });
  };

  useEffect(() => {
    const query = to_search_query(size, {
      id_state,
      id_type,
      id_number: debounced_id_number,
      name: debounced_name,
    });

    on_filter_change_ref.current(query);
  }, [size, id_state, id_type, debounced_id_number, debounced_name]);

  return {
    id_types,
    filterForm,
    register,
    handleReset,
  };
}
