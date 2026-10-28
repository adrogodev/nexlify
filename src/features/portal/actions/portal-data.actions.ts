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

export interface IUpdateClientParams {
  name?: string;
  email?: string;
  cell_callsign?: string;
  cell_phone?: string;
}

export const updatePortalClientAction = async (params: IUpdateClientParams) => {
  const CLIENT_UPDATE = "/client/update";

  try {
    const response = await fetchPortalClient.put<
      IBaseResponse<{ updated?: boolean }>
    >(CLIENT_UPDATE, { ...params });
    if (response.status !== 200) {
      return {
        ok: false,
        message:
          response.data.message ??
          "No se pudo actualizar el perfil del cliente",
      };
    }

    return {
      ok: true,
      message: response.data.message ?? "Perfil actualizado exitosamente",
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

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
