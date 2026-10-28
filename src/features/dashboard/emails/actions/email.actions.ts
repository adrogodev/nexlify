"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IBaseResponse } from "@/src/shared/interfaces";
import type { TEmailState } from "../types/email-states.types";

export interface IEmailListItem {
  email_uuid: string;
  short_code: string;
  to_email: string;
  subject: string;
  state: Nullable<TEmailState>;
  attempts: Nullable<number>;
  created_at: Nullable<string>;
}

export interface IEmailSendLog {
  id_log: number | string;
  attempt: number;
  level: Nullable<"SUCCESS" | "WARNING" | "ERROR">;
  message: string;
  smtp_host: Nullable<string>;
  created_at: Nullable<string>;
}

export interface IEmailDetail extends IEmailListItem {
  id_client: Nullable<number>;
  from_email: string;
  next_retry_at: Nullable<string>;
  sent_at: Nullable<string>;
  direction: Nullable<string>;
  logs: IEmailSendLog[];
  parent_email_uuid: Nullable<string>;
  attachments: Array<{
    filename: string;
    content_type: Nullable<string>;
    size_bytes: Nullable<number>;
  }>;
}

export interface IGetEmailsParams {
  state?: TEmailState;
  id_client?: number;
  page?: number;
  limit?: number;
  short_code?: string;
}

type EmailsPage = { total_items: number; page: number; data: IEmailListItem[] };

export interface IGetEmailsResponse extends IBaseResponse<EmailsPage> {}

export const getEmailsAction = async (params?: IGetEmailsParams) => {
  const GET_EMAILS = "/email";
  const query = new URLSearchParams();
  if (params?.state) query.set("state", params.state);
  if (params?.id_client) query.set("id_client", params.id_client.toString());
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  if (params?.short_code) query.set("short_code", params.short_code);
  const url = query.size > 0 ? `${GET_EMAILS}?${query.toString()}` : GET_EMAILS;

  try {
    const response = await fetchServerClient.get<IGetEmailsResponse>(url);
    if (response.status !== 200) {
      return { ok: false, message: "No se pudieron obtener los emails" };
    }

    const emails = response.data.data;

    return {
      ok: true,
      data:
        emails &&
        ({
          total_items: emails.total_items,
          page: emails.page,
          data: emails.data ?? [],
        } satisfies EmailsPage),
    };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export const getEmailDetailAction = async (email_id: string) => {
  const GET_EMAIL_DETAIL = `/email/${email_id}`;

  try {
    const response =
      await fetchServerClient.get<IBaseResponse<IEmailDetail>>(
        GET_EMAIL_DETAIL,
      );
    if (response.status !== 200) {
      return {
        ok: false,
        message:
          response.data.message ?? "No se pudo obtener el detalle del email",
      };
    }

    return { ok: true, data: response.data.data };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export interface ISendEmailParams {
  from: string;
  to: string[];
  subject: string;
  html?: string;
  text?: string;
}

export interface ISendEmailResult {
  email_uuid: string;
  short_code: string;
  state: TEmailState;
  attempts: number;
}

export const sendEmailAction = async (params: ISendEmailParams) => {
  const SEND_EMAIL = "/email/send";

  try {
    const response = await fetchServerClient.post<
      IBaseResponse<ISendEmailResult>
    >(SEND_EMAIL, { ...params });
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo enviar el email",
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

export const retryEmailAction = async (email_id: string) => {
  const RETRY_EMAIL = `/email/${email_id}/retry`;

  try {
    const response =
      await fetchServerClient.post<IBaseResponse<ISendEmailResult>>(
        RETRY_EMAIL,
      );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo reintentar el envío",
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

export interface IDiffuseEmailParams {
  recipients: string[];
  subject: string;
  html?: string;
  text?: string;
}

export interface IDiffuseEmailResult {
  queued: number;
  short_codes: string[];
}

export const diffuseEmailAction = async (params: IDiffuseEmailParams) => {
  const DIFFUSE_EMAIL = "/email/diffuse";

  try {
    const response = await fetchServerClient.post<
      IBaseResponse<IDiffuseEmailResult>
    >(DIFFUSE_EMAIL, { ...params });
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo iniciar la difusión",
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
