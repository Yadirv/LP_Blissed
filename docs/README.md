# Blissed Skin - Landing Page Project

## 📋 Descripción General

Este proyecto es una landing page de e-commerce para **Blissed Skin**, desarrollada mediante un flujo de trabajo moderno que integra diseño en Figma, generación de código con IA, y edición visual con Pinegrow. El proyecto utiliza **TailwindCSS** para estilos y una arquitectura de **Smart Components** con JavaScript modular.

---

## ⚙️ Configuración Inicial Recomendada

### Prettier - Auto-Formateo de Código

**¿Por qué usarlo?**

- Mantiene consistencia de código entre colaboradores
- Formatea automáticamente al guardar
- Evita debates sobre estilo de código
- Esencial para proyectos con múltiples desarrolladores

**Instalación:**

```bash
# Instalar Prettier como dependencia de desarrollo
npm install --save-dev prettier

# Crear archivo de configuración
touch .prettierrc
```

**Configuración recomendada** (`.prettierrc`):

```json
{
  "semi": true,
  "singleQuote": false,
  "tabWidth": 2,
  "useTabs": false,
  "printWidth": 100,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "arrowParens": "always",
  "htmlWhitespaceSensitivity": "css"
}
```

**Script en `package.json`:**

```json
{
  "scripts": {
    "format": "prettier --write \"**/*.{html,css,js,json,md}\"",
    "format:check": "prettier --check \"**/*.{html,css,js,json,md}\""
  }
}
```

### Extensiones Recomendadas para VS Code

Instalar las siguientes extensiones para mejorar el flujo de desarrollo:

**1. Prettier - Code formatter**

- **ID**: `esbenp.prettier-vscode`
- **Propósito**: Formateo automático de código
- **Configuración**: Activar "Format On Save" en VS Code settings

**2. Tailwind CSS IntelliSense**

- **ID**: `bradlc.vscode-tailwindcss`
- **Propósito**: Autocompletado inteligente de clases Tailwind
- **Features**: Hovers con preview de estilos, sugerencias contextuales

**3. Bracket Pair Colorizer 2**

- **ID**: `CoenraadS.bracket-pair-colorizer-2`
- **Propósito**: Colorea paréntesis, llaves y corchetes coincidentes
- **Ventaja**: Facilita identificar bloques de código anidados

**Instalación rápida vía comando:**

```bash
# Abrir VS Code Command Palette (Ctrl+Shift+P / Cmd+Shift+P)
# Ejecutar: Extensions: Install Extensions
# Buscar e instalar cada extensión

# O instalar via CLI:
code --install-extension esbenp.prettier-vscode
code --install-extension bradlc.vscode-tailwindcss
code --install-extension CoenraadS.bracket-pair-colorizer-2
```

**Configuración de VS Code** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "tailwindCSS.emmetCompletions": true,
  "tailwindCSS.includeLanguages": {
    "html": "html",
    "javascript": "javascript"
  },
  "files.associations": {
    "*.css": "tailwindcss"
  }
}
```

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
  clientFrameworks: "tailwindcss",
});
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
├── robots.txt                          # SEO y crawlers
├── CNAME                               # Configuración de dominio personalizado
├── package.json                        # Dependencias del proyecto
├── package-lock.json                   # Lock de versiones
├── tailwind.config.js                  # Configuración de TailwindCSS
├── STYLEGUIDE.md                       # Guía de estilos y componentes
├── pinegrow.json                       # Configuración de Pinegrow
├── projectdb.pgml                      # Base de datos de Pinegrow
├── netlify.toml                        # Configuración de Netlify
├── .env                                # Variables de entorno (no en Git)
├── .gitignore                          # Archivos ignorados por Git
│
├── .vscode/                            # Configuración de VS Code
│   └── settings.json                   # Settings del workspace
│
├── docs/                               # Documentación del proyecto
│   ├── README.md                       # Este archivo
│   ├── VALIDATION_CHECKLIST-Pine.md    # Checklist de validación
│   ├── COMPONENTS.md                   # Documentación de componentes
│   ├── PROMPTS.md                      # Prompts para IA
│   └── GUIA_COMPLETA_SP_API_NETLIFY.md # Guía de integración SP-API
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
│   ├── Header.html
│   ├── pinegrow.json                   # Configuración de componentes
│   ├── projectdb.pgml                  # BD de componentes
│   ├── _pgbackup/                      # Backups de componentes
│   ├── _pginfo/                        # Metadatos de componentes
│   ├── pagination/                     # Componentes de paginación
│   └── product-card/                   # Tarjetas de producto
│
├── sections/                           # Secciones de página de Pinegrow
│   ├── Hero.html
│   ├── AboutBlissed.html
│   ├── PageAllProducts.html
│   ├── IntroText.html
│   ├── HowToUsed.html
│   ├── HomeRegistration.html
│   ├── Legal.html
│   ├── PrivacyAndTerms.html
│   ├── ReturnExchange.html
│   ├── pinegrow.json
│   ├── _pgbackup/                      # Backups de secciones
│   └── _pginfo/                        # Metadatos de secciones
│
├── assets/                             # Assets estáticos
│   ├── products/                       # Imágenes de productos
│   ├── imguser/                        # Imágenes de usuarios/testimonios
│   ├── icons/                          # Iconografía
│   ├── HowToUsed/                      # Imágenes de guías de uso
│   ├── css/                            # Estilos globales
│   └── blog/                           # Assets del blog
│       ├── featured/                   # Imágenes destacadas de posts
│       ├── thumbnails/                 # Miniaturas de posts
│       ├── content/                    # Imágenes de contenido
│       └── authors/                    # Fotos de autores
│
├── blog/                               # Sistema de blog
│   ├── index.html                      # Página principal del blog
│   ├── template-blog.html              # Template de post individual
│   ├── _post-production/               # Producción de contenido
│   │   ├── sistema-contenedores-editorial.md
│   │   ├── Estructura de Blogs para SEO y Mant.txt
│   │   ├── guia-content-master-json.md
│   │   ├── VEREDICTO-UNIFICACION-CRITERIOS.md
│   │   └── Feb-2026/                   # Posts por mes
│   │       ├── acne-science-blog.md
│   │       ├── acne-science-blog.json
│   │       ├── acne-genetic-blog.md
│   │       └── acne-genetic-blog.json
│   ├── posts/                          # Posts publicados (HTML)
│   ├── categories/                     # Páginas de categorías
│   ├── data/                           # Datos del blog
│   │   ├── posts-metadata.json         # Metadata de todos los posts
│   │   └── categories.json             # Categorías del blog
│   └── components/                     # Componentes del blog
│       ├── blog-card/                  # Tarjeta de preview de post
│       │   ├── blog-card.js
│       │   └── blog-card.css
│       └── blog-post/                  # Componente de post individual
│           ├── blog-post.js
│           └── blog-post.css
│
├── netlify/                            # Funciones serverless de Netlify
│   └── functions/
│       └── spapi-proxy.js              # Proxy para Amazon SP-API
│
├── tailwind_theme/                     # Tema compilado de Tailwind
│   └── tailwind.css                    # CSS compilado final
│
├── _pgbackup/                          # Backups automáticos de Pinegrow
│   ├── index_*.html                    # Versiones anteriores de páginas
│   ├── pinegrow_*.json                 # Versiones de configuración
│   └── projectdb_*.pgml                # Versiones de BD
│
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
    const componentName = el.getAttribute("data-component");
    const initFn = registry.get(componentName);
    if (initFn) {
      initFn(el);
      el.__initialized = true;
    }
  };

  // Observer para componentes dinámicos
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) {
          if (node.hasAttribute("data-component")) initComponent(node);
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
<section id="reviews" data-component="carousel-reviews" data-pgc="reviews_carousel" class="...">
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
window.ComponentLoader.registerComponent("carousel-reviews", (root) => {
  // 1. Protección anti-duplicación
  if (root.__initialized) return;
  root.__initialized = true;

  // 2. Estado local del componente
  const state = {
    currentIndex: 0,
    totalSlides: 0,
  };

  // 3. Referencias relativas al root (NO usar IDs globales)
  const viewport = root.querySelector(".pg-viewport");
  const track = root.querySelector(".pg-track");
  const slides = Array.from(root.querySelectorAll(".pg-slide"));
  const dots = Array.from(root.querySelectorAll(".pg-dot"));

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
      slide.classList.toggle("is-active", isActive);
      slide.classList.toggle("is-inactive", !isActive);

      slide.style.cssText = `
                width: ${viewportWidth}px !important;
                min-width: ${viewportWidth}px !important;
                display: flex !important;
                flex-shrink: 0 !important;
            `;
    });

    // Actualizar dots
    dots.forEach((dot, idx) => {
      dot.classList.toggle("is-selected", idx === state.currentIndex);
    });
  };

  // 5. Event Delegation en el root (no usar eventos globales)
  root.addEventListener("click", (e) => {
    const arrow = e.target.closest(".pg-arrow");
    if (arrow && root.contains(arrow)) {
      const action = arrow.getAttribute("data-action");
      if (action === "next") state.currentIndex++;
      if (action === "prev") state.currentIndex--;
      update();
    }

    const dot = e.target.closest(".pg-dot");
    if (dot && root.contains(dot)) {
      state.currentIndex = parseInt(dot.getAttribute("data-index"));
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
    "./index.html",
    "./components/**/*.html",
    "./sections/**/*.html",
    "./src/**/*.{js,css}",
  ],
  theme: {
    extend: {
      colors: {
        "blissed-gray": "#3C3C3C",
        "blissed-olive": "#9FB686",
        "blissed-lavender": "#D1A3D9",
        "blissed-purple-start": "#a63d97",
        "blissed-purple-end": "#d39ecb",
        "blissed-text-dark": "#2D2D2D",
      },
      fontFamily: {
        playfair: ["Playfair Display", "serif"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
};
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
    <link href="tailwind_theme/tailwind.css" rel="stylesheet" />

    <!-- 2. Estilos globales -->
    <link rel="stylesheet" href="src/assets/css/base.css" />

    <!-- 3. Estilos de componentes (orden no crítico) -->
    <link rel="stylesheet" href="src/components/main-header/main-header.css" />
    <link rel="stylesheet" href="src/components/main-footer/main-footer.css" />
    <link rel="stylesheet" href="src/components/carousel-products/carousel-products.css" />
    <link rel="stylesheet" href="src/components/carousel-reviews/carousel-reviews.css" />
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
   [data-component="mi-componente"] .mi-clase {
   }
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
   const element = document.getElementById("carousel-track");

   // ✅ BIEN
   const element = root.querySelector(".pg-track");
   ```

2. **No usar event listeners globales**

   ```javascript
   // ❌ MAL
   document.addEventListener("click", handler);

   // ✅ BIEN
   root.addEventListener("click", handler);
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
   window.ComponentLoader.registerComponent("nuevo-componente", (root) => {
     // Lógica del componente
   });
   ```

