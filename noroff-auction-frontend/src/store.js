const KEY = "auctionlite:v1";

const defaults = {
  token: null,
  apiKey: null,
  user: null, 
};

export function loadStore() {
  try {
    return { ...defaults, ...(JSON.parse(localStorage.getItem(KEY)) ?? {}) };
  } catch {
    return { ...defaults };
  }
}

export function saveStore(patch) {
  const current = loadStore();
  const next = { ...current, ...patch };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearStore() {
  localStorage.removeItem(KEY);
}

export function isLoggedIn() {
  const s = loadStore();
  return Boolean(s.token && s.user?.name);
}
