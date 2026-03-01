// =============================
// TOAST NOTIFICATIONS
// =============================

let toastContainer;

function getToastContainer() {
  if (!toastContainer) {
    toastContainer = document.createElement("div");
    toastContainer.className =
      "fixed top-4 right-4 z-50 flex flex-col gap-2";
    document.body.appendChild(toastContainer);
  }
  return toastContainer;
}

export function showToast(message, type = "success") {
  const container = getToastContainer();

  const toast = document.createElement("div");

  const colors = {
    success: "bg-green-600",
    error: "bg-red-600",
    info: "bg-slate-800"
  };

  toast.className = `
    ${colors[type]}
    text-white px-4 py-3 rounded-xl shadow-lg
    animate-fade-in text-sm
  `;

  toast.textContent = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// =============================
// LOADING SPINNER
// =============================

export function spinner() {
  return `
    <div class="flex justify-center py-10">
      <div class="w-8 h-8 border-4 border-slate-300
                  border-t-black rounded-full animate-spin">
      </div>
    </div>
  `;
}

// =============================
// BUTTON LOADING STATE
// =============================

export function setButtonLoading(button, loading = true) {
  if (!button) return;

  if (loading) {
    button.dataset.original = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `
      <span class="flex items-center gap-2 justify-center">
        <span class="w-4 h-4 border-2 border-white
                     border-t-transparent rounded-full animate-spin"></span>
        Loading...
      </span>
    `;
  } else {
    button.disabled = false;
    button.innerHTML = button.dataset.original;
  }
}

// =============================
// EMPTY STATE
// =============================

export function emptyState(text = "Nothing here yet.") {
  return `
    <div class="text-center py-12 text-slate-500">
      <p class="text-lg">${text}</p>
    </div>
  `;
}

// =============================
// CONFIRM MODAL
// =============================

export function confirmModal(message) {
  return new Promise(resolve => {
    const overlay = document.createElement("div");
    overlay.className =
      "fixed inset-0 bg-black/40 flex items-center justify-center z-50";

    overlay.innerHTML = `
      <div class="bg-white rounded-2xl p-6 w-[90%] max-w-sm space-y-4">
        <p class="text-slate-800">${message}</p>

        <div class="flex justify-end gap-2">
          <button id="cancelBtn"
            class="px-4 py-2 border rounded-xl">
            Cancel
          </button>

          <button id="confirmBtn"
            class="px-4 py-2 bg-red-600 text-white rounded-xl">
            Confirm
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelector("#cancelBtn").onclick = () => {
      overlay.remove();
      resolve(false);
    };

    overlay.querySelector("#confirmBtn").onclick = () => {
      overlay.remove();
      resolve(true);
    };
  });
}
