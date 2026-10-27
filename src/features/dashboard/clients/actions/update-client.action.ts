"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IBaseResponse } from "@/src/shared/interfaces";

export interface IUpdateClientParams {
  id_client: number;
  name?: string;
  email?: string;
  cell_callsign?: string;
  cell_phone?: string;
}

export const updateClientAction = async (params: IUpdateClientParams) => {
  const UPDATE_CLIENT = "/client/update";

  try {
    const response = await fetchServerClient.put<IBaseResponse<boolean>>(
      UPDATE_CLIENT,
      { ...params },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo actualizar el cliente",
      };
    }

    return {
      ok: true,
      message: response.data.message ?? "Cliente actualizado exitosamente",
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};
