import { getListing, bidOnListing } from "../../api/listings.js";
import { loadStore, saveStore } from "../../store.js";
import { showToast, setButtonLoading } from "../components.js";
import { renderNav } from "../layout.js";

function bidsTable(bids = []) {
  if (!bids.length) return `<div class="text-sm text-slate-600">No bids yet.</div>`;

  const rows = bids
    .slice()
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .map(
      (b) => `
      <tr class="border-t">
        <td class="py-2 pr-4 font-medium">${b.amount}</td>
        <td class="py-2 pr-4 text-slate-700">${b.bidder?.name ?? "—"}</td>
        <td class="py-2 text-slate-500 text-sm">${new Date(b.created).toLocaleString()}</td>
      </tr>
    `
    )
    .join("");

  return `
    <table class="w-full text-left">
      <thead class="text-xs uppercase text-slate-500">
        <tr><th class="py-2 pr-4">Amount</th><th class="py-2 pr-4">Bidder</th><th class="py-2">Time</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

export async function render({ id }) {
  const out = await getListing(id);
  const item = out?.data;

  const { user } = loadStore();
  const loggedIn = Boolean(user?.name);
  const isOwner = loggedIn && item.seller?.name === user.name;

  const img = item.media?.[0]?.url;

  queueMicrotask(() => bindBid({ id, item, isOwner, loggedIn }));

  return `
    <section class="space-y-6">
      <div class="grid lg:grid-cols-2 gap-6">
        <div class="rounded-2xl border border-slate-200 bg-white overflow-hidden">
          <div class="aspect-[4/3] bg-slate-100">
            ${
              img
                ? `<img src="${img}" alt="${item.media?.[0]?.alt ?? item.title}" class="w-full h-full object-cover" />`
                : `<div class="w-full h-full flex items-center justify-center text-slate-400 text-sm">No image</div>`
            }
          </div>
        </div>

        <div class="space-y-3">
          <h1 class="text-2xl font-semibold">${item.title}</h1>

          <div class="text-sm text-slate-600">${item.description ?? ""}</div>

          <div class="text-sm">
            <div class="text-slate-500">Seller: <span class="text-slate-800 font-medium">${item.seller?.name ?? "—"}</span></div>
            <div class="text-slate-500">Ends: <span class="text-slate-800 font-medium">${new Date(item.endsAt).toLocaleString()}</span></div>
          </div>

          <div class="pt-2">
            ${
              !loggedIn
                ? `<div class="text-sm text-slate-600">You must be logged in to place bids.</div>`
                : isOwner
                ? `<div class="text-sm text-slate-600">You cannot bid on your own listing.</div>`
                : `
                  <form id="bidForm" class="flex gap-2 items-center" onsubmit="return false;">
                    <input id="bidAmount" type="number" min="1" step="1" placeholder="Bid amount"
                      class="w-40 rounded-xl border border-slate-200 px-3 py-2 text-sm" />
                    <button id="bidBtn" class="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800">
                      Place Bid
                    </button>
                  </form>
                `
            }
            <div id="bidMsg" class="mt-2 text-sm text-rose-600"></div>
          </div>
        </div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 class="font-semibold mb-3">Bid History</h2>
        <div id="bidsBox">${bidsTable(item.bids ?? [])}</div>
      </div>
    </section>
  `;
}

function bindBid({ id, item, isOwner, loggedIn }) {
  if (!loggedIn || isOwner) return;

  const form = document.querySelector("#bidForm");
  const btn = document.querySelector("#bidBtn");
  const input = document.querySelector("#bidAmount");
  const msg = document.querySelector("#bidMsg");
  const bidsBox = document.querySelector("#bidsBox");

  if (!form || !btn || !input || !msg) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
  });

  btn.addEventListener("click", async (e) => {
    e.preventDefault();
    msg.textContent = "";

    try {
      const amount = Number(input.value);

      if (!Number.isFinite(amount) || amount <= 0) {
        throw new Error("Please enter a valid bid amount.");
      }

      const highest = Math.max(0, ...(item.bids ?? []).map((b) => b.amount));
      if (amount <= highest) {
        throw new Error(`Bid must be higher than the current highest bid (${highest}).`);
      }

      setButtonLoading(btn, true);

      await bidOnListing(id, amount);

      showToast("Bid placed successfully!", "success");

      const fresh = await getListing(id);
      const freshItem = fresh.data;

      bidsBox.innerHTML = bidsTable(freshItem.bids ?? []);
      input.value = "";

      renderNav();
    } catch (err) {
      console.error(err);
      msg.textContent = err.message || "Bid failed.";
      showToast(err.message || "Bid failed.", "error");
    } finally {
      setButtonLoading(btn, false);
    }
  });
}
