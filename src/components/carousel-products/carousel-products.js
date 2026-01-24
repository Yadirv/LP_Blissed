/**
 * carousel-products.js
 * Lógica para el componente carousel-products (Smart Component)
 */
window.ComponentLoader.registerComponent('carousel-products', (root) => {
    // 1. Protección contra doble inicialización
    if (root.__initialized) return;
    root.__initialized = true;

    // 2. Configuración y Estado Local (Lectura de props)
    const state = {
        currentIndex: parseInt(root.getAttribute('data-start-index')) || 1,
        totalSlides: 0
    };

    // 3. Referencias relativas al root (Sin IDs)
    const track = root.querySelector('.pg-slides');
    const slides = Array.from(root.querySelectorAll('.pg-slide'));
    const dots = Array.from(root.querySelectorAll('.pg-dot'));
    const prevBtn = root.querySelector('[data-action="prev"]');
    const nextBtn = root.querySelector('[data-action="next"]');
    state.totalSlides = slides.length;

    if (!track || slides.length === 0) {
        console.error('[CarouselProducts] Elementos esenciales no encontrados');
        return;
    }

    // Detectar índice inicial desde el HTML (aria-current o is-active)
    const activeSlideIndex = slides.findIndex(s => 
        s.getAttribute('aria-current') === 'true' || 
        s.classList.contains('is-active') ||
        s.getAttribute('data-state') === 'active'
    );
    
    if (activeSlideIndex !== -1) {
        state.currentIndex = activeSlideIndex;
    }

    /**
     * Helper: setActive
     * Gestiona clases de estado y atributos ARIA de forma limpia
     */
    const setActive = (el, isActive, activeClass = 'is-active') => {
        if (!el) return;
        if (isActive) {
            el.classList.add(activeClass);
            el.setAttribute('aria-current', 'true');
            el.setAttribute('aria-hidden', 'false');
        } else {
            el.classList.remove(activeClass);
            el.setAttribute('aria-current', 'false');
            el.setAttribute('aria-hidden', 'true');
        }
    };

    /**
     * Método Update: Sincroniza el DOM con el estado
     */
    const update = () => {
        console.log(`[CarouselProducts] Actualizando a índice: ${state.currentIndex}`);

        // Primero, remover todas las clases de estado para forzar re-render
        slides.forEach(slide => {
            slide.classList.remove('is-active', 'is-inactive');
        });

        // Forzar reflow para que el navegador procese el cambio
        void track.offsetHeight;

        // Aplicar nuevas clases de estado
        slides.forEach((slide, index) => {
            const isActive = index === state.currentIndex;
            
            // Aplicar clases de estado
            slide.classList.toggle('is-active', isActive);
            slide.classList.toggle('is-inactive', !isActive);
            
            // Actualizar atributos ARIA
            slide.setAttribute('aria-current', isActive ? 'true' : 'false');
            slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            slide.setAttribute('data-state', isActive ? 'active' : (index < state.currentIndex ? 'prev' : 'next'));
            slide.tabIndex = isActive ? 0 : -1;
        });

        // Sincronizar dots
        dots.forEach((dot, index) => {
            const isActive = index === state.currentIndex;
            dot.classList.toggle('is-selected', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
            
            // Actualizar estilos de los dots
            if (isActive) {
                dot.style.backgroundColor = '#3C3C3C'; // blissed-gray
            } else {
                dot.style.backgroundColor = 'rgba(60, 60, 60, 0.3)'; // blissed-gray/30
            }
        });

        // Estado de las flechas
        if (prevBtn) {
            const isFirst = state.currentIndex === 0;
            prevBtn.classList.toggle('is-disabled', isFirst);
            prevBtn.disabled = isFirst;
        }
        if (nextBtn) {
            const isLast = state.currentIndex === state.totalSlides - 1;
            nextBtn.classList.toggle('is-disabled', isLast);
            nextBtn.disabled = isLast;
        }
    };

    // 4. Delegación de Eventos en el Root
    root.addEventListener('click', (e) => {
        // Manejo de Flechas (data-action)
        const arrow = e.target.closest('.pg-arrow');
        if (arrow && root.contains(arrow)) {
            const action = arrow.getAttribute('data-action');
            state.currentIndex = action === 'next' 
                ? (state.currentIndex + 1) % state.totalSlides 
                : (state.currentIndex - 1 + state.totalSlides) % state.totalSlides;
            update();
            return;
        }

        // Manejo de Dots (data-index)
        const dot = e.target.closest('.pg-dot');
        if (dot && root.contains(dot)) {
            state.currentIndex = parseInt(dot.getAttribute('data-index'));
            update();
            return;
        }

        // Manejo de Click en Slide (para centrarlo)
        const slide = e.target.closest('.pg-slide');
        if (slide && root.contains(slide) && !e.target.closest('.pg-cta')) {
            state.currentIndex = Array.from(slides).indexOf(slide);
            update();
            return;
        }

        // Manejo de Botón "Add to Cart" (Delegación local)
        const cta = e.target.closest('.pg-cta');
        if (cta && root.contains(cta)) {
            const h3 = cta.closest('.pg-slide').querySelector('h3');
            const productName = h3 ? h3.textContent : 'Producto';
            console.log(`[Shop] Añadiendo al carrito: ${productName}`);
        }
    });

    // Soporte para teclado
    root.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && state.currentIndex > 0) {
            state.currentIndex--;
            update();
        } else if (e.key === 'ArrowRight' && state.currentIndex < state.totalSlides - 1) {
            state.currentIndex++;
            update();
        }
    });

    // 5. Inicialización inicial
    update();
    console.log('[Component] Carousel1Home inicializado correctamente.');
});
