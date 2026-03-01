import { request, ensureApiKey } from "./client.js";
import { saveStore, clearStore } from "../store.js";

export async function register({ name, email, password, bio, avatarUrl, bannerUrl }) {
  if (!email.endsWith("@stud.noroff.no")) {
    throw new Error("Registration allow for email @stud.noroff.no");
  }
  const payload = {
    name,
    email,
    password,
    bio: bio || undefined,
    avatar: avatarUrl ? { url: avatarUrl, alt: `${name} avatar` } : undefined,
    banner: bannerUrl ? { url: bannerUrl, alt: `${name} banner` } : undefined,
  };
  return request("/auth/register", { method: "POST", body: payload });
}

export async function login({ email, password }) {
  const out = await request("/auth/login", { method: "POST", body: { email, password } });

  const token = out?.data?.accessToken || out?.data?.token || out?.accessToken;
  const user = out?.data;

  if (!token || !user?.name) throw new Error("No tokin");

  saveStore({ token, user: { name: user.name, email: user.email, credits: user.credits ?? 0, avatar: user.avatar, banner: user.banner } });


  return out;
}

export function logout() {
  clearStore();
  location.hash = "#/listings";
}
