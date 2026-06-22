import { FormProvider } from "react-hook-form";
import { GetClientsParams } from "../actions/objects/requests";
import { useClientsTableFilter } from "./hooks";

export interface ClientsFilterProps {
    size: number;
    params: GetClientsParams;
    onFilterChange: (filters: GetClientsParams) => void;
}

export const ClientsFilterComponent = ({ props }: { props: ClientsFilterProps }) => {
    const { filterForm, handleReset } = useClientsTableFilter({ props });

    return (
        <FormProvider {...filterForm}>
            <form className="flex flex-col md:flex-row gap-2.5 justify-between items-center bg-white p-4 shadow-sm border border-gray-100">
                <div className="relative w-full md:w-72">

                </div>

            </form>
        </FormProvider>
    )
}