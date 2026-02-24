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
  };

  // 3. Referencias relativas al root
  const searchInput = root.querySelector('input[type="text"]');
  const navLinks = root.querySelectorAll("nav a");

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

  // Manejo del buscador
  if (searchInput) {
    searchInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        console.log(`[Search] Buscando: ${searchInput.value}`);
        // Aquí iría la lógica de redirección o filtrado
      }
    });
  }

  // Delegación de clicks en navegación
  root.addEventListener("click", (e) => {
    const link = e.target.closest("nav a");
    if (link && root.contains(link)) {
      // Ejemplo: marcar como activo el link clickeado
      navLinks.forEach((l) => l.classList.remove("is-active"));
      link.classList.add("is-active");
      console.log(`[Nav] Navegando a: ${link.textContent}`);
    }
  });

  // 5. Inicialización inicial
  handleScroll();
  console.log("[Component] Main Header inicializado.");
});
