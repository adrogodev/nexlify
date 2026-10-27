"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IMasterDataResponseObject } from "./objects/responses/get-id-types.response";

export const getIdTypesAction = async () => {
  const GET_ID_TYPES = "/master/id-types";

  try {
    const response =
      await fetchServerClient.get<IMasterDataResponseObject>(GET_ID_TYPES);
    if (response.status !== 200) {
      return {
        ok: false,
        message: "Hubo un error al obtener tipos de identificación",
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
