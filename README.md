# Blissed Skin - Landing Page Project

## 📋 Descripción General

Este proyecto es una landing page de e-commerce para **Blissed Skin**, desarrollada mediante un flujo de trabajo moderno que integra diseño en Figma, generación de código con IA, y edición visual con Pinegrow. El proyecto utiliza **TailwindCSS** para estilos y una arquitectura de **Smart Components** con JavaScript modular.

---

## 🔄 Flujo de Trabajo del Proyecto

### 1. **Diseño en Figma**
- Los diseños UI/UX se crean en Figma con componentes estructurados
- Cada componente tiene propiedades y variantes bien definidas
- Se utilizan Design Tokens para mantener consistencia (colores, tipografías, espaciados)
- Los nodos de Figma tienen IDs únicos que permiten referencia directa

### 2. **Conexión Figma ↔ VS Code vía MCP (Model Context Protocol)**
- **MCP Figma** actúa como puente entre Figma Desktop App y VS Code
- Permite extraer contexto de diseño de nodos específicos de Figma
- Funciones principales utilizadas:
  - `mcp_figma_get_design_context`: Obtiene código generado de un nodo específico
  - `mcp_figma_get_metadata`: Obtiene estructura XML del diseño
  - `mcp_figma_get_screenshot`: Captura visual del diseño
  - `mcp_figma_get_code_connect_map`: Mapea componentes Figma con código existente

#### Ejemplo de uso:
```javascript
// El agente IA recibe una URL de Figma:
// https://figma.com/design/:fileKey/:fileName?node-id=1-2

// Extrae: fileKey y nodeId (1:2)
// Luego solicita el código via MCP:
mcp_figma_get_design_context({
  fileKey: "abc123",
  nodeId: "1:2",
  clientLanguages: "html,css,javascript",
  clientFrameworks: "tailwindcss"
})
// Retorna: HTML + CSS + assets necesarios
```

### 3. **GitHub Copilot en VS Code**
- Copilot analiza el código generado por MCP
- Adapta el código a la estructura del proyecto existente
- Mantiene consistencia con:
  - Sistema de componentes existente
  - Convenciones de nombres (clases CSS, IDs, data-attributes)
  - Estructura de directorios
- Genera código optimizado y semántico

### 4. **Pinegrow Editor** (Edición Visual Final)
- Pinegrow se utiliza para ajustes visuales finales y refinamiento
- **IMPORTANTE**: Pinegrow añade automáticamente comentarios y estructuras
- Mantiene el código limpio mientras permite edición visual
- Respeta la estructura de componentes inteligentes
- Archivos de configuración:
  - `pinegrow.json`: Configuración de componentes y páginas
  - `projectdb.pgml`: Base de datos del proyecto
  - `_pgbackup/`: Backups automáticos (versionado interno)
  - `_pginfo/`: Metadatos de clases y fuentes

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Directorios

```
LP_Blissed/
├── index.html                          # Página principal
├── package.json                        # Dependencias del proyecto
├── tailwind.config.js                  # Configuración de TailwindCSS
├── STYLEGUIDE.md                       # Guía de estilos y componentes
├── pinegrow.json                       # Configuración de Pinegrow
├── projectdb.pgml                      # Base de datos de Pinegrow
│
├── src/                                # Código fuente
│   ├── input.css                       # CSS fuente para Tailwind
│   ├── assets/
│   │   ├── css/                        # Estilos compilados
│   │   └── js/
│   │       └── components-init.js      # Sistema de inicialización de componentes
│   │
│   └── components/                     # Componentes inteligentes
│       ├── main-header/
│       │   ├── main-header.js          # Lógica del header
│       │   └── main-header.css         # Estilos del header
│       ├── main-footer/
│       │   ├── main-footer.js
│       │   └── main-footer.css
│       ├── carousel-products/
│       │   ├── carousel-products.js    # Carrusel de productos
│       │   └── carousel-products.css
│       └── carousel-reviews/
│           ├── carousel-reviews.js     # Carrusel de testimonios
│           └── carousel-reviews.css
│
├── components/                         # Componentes reutilizables de Pinegrow
│   ├── AcnePatch20.html
│   ├── AcnePatch30.html
│   ├── AcnePatch60.html
│   ├── CarouselProducts.html
│   ├── CarouselReviews.html
│   ├── Footer.html
│   └── Header.html
│
├── sections/                           # Secciones de página de Pinegrow
│   ├── Hero.html
│   ├── AboutBlissed.html
│   ├── PageAllProducts.html
│   └── IntroText.html
│
├── assets/                             # Assets estáticos
│   ├── products/                       # Imágenes de productos
│   ├── imguser/                        # Imágenes de usuarios
│   ├── icons/                          # Iconografía
│   └── css/                            # Estilos globales
│
├── tailwind_theme/                     # Tema compilado de Tailwind
│   └── tailwind.css
│
├── _pgbackup/                          # Backups automáticos de Pinegrow
└── _pginfo/                            # Metadatos de Pinegrow
    ├── class.tracker.json              # Tracking de clases CSS
    ├── fonts.json                      # Fuentes utilizadas
    └── pine.cone.lib.json              # Librería de componentes
```

---

## 🧩 Sistema de Smart Components

### Arquitectura de Componentes Inteligentes

El proyecto utiliza un sistema modular donde cada componente:
1. Es autónomo y encapsulado
2. Se registra dinámicamente en el sistema
3. Se inicializa automáticamente al detectarse en el DOM
4. No depende de IDs globales (usa scope local)

### `components-init.js` - Sistema de Inicialización

```javascript
// Sistema central de carga de componentes
const ComponentLoader = (() => {
    const registry = new Map();

    // Registra un componente
    const registerComponent = (name, initFn) => {
        registry.set(name, initFn);
        // Auto-inicializa si ya existe en DOM
        document.querySelectorAll(`[data-component="${name}"]`).forEach(initComponent);
    };

    // Inicializa componente específico
    const initComponent = (el) => {
        if (el.__initialized) return;
        const componentName = el.getAttribute('data-component');
        const initFn = registry.get(componentName);
        if (initFn) {
            initFn(el);
            el.__initialized = true;
        }
    };

    // Observer para componentes dinámicos
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            mutation.addedNodes.forEach(node => {
                if (node.nodeType === 1) {
                    if (node.hasAttribute('data-component')) initComponent(node);
                    initAll(node);
                }
            });
        });
    });

    return { registerComponent, start };
})();

window.ComponentLoader = ComponentLoader;
```

### Estructura de un Componente Típico

#### HTML (en index.html)
```html
<!-- Componente con data-component attribute -->
<section 
    id="reviews" 
    data-component="carousel-reviews" 
    data-pgc="reviews_carousel"
    class="...">
    
    <!-- Estructura interna con clases específicas -->
    <div class="pg-viewport">
        <div class="pg-track">
            <article class="pg-slide">...</article>
            <article class="pg-slide">...</article>
        </div>
    </div>
    
    <!-- Controles -->
    <button data-action="prev" class="pg-arrow">...</button>
    <button data-action="next" class="pg-arrow">...</button>
    
    <!-- Indicadores -->
    <nav class="pg-dots">
        <button class="pg-dot" data-index="0"></button>
        <button class="pg-dot" data-index="1"></button>
    </nav>
</section>
```

#### JavaScript (carousel-reviews.js)
```javascript
window.ComponentLoader.registerComponent('carousel-reviews', (root) => {
    // 1. Protección anti-duplicación
    if (root.__initialized) return;
    root.__initialized = true;

    // 2. Estado local del componente
    const state = {
        currentIndex: 0,
        totalSlides: 0
    };

    // 3. Referencias relativas al root (NO usar IDs globales)
    const viewport = root.querySelector('.pg-viewport');
    const track = root.querySelector('.pg-track');
    const slides = Array.from(root.querySelectorAll('.pg-slide'));
    const dots = Array.from(root.querySelectorAll('.pg-dot'));
    
    state.totalSlides = slides.length;

    // 4. Lógica de actualización
    const update = () => {
        const viewportWidth = viewport.offsetWidth;
        
        // Aplicar estilos inline con !important para sobrescribir Tailwind
        track.style.cssText = `
            width: ${viewportWidth * state.totalSlides}px !important;
            transform: translateX(-${viewportWidth * state.currentIndex}px) !important;
            display: flex !important;
            transition: transform 0.5s ease-in-out;
        `;
        
        slides.forEach((slide, idx) => {
            const isActive = idx === state.currentIndex;
            slide.classList.toggle('is-active', isActive);
            slide.classList.toggle('is-inactive', !isActive);
            
            slide.style.cssText = `
                width: ${viewportWidth}px !important;
                min-width: ${viewportWidth}px !important;
                display: flex !important;
                flex-shrink: 0 !important;
            `;
        });
        
        // Actualizar dots
        dots.forEach((dot, idx) => {
            dot.classList.toggle('is-selected', idx === state.currentIndex);
        });
    };

    // 5. Event Delegation en el root (no usar eventos globales)
    root.addEventListener('click', (e) => {
        const arrow = e.target.closest('.pg-arrow');
        if (arrow && root.contains(arrow)) {
            const action = arrow.getAttribute('data-action');
            if (action === 'next') state.currentIndex++;
            if (action === 'prev') state.currentIndex--;
            update();
        }
        
        const dot = e.target.closest('.pg-dot');
        if (dot && root.contains(dot)) {
            state.currentIndex = parseInt(dot.getAttribute('data-index'));
            update();
        }
    });

    // 6. ResizeObserver para responsive
    if (window.ResizeObserver) {
        const resizeObserver = new ResizeObserver(() => update());
        resizeObserver.observe(viewport);
    }

    // 7. Inicialización con delay para asegurar dimensiones
    requestAnimationFrame(() => {
        update();
        setTimeout(() => update(), 100);
    });
});
```

#### CSS (carousel-reviews.css)
```css
/* Estilos específicos del componente con scope */
[data-component="carousel-reviews"] .pg-viewport {
    position: relative;
    overflow: hidden;
    width: 100%;
}

[data-component="carousel-reviews"] .pg-track {
    display: flex;
    transition: transform 0.5s ease-in-out;
}

[data-component="carousel-reviews"] .pg-slide {
    flex-shrink: 0;
    transition: opacity 0.5s ease-in-out;
}

[data-component="carousel-reviews"] .pg-slide.is-inactive {
    opacity: 0.6 !important;
    filter: grayscale(0.2);
}

[data-component="carousel-reviews"] .pg-slide.is-active {
    opacity: 1 !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15);
}
```

---

## 🎨 Sistema de Estilos

### TailwindCSS + Custom Components

