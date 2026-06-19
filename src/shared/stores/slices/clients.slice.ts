import type { PayloadAction } from "@reduxjs/toolkit"
import { getClientsAction } from "@/src/features/dashboard/clients/actions";
import type { GetClientsParams } from "@/src/features/dashboard/clients/actions/objects/requests";
import { appSlice } from "../config";

const clientsSlice = appSlice({
    name: 'clients',
    initialState,
    reducers: (create) => ({
        // ===== CLIENTS LIST =====
        fetchClients: create.asyncThunk(
            async (params?: GetClientsParams) => {
                return await getClientsAction(params);
            },
            {
                pending: (state, action) => {
                    state.clientsListView.status = 'loading';
                    state.clientsListView.params = { ...action.meta.arg, page: action.meta.arg?.page ?? 1, size: action.meta.arg?.size ?? 10 }
                },
                rejected: (state) => {
                    state.clientsListView.status = 'error'
                },
                fulfilled: (state, action) => {
                    if (!action.payload.ok) {
                        state.clientsListView.status = 'error';
                        return;
                    }
                    state.clientsListView.status = 'success';
                    state.clientsListView.clients = action.payload.data?.data!;
                    state.clientsListView.total_items = action.payload.data?.total_items!;
                    state.clientsListView.page = action.payload.data?.page!;
                }
            }
        ),

        setClientsPage: create.reducer((state, action: PayloadAction<number>) => {
            state.clientsListView.params.page = action.payload;
        }),

        setClientsParams: create.reducer((state, action: PayloadAction<GetClientsParams>) => {
            state.clientsListView.params = action.payload;
        })
    })
})