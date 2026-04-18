/**
 * main-footer.js
 * Smart Component: Main Footer
 * — Handles newsletter form submission with loading / success / error states.
 * — Scoped to root: no global IDs or global event listeners.
 */
window.ComponentLoader.registerComponent("main-footer", (root) => {
  // 1. Guard against double-init
  if (root.__initialized) return;
  root.__initialized = true;

  // ---- Copyright year (auto-update) ----
  const copyrightEl = root.querySelector('[data-pgc-edit="Copyright Text"]');
  if (copyrightEl) {
    const currentYear = new Date().getFullYear();
    copyrightEl.textContent = copyrightEl.textContent.replace(/\d{4}/, currentYear);
  }

  // ---- Newsletter Form ----
  const form = root.querySelector(".footer-newsletter-form");
  if (!form) {
    console.log("[Component] Main Footer inicializado (sin form).");
    return;
  }

  const nameInput = form.querySelector('[name="name"]');
  const emailInput = form.querySelector('[name="email"]');
  const botField = form.querySelector('[name="bot-field"]');
  const successMsg = form.querySelector(".footer-form-success");
  const errorMsg = form.querySelector(".footer-form-error");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  /**
   * Sets the form visual state.
   * @param {'idle'|'loading'|'success'|'error'} state
   */
  const setState = (state) => {
    form.setAttribute("data-state", state);
    // Hide both messages first, then show the relevant one
    if (successMsg) successMsg.classList.add("hidden");
    if (errorMsg) errorMsg.classList.add("hidden");
    if (state === "success" && successMsg) successMsg.classList.remove("hidden");
    if (state === "error" && errorMsg) errorMsg.classList.remove("hidden");
  };

  // 2. Form submit handler
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Honeypot: bots fill hidden fields, humans don't
    if (botField && botField.value) return;

    const name = nameInput?.value.trim() ?? "";
    const email = emailInput?.value.trim() ?? "";

    // Client-side validation
    if (!name || !validateEmail(email)) {
      setState("error");
      if (errorMsg) errorMsg.textContent = "Please enter a valid name and email address.";
      setTimeout(() => setState("idle"), 5000);
      return;
    }

    setState("loading");

    try {
      const res = await fetch("/api/newsletter-subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, "bot-field": botField?.value ?? "" }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setState("success");
        // Clear inputs so form resubmit is not accidentally triggered
        if (nameInput) nameInput.value = "";
        if (emailInput) emailInput.value = "";
      } else {
        setState("error");
        if (errorMsg)
          errorMsg.textContent =
            data.error ||
            "Something went wrong. Please try again or contact quickbuyvl@blissedskin.us.";
        setTimeout(() => setState("idle"), 6000);
      }
    } catch {
      setState("error");
      if (errorMsg)
        errorMsg.textContent = "Network error. Please check your connection and try again.";
      setTimeout(() => setState("idle"), 6000);
    }
  });

  // 3. Click tracking (analytics hook for future use)
  root.addEventListener("click", (e) => {
    const link = e.target.closest("a");
    if (link && root.contains(link)) {
      // console.log(`[Footer] Click: ${link.textContent.trim()}`);
    }
  });

  console.log("[Component] Main Footer inicializado.");
});
