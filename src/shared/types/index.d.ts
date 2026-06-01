export type { }

declare global {
    interface IApiResponse<TResponse> {
        ok: boolean,
        message: string,
        data?: TResponse,
        code?: string | null,
        errors?: any | null
    }
}