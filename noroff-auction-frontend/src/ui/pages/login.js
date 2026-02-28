import { login } from "../../api/auth.js";

export function render() {
  setTimeout(bindEvents);

  return `
    <section class="max-w-md mx-auto space-y-4">
      <h1 class="text-2xl font-semibold">Login</h1>

      <form id="loginForm" class="space-y-3">
        <input id="email"
          type="email"
          placeholder="Email"
          class="w-full border rounded-xl px-3 py-2"/>

        <input id="password"
          type="password"
          placeholder="Password"
          class="w-full border rounded-xl px-3 py-2"/>

        <button class="w-full bg-black text-white py-2 rounded-xl">
          Sign in
        </button>

        <p class="text-sm">
          Don't have an account?
          <a href="#/register" class="underline">Register</a>
        </p>

        <p id="error" class="text-red-600 text-sm"></p>
      </form>
    </section>
  `;
}

function bindEvents() {
  document.querySelector("#loginForm")
    .addEventListener("submit", async e => {
      e.preventDefault();

      const error = document.querySelector("#error");
      error.textContent = "";

      try {
        await login({
          email: document.querySelector("#email").value,
          password: document.querySelector("#password").value,
        });

        location.hash = "#/listings";
      } catch (err) {
        error.textContent = err.message;
      }
    });
}
