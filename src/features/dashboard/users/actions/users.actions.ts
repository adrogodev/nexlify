"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IBaseResponse } from "@/src/shared/interfaces";

export interface IUserInfo {
  id_user: number;
  id_client?: Nullable<number>;
  id_type?: Nullable<number>;
  id_number?: Nullable<string>;
  first_name?: Nullable<string>;
  second_name?: Nullable<string>;
  first_surname?: Nullable<string>;
  second_surname?: Nullable<string>;
  email?: Nullable<string>;
  cell_callsign?: Nullable<string>;
  cell_phone?: Nullable<string>;
  birthdate?: Nullable<string>;
  state?: Nullable<boolean>;
  created_at?: Nullable<string>;
}

export interface IGetUsersParams {
  page?: number;
  limit?: number;
  id_client?: number;
}

export interface IGetUsersResponse
  extends IBaseResponse<PaginationResponse<IUserInfo[]>> {}

export const getUsersAction = async (params?: IGetUsersParams) => {
  const GET_USERS = "/users";
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.id_client) query.set("id_client", params.id_client.toString());
  const url = query.size > 0 ? `${GET_USERS}?${query.toString()}` : GET_USERS;

  try {
    const response = await fetchServerClient.get<IGetUsersResponse>(url);
    if (response.status !== 200) {
      return { ok: false, message: "No se pudieron obtener los usuarios" };
    }

    return { ok: true, data: response.data.data };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export interface ICreateUserParams {
  id_client?: number;
  id_type?: number;
  id_number?: string;
  first_name?: string;
  second_name?: string;
  first_surname?: string;
  second_surname?: string;
  email?: string;
  cell_callsign?: string;
  cell_phone?: string;
}

export const createUserAction = async (params: ICreateUserParams) => {
  const CREATE_USER = "/users";

  try {
    const response = await fetchServerClient.post<IBaseResponse<IUserInfo>>(
      CREATE_USER,
      { ...params },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo crear el usuario",
      };
    }

    return {
      ok: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export interface IUpdateUserParams {
  id_user: number;
  id_number?: string;
  first_name?: string;
  second_name?: string;
  first_surname?: string;
  second_surname?: string;
  email?: string;
  cell_callsign?: string;
  cell_phone?: string;
}

export const updateUserAction = async ({
  id_user,
  ...params
}: IUpdateUserParams) => {
  const UPDATE_USER = `/users/${id_user}`;

  try {
    const response = await fetchServerClient.put<IBaseResponse<IUserInfo>>(
      UPDATE_USER,
      { ...params },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo actualizar el usuario",
      };
    }

    return {
      ok: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};
