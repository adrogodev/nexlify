import type { IBaseResponse } from "@/src/shared/interfaces";

export interface IGetClientsData {
    id_client: number,
    id_state: number,
    state: string;
    name: string;
    id_type: string;
    id_number: string;
    email: string;
    cell_phone?: Nullable<string>;
}

export interface IGetClientsDataResponse extends PaginationResponse<IGetClientsDataResponse[]> { }

export interface IGetClientsDataResponseObject extends IBaseResponse<IGetClientsDataResponse> { }