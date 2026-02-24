/**
 * product-list.js
 */
window.ComponentLoader.registerComponent("product-list", (root) => {
  // 1. Estado interno (privado a la instancia)
  const state = {
    currency: root.getAttribute("data-currency") || "$",
    count: 0,
  };

  // 2. Referencias a elementos (siempre relativas a root)
  const grid = root.querySelector(".js-grid");
  const title = root.querySelector(".js-title");

  /**
   * Método de actualización del DOM
   */
  const update = () => {
    title.textContent = `Productos (${state.count})`;
  };

  /**
   * Helper para añadir items
   */
  const addItem = () => {
    state.count++;
    const item = document.createElement("div");
    item.className = "product-item";
    item.innerHTML = `Producto #${state.count} - ${state.currency}`;
    grid.appendChild(item);
    update();
  };

  // 3. Delegación de eventos en el root
  root.addEventListener("click", (e) => {
    // Manejar click en el botón de añadir
    if (e.target.closest(".js-add-item")) {
      addItem();
    }

    // Ejemplo de delegación para items dinámicos
    const item = e.target.closest(".product-item");
    if (item) {
      console.log("Click en item:", item.textContent);
    }
  });

  // 4. Inicialización
  console.log("Product List inicializado con moneda:", state.currency);
  update();

  // Opcional: Exponer update para que otros componentes o Pinegrow puedan llamarlo
  root.updateComponent = update;
});
