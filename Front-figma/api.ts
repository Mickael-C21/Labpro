const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000";

function getAuthToken() {
  return localStorage.getItem("access_token");
}

async function apiFetch(path: string, options: RequestInit = {}) {
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

  return text ? JSON.parse(text) : null;
}

export async function apiGet(path: string) {
  return apiFetch(path, { method: "GET" });
}

export async function apiPost(path: string, body: any) {
  return apiFetch(path, { method: "POST", body: JSON.stringify(body) });
}

export async function apiPut(path: string, body: any) {
  return apiFetch(path, { method: "PUT", body: JSON.stringify(body) });
}

export async function apiPatch(path: string, body: any) {
  return apiFetch(path, { method: "PATCH", body: JSON.stringify(body) });
}

export async function apiDelete(path: string) {
  return apiFetch(path, { method: "DELETE" });
}