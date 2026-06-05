export interface ApiRespose<T = any> {
    data: T;
    status: number;
    headers: Headers
}

export class ApiResponseError extends Error {
    constructor(
        message: string,
        public status: number,
        public response?: Response
    ) {
        super(message);
        this.name = 'api_error';
    }
}