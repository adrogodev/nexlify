"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IBaseResponse } from "@/src/shared/interfaces";

export interface IOwnedWebhookEndpoint {
  id_client: number;
  endpoint_uuid: string;
  url: string;
  is_active: boolean;
  created_at: Nullable<string>;
  updated_at: Nullable<string>;
}

export interface IRegisterWebhookEndpointParams {
  url: string;
  id_client?: number;
}

export interface IWebhookEndpointSecret {
  endpoint_uuid: string;
  /** The signing secret. Returned exactly once per registration. */
  secret: string;
}

export const getMyWebhookEndpointsAction = async () => {
  const MY_ENDPOINTS = "/webhooks/my";

  try {
    const response =
      await fetchServerClient.get<IBaseResponse<IOwnedWebhookEndpoint[]>>(
        MY_ENDPOINTS,
      );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudieron obtener los webhooks",
      };
    }

    return { ok: true, data: response.data.data };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export const registerWebhookEndpointAction = async (
  params: IRegisterWebhookEndpointParams,
) => {
  const REGISTER_ENDPOINT = "/webhooks";

  try {
    const response = await fetchServerClient.post<
      IBaseResponse<IWebhookEndpointSecret>
    >(REGISTER_ENDPOINT, { ...params });
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo registrar el webhook",
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

export interface IUpdateWebhookEndpointParams {
  endpoint_uuid: string;
  url?: string;
  is_active?: boolean;
}

export const updateWebhookEndpointAction = async ({
  endpoint_uuid,
  ...params
}: IUpdateWebhookEndpointParams) => {
  const UPDATE_ENDPOINT = `/webhooks/${endpoint_uuid}`;

  try {
    const response = await fetchServerClient.put<
      IBaseResponse<IOwnedWebhookEndpoint>
    >(UPDATE_ENDPOINT, { ...params });
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo actualizar el webhook",
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
