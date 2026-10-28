"use server";

import { fetchPortalClient } from "@/src/lib/clients/fetch/server/portal.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IBaseResponse } from "@/src/shared/interfaces";

interface IClientDataDTO {
  is_admin: boolean;
  id: number;
  name: string;
  username: string;
  ip_connection: string;
  is_active: boolean;
}

export const getPortalClientDataAction = async () => {
  const CLIENT_DATA = "/client/data";

  try {
    const response =
      await fetchPortalClient.get<IBaseResponse<IClientDataDTO>>(CLIENT_DATA);
    if (response.status !== 200) {
      return {
        ok: false,
        message:
          response.data.message ?? "No se pudo obtener los datos del cliente",
      };
    }

    return { ok: true, data: response.data.data };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};
