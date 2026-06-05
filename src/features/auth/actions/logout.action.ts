"use server"

import { getObfuscatedCookie } from "@/src/lib/tools";
import { AUTH_TOKEN } from "@/src/shared/constants";
import { cookies } from "next/headers"

export const logoutAction = async (): Promise<void> => {
    const cookie_store = await cookies();
    const obfuscated_cookie_name = getObfuscatedCookie(AUTH_TOKEN);
    if (cookie_store.has(obfuscated_cookie_name)) {
        cookie_store.delete(obfuscated_cookie_name)
    }
}