"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IBaseResponse } from "@/src/shared/interfaces";

type TemplatesPage = {
  total_items: number;
  page: number;
  data: ITemplateInfo[];
};

export interface ITemplateInfo {
  id_template: string;
  name: Nullable<string>;
  subject: Nullable<string>;
  template: Nullable<string>;
  is_active: Nullable<boolean>;
  created_at: Nullable<string>;
}

export interface IGetTemplatesParams {
  page?: number;
  limit?: number;
}

export interface IGetTemplatesResponse extends IBaseResponse<TemplatesPage> {}

export const getTemplatesAction = async (params?: IGetTemplatesParams) => {
  const GET_TEMPLATES = "/templates";
  const query = new URLSearchParams();
  if (params?.page) query.set("page", params.page.toString());
  if (params?.limit) query.set("limit", params.limit.toString());
  const url =
    query.size > 0 ? `${GET_TEMPLATES}?${query.toString()}` : GET_TEMPLATES;

  try {
    const response = await fetchServerClient.get<IGetTemplatesResponse>(url);
    if (response.status !== 200) {
      return { ok: false, message: "No se pudieron obtener las plantillas" };
    }

    return { ok: true, data: response.data.data };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export interface ICreateTemplateParams {
  name?: string;
  subject?: string;
  template?: string;
  is_active?: boolean;
}

export const createTemplateAction = async (params: ICreateTemplateParams) => {
  const CREATE_TEMPLATE = "/templates";

  try {
    const response = await fetchServerClient.post<IBaseResponse<ITemplateInfo>>(
      CREATE_TEMPLATE,
      { ...params },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo crear la plantilla",
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

export interface IUpdateTemplateParams {
  id: string;
  subject?: string;
  template?: string;
  is_active?: boolean;
}

export const updateTemplateAction = async ({
  id,
  ...params
}: IUpdateTemplateParams) => {
  const UPDATE_TEMPLATE = `/templates/${id}`;

  try {
    const response = await fetchServerClient.put<IBaseResponse<ITemplateInfo>>(
      UPDATE_TEMPLATE,
      { ...params },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo actualizar la plantilla",
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
