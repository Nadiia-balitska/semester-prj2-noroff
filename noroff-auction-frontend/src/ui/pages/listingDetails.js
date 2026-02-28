import { getListing, bidOnListing } from "../../api/listings.js";
import { loadStore } from "../../store.js";

export async function render({ id }) {
  const res = await getListing(id);
  const item = res.data;

  const { user } = loadStore();
  const loggedIn = !!user;

  return `
    <section class="space-y-6">

      <h1 class="text-2xl font-semibold">${item.title}</h1>

      <p class="text-slate-600">${item.description ?? ""}</p>

      <div class="text-sm text-slate-500">
        Seller: ${item.seller?.name}
      </div>

      <div class="text-sm text-slate-500">
        Ends: ${new Date(item.endsAt).toLocaleString()}
      </div>

      ${
        loggedIn
          ? `
          <div class="flex gap-2">
            <input id="bidAmount"
              type="number"
              placeholder="Bid amount"
              class="border rounded px-3 py-2"/>

            <button id="bidBtn"
              class="bg-black text-white px-4 py-2 rounded">
              Place Bid
            </button>
          </div>
        `
          : `<div class="text-sm text-slate-600">
              You must be logged in to place bids.
             </div>`
      }

      <div>
        <h2 class="font-semibold mb-2">Bid History</h2>

        ${
          item.bids?.length
            ? item.bids
                .map(
                  b => `
                <div class="border-t py-2 text-sm">
                  ${b.bidder.name} — ${b.amount}
                </div>`
                )
                .join("")
            : `<div class="text-sm text-slate-500">No bids yet.</div>`
        }
      </div>

    </section>
  `;
}
