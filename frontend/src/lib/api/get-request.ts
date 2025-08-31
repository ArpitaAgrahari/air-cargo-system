import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse, PaginatedApiResponse } from "@/types/api";

export async function getRequest<TResponse = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<ApiResponse<TResponse>> {
  const response = await axios.get<ApiResponse<TResponse>>(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    {
      ...config,
      withCredentials: true,
    }
  );
  return response.data;
}

export async function getPaginatedRequest<TItem = unknown>(
  url: string,
  config?: AxiosRequestConfig
): Promise<PaginatedApiResponse<TItem>> {
  const response = await axios.get<PaginatedApiResponse<TItem>>(
    `${process.env.NEXT_PUBLIC_API_URL}${url}`,
    {
      ...config,
      withCredentials: true,
    }
  );
  return response.data;
}
