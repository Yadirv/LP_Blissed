/**
 * components-init.js
 * Sistema de inicialización dinámica para Smart Components de Pinegrow.
 */

const ComponentLoader = (() => {
  const registry = new Map();

  /**
   * Inicializa un nodo específico si tiene un inicializador registrado.
   */
  const initComponent = (el) => {
    if (el.__initialized) return;

    const componentName = el.getAttribute("data-component");
    const initFn = registry.get(componentName);

    if (initFn) {
      try {
        initFn(el);
        el.__initialized = true;
        // console.log(`[ComponentLoader] Inicializado: ${componentName}`);
      } catch (error) {
        console.error(`[ComponentLoader] Error en ${componentName}:`, error);
      }
    }
  };

  /**
   * Registra un nuevo componente en el sistema.
   */
  const registerComponent = (name, initFn) => {
    registry.set(name, initFn);
    // Si el componente ya existe en el DOM al registrarse, inicializarlo
    document.querySelectorAll(`[data-component="${name}"]`).forEach(initComponent);
  };

  /**
   * Escanea el DOM en busca de componentes no inicializados.
   */
  const initAll = (container = document) => {
    container.querySelectorAll("[data-component]").forEach(initComponent);
  };

  /**
   * MutationObserver para detectar componentes insertados dinámicamente.
   */
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // Element node
          if (node.hasAttribute("data-component")) initComponent(node);
          initAll(node);
        }
      });
    });
  });

  const start = () => {
    initAll();
    observer.observe(document.body, { childList: true, subtree: true });
  };

  return { registerComponent, start };
})();

// Exponer globalmente para que los componentes individuales puedan registrarse
window.ComponentLoader = ComponentLoader;

// Iniciar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", () => ComponentLoader.start());
