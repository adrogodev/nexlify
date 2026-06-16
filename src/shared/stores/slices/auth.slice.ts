import { getUserAction } from "@/src/features/auth/actions/get-user.action";
import type { IUserDataResponse } from "@/src/features/auth/actions/objects";
import { appSlice } from "../config";
import type { TStatus, TUserState } from "../types";

type AuthState = {
  user_data: {
    status: TStatus;
    data?: IUserDataResponse;
    error?: string;
    user_state: TUserState
  }
}
const initialState: AuthState = {
  user_data: {
    status: 'idle',
    data: undefined,
    error: undefined,
    user_state: 'checking',
  },
}

const authSlice = appSlice({
  name: 'auth',
  initialState,
  reducers: (create) => ({
    getUserData: create.asyncThunk(
      async () => {
        return await getUserAction();
      },
      {
        pending: (state) => {
          state.user_data.status = 'loading';
          state.user_data.user_state = 'checking';
        },
        rejected: (state, action) => {
          state.user_data.status = 'error';
          state.user_data.error = action.payload as string ?? "Error inesperado";
          state.user_data.user_state = 'unauthenticated';
        },
        fulfilled: (state, action) => {
          if (!action.payload.success) {
            state.user_data.error = "Error al obtener datos del usuario";
            state.user_data.status = 'error';
            state.user_data.user_state = 'unauthenticated';
            return;
          }
          state.user_data.status = 'success';
          state.user_data.data = action.payload.data;
          state.user_data.error = undefined;
          state.user_data.user_state = 'authenticated';
        },
      }
    ),
    logout: create.reducer(
      () => {
        return {
          user_data: {
            status: 'success',
            data: undefined,
            error: undefined,
            user_state: 'unauthenticated',
          }
        }
      }
    )
  }),
  selectors: {
    selectUserData: (state) => state.user_data
  }
})

export const { getUserData, logout } = authSlice.actions;
export const { selectUserData } = authSlice.selectors;
export default authSlice.reducer;
