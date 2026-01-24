/**
 * carousel-reviews.js
 * Lógica para el componente de testimonios (Smart Component)
 */
window.ComponentLoader.registerComponent('carousel-reviews', (root) => {
    // 1. Protección contra doble inicialización
    if (root.__initialized) return;
    root.__initialized = true;

    // 2. Configuración y Estado Local
    const state = {
        currentIndex: 0,
        totalSlides: 0
    };

    // 3. Referencias relativas al root
    const track = root.querySelector('.pg-track');
    const viewport = root.querySelector('.pg-viewport');
    const slides = Array.from(root.querySelectorAll('.pg-slide'));
    const dots = Array.from(root.querySelectorAll('.pg-dot'));
    
    // Validar que tengamos todos los elementos necesarios
    if (!track || !viewport || slides.length === 0) {
        console.error('[CarouselReviews] Elementos esenciales no encontrados');
        return;
    }
    
    state.totalSlides = slides.length;
    state.currentIndex = 0;
    
    // Limpiar cualquier estilo inline previo
    track.removeAttribute('style');
    slides.forEach(slide => slide.removeAttribute('style'));

    /**
     * Método Update: Sincroniza el DOM con el estado
     */
    const update = () => {
        const viewportWidth = viewport?.offsetWidth || 0;
        const viewportHeight = viewport?.offsetHeight || 0;
        const trackWidth = track?.offsetWidth || 0;
        
        console.log(`[CarouselReviews] === DEBUG UPDATE ===`);
        console.log(`Índice: ${state.currentIndex}`);
        console.log(`ViewportWidth: ${viewportWidth}px`);
        console.log(`ViewportHeight: ${viewportHeight}px`);
        console.log(`TrackWidth antes: ${trackWidth}px`);
        console.log(`Total slides: ${state.totalSlides}`);
        
        // Solo aplicar estilos si tenemos un ancho válido
		if (track && viewportWidth > 0 && state.totalSlides > 0) {
			const newTrackWidth = viewportWidth * state.totalSlides;
			const translateX = viewportWidth * state.currentIndex;
			
			console.log(`Aplicando: trackWidth=${newTrackWidth}px, translateX=${translateX}px`);
			
			// Aplicar estilos al track con !important via style
			track.style.cssText = `
				width: ${newTrackWidth}px !important;
				transform: translateX(-${translateX}px) !important;
				display: flex !important;
				transition: transform 0.5s ease-in-out;
			`;
			
			// Asegurar que cada slide tenga el ancho correcto y sea visible
			slides.forEach((slide, idx) => {
				slide.style.cssText = `
					width: ${viewportWidth}px !important;
					min-width: ${viewportWidth}px !important;
					max-width: ${viewportWidth}px !important;
					display: flex !important;
					visibility: visible !important;
					opacity: 1 !important;
					flex-shrink: 0 !important;
				`;
				console.log(`Slide ${idx}: width=${slide.offsetWidth}px, height=${slide.offsetHeight}px`);
			});
			
			console.log(`TrackWidth después: ${track.offsetWidth}px`);
		} else {
			console.warn(`No se aplicaron estilos: viewportWidth=${viewportWidth}, totalSlides=${state.totalSlides}`);
		}

        slides.forEach((slide, index) => {
            const isActive = index === state.currentIndex;
            
            // Aplicamos clases de estado
            slide.classList.toggle('is-active', isActive);
            slide.classList.toggle('is-inactive', !isActive);
            
            slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            slide.tabIndex = isActive ? 0 : -1;
        });

        // Sincronizar dots
        dots.forEach((dot, index) => {
            const isActive = index === state.currentIndex;
            dot.classList.toggle('is-selected', isActive);
            dot.setAttribute('aria-current', isActive ? 'true' : 'false');
        });

        // Manejo de estado de las flechas (opcional: deshabilitar en extremos)
        const prevBtn = root.querySelector('[data-action="prev"]');
        const nextBtn = root.querySelector('[data-action="next"]');
        
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

    const handleResize = () => {
		update();
	};
	
	// Usar ResizeObserver para detectar cambios en el viewport
	if (window.ResizeObserver) {
		const resizeObserver = new ResizeObserver(handleResize);
		resizeObserver.observe(viewport);
	} else {
		// Fallback a window resize
		window.addEventListener('resize', handleResize);
	}
	
	// Forzar update inicial después de un pequeño delay para asegurar que el viewport tenga dimensiones
	setTimeout(() => {
		update();
	}, 100);

    // 4. Delegación de Eventos en el Root
    root.addEventListener('click', (e) => {
        // Flechas
        const arrow = e.target.closest('.pg-arrow');
        if (arrow && root.contains(arrow)) {
            const action = arrow.getAttribute('data-action');
            if (action === 'next' && state.currentIndex < state.totalSlides - 1) {
                state.currentIndex++;
            } else if (action === 'prev' && state.currentIndex > 0) {
                state.currentIndex--;
            }
            update();
            return;
        }

        // Dots
        const dot = e.target.closest('.pg-dot');
        if (dot && root.contains(dot)) {
            state.currentIndex = parseInt(dot.getAttribute('data-index'));
            update();
            return;
        }
    });

    // Soporte para teclado (solo si el foco está dentro del componente)
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
    // Esperar a que el DOM esté completamente renderizado
    requestAnimationFrame(() => {
        update();
        console.log('[CarouselReviews] Componente inicializado correctamente');
    });
});
