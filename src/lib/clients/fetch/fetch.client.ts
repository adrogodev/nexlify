import { AUTH_TOKEN } from "../../../shared/constants";
import { FetchApiCore } from "./core/fetch.core";
import { env } from "process"

const getClientToken = (): Nullable<string> => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(AUTH_TOKEN)
};

export const fetchApiClient = new FetchApiCore(
    {
        base_url: `${env.API_URL}${env.API_URN}` || 'http://localhost:3000'
    },
    {
        tokenProvider: getClientToken
    }
)