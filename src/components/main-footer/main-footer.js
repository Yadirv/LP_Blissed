/**
 * main-footer.js
 * Lógica para el componente Footer (Smart Component)
 */
window.ComponentLoader.registerComponent('main-footer', (root) => {
    // 1. Protección contra doble inicialización
    if (root.__initialized) return;
    root.__initialized = true;

    // 2. Referencias relativas al root
    const copyrightEl = root.querySelector('[data-pgc-edit="Copyright Text"]');

    /**
     * Actualiza el año de copyright automáticamente
     */
    const updateYear = () => {
        if (copyrightEl) {
            const currentYear = new Date().getFullYear();
            // Preservamos el texto pero actualizamos el año si es necesario
            copyrightEl.textContent = copyrightEl.textContent.replace(/\d{4}/, currentYear);
        }
    };

    // 3. Delegación de Eventos
    root.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && root.contains(link)) {
            // Aquí podrías añadir tracking de analytics para clicks en el footer
            // console.log(`[Footer] Click en link: ${link.textContent}`);
        }
    });

    // 4. Inicialización
    updateYear();
    console.log('[Component] Main Footer inicializado.');
});
