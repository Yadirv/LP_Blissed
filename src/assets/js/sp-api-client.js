/**
 * sp-api-client.js
 * Servicio de cliente para la Netlify Function SP-API.
 * - Recolecta todos los [data-asin] del DOM
 * - Llama a /api/sp-api-products?action=getProducts
 * - Actualiza precio, precio tachado, % descuento, stock e imagen principal
 */

(function () {
  "use strict";

  // Endpoint de la Netlify Function (relativo → funciona en cualquier dominio/preview)
  const SP_API_ENDPOINT = "/api/sp-api-products";

  /**
   * Recolecta todos los elementos del DOM que tienen data-asin definido y no vacío.
   * @returns {Map<string, Element[]>} asin → lista de elementos que lo usan
   */
  function collectAsinElements() {
    const map = new Map();
    document.querySelectorAll("[data-asin]").forEach((el) => {
      const asin = el.dataset.asin.trim();
      if (!asin) return;
      if (!map.has(asin)) map.set(asin, []);
      map.get(asin).push(el);
    });
    return map;
  }

  /**
   * Llama al endpoint de SP-API con los ASINs indicados.
   * @param {string[]} asins
   * @returns {Promise<Object[]>} array de productos
   */
  async function fetchProducts(asins) {
    if (!asins.length) return [];
    const url = `${SP_API_ENDPOINT}?action=getProducts&asins=${asins.join(",")}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`SP-API error ${res.status}`);
    const data = await res.json();
    return data.products || [];
  }

  /**
   * Actualiza el DOM de un elemento con los datos SP-API.
   * Selectores usados en product-card y product-slide:
   *   .js-product-price       → precio actual
   *   .js-product-price-list  → precio de lista (tachado)
   *   .js-product-savings     → badge de ahorro "XX% off"
   *   .js-product-stock       → badge de stock / estado del botón
   *   .js-add-to-cart         → botón Add to Cart (disabled si out of stock)
   *   .js-button-text         → texto del botón
   *   .js-prime-badge         → badge Prime (show/hide)
   */
  function updateElement(el, product) {
    if (product.error) {
      console.warn(`[SP-API] ${product.asin}: ${product.error}`);
      return;
    }

    const { pricing, availability } = product;

    // --- Precio actual ---
    // Soporta .js-product-price (product-card) y .pg-price (carousel home)
    const priceEl = el.querySelector(".js-product-price, .pg-price");
    if (priceEl && pricing.current !== null) {
      priceEl.textContent = `$${pricing.current.toFixed(2)}`;
      el.dataset.price = pricing.current.toFixed(2);
    }

    // --- Precio de lista (tachado) ---
    const listEl = el.querySelector(".js-product-price-list");
    if (listEl) {
      if (pricing.list && pricing.list > pricing.current) {
        listEl.textContent = `$${pricing.list.toFixed(2)}`;
        listEl.classList.remove("hidden");
      } else {
        listEl.classList.add("hidden");
      }
    }

    // --- Badge de ahorro ---
    const savingsEl = el.querySelector(".js-product-savings");
    if (savingsEl) {
      if (pricing.savingsPct && pricing.savingsPct > 0) {
        savingsEl.textContent = `${pricing.savingsPct}% off`;
        savingsEl.classList.remove("hidden");
      } else {
        savingsEl.classList.add("hidden");
      }
    }

    // --- Stock ---
    const inStock = availability.inStock;
    const addToCartBtn = el.querySelector(".js-add-to-cart");
    const buttonText = el.querySelector(".js-button-text");
    const stockEl = el.querySelector(".js-product-stock");

    if (!inStock) {
      el.classList.add("is-out-of-stock");
      if (addToCartBtn) addToCartBtn.disabled = true;
      if (buttonText) buttonText.textContent = "Out of Stock";
      if (stockEl) {
        stockEl.textContent = "Out of Stock";
        stockEl.classList.remove("hidden");
        stockEl.classList.add("bg-red-100", "text-red-700");
      }
    } else {
      el.classList.remove("is-out-of-stock");
      if (addToCartBtn) addToCartBtn.disabled = false;
      if (stockEl) stockEl.classList.add("hidden");
    }

    // --- Badge Prime ---
    const primeBadge = el.querySelector(".js-prime-badge");
    if (primeBadge) {
      if (availability.isPrime) {
        primeBadge.classList.remove("hidden");
      } else {
        primeBadge.classList.add("hidden");
      }
    }

    console.log(`[SP-API] Updated ${product.asin} → $${pricing.current} | inStock: ${inStock}`);
  }

  /**
   * Punto de entrada principal.
   * Se puede llamar manualmente: window.SPAPIClient.refresh()
   */
  async function refresh() {
    const asinMap = collectAsinElements();
    if (!asinMap.size) {
      console.log("[SP-API] No data-asin elements found on page.");
      return;
    }

    const asins = Array.from(asinMap.keys());
    console.log(`[SP-API] Fetching ${asins.length} product(s):`, asins);

    try {
      const products = await fetchProducts(asins);
      products.forEach((product) => {
        const elements = asinMap.get(product.asin) || [];
        elements.forEach((el) => updateElement(el, product));
      });
      console.log(`[SP-API] Updated ${products.length} product(s).`);
    } catch (err) {
      console.error("[SP-API] Failed to fetch products:", err.message);
    }
  }

  // Exposición pública
  window.SPAPIClient = { refresh };

  // Auto-inicialización cuando el DOM esté listo
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", refresh);
  } else {
    refresh();
  }
})();
