"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type {
  IRegisterClientParams,
  IRegisterClientResponse,
} from "./objects/requests/register-client.request";

export const registerClientAction = async (params: IRegisterClientParams) => {
  const REGISTER_CLIENT = "/client/register";

  try {
    const response = await fetchServerClient.post<IRegisterClientResponse>(
      REGISTER_CLIENT,
      { ...params },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo registrar el cliente",
      };
    }

    return {
      ok: true,
      message: response.data.message ?? "Cliente registrado exitosamente",
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};
