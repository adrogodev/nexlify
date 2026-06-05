export interface IBaseResponse<T> {
    ok: boolean;
    message?: string;
    code?: string;
    error?: string[];
    data?: T;
}