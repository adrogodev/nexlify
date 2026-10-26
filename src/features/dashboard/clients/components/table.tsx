import { Button, Skeleton } from "@/src/shared/ui";
import type { IGetClientsData } from "../actions/objects/responses";
import { ClientsFilterComponent } from "./filter";
import { useClientsTable } from "./hooks";

const TABLE_HEADERS = [
  "Nombre",
  "Identificación",
  "Email",
  "Teléfono",
  "Estado",
] as const;

const SKELETON_ROWS = [1, 2, 3, 4, 5] as const;

export const ClientsTableComponent = () => {
  const {
    params,
    current_page,
    clients,
    status,
    total_page,
    handlePageChange,
    handleFilterChange,
  } = useClientsTable();

  const is_loading = status === "loading";
  const has_rows = clients.length > 0;

  return (
    <div className="space-y-0 h-full flex flex-col">
      <ClientsFilterComponent
        props={{
          size: params.size ?? 10,
          params,
          onFilterChange: handleFilterChange,
        }}
      />

      <div className="rounded-md border border-gray-100 shadow-sm overflow-hidden flex-1">
        <table className="w-full text-sm" aria-busy={is_loading}>
          <caption className="sr-only">Listado de clientes</caption>
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
                        key={`row-skeleton-${row}`}
                        className="h-8 w-full"
                      />
                    ))}
                  </div>
                </td>
              </tr>
            )}

            {!is_loading &&
              has_rows &&
              clients.map((client: IGetClientsData) => (
                <tr
                  key={client.id_client}
                  className="border-t border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3">{client.name}</td>
                  <td className="px-4 py-3">
                    {client.id_type} {client.id_number}
                  </td>
                  <td className="px-4 py-3">{client.email}</td>
                  <td className="px-4 py-3">{client.cell_phone ?? "—"}</td>
                  <td className="px-4 py-3">
                    <ClientStateBadge state={client.state} />
                  </td>
                </tr>
              ))}

            {!is_loading && !has_rows && (
              <tr>
                <td
                  colSpan={TABLE_HEADERS.length}
                  className="px-4 py-10 text-center text-muted-foreground"
                >
                  No hay clientes para mostrar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <nav
        className="flex items-center justify-between p-3"
        aria-label="Paginación de clientes"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(current_page - 1)}
          disabled={current_page <= 1 || is_loading}
          aria-label="Página anterior"
        >
          Anterior
        </Button>

        <span className="text-sm text-muted-foreground">
          Página {current_page} de {Math.max(total_page, 1)}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(current_page + 1)}
          disabled={current_page >= total_page || is_loading}
          aria-label="Página siguiente"
        >
          Siguiente
        </Button>
      </nav>
    </div>
  );
};

function ClientStateBadge({ state }: { state: string }) {
  return (
    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-700">
      {state}
    </span>
  );
}

export default ClientsTableComponent;
