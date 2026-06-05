import { type ApiConfig, ApiResponseError, type ApiRespose, type AuthConfig } from "../types";

export class FetchApiCore {
    private config: Required<ApiConfig>;
    private auth_config: AuthConfig

    constructor(config: ApiConfig = {}, auth_config: AuthConfig = {}) {
        this.config = {
            base_url: config.base_url || '',
            default_headers: {
                'Content-Type': 'application/json',
                ...config.default_headers
            },
            timeout: config.timeout || 60000
        };

        this.auth_config = {
            tokenHeader: 'Authorization',
            tokenPrefix: 'Bearer',
            ...auth_config
        };
    }

    private buildUrl(endpoint: string): string {
        if (endpoint.startsWith('http')) return endpoint;
        return `${this.config.base_url}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
    }

    private async requestOptions(options: RequestInit): Promise<RequestInit> {
        const headers: any = { ...this.config.default_headers };

        if (options.body instanceof FormData) {
            delete headers['Content-Type'];
        }

        if (this.auth_config.tokenProvider) {
            const token = await this.auth_config.tokenProvider();
            if (token) {
                headers[this.auth_config.tokenHeader!] =
                    `${this.auth_config.tokenPrefix} ${token}`
            }
        }

        return {
            ...options,
            headers: {
                ...headers,
                ...options.headers
            }
        }
    }

    private async parseResponse<T>(response: Response): Promise<T> {
        const content_type = response.headers.get(`content-type`);

        if (content_type?.includes('application/json')) {
            try {
                return await response.json();
            } catch (_err) {
                throw new ApiResponseError('Invalid JSON response', response.status, response);
            }
        }

        if (
            content_type?.includes('application/pdf') ||
            content_type?.includes('image/') ||
            content_type?.includes('application/octet-stream')
        ) {
            return (await response.blob()) as unknown as T;
        }

        return (await response.text()) as unknown as T;
    }

    private async request<TResponse>(endpoint: string, options: RequestInit = {}): Promise<ApiRespose<TResponse>> {
        const url = await this.buildUrl(endpoint);
        const _options = await this.requestOptions(options);

        try {
            const controller = new AbortController();
            const timeout_id = setTimeout(() => controller.abort(), this.config.timeout);

            const response = await fetch(url, {
                ..._options,
                signal: controller.signal
            });

            clearTimeout(timeout_id);

            if (!response.ok) {
                throw new ApiResponseError(
                    `HTTP ${response.status}: ${response.statusText}`,
                    response.status,
                    response
                );
            }

            const data = await this.parseResponse<TResponse>(response);

            return {
                data,
                status: response.status,
                headers: response.headers
            };

        } catch (error: any) {
            if (error.name === 'AbortError') {
                throw new ApiResponseError('Request timeout', 408)
            }

            throw error;
        }
    }

    async post<TResponse>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiRespose<TResponse>> {
        const is_form_data = data instanceof FormData;
        return this.request<TResponse>(endpoint, {
            ...options,
            method: 'POST',
            body: is_form_data ? data : (data ? JSON.stringify(data) : undefined)
        });
    }

    async put<TResponse>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiRespose<TResponse>> {
        const is_form_data = data instanceof FormData;
        return this.request<TResponse>(endpoint, {
            ...options,
            method: 'PUT',
            body: is_form_data ? data : (data ? JSON.stringify(data) : undefined)
        });
    }

    async get<TResponse>(endpoint: string, options?: RequestInit): Promise<ApiRespose<TResponse>> {
        return this.request<TResponse>(endpoint, { ...options, method: 'GET' });
    }
}