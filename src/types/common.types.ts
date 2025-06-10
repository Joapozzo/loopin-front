export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

export interface PaginationParams {
    page: number;
    limit: number;
}

export interface SortingParams {
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface FilterParams {
    search?: string;
    [key: string]: any;
}

export interface TableConfig<T> {
    data: T[];
    loading: boolean;
    error: string | null;
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
    sorting: SortingParams;
    filters: FilterParams;
}