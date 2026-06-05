"use server";

import { fetchApiClient } from "@/src/lib/clients/fetch/fetch.client";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import { getObfuscatedCookie } from "@/src/lib/tools";
import { AUTH_TOKEN } from "@/src/shared/constants";
import { cookies } from "next/headers";
import { env } from "process";
import { IAuthResponseObject } from "./objects";

export const authAction = async ({ username, password }: { username: string, password: string }) => {

  const AUTH = `${env.ADMIN_USER_BASE}${env.AUTH_ADMIN_USER}`
  const obfuscated_cookie_name = getObfuscatedCookie(AUTH_TOKEN);
  console.log(AUTH);


  try {
    const response = await fetchApiClient.post<IAuthResponseObject>(AUTH, { username, password });
    const { data } = response.data;
    if (response.status === 200 && data?.token) {
      (await cookies()).set(obfuscated_cookie_name, data.token ?? '', {
        httpOnly: true,
        secure: env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });

      return { ok: true };
    }

    return { ok: false, error: 'Hubo un error al iniciar sesión' };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response }
  }
}