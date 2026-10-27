import type { IBaseResponse } from "@/src/shared/interfaces";

export interface IRegisterClientParams {
  id_type: number;
  id_number: string;
  name: string;
  email: string;
  cell_callsign: string;
  cell_phone: string;
  user_first_name: string;
  user_second_name?: string;
  user_first_surname: string;
  user_second_surname?: string;
}

export interface IRegisterClientResponse extends IBaseResponse<boolean> {}
