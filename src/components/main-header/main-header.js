/**
 * main-header.js
 * Lógica para el componente Header (Smart Component)
 */
window.ComponentLoader.registerComponent("main-header", (root) => {
  // 1. Protección contra doble inicialización
  if (root.__initialized) return;
  root.__initialized = true;

  // 2. Configuración y Estado Local
  const state = {
    isSticky: false,
    lastScrollY: window.scrollY,
    isMobileOpen: false,
  };

  // 3. Referencias relativas al root
  const navLinks = root.querySelectorAll("nav a");
  const mobileToggle = root.querySelector(".header-mobile-toggle");
  const mobileOverlay = root.querySelector(".header-mobile-overlay");
  const nav = root.querySelector("nav");

  const isMobileViewport = () => window.matchMedia("(max-width: 1023px)").matches;

  const setMobileMenu = (isOpen) => {
    state.isMobileOpen = isOpen;
    root.classList.toggle("is-mobile-open", isOpen);

    if (mobileToggle) {
      mobileToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    }

    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  /**
   * Maneja el estado sticky del header al hacer scroll
   */
  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const shouldBeSticky = currentScrollY > 50;

    if (shouldBeSticky !== state.isSticky) {
      state.isSticky = shouldBeSticky;
      root.classList.toggle("is-sticky", state.isSticky);
    }
    state.lastScrollY = currentScrollY;
  };

  // 4. Delegación de Eventos y Listeners

  // Listener de scroll (global pero afecta al root localmente)
  window.addEventListener("scroll", handleScroll, { passive: true });

  // Delegación de clicks en navegación
  root.addEventListener("click", (e) => {
    if (e.target.closest(".header-mobile-toggle")) {
      e.preventDefault();
      setMobileMenu(!state.isMobileOpen);
      return;
    }

    if (e.target.closest(".header-mobile-overlay")) {
      setMobileMenu(false);
      return;
    }

    if (isMobileViewport()) {
      const dropdownToggle = e.target.closest(".nav-dropdown-toggle");
      if (dropdownToggle && nav && nav.contains(dropdownToggle)) {
        e.preventDefault();
        const parent = dropdownToggle.closest(".nav-dropdown");
        if (parent) {
          parent.classList.toggle("is-open");
          const expanded = parent.classList.contains("is-open");
          dropdownToggle.setAttribute("aria-expanded", expanded ? "true" : "false");
        }
        return;
      }

      const subdropdownToggle = e.target.closest(".nav-subdropdown-toggle");
      if (subdropdownToggle && nav && nav.contains(subdropdownToggle)) {
        e.preventDefault();
        const parent = subdropdownToggle.closest(".nav-subdropdown");
        if (parent) {
          parent.classList.toggle("is-open");
        }
        return;
      }
    }

    const link = e.target.closest("nav a");
    if (link && root.contains(link)) {
      // Ejemplo: marcar como activo el link clickeado
      navLinks.forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");
      if (state.isMobileOpen) {
        setMobileMenu(false);
      }
      console.log(`[Nav] Navegando a: ${link.textContent}`);
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobileViewport() && state.isMobileOpen) {
      setMobileMenu(false);
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && state.isMobileOpen) {
      setMobileMenu(false);
    }
  });

  // 5. Inicialización inicial
  handleScroll();
  console.log("[Component] Main Header inicializado.");
});
