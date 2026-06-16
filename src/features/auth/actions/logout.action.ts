"use server"

import { cookies } from "next/headers"
import { getObfuscatedCookie } from "@/src/lib/tools";
import { AUTH_TOKEN } from "@/src/shared/constants";

export const logoutAction = async (): Promise<void> => {
    const cookie_store = await cookies();
    const obfuscated_cookie_name = getObfuscatedCookie(AUTH_TOKEN);
    if (cookie_store.has(obfuscated_cookie_name)) {
        cookie_store.delete(obfuscated_cookie_name)
    }
}