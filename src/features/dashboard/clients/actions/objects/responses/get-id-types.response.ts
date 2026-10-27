import type { IBaseResponse } from "@/src/shared/interfaces";

export interface IMasterData {
  id: number;
  value: string;
}

export interface IMasterDataResponse extends Array<IMasterData> {}

export interface IMasterDataResponseObject
  extends IBaseResponse<IMasterDataResponse> {}
