import { env } from "node:process";
import { getPortalAuthToken } from "@/src/lib/helpers";
import { FetchApiCore } from "../core/fetch.core";

/**
 * HTTP client for the CLIENT PORTAL session (client_credentials sign-in).
 * It carries the client JWT from its own httpOnly cookie, separate from the
 * admin dashboard session token.
 */
export const fetchPortalClient = new FetchApiCore(
  {
    base_url: `${env.API_URL}${env.API_URN}` || "http://localhost:3600",
  },
  {
    tokenProvider: getPortalAuthToken,
  },
);
