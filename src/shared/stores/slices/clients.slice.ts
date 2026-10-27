import type { PayloadAction } from "@reduxjs/toolkit";
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
    page: Nullable<number>;
  };
};

const initialState: ClientsState = {
  clientsListView: {
    clients: [],
    status: "idle",
    error: null,
    params: {
      page: 1,
      size: 10,
    },
    total_items: 0,
    page: null,
  },
};

const clientsSlice = appSlice({
  name: "clients",
  initialState,
  reducers: (create) => ({
    // ===== CLIENTS LIST =====
    fetchClients: create.asyncThunk(
      async (params?: GetClientsParams) => {
        return await getClientsAction(params);
      },
      {
        pending: (state) => {
          state.clientsListView.status = "loading";
        },
        rejected: (state) => {
          state.clientsListView.status = "error";
        },
        fulfilled: (state, action) => {
          // Discard late responses: when filters or page changed while the
          // request was in flight, a stale slower result must not overwrite
          // the list state of the newer query.
          const current = state.clientsListView.params;
          const is_stale =
            action.meta.arg?.page !== current.page ||
            JSON.stringify({ ...action.meta.arg, page: 0, size: 0 }) !==
              JSON.stringify({ ...current, page: 0, size: 0 });

          if (!action.payload.ok) {
            state.clientsListView.status = "error";
            return;
          }
          if (is_stale) return;

          state.clientsListView.status = "success";
          state.clientsListView.clients = action.payload.data?.data!;
          state.clientsListView.total_items = action.payload.data?.total_items!;
          state.clientsListView.page = action.payload.data?.page!;
        },
      },
    ),

    setClientsPage: create.reducer((state, action: PayloadAction<number>) => {
      state.clientsListView.params.page = action.payload;
    }),

    setClientsParams: create.reducer(
      (state, action: PayloadAction<GetClientsParams>) => {
        state.clientsListView.params = action.payload;
      },
    ),
  }),
  selectors: {
    selectClientsListView: (state) => state.clientsListView,
  },
});

export const { fetchClients, setClientsPage, setClientsParams } =
  clientsSlice.actions;
export const { selectClientsListView } = clientsSlice.selectors;

export default clientsSlice.reducer;