5. **Enlazar en HTML**

   ```html
   <!-- En index.html -->
   <link rel="stylesheet" href="src/components/nuevo-componente/nuevo-componente.css" />

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
   - Ver sección [Proceso de Despliegue](#-proceso-de-despliegue) para detalles completos

---

## 🚀 PROCESO DE DESPLIEGUE

Este proyecto utiliza un flujo de despliegue moderno basado en **Git + Netlify** con integración de **Amazon SP-API** para funcionalidades de e-commerce.

### Arquitectura de Despliegue

```
GitHub Repository (Source of Truth)
         ↓
    Git Push to main
         ↓
Netlify (Continuous Deployment)
         ├─→ Build: npm run build (TailwindCSS)
         ├─→ Deploy: HTML/CSS/JS estáticos
         └─→ Functions: netlify/functions/spapi-proxy.js
                ↓
        Amazon SP-API
        (Product Catalog, Inventory)
```

### 1. Configuración Inicial de GitHub Pages (Fase 1 - Deprecated)

**Nota histórica**: El proyecto inicialmente se desplegó en GitHub Pages para pruebas rápidas. Posteriormente se migró a Netlify por las siguientes razones:

- ✅ Netlify soporta funciones serverless (necesarias para SP-API)
- ✅ Build automático de TailwindCSS
- ✅ Variables de entorno seguras para credenciales
- ✅ Preview deployments por pull request
- ❌ GitHub Pages es estático puro (sin backend)

**Proceso inicial (solo referencia):**

```bash
# 1. Habilitar GitHub Pages en Settings del repo
# 2. Configurar branch: main → folder: / (root)
# 3. Agregar CNAME para dominio personalizado
echo "blissedskin.com" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push origin main
```

### 2. Configuración de Amazon SP-API (Selling Partner API)

**¿Por qué SP-API?**

- Sincronización de catálogo de productos con Amazon
- Gestión de inventario en tiempo real
- Obtener precios y disponibilidad
- Procesar pedidos (futuro)

**Setup de Credenciales:**

```bash
# 1. Crear app en Amazon Seller Central
# https://sellercentral.amazon.com/apps/manage

# 2. Obtener credenciales (NO COMMITEAR AL REPO)
# - LWA Client ID
# - LWA Client Secret
# - Refresh Token
# - AWS Access Key
# - AWS Secret Key

# 3. Crear archivo .env (local development)
touch .env
```

**Contenido de `.env` (ejemplo NO REAL):**

```env
# Amazon SP-API Credentials
LWA_CLIENT_ID=amzn1.application-oa2-client.xxxxxxxxxxxxx
LWA_CLIENT_SECRET=amzn1.oa2-cs.v1.xxxxxxxxxxxxxxxxxxxxxx
REFRESH_TOKEN=Atzr|IwEBIxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
AWS_ACCESS_KEY_ID=AKIAxxxxxxxxxxxxx
AWS_SECRET_ACCESS_KEY=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SELLER_ID=A1XXXXXXXXXX
MARKETPLACE_ID=ATVPDKIKX0DER

# Netlify redirecciona requests a:
SP_API_ENDPOINT=https://sellingpartnerapi-na.amazon.com
```

**⚠️ IMPORTANTE - Seguridad:**

```bash
# Asegurar que .env NO se suba a Git
echo ".env" >> .gitignore

# Verificar que no está trackeado
git status
# .env NO debe aparecer en cambios pendientes
```

### 3. Configuración de Netlify (Despliegue Actual)

**Paso 1: Conectar Repositorio**

1. Ir a [Netlify](https://app.netlify.com)
2. Click "Add new site" → "Import an existing project"
3. Conectar con GitHub
4. Seleccionar repositorio: `LP_Blissed`
5. Configurar build settings:

```yaml
# Build settings en Netlify UI
Build command: npm run build
Publish directory: .
# (root porque index.html está en raíz)

