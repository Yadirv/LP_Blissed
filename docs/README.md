# Blissed Skin - Landing Page Project

## 📋 Descripción General

Este proyecto es una landing page de e-commerce para **Blissed Skin**, desarrollada mediante un flujo de trabajo moderno que integra diseño en Figma, generación de código con IA, y edición visual con Pinegrow. El proyecto utiliza **TailwindCSS** para estilos y una arquitectura de **Smart Components** con JavaScript modular.

---

## 📑 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Configuración Inicial Recomendada](#configuración-inicial-recomendada)
- [Flujo de Trabajo del Proyecto](#flujo-de-trabajo-del-proyecto)
- [Arquitectura del Proyecto](#arquitectura-del-proyecto)
- [Sistema de Smart Components](#sistema-de-smart-components)
- [Sistema de Estilos](#sistema-de-estilos)
- [Carga de Scripts en HTML](#carga-de-scripts-en-html)
- [Guía para Agentes IA](#guía-para-agentes-ia)
- [Flujo de Desarrollo Típico](#flujo-de-desarrollo-típico)
- [Proceso de Despliegue](#proceso-de-despliegue)
  - [1. GitHub Pages (Deprecated)](#1-configuración-inicial-de-github-pages-fase-1---deprecated)
  - [2. Amazon SP-API](#2-configuración-de-amazon-sp-api-selling-partner-api)
  - [3. Netlify (Despliegue Actual)](#3-configuración-de-netlify-despliegue-actual)
  - [4. Verificación en Producción](#4-verificación-de-deploy-en-producción-)
  - [4.1 Variables de Entorno](#41-variables-de-entorno--configuración-correcta-en-netlify)
  - [4.2 Datos Disponibles por SP-API](#42-datos-disponibles-por-sp-api)
  - [4.3 Test del Endpoint](#43-test-del-endpoint-con-datos-reales)
  - [4.4 Conectar con el Frontend](#44-conectar-el-endpoint-con-el-frontend)
  - [4.5 Netlify Forms](#45-netlify-forms-newsletter--formularios)
  - [4.6 Pagefind — Búsqueda del Sitio](#46-pagefind--búsqueda-del-sitio)
  - [5. Workflow de Despliegue Continuo](#5-workflow-de-despliegue-continuo)
  - [6. Comandos Útiles](#6-comandos-útiles)
  - [7. Troubleshooting Común](#7-troubleshooting-común)
  - [8. Recursos y Documentación](#8-recursos-y-documentación)
- [Recursos Adicionales](#recursos-adicionales)
- [Checklist Post-Edición](#checklist-post-edición-validación-automática-obligatoria)
- [Design Tokens](#design-tokens-sistema-de-colores)
- [Git + Webhooks con Netlify](#git--webhooks-automáticos-con-netlify)
- [Notas Importantes](#notas-importantes)
- [Contribución y Mantenimiento](#contribución-y-mantenimiento)
- [Contacto y Recursos](#contacto-y-recursos)

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

---

### 4.5 Netlify Forms — Newsletter & Formularios

Netlify Forms permite capturar envíos de formularios HTML **sin backend propio**. Netlify los detecta automáticamente en tiempo de build, almacena las respuestas en su dashboard y puede enviar notificaciones por email o webhook.

#### ¿Por qué usarlo en este proyecto?

- El footer de todas las páginas incluye un formulario de suscripción al newsletter
- No requiere función serverless adicional ni servicio externo de email
- Las respuestas quedan en `app.netlify.com → Forms` con historial y exportación CSV
- Compatible con envío AJAX (sin redirección)

---

#### Paso 1 — Agregar atributos Netlify al `<form>`

Netlify detecta formularios en el HTML estático durante el build. **Requisitos mínimos:**

```html
<!-- Footer newsletter form -->
<form
  name="newsletter"
  method="POST"
  data-netlify="true"
  data-netlify-honeypot="bot-field"
  id="newsletter-form"
  class="..."
>
  <!-- Campo honeypot oculto (anti-spam automático) -->
  <input type="hidden" name="form-name" value="newsletter" />
  <p class="hidden">
    <label>No llenar: <input name="bot-field" /></label>
  </p>

  <input type="text" name="firstName" placeholder="First Name" required />
  <input type="email" name="email" placeholder="Email Address" required />
  <button type="submit">Subscribe</button>
</form>
```

**Atributos clave:**

| Atributo                    | Valor          | Descripción                                               |
| --------------------------- | -------------- | --------------------------------------------------------- |
| `name`                      | `"newsletter"` | Nombre del formulario en Netlify Dashboard                |
| `method`                    | `"POST"`       | Método obligatorio                                        |
| `data-netlify`              | `"true"`       | Activa la detección de Netlify Forms                      |
| `data-netlify-honeypot`     | `"bot-field"`  | Campo trampa para bots (anti-spam)                        |
| `name="form-name"` (hidden) | `"newsletter"` | **Obligatorio para AJAX** — identifica el form en el POST |

> **⚠️ IMPORTANTE:** El campo oculto `<input type="hidden" name="form-name" value="newsletter" />` es obligatorio cuando se envía el formulario via `fetch()`. Sin él, Netlify rechaza el envío con 404.

---

#### Paso 2 — Envío AJAX sin redirección

El footer usa JavaScript para enviar sin recargar la página y mostrar mensajes de éxito/error inline:

```javascript
// src/components/main-footer/main-footer.js
window.ComponentLoader.registerComponent("main-footer", (root) => {
  const form = root.querySelector("#newsletter-form");
  const successMsg = root.querySelector("#subscribe-success");
  const errorMsg = root.querySelector("#subscribe-error");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Serializar campos del formulario
    const formData = new FormData(form);

    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (res.ok) {
        form.reset();
        successMsg?.classList.remove("hidden");
        errorMsg?.classList.add("hidden");
      } else {
        throw new Error(`HTTP ${res.status}`);
      }
    } catch (err) {
      console.error("[Newsletter] Submit error:", err);
      errorMsg?.classList.remove("hidden");
      successMsg?.classList.add("hidden");
    }
  });
});
```

> **Nota:** El endpoint del POST es `"/"` (la raíz del sitio), no una URL de función. Netlify intercepta internamente cualquier POST a una página que contenga el formulario con `data-netlify="true"`.

---

#### Paso 3 — Páginas con formulario (detección en build)

Netlify escanea el HTML estático en build para registrar formularios. Como el footer está **incrustado en cada página individualmente** (sin iframes ni carga dinámica), Netlify lo detecta automáticamente en cada deploy.

Páginas con formulario newsletter activo:

| Archivo                                    | Form name    |
| ------------------------------------------ | ------------ |
| `index.html`                               | `newsletter` |
| `blog/index.html`                          | `newsletter` |
| `sections/PageAllProducts.html`            | `newsletter` |
| `blog/_post-production/template-blog.html` | `newsletter` |
| `blog/posts/2026/02/*.html` (4 posts)      | `newsletter` |

> Si en el futuro se carga el footer dinámicamente (p. ej. via `fetch` + `innerHTML`), Netlify **no lo detectará** en build. En ese caso se debe agregar un formulario HTML estático oculto en el `<body>` de cada página como referencia de detección.

---

#### Paso 4 — Configurar notificaciones en Netlify Dashboard

1. Ir a `app.netlify.com` → sitio `blissed-skin-lp` → **Forms**
2. Confirmar que el formulario `newsletter` aparece listado (aparece tras el primer deploy exitoso)
3. Click en **Form notifications** → **Add notification**
4. Opciones disponibles:

| Tipo                   | Cuándo usarlo                                   |
| ---------------------- | ----------------------------------------------- |
| **Email notification** | Recibir un email por cada suscriptor nuevo      |
| **Slack notification** | Alertas al canal de marketing                   |
| **Webhook (POST)**     | Conectar con Mailchimp, ConvertKit, Loops, etc. |

**Configuración típica para email:**

```
Notification type: Email
Email to notify: hola@blissedskin.us
Subject: New newsletter subscriber
Form: newsletter
```

**Webhook hacia Loops.so (email marketing recomendado):**

```
Notification type: Outgoing webhook
Method: POST
URL: https://app.loops.so/api/v1/contacts/create  (o el endpoint de tu ESP)
Headers: Authorization: Bearer <LOOPS_API_KEY>
```

> Las API keys de servicios externos **no se configuran en Netlify Forms** — se gestionan en el webhook del dashboard o en una Netlify Function separada si se requiere lógica adicional (doble opt-in, segmentación, etc.).

---

#### Paso 5 — Spam protection

Netlify Forms incluye dos capas de protección anti-spam:

**1. Honeypot field** (ya configurado en el HTML):

- Campo `bot-field` invisible para humanos pero visible para bots
- Si un bot lo rellena, Netlify descarta el envío silenciosamente
- **No requiere aprobación del usuario** → mejor UX que reCAPTCHA

**2. Netlify reCAPTCHA v2** (opcional, solo si el honeypot no es suficiente):

```html
<!-- Agregar al form si se detecta spam masivo -->
<div data-netlify-recaptcha="true"></div>
```

> Activar reCAPTCHA v2 requiere que el usuario resuelva un challenge visual. Usar solo como último recurso: el honeypot es transparente y más amigable para conversiones.

---

#### Verificar que funciona

```powershell
# 1. Tras deploy, enviar un submit de prueba desde el sitio en producción
# 2. Verificar en:
#    app.netlify.com → blissed-skin-lp → Forms → newsletter → Verified submissions

# 3. Verificar que el email de notificación se recibió

# Si el submit retorna 404:
#   - Revisar que form-name hidden input existe y su value coincide con el atributo name del form
#   - Confirmar que data-netlify="true" está presente
#   - Re-deploy (Netlify escanea en build, no en runtime)
```

---

### 4.6 Pagefind — Búsqueda del Sitio

Pagefind es una librería de búsqueda **100% estática** que indexa el sitio en build time y sirve los resultados desde archivos comprimidos sin necesidad de servidor ni API externa. Se integra nativamente con el build de Netlify.

#### ¿Por qué Pagefind sobre Fuse.js?

|               | Pagefind                                   | Fuse.js                            |
| ------------- | ------------------------------------------ | ---------------------------------- |
| Cobertura     | Todo el sitio (blog, productos, secciones) | Solo JSON pre-cargado (solo blog)  |
| Indexación    | Automática en cada build                   | Manual al agregar posts            |
| Búsqueda      | Índice comprimido en disco (~50KB)         | Carga todo en memoria              |
| Mantenimiento | Cero — corre con `npm run build`           | Requiere mantener JSON actualizado |

---

#### Arquitectura implementada

```
npm run build
  ↓
 tailwindcss --minify          → tailwind_theme/tailwind.css
  ↓
 pagefind --site . --output-path ./pagefind
  ↓
  Escanea todos los <*> con data-pagefind-body
  Excluye <*> con data-pagefind-ignore="all" (headers, footers)
  Genera índice en pagefind/  (en .gitignore — se regenera en cada deploy)
```

**Páginas indexadas (al momento del último build):**

| Página                          | Contenido indexado                              |
| ------------------------------- | ----------------------------------------------- |
| `index.html`                    | Hero, sección de productos, How To Use, reseñas |
| `blog/index.html`               | Títulos y excerpts de artículos                 |
| `sections/PageAllProducts.html` | Catálogo completo de productos                  |
| `blog/posts/2026/02/*.html`     | 4 artículos completos (texto + FAQs)            |

> Headers (`data-component="main-header"`) y footers (`data-component="main-footer"`) están marcados con `data-pagefind-ignore="all"` para excluir navegación, newsletter y links legales de los resultados.

---

#### Smart Component `site-search`

El Search Bar del header está implementado como Smart Component siguiendo la misma arquitectura del proyecto.

**Archivos:**

| Archivo                                      | Propósito                             |
| -------------------------------------------- | ------------------------------------- |
| `src/components/site-search/site-search.js`  | Lógica de búsqueda, dropdown, teclado |
| `src/components/site-search/site-search.css` | Estilos del dropdown (scoped)         |

**HTML en el header** (igual en todas las páginas):

```html
<!-- Search Bar — activar el componente con data-component -->
<div
  data-component="site-search"
  class="hidden md:flex items-center bg-white border border-green-400 rounded-[10px] ..."
>
  <img src="assets/search-icon.svg" alt="Search" class="w-[8px] h-[8px]" />
  <input type="text" placeholder="Search" class="..." />
</div>
```

**Carga del script** (al final del `<body>`, después de `components-init.js`):

```html
<script src="src/assets/js/components-init.js"></script>
<!-- ... otros componentes ... -->
<script src="src/components/site-search/site-search.js"></script>
```

> El CSS del componente se **auto-inyecta** — `site-search.js` crea el `<link>` dinámicamente derivando la ruta de su propio `src`. No se necesita un `<link rel="stylesheet">` adicional en el HTML.

**Comportamiento del componente:**

| Evento               | Acción                                      |
| -------------------- | ------------------------------------------- |
| `focus` en input     | Pre-carga el WASM de Pagefind (warm-up)     |
| Escritura (>0 chars) | Búsqueda con debounce de 300ms              |
| ↑ / ↓                | Navega entre resultados                     |
| `Enter`              | Navega al resultado enfocado (o al primero) |
| `Escape`             | Cierra el dropdown                          |
| Click fuera del root | Cierra el dropdown                          |

**Estructura del dropdown de resultados:**

```html
<div class="ss-dropdown is-open">
  <div class="ss-results">
    <a href="/blog/posts/.../post.html" class="ss-result">
      <span class="ss-result__section">Blog</span>
      <!-- meta.section de pagefind -->
      <span class="ss-result__title">Título del post</span>
      <span class="ss-result__excerpt">...extracto con <mark>palabra</mark> destacada...</span>
    </a>
    <!-- hasta 6 resultados -->
  </div>
</div>
```

---

#### Control de secciones con `data-pagefind-filter`

Para limitar búsquedas a una sección específica (p. ej. buscar solo en el blog), añadir el meta atributo en el `<body>` o en `data-pagefind-body`:

```html
<!-- En cada blog post -->
<main data-pagefind-body data-pagefind-filter="section:Blog">
  <!-- En PageAllProducts.html -->
  <main data-pagefind-body data-pagefind-filter="section:Products"></main>
</main>
```

Luego en el componente, filtrar con:

```javascript
const result = await state.pagefind.search(query, {
  filters: { section: "Blog" }, // solo devuelve resultados del blog
});
```

> Esta configuración **no está activa por defecto** — el componente actual busca en todo el sitio. Activar si se añade un buscador contextual (p. ej. un campo de búsqueda dedicado en `blog/index.html`).

---

#### Comandos

```bash
# Regenerar el índice de búsqueda localmente
npm run build
# → Tailwind CSS compilado + índice Pagefind en pagefind/

# Solo Pagefind (sin recompilar Tailwind)
npx pagefind --site . --output-path ./pagefind

# Verificar páginas indexadas y palabras
npx pagefind --site . --output-path ./pagefind --verbose
```

**Netlify:** el build command en `netlify.toml` ya incluye Pagefind. Cada deploy regenera el índice automáticamente — no requiere configuración adicional.

---

#### Troubleshooting

**Buscador no muestra resultados en local (`localhost:xxxx` / abrir HTML como archivo):**

Pagefind carga el índice vía `import()` dinámico desde `/pagefind/pagefind.js` — requiere un servidor HTTP. Usar:

```bash
# Opción 1: VS Code Live Server extension
# Opción 2:
npx serve .
# Luego abrir http://localhost:3000
```

**Página nueva no aparece en resultados:**

1. Verificar que la página tiene `data-pagefind-body` en su `<main>` o elemento contenedor
2. Verificar que NO tiene `data-pagefind-ignore="all"` en el body
3. Correr `npm run build` de nuevo — el índice es estático, no se actualiza al guardar

**Error `Failed to import /pagefind/pagefind.js`:**

- El índice no fue generado — correr `npm run build`
- En desarrollo, el componente captura el error silenciosamente con `console.warn`

---

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

## 🌐 Git + Webhooks Automáticos con Netlify

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
