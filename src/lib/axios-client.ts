import axios, { type AxiosInstance, isAxiosError } from "axios";

export class AxiosClient {

    protected readonly _client: AxiosInstance;

    constructor() {
        this._client = axios.create({ timeout: 5000 })
    }

    async post<TBody, TResponse>(url: string, data: TBody, headers?: Record<string, string | number>): Promise<TResponse> {
        try {
            const response = await this._client.post<TResponse>(url, data, { headers });
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response?.data) {
                return error.response.data as TResponse;
            }
            throw error;
        }
    }


    async get<TParams, TResponse>(url: string, params?: TParams, headers?: Record<string, string | number>): Promise<TResponse> {
        try {
            const response = await this._client.get<TResponse>(url, { params, headers });
            return response.data;
        } catch (error) {
            if (isAxiosError(error) && error.response?.data) {
                return error.response.data as TResponse;
            }
            throw error;
        }
    }

}