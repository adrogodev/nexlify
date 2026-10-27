import type { IBaseResponse } from "@/src/shared/interfaces";

export interface IGetClientDetailData {
  id_client: number;
  id_state: number;
  state: string;
  id_type: number;
  id_type_code: string;
  id_type_name: string;
  id_number: string;
  name: string;
  email: string;
  cell_callsign: string;
  cell_phone: string;
  admin_user: string;
  created_at: string;
}

export interface IGetClientDetailResponse extends IGetClientDetailData {}

export interface IGetClientDetailResponseObject
  extends IBaseResponse<IGetClientDetailResponse> {}