#### tailwind.config.js
```javascript
module.exports = {
  content: [
    './index.html',
    './components/**/*.html',
    './sections/**/*.html',
    './src/**/*.{js,css}'
  ],
  theme: {
    extend: {
      colors: {
        'blissed-gray': '#3C3C3C',
        'blissed-olive': '#9FB686',
        'blissed-lavender': '#D1A3D9',
        'blissed-purple-start': '#a63d97',
        'blissed-purple-end': '#d39ecb',
        'blissed-text-dark': '#2D2D2D',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      }
    }
  }
}
```

### Estrategia de Estilos

1. **Tailwind para layout y utilities**: Clases utilitarias en HTML
2. **CSS custom para componentes dinámicos**: Transiciones, estados, animaciones
3. **Inline styles con !important**: Para sobrescribir Tailwind cuando JavaScript controla estilos dinámicos

#### Ejemplo de combinación:
```html
<!-- Tailwind para layout base -->
<div class="flex items-center gap-6 rounded-3xl bg-white p-6 shadow-lg">
    <!-- JavaScript aplica estilos dinámicos inline -->
    <div class="pg-slide" style="width: 800px !important; opacity: 1 !important;">
        <!-- Contenido -->
    </div>
</div>
```

---

## 📦 Carga de Scripts en HTML

### Orden Correcto de Carga

```html
<!DOCTYPE html>
<html>
<head>
    <!-- 1. TailwindCSS compilado -->
    <link href="tailwind_theme/tailwind.css" rel="stylesheet">
    
    <!-- 2. Estilos globales -->
    <link rel="stylesheet" href="src/assets/css/base.css">
    
    <!-- 3. Estilos de componentes (orden no crítico) -->
    <link rel="stylesheet" href="src/components/main-header/main-header.css">
    <link rel="stylesheet" href="src/components/main-footer/main-footer.css">
    <link rel="stylesheet" href="src/components/carousel-products/carousel-products.css">
    <link rel="stylesheet" href="src/components/carousel-reviews/carousel-reviews.css">
</head>
<body>
    <!-- Contenido HTML -->
    
    <!-- Scripts al final del body -->
    
    <!-- 1. PRIMERO: Sistema de inicialización (ComponentLoader) -->
    <script src="src/assets/js/components-init.js"></script>
    
    <!-- 2. DESPUÉS: Componentes individuales (pueden registrarse en cualquier orden) -->
    <script src="src/components/main-header/main-header.js"></script>
    <script src="src/components/main-footer/main-footer.js"></script>
    <script src="src/components/carousel-reviews/carousel-reviews.js"></script>
    <script src="src/components/carousel-products/carousel-products.js"></script>
</body>
</html>
```

### ⚠️ IMPORTANTE: Orden de Scripts

**SIEMPRE** cargar `components-init.js` primero porque:
- Define `window.ComponentLoader`
- Otros scripts dependen de `ComponentLoader.registerComponent()`
- Si se carga después, los componentes no se registrarán

---

## 🔧 Guía para Agentes IA

### Cuando trabajas con este proyecto:

#### ✅ **SÍ hacer:**

1. **Mantener el sistema de componentes**
   - Usar `data-component="nombre-componente"` en HTML
   - Registrar con `window.ComponentLoader.registerComponent()`
   - Usar referencias relativas al `root` del componente

2. **Usar clases específicas para scripting**
   - `.pg-viewport`, `.pg-track`, `.pg-slide` para carruseles
   - `.pg-arrow`, `.pg-dot` para controles
   - `data-action="prev|next"`, `data-index="N"` para comportamiento

3. **Combinar Tailwind + CSS custom correctamente**
   - Tailwind para layout estático
   - CSS custom para transiciones y estados
   - Inline styles con `!important` cuando JS controla valores dinámicos

4. **Mantener scope CSS con atributos**
   ```css
   [data-component="mi-componente"] .mi-clase { }
   ```

5. **Proteger contra doble inicialización**
   ```javascript
   if (root.__initialized) return;
   root.__initialized = true;
   ```

#### ❌ **NO hacer:**

1. **No usar IDs para scripting** (rompe la reutilización)
   ```javascript
   // ❌ MAL
   const element = document.getElementById('carousel-track');
   
   // ✅ BIEN
   const element = root.querySelector('.pg-track');
   ```

2. **No usar event listeners globales**
   ```javascript
   // ❌ MAL
   document.addEventListener('click', handler);
   
   // ✅ BIEN
   root.addEventListener('click', handler);
   ```

3. **No modificar archivos de Pinegrow manualmente**
   - `pinegrow.json`, `projectdb.pgml`, `_pgbackup/`, `_pginfo/`
   - Pinegrow los regenera automáticamente

4. **No sobrescribir estilos de Tailwind sin necesidad**
   - Usar `!important` solo cuando JavaScript maneja estilos dinámicos
   - No crear CSS custom para lo que Tailwind ya resuelve

---

## 🚀 Flujo de Desarrollo Típico

### Agregar un nuevo componente desde Figma:

1. **Diseñar en Figma**
   - Crear componente con propiedades bien definidas
   - Usar nomenclatura consistente

2. **Extraer con MCP**
   ```bash
   # En VS Code con Copilot
   # Proporcionar URL de Figma: https://figma.com/design/abc/file?node-id=1-2
   # Copilot automáticamente usa MCP para extraer código
   ```

3. **Adaptar código**
   - Copilot genera HTML + CSS adaptado al proyecto
   - Crear archivos en `src/components/nuevo-componente/`
   - Implementar lógica JavaScript si es necesario

4. **Registrar componente**
   ```javascript
   // src/components/nuevo-componente/nuevo-componente.js
   window.ComponentLoader.registerComponent('nuevo-componente', (root) => {
       // Lógica del componente
   });
   ```

5. **Enlazar en HTML**
   ```html
   <!-- En index.html -->
   <link rel="stylesheet" href="src/components/nuevo-componente/nuevo-componente.css">
   
   <!-- Al final del body -->
   <script src="src/components/nuevo-componente/nuevo-componente.js"></script>
   ```

6. **Usar en página**
   ```html
   <div data-component="nuevo-componente" class="...">
       <!-- Contenido -->
   </div>
   ```

7. **Refinar en Pinegrow**
   - Abrir proyecto en Pinegrow
   - Ajustes visuales finales
   - Pinegrow mantiene la estructura de componentes

