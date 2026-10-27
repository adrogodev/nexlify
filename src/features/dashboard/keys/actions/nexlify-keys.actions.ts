"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IBaseResponse } from "@/src/shared/interfaces";

export interface IGeneratedNexlifyKey {
  id_nexlify_key: number;
  id_client: number;
  /** The raw API key. Returned exactly once, never stored in plain text. */
  api_key: string;
  created_at: string;
}

export interface IOwnedNexlifyKey {
  api_key_masked: string;
  id_nexlify_key: number;
  id_client: number;
  state: boolean;
  created_at: Nullable<string>;
}

export interface IGenerateKeyParams {
  id_client?: number;
}

export const generateNexlifyKeyAction = async (params?: IGenerateKeyParams) => {
  const GENERATE_KEY = "/nexlify-keys/generate";

  try {
    const response = await fetchServerClient.post<
      IBaseResponse<IGeneratedNexlifyKey>
    >(GENERATE_KEY, { ...params });
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo generar la clave",
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

export const getMyNexlifyKeysAction = async () => {
  const MY_KEYS = "/nexlify-keys/my";

  try {
    const response =
      await fetchServerClient.get<IBaseResponse<IOwnedNexlifyKey[]>>(MY_KEYS);
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudieron obtener las claves",
      };
    }

    return { ok: true, data: response.data.data };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export const revokeNexlifyKeyAction = async (id_nexlify_key: number) => {
  const REVOKE_KEY = `/nexlify-keys/${id_nexlify_key}/revoke`;

  try {
    const response =
      await fetchServerClient.put<IBaseResponse<boolean>>(REVOKE_KEY);
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo revocar la clave",
      };
    }

    return {
      ok: true,
      message: response.data.message ?? "Clave revocada exitosamente",
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};
