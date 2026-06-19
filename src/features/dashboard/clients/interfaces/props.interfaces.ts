import type { GetClientsParams } from "../actions/objects/requests";

export interface IFilterClientsTableProps {
    size: number,
    params: GetClientsParams,
    onFilterChange: (filters: GetClientsParams) => void;
}