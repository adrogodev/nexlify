export type { }

declare global {
    type Nullable<T> = T | null;

    type PaginationParams = {
        page?: number;
        size?: number;
    }

    type PaginationResponse<T> = {
        total_items: number;
        page: number;
        data: Nullable<T>
    }
}