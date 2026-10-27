"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IBaseResponse } from "@/src/shared/interfaces";

export interface IAddConfigurationParams {
  sender_email: string;
  sender_name: string;
  reply_to_email?: string;
  mail_application_password: string;
  id_smtp_server?: number;
  client_id?: string;
  client_secret?: string;
  tenant_id?: string;
  refresh_token?: string;
}

export interface IUpdateConfigurationParams {
  sender_email?: string;
  sender_name?: string;
  reply_to_email?: string;
  mail_application_password?: string;
  id_smtp_server?: number;
  daily_send_limit?: number;
  max_retries?: number;
  retry_interval_seconds?: number;
  email_header_text?: string;
  email_header_html?: string;
  email_header_img_url?: string;
  email_footer_text?: string;
  email_footer_html?: string;
  email_footer_img_url?: string;
}

export const addConfigurationAction = async (
  params: IAddConfigurationParams,
) => {
  const ADD_CONFIGURATION = "/configuration/add";

  try {
    const response = await fetchServerClient.post<IBaseResponse<boolean>>(
      ADD_CONFIGURATION,
      { ...params },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo crear la configuración",
      };
    }

    return {
      ok: true,
      message: response.data.message ?? "Configuración creada exitosamente",
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export const updateConfigurationAction = async (
  params: IUpdateConfigurationParams,
) => {
  const UPDATE_CONFIGURATION = "/configuration/update";

  try {
    const response = await fetchServerClient.put<IBaseResponse<boolean>>(
      UPDATE_CONFIGURATION,
      { ...params },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message:
          response.data.message ?? "No se pudo actualizar la configuración",
      };
    }

    return {
      ok: true,
      message:
        response.data.message ?? "Configuración actualizada exitosamente",
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};
