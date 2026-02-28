import { loadStore, saveStore, clearStore } from "../store.js";

const API_BASE = import.meta.env.VITE_API_BASE ?? "https://v2.api.noroff.dev";

function headers(extra = {}) {
  const { token, apiKey } = loadStore();
  const h = { "Content-Type": "application/json", ...extra };

  if (token) h.Authorization = `Bearer ${token}`;
  if (apiKey) h["X-Noroff-API-Key"] = apiKey; 
  return h;
}

export async function request(path, { method = "GET", body, auth = false } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });

  // auto logout on 401
  if (res.status === 401 && auth) {
    clearStore();
    location.hash = "#/login";
    throw new Error("Сесія завершилась. Увійди ще раз.");
  }

  const text = await res.text();
  const data = text ? JSON.parse(text) : null;

  if (!res.ok) {
    const msg = data?.errors?.[0]?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}

export async function ensureApiKey() {
  const s = loadStore();
  if (s.apiKey) return s.apiKey;

  const out = await request("/auth/create-api-key", { method: "POST", auth: true });
  const key = out?.data?.key;
  if (!key) throw new Error("Could not create api key");
  saveStore({ apiKey: key });
  return key;
}
