import { loadStore, saveStore } from "../../store.js";
import { getMyProfile, updateProfile } from "../../api/profiles.js";

export async function render() {
  const { user } = loadStore();
  const res = await getMyProfile(user.name);
  const profile = res.data;

  setTimeout(() => bind(profile));

  return `
    <section class="space-y-6">

      <h1 class="text-2xl font-semibold">Profile</h1>

      <div class="border rounded-xl p-4 bg-white space-y-2">
        <p><b>Name:</b> ${profile.name}</p>
        <p><b>Credits:</b> ${profile.credits}</p>
      </div>

      <form id="profileForm" class="space-y-3 max-w-md">

        <input id="avatar"
          placeholder="Avatar URL"
          value="${profile.avatar?.url ?? ""}"
          class="w-full border rounded-xl px-3 py-2"/>

        <input id="banner"
          placeholder="Banner URL"
          value="${profile.banner?.url ?? ""}"
          class="w-full border rounded-xl px-3 py-2"/>

        <textarea id="bio"
          class="w-full border rounded-xl px-3 py-2"
          placeholder="Bio">${profile.bio ?? ""}</textarea>

        <button class="bg-black text-white px-4 py-2 rounded-xl">
          Update Profile
        </button>

        <p id="msg" class="text-sm text-green-600"></p>
      </form>

    </section>
  `;
}

function bind(profile) {
  document.querySelector("#profileForm")
    .addEventListener("submit", async e => {
      e.preventDefault();

      await updateProfile(profile.name, {
        avatarUrl: avatar.value,
        bannerUrl: banner.value,
        bio: bio.value,
      });

      saveStore({
        user: { ...loadStore().user, avatar: avatar.value }
      });

      document.querySelector("#msg").textContent =
        "Profile updated successfully.";
    });
}
