/**
 * product-carousel-full.js
 * Carousel de productos con descripción sincronizada
 */
window.ComponentLoader.registerComponent("product-carousel-full", (root) => {
  if (root.__initialized) return;
  root.__initialized = true;

  // Estado
  const state = {
    currentIndex: 0,
    totalSlides: 0,
  };

  // Referencias DOM
  const track = root.querySelector(".js-carousel-track");
  const viewport = root.querySelector(".js-carousel-viewport");
  const slides = Array.from(root.querySelectorAll(".js-product-slide"));
  const dots = Array.from(root.querySelectorAll(".js-dot"));
  const prevBtn = root.querySelector(".js-prev-btn");
  const nextBtn = root.querySelector(".js-next-btn");

  // Elementos de descripción
  const descContainer = root.querySelector(".js-product-description");
  const titleEl = descContainer.querySelector(".js-title");
  const descEl = descContainer.querySelector(".js-description");
  const priceEl = descContainer.querySelector(".js-price");
  const sizesEl = descContainer.querySelector(".js-sizes");
  const featuresEl = descContainer.querySelector(".js-features");
  const addToCartBtn = descContainer.querySelector(".js-add-to-cart");

  if (!track || !viewport || slides.length === 0) {
    console.error("[ProductCarouselFull] Elementos esenciales no encontrados");
    return;
  }

  state.totalSlides = slides.length;
  track.removeAttribute("style");

  /**
   * Actualiza el carousel y la descripción
   */
  const update = () => {
    const viewportWidth = viewport.offsetWidth || 0;

    if (viewportWidth > 0 && state.totalSlides > 0) {
      track.style.width = `${viewportWidth * state.totalSlides}px`;
      track.style.transform = `translateX(-${viewportWidth * state.currentIndex}px)`;

      slides.forEach((slide, idx) => {
        slide.style.width = `${viewportWidth}px`;
        slide.classList.toggle("is-active", idx === state.currentIndex);
      });
    }

    // Actualizar dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === state.currentIndex);
      dot.setAttribute("aria-current", idx === state.currentIndex ? "true" : "false");
    });

    // Deshabilitar botones en extremos
    if (prevBtn) prevBtn.disabled = state.currentIndex === 0;
    if (nextBtn) nextBtn.disabled = state.currentIndex === state.totalSlides - 1;

    // Actualizar descripción
    updateDescription();
  };

  /**
   * Actualiza la descripción del producto actual
   */
  const updateDescription = () => {
    const currentSlide = slides[state.currentIndex];
    const data = {
      id: currentSlide.dataset.productId,
      price: currentSlide.dataset.price,
      title: currentSlide.dataset.title,
      description: currentSlide.dataset.description,
      sizes: currentSlide.dataset.sizes?.split(",").map((s) => s.trim()) || [],
      features: currentSlide.dataset.features?.split("|") || [],
      stock: currentSlide.dataset.stock || "in-stock",
    };

    // Actualizar contenido
    if (titleEl) titleEl.textContent = data.title;
    if (descEl) descEl.textContent = data.description;
    if (priceEl) priceEl.textContent = `$${parseFloat(data.price).toFixed(2)}`;

    // Actualizar sizes con mejor diseño visual
    if (sizesEl) {
      if (data.sizes.length > 0) {
        sizesEl.innerHTML = data.sizes
          .map(
            (size) =>
              `<span class="inline-block px-3 py-1.5 bg-gradient-to-r from-[#9aad7a] to-[#7a8d5a] text-white text-xs font-semibold rounded-full shadow-sm">${size}</span>`
          )
          .join("");
      } else {
        sizesEl.innerHTML = '<span class="text-sm text-gray-400">N/A</span>';
      }
    }

    // Actualizar features
    if (featuresEl) {
      featuresEl.innerHTML =
        data.features.length > 0
          ? `<ul class="space-y-2">${data.features.map((f) => `<li>${f}</li>`).join("")}</ul>`
          : "";
    }

    // Estado del botón
    if (addToCartBtn) {
      const isOutOfStock = data.stock === "out-of-stock";
      addToCartBtn.disabled = isOutOfStock;
      addToCartBtn.textContent = isOutOfStock ? "Out of Stock" : "Add to Cart";
      addToCartBtn.classList.toggle("opacity-50", isOutOfStock);
      addToCartBtn.classList.toggle("cursor-not-allowed", isOutOfStock);
    }

    console.log(`[ProductCarouselFull] Producto actualizado: ${data.title}`);
  };

  /**
   * Navegación
   */
  const navigate = (direction) => {
    if (direction === "next" && state.currentIndex < state.totalSlides - 1) {
      state.currentIndex++;
    } else if (direction === "prev" && state.currentIndex > 0) {
      state.currentIndex--;
    }
    update();
  };

  // Eventos
  root.addEventListener("click", (e) => {
    // Flechas
    if (e.target.closest(".js-prev-btn")) {
      navigate("prev");
      return;
    }
    if (e.target.closest(".js-next-btn")) {
      navigate("next");
      return;
    }

    // Dots
    const dot = e.target.closest(".js-dot");
    if (dot) {
      state.currentIndex = parseInt(dot.dataset.index);
      update();
      return;
    }

    // Add to Cart
    if (e.target.closest(".js-add-to-cart")) {
      const currentSlide = slides[state.currentIndex];
      const productId = currentSlide.dataset.productId;
      console.log(`[ProductCarouselFull] Agregando al carrito: ${productId}`);

      // Emit custom event
      root.dispatchEvent(
        new CustomEvent("product:added-to-cart", {
          detail: { productId },
          bubbles: true,
        })
      );
    }
  });

  // Teclado
  root.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") navigate("prev");
    if (e.key === "ArrowRight") navigate("next");
  });

  // Resize
  if (window.ResizeObserver) {
    const resizeObserver = new ResizeObserver(() => update());
    resizeObserver.observe(viewport);
  } else {
    window.addEventListener("resize", update);
  }

  // Inicializar
  requestAnimationFrame(() => {
    update();
    console.log("[ProductCarouselFull] Inicializado correctamente");
  });
});
