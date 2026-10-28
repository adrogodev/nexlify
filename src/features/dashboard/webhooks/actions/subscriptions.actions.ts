"use server";

import { fetchServerClient } from "@/src/lib/clients/fetch/server/client.serve";
import { handleApiResponseError } from "@/src/lib/handlers/api-errors.handler";
import type { IBaseResponse } from "@/src/shared/interfaces";

export interface ISubscription {
  subscription_uuid: string;
  webhook_endpoint_uuid: string;
  events: string[];
  include_body: Nullable<boolean>;
  include_dates: Nullable<boolean>;
  include_sender: Nullable<boolean>;
  include_recipients: Nullable<boolean>;
  include_attachments: Nullable<boolean>;
  is_active: Nullable<boolean>;
}

export interface ICreateSubscriptionParams {
  webhook_endpoint_uuid: string;
  /** Backend EmailEventEnum only has RECEIVED_REPLY today. */
  events: string[];
  include_body?: boolean;
  include_dates?: boolean;
  include_sender?: boolean;
  include_recipients?: boolean;
  include_attachments?: boolean;
}

export const getMySubscriptionsAction = async () => {
  const MY_SUBSCRIPTIONS = "/email-events/subscriptions/my";

  try {
    const response =
      await fetchServerClient.get<IBaseResponse<ISubscription[]>>(
        MY_SUBSCRIPTIONS,
      );
    if (response.status !== 200) {
      return {
        ok: false,
        message:
          response.data.message ?? "No se pudieron obtener las suscripciones",
      };
    }

    return { ok: true, data: response.data.data };
  } catch (error) {
    const error_response = await handleApiResponseError(error);
    return { ok: false, error: error_response };
  }
};

export const createSubscriptionAction = async (
  params: ICreateSubscriptionParams,
) => {
  const CREATE_SUBSCRIPTION = "/email-events/subscriptions";

  try {
    const response = await fetchServerClient.post<IBaseResponse<ISubscription>>(
      CREATE_SUBSCRIPTION,
      { ...params },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message: response.data.message ?? "No se pudo crear la suscripción",
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

export interface IUpdateSubscriptionParams {
  subscription_uuid: string;
  events?: string[];
  is_active?: boolean;
}

export const updateSubscriptionAction = async ({
  subscription_uuid,
  ...params
}: IUpdateSubscriptionParams) => {
  const UPDATE_SUBSCRIPTION = `/email-events/subscriptions/${subscription_uuid}`;

  try {
    const response = await fetchServerClient.put<IBaseResponse<ISubscription>>(
      UPDATE_SUBSCRIPTION,
      { ...params },
    );
    if (response.status !== 200) {
      return {
        ok: false,
        message:
          response.data.message ?? "No se pudo actualizar la suscripción",
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
