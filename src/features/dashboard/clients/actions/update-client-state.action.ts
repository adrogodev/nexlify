"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IBaseResponse } from "@/src/shared/interfaces";

export interface IUpdateClientStateParams {
  id_client: number;
  id_client_state: number;
}

export const updateClientStateAction = async ({
  id_client,
  id_client_state,
}: IUpdateClientStateParams) => {
  const UPDATE_CLIENT_STATE = "/client/state";

  try {
    const response = await fetchServerClient.put<IBaseResponse<boolean>>(
      UPDATE_CLIENT_STATE,
      {
        id_client,
        id_client_state,
      },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message:
          response.data.message ??
          "No se pudo actualizar el estado del cliente",
      };
    }

    return { ok: true, message: response.data.message };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};
