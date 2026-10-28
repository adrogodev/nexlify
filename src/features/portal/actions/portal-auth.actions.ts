"use server";

import { env } from "node:process";
import { cookies } from "next/headers";
import { fetchPortalClient } from "@/src/lib/clients/fetch/server/portal.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import { getObfuscatedCookie } from "@/src/lib/tools";
import { AUTH_TOKEN, CLIENT_AUTH_TOKEN } from "@/src/shared/constants";

type IAuthPayload = { username: string; password: string };

interface IAuthDtoResponse {
  ok: boolean;
  message?: string;
  data?: { ip_connection: string; token: string };
}

export const portalSignInAction = async ({
  username,
  password,
}: IAuthPayload) => {
  const SIGN_IN = "/client/sign-in";

  try {
    const response = await fetchPortalClient.post<IAuthDtoResponse>(SIGN_IN, {
      username,
      password,
    });
    const { data } = response.data;
    if (response.status === 200 && data?.token) {
      (await cookies()).set(
        getObfuscatedCookie(CLIENT_AUTH_TOKEN),
        data.token,
        {
          httpOnly: true,
          secure: env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        },
      );

      return { ok: true };
    }

    return { ok: false, error: "Hubo un error al iniciar sesión" };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export const portalLogoutAction = async () => {
  (await cookies()).delete(getObfuscatedCookie(CLIENT_AUTH_TOKEN));
  // Clearing a stale admin cookie too avoids the layout guard dispatching
  // admin session calls on the next portal navigation.
  (await cookies()).delete(getObfuscatedCookie(AUTH_TOKEN));
  return { ok: true };
};
