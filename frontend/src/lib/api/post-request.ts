import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse } from "@/types/api";

export async function postRequest<TResponse = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<ApiResponse<TResponse>> {
  const response = await axios.post<ApiResponse<TResponse>>(`${process.env.NEXT_PUBLIC_API_URL}${url}`, body, {
    ...config,
    withCredentials: true,
  });
  return response.data;
}


