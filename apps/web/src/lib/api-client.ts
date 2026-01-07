import { getAuthToken } from "./auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export interface ApiRequestOptions extends RequestInit {
  token?: string;
  useAuth?: boolean;
}

export async function apiFetch<T>(
  endpoint: string,
  options: ApiRequestOptions = {}
): Promise<T> {
  const { useAuth = true, token: customToken, ...fetchOptions } = options;
  
  const correlationId = crypto.randomUUID();
  const headers = new Headers(fetchOptions.headers);
  
  headers.set("Content-Type", "application/json");
  headers.set("x-correlation-id", correlationId);

  if (useAuth) {
    const token = customToken || (await getAuthToken());
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_URL}${endpoint}`;
  
  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    let errorMessage = "An error occurred";
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {
      // Rollback to status text
      errorMessage = response.statusText;
    }
    
    throw new Error(errorMessage);
  }

  return response.json() as Promise<T>;
}

export const apiClient = {
  get: <T>(endpoint: string, options?: ApiRequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: "GET" }),
  
  post: <T>(endpoint: string, body: unknown, options?: ApiRequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: "POST", body: JSON.stringify(body) }),
  
  put: <T>(endpoint: string, body: unknown, options?: ApiRequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: "PUT", body: JSON.stringify(body) }),
  
  delete: <T>(endpoint: string, options?: ApiRequestOptions) => 
    apiFetch<T>(endpoint, { ...options, method: "DELETE" }),
};
