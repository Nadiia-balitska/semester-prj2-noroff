import { loadStore } from "../store.js";

const API_BASE = import.meta.env.VITE_API_BASE ?? "https://v2.api.noroff.dev";

function headers(extra = {}) {
  const { token, apiKey } = loadStore();

  const envKey = import.meta.env.VITE_NOROFF_API_KEY;
  const finalKey = envKey || apiKey;

  const h = { "Content-Type": "application/json", ...extra };

  if (token) h.Authorization = `Bearer ${token}`;
  if (finalKey) h["X-Noroff-API-Key"] = finalKey;

  return h;
}

export async function request(path, { method = "GET", body, auth = false } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: headers(),
    body: body ? JSON.stringify(body) : undefined,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    const msg = data?.errors?.[0]?.message || data?.message || `HTTP ${res.status}`;
    throw new Error(msg);
  }

  return data;
}
