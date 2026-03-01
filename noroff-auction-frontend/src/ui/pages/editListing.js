import {
  getListing,
  updateListing,
  deleteListing
} from "../../api/listings.js";

export async function render({ id }) {
  const res = await getListing(id);
  const item = res.data;

  setTimeout(() => bind(id));

  return `
    <section class="max-w-md mx-auto space-y-4">
      <h1 class="text-2xl font-semibold">Edit Listing</h1>

      <form id="editForm" class="space-y-3">

        <input id="title" value="${item.title}"
          class="w-full border rounded-xl px-3 py-2"/>

        <textarea id="description"
          class="w-full border rounded-xl px-3 py-2">${item.description ?? ""}</textarea>

        <button class="w-full bg-black text-white py-2 rounded-xl">
          Save Changes
        </button>

        <button id="deleteBtn"
          type="button"
          class="w-full bg-red-600 text-white py-2 rounded-xl">
          Delete Listing
        </button>
      </form>
    </section>
  `;
}

function bind(id) {
  document.querySelector("#editForm")
    .addEventListener("submit", async e => {
      e.preventDefault();

      await updateListing(id, {
        title: title.value,
        description: description.value,
      });

      location.hash = "#/listing/" + id;
    });

  document.querySelector("#deleteBtn")
    .addEventListener("click", async () => {
      if (!confirm("Delete this listing?")) return;

      await deleteListing(id);
      location.hash = "#/listings";
    });
}
