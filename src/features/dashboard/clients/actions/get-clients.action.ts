"use server"

import { env } from "node:process"
import { fetchApiClient } from "@/src/lib/clients/fetch";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { GetClientsParams } from "./objects/requests"
import type { IGetClientsDataResponseObject } from "./objects/responses";

export const getClientsAction = async (params?: GetClientsParams) => {

    const GET_CLIENTS = `${env.CLIENT}${env.GET_CLIENTS}`;
    const { ...dataValues } = params || {}

    const query = new URLSearchParams();
    if (dataValues.page) query.set('page', dataValues.page.toString());
    if (dataValues.size) query.set('size', dataValues.size.toString());
    if (dataValues.id_state) query.set('id_state', dataValues.id_state.toString());
    if (dataValues.id_type) query.set('id_type', dataValues.id_type.toString());
    if (dataValues.id_number) query.set('id_number', dataValues.id_number.toString());
    if (dataValues.name) query.set('name', dataValues.name.toString());

    const url = `${GET_CLIENTS}?${query.toString()}`;

    try {
        const response = await fetchApiClient.get<IGetClientsDataResponseObject>(url);
        if (response.status !== 200) {
            return { ok: false, message: 'Hubo un error al obtener clientes' };
        }

        return {
            ok: true,
            message: response.data.message ?? 'Hubo un error al obtener clientes',
            data: response.data.data
        };

    } catch (error) {
        const error_response = await handleApiResponseError(error);
        return { ok: false, error: error_response }
    }
}