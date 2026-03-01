import { loadStore } from "../store.js";


export function isAuthenticated() {
  const { token, user } = loadStore();
  return Boolean(token && user);
}


export function requireAuth() {
  if (!isAuthenticated()) {
    location.hash = "#/login";
    return false;
  }
  return true;
}


export function requireGuest() {
  if (isAuthenticated()) {
    location.hash = "#/listings";
    return false;
  }
  return true;
}
