import { request } from "./client.js";

export async function getListings({ q, tag, sort = "created", sortOrder = "desc", page = 1, limit = 24 } = {}) {
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("page", String(page));
  params.set("sort", sort);
  params.set("sortOrder", sortOrder);

  const out = await request(`/auction/listings?${params.toString()}`);
  let items = out?.data ?? [];

  if (q) {
    const needle = q.toLowerCase();
    items = items.filter((x) => (x.title + " " + (x.description ?? "")).toLowerCase().includes(needle));
  }
  if (tag) {
    items = items.filter((x) => (x.tags ?? []).includes(tag));
  }

  return { items, meta: out?.meta };
}

export async function getListing(id) {
  return request(`/auction/listings/${id}?_seller=true&_bids=true`);
}

export async function createListing({ title, description, endsAt, tags, media }) {
  return request("/auction/listings", {
    method: "POST",
    auth: true,
    body: { title, description, endsAt, tags, media },
  });
}

export async function updateListing(id, patch) {
  return request(`/auction/listings/${id}`, {
    method: "PUT",
    auth: true,
    body: patch,
  });
}

export async function deleteListing(id) {
  return request(`/auction/listings/${id}`, { method: "DELETE", auth: true });
}

export async function bidOnListing(id, amount) {
  return request(`/auction/listings/${id}/bids`, {
    method: "POST",
    auth: true,
    body: { amount },
  });
}
