# Configuración de GitHub Pages - Blissed Skin

## 🚀 Despliegue Actual

**URL del sitio:** https://[tu-usuario].github.io/[nombre-repo]/

Este proyecto está configurado para desplegarse automáticamente en GitHub Pages desde la rama principal.

## 📦 Estructura para GitHub Pages

El proyecto está optimizado para GitHub Pages con:
- ✅ `index.html` en la raíz del repositorio
- ✅ Assets correctamente referenciados (rutas relativas)
- ✅ Archivos de configuración de Pinegrow excluidos del repo (`.gitignore`)
- ✅ TailwindCSS compilado y listo para producción
- ✅ Google Tag Manager (GTM) y Google Analytics 4 (GA4) configurados
- ✅ Arquitectura híbrida: GitHub Pages + Netlify Functions

## 🏗️ Arquitectura del Proyecto

### Despliegue Híbrido

```
┌─────────────────────────────────────────┐
│  GitHub Pages (Frontend)                │
│  https://username.github.io/repo        │
│  • HTML/CSS/JS estático                 │
│  • Productos propios (via PA API)       │
│  • Productos afiliados (Associates)     │
│  • GTM + GA4 tracking                   │
└─────────────┬───────────────────────────┘
              ↓ fetch()
┌─────────────────────────────────────────┐
│  Netlify (Backend Serverless)           │
│  https://app.netlify.com                │
│  • Amazon PA API integration            │
│  • Gestión segura de API keys           │
│  • Rate limiting (1 req/seg)            │
│  • Captura de leads (Mailchimp/Sheets)  │
└─────────────┬───────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  Servicios Externos                     │
│  • Amazon PA API (productos propios)    │
│  • Amazon Associates (productos afil.)  │
│  • Google Tag Manager (tracking)        │
│  • Google Analytics 4 (analytics)       │
│  • Mailchimp/Google Sheets (leads)      │
└─────────────────────────────────────────┘
```

### Flujo de Usuario

```
1. Usuario visita landing (GitHub Pages)
   ↓
2. GTM + GA4 registra PageView
   ↓
3. Frontend carga productos:
   • Propios → Netlify Function → Amazon PA API
   • Afiliados → Links directos Amazon
   ↓
4. Usuario añade al carrito (localStorage)
   ↓
5. GTM registra AddToCart event
   ↓
6. Usuario hace checkout
   ↓
7. Captura email/nombre (Netlify Function → Mailchimp)
   ↓
8. GTM registra InitiateCheckout
   ↓
9. Redirect a Amazon con productos en carrito
   ↓
10. Usuario completa compra en Amazon
```

## 🔧 Configuración de GitHub Pages

### Desde la raíz (Configuración utilizada)
1. Ve a **Settings** → **Pages** en tu repositorio de GitHub
2. En **Source**, selecciona: **Deploy from a branch**
3. En **Branch**, selecciona: `main` + **/ (root)**
4. Guarda los cambios
5. Activa **Enforce HTTPS** ✅

## 🛠️ Scripts de Build

```bash
# Desarrollo (watch mode)
npm run dev

# Build para producción (minificado)
npm run build
```

## 📊 Configuración de Tracking (GTM + GA4)

### Google Tag Manager (GTM)

**Setup en `<head>` de index.html:**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->
```

**Setup en `<body>` (primera línea después de `<body>`):**
```html
<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
```

### Eventos Configurados en GTM

| Evento | Trigger | Descripción |
|--------|---------|-------------|
| `page_view` | All Pages | Vista de página (GA4 automático) |
| `view_item` | Click producto | Ver detalles de producto |
| `add_to_cart` | Click "Add to Cart" | Producto añadido al carrito |
| `begin_checkout` | Click "Checkout" | Inicia proceso de compra |
| `purchase` | Return from Amazon | Compra completada (opcional) |
| `affiliate_click` | Click afiliado | Click en producto afiliado |

### Variables en dataLayer (JavaScript)

```javascript
// Evento: Ver producto
dataLayer.push({
  'event': 'view_item',
  'ecommerce': {
    'items': [{
      'item_id': 'B08XYZ123',
      'item_name': 'Acne Patch 60 Pack',
      'price': 13.99,
      'item_category': 'Skincare',
      'item_brand': 'Blissed Skin'
    }]
  }
});

