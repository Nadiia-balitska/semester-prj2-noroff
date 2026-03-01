import { createListing } from "../../api/listings.js";

export function render() {
  setTimeout(bind);

  return `
    <section class="max-w-md mx-auto space-y-4">
      <h1 class="text-2xl font-semibold">Create Listing</h1>

      <form id="createForm" class="space-y-3">

        <input id="title" placeholder="Title"
          class="w-full border rounded-xl px-3 py-2"/>

        <input id="image" placeholder="Image URL"
          class="w-full border rounded-xl px-3 py-2"/>

        <input id="endsAt" type="datetime-local"
          class="w-full border rounded-xl px-3 py-2"/>

        <textarea id="description"
          placeholder="Description"
          class="w-full border rounded-xl px-3 py-2"></textarea>

        <button class="w-full bg-black text-white py-2 rounded-xl">
          Create
        </button>

        <p id="error" class="text-red-600 text-sm"></p>
      </form>
    </section>
  `;
}

function bind() {
  document.querySelector("#createForm")
    .addEventListener("submit", async e => {
      e.preventDefault();

      try {
        await createListing({
          title: title.value,
          description: description.value,
          endsAt: new Date(endsAt.value).toISOString(),
          media: image.value
            ? [{ url: image.value, alt: title.value }]
            : [],
        });

        location.hash = "#/listings";
      } catch (err) {
        document.querySelector("#error").textContent = err.message;
      }
    });
}
