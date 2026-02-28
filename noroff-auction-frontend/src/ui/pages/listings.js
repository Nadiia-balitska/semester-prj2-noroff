import { getListings } from "../../api/listings.js";

function card(item) {
  const img = item.media?.[0]?.url;

  return `
    <a href="#/listing/${item.id}"
      class="border rounded-2xl overflow-hidden bg-white hover:shadow">

      <div class="aspect-[4/3] bg-slate-100">
        ${
          img
            ? `<img src="${img}" class="w-full h-full object-cover"/>`
            : `<div class="flex items-center justify-center h-full text-slate-400">
                No image
               </div>`
        }
      </div>

      <div class="p-4">
        <h3 class="font-semibold">${item.title}</h3>

        <p class="text-sm text-slate-600 mt-2 line-clamp-2">
          ${item.description ?? ""}
        </p>

        <div class="text-xs text-slate-500 mt-3">
          Ends: ${new Date(item.endsAt).toLocaleString()}
        </div>
      </div>
    </a>
  `;
}

export async function render({ query }) {
  const q = query?.get("q") || "";

  const { items } = await getListings({ q });

  return `
    <section class="space-y-4">
      <div>
        <h1 class="text-2xl font-semibold">Listings</h1>
        <p class="text-sm text-slate-600">
          Visitors can browse and search. An account is required to place bids.
        </p>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        ${
          items.length
            ? items.map(card).join("")
            : `<div class="text-slate-600">No listings found.</div>`
        }
      </div>
    </section>
  `;
}
