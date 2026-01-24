/**
 * product-card.js
 * Smart Component para tarjetas de productos
 */
window.ComponentLoader.registerComponent('product-card', (root) => {
    // 1. Protección contra doble inicialización
    if (root.__initialized) return;
    root.__initialized = true;

    // 2. Leer datos del componente desde data-attributes
    const productData = {
        id: root.dataset.productId || '',
        price: root.dataset.price || '0.00',
        title: root.dataset.title || 'Product',
        description: root.dataset.description || '',
        image: root.dataset.image || '',
        sizes: root.dataset.sizes ? root.dataset.sizes.split(',').map(s => s.trim()) : [],
        stock: root.dataset.stock || 'in-stock' // 'in-stock' | 'out-of-stock' | 'low-stock'
    };

    // 3. Referencias DOM relativas al root
    const elements = {
        image: root.querySelector('.js-product-image'),
        title: root.querySelector('.js-product-title'),
        description: root.querySelector('.js-product-description'),
        price: root.querySelector('.js-product-price'),
        addToCartBtn: root.querySelector('.js-add-to-cart'),
        buttonText: root.querySelector('.js-button-text'),
        badge: root.querySelector('.js-badge'),
        sizesContainer: root.querySelector('.js-sizes-container'),
        sizes: root.querySelector('.js-sizes')
    };

    // 4. Estado del componente
    const state = {
        isLoading: false,
        quantity: 1
    };

    /**
     * Actualiza el DOM con los datos del producto
     */
    const render = () => {
        if (elements.image) elements.image.src = productData.image;
        if (elements.image) elements.image.alt = productData.title;
        if (elements.title) elements.title.textContent = productData.title;
        if (elements.description) elements.description.textContent = productData.description;
        if (elements.price) elements.price.textContent = `$${parseFloat(productData.price).toFixed(2)}`;

        // Renderizar tamaños si existen
        if (elements.sizes && productData.sizes.length > 0) {
            elements.sizes.innerHTML = productData.sizes
                .map(size => `<span class="text-xs bg-blissed-olive/10 text-blissed-gray px-2 py-1 rounded">${size}</span>`)
                .join('');
        } else if (elements.sizesContainer) {
            elements.sizesContainer.style.display = 'none';
        }

        // Estado de stock
        if (productData.stock === 'out-of-stock') {
            root.classList.add('is-out-of-stock');
            if (elements.addToCartBtn) elements.addToCartBtn.disabled = true;
            if (elements.buttonText) elements.buttonText.textContent = 'Out of Stock';
        }
    };

    /**
     * Maneja el clic en "Add to Cart"
     */
    const handleAddToCart = () => {
        if (state.isLoading || productData.stock === 'out-of-stock') return;

        // Cambiar estado a loading
        state.isLoading = true;
        root.classList.add('is-loading');

        console.log(`[ProductCard] Adding to cart: ${productData.id}`);

        // Simular llamada a API (reemplazar con lógica real)
        setTimeout(() => {
            // Emit custom event para que otros componentes puedan escuchar
            const event = new CustomEvent('product:added-to-cart', {
                detail: {
                    productId: productData.id,
                    price: productData.price,
                    title: productData.title,
                    quantity: state.quantity
                },
                bubbles: true
            });
            root.dispatchEvent(event);

            // Feedback visual
            if (elements.buttonText) {
                const originalText = elements.buttonText.textContent;
                elements.buttonText.textContent = '✓ Added!';
                
                setTimeout(() => {
                    elements.buttonText.textContent = originalText;
                    state.isLoading = false;
                    root.classList.remove('is-loading');
                }, 1500);
            }
        }, 800);
    };

    /**
     * Maneja el clic en la tarjeta (abrir detalle)
     */
    const handleCardClick = (e) => {
        // Evitar abrir si se hizo clic en el botón
        if (e.target.closest('.js-add-to-cart')) return;

        console.log(`[ProductCard] Opening product detail: ${productData.id}`);
        
        // Emit evento para navegación (puede ser capturado por el router)
        const event = new CustomEvent('product:view-detail', {
            detail: { productId: productData.id },
            bubbles: true
        });
        root.dispatchEvent(event);
    };

    // 5. Delegación de eventos
    root.addEventListener('click', (e) => {
        // Click en botón Add to Cart
        if (e.target.closest('.js-add-to-cart')) {
            e.stopPropagation();
            handleAddToCart();
            return;
        }

        // Click en la tarjeta
        handleCardClick(e);
    });

    // 6. Soporte para teclado
    root.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            if (document.activeElement === elements.addToCartBtn) {
                handleAddToCart();
            } else if (document.activeElement === root) {
                handleCardClick(e);
            }
        }
    });

    // 7. Inicialización
    render();
    console.log(`[ProductCard] Initialized: ${productData.id}`);
});
