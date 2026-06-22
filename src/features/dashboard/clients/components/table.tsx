import { useClientsTable } from "./hooks"

export const ClientsTableComponent = () => {

    const { params, current_page, clients, status, total_page, handlePageChange, handleFilterChange } = useClientsTable();

    return (
        <div className="space-y-0 h-full flex flex-col">

        </div>
    )
}

export default ClientsTableComponent;