# O usar netlify.toml (preferido)
```

**Paso 2: Configurar `netlify.toml`**

```toml
[build]
  command = "npm run build"
  publish = "."

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/api/spapi/*"
  to = "/.netlify/functions/spapi-proxy/:splat"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Paso 3: Configurar Variables de Entorno**

```bash
# En Netlify UI: Site settings → Environment variables
# ⚠️ NO usar AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY — Netlify los sobreescribe.
# Ver sección 4.1 para tabla completa con nombres correctos y marcado de secrets.

SPAPI_AWS_KEY = AKIA2SYQILQU...          # IAM user access key (empieza con AKIA)
SPAPI_AWS_SECRET = fApT5AYf5ug...        # IAM user secret key (secret ✅)
SPAPI_ROLE_ARN = arn:aws:iam::727...     # ARN del rol IAM con permisos SP-API
LWA_CLIENT_ID = amzn1.application-oa2-client...
LWA_CLIENT_SECRET = amzn1.oa2-cs.v1...  # (secret ✅)
REFRESH_TOKEN = Atzr|IwEBI...            # (secret ✅)
MARKETPLACE_ID = ATVPDKIKX0DER
SELLER_ID = A2WIUJJE31UWQW
AWS_REGION = us-east-1
USE_SPAPI_SANDBOX = false                # Different per context (ver sección 4.1)
```

**Paso 4: Deploy de Función Serverless**

La función real del proyecto es `netlify/functions/sp-api-products.js`. Actúa como proxy
seguro con caché en memoria y autenticación STS AssumeRole.

**Acciones disponibles en el endpoint `/api/sp-api-products`:**

| Query param `?action=` | Descripción                         | Requiere `?asins=`   |
| ---------------------- | ----------------------------------- | -------------------- |
| `health`               | Verifica que la función está viva   | No                   |
| `getProducts`          | Retorna datos de productos por ASIN | Sí                   |
| `getPrices`            | Retorna precios en tiempo real      | Sí (pendiente impl.) |

**Arquitectura interna:**

```
Cliente (browser)
    ↓
/api/sp-api-products?action=getProducts&asins=B07ZPKBL9V
    ↓ (redirect netlify.toml)
/.netlify/functions/sp-api-products
    ↓
 AWS STS AssumeRole (SPAPI_ROLE_ARN) → credenciales temporales (60 min)
    ↓
 amazon-sp-api SDK (LWA → access token → SP-API)
    ↓
 Response JSON + caché 15 min en memoria
```

**Trigger de deploy:** `git push origin main` → Netlify detecta el push,
ejecutando `npm run build` + esbuild para empaquetar las funciones automáticamente.

### 4. Verificación de Deploy en Producción ✅

**Estado actual (2026-02-24):** Deploy verde — dominio `blissedskin.us` apuntando a Netlify.

**Health check ejecutado (resultado real):**

```bash
# Comando:
Invoke-WebRequest -Uri "https://blissedskin.us/api/sp-api-products?action=health" \
  -UseBasicParsing | Select-Object StatusCode, Content

# Respuesta (200 OK):
# {"status":"ok","message":"SP-API Netlify Function is running",
#  "mode":"production","timestamp":"2026-02-24T15:53:53.202Z"}
```

```bash
# También verificado en www:
Invoke-WebRequest -Uri "https://www.blissedskin.us/api/sp-api-products?action=health"
# → 200 OK ✅
```

**DNS configurado (blissedskin.us):**

| Registro             | Tipo            | Valor                         |
| -------------------- | --------------- | ----------------------------- |
| `blissedskin.us`     | NETLIFY         | `blissed-skin-lp.netlify.app` |
| `www.blissedskin.us` | NETLIFY         | `blissed-skin-lp.netlify.app` |
| Email ProtonMail     | MX + DKIM + SPF | Configurado ✅                |

---

### 4.1 Variables de Entorno — Configuración Correcta en Netlify

> **⚠️ Problema conocido:** Netlify inyecta sus propias variables `AWS_ACCESS_KEY_ID` y
> `AWS_SECRET_ACCESS_KEY` internamente. Si defines variables con esos mismos nombres, Netlify
> las sobreescribe con sus credenciales temporales (`ASIA...`), causando error de STS.
> **Solución:** usar nombres con prefijo `SPAPI_` para las credenciales propias de AWS.

**Regla de nomenclatura:**

| Nombre INCORRECTO ❌    | Nombre CORRECTO ✅ | Razón                                          |
| ----------------------- | ------------------ | ---------------------------------------------- |
| `AWS_ACCESS_KEY_ID`     | `SPAPI_AWS_KEY`    | Netlify lo sobreescribe                        |
| `AWS_SECRET_ACCESS_KEY` | `SPAPI_AWS_SECRET` | Netlify lo sobreescribe                        |
| `IAM_ROLE_ARN`          | `SPAPI_ROLE_ARN`   | Sin conflicto pero renombrado por consistencia |

**Tabla completa de variables — una por credencial:**

| Variable            | Valor de ejemplo                  | ¿Marcar "Secret"? | Contextos                 |
| ------------------- | --------------------------------- | ----------------- | ------------------------- |
| `SPAPI_AWS_KEY`     | `AKIA2SYQILQU...`                 | No                | Same value all            |
| `SPAPI_AWS_SECRET`  | `fApT5AYf5ug...`                  | ✅ Sí             | Same value all            |
| `SPAPI_ROLE_ARN`    | `arn:aws:iam::727...`             | No                | Same value all            |
| `LWA_CLIENT_ID`     | `amzn1.application-oa2-client...` | No                | Same value all            |
| `LWA_CLIENT_SECRET` | `amzn1.oa2-cs.v1...`              | ✅ Sí             | Same value all            |
| `REFRESH_TOKEN`     | `Atzr\|IwEBI...`                  | ✅ Sí             | Same value all            |
| `MARKETPLACE_ID`    | `ATVPDKIKX0DER`                   | No                | Same value all            |
| `SELLER_ID`         | `A2WIUJJE31UWQW`                  | No                | Same value all            |
| `AWS_REGION`        | `us-east-1`                       | No                | Same value all            |
| `USE_SPAPI_SANDBOX` | `false` / `true`                  | No                | **Different per context** |

**`USE_SPAPI_SANDBOX` con "Different value for each deploy context":**

| Contexto                       | Valor   |
| ------------------------------ | ------- |
| Production                     | `false` |
| Deploy Previews                | `true`  |
| Branch deploys                 | `true`  |
| Preview Server & Agent Runners | `true`  |
| Local development              | `true`  |

> **Secret values:** Los campos marcados como Secret solo son legibles por el código
> en ejecución en Netlify. En el UI/API/CLI aparecen enmascarados. El código los
> recibe igual — no afecta la funcionalidad.

---

### 4.2 Datos Disponibles por SP-API

La función `sp-api-products.js` realiza 2 llamadas paralelas por ASIN:
**Catalog Items API** + **Product Pricing API**.

**Catálogo disponible (`getCatalogItem`):**

| Campo              | Descripción                         | Disponible |
| ------------------ | ----------------------------------- | ---------- |
| `title`            | Título completo del producto        | ✅         |
| `brand`            | Marca del producto                  | ✅         |
| `bulletPoints[]`   | Puntos de venta (hasta 5)           | ✅         |
| `images.main`      | URL imagen principal (CDN Amazon)   | ✅         |
| `images.gallery[]` | URLs imágenes adicionales (hasta 4) | ✅         |
| Rating + # reseñas | Puntuación y conteo de reviews      | 🔮 Futuro  |

**Precios disponibles (`getItemOffers`):**

| Campo                | Descripción               | Disponible |
| -------------------- | ------------------------- | ---------- |
| `pricing.current`    | Precio actual Buy Box     | ✅         |
| `pricing.list`       | Precio de lista (tachado) | ✅         |
| `pricing.currency`   | Moneda (`USD`)            | ✅         |
| `pricing.savings`    | Ahorro en $               | ✅         |
| `pricing.savingsPct` | % de descuento            | ✅         |
| `pricing.hasBuyBox`  | Si hay Buy Box disponible | ✅         |

**Stock (`TotalOfferCount` + `fulfillmentChannel`):**

| Campo                      | Descripción               | Disponible |
| -------------------------- | ------------------------- | ---------- |
| `availability.inStock`     | `true` / `false`          | ✅         |
| `availability.totalOffers` | Nº de ofertas activas     | ✅         |
| `availability.fulfillment` | `"Amazon"` / `"Merchant"` | ✅         |
| `availability.isPrime`     | Si aplica Prime           | ✅         |

> **Pregunta al usuario antes de implementar:** ¿Qué datos quieres mostrar en la LP?
> Con esa respuesta se implementa el selector correcto en `sp-api-client.js`.

---

### 4.3 Test del Endpoint con Datos Reales

**Una vez configuradas todas las variables y re-deploy, ejecutar:**

```powershell
# Test básico con un ASIN real del catálogo (B0F1R19443 = 30 patches)
(Invoke-WebRequest -Uri "https://blissedskin.us/api/sp-api-products?action=getProducts&asins=B0F1R19443" `
  -UseBasicParsing).Content | ConvertFrom-Json | ConvertTo-Json -Depth 8
```

**Respuesta real obtenida (2026-02-24):**

```json
{
  "products": [
    {
      "asin": "B0F1R19443",
      "title": "BLISSED SKIN Invisible Pimple Patches for Face - Hydrocolloid Acne Patches with Tea Tree Oil - Gentle, 30 Effective Zit Patches in Four Sizes",
      "brand": null,
      "bulletPoints": [
        "Seamless Coverage: Our invisible pimple patches blend perfectly with your skin...",
        "24/7 Acne Support: Wear our hydrocolloid pimple patches day or night...",
        "Natural & Gentle: Crafted with hydrocolloid and tea tree oil...",
        "Active Lifestyle Ready: Flexible and breathable...",
        "Easy to Use: Cleanse and dry the area, apply the pimple patch..."
      ],
      "images": {
        "main": "https://m.media-amazon.com/images/I/61Aft2VvCBL.jpg",
        "gallery": [
          "https://m.media-amazon.com/images/I/614uarXZryL.jpg",
          "https://m.media-amazon.com/images/I/41YDEWMTkaL.jpg",
          "https://m.media-amazon.com/images/I/61OXJu09plL.jpg"
        ]
      },
      "pricing": {
        "current": 8.75,
        "list": 14.49,
        "currency": "USD",
        "savings": 5.74,
        "savingsPct": 40,
        "hasBuyBox": true
      },
      "availability": {
        "inStock": true,
        "totalOffers": 1,
        "fulfillment": "Amazon",
        "isPrime": false
      },
      "source": "sp-api",
      "fetchedAt": "2026-02-24T17:20:20.335Z"
    }
  ],
  "count": 1,
  "timestamp": "2026-02-24T17:20:20.335Z",
  "mode": "production"
}
```

**Test con múltiples ASINs del catálogo completo:**

```powershell
# Todos los productos de Blissed Skin en una sola llamada
Invoke-WebRequest -Uri "https://blissedskin.us/api/sp-api-products?action=getProducts&asins=B0F1R19443,B0DYVT57W1,B0F1QWGWR5,B0DYZHX7MP" `
  -UseBasicParsing | Select-Object -ExpandProperty Content | ConvertFrom-Json |
  ForEach-Object { $_.products } |
  Select-Object asin, title, @{n="price";e={$_.pricing.current}}, @{n="inStock";e={$_.availability.inStock}} |
  Format-Table -AutoSize
```

**Caché:** Resultados se cachean 15 min en memoria (Netlify function). Los precios
(`getPrices`) tienen caché de 5 min por la mayor frecuencia de cambios.

---

### 4.4 Conectar el Endpoint con el Frontend

**Catálogo de ASINs del proyecto (2026-02-24):**

| `data-product-id` | ASIN         | Producto                               |
| ----------------- | ------------ | -------------------------------------- |
| `acne-patch-30`   | `B0F1R19443` | 30 Effective Zit Patches in Four Sizes |
| `acne-patch-60`   | `B0DYVT57W1` | 60 Effective Zit Patches in Four Sizes |
| `acne-patch-20`   | `B0F1QWGWR5` | 20 Extra Large Effective Zit Patches   |
| `nasal-strip-40`  | `B0DYZHX7MP` | 40 Premium Nasal Strips                |

**Paso 1 — Agregar `data-asin` a los elementos HTML:**

```html
<!-- Ejemplo: product slide en PageAllProducts.html -->
<article data-product-id="acne-patch-30" data-asin="B0F1R19443" data-price="8.75" ...></article>
```

**Paso 2 — Cargar el cliente `sp-api-client.js` al final del body:**

```html
<!-- Después de todos los demás scripts -->
<script src="src/assets/js/sp-api-client.js"></script>
```

**Paso 3 — El cliente se auto-inicializa al cargar la página:**

```javascript
// sp-api-client.js hace automáticamente:
// 1. Escanea document.querySelectorAll("[data-asin]")
// 2. Agrupa todos los ASINs únicos
// 3. Una sola llamada GET al endpoint
// 4. Actualiza el DOM:
//    .js-product-price / .pg-price  → precio actual "$8.75"
//    .js-product-price-list         → precio tachado "$14.49"
//    .js-product-savings            → badge "40% off"
//    .js-add-to-cart                → disabled si out of stock
//    .js-prime-badge                → visible si isPrime

// También expone:
window.SPAPIClient.refresh(); // llamada manual para refrescar precios
```

**Páginas con integración activa:**

| Archivo                         | ASINs cubiertos                    |
| ------------------------------- | ---------------------------------- |
| `index.html`                    | Carousel home (30, 60, 20 patches) |
| `sections/PageAllProducts.html` | Carousel completo (4 productos)    |

> **Para agregar un nuevo producto:** solo añadir `data-asin="BXXXXXXXXX"` al
> elemento HTML — el cliente lo detecta y actualiza automáticamente sin cambios
> adicionales en JavaScript.

> **Nota sobre `?action=debug`:** Este endpoint de diagnóstico fue usado durante
> la configuración inicial para verificar las env vars en Netlify. Fue eliminado
> del código una vez confirmadas las variables. No debe re-añadirse en producción.

### 5. Workflow de Despliegue Continuo

**Flujo completo:**

```bash
# 1. Desarrollo local
git checkout -b feature/nueva-funcionalidad

# Hacer cambios en código...
# Probar localmente con:
npm run dev    # Tailwind watch mode
# Abrir index.html en navegador

# 2. Commit y push
git add .
git commit -m "feat: Agregar nueva sección de productos"
git push origin feature/nueva-funcionalidad

# 3. Netlify automáticamente:
#    - Detecta el push
#    - Crea "Deploy Preview" en URL temporal
#    - Muestra link en GitHub PR
#    Ejemplo: https://deploy-preview-123--blissedskin.netlify.app

# 4. Revisar Deploy Preview
# Probar funcionalidades
# Si todo OK → Merge PR a main

# 5. Al hacer merge a main:
git checkout main
git pull origin main
# Netlify automáticamente deploya a producción:
# https://blissedskin.netlify.app
# o dominio custom: https://blissedskin.com
```

### 6. Comandos Útiles

**Build local:**

```bash
# Compilar TailwindCSS
npm run build

# Watch mode (desarrollo)
npm run dev

# Format código con Prettier
npm run format

# Verificar formato
npm run format:check
```

**Debugging SP-API:**

```bash
# Probar función Netlify localmente
netlify dev

# Hacer request a función local
curl http://localhost:8888/.netlify/functions/spapi-proxy?asin=B08N5WRWNW
```

**Logs de Netlify:**

```bash
# Instalar Netlify CLI
npm install netlify-cli -g

# Login
netlify login

# Ver logs de funciones
netlify functions:log spapi-proxy

# Ver logs de deploy
netlify logs
```

### 7. Troubleshooting Común

**Problema: Build falla en Netlify**

```bash
# Verificar que package.json tiene script "build"
{
  "scripts": {
    "build": "tailwindcss -i ./src/input.css -o ./tailwind_theme/tailwind.css --minify"
  }
}

# Verificar versión de Node en netlify.toml
[build.environment]
  NODE_VERSION = "18"
```

**Problema: Función SP-API retorna 401 Unauthorized**

```bash
# 1. Verificar variables de entorno en Netlify
# 2. Regenerar Refresh Token en Amazon Seller Central
# 3. Verificar que credenciales tienen permisos correctos
```

**Problema: CSS de Tailwind no se aplica**

```bash
# Verificar que el path en HTML es correcto:
<link rel="stylesheet" href="/tailwind_theme/tailwind.css">

# Verificar que Netlify deployó el archivo:
# https://blissedskin.netlify.app/tailwind_theme/tailwind.css
# Debe retornar CSS, no 404
```

### 8. Recursos y Documentación

**Amazon SP-API:**

- [Documentación Oficial](https://developer-docs.amazon.com/sp-api/)
- [GitHub - Ejemplos](https://github.com/amzn/selling-partner-api-models)
- [Guía de Autenticación LWA](https://developer-docs.amazon.com/sp-api/docs/connecting-to-the-selling-partner-api)

**Netlify:**

- [Documentación de Functions](https://docs.netlify.com/functions/overview/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/)
- [Deploy Previews](https://docs.netlify.com/site-deploys/deploy-previews/)

**Proyecto Específico:**

- Ver `docs/GUIA_COMPLETA_SP_API_NETLIFY.md` para detalles completos de integración
- Ver scripts en `test-spapi.js` y `test-spapi-simple.js` para ejemplos de uso

---

## 📚 RECURSOS ADICIONALES

### Herramientas de Desarrollo

- **Tailwind CSS Documentation**: https://tailwindcss.com/docs
- **Pinegrow Web Editor**: https://pinegrow.com
- **Figma**: https://figma.com
- **GitHub Copilot**: https://github.com/features/copilot

### Herramientas de Optimización

- **PageSpeed Insights**: https://pagespeed.web.dev (rendimiento web)
- **GTmetrix**: https://gtmetrix.com (velocidad y optimización)
- **TinyPNG**: https://tinypng.com (compresión de imágenes)
- **Squoosh**: https://squoosh.app (conversión WebP)

### Recursos de Netlify

- **Netlify Documentation**: https://docs.netlify.com
- **Netlify Functions**: https://docs.netlify.com/functions/overview/
- **Environment Variables**: https://docs.netlify.com/environment-variables/overview/
- **Deploy Previews**: https://docs.netlify.com/site-deploys/deploy-previews/

### Amazon SP-API

- **SP-API Documentation**: https://developer-docs.amazon.com/sp-api/
- **GitHub Examples**: https://github.com/amzn/selling-partner-api-models
- **LWA Authentication**: https://developer-docs.amazon.com/sp-api/docs/connecting-to-the-selling-partner-api

### Documentación del Proyecto

- `docs/README.md` - Este archivo (documentación general)
- `docs/VALIDATION_CHECKLIST-Pine.md` - Checklist de validación pre-deploy
- `docs/COMPONENTS.md` - Documentación detallada de componentes
- `docs/PROMPTS.md` - Prompts útiles para IA
- `docs/GUIA_COMPLETA_SP_API_NETLIFY.md` - Guía completa de integración SP-API
- `STYLEGUIDE.md` - Guía de estilos y design system
- `blog/_post-production/sistema-contenedores-editorial.md` - Sistema de producción de blog

---

## ⚠️ CHECKLIST POST-EDICIÓN: VALIDACIÓN AUTOMÁTICA OBLIGATORIA

Antes de hacer commit y push, ejecutar:

```bash
# 1. Formatear código
npm run format

# 2. Verificar formato
npm run format:check

# 3. Build de Tailwind
npm run build

# 4. Validar HTML (si tienes validator instalado)
# npm run validate:html

# 5. Commit con mensaje descriptivo
git add .
git commit -m "feat: Descripción del cambio"

# 6. Push (trigger deploy en Netlify)
git push origin main
```

### Validación Manual (con Pinegrow)

- [ ] Abrir archivo modificado en Pinegrow
- [ ] No hay erroresमोstrádos en panel de errores
- [ ] Elementos son seleccionables en vista visual
- [ ] Preview muestra diseño correcto
- [ ] Responsive funciona en mobile/tablet/desktop

### Validación de Componentes

- [ ] `data-component` coincide con nombre registrado
- [ ] Script de componente cargado en orden correcto (después de `components-init.js`)
- [ ] Estilos CSS scoped con `[data-component="nombre"]`
- [ ] No hay IDs duplicados
- [ ] Event listeners usan scope del componente, no globales

---

## 🎯 Design Tokens (Sistema de Colores)

```css
/* Principales */
--blissed-gray: #3c3c3c /* Texto principal, botones */ --blissed-olive: #9fb686
  /* Acentos, hover states */ --blissed-lavender: #d1a3d9 /* Detalles, bordes */ /* Gradientes */
  --purple-gradient: linear-gradient(to right, #a63d97, #d39ecb)
  --green-gradient: linear-gradient(to right, #eef9e3, #e1e4de) /* Productos */
  --product-primary: #155dfc → #9810fa (gradiente azul-morado) --star-rating: #fe9a00 (naranja)
  --highlight: #fef3c6 (amarillo claro);
```

---

## 🤝 Contribución y Mantenimiento

### Cuando agregues nuevas funcionalidades:

1. Mantener la arquitectura de componentes

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

### 3. **Git + Webhooks Automáticos con Netlify**

#### ✅ Sistema Actual de Despliegue

Este proyecto utiliza **Netlify** como plataforma de hosting, eliminando la necesidad de administrar servidores, CPU, RAM o almacenamiento. El despliegue es completamente automático mediante integración Git nativa.

**Flujo de deploy (git push → live en ~30 seg):**

```bash
# 1. Editar en Pinegrow o VS Code
# 2. Guardar cambios
# 3. Deploy automático:
git add .
git commit -m "Update: descripción del cambio"
git push origin main
# ✅ Netlify detecta el push → ejecuta npm run build → live en producción
```

**Ventajas sobre hosting tradicional:**

- **Sin administración de servidor**: No hay CPU/RAM/almacenamiento que gestionar — Netlify se encarga de todo
- **Deploy automático en ~30 seg**: Cada `git push` a `main` actualiza el sitio en producción
- **SSL automático**: Let's Encrypt incluido, renovación automática sin intervención
- **CDN global**: Assets servidos desde edge nodes en todo el mundo
- **Rollback con un clic**: Cada deploy queda guardado en el historial de Netlify
- **Preview Deploys**: Cada Pull Request genera una URL de preview automática
- **Funciones serverless**: Netlify Functions para SP-API sin gestionar backend propio
- **Variables de entorno seguras**: Credenciales configuradas en Netlify UI, nunca en código

**Configuración activa (`netlify.toml`):**

```toml
[build]
  command = "npm run build"
  publish = "."

[build.environment]
  NODE_VERSION = "18"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"

[[redirects]]
  from = "/api/*"
  to = "/.netlify/functions/:splat"
  status = 200
```

> **Ver sección "🚀 PROCESO DE DESPLIEGUE"** para la guía completa de configuración de
> Netlify, variables de entorno SP-API y verificación en producción.

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

| Criterio                          | Prioridad       | Proveedor A | Proveedor B | Proveedor C |
| --------------------------------- | --------------- | ----------- | ----------- | ----------- |
| **REQUISITOS OBLIGATORIOS**       |                 |             |             |             |
| Acceso SSH completo               | 🔴 Crítico      | ✅/❌       | ✅/❌       | ✅/❌       |
| Control de configuración servidor | 🔴 Crítico      | ✅/❌       | ✅/❌       | ✅/❌       |
| Multi-dominio/Multi-sitio         | 🔴 Crítico      | # Límite    | # Límite    | # Límite    |
| Aislamiento de clientes           | 🔴 Crítico      | Método      | Método      | Método      |
| vCPU cores                        | 🔴 Crítico      | # cores     | # cores     | # cores     |
| RAM                               | 🔴 Crítico      | # GB        | # GB        | # GB        |
| Almacenamiento SSD                | 🔴 Crítico      | # GB        | # GB        | # GB        |
| Ancho de banda                    | 🔴 Crítico      | # TB o ∞    | # TB o ∞    | # TB o ∞    |
| SSL Let's Encrypt gratuito        | 🔴 Crítico      | ✅/❌       | ✅/❌       | ✅/❌       |
| Firewall / WAF                    | 🔴 Crítico      | Tipo        | Tipo        | Tipo        |
| Backups automáticos               | 🔴 Crítico      | Frecuencia  | Frecuencia  | Frecuencia  |
| Actualizaciones seguridad auto    | 🔴 Crítico      | ✅/❌       | ✅/❌       | ✅/❌       |
| Soporte 24/7                      | 🔴 Crítico      | ✅/❌       | ✅/❌       | ✅/❌       |
| Soporte en español                | 🔴 Crítico      | ✅/❌       | ✅/❌       | ✅/❌       |
| **REQUISITOS RECOMENDADOS**       |                 |             |             |             |
| Panel de control (cPanel/Plesk)   | 🟡 Importante   | Tipo        | Tipo        | Tipo        |
| CDN integrado                     | 🟡 Importante   | ✅/❌       | ✅/❌       | ✅/❌       |
| Redis/Memcached                   | 🟡 Importante   | ✅/❌       | ✅/❌       | ✅/❌       |
| HTTP/2 o HTTP/3                   | 🟡 Importante   | ✅/❌       | ✅/❌       | ✅/❌       |
| Git integration                   | 🟢 Nice to have | ✅/❌       | ✅/❌       | ✅/❌       |
| Staging environments              | 🟢 Nice to have | ✅/❌       | ✅/❌       | ✅/❌       |
| API/CLI                           | 🟢 Nice to have | ✅/❌       | ✅/❌       | ✅/❌       |
| **COSTOS**                        |                 |             |             |             |
| Precio mensual (anual)            | -               | $XX/mes     | $XX/mes     | $XX/mes     |
| Setup fee                         | -               | $XX         | $XX         | $XX         |
| Costo por sitio adicional         | -               | $XX         | $XX         | $XX         |
| Costo de panel control            | -               | $XX/mes     | $XX/mes     | $XX/mes     |
| Costo backups adicionales         | -               | $XX/mes     | $XX/mes     | $XX/mes     |
| **TOTAL ESTIMADO (10 sitios)**    | -               | $XX/mes     | $XX/mes     | $XX/mes     |

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

| Modalidad                         | Mejor Para                               | Ventajas                                | Desventajas                              | Costo Aproximado |
| --------------------------------- | ---------------------------------------- | --------------------------------------- | ---------------------------------------- | ---------------- |
| **Shared Hosting**                | 1-3 sitios pequeños                      | Económico, fácil setup                  | Sin control servidor, recursos limitados | $5-15/mes        |
| **VPS Administrado**              | 5-20 sitios, agencia pequeña             | Balance costo/control, soporte incluido | Menos flexible que VPS no administrado   | $30-80/mes       |
| **VPS No Administrado**           | Agencia con conocimientos técnicos       | Control total, mejor precio/rendimiento | Requiere mantenimiento manual            | $15-50/mes       |
| **Cloud VPS** (AWS, DigitalOcean) | Escalabilidad extrema, 20+ sitios        | Pago por uso, máxima flexibilidad       | Complejidad técnica, costos variables    | $20-200/mes      |
| **Servidor Dedicado**             | 50+ sitios, alto tráfico                 | Recursos exclusivos, máximo control     | Alto costo, requiere expertise           | $100-500/mes     |
| **Hosting Reseller**              | Agencias que facturan hosting a clientes | Marca blanca, cuentas independientes    | Menos control técnico                    | $25-100/mes      |

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

#### **Opción 1: SFTP/FTP Manual** ⚠️ _No Recomendado para Agencias_

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

#### **Opción 2: Git + Deploy Manual** ✅ _Recomendado para Equipos Pequeños_

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

#### **Opción 3: Git + Webhooks Automáticos** 🌟 _Ideal para Agencias Profesionales_

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

#### **Opción 4: CI/CD Completo (GitHub Actions)** 🚀 _Nivel Profesional Avanzado_

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
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"

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
   ✅ BIEN: class="text-white font-bold" ❌ MAL: class="text-white font-bold (sin cerrar comillas)
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

> 📋 Para ejecutar la validación completa de HTML antes de abrir en Pinegrow, consultar
> el archivo especializado: **[`docs/VALIDATION_CHECKLIST-Pine.md`](VALIDATION_CHECKLIST-Pine.md)**

---

## 🎯 Design Tokens (Sistema de Colores)

```css
/* Principales */
--blissed-gray: #3c3c3c /* Texto principal, botones */ --blissed-olive: #9fb686
  /* Acentos, hover states */ --blissed-lavender: #d1a3d9 /* Detalles, bordes */ /* Gradientes */
  --purple-gradient: linear-gradient(to right, #a63d97, #d39ecb)
  --green-gradient: linear-gradient(to right, #eef9e3, #e1e4de) /* Productos */
  --product-primary: #155dfc → #9810fa (gradiente azul-morado) --star-rating: #fe9a00 (naranja)
  --highlight: #fef3c6 (amarillo claro);
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

**Última actualización**: Febrero 2026
