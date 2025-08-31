import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse } from "@/types/api";

export async function deleteRequest<TResponse = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<ApiResponse<TResponse>> {
  const response = await axios.delete<ApiResponse<TResponse>>(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...config,
    data: body,
  });
  return response.data;
}
