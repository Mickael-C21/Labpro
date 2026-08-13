const API_URL = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

type JsonValue = string | number | boolean | null | JsonObject | JsonValue[];
interface JsonObject {
  [key: string]: JsonValue;
}

function getAuthToken(): string | null {
  return localStorage.getItem("access_token");
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_URL}${path}`;
  const headers = new Headers(options.headers ?? {});

  headers.set("Accept", "application/json");
  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAuthToken();
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const text = await response.text();
  if (!response.ok) {
    let errorMessage = text;
    try {
      const parsed = JSON.parse(text);
      errorMessage = parsed.detail || parsed.message || text;
    } catch {
      errorMessage = text || response.statusText;
    }
    throw new Error(errorMessage);
  }

  return text ? JSON.parse(text) : (null as unknown as T);
}

export async function apiGet<T>(path: string) {
  return apiFetch<T>(path, { method: "GET" });
}

export async function apiPost<T>(path: string, body: JsonObject) {
  return apiFetch<T>(path, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPut<T>(path: string, body: JsonObject) {
  return apiFetch<T>(path, { method: "PUT", body: JSON.stringify(body) });
}

export async function apiPatch<T>(path: string, body: JsonObject) {
  return apiFetch<T>(path, { method: "PATCH", body: JSON.stringify(body) });
}

export async function apiDelete<T>(path: string) {
  return apiFetch<T>(path, { method: "DELETE" });
}