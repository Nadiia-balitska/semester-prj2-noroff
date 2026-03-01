import { requireAuth, requireGuest } from "./utils/authGuard.js";
import { spinner } from "./ui/components.js";

const pages = import.meta.glob("./ui/pages/*.js");

function parseRoute() {
  const hash = location.hash.slice(1) || "/listings";
  const [path, qs] = hash.split("?");
  return { path, query: new URLSearchParams(qs || "") };
}

async function loadPage(modulePath) {
  const loader = pages[modulePath];
  if (!loader) throw new Error(`Page module not found: ${modulePath}`);
  return loader(); 
}

export async function router() {
  const { path, query } = parseRoute();
  const pageEl = document.querySelector("#page");
  pageEl.innerHTML = spinner();

  try {
    const routes = {
      "/listings": { module: "./ui/pages/listings.js" },
      "/login": { module: "./ui/pages/login.js", guard: requireGuest },
      "/register": { module: "./ui/pages/register.js", guard: requireGuest },
      "/profile": { module: "./ui/pages/profile.js", guard: requireAuth },
      "/create": { module: "./ui/pages/createListing.js", guard: requireAuth },
    };

    if (path.startsWith("/listing/")) {
      const id = path.split("/")[2];
      const mod = await loadPage("./ui/pages/listingDetails.js");
      pageEl.innerHTML = await mod.render({ id });
      return;
    }

    if (path.startsWith("/edit/")) {
      if (!requireAuth()) return;
      const id = path.split("/")[2];
      const mod = await loadPage("./ui/pages/editListing.js");
      pageEl.innerHTML = await mod.render({ id });
      return;
    }

    const route = routes[path] || routes["/listings"];
    if (route.guard && !route.guard()) return;

    const mod = await loadPage(route.module);
    pageEl.innerHTML = await mod.render({ query });
  } catch (err) {
    console.error(err);
    pageEl.innerHTML = `
      <div class="max-w-2xl mx-auto border border-red-200 bg-red-50 rounded-2xl p-4">
        <h2 class="font-semibold text-red-800">Route error</h2>
        <p class="text-sm text-red-700 mt-2">${err.message || err}</p>
      </div>
    `;
  }
}