// Evento: Añadir al carrito
dataLayer.push({
  'event': 'add_to_cart',
  'ecommerce': {
    'items': [{
      'item_id': 'B08XYZ123',
      'item_name': 'Acne Patch 60 Pack',
      'price': 13.99,
      'quantity': 2
    }]
  }
});

// Evento: Iniciar checkout
dataLayer.push({
  'event': 'begin_checkout',
  'ecommerce': {
    'value': 27.98,
    'currency': 'USD',
    'items': [/* array de productos */]
  }
});
```

### Google Analytics 4 (GA4)

**Configuración en GTM:**
1. Crear tag "Google Analytics: GA4 Configuration"
2. Measurement ID: `G-XXXXXXXXXX`
3. Activar Enhanced Measurement
4. Crear triggers para eventos personalizados

**Eventos GA4 implementados:**
- ✅ page_view (automático)
- ✅ scroll (automático con Enhanced)
- ✅ click (outbound links)
- ✅ view_item
- ✅ add_to_cart
- ✅ begin_checkout

## 📋 Checklist Pre-Deploy (Plan de 14 Días)

### 📅 Fase 1: Base y Validación (Día 1-2)

#### Día 1: Setup Inicial
```powershell
# En la terminal de VS Code
npm install
npm run build
```

**Tareas:**
- [ ] Instalar dependencias (`npm install`)
- [ ] Compilar TailwindCSS (`npm run build`)
- [ ] Verificar que `tailwind_theme/tailwind.css` se generó correctamente
- [ ] Verificar todas las rutas de assets son relativas
- [ ] Probar página localmente (abrir `index.html` en navegador)

#### Día 2: Crear Repositorio Git
**En VS Code:**
- [ ] Presionar `Ctrl+Shift+G` (Source Control)
- [ ] Click en "Initialize Repository"
- [ ] Stage todos los archivos (verificar que `.gitignore` funciona)
- [ ] Commit inicial: `"Initial commit: Blissed Skin Landing Page"`
- [ ] Click en "Publish to GitHub"
- [ ] Seleccionar público/privado según preferencia
- [ ] Verificar que repo se creó en GitHub

**En GitHub:**
- [ ] Ir a Settings → Pages
- [ ] Source: "Deploy from a branch"
- [ GitHub Pages

**La página no carga correctamente**
- ✅ Verifica las rutas de los assets (todas relativas)
- ✅ Asegúrate de que `tailwind_theme/tailwind.css` está en el repo
- ✅ Revisa la consola del navegador para errores 404
- ✅ Verifica que GitHub Pages está activado en Settings → Pages

**Los estilos no se aplican (páginas en subcarpetas)**
**Problema común:** Archivos en `sections/`, `components/`, `blog/` no cargan CSS

**Causa:** Rutas absolutas (`/assets/logo.png`) no funcionan en GitHub Pages con subdirectorios

**Solución:**
1. Cambiar de rutas absolutas a rutas relativas:
   ```html
   <!-- ❌ NO funciona en GitHub Pages -->
   <link href="/tailwind_theme/tailwind.css" rel="stylesheet">
   <img src="/assets/logo.png" alt="Logo">
   
   <!-- ✅ SÍ funciona en GitHub Pages -->
   <link href="../tailwind_theme/tailwind.css" rel="stylesheet">
   <img src="../assets/logo.png" alt="Logo">
   ```

2. Regla de rutas relativas según profundidad:
   - Archivo en raíz (`index.html`): `assets/logo.png`
   - Archivo 1 nivel (`sections/Page.html`): `../assets/logo.png`
   - Archivo 2 niveles (`blog/posts/post.html`): `../../assets/logo.png`

3. Script PowerShell para corregir automáticamente:
   ```powershell
   # Corregir todos los archivos HTML en carpetas
   $files = Get-ChildItem -Path . -Recurse -Include "*.html" -Exclude "index.html"
   foreach ($file in $files) {
       $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
       $depth = ($file.FullName -split '\\').Count - (Get-Location).Path.Split('\').Count - 1
       $prefix = if ($depth -eq 1) { "../" } else { "../../" }
       
       $content = $content -replace 'href="/tailwind_theme/', "href=`"$($prefix)tailwind_theme/"
       $content = $content -replace 'src="/assets/', "src=`"$($prefix)assets/"
       $content = $content -replace 'href="/assets/', "href=`"$($prefix)assets/"
       
       Set-Content -Path $file.FullName -Value $content -Encoding UTF8 -NoNewline
   }
   ```

**Los estilos no se aplican (otras causas)**
- ✅ Ejecuta `npm run build` para regenerar el CSS
- ✅ Verifica que `tailwind.config.js` esté correctamente configurado
- ✅ Confirma que los archivos CSS están incluidos en el commit
- ✅ Hard refresh: Ctrl+Shift+R (Windows) o Cmd+Shift+R (Mac)

**Cambios no se reflejan**
- ✅ GitHub Pages tarda 1-2 minutos en actualizar
- ✅ Limpia caché del navegador
- ✅ Verifica que el commit se hizo correctamente
- ✅ Revisa estado del deploy en Settings → Pages

### Google Tag Manager

**GTM no aparece en Preview Mode**
- ✅ Verifica GTM Container ID correcto (formato: `GTM-XXXXXXX`)
- ✅ Snippet en `<head>` Y `<body>` (noscript)
- ✅ Desactiva bloqueadores de anuncios
- ✅ DevTools → Network → Busca `gtm.js` (debe cargar)

**Eventos no se disparan**
- ✅ Verifica que triggers estén configurados
- ✅ Usa GTM Preview Mode para debug
- ✅ Console: `console.log(dataLayer)` para ver eventos
- ✅ Verifica sintaxis de `dataLayer.push()`

### Google Analytics 4

**Eventos no llegan a GA4**
- ✅ Verifica Measurement ID en GTM (formato: `G-XXXXXXXXXX`)
- ✅ Tag GA4 Configuration con trigger "All Pages"
- ✅ Espera 15-30 minutos (eventos no son instantáneos en Reports)
- ✅ Usa GA4 Real-Time para verificar inmediatamente

**E-commerce events no tienen datos**
- ✅ Verifica estructura de `ecommerce` object en dataLayer
- ✅ Campos requeridos: `items` array con `item_id`, `item_name`, `price`
- ✅ En GTM, configura variables de E-commerce
- ✅ Revisa DebugView en GA4

### Netlify Functions

**Función no se encuentra (404)**
- ✅ Verifica carpeta `/netlify/functions/` en raíz
- ✅ Archivo debe exportar `handler`: `exports.handler = async () => {}`
- ✅ Netlify debe estar conectado al repo GitHub
- ✅ Redeploy después de crear función

**Función falla (500)**
- ✅ Revisa logs en Netlify Dashboard → Functions
- ✅ Verifica variables de entorno configuradas
- ✅ Verifica sintaxis JavaScript (async/await)
- ✅ Manejo de errores con try/catch

**Variables de entorno no se leen**
- ✅ Configuradas en Site settings → Environment variables
- ✅ Redeploy después de añadir variables
- ✅ Usar `process.env.VARIABLE_NAME`

### Amazon PA API

**Request falla (403 Forbidden)**
- ✅ Verifica Access Key y Secret Key correctos
- ✅ Verifica región (us-east-1 para USA)
- ✅ Verifica firma de request (aws4)
- ✅ Verifica que cuenta Associates tenga 3+ ventas en 30 días

**Rate limit exceeded**
- ✅ Máximo 1 request/segundo
- ✅ Implementa delay entre requests: `await delay(1100)`
- ✅ Cachea respuestas (localStorage, 24h máx)

**ASINs no retornan datos**
- ✅ Verifica formato ASIN (ej: B08XYZ123)
- ✅ Verifica producto existe y está disponible
- ✅ Verifica marketplace correcto (www.amazon.com)

### Carrito de Compra

**Items no se guardan**
- ✅ Verifica localStorage no esté deshabilitado
- ✅ Verifica sintaxis JSON.stringify/parse
- ✅ Console → Application → Local Storage → Verifica datos

**Redirect a Amazon no funciona**
- ✅ Verifica formato URL: `amazon.com/gp/aws/cart/add.html?ASIN.1=X&Quantity.1=1`
- ✅ Verifica Partner Tag al final de URL
- ✅ No uses `https://` (Amazon redirige automáticamente)

---

## 📚 Recursos Útiles

### Documentación Oficial
- [GitHub Pages](https://docs.github.com/en/pages)
- [Netlify Functions](https://docs.netlify.com/functions/overview/)
- [Google Tag Manager](https://support.google.com/tagmanager)
- [GA4 E-commerce](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)
- [Amazon PA API v5](https://webservices.amazon.com/paapi5/documentation/)
- [Amazon Associates](https://affiliate-program.amazon.com/)

### Herramientas de Testing
- [GTM Preview Mode](https://tagmanager.google.com) - Debug de tags
- [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-legacy-by-g/kejbdjndbnbjgmefkgdddjlbokphdefk) - Extensión Chrome
- [GA4 DebugView](https://analytics.google.com) - Real-time events
- [Google PageSpeed Insights](https://pagespeed.web.dev/) - Performance

---

## 💰 Costos Estimados

| Servicio | Costo Mensual | Notas |
|----------|--------------|-------|
| GitHub Pages | $0 | Hosting estático ilimitado |
| Netlify Free Tier | $0 | 100GB bandwidth, 125k Functions |
| Amazon PA API | $0 | Requiere 3+ ventas/30 días |
| Amazon Associates | $0 | Solo comisiones (4-10%) |
| GTM + GA4 | $0 | Tracking gratis |
| Dominio | ~$12/año | Opcional (namecheap, godaddy) |
| **TOTAL** | **$0-1/mes** | 🎉 |

---

**Última actualización:** Enero 2026  
**Versión:** 2.0 - Arquitectura Híbrida Completa (GitHub Pages + Netlify + GTM + GA4 + Amazon)
- [ ] Tags → New → Google Analytics: GA4 Configuration
- [ ] Measurement ID: pegar `G-XXXXXXXXXX`
- [ ] Trigger: All Pages
- [ ] Save y Submit

#### Configurar Eventos E-commerce en GTM
**Tags a crear:**
- [ ] Tag "GA4 - View Item" (trigger: dataLayer event = view_item)
- [ ] Tag "GA4 - Add to Cart" (trigger: dataLayer event = add_to_cart)
- [ ] Tag "GA4 - Begin Checkout" (trigger: dataLayer event = begin_checkout)

#### Testing
- [ ] GTM Preview Mode → Verificar tags se disparan
- [ ] Instalar "Tag Assistant" (extensión Chrome)
- [ ] Verificar eventos en GA4 Real-Time
- [ ] Commit: `"feat: Add GTM and GA4 tracking"`
- [ ] Push a GitHub

**Entregable Día 3:** ✅ Tracking operativo (GTM + GA4)

---

### 📅 Fase 3: Amazon Associates (Día 4-5)

#### Día 4: Registro y Setup
**En Amazon Associates:**
- [ ] Registrarse en https://affiliate-program.amazon.com
- [ ] Completar perfil y datos de pago
- [ ] Obtener Partner Tag (formato: `tu-tag-20`)

**Selección de Productos Complementarios:**
- [ ] Identificar 6-10 productos complementarios (otras marcas)
- [ ] Copiar ASINs de cada producto
- [ ] Generar links de afiliado con SiteStripe

#### Día 5: Implementación
**En index.html:**
- [ ] Crear nueva sección "You Might Also Like" o "Complete Your Routine"
- [ ] Añadir product cards con estructura HTML
- [ ] Implementar botones con links de afiliado
- [ ] Añadir `rel="nofollow sponsored"` a todos los links
- [ ] Añadir evento GTM en clicks: `dataLayer.push({'event': 'affiliate_click'})`

**Legal:**
- [ ] Añadir disclaimer en footer: "As an Amazon Associate, we earn from qualifying purchases"
- [ ] Actualizar Privacy Policy (mencionar cookies)

**Testing:**
- [ ] Verificar links funcionan
- [ ] Verificar evento `affiliate_click` en GTM Preview
- [ ] Commit: `"feat: Add affiliate products section"`
- [ ] Push a GitHub

**Entregable Día 4-5:** ✅ Sección de afiliados funcionando

---

### 📅 Fase 4: Netlify Functions (Día 6-7)

#### Día 6: Setup Netlify
**En Netlify:**
- [ ] Crear cuenta en https://www.netlify.com
- [ ] New site from Git → Conectar repo GitHub
- [ ] Build settings:
  - Build command: `npm run build`
  - Publish directory: `.` (raíz)
- [ ] Deploy site

**En proyecto local:**
- [ ] Crear carpeta `/netlify/functions/`
- [ ] Crear archivo `netlify.toml` en raíz:
```toml
[build]
  command = "npm run build"
  publish = "."

[functions]
  directory = "netlify/functions"
```
- [ ] Commit: `"feat: Add Netlify configuration"`
- [ ] Push (se desplegará automáticamente en Netlify)

#### Día 7: Primera Función Serverless
**Crear función test:**
- [ ] Crear `/netlify/functions/hello.js`:
```javascript
exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello from Netlify!" })
  };
};
```
- [ ] Commit y push
- [ ] Probar: `https://[tu-site].netlify.app/.netlify/functions/hello`
- [ ] Verificar respuesta JSON

**Instalar dependencias para Amazon PA API:**
```powershell
npm install aws4 crypto-js --save
```
- [ ] Commit: `"feat: Add Netlify serverless functions"`

**Entregable Día 6-7:** ✅ Netlify operativo con functions

---

### 📅 Fase 5: Amazon PA API (Día 8-9)

#### Día 8: Registro PA API
**En Amazon:**
- [ ] Ir a https://webservices.amazon.com/paapi5/documentation/
- [ ] Registrarse en Product Advertising API
- [ ] Obtener Access Key ID
- [ ] Obtener Secret Access Key
- [ ] Verificar que Partner Tag esté activo

**En Netlify:**
- [ ] Site settings → Environment variables → Add
- [ ] `AMAZON_ACCESS_KEY` = [tu access key]
- [ ] `AMAZON_SECRET_KEY` = [tu secret key]
- [ ] `AMAZON_PARTNER_TAG` = [tu partner tag]
- [ ] Redeploy site

#### Día 9: Implementar Función PA API
**Crear `/netlify/functions/get-products.js`:**
- [ ] Implementar firma de request con aws4
- [ ] Implementar GetItems endpoint
- [ ] Manejar errores (rate limit, productos no encontrados)
- [ ] Commit: `"feat: Integrate Amazon PA API"`

**Actualizar frontend:**
- [ ] Crear `/src/assets/js/amazon-api.js`
- [ ] Implementar función fetch a Netlify Function
- [ ] Actualizar precios dinámicamente en productos propios
- [ ] Añadir loading states
- [ ] Commit: `"feat: Dynamic product pricing via PA API"`

**Testing:**
- [ ] Verificar llamadas a PA API en Netlify logs
- [ ] Verificar precios se actualizan en frontend
- [ ] Verificar no excede 1 req/segundo

**Entregable Día 8-9:** ✅ Precios dinámicos desde Amazon

---

### 📅 Fase 6: Carrito y Checkout (Día 10-12)

#### Día 10-11: Carrito de Compra
**Crear `/src/assets/js/cart.js`:**
- [ ] Sistema de carrito con localStorage
- [ ] Botón "Add to Cart" en productos propios
- [ ] UI de carrito (sidebar o modal)
- [ ] Mostrar items, cantidades, subtotal
- [ ] Botón aumentar/disminuir cantidad
- [ ] Botón remover item
- [ ] Evento GTM: `add_to_cart` cuando se añade
- [ ] Commit: `"feat: Add shopping cart functionality"`

#### Día 12: Flujo de Checkout
**Crear modal/página pre-checkout:**
- [ ] Formulario: Email, Nombre, (Teléfono opcional)
- [ ] Validación de campos
- [ ] Evento GTM: `begin_checkout`

**Crear `/netlify/functions/save-lead.js`:**
- [ ] Guardar lead en Mailchimp API o Google Sheets
- [ ] Retornar success/error

**Generar URL de Amazon:**
- [ ] Función JavaScript para generar URL con productos
- [ ] Formato: `amazon.com/gp/aws/cart/add.html?ASIN.1=X&Quantity.1=2...`
- [ ] Añadir Partner Tag al final
- [ ] Redirect automático a Amazon

- [ ] Commit: `"feat: Complete checkout flow"`

**Entregable Día 10-12:** ✅ Flujo completo carrito → checkout → Amazon

---

### 📅 Fase 7: Testing y Launch (Día 13-14)

#### Día 13: Testing Exhaustivo
**Funcionalidad:**
- [ ] Probar en Chrome, Firefox, Safari
- [ ] Probar en móvil (responsive)
- [ ] Probar flujo completo: landing → producto → carrito → checkout
- [ ] Verificar links de afiliado funcionan
- [ ] Verificar PA API no excede rate limits

**Tracking:**
- [ ] Verificar todos los eventos GTM se disparan
- [ ] Verificar eventos llegan a GA4 Real-Time
- [ ] Verificar eventos e-commerce tienen datos correctos

**Performance:**
- [ ] Google PageSpeed Insights > 80
- [ ] Optimizar imágenes si necesario
- [ ] Lazy loading de imágenes
- [ ] Minificar CSS/JS

- [ ] Commit: `"fix: Optimize performance and fix bugs"`

#### Día 14: Legal y Launch
**Páginas legales:**
- [ ] Crear Privacy Policy (mencionar cookies, GTM, GA4)
- [ ] Crear Terms of Service
- [ ] Actualizar footer con links legales

**Dominio personalizado (opcional):**
- [ ] Comprar dominio (ej: blissedskin.com)
- [ ] Configurar DNS en registrador:
  - A record → 185.199.108.153
  - A record → 185.199.109.153
  - A record → 185.199.110.153
  - A record → 185.199.111.153
- [ ] En GitHub Settings → Pages → Custom domain: `blissedskin.com`
- [ ] Esperar validación DNS
- [ ] Activar "Enforce HTTPS"

**Final Deploy:**
- [ ] Commit: `"docs: Add legal pages and launch v1.0"`
- [ ] Push a GitHub
- [ ] Tag release: `git tag v1.0.0 && git push --tags`
- [ ] Verificar todo funciona en producción
- [ ] Monitorear GA4 primeras 24h

**Entregable Día 14:** 🎉 **Landing en producción completa**

---

## ✅ Post-Deploy: Monitoreo Continuo

### Diario (Primera Semana)
- [ ] Revisar GA4 Real-Time
- [ ] Verificar eventos se registran
- [ ] Revisar Netlify Functions logs (errores?)
- [ ] Verificar no excedes límites de Netlify (125k req/mes)

### Semanal
- [ ] Analizar tráfico en GA4
- [ ] Revisar tasas de conversión (add_to_cart, begin_checkout)
- [ ] Identificar productos más vistos
- [ ] Optimizar CTAs si conversión baja

### Mensual
- [ ] Revisar comisiones Amazon Associates
- [ ] Verificar ventas vía PA API (mínimo 3 al mes)
- [ ] A/B testing de elementos clave
- [ ] Crear contenido blog (SEO)

## 🌐 Rutas y Assets

**Importante:** Verifica que las rutas de assets en `index.html` funcionen en GitHub Pages:

```html
<!-- Rutas relativas (✅ Recomendado) -->
<link href="tailwind_theme/tailwind.css" rel="stylesheet">
<img src="assets/logo.png" alt="Logo">

<!-- O rutas absolutas con base path -->
<img src="/[nombre-repo]/assets/logo.png" alt="Logo">
```

## 🔄 Workflow de Actualización

### Después de hacer cambios en el proyecto

#### Opción A: Desde Terminal

```powershell
# 1. Ver archivos modificados
git status
git add -A; git status

# 2. Añadir archivos al staging area
git add .                          # Todos los archivos
git add index.html                 # Archivo específico
git add assets/css/                # Carpeta específica

# 3. Hacer commit con mensaje descriptivo
git commit -m "fix: correct links products"

# 4. Subir cambios a GitHub
git push origin main

# 5. Verificar deploy (1-2 minutos)
# Visita tu URL de GitHub Pages
```
### Tipos de Mensajes de Commit

| Prefijo | Uso | Ejemplo |
|---------|-----|---------|
| `feat:` | Nueva funcionalidad | `feat: Add shopping cart` |
| `fix:` | Corrección de bugs | `fix: Correct product pricing` |
| `style:` | Cambios visuales (CSS) | `style: Update button colors` |
| `docs:` | Documentación | `docs: Update README` |
| `refactor:` | Refactorización | `refactor: Optimize image loading` |
| `perf:` | Mejoras de performance | `perf: Lazy load images` |
| `test:` | Tests | `test: Add cart validation` | 

#### Opción B: Desde VS Code (Interfaz Visual)

**Paso 1: Abrir Source Control**
- Presiona `Ctrl+Shift+G` (Windows/Linux) o `Cmd+Shift+G` (Mac)
- O click en el ícono de ramificación en la barra lateral izquierda

**Paso 2: Revisar Cambios**
- Verás lista de archivos modificados (M), nuevos (U), o eliminados (D)
- Click en archivo para ver diferencias (diff)
- Cambios en verde = añadidos, rojo = eliminados

**Paso 3: Stage de Cambios**
- **Opción 1:** Click en botón `+` (plus) junto a cada archivo
- **Opción 2:** Hover sobre "Changes" y click en `+` para stage all
- Los archivos pasan a sección "Staged Changes"

**Paso 4: Escribir Mensaje de Commit**
- En campo de texto superior, escribir mensaje descriptivo:
  - `feat: Add new feature`
  - `fix: Correct pricing bug`
  - `style: Update hero section colors`
  - `docs: Update README`
- Usar prefijos convencionales (feat, fix, style, docs, refactor)

**Paso 5: Hacer Commit**
- Click en botón `✓ Commit` (checkmark)
- O presiona `Ctrl+Enter` (Windows/Linux) o `Cmd+Enter` (Mac)

**Paso 6: Push a GitHub**
- Click en botón `↑ Sync Changes` o `⋯` → `Push`
- Si es tu primer push: VS Code pedirá autenticación GitHub
- Espera confirmación "Successfully pushed"

**Paso 7: Verificar Deploy**
- Espera 1-2 minutos
- Visita tu URL: `https://[tu-usuario].github.io/[repo-name]/`
- Refresca con `Ctrl+Shift+R` (hard refresh)

### Workflow Completo Recomendado

```
1. Hacer cambios en Pinegrow/VS Code
   ↓
2. npm run build (si cambiaste TailwindCSS)
   ↓
3. Probar localmente (abrir index.html)
   ↓
4. git status (ver qué cambió)
   ↓
5. git add . (añadir cambios)
   ↓
6. git commit -m "mensaje descriptivo"
   ↓
7. git push origin main
   ↓
8. Esperar 1-2 minutos
   ↓
9. Verificar en GitHub Pages
```

### Atajos de Teclado VS Code

| Acción | Windows/Linux | Mac |
|--------|---------------|-----|
| Abrir Source Control | `Ctrl+Shift+G` | `Cmd+Shift+G` |
| Commit | `Ctrl+Enter` | `Cmd+Enter` |
| Buscar archivos | `Ctrl+P` | `Cmd+P` |
| Terminal integrada | `` Ctrl+` `` | `` Cmd+` `` |
| Command Palette | `Ctrl+Shift+P` | `Cmd+Shift+P` |

## 🚨 Troubleshooting

### La página no carga correctamente
- Verifica las rutas de los assets (relativas desde la raíz)
- Asegúrate de que `tailwind_theme/tailwind.css` está en el repo
- Revisa la consola del navegador para errores 404

### Los estilos no se aplican
- Ejecuta `npm run build` para regenerar el CSS
- Verifica que `tailwind.config.js` esté correctamente configurado
- Confirma que los archivos CSS están incluidos en el commit

### Cambios no se reflejan
- GitHub Pages puede tardar 1-2 minutos en actualizar
- Limpia la caché del navegador (Ctrl+Shift+R o Cmd+Shift+R)
- Verifica que el commit se hizo correctamente

---

**Última actualización:** Enero 2026

<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->

<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->
