import { register } from "../../api/auth.js";

export function render() {
  setTimeout(bindEvents);

  return `
    <section class="max-w-md mx-auto space-y-4">
      <h1 class="text-2xl font-semibold">Create Account</h1>

      <form id="registerForm" class="space-y-3">

        <input id="username" placeholder="Name"
          class="w-full border rounded-xl px-3 py-2"/>

        <input id="email" placeholder="Email (@stud.noroff.no required)"
          class="w-full border rounded-xl px-3 py-2"/>

        <input id="password" type="password" placeholder="Password"
          class="w-full border rounded-xl px-3 py-2"/>

        <input id="avatar" placeholder="Avatar URL (optional)"
          class="w-full border rounded-xl px-3 py-2"/>

        <input id="banner" placeholder="Banner URL (optional)"
          class="w-full border rounded-xl px-3 py-2"/>

        <textarea id="bio" placeholder="Bio"
          class="w-full border rounded-xl px-3 py-2"></textarea>

        <button class="w-full bg-black text-white py-2 rounded-xl">
          Register
        </button>

        <p id="error" class="text-red-600 text-sm"></p>
      </form>
    </section>
  `;
}

function bindEvents() {
  document.querySelector("#registerForm")
    .addEventListener("submit", async e => {
      e.preventDefault();

      
      
      const error = document.querySelector("#error");
      error.textContent = "";

      try {
        await register({
          name: username.value,
          email: email.value,
          password: password.value,
          avatarUrl: avatar.value,
          bannerUrl: banner.value,
          bio: bio.value,
        });

        location.hash = "#/login";
      } catch (err) {
        error.textContent = err.message;
      }
    });
}
