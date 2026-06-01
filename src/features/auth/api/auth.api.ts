import { AxiosClient } from "@/src/lib";
import type { IAuthApiRequestObject, IAuthApiResponseObject } from "./objects";

export class AuthApi {
  private readonly _axios: AxiosClient;

  constructor() {
    this._axios = new AxiosClient();
  }

  async User(
    request: IAuthApiRequestObject,
  ): Promise<IApiResponse<IAuthApiResponseObject>> {
    const url = "http://localhost:3600/api/admin-user/auth";

    const response = await this._axios.post<
      IAuthApiRequestObject,
      IApiResponse<IAuthApiResponseObject>
    >(url, request);
    if (!response.ok)
      return {
        ok: response.ok,
        message: response.message,
        code: response.code,
        errors: response.errors,
      };

    return {
      ok: response.ok,
      message: response.message,
      data: response.data,
    };
  }
}
