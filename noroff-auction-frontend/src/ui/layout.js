import { loadStore } from "../store.js";

export function renderLayout() {
  const app = document.querySelector("#app");
  app.innerHTML = `
    <div class="min-h-screen flex flex-col">
      <header class="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <a href="#/listings" class="font-semibold tracking-tight text-slate-900">AuctionLite</a>

          <div class="flex-1 max-w-md">
            <input id="globalSearch" class="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-300"
              placeholder="Пошук лістингів..." />
          </div>

          <nav id="nav" class="flex items-center gap-2"></nav>
        </div>
      </header>

      <main class="flex-1">
        <div class="max-w-6xl mx-auto px-4 py-6">
          <div id="page"></div>
        </div>
      </main>

      <footer class="border-t border-slate-200 py-6">
        <div class="max-w-6xl mx-auto px-4 text-sm text-slate-500">
          Built for Noroff Auction House API v2.
        </div>
      </footer>
    </div>
  `;

  const search = app.querySelector("#globalSearch");
  search.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const q = search.value.trim();
      location.hash = `#/listings?q=${encodeURIComponent(q)}`;
    }
  });

  renderNav();
}

export function renderNav() {
  const nav = document.querySelector("#nav");
  const { user } = loadStore();

  if (!user?.name) {
    nav.innerHTML = `
      <a class="px-3 py-2 text-sm rounded-xl hover:bg-slate-100" href="#/listings">Лістинги</a>
      <a class="px-3 py-2 text-sm rounded-xl hover:bg-slate-100" href="#/login">Логін</a>
      <a class="px-3 py-2 text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-800" href="#/register">Реєстрація</a>
    `;
    return;
  }

  nav.innerHTML = `
    <div class="hidden sm:flex items-center gap-2 text-sm text-slate-600">
      <span class="rounded-xl border border-slate-200 px-3 py-2">Credits: <b class="text-slate-900" id="creditsTop">${user.credits ?? 0}</b></span>
    </div>
    <a class="px-3 py-2 text-sm rounded-xl hover:bg-slate-100" href="#/create">+ Створити</a>
    <a class="px-3 py-2 text-sm rounded-xl hover:bg-slate-100" href="#/profile">Профіль</a>
    <button id="logoutBtn" class="px-3 py-2 text-sm rounded-xl bg-slate-900 text-white hover:bg-slate-800">Вийти</button>
  `;

  nav.querySelector("#logoutBtn").addEventListener("click", async () => {
    const { logout } = await import("../api/auth.js");
    logout();
    renderNav();
  });
}
