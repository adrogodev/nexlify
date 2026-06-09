import { env } from "node:process";
import { getAuthToken } from "@/src/lib/helpers";
import { FetchApiCore } from "../core/fetch.core";

const getServerToken = async (): Promise<Nullable<string>> => {
    const token = await getAuthToken();
    return token;
}

export const fetchServerClient = new FetchApiCore(
    {
        base_url: `${env.API_URL}${env.API_URN}` || 'http://localhost:3000'
    },
    {
        tokenProvider: getServerToken
    }
);