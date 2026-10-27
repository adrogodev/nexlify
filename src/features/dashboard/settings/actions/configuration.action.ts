"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type {
  IAddSmtpServerParams,
  IAddSmtpServerResponse,
  IGetConfigurationResponse,
} from "./objects";

export const getConfigurationAction = async () => {
  const GET_CONFIGURATION = "/configuration/get";

  try {
    const response =
      await fetchServerClient.get<IGetConfigurationResponse>(GET_CONFIGURATION);
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo obtener la configuración",
      };
    }

    return { ok: true, data: response.data.data };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export const addSmtpServerAction = async (params: IAddSmtpServerParams) => {
  const ADD_SMTP_SERVER = "/smtp-server/add";

  try {
    const response = await fetchServerClient.post<IAddSmtpServerResponse>(
      ADD_SMTP_SERVER,
      { ...params },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message:
          response.data.message ?? "No se pudo registrar el servidor SMTP",
      };
    }

    return {
      ok: true,
      message: response.data.message ?? "Servidor SMTP registrado exitosamente",
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};
