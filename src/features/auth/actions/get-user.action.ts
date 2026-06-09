"use server"

import { env } from "node:process";
import { cookies } from "next/headers";
import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import { getObfuscatedCookie } from "@/src/lib/tools";
import { AUTH_TOKEN } from "@/src/shared/constants";
import type { IUserDataResponse, IUserDataResponseObject } from "./objects";

export const getUserAction = async (): Promise<{ success: boolean; data?: IUserDataResponse; error?: string }> => {
    const cookie_store = await cookies();
    const obfuscated_cookie_name = getObfuscatedCookie(AUTH_TOKEN);
    const token = cookie_store.get(obfuscated_cookie_name)?.value;
    const GET_ADMIN_USER_DATA = `${env.ADMIN_USER_BASE}${env.ADMIN_USER_DATA}`;

    if (!token) return { success: false, error: 'No se encontró el token de autenticación' };

    try {
        const response = await fetchServerClient.get<IUserDataResponseObject>(GET_ADMIN_USER_DATA);

        if (response.status === 200) {
            return { success: true, data: response.data.data };
        }

        return { success: false, error: 'Hubo un error al obtener datos de usuario' }

    } catch (error) {
        const error_response = await handleApiResponseError(error);
        return { success: false, error: error_response }
    }

}