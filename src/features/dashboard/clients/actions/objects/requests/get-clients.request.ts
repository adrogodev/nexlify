export type GetClientsParams = PaginationParams & {
    id_state?: number;
    id_type?: number;
    id_number?: number,
    name?: string
}