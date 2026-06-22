import type { PayloadAction } from "@reduxjs/toolkit"
import { getClientsAction } from "@/src/features/dashboard/clients/actions";
import type { GetClientsParams } from "@/src/features/dashboard/clients/actions/objects/requests";
import type { IGetClientsData } from "@/src/features/dashboard/clients/actions/objects/responses";
import { appSlice } from "../config";
import type { TStatus } from "../types";

type ClientsState = {
    clientsListView: {
        clients: IGetClientsData[];
        status: TStatus;
        error?: Nullable<string>;
        params: GetClientsParams;
        total_items: number;
        page: Nullable<number>
    }
}


const initialState: ClientsState = {
    clientsListView: {
        clients: [],
        status: 'idle',
        error: null,
        params: {
            page: 1,
            size: 10
        },
        total_items: 0,
        page: null
    }
}

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
    }),
    selectors: {
        selectClientsListView: (state) => state.clientsListView
    }
});

export const { fetchClients, setClientsPage, setClientsParams } = clientsSlice.actions;
export const { selectClientsListView } = clientsSlice.selectors;

export default clientsSlice.reducer;

