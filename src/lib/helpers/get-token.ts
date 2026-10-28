import { cookies } from "next/headers";
import { AUTH_TOKEN, CLIENT_AUTH_TOKEN } from "@/src/shared/constants";
import { getObfuscatedCookie } from "../tools";

export const getAuthToken = async (): Promise<Nullable<string>> => {
  const cookie_store = await cookies();
  const obfuscated_cookie_name = getObfuscatedCookie(AUTH_TOKEN);
  return cookie_store.get(obfuscated_cookie_name)?.value ?? "";
};

export const getPortalAuthToken = async (): Promise<Nullable<string>> => {
  const cookie_store = await cookies();
  const obfuscated_cookie_name = getObfuscatedCookie(CLIENT_AUTH_TOKEN);
  return cookie_store.get(obfuscated_cookie_name)?.value ?? "";
};
