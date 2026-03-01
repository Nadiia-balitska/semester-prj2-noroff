import { getListing, bidOnListing } from "../../api/listings.js";
import { loadStore } from "../../store.js";
import { showToast, setButtonLoading } from "../components.js";

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
  const item = out.data;

  const { user } = loadStore();
  const loggedIn = Boolean(user?.name);
  const isOwner = loggedIn && item.seller?.name === user.name;

  queueMicrotask(() => bindBidHandlers(id, item, loggedIn, isOwner));

  return `
    <section class="space-y-6">
      <div class="space-y-2">
        <h1 class="text-2xl font-semibold">${item.title}</h1>
        <p class="text-slate-600">${item.description ?? ""}</p>
        <div class="text-sm text-slate-500">Seller: <b class="text-slate-800">${item.seller?.name ?? "—"}</b></div>
        <div class="text-sm text-slate-500">Ends: <b class="text-slate-800">${new Date(item.endsAt).toLocaleString()}</b></div>
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4 space-y-2">
        ${
          !loggedIn
            ? `<div class="text-sm text-slate-600">You must be logged in to place bids.</div>`
            : isOwner
            ? `<div class="text-sm text-slate-600">You cannot bid on your own listing.</div>`
            : `
              <form id="bidForm" class="flex gap-2 items-center">
                <input id="bidAmount" type="number" min="1" step="1"
                  placeholder="Bid amount"
                  class="w-40 rounded-xl border border-slate-200 px-3 py-2 text-sm" />

                <button id="bidBtn" type="submit"
                  class="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm hover:bg-slate-800">
                  Place Bid
                </button>
              </form>
              <p id="bidError" class="text-sm text-rose-600"></p>
            `
        }
      </div>

      <div class="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 class="font-semibold mb-3">Bid History</h2>
        <div id="bidsBox">${bidsTable(item.bids ?? [])}</div>
      </div>
    </section>
  `;
}

function bindBidHandlers(id, item, loggedIn, isOwner) {
  if (!loggedIn || isOwner) return;

  const page = document.querySelector("#page");
  const form = document.querySelector("#bidForm");
  const input = document.querySelector("#bidAmount");
  const btn = document.querySelector("#bidBtn");
  const errEl = document.querySelector("#bidError");

  if (!page || !form || !input || !btn || !errEl) return;

  const handleBid = async () => {
    errEl.textContent = "";

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

      location.hash = `#/listing/${id}`;
    } catch (e) {
      console.error(e);
      errEl.textContent = e.message || "Bid failed.";
      showToast(e.message || "Bid failed.", "error");
    } finally {
      setButtonLoading(btn, false);
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    handleBid();
  });

  page.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.id === "bidBtn") {
      e.preventDefault();
      handleBid();
    }
  });
}
