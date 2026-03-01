import { loadStore } from "../store.js";

export function renderLayout() {
  const app = document.querySelector("#app");

  app.innerHTML = `
    <div class="min-h-screen flex flex-col">
      <header class="sticky top-0 bg-white border-b border-slate-200">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          
          <a href="#/listings" class="font-semibold text-lg">
            AuctionLite
          </a>

          <input id="globalSearch"
            class="flex-1 max-w-md border rounded-xl px-3 py-2 text-sm"
            placeholder="Search listings..." />

          <nav id="nav" class="flex items-center gap-2"></nav>
        </div>
      </header>

      <main class="flex-1">
        <div class="max-w-6xl mx-auto px-4 py-6">
          <div id="page"></div>
        </div>
      </main>
    </div>
  `;

  document.querySelector("#globalSearch")
    .addEventListener("keydown", e => {
      if (e.key === "Enter") {
        location.hash = `#/listings?q=${e.target.value}`;
      }
    });

  renderNav();
}

export function renderNav() {
  const nav = document.querySelector("#nav");
  const { user } = loadStore();

  if (!user?.name) {
    nav.innerHTML = `
      <a href="#/listings" class="px-3 py-2 hover:bg-slate-100 rounded">Listings</a>
      <a href="#/login" class="px-3 py-2 hover:bg-slate-100 rounded">Login</a>
      <a href="#/register" class="px-3 py-2 bg-black text-white rounded">
        Register
      </a>
    `;
    return;
  }

  nav.innerHTML = `
    <span class="text-sm border px-3 py-2 rounded">
      Credits: <b>${user.credits ?? 0}</b>
    </span>

    <a href="#/create" class="px-3 py-2 hover:bg-slate-100 rounded">
      + Create Listing
    </a>

    <a href="#/profile" class="px-3 py-2 hover:bg-slate-100 rounded">
      Profile
    </a>

    <button id="logoutBtn"
      class="px-3 py-2 bg-black text-white rounded">
      Logout
    </button>
  `;

  nav.querySelector("#logoutBtn").onclick = async () => {
    const { logout } = await import("../api/auth.js");
    logout();
  };
}
