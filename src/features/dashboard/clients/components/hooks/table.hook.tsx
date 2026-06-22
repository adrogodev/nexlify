import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/src/shared/stores";
import { fetchClients, selectClientsListView, setClientsPage, setClientsParams } from "@/src/shared/stores/slices";
import type { GetClientsParams } from "../../actions/objects/requests";

export function useClientsTable() {

    const dispatch = useAppDispatch();

    const { clients, status, params, total_items } = useAppSelector(selectClientsListView);

    const current_page = params.page ?? 1;
    const size = params.size ?? 10;
    const total_page = Math.ceil(total_items / size);

    const handlePageChange = (new_page: number) => {
        dispatch(setClientsPage(new_page));
    }

    const handleFilterChange = (new_filters: GetClientsParams) => {
        dispatch(setClientsParams({ ...new_filters, page: current_page, size }));
    }

    useEffect(() => {
        dispatch(fetchClients(params));
    }, [dispatch, params]);

    useEffect(() => {
        return () => {
            dispatch(setClientsParams({ page: 1, size: 10 }));
        };
    }, [dispatch]);

    return {
        params,
        current_page,
        clients,
        status,
        total_page,
        handlePageChange,
        handleFilterChange
    }
}
