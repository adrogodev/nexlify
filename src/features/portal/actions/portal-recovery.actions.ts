"use server";

import { fetchPortalClient } from "@/src/lib/clients/fetch/server/portal.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IBaseResponse } from "@/src/shared/interfaces";

export const portalForgotPasswordAction = async ({
  username,
}: {
  username: string;
}) => {
  const FORGOT_PASSWORD = "/client/forgot-password";

  try {
    // The backend response is always generic: it never discloses whether
    // the username exists.
    const response = await fetchPortalClient.post<IBaseResponse<boolean>>(
      FORGOT_PASSWORD,
      { username },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo procesar la solicitud",
      };
    }

    return { ok: true, message: response.data.message };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export const portalResetPasswordAction = async ({
  recovery_token,
  password,
}: {
  recovery_token: string;
  password: string;
}) => {
  const RESET_PASSWORD = "/client/reset-password";

  try {
    const response = await fetchPortalClient.post<IBaseResponse<boolean>>(
      RESET_PASSWORD,
      { recovery_token, password },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message:
          response.data.message ?? "No se pudo restablecer la contraseña",
      };
    }

    return { ok: true, message: response.data.message };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export const portalVerifyAssignmentTokenAction = async ({
  assign_creds_token,
}: {
  assign_creds_token: string;
}) => {
  const VERIFY_ASSIGNMENT = "/verify/credential-assignment";

  try {
    const response = await fetchPortalClient.get<IBaseResponse<null>>(
      VERIFY_ASSIGNMENT,
      {
        headers: { "x-assign-creds-token": assign_creds_token },
      },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "Token de asignación inválido",
      };
    }

    return { ok: true, message: response.data.message };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export const portalAssignCredentialsAction = async ({
  assign_creds_token,
  username,
  password,
}: {
  assign_creds_token: string;
  username: string;
  password: string;
}) => {
  const ASSIGN_CREDENTIALS = "/client/assign-credentials";

  try {
    const response = await fetchPortalClient.post<IBaseResponse<boolean>>(
      ASSIGN_CREDENTIALS,
      { username, password },
      { headers: { "x-assign-creds-token": assign_creds_token } },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo asignar las credenciales",
      };
    }

    return { ok: true, message: response.data.message };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};
