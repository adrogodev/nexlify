"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IGetClientDetailResponseObject } from "./objects/responses/get-client-detail.response";

export const getClientDetailAction = async (id_client: number) => {
  const GET_CLIENT_DETAIL = "/client/detail";
  const url = `${GET_CLIENT_DETAIL}?id_client=${id_client}`;

  try {
    const response =
      await fetchServerClient.get<IGetClientDetailResponseObject>(url);
    if (response.status !== 200) {
      return {
        ok: false,
        message: "No se pudo obtener el detalle del cliente",
      };
    }

    return {
      ok: true,
      data: response.data.data,
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};
