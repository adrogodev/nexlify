"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { GetClientsParams } from "./objects/requests";
import type { IGetClientsDataResponseObject } from "./objects/responses";

export const getClientsAction = async (params?: GetClientsParams) => {
  const GET_CLIENTS = "/client/get-clients";
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.size) query.set("size", params.size.toString());
  if (params?.id_state) query.set("id_state", params.id_state.toString());
  if (params?.id_type) query.set("id_type", params.id_type.toString());
  if (params?.id_number) query.set("id_number", params.id_number.toString());
  if (params?.name) query.set("name", params.name.toString());

  const url =
    query.size > 0 ? `${GET_CLIENTS}?${query.toString()}` : GET_CLIENTS;

  try {
    const response =
      await fetchServerClient.get<IGetClientsDataResponseObject>(url);
    if (response.status !== 200) {
      return { ok: false, message: "Hubo un error al obtener clientes" };
    }

    return {
      ok: true,
      message: response.data.message ?? "Hubo un error al obtener clientes",
      data: response.data.data,
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};
