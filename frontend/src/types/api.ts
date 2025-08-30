export type Nullable<T> = T | null;

export interface SuccessResponse<T> {
  success: true;
  message: string;
  data: T;
  errors: null;
}

export interface FailedResponse {
  success: false;
  message: string;
  data: null;
  errors: {
    details: {
      message: string;
      [key: string]: unknown;
    };
  };
}

export type ApiResponse<T = null> = SuccessResponse<T> | FailedResponse;

export interface PaginatedApiResponse<T> extends SuccessResponse<T[]> {
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}