8. **Desplegar en Producción**
   - Validar código con checklist automatizado
   - Configurar hosting y dominio
   - Implementar optimizaciones de producción
   - Configurar CDN y certificados SSL
   - Ver [Guía de Despliegue](#-despliegue-y-hosting-guía-de-requisitos-para-agencias) para detalles completos

---

## 🌐 DESPLIEGUE Y HOSTING: GUÍA DE REQUISITOS PARA AGENCIAS

### 📋 Contexto del Proyecto

Este proyecto está diseñado para agencias que:
- Manejan **múltiples clientes y sitios simultáneamente**
- Necesitan **control total del servidor** para personalizaciones
- Requieren **independencia entre proyectos** (aislamiento de clientes)
- Buscan **escalabilidad** para crecer sin cambiar de infraestructura
- Priorizan **soporte profesional** y **actualizaciones de seguridad** automáticas

### 🎯 Perfil Técnico del Proyecto

**Stack Tecnológico:**
- **Frontend**: HTML5, TailwindCSS (compilado), JavaScript Vanilla
- **Assets**: Imágenes, fuentes, iconos SVG
- **Sin Backend**: Sitio estático (no requiere PHP, Node.js, Python en servidor)
- **Compilación**: TailwindCSS CLI (genera CSS final)
- **Tamaño estimado**: 50-200 MB por sitio (incluyendo imágenes optimizadas)

**Características de Tráfico (Estimado):**
- **Tipo**: E-commerce / Landing Page de conversión
- **Tráfico esperado**: 5,000 - 50,000 visitas/mes por sitio
- **Picos**: Campañas promocionales (2-3x tráfico normal)
- **Región principal**: Estados Unidos (considerar latencia)

---

## 🔍 REQUISITOS OBLIGATORIOS (Deal Breakers)

### 1. **Control Total del Servidor**

#### ✅ Requisitos Mínimos:

**Acceso SSH/SFTP:**
- Acceso root o sudo para configuraciones avanzadas
- Capacidad de instalar software personalizado
- Modificar configuraciones de servidor web (Nginx/Apache)
- Acceso a archivos de configuración (.htaccess, nginx.conf)

**¿Por qué es crítico?**
- Configurar redirects personalizados por cliente
- Instalar herramientas de optimización (ImageMagick, WebP converters)
- Implementar headers de seguridad personalizados
- Ajustar límites de memoria y tiempo de ejecución

**Preguntas para proveedores:**
```
1. ¿Proporcionan acceso SSH completo?
2. ¿Puedo instalar dependencias/librerías personalizadas?
3. ¿Tengo acceso a logs del servidor en tiempo real?
4. ¿Puedo modificar configuraciones de Nginx/Apache?
5. ¿Hay restricciones en comandos o permisos sudo?
```

---

### 2. **Gestión Multi-Sitio y Aislamiento de Clientes**

#### ✅ Requisitos Mínimos:

**Opciones de Arquitectura:**

**Opción A: VPS con Virtual Hosts**
- 1 servidor VPS
- Múltiples dominios apuntando a la misma IP
- Configuración de virtual hosts para separar sitios
- Cada cliente en su propio directorio
- **Ventaja**: Económico, fácil de gestionar
- **Desventaja**: Recursos compartidos entre clientes

**Opción B: Cuentas cPanel/Plesk Independientes**
- Panel de control que permite crear "cuentas" separadas
- Cada cliente = 1 cuenta con su propio espacio
- Límites de recursos configurables por cuenta
- **Ventaja**: Aislamiento mejor, fácil facturación por cliente
- **Desventaja**: Requiere panel de control (costo adicional)

**Opción C: Contenedores Docker**
- Cada sitio en su propio contenedor aislado
- Orquestación con Docker Compose o Kubernetes
- **Ventaja**: Máximo aislamiento, portabilidad
- **Desventaja**: Requiere conocimientos técnicos avanzados

**¿Qué buscar?**
- Capacidad de crear subdominios ilimitados o múltiples dominios
- Aislamiento de recursos (un sitio caído no afecta a otros)
- Gestión independiente de certificados SSL por dominio
- Logs separados por sitio
- Posibilidad de asignar límites de ancho de banda por sitio

**Preguntas para proveedores:**
```
1. ¿Cuántos dominios/subdominios puedo alojar?
2. ¿Ofrecen cPanel/Plesk para gestión multi-sitio?
3. ¿Puedo crear cuentas FTP/SSH independientes por cliente?
4. ¿Cómo aíslan recursos entre sitios? (cgroups, LVE, etc.)
5. ¿Puedo configurar límites de CPU/RAM por sitio?
6. ¿Los logs están separados por dominio?
```

---

### 3. **Recursos de Servidor (Especificaciones Mínimas)**

#### ✅ Para Agencias con 5-20 Sitios Estáticos:

**CPU:**
- **Mínimo**: 2 vCPU cores
- **Recomendado**: 4 vCPU cores
- **Por qué**: Compilación de TailwindCSS, compresión de imágenes, múltiples solicitudes concurrentes

**RAM:**
- **Mínimo**: 4 GB
- **Recomendado**: 8 GB
- **Por qué**: Servidor web (Nginx: ~100MB), panel de control (cPanel: ~512MB), caché, múltiples sitios

**Almacenamiento:**
- **Mínimo**: 50 GB SSD
- **Recomendado**: 100-200 GB SSD NVMe
- **Por qué**: 
  - Cada sitio: ~100-500 MB (código + assets)
  - Backups automáticos: 3x tamaño de sitios
  - Logs y caché
  - SSD para velocidad de lectura/escritura

**Ancho de Banda:**
- **Mínimo**: 1 TB/mes
- **Recomendado**: Ilimitado o 3-5 TB/mes
- **Cálculo**: 
  - Sitio promedio: 2 MB por carga completa
  - 10 sitios × 10,000 visitas/mes × 2 MB = 200 GB/mes
  - Factor de seguridad 3x = 600 GB/mes mínimo

**Preguntas para proveedores:**
```
1. ¿Qué tipo de CPU usan? (Intel Xeon, AMD EPYC, etc.)
2. ¿Es SSD NVMe o SATA? (NVMe es 5-10x más rápido)
3. ¿Ancho de banda es medido o ilimitado?
4. ¿Qué pasa si excedo límites? (throttling, cargos extra, corte)
5. ¿Puedo escalar recursos sin cambiar de servidor?
6. ¿Ofrecen monitoreo de uso de recursos en tiempo real?
```

---

### 4. **Seguridad y Actualizaciones Automáticas**

#### ✅ Requisitos Mínimos:

**Certificados SSL:**
- **Let's Encrypt gratuito incluido** (renovación automática)
- Instalación con 1-click o automatizada
- Soporte para múltiples dominios (SNI)
- Wildcard SSL disponible (para subdominios)

**Firewall y Protección:**
- **Firewall de aplicación web (WAF)** incluido o integrable (Cloudflare, Sucuri)
- Protección contra DDoS básica
- Bloqueo automático de IPs maliciosas (Fail2Ban)
- Escaneo de malware periódico

**Actualizaciones del Sistema:**
- **Actualizaciones de seguridad automáticas** del SO (Ubuntu, CentOS)
- Parches de servidor web (Nginx/Apache) aplicados automáticamente
- Notificaciones de actualizaciones críticas
- Opción de programar mantenimiento

**Backups:**
- **Backups automáticos diarios** incluidos
- Retención mínima: 7-30 días
- Restauración con 1-click
- Posibilidad de descargar backups (offsite storage)

**Preguntas para proveedores:**
```
1. ¿SSL Let's Encrypt incluido y auto-renovable?
2. ¿Qué tipo de firewall ofrecen? (iptables, CSF, hardware WAF)
3. ¿Actualizaciones de seguridad son automáticas o manuales?
4. ¿Con qué frecuencia hacen backups? ¿Dónde los almacenan?
5. ¿Cuánto tarda restaurar un backup completo?
6. ¿Ofrecen escaneo de malware? ¿Costo adicional?
7. ¿Tienen protección DDoS? ¿Qué tamaño de ataques mitigan?
```

---

### 5. **Soporte Técnico de Calidad**

#### ✅ Requisitos Mínimos:

**Disponibilidad:**
- **24/7/365** (crítico para e-commerce)
- Múltiples canales: Chat en vivo, tickets, teléfono
- Tiempo de respuesta: < 15 minutos (urgente), < 2 horas (normal)

**Expertise Técnico:**
- Soporte en **español e inglés**
- Personal capacitado en:
  - Configuración de servidores Linux
  - Nginx/Apache
  - DNS y dominios
  - SSL/TLS
  - Optimización de rendimiento

**Documentación:**
- Base de conocimientos extensa
- Tutoriales en video
- Guías de migración
- API documentation (si aplica)

**Preguntas para proveedores:**
```
1. ¿Horarios de soporte? ¿24/7 o limitado?
2. ¿Idiomas disponibles? (Español, Inglés)
3. ¿Tiempo promedio de primera respuesta?
4. ¿Nivel de soporte incluido? (básico, administrado, premium)
5. ¿Ayudan con migraciones desde otro proveedor?
6. ¿Tienen documentación técnica detallada?
7. ¿Ofrecen soporte administrado? (gestionan servidor por ti)
```

---

## 🎖️ REQUISITOS RECOMENDADOS (Nice to Have)

### 6. **Panel de Control Intuitivo**

**Opciones Populares:**
- **cPanel/WHM**: Estándar de la industria, interfaz gráfica completa
- **Plesk**: Alternativa moderna, mejor para Windows también
- **Webmin/Virtualmin**: Open source, más técnico
- **Panel propietario**: Custom del proveedor

**Funcionalidades deseadas:**
- Gestión de dominios y subdominios
- Configuración de emails por dominio
- File Manager web (editar archivos sin FTP)
- Instalador de aplicaciones (Softaculous, Installatron)
- Métricas y analytics integrados
- Gestión de bases de datos (MySQL/PostgreSQL) si planeas expandir

---

### 7. **Optimización de Rendimiento**

**CDN Integrado:**
- **Cloudflare** integración con 1-click
- O CDN propio del proveedor
- Caché global en múltiples ubicaciones
- Reduce latencia para visitantes internacionales

**Caché del Servidor:**
- **Redis o Memcached** disponible
- Caché de página completa (Varnish, Nginx FastCGI)
- Compresión Gzip/Brotli habilitada
- HTTP/2 o HTTP/3 soportado

**Optimización de Assets:**
- Compresión automática de imágenes (WebP, AVIF)
- Minificación de CSS/JS
- Lazy loading de imágenes

---

### 8. **Escalabilidad y Flexibilidad**

**Upgrade Path Claro:**
- Migrar de plan compartido → VPS → Servidor Dedicado sin downtime
- Añadir recursos (CPU, RAM, disco) sin re-configurar
- Load balancing disponible para tráfico alto

**Múltiples Ubicaciones de Data Centers:**
- Servidores en **USA** (preferencia para este proyecto)
- Europa, Asia (para expansión futura)
- Baja latencia para audiencia objetivo

---

### 9. **Herramientas de Desarrollo**

**Git Integration:**
- Despliegue automático desde GitHub/GitLab/Bitbucket
- Webhooks para deploy continuo
- Ambientes staging/production

**CI/CD Pipeline:**
- GitHub Actions compatible
- Deploy automático al hacer `git push`

**CLI y API:**
- API RESTful para automatizaciones
- CLI para gestión desde terminal

---

## 📊 COMPARATIVA DE PLANES: CRITERIOS DE EVALUACIÓN

### Tabla de Comparación (Para Llenar al Investigar Proveedores)

| Criterio | Prioridad | Proveedor A | Proveedor B | Proveedor C |
|----------|-----------|-------------|-------------|-------------|
| **REQUISITOS OBLIGATORIOS** | | | | |
| Acceso SSH completo | 🔴 Crítico | ✅/❌ | ✅/❌ | ✅/❌ |
| Control de configuración servidor | 🔴 Crítico | ✅/❌ | ✅/❌ | ✅/❌ |
| Multi-dominio/Multi-sitio | 🔴 Crítico | # Límite | # Límite | # Límite |
| Aislamiento de clientes | 🔴 Crítico | Método | Método | Método |
| vCPU cores | 🔴 Crítico | # cores | # cores | # cores |
| RAM | 🔴 Crítico | # GB | # GB | # GB |
| Almacenamiento SSD | 🔴 Crítico | # GB | # GB | # GB |
| Ancho de banda | 🔴 Crítico | # TB o ∞ | # TB o ∞ | # TB o ∞ |
| SSL Let's Encrypt gratuito | 🔴 Crítico | ✅/❌ | ✅/❌ | ✅/❌ |
| Firewall / WAF | 🔴 Crítico | Tipo | Tipo | Tipo |
| Backups automáticos | 🔴 Crítico | Frecuencia | Frecuencia | Frecuencia |
| Actualizaciones seguridad auto | 🔴 Crítico | ✅/❌ | ✅/❌ | ✅/❌ |
| Soporte 24/7 | 🔴 Crítico | ✅/❌ | ✅/❌ | ✅/❌ |
| Soporte en español | 🔴 Crítico | ✅/❌ | ✅/❌ | ✅/❌ |
| **REQUISITOS RECOMENDADOS** | | | | |
| Panel de control (cPanel/Plesk) | 🟡 Importante | Tipo | Tipo | Tipo |
| CDN integrado | 🟡 Importante | ✅/❌ | ✅/❌ | ✅/❌ |
| Redis/Memcached | 🟡 Importante | ✅/❌ | ✅/❌ | ✅/❌ |
| HTTP/2 o HTTP/3 | 🟡 Importante | ✅/❌ | ✅/❌ | ✅/❌ |
| Git integration | 🟢 Nice to have | ✅/❌ | ✅/❌ | ✅/❌ |
| Staging environments | 🟢 Nice to have | ✅/❌ | ✅/❌ | ✅/❌ |
| API/CLI | 🟢 Nice to have | ✅/❌ | ✅/❌ | ✅/❌ |
| **COSTOS** | | | | |
| Precio mensual (anual) | - | $XX/mes | $XX/mes | $XX/mes |
| Setup fee | - | $XX | $XX | $XX |
| Costo por sitio adicional | - | $XX | $XX | $XX |
| Costo de panel control | - | $XX/mes | $XX/mes | $XX/mes |
| Costo backups adicionales | - | $XX/mes | $XX/mes | $XX/mes |
| **TOTAL ESTIMADO (10 sitios)** | - | $XX/mes | $XX/mes | $XX/mes |

---

## 💡 PREGUNTAS CLAVE AL CONTACTAR PROVEEDORES

### 📞 Script de Consulta Recomendado

```
Asunto: Consulta para Agencia - Hosting Multi-Sitio con Control de Servidor

Hola [Proveedor],

Somos una agencia que maneja sitios web estáticos (HTML/CSS/JS) para múltiples 
clientes y buscamos un proveedor de hosting que cumpla con los siguientes requisitos:

CONTEXTO:
- 5-20 sitios estáticos simultáneos
- Cada sitio: ~100-500 MB, 5,000-50,000 visitas/mes
- Stack: HTML5, TailwindCSS, JavaScript vanilla (sin backend)
- Necesitamos independencia entre proyectos de clientes

REQUISITOS CRÍTICOS:
1. Acceso SSH completo y control de configuración del servidor
2. Capacidad de alojar múltiples dominios/subdominios con aislamiento
3. Servidor: Mínimo 4GB RAM, 2 vCPU, 50GB SSD, 1TB ancho de banda
4. SSL Let's Encrypt gratuito con renovación automática
5. Backups automáticos diarios
6. Actualizaciones de seguridad automáticas
7. Soporte 24/7 en español

PREGUNTAS ESPECÍFICAS:
1. ¿Qué plan recomiendan para nuestro caso de uso?
2. ¿Incluyen panel de control (cPanel/Plesk)?
3. ¿Cómo manejan el aislamiento entre sitios de diferentes clientes?
4. ¿Ofrecen migración gratuita desde nuestro proveedor actual?
5. ¿Cuál es el proceso de escalamiento si crecemos a 50+ sitios?
6. ¿Tienen contratos anuales con descuento vs. mensual?
7. ¿Ofrecen período de prueba o garantía de devolución?

Favor enviar:
- Cotización detallada con costos desglosados
- SLA (uptime garantizado)
- Documentación técnica o guías de configuración

Gracias,
[Tu nombre]
[Agencia]
```

---

## 🏆 MODALIDADES DE HOSTING RECOMENDADAS PARA AGENCIAS

### Comparativa de Opciones

| Modalidad | Mejor Para | Ventajas | Desventajas | Costo Aproximado |
|-----------|-----------|----------|-------------|------------------|
| **Shared Hosting** | 1-3 sitios pequeños | Económico, fácil setup | Sin control servidor, recursos limitados | $5-15/mes |
| **VPS Administrado** | 5-20 sitios, agencia pequeña | Balance costo/control, soporte incluido | Menos flexible que VPS no administrado | $30-80/mes |
| **VPS No Administrado** | Agencia con conocimientos técnicos | Control total, mejor precio/rendimiento | Requiere mantenimiento manual | $15-50/mes |
| **Cloud VPS** (AWS, DigitalOcean) | Escalabilidad extrema, 20+ sitios | Pago por uso, máxima flexibilidad | Complejidad técnica, costos variables | $20-200/mes |
| **Servidor Dedicado** | 50+ sitios, alto tráfico | Recursos exclusivos, máximo control | Alto costo, requiere expertise | $100-500/mes |
| **Hosting Reseller** | Agencias que facturan hosting a clientes | Marca blanca, cuentas independientes | Menos control técnico | $25-100/mes |

### ✅ Recomendación para este Proyecto:

**VPS Administrado con cPanel/Plesk**

**Por qué:**
- Control suficiente para personalizar cada sitio
- Soporte administrado reduce carga técnica
- cPanel facilita gestión multi-cliente
- Escalable hasta 20-30 sitios sin problemas
- Balance ideal entre costo, control y soporte

**Especificaciones Recomendadas:**
```
Plan: VPS Managed
CPU: 4 vCPU cores
RAM: 8 GB
Disco: 100 GB SSD NVMe
Ancho de banda: Ilimitado o 3 TB/mes
Panel: cPanel/WHM incluido
SSL: Let's Encrypt gratuito
Backups: Diarios automáticos (retención 30 días)
Ubicación: USA (Este u Oeste según audiencia)
Costo esperado: $50-80/mes
```

---

## 📝 CHECKLIST FINAL ANTES DE CONTRATAR

### ✅ Lista de Verificación

- [ ] **Probé el soporte** (hice preguntas pre-venta, tiempo de respuesta < 2 horas)
- [ ] **Leí los términos de servicio** (especialmente políticas de reembolso y cancelación)
- [ ] **Verifiqué el uptime garantizado** (mínimo 99.9%)
- [ ] **Confirmé que puedo migrar fácilmente** (sin lock-in)
- [ ] **Obtuve cotización por escrito** con todos los costos desglosados
- [ ] **Busqué reviews independientes** (TrustPilot, Reddit, WebHostingTalk)
- [ ] **Probé su panel de control** (solicité demo o trial)
- [ ] **Confirmé ubicación de data center** (latencia a USA)
- [ ] **Verifiqué política de backups** (frecuencia, retención, restauración)
- [ ] **Entendí el proceso de escalamiento** (upgrade sin downtime)
- [ ] **Revisé límites y restricciones** (inodes, procesos concurrentes, etc.)
- [ ] **Obtuve referencias** (casos de uso similares)

---

## 🚀 PROCESO DE DESPLIEGUE RECOMENDADO

### Workflow Post-Contratación

1. **DNS y Dominio** (Día 1)
   - Apuntar dominio a IP del servidor
   - Configurar registros A, CNAME, MX
   - Esperar propagación (24-48 horas)

2. **Configuración Inicial del Servidor** (Día 1-2)
   - Acceder vía SSH
   - Actualizar sistema operativo
   - Instalar Nginx o Apache
   - Configurar firewall (UFW, CSF)
   - Crear usuarios y permisos

3. **Setup de Panel de Control** (Día 2)
   - Instalar cPanel/Plesk
   - Configurar cuentas por cliente
   - Establecer límites de recursos

4. **Despliegue del Código** (Día 3)
   - Compilar TailwindCSS (`npm run build`)
   - Comprimir imágenes (ImageOptim, TinyPNG)
   - Subir archivos vía SFTP o rsync
   - Configurar permisos (chmod 755 directorios, 644 archivos)

5. **Optimización** (Día 3-4)
   - Habilitar compresión Gzip/Brotli
   - Configurar caché headers (Cache-Control)
   - Integrar CDN (Cloudflare)
   - Configurar HTTP/2

6. **Testing y QA** (Día 4-5)
   - PageSpeed Insights (score > 90)
   - GTmetrix (grado A)
   - Pruebas cross-browser (BrowserStack)
   - Pruebas mobile (responsive)
   - Verificar analytics (Google Analytics)

7. **Monitoreo y Mantenimiento** (Ongoing)
   - Configurar uptime monitoring (UptimeRobot, Pingdom)
   - Revisar logs semanalmente
   - Actualizar dependencias mensualmente
   - Auditoría de seguridad trimestral

---

## � SINCRONIZACIÓN Y WORKFLOW DE ACTUALIZACIÓN

### ❓ Preguntas Frecuentes sobre Despliegue

#### 1. **¿Cómo sincronizar cambios entre Pinegrow y el Hosting?**

**Respuesta Corta:** No hay sincronización automática directa entre Pinegrow y el hosting. Necesitas un paso intermedio (Git o SFTP manual).

**Respuesta Detallada:**

Pinegrow es un **editor local** que modifica archivos en tu computadora. El hosting es el **servidor en producción**. Para que los cambios lleguen al hosting, debes transferirlos manualmente o configurar un sistema automatizado.

---

### 📋 OPCIONES DE SINCRONIZACIÓN (De Manual a Totalmente Automatizada)

#### **Opción 1: SFTP/FTP Manual** ⚠️ *No Recomendado para Agencias*

**Cómo funciona:**
1. Editas archivos en Pinegrow (local)
2. Guardas cambios
3. Abres cliente SFTP (FileZilla, WinSCP, Cyberduck)
4. Subes archivos modificados al servidor
5. Reemplazas archivos antiguos

**Ventajas:**
- Simple, sin configuración técnica
- Control total sobre qué subes
- Inmediato (minutos después de editar)

**Desventajas:**
- ❌ Propenso a errores humanos (olvidar subir archivos)
- ❌ Sin historial de versiones
- ❌ No puedes revertir cambios fácilmente
- ❌ Riesgo de sobrescribir archivos incorrectos
- ❌ Tedioso para actualizaciones frecuentes

**Cuándo usar:**
- Proyecto muy pequeño (1-2 páginas)
- Cambios muy esporádicos (1 vez al mes)
- Sin equipo colaborativo

---

#### **Opción 2: Git + Deploy Manual** ✅ *Recomendado para Equipos Pequeños*

**Cómo funciona:**
1. Editas en Pinegrow (local)
2. Guardas cambios
3. Haces `git commit` con mensaje descriptivo
4. Haces `git push` a repositorio (GitHub/GitLab)
5. **MANUALMENTE** te conectas por SSH al servidor
6. Ejecutas `git pull` en el servidor para traer cambios

**Ventajas:**
- ✅ Historial completo de cambios (Git log)
- ✅ Puedes revertir a versiones anteriores
- ✅ Múltiples personas pueden colaborar
- ✅ Backups automáticos en GitHub
- ✅ Branches para desarrollo/producción

**Desventajas:**
- ❌ Requiere SSH al servidor cada vez
- ❌ Paso manual de `git pull` en servidor
- ❌ Riesgo de olvidar hacer pull

**Configuración Inicial:**

```bash
# 1. En tu computadora (local) - Inicializar Git
cd C:\proyectos\Figma-Local\Dev-Mode\LP_Blissed
git init
git add .
git commit -m "Initial commit: Blissed Skin landing page"

# 2. Crear repositorio en GitHub
# (hazlo desde github.com/new)

# 3. Conectar local con GitHub
git remote add origin https://github.com/tu-usuario/blissed-skin.git
git branch -M main
git push -u origin main

# 4. En el servidor (vía SSH)
cd /var/www/blissedskin.com
git clone https://github.com/tu-usuario/blissed-skin.git .
```

**Workflow de Actualización:**

```bash
# En tu computadora (después de editar en Pinegrow)
git add sections/HowToUsed.html  # O el archivo que modificaste
git commit -m "Update: HowToUsed section - Added new product instructions"
git push origin main

# En el servidor (vía SSH)
cd /var/www/blissedskin.com
git pull origin main
```

**Cuándo usar:**
- Agencia con 2-5 personas
- Actualizaciones frecuentes (semanal)
- Necesitas historial de versiones
- Quieres colaboración en equipo

---

#### **Opción 3: Git + Webhooks Automáticos** 🌟 *Ideal para Agencias Profesionales*

**Cómo funciona:**
1. Editas en Pinegrow (local)
2. Guardas cambios
3. Haces `git commit` y `git push`
4. **GitHub envía webhook automático al servidor**
5. **Servidor ejecuta `git pull` automáticamente**
6. ✅ Cambios en producción en 30 segundos

**Ventajas:**
- ✅✅ Completamente automatizado
- ✅ Sin intervención manual en servidor
- ✅ Deploy en segundos después de push
- ✅ Historial completo de Git
- ✅ Fácil rollback si algo falla
- ✅ Staging + Production environments

**Desventajas:**
- ❌ Requiere configuración técnica inicial
- ❌ Necesitas acceso SSH y permisos en servidor

**Configuración Paso a Paso:**

**Paso 1: Script de Deploy en el Servidor**

```bash
# Conectar por SSH al servidor
ssh user@tuservidor.com

# Crear script de deploy
nano /var/www/deploy.sh
```

Contenido del script:

```bash
#!/bin/bash
# deploy.sh - Script para auto-deploy desde GitHub

# Variables
REPO_DIR="/var/www/blissedskin.com"
LOG_FILE="/var/log/deploy.log"
BRANCH="main"

# Logging
echo "$(date '+%Y-%m-%d %H:%M:%S') - Starting deploy" >> $LOG_FILE

# Ir al directorio del repositorio
cd $REPO_DIR

# Verificar que estamos en la rama correcta
git checkout $BRANCH

# Hacer pull de los cambios
git pull origin $BRANCH >> $LOG_FILE 2>&1

# Compilar TailwindCSS si es necesario
# npm run build:css >> $LOG_FILE 2>&1

# Limpiar caché si usas CDN
# curl -X POST "https://api.cloudflare.com/client/v4/zones/YOUR_ZONE/purge_cache" ...

echo "$(date '+%Y-%m-%d %H:%M:%S') - Deploy completed" >> $LOG_FILE
```

```bash
# Dar permisos de ejecución
chmod +x /var/www/deploy.sh

# Probar manualmente
/var/www/deploy.sh
```

**Paso 2: Configurar Webhook en GitHub**

1. Ve a tu repositorio en GitHub
2. Settings → Webhooks → Add webhook
3. Payload URL: `https://tuservidor.com/webhook-deploy.php`
4. Content type: `application/json`
5. Secret: `tu-secreto-super-seguro-123`
6. Events: `Just the push event`
7. Active: ✅

**Paso 3: Endpoint PHP en el Servidor**

```bash
nano /var/www/blissedskin.com/webhook-deploy.php
```

Contenido:

```php
<?php
// webhook-deploy.php - Recibe webhook de GitHub y ejecuta deploy

// Configuración
$secret = 'tu-secreto-super-seguro-123';
$deploy_script = '/var/www/deploy.sh';

// Verificar firma de GitHub
$headers = getallheaders();
$signature = $headers['X-Hub-Signature-256'] ?? '';
$payload = file_get_contents('php://input');

$expected_signature = 'sha256=' . hash_hmac('sha256', $payload, $secret);

if (!hash_equals($expected_signature, $signature)) {
    http_response_code(403);
    die('Invalid signature');
}

// Ejecutar script de deploy en background
exec("$deploy_script > /dev/null 2>&1 &");

// Responder a GitHub
http_response_code(200);
echo json_encode(['status' => 'Deploy initiated']);
?>
```

**Workflow Automatizado:**

```bash
# En tu computadora (después de editar)
git add .
git commit -m "Update: Added new blog post - Skincare Tips 2026"
git push origin main

# ✅ AUTOMÁTICO: GitHub webhook → Servidor ejecuta deploy.sh
# ✅ Cambios live en 30 segundos
```

**Cuándo usar:**
- Agencia profesional con 5+ clientes
- Actualizaciones diarias/semanales
- Equipo distribuido colaborando
- Necesitas CI/CD profesional

---

#### **Opción 4: CI/CD Completo (GitHub Actions)** 🚀 *Nivel Profesional Avanzado*

**Cómo funciona:**
1. Editas en Pinegrow
2. `git push` a GitHub
3. **GitHub Actions ejecuta pipeline automático:**
   - Valida HTML (html-validate)
   - Compila TailwindCSS
   - Optimiza imágenes
   - Ejecuta tests
   - Deploya a staging (rama `develop`)
   - Deploya a producción (rama `main`) solo si pasa tests

**Configuración:**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: Install dependencies
      run: npm install
    
    - name: Validate HTML
      run: npx html-validate sections/*.html
    
    - name: Build TailwindCSS
      run: npm run build:css
    
    - name: Deploy to server
      uses: easingthemes/ssh-deploy@v2.1.5
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: /var/www/blissedskin.com
```

**Cuándo usar:**
- Agencia grande (10+ clientes)
- Equipos de desarrollo completos
- Necesitas testing automatizado
- Ambientes staging/producción separados

---

### 📝 GESTIÓN DE CONTENIDO DEL BLOG

#### **Pregunta: ¿Cómo subir nuevos posts del blog semanalmente?**

**Respuesta:** Depende de cómo estructures el blog. Tienes 3 opciones:

---

#### **Opción A: Blog Estático (HTML Manual)** 📄

**Estructura:**
```
blog/
├── index.html                  # Lista de posts
├── posts/
│   ├── 2026-01-skincare-tips.html
│   ├── 2026-01-acne-treatment.html
│   └── 2026-02-new-product.html
└── data/
    └── posts.json              # Metadata de posts
```

**Workflow Semanal:**

```bash
# 1. Escribir nuevo post en Pinegrow o VS Code
# Crear: blog/posts/2026-02-winter-skincare.html

# 2. Actualizar posts.json
{
  "posts": [
    {
      "id": "winter-skincare-2026",
      "title": "Winter Skincare Tips",
      "date": "2026-02-15",
      "url": "posts/2026-02-winter-skincare.html",
      "excerpt": "Keep your skin hydrated this winter...",
      "image": "/assets/blog/winter-skincare.jpg"
    }
  ]
}

# 3. Deploy usando tu método elegido
git add blog/posts/2026-02-winter-skincare.html blog/data/posts.json
git commit -m "Blog: Added Winter Skincare Tips post"
git push origin main

# Si usas Opción 3 (Webhooks): Deploy automático en 30 seg ✅
# Si usas Opción 2 (Git manual): SSH + git pull
# Si usas Opción 1 (SFTP): Subir archivos manualmente
```

**Ventajas:**
- Simple, sin dependencias
- Rápido, no requiere servidor backend
- Compatible con tu stack actual (HTML/TailwindCSS)

**Desventajas:**
- Manual, requiere editar HTML cada vez
- No hay CMS visual para el contenido

---

#### **Opción B: Blog con Generador Estático** ⚡ *Recomendado*

**Herramientas:** Jekyll, Hugo, 11ty, Astro

**Estructura:**
```
blog/
├── _posts/                     # Markdown files
│   ├── 2026-01-15-skincare-tips.md
│   └── 2026-02-15-winter-care.md
├── _layouts/                   # Templates HTML
│   ├── post.html
│   └── blog-index.html
└── build/                      # HTML generado (deploy esto)
```

**Ejemplo con 11ty (Eleventy):**

```bash
# Instalar 11ty
npm install @11ty/eleventy --save-dev

# Crear post nuevo (archivo Markdown)
---
title: "Winter Skincare Tips"
date: 2026-02-15
image: /assets/blog/winter.jpg
---

# Winter Skincare Tips

Keep your skin hydrated during cold months...

[More content in Markdown]

# Compilar a HTML
npx eleventy

# Deploy (output en _site/)
git add _site/
git commit -m "Blog: Winter skincare post"
git push
```

**Ventajas:**
- ✅ Escribes en Markdown (más rápido que HTML)
- ✅ Compilación automática a HTML
- ✅ Templates reutilizables
- ✅ SEO optimizado automáticamente
- ✅ RSS feed generado automático

**Desventajas:**
- Requiere setup inicial (npm, eleventy)
- Curva de aprendizaje si no conoces Markdown

---

#### **Opción C: CMS Headless** 🎨 *Máxima Facilidad de Uso*

**Herramientas:** Contentful, Sanity, Strapi, Netlify CMS

**Cómo funciona:**
1. **Interfaz visual web** para escribir posts (como WordPress)
2. Posts guardados en JSON/API
3. Tu sitio consume el API y muestra posts
4. Deploy automático cuando publicas

**Ejemplo con Netlify CMS:**

```yaml
# admin/config.yml
backend:
  name: git-gateway
  branch: main

media_folder: "assets/blog"
public_folder: "/assets/blog"

collections:
  - name: "blog"
    label: "Blog Posts"
    folder: "blog/posts"
    create: true
    fields:
      - {label: "Title", name: "title", widget: "string"}
      - {label: "Date", name: "date", widget: "datetime"}
      - {label: "Image", name: "image", widget: "image"}
      - {label: "Body", name: "body", widget: "markdown"}
```

**Workflow:**
1. Ir a `https://tudominio.com/admin`
2. Login
3. Click "New Post"
4. Escribir título, contenido, subir imagen
5. Click "Publish"
6. ✅ Deploy automático vía GitHub webhook

**Ventajas:**
- ✅✅ Interfaz visual (no necesitas saber código)
- ✅ Perfecto para clientes que actualizan su propio blog
- ✅ Preview antes de publicar
- ✅ Editor de imágenes integrado
- ✅ Multiple usuarios con permisos

**Desventajas:**
- Requiere configuración inicial más compleja
- Puede tener costos (planes gratuitos limitados)

---

### 📊 COMPARATIVA: ¿Qué Opción Elegir?

| Criterio | SFTP Manual | Git Manual | Git + Webhooks | CI/CD GitHub Actions |
|----------|-------------|------------|----------------|---------------------|
| **Dificultad Setup** | ⭐☆☆☆☆ Fácil | ⭐⭐☆☆☆ Medio | ⭐⭐⭐☆☆ Medio-Alto | ⭐⭐⭐⭐☆ Avanzado |
| **Velocidad Deploy** | 5-10 min | 2-5 min | 30 seg | 1-2 min |
| **Automatización** | 0% Manual | 50% Semi-auto | 95% Automático | 100% Automático |
| **Historial Versiones** | ❌ No | ✅ Sí (Git) | ✅ Sí (Git) | ✅ Sí (Git) |
| **Rollback Fácil** | ❌ No | ✅ Sí | ✅ Sí | ✅ Sí |
| **Colaboración Equipo** | ❌ Difícil | ✅ Buena | ✅ Excelente | ✅ Excelente |
| **Testing Automático** | ❌ No | ❌ No | ⚠️ Opcional | ✅ Sí |
| **Costo** | $0 | $0 | $0 | $0 (GitHub free) |
| **Ideal Para** | 1 página estática | 2-5 páginas | 5-20 páginas | 20+ páginas |

---

### ✅ RECOMENDACIONES ESPECÍFICAS PARA BLISSED SKIN

#### **Para Secciones Estáticas (HowToUsed, About, Products):**

**Método Recomendado:** **Git + Webhooks** (Opción 3)

**Por qué:**
- Cambios poco frecuentes (1-2 veces/mes)
- Contenido HTML/CSS estático
- Deploy automático en 30 segundos
- Sin complicaciones de CI/CD innecesarias

**Workflow:**
```bash
# Editar sección en Pinegrow
1. Abrir HowToUsed.html en Pinegrow
2. Hacer cambios visuales
3. Guardar

# Deploy
4. git add sections/HowToUsed.html
5. git commit -m "Update: HowToUsed - Added video tutorial"
6. git push origin main
7. ✅ Webhook automático → Live en 30 seg
```

---

#### **Para Blog (Contenido Semanal):**

**Método Recomendado:** **Generador Estático (11ty/Eleventy)** + **Git Webhooks**

**Por qué:**
- Actualizaciones frecuentes (1-2 posts/semana)
- Markdown más rápido que HTML
- Templates reutilizables
- Compilación automática incluida en webhook

**Workflow:**
```bash
# Escribir nuevo post
1. Crear: blog/_posts/2026-02-skincare-routine.md
2. Escribir contenido en Markdown (5-10 min)

# Compilar y deploy
3. npx eleventy  # Genera HTML en _site/
4. git add blog/_posts/ _site/
5. git commit -m "Blog: New post - Skincare Routine 2026"
6. git push origin main
7. ✅ Webhook → Deploy automático
```

**Script Automático en deploy.sh:**
```bash
#!/bin/bash
cd /var/www/blissedskin.com
git pull origin main

# Compilar blog automáticamente
cd blog
npm run build  # Ejecuta eleventy
cd ..

# Restart nginx si es necesario
sudo systemctl reload nginx
```

---

### 🎯 CONFIGURACIÓN PASO A PASO RECOMENDADA

#### **Setup Inicial (Hacer Una Sola Vez):**

**1. Configurar Git en Local:**
```bash
cd C:\proyectos\Figma-Local\Dev-Mode\LP_Blissed
git init
git add .
git commit -m "Initial commit: Blissed Skin project"
git remote add origin https://github.com/tu-agencia/blissed-skin.git
git push -u origin main
```

**2. Configurar Servidor con Webhook:**
```bash
# SSH al servidor
ssh user@tuservidor.com

# Clonar repositorio
cd /var/www/
git clone https://github.com/tu-agencia/blissed-skin.git blissedskin.com

# Crear script deploy
nano /var/www/deploy.sh
# (copiar script de arriba)
chmod +x /var/www/deploy.sh

# Crear endpoint webhook
nano /var/www/blissedskin.com/webhook-deploy.php
# (copiar código PHP de arriba)
```

**3. Configurar GitHub Webhook:**
- GitHub repo → Settings → Webhooks → Add
- URL: `https://blissedskin.com/webhook-deploy.php`
- Secret: `tu-secreto-123`
- Events: Push

**4. Probar:**
```bash
# En local
echo "Test" >> test.txt
git add test.txt
git commit -m "Test webhook"
git push origin main

# Verificar en servidor (30 segundos después)
ssh user@tuservidor.com
cd /var/www/blissedskin.com
ls -la test.txt  # Debería existir ✅
```

---

### 📅 WORKFLOW SEMANAL TÍPICO

**Lunes: Actualizar Blog**
```bash
# Escribir post en Markdown
blog/_posts/2026-02-15-new-product-launch.md

# Deploy
git add blog/
git commit -m "Blog: New product launch announcement"
git push  # ✅ Live en 30 seg
```

**Miércoles: Actualizar Sección HowToUsed**
```bash
# Editar en Pinegrow
sections/HowToUsed.html

# Deploy
git add sections/HowToUsed.html
git commit -m "Update: Added video tutorial to HowToUsed"
git push  # ✅ Live en 30 seg
```

**Viernes: Cambiar Precios en Productos**
```bash
# Editar componentes en Pinegrow
components/AcnePatch20.html

# Deploy
git add components/
git commit -m "Update: Changed pricing for Acne Patch 20"
git push  # ✅ Live en 30 seg
```

---

### 🔒 SEGURIDAD Y BUENAS PRÁCTICAS

**1. No subir archivos sensibles:**
```bash
# .gitignore
node_modules/
.env
*.log
_pgbackup/
_pginfo/
.DS_Store
Thumbs.db
```

**2. Usar secrets para credenciales:**
```bash
# En GitHub: Settings → Secrets → Actions
SSH_PRIVATE_KEY=...
SERVER_HOST=...
DATABASE_PASSWORD=...
```

**3. Branches para protección:**
```bash
# Development branch
git checkout -b develop
# Hacer cambios experimentales aquí

# Merge a main solo cuando esté listo
git checkout main
git merge develop
git push  # Solo esto deploya a producción
```

---

## �📚 RECURSOS ADICIONALES

### Herramientas de Benchmarking

- **GTmetrix**: https://gtmetrix.com (velocidad y optimización)
- **PageSpeed Insights**: https://pagespeed.web.dev (rendimiento)
- **WebPageTest**: https://www.webpagetest.org (testing avanzado)
- **SSL Labs**: https://www.ssllabs.com/ssltest/ (seguridad SSL)

### Comunidades para Research

- **WebHostingTalk**: https://www.webhostingtalk.com (reviews de proveedores)
- **Reddit r/webhosting**: https://reddit.com/r/webhosting (recomendaciones)
- **LowEndBox**: https://lowendbox.com (ofertas de VPS)

### Documentación Útil

- **DigitalOcean Tutorials**: https://www.digitalocean.com/community/tutorials
- **Linode Guides**: https://www.linode.com/docs/guides/
- **Nginx Documentation**: https://nginx.org/en/docs/

---

## 📝 Notas Importantes

### Para Pinegrow:
- **NO editar directamente archivos con sufijo `_pgbackup`**
- Los archivos en `_pgbackup/` son versionado interno de Pinegrow
- `projectdb.pgml` es binario, no editar manualmente
- `pinegrow.json` se regenera automáticamente

### ⚠️ VALIDACIÓN DE HTML PARA PINEGROW:

**CRÍTICO**: Después de cada cambio o generación de código, **SIEMPRE** verificar que el HTML sea válido antes de abrir en Pinegrow.

#### Por qué es importante:
Pinegrow requiere HTML perfectamente formado porque:
- Su editor visual depende de parsear correctamente el DOM
- Necesita identificar exactamente dónde empieza y termina cada elemento
- Si el HTML está malformado, Pinegrow mostrará errores y no podrá renderizar correctamente

#### Checklist de validación antes de usar Pinegrow:

1. **Todas las etiquetas están correctamente cerradas**
   ```html
   ✅ BIEN:
   <div class="...">
       <nav>...</nav>
   </div>
   
   ❌ MAL:
   <div class="...">
       <nav>...</nav>
   </nav>  <!-- Cierra con </nav> en lugar de </div> -->
   ```

2. **No hay etiquetas duplicadas o corruptas**
   - Verificar que no haya código repetido accidentalmente
   - Buscar fragmentos de código incompletos o mal pegados

3. **Estructura jerárquica correcta**
   - Cada elemento hijo está dentro de su padre correspondiente
   - No hay etiquetas que se crucen incorrectamente

4. **Atributos bien formados**
   ```html
   ✅ BIEN: class="text-white font-bold"
   ❌ MAL: class="text-white font-bold (sin cerrar comillas)
   ```

#### Cómo validar:

**Opción 1: Usar Pinegrow mismo (Recomendado)**
- Abrir el archivo en Pinegrow
- Si hay errores, Pinegrow mostrará: "HTML SYNTAX ERRORS IN [archivo]"
- El mensaje indicará qué elemento tiene problemas
- Hacer clic en "Refresh" después de corregir

**Opción 2: Validadores online**
- [W3C Validator](https://validator.w3.org/#validate_by_input)
- [HTML Validator](https://www.freeformatter.com/html-validator.html)

**Opción 3: VS Code Extensions**
- Instalar: "HTMLHint" o "HTML Validator"
- Mostrará errores inline en el editor

---

## ⚠️ CHECKLIST POST-EDICIÓN: VALIDACIÓN AUTOMÁTICA OBLIGATORIA

### 🚨 IMPORTANTE: Ejecutar DESPUÉS de CADA cambio de código

Cada vez que modifiques archivos HTML (ya sea manualmente o mediante IA), **DEBES** ejecutar este checklist de validación para prevenir errores de sintaxis que romperían la compatibilidad con Pinegrow.

---

### 🔧 Comandos de Validación Automática (PowerShell/Windows)

#### 1. **Conteo de Tags `<div>` (Apertura vs Cierre)**

**Por qué es crítico:** Los `<div>` son los contenedores más usados. Un desbalance causa errores en cascada que rompen toda la estructura.

```powershell
# Validar archivo específico
$file = "sections\Legal.html"
$content = Get-Content $file -Raw
$openDivs = ([regex]::Matches($content, '<div')).Count
$closeDivs = ([regex]::Matches($content, '</div>')).Count
Write-Host "=== VALIDACIÓN DIV: $file ===" -ForegroundColor Cyan
Write-Host "Divs abiertos (<div):  $openDivs" -ForegroundColor Yellow
Write-Host "Divs cerrados (</div>): $closeDivs" -ForegroundColor Yellow
Write-Host "Diferencia: $($openDivs - $closeDivs)" -ForegroundColor $(if($openDivs -eq $closeDivs){'Green'}else{'Red'})
if ($openDivs -eq $closeDivs) {
    Write-Host "✅ BALANCE CORRECTO" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: Hay $([Math]::Abs($openDivs - $closeDivs)) divs sin cerrar/sobran cierres" -ForegroundColor Red
}
```

**Script rápido para validar TODOS los archivos HTML:**

```powershell
# Validar todos los archivos en /sections
$files = Get-ChildItem -Path "sections\" -Filter "*.html" -File
foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    $openDivs = ([regex]::Matches($content, '<div')).Count
    $closeDivs = ([regex]::Matches($content, '</div>')).Count
    $balance = $openDivs - $closeDivs
    
    $status = if ($balance -eq 0) { "✅" } else { "❌" }
    $color = if ($balance -eq 0) { "Green" } else { "Red" }
    
    Write-Host "$status $($file.Name): <div>=$openDivs </div>=$closeDivs (Diff: $balance)" -ForegroundColor $color
}
```

---

#### 2. **Conteo de Otras Tags Críticas**

```powershell
# Script completo de validación multi-tag
$file = "sections\Legal.html"
$content = Get-Content $file -Raw

$tags = @('div', 'section', 'header', 'footer', 'nav', 'main', 'article', 'aside')

Write-Host "`n=== VALIDACIÓN COMPLETA: $file ===" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

foreach ($tag in $tags) {
    $open = ([regex]::Matches($content, "<$tag[\s>]")).Count
    $close = ([regex]::Matches($content, "</$tag>")).Count
    $diff = $open - $close
    
    $status = if ($diff -eq 0) { "✅" } else { "❌" }
    $color = if ($diff -eq 0) { "Green" } else { "Red" }
    
    Write-Host "$status <$tag>: $open | </$tag>: $close | Diff: $diff" -ForegroundColor $color
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
```

---

#### 3. **Búsqueda de Fragmentos Sueltos (Código Corrupto)**

```powershell
# Buscar atributos class sin apertura de tag
$file = "sections\Legal.html"
$content = Get-Content $file

Write-Host "`n=== BÚSQUEDA DE FRAGMENTOS SUELTOS ===" -ForegroundColor Cyan

# Buscar líneas que empiecen con atributos (posible código corrupto)
$suspiciousLines = $content | Select-String -Pattern '^\s*(class=|id=|style=|data-|white/\d+)' 
if ($suspiciousLines.Count -gt 0) {
    Write-Host "❌ POSIBLES FRAGMENTOS ENCONTRADOS:" -ForegroundColor Red
    foreach ($line in $suspiciousLines) {
        Write-Host "  Línea $($line.LineNumber): $($line.Line.Trim())" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ No se encontraron fragmentos sueltos" -ForegroundColor Green
}

# Buscar cierres de tags sin apertura previa (heurística simple)
$orphanClosures = $content | Select-String -Pattern '^\s*</\w+>' | Where-Object {
    $_.Line -notmatch '>\s*</\w+>'  # Excluir cierres normales después de contenido
}
if ($orphanClosures.Count -gt 0) {
    Write-Host "⚠️  POSIBLES CIERRES HUÉRFANOS:" -ForegroundColor Yellow
    foreach ($line in $orphanClosures) {
        Write-Host "  Línea $($line.LineNumber): $($line.Line.Trim())" -ForegroundColor Gray
    }
}
```

---

#### 4. **Detección de Código Duplicado**

```powershell
# Buscar bloques HTML duplicados (>50 caracteres idénticos)
$file = "sections\Legal.html"
$content = Get-Content $file

Write-Host "`n=== DETECCIÓN DE CÓDIGO DUPLICADO ===" -ForegroundColor Cyan

$lineGroups = $content | Where-Object { $_.Trim().Length -gt 50 } | Group-Object
$duplicates = $lineGroups | Where-Object { $_.Count -gt 1 }

if ($duplicates.Count -gt 0) {
    Write-Host "⚠️  LÍNEAS DUPLICADAS ENCONTRADAS:" -ForegroundColor Yellow
    foreach ($dup in $duplicates | Select-Object -First 5) {
        Write-Host "  Aparece $($dup.Count) veces: $($dup.Name.Substring(0, [Math]::Min(80, $dup.Name.Length)))..." -ForegroundColor Gray
    }
} else {
    Write-Host "✅ No se detectaron duplicados obvios" -ForegroundColor Green
}
```

---

### 📋 Checklist Manual Complementario

Después de ejecutar los scripts automáticos, verifica manualmente:

- [ ] **Indentación correcta**: Usar Prettier/Format Document en VS Code
- [ ] **Comentarios de cierre**: Agregar `<!-- .class-name -->` en divs complejos
- [ ] **Atributos completos**: Todas las comillas de atributos cerradas
- [ ] **No hay espacios en nombres de tags**: `< div>` (✘) vs `<div>` (✓)
- [ ] **Encoding correcto**: UTF-8, caracteres especiales escapados
- [ ] **VS Code "Problems"**: Panel sin errores (Ctrl+Shift+M)

---

### 🎯 Script Todo-en-Uno: Validación Completa

```powershell
# validate-html.ps1 - Copiar y ejecutar en terminal PowerShell

param(
    [string]$Path = "sections\Legal.html"
)

function Test-HTMLBalance {
    param([string]$FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-Host "❌ Archivo no encontrado: $FilePath" -ForegroundColor Red
        return
    }
    
    $content = Get-Content $FilePath -Raw
    $fileName = Split-Path $FilePath -Leaf
    
    Write-Host "`n╔════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  VALIDACIÓN HTML: $fileName" -ForegroundColor Cyan
    Write-Host "╚════════════════════════════════════════════════╝" -ForegroundColor Cyan
    
    # 1. Validar tags principales
    $tags = @('div', 'section', 'header', 'footer', 'nav', 'main')
    $allBalanced = $true
    
    Write-Host "`n[1] BALANCE DE TAGS:" -ForegroundColor Yellow
    foreach ($tag in $tags) {
        $open = ([regex]::Matches($content, "<$tag[\s>]")).Count
        $close = ([regex]::Matches($content, "</$tag>")).Count
        $diff = $open - $close
        
        if ($diff -ne 0) { $allBalanced = $false }
        
        $status = if ($diff -eq 0) { "✅" } else { "❌" }
        $color = if ($diff -eq 0) { "Green" } else { "Red" }
        
        Write-Host "  $status <$tag>: $open abiertos, $close cerrados (Diff: $diff)" -ForegroundColor $color
    }
    
    # 2. Fragmentos sueltos
    Write-Host "`n[2] FRAGMENTOS SUELTOS:" -ForegroundColor Yellow
    $lines = Get-Content $FilePath
    $fragments = $lines | Select-String -Pattern '^\s*(class=|id=|style=|white/\d+)'
    if ($fragments.Count -gt 0) {
        Write-Host "  ❌ Encontrados $($fragments.Count) posibles fragmentos" -ForegroundColor Red
        $fragments | Select-Object -First 3 | ForEach-Object {
            Write-Host "     Línea $($_.LineNumber): $($_.Line.Trim())" -ForegroundColor Gray
        }
    } else {
        Write-Host "  ✅ Sin fragmentos detectados" -ForegroundColor Green
    }
    
    # 3. Resumen final
    Write-Host "`n[3] RESUMEN:" -ForegroundColor Yellow
    if ($allBalanced -and $fragments.Count -eq 0) {
        Write-Host "  ✅ ARCHIVO VÁLIDO - Listo para Pinegrow" -ForegroundColor Green -BackgroundColor DarkGreen
    } else {
        Write-Host "  ❌ ERRORES DETECTADOS - Corregir antes de usar en Pinegrow" -ForegroundColor White -BackgroundColor Red
    }
    
    Write-Host "`n════════════════════════════════════════════════`n" -ForegroundColor Cyan
}

# Ejecutar validación
Test-HTMLBalance -FilePath $Path

# Uso:
# .\validate-html.ps1 -Path "sections\Legal.html"
# .\validate-html.ps1  (usa Legal.html por defecto)
```

---

### 🚀 Integración en Workflow

#### **Después de editar con IA (Copilot/Claude):**

```powershell
# 1. Validar archivo modificado
.\validate-html.ps1 -Path "sections\PrivacyAndTerms.html"

# 2. Si hay errores, usar conteo detallado
$content = Get-Content "sections\PrivacyAndTerms.html" -Raw
([regex]::Matches($content, '<div')).Count  # Ver líneas específicas
([regex]::Matches($content, '</div>')).Count

# 3. Corregir errores y re-validar
.\validate-html.ps1 -Path "sections\PrivacyAndTerms.html"
```

#### **Antes de abrir en Pinegrow:**

```powershell
# Validar TODOS los archivos del proyecto
Get-ChildItem -Path "sections\" -Filter "*.html" | ForEach-Object {
    .\validate-html.ps1 -Path $_.FullName
}
```

#### **En Git Pre-Commit Hook (Opcional):**

```bash
# .husky/pre-commit (si usas husky)
#!/bin/sh
pwsh -Command "& {Get-ChildItem -Path 'sections\' -Filter '*.html' | ForEach-Object { if((Get-Content $_.FullName -Raw | Select-String '<div').Count -ne (Get-Content $_.FullName -Raw | Select-String '</div>').Count) { Write-Host 'Error en' $_.Name; exit 1 }}}"
```

---

### 📌 Errores Comunes y sus Soluciones

| Error | Síntoma PowerShell | Causa | Solución |
|-------|-------------------|-------|----------|
| **Div sin cerrar** | `Diff: 1` (más aperturas) | Falta `</div>` | Buscar último `<div>` sin cierre correspondiente |
| **Cierre extra** | `Diff: -1` (más cierres) | `</div>` huérfano | Eliminar cierre duplicado o agregar apertura |
| **Tag incorrecto** | Balance OK pero Pinegrow falla | `<section>...</div>` | Cambiar cierre al tag correcto |
| **Fragmento suelto** | Script [2] muestra líneas | Código corrupto por copy/paste | Eliminar líneas sueltas y reconstruir estructura |
| **Código duplicado** | Script [4] muestra duplicados | Accidental paste doble | Eliminar sección duplicada completa |

---

### ✅ Ejemplo de Output Correcto

```powershell
╔════════════════════════════════════════════════╗
║  VALIDACIÓN HTML: Legal.html
╚════════════════════════════════════════════════╝

[1] BALANCE DE TAGS:
  ✅ <div>: 28 abiertos, 28 cerrados (Diff: 0)
  ✅ <section>: 0 abiertos, 0 cerrados (Diff: 0)
  ✅ <header>: 1 abiertos, 1 cerrados (Diff: 0)
  ✅ <footer>: 0 abiertos, 0 cerrados (Diff: 0)
  ✅ <nav>: 2 abiertos, 2 cerrados (Diff: 0)
  ✅ <main>: 1 abiertos, 1 cerrados (Diff: 0)

[2] FRAGMENTOS SUELTOS:
  ✅ Sin fragmentos detectados

[3] RESUMEN:
  ✅ ARCHIVO VÁLIDO - Listo para Pinegrow

════════════════════════════════════════════════
```

---

## 🔍 GUÍA DE RESOLUCIÓN DE ERRORES DE SINTAXIS CON PINEGROW

### Síntomas de Errores de Sintaxis

Cuando Pinegrow detecta HTML malformado, mostrará un modal con:

```
HTML SYNTAX ERRORS IN [nombre-archivo].HTML

The following HTML elements have problems:
• div - is not properly closed.
• section - missing closing tag.
• [elemento] - [descripción del problema]

Click on the element on the above list to select it. If you can't see the element
in the tree, switch to Source code <> tree mode. Use "Page -> Check for HTML
errors" to validate the code at any time.

[Refresh] [✓ Check for errors on page open]
```

### Tipos Comunes de Errores

#### 1. **Etiqueta No Cerrada Correctamente**

**Error en Pinegrow:**
```
div - is not properly closed.
```

**Causa:** Falta el cierre `</div>` o está cerrado con otra etiqueta

**Ejemplo del problema:**
```html
<!-- ❌ ERROR -->
<div class="container">
    <p>Contenido</p>
    <section>Más contenido</section>
</div>
<!-- Falta cerrar el div anterior antes de abrir otro -->
<div class="next-section">
```

**Solución:**
```html
<!-- ✅ CORRECTO -->
<div class="container">
    <p>Contenido</p>
    <section>Más contenido</section>
</div>

<div class="next-section">
```

#### 2. **Cierre con Etiqueta Incorrecta**

**Error en Pinegrow:**
```
section - expected closing tag, found </div>
```

**Ejemplo del problema:**
```html
<!-- ❌ ERROR -->
<section class="hero">
    <div class="content">
        <h1>Título</h1>
    </div>
</section>  <!-- Se cerró correctamente -->
</div>  <!-- Este </div> no tiene apertura -->
```

**Solución:**
```html
<!-- ✅ CORRECTO -->
<section class="hero">
    <div class="content">
        <h1>Título</h1>
    </div>
</section>
```

#### 3. **Fragmentos de Código Sueltos**

**Error en Pinegrow:**
```
Unexpected text or attributes outside of elements
```

**Ejemplo del problema:**
```html
<!-- ❌ ERROR -->
white/80 font-sans">  <!-- Atributo class fragmentado -->
    <nav>...</nav>
</nav>  <!-- </nav> sin apertura -->
```

**Solución:**
```html
<!-- ✅ CORRECTO -->
<nav class="text-white/80 font-sans">
    ...
</nav>
```

#### 4. **Código Duplicado Accidentalmente**

**Error en Pinegrow:**
```
Multiple elements with same ID
Unexpected duplicate closing tag
```

**Ejemplo del problema:**
```html
<!-- ❌ ERROR: Al copiar/pegar se duplicó código -->
<footer class="main-footer">
    <div class="content">...</div>
</footer>
<footer class="main-footer">  <!-- Duplicado -->
    <div class="content">...</div>
</footer>
</footer>  <!-- Cierre extra -->
```

### Metodología de Debugging Paso a Paso

#### Paso 1: Identificar la Línea del Problema

Cuando Pinegrow muestra el error:

1. **Anotar el elemento problemático** (ej: `div`, `section`)
2. **Cambiar a modo "Source Code"** en Pinegrow (botón `<>`)
3. **Buscar todas las ocurrencias** del elemento en el archivo
4. **Usar el Tree View** para ver la jerarquía y detectar inconsistencias

#### Paso 2: Validar con Herramientas Externas

**Opción A: VS Code (Recomendado)**

```bash
# En terminal de VS Code
# 1. Abrir el archivo problemático
# 2. Buscar visualmente pares de apertura/cierre
# 3. Usar extensión "Bracket Pair Colorizer" para ver anidamiento
# 4. Ctrl+F buscar: </div> y contar vs <div>
```

**Opción B: Herramienta CLI html-validate**

```bash
# Instalar (una vez)
npm install -g html-validate

# Validar archivo específico
html-validate sections/Legal.html

# Validar todos los archivos HTML
html-validate sections/*.html

# Output ejemplo:
# Legal.html
#   92:9  error  Element <div> is not properly closed  close-order
```

**Opción C: W3C Validator Online**

1. Ir a: https://validator.w3.org/#validate_by_input
2. Copiar el contenido HTML completo
3. Pegar y hacer clic en "Check"
4. Revisar errores específicos con números de línea

#### Paso 3: Localizar Exactamente el Problema

**Técnica: Buscar Pares Desbalanceados**

```javascript
// Copiar en consola del navegador o usar script Node.js
const html = `[pegar contenido del archivo]`;

const openTags = (html.match(/<div[\s>]/g) || []).length;
const closeTags = (html.match(/<\/div>/g) || []).length;

console.log(`<div> abiertos: ${openTags}`);
console.log(`</div> cerrados: ${closeTags}`);
console.log(`Diferencia: ${openTags - closeTags}`);

// Si diferencia !== 0, hay un desbalance
```

**Técnica: Indentación Visual**

```html
<!-- Copiar sección problemática y re-indentar -->
<!-- Usar Prettier o "Format Document" en VS Code -->
<!-- Los problemas de cierre se harán evidentes -->

<!-- ANTES (difícil de ver el error) -->
<div><section><div><p>Texto</p></div></section><div>

<!-- DESPUÉS (error obvio) -->
<div>
    <section>
        <div>
            <p>Texto</p>
        </div>
    </section>
    <div>  <!-- ❌ Falta cerrar el <div> superior -->
```

#### Paso 4: Corregir el Error

**Estrategia de Corrección:**

1. **Localizar el elemento específico** mencionado por Pinegrow
2. **Verificar su etiqueta de cierre** correspondiente
3. **Buscar hacia adelante** si se abrió otro elemento antes de cerrar
4. **Agregar el cierre faltante** o **corregir el cierre incorrecto**
5. **Re-indentar todo el bloque** para verificar visualmente

**Ejemplo de Corrección Real:**

```html
<!-- ❌ ANTES (Error reportado: "div - is not properly closed") -->
<div>
    <h2>Copyright & Trademark Notice</h2>
    <p>Contenido...</p>
    <p>Más contenido...</p>
<div>  <!-- ❌ Se abrió nuevo <div> sin cerrar el anterior -->
    <h2>User-Generated Content</h2>
    ...
</div>

<!-- ✅ DESPUÉS (Corregido) -->
<div>
    <h2>Copyright & Trademark Notice</h2>
    <p>Contenido...</p>
    <p>Más contenido...</p>
</div>  <!-- ✅ Cerrado correctamente -->

<div>
    <h2>User-Generated Content</h2>
    ...
</div>
```

#### Paso 5: Verificar la Corrección

```bash
# Método 1: VS Code - Verificar errores
# Ver panel "Problems" (Ctrl+Shift+M)
# No debería haber errores de HTML

# Método 2: html-validate (CLI)
html-validate sections/Legal.html
# Output esperado:
# ✓ 0 problems (0 errors, 0 warnings)

# Método 3: Pinegrow
# Abrir archivo → Hacer clic en "Refresh"
# El modal de error debería desaparecer
```

### Prevención de Errores Futuros

#### 1. **Usar Prettier para Auto-Formateo**

```json
// .prettierrc
{
  "printWidth": 120,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": false,
  "htmlWhitespaceSensitivity": "ignore"
}
```

```bash
# Instalar Prettier
npm install --save-dev prettier

# Formatear todos los HTML
npx prettier --write "sections/*.html"
```

#### 2. **Extensiones VS Code Recomendadas**

```json
// .vscode/extensions.json
{
  "recommendations": [
    "esbenp.prettier-vscode",      // Auto-formateo
    "htmlhint.vscode-htmlhint",    // Linting HTML
    "bradlc.vscode-tailwindcss",   // IntelliSense Tailwind
    "CoenraadS.bracket-pair-colorizer-2"  // Visualizar pares
  ]
}
```

#### 3. **Workflow con Git Hooks**

```bash
# Instalar husky para pre-commit hooks
npm install --save-dev husky

# Configurar validación antes de commit
npx husky add .husky/pre-commit "html-validate sections/*.html"

# Ahora git no permitirá commits con HTML inválido
```

#### 4. **Template de Componente Seguro**

```html
<!-- SIEMPRE usar esta estructura base -->
<div class="component-wrapper">
    <!-- Contenido aquí -->
</div>  <!-- .component-wrapper -->

<!-- Agregar comentarios para divs complejos -->
<div class="outer">
    <div class="inner">
        <div class="content">
            <!-- Contenido -->
        </div>  <!-- .content -->
    </div>  <!-- .inner -->
</div>  <!-- .outer -->
```

### Checklist Final Antes de Abrir en Pinegrow

```markdown
- [ ] Todas las etiquetas <div> tienen su </div>
- [ ] Todas las etiquetas <section> tienen su </section>
- [ ] No hay fragmentos de código sueltos
- [ ] No hay código duplicado accidentalmente
- [ ] La indentación es correcta y visual
- [ ] VS Code no muestra errores en panel "Problems"
- [ ] html-validate pasa sin errores
- [ ] El archivo se puede abrir correctamente en navegador
```

### Comandos Rápidos de Emergencia

```bash
# Verificación rápida de todos los archivos HTML
find sections -name "*.html" -exec html-validate {} \;

# Contar tags de apertura vs cierre (Linux/Mac)
grep -o '<div' sections/Legal.html | wc -l  # Aperturas
grep -o '</div>' sections/Legal.html | wc -l  # Cierres

# Formatear y validar en un comando
npx prettier --write sections/*.html && html-validate sections/*.html
```

---

## ⚙️ Errores comunes a evitar:

```html
<!-- ❌ ERROR 1: Etiqueta de cierre incorrecta -->
<div class="container">
    <nav class="menu">
        ...
    </div>  <!-- Debería ser </nav> -->
</div>

<!-- ❌ ERROR 2: Código fragmentado/duplicado -->
white/80 font-sans">  <!-- Fragmento de atributo suelto -->
    <nav>...</nav>
</nav>  <!-- </nav> sin <nav> de apertura -->

<!-- ❌ ERROR 3: Etiquetas auto-cerradas incorrectas -->
<footer/div>  <!-- Mezclando sintaxis -->

<!-- ✅ CORRECTO: -->
<div class="container">
    <nav class="menu text-white/80 font-sans">
        ...
    </nav>
</div>
```

#### Flujo recomendado al hacer cambios:

1. **Editar código** en VS Code
2. **Validar HTML** (usando uno de los métodos arriba)
3. **Corregir errores** si los hay
4. **Guardar archivo**
5. **Abrir en Pinegrow** para refinamiento visual
6. Si Pinegrow muestra errores → volver al paso 2

#### Herramientas de debugging:

```bash
# Validar con npm (si tienes html-validate instalado)
npx html-validate index.html

# O instalar globalmente
npm install -g html-validate
html-validate sections/*.html
```

### Para TailwindCSS:
- Recompilar después de agregar nuevas clases:
  ```bash
  npx tailwindcss -i src/input.css -o tailwind_theme/tailwind.css --watch
  ```

### Para JavaScript:
- Siempre usar `const` y `let`, nunca `var`
- Preferir arrow functions
- Usar template literals para strings complejos
- Event delegation sobre múltiples listeners

### Para HTML Semántico:
- Usar etiquetas apropiadas (`<article>`, `<section>`, `<nav>`, `<header>`)
- Incluir atributos ARIA para accesibilidad
- `role`, `aria-label`, `aria-current`, etc.

---

## 🎯 Design Tokens (Sistema de Colores)

```css
/* Principales */
--blissed-gray: #3C3C3C        /* Texto principal, botones */
--blissed-olive: #9FB686       /* Acentos, hover states */
--blissed-lavender: #D1A3D9    /* Detalles, bordes */

/* Gradientes */
--purple-gradient: linear-gradient(to right, #a63d97, #d39ecb)
--green-gradient: linear-gradient(to right, #EEF9E3, #E1E4DE)

/* Productos */
--product-primary: #155dfc → #9810fa (gradiente azul-morado)
--star-rating: #FE9A00 (naranja)
--highlight: #FEF3C6 (amarillo claro)
```

---

## 🤝 Contribución y Mantenimiento

### Cuando agregues nuevas funcionalidades:

1. Mantener la arquitectura de componentes
2. Documentar en `STYLEGUIDE.md` si es relevante
3. Seguir convenciones de nombres existentes
4. Testear en responsive (mobile, tablet, desktop)
5. Asegurar accesibilidad (teclado, lectores de pantalla)

### Debugging:

- Revisar consola para logs de `[ComponentLoader]`, `[CarouselProducts]`, etc.
- Verificar que `data-component` coincida con nombre registrado
- Comprobar orden de carga de scripts
- Usar DevTools para inspeccionar estilos aplicados

---

## 📧 Contacto y Recursos

- **Proyecto**: Blissed Skin E-commerce Landing Page
- **Stack**: HTML5, TailwindCSS, Vanilla JavaScript, Pinegrow
- **Integración**: Figma + MCP + VS Code Copilot
- **Design System**: Ver `STYLEGUIDE.md` para componentes detallados

---

**Última actualización**: Enero 2026
