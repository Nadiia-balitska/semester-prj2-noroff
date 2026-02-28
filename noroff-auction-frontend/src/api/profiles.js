import { request } from "./client.js";

export async function getMyProfile(name) {
  return request(`/auction/profiles/${name}?_listings=true&_wins=true`, { auth: true });
}

export async function updateProfile(name, { bio, avatarUrl, bannerUrl }) {
  const body = {
    bio: bio ?? undefined,
    avatar: avatarUrl ? { url: avatarUrl, alt: "Avatar" } : undefined,
    banner: bannerUrl ? { url: bannerUrl, alt: "Banner" } : undefined,
  };
  return request(`/auction/profiles/${name}`, { method: "PUT", auth: true, body });
}
