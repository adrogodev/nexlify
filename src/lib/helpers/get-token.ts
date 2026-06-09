import { cookies } from "next/headers"
import { AUTH_TOKEN } from "@/src/shared/constants";
import { getObfuscatedCookie } from "../tools";

export const getAuthToken = async (): Promise<Nullable<string>> => {
    const cookie_store = await cookies();
    const obfuscated_cookie_name = getObfuscatedCookie(AUTH_TOKEN);
    return cookie_store.get(obfuscated_cookie_name)?.value ?? '';

}