import axios, { AxiosRequestConfig } from "axios";
import { ApiResponse } from "@/types/api";

export async function postRequest<TResponse = unknown, TBody = unknown>(
  url: string,
  body?: TBody,
  config?: AxiosRequestConfig
): Promise<ApiResponse<TResponse>> {
  const response = await axios.post<ApiResponse<TResponse>>(url, body, config);
  return response.data;
}


