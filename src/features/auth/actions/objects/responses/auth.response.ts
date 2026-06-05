import { IBaseResponse } from "@/src/shared/interfaces";

export interface IAuthResponse {
  ip_connection: string;
  token: string;
}

export interface IAuthResponseObject extends IBaseResponse<IAuthResponse> { }

export interface IUserDataResponse {
  is_admin: boolean;
  id: number;
  name: string | null;
  username: string | null;
  ip_connection: string | null;
  is_active: boolean | null;
}

export interface IUserDataResponseObject extends IBaseResponse<IUserDataResponse> { }
