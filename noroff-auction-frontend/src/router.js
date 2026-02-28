import { isLoggedIn } from "./store.js";
import { renderNav } from "./ui/layout.js";

function parseRoute() {
  const hash = location.hash.slice(1) || "/listings";
  const [path, qs] = hash.split("?");
  const query = new URLSearchParams(qs || "");
  return { path, query };
}

export async function router() {
  const { path, query } = parseRoute();
  const page = document.querySelector("#page");
  renderNav();

  const authOnly = ["/profile", "/create"];
  if (authOnly.includes(path) && !isLoggedIn()) {
    location.hash = "#/login";
    return;
  }

  if (path.startsWith("/listing/")) {
    const id = path.split("/")[2];
    const { render } = await import("./ui/pages/listingDetails.js");
    page.innerHTML = await render({ id });
    return;
  }

  if (path.startsWith("/edit/")) {
    if (!isLoggedIn()) return (location.hash = "#/login");
    const id = path.split("/")[2];
    const { render } = await import("./ui/pages/editListing.js");
    page.innerHTML = await render({ id });
    return;
  }

  const routes = {
    "/listings": "./ui/pages/listings.js",
    "/login": "./ui/pages/login.js",
    "/register": "./ui/pages/register.js",
    "/profile": "./ui/pages/profile.js",
    "/create": "./ui/pages/createListing.js",
  };

  const modPath = routes[path] || routes["/listings"];
  const { render } = await import(modPath);
  page.innerHTML = await render({ query });
}
