import { requireAuth, requireGuest } from "./utils/authGuard.js";

function parseRoute() {
  const hash = location.hash.slice(1) || "/listings";
  const [path, qs] = hash.split("?");
  return {
    path,
    query: new URLSearchParams(qs || "")
  };
}

export async function router() {
  const { path, query } = parseRoute();
  const page = document.querySelector("#page");

  const routes = {
    "/listings": {
      page: "./ui/pages/listings.js"
    },

    "/login": {
      page: "./ui/pages/login.js",
      guard: requireGuest
    },

    "/register": {
      page: "./ui/pages/register.js",
      guard: requireGuest
    },

    "/profile": {
      page: "./ui/pages/profile.js",
      guard: requireAuth
    },

    "/create": {
      page: "./ui/pages/createListing.js",
      guard: requireAuth
    }
  };

  if (path.startsWith("/listing/")) {
    const id = path.split("/")[2];
    const mod = await import("./ui/pages/listingDetails.js");
    page.innerHTML = await mod.render({ id });
    return;
  }

  if (path.startsWith("/edit/")) {
    if (!requireAuth()) return;
    const id = path.split("/")[2];
    const mod = await import("./ui/pages/editListing.js");
    page.innerHTML = await mod.render({ id });
    return;
  }

  const route = routes[path] || routes["/listings"];

  if (route.guard && !route.guard()) return;

  const mod = await import(route.page);
  page.innerHTML = await mod.render({ query });
}
