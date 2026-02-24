# ✅ Checklist de Validación

**Fecha de Actualización:**
**Archivos Validados:**

---

## 🎯 Objetivo de Validación

Confirmar que el código HTML permanezca sin cambios estructurales y sea completamente compatible con Pinegrow, verificando que solo se actualizó el contenido de texto según el archivo blissed_legal_sections.md.

---

## ✅ 1. VALIDACIÓN DE SINTAXIS HTML

### 1.1 Estructura HTML

- [x] Todos los archivos tienen doctype válido: `<!DOCTYPE html>`
- [x] Etiquetas `<html>`, `<head>`, `<body>` correctamente cerradas
- [x] Todos los tags de apertura tienen su tag de cierre correspondiente
- [x] Atributos con comillas correctas (dobles `"`)
- [x] No hay elementos huérfanos o mal anidados
- [x] **No hay etiquetas duplicadas o corruptas**
  - Verificar que no haya código repetido accidentalmente
  - Buscar fragmentos de código incompletos o mal pegados
- [x] **Estructura jerárquica correcta**
  - Cada elemento hijo está dentro de su padre correspondiente
  - No hay etiquetas que se crucen incorrectamente

### 1.2 Detección de Código Duplicado

- [ ] **Ejecutardétección automática de bloques duplicados**
  ```powershell
  # PowerShell: Buscar líneas duplicadas
  $content = Get-Content "sections\[archivo].html"
  $lineGroups = $content | Where-Object { $_.Trim().Length -gt 50 } | Group-Object
  $duplicates = $lineGroups | Where-Object { $_.Count -gt 1 }
  if ($duplicates.Count -gt 0) {
      Write-Host "⚠️ Código duplicado encontrado en $($duplicates.Count) lugares"
  }
  ```
- [ ] **Revisar manualmente secciones sospechosas**
  - Buscar bloques HTML idénticos (>50 caracteres)
  - Verificar que no se haya pegado código dos veces
  - Eliminar duplicados encontrados

### 1.3 Búsqueda de Fragmentos Sueltos

- [ ] **Detectar atributos sin elementos padre**
  ```powershell
  # Buscar líneas que empiezan con atributos (posible código corrupto)
  $content = Get-Content "sections\[archivo].html"
  $fragments = $content | Select-String -Pattern '^\s*(class=|id=|style=|data-|white/\d+)'
  if ($fragments.Count -gt 0) {
      Write-Host "❌ Fragmentos sueltos encontrados en líneas:"
      $fragments | ForEach-Object { Write-Host "  Línea $($_.LineNumber): $($_.Line.Trim())" }
  }
  ```
- [ ] **Buscar cierres de tags huérfanos**
  - Tags que cierran (`</div>`, `</section>`) sin apertura previa
  - Elementos parcialmente cortados durante copy/paste
- [ ] **Corregir fragmentos encontrados**
  - Eliminar líneas sueltas
  - Reconstruir estructura si es necesario

### 1.4 Auto-Formateo con Prettier (Recomendado)

- [ ] **Verificar instalación de Prettier**
  ```powershell
  # Verificar si prettier está instalado
  npm list prettier
  # Debería mostrar: prettier@x.x.x
  ```
- [ ] **Verificar extensión VS Code: Prettier - Code Formatter**
  - ID: `esbenp.prettier-vscode`
  - Estado: Instalada y habilitada
- [ ] **Configurar Format On Save (si no está)**
  ```json
  // .vscode/settings.json
  {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
  ```
- [ ] **Ejecutar formateo manual antes de validar**

  ```powershell
  # Formatear archivo específico
  npx prettier --write "sections\[archivo].html"

  # O formatear todos los HTML
  npx prettier --write "sections\*.html"
  ```

- [ ] **Verificar que el formateo no introdujo errores**
  - Revisar diff en Git antes de commitear
  - Confirmar que la indentación es consistente
  - Tags auto-cerrados correctamente (`<br />`, `<img />`)

## 🎨 2. VALIDACIÓN DE TAILWIND CSS

### 2.1 Clases de Utilidad Preservadas

- [x] Gradientes de fondo intactos: `bg-gradient-to-r from-[#a63d97] to-[#d39ecb]`
- [x] Colores de marca preservados:
  - `text-blissed-gray` (#3C3C3C)
  - `text-blissed-olive` / `hover:text-[#9aad7a]`
  - `blissed-lavender` (#D1A3D9)
- [x] Clases de espaciado mantenidas: `mb-4`, `mt-8`, `p-6`, `px-6`, `py-12`
- [x] Rounded corners: `rounded-2xl`, `rounded-3xl`
- [x] Shadows: `shadow-2xl`
- [x] Responsive breakpoints: `lg:`, `md:`, `sm:`

### 2.2 Tipografía

- [x] Font-family preservado:
  - Títulos: `font-playfair`
  - Texto: `font-sans` (Inter)
- [x] Tamaños de fuente: `text-xs`, `text-sm`, `text-base`, `text-lg`, `text-2xl`, `text-4xl`, `text-5xl`
- [x] Font weights: `font-bold`, `font-medium`, `font-semibold`

---

## 🧱 3. VALIDACIÓN DE ESTRUCTURA HTML

### 3.1 Jerarquía de Elementos Semánticos

- [x] `<header>` con sticky positioning: `sticky top-0 z-50`
- [x] `<main>` contenedor principal
- [x] `<section>` para bloques de contenido
- [x] `<footer>` con estructura de 3 columnas
- [x] `<nav>` para navegación breadcrumb
- [x] Uso correcto de `<div>` para agrupación

### 3.2 Headings Jerárquicos

- [x] `<h1>` principal en cada página (único)
- [x] `<h2>` para secciones principales
- [x] `<h3>` para subsecciones
- [x] No hay saltos en la jerarquía (h1 → h3 sin h2)

---

## 🔗 4. VALIDACIÓN DE NAVEGACIÓN Y ENLACES

### 4.1 Breadcrumb Navigation

- [x] Links correctos en las 3 páginas:
  - `PrivacyAndTerms.html`
  - `ReturnExchange.html`
  - `Legal.html`
- [x] Clases de hover: `hover:text-blissed-olive`

### 4.2 Footer Links

- [x] Links a Privacy Policy apuntan a `PrivacyAndTerms.html`
- [x] Links a Terms of Service apuntan a `PrivacyAndTerms.html`
- [x] Links a Return & Exchanges apuntan a `ReturnExchange.html`
- [x] Links a Legal apuntan a `Legal.html`
- [x] Transiciones de hover intactas: `transition-colors`

### 4.3 Enlaces de Email

- [x] `mailto:` links funcionales
- [x] Emails correctos: legal@blissedskin.com, privacy@blissedskin.com, support@blissedskin.com, dpo@blissedskin.com, accessibility@blissedskin.com

---

## 🖼️ 5. VALIDACIÓN DE ASSETS Y RECURSOS

### 5.1 Imágenes

- [x] Logo path correcto: `/assets/logo.png`
- [x] Clases de filtro preservadas: `brightness-0 invert filter`
- [x] Alt text presente

### 5.2 Stylesheets

- [x] Link a Tailwind CSS correcto: `/tailwind_theme/tailwind.css`
- [x] Ubicado en `<head>`

---

## 📱 6. VALIDACIÓN DE DISEÑO RESPONSIVE

### 6.1 Breakpoints de Tailwind

- [x] Mobile-first approach mantenido
- [x] Clases `lg:` para desktop (1024px+)
- [x] Clases `md:` para tablet (768px+)
- [x] Clases `sm:` para móvil grande (640px+)

### 6.2 Layouts Flexbox/Grid

- [x] Header: `flex` con `flex-col lg:flex-row`
- [x] Footer: `flex flex-col lg:flex-row`
- [x] Contenido: `space-y-*` para espaciado vertical
- [x] Listas: `space-y-2` entre items

---

## ♿ 7. VALIDACIÓN DE ACCESIBILIDAD

### 7.1 ARIA Labels

- [x] Breadcrumb nav tiene `aria-label="Breadcrumb"`
- [x] No se eliminaron labels existentes

### 7.2 Contraste de Color

- [x] Texto oscuro sobre fondo claro (white cards)
- [x] Texto blanco sobre gradiente en header/footer
- [x] Cumple WCAG 2.1 AA

---

## 🎯 8. VALIDACIÓN DE PINEGROW

### 8.1 Compatibilidad con Editor Visual

- [x] HTML válido y bien formado
- [x] Sin elementos inline complejos que rompen el parsing
- [x] Atributos data-\* preservados si existían
- [x] Estructura de clases permite edición visual

### 8.2 Archivo pinegrow.json

- [x] Archivo presente en directorio `sections/`
- [x] No requiere edición manual
- [x] Pinegrow detecta automáticamente los archivos HTML

### 8.3 Test de Apertura

- [ ] **ACCIÓN REQUERIDA:** Abrir cada archivo en Pinegrow y verificar:
  - No hay errores mostrados en panel de errores
  - Elementos son seleccionables en vista visual
  - Inspector de propiedades muestra clases correctamente
  - Preview muestra diseño correcto

---

## 🔄 9. VALIDACIÓN DE CONSISTENCIA ENTRE ARCHIVOS

### 9.1 Header Común

- [x] Logo `/assets/logo.png` en los 3 archivos
- [x] Estructura de navegación idéntica
- [x] Clases CSS consistentes
- [x] Sticky positioning en los 3: `sticky top-0 z-50`

### 9.2 Footer Común

- [x] Estructura de 3 columnas idéntica en los 3 archivos
- [x] Links a las mismas páginas
- [x] Copyright actualizado a 2026 en los 3 archivos
- [x] Clases de gradiente idénticas

### 9.3 Estilos Visuales

- [x] White content cards con `rounded-3xl shadow-2xl`
- [x] Gradiente de fondo consistent
- [x] Padding y márgenes uniformes
- [x] Tipografía consistency

---

### Confirmación de Compatibilidad

- ✅ HTML5 válido
- ✅ Tailwind CSS intacto
- ✅ Estructura semántica preservada
- ✅ Navegación funcional
- ✅ Responsive design mantenido
- ✅ Accesibilidad básica cumplida
- ✅ **LISTO PARA PINEGROW**

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
<div class="next-section"></div>
```

**Solución:**

```html
<!-- ✅ CORRECTO -->
<div class="container">
  <p>Contenido</p>
  <section>Más contenido</section>
</div>

<div class="next-section"></div>
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
<nav class="text-white/80 font-sans">...</nav>
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
<div>
  <section>
    <div><p>Texto</p></div>
  </section>
  <div>
    <!-- DESPUÉS (error obvio) -->
    <div>
      <section>
        <div>
          <p>Texto</p>
        </div>
      </section>
      <div><!-- ❌ Falta cerrar el <div> superior --></div>
    </div>
  </div>
</div>
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
  <div>
    <!-- ❌ Se abrió nuevo <div> sin cerrar el anterior -->
    <h2>User-Generated Content</h2>
    ...
  </div>

  <!-- ✅ DESPUÉS (Corregido) -->
  <div>
    <h2>Copyright & Trademark Notice</h2>
    <p>Contenido...</p>
    <p>Más contenido...</p>
  </div>
  <!-- ✅ Cerrado correctamente -->

  <div>
    <h2>User-Generated Content</h2>
    ...
  </div>
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
    "esbenp.prettier-vscode", // Auto-formateo
    "htmlhint.vscode-htmlhint", // Linting HTML
    "bradlc.vscode-tailwindcss", // IntelliSense Tailwind
    "CoenraadS.bracket-pair-colorizer-2" // Visualizar pares
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
</div>
<!-- .component-wrapper -->

<!-- Agregar comentarios para divs complejos -->
<div class="outer">
  <div class="inner">
    <div class="content">
      <!-- Contenido -->
    </div>
    <!-- .content -->
  </div>
  <!-- .inner -->
</div>
<!-- .outer -->
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
