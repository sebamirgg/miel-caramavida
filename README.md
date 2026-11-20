# Caramávida — sitio informativo

Sitio institucional B2B (one-page con secciones ancladas) de las mieles **Caramávida** de **Bosques y Praderas**.
Angular 21 · componentes standalone · signals · SSR con prerender de `/es` y `/en` · sin dependencias extra.

## Cómo correr el proyecto

```bash
npm install
npm start            # ng serve → http://localhost:4200 (redirige a /es)
npm run build        # build de producción + prerender en dist/cooperativa-ragko
npm test             # tests unitarios (Vitest)
```

Servidor SSR de producción (después del build):

```bash
NG_ALLOWED_HOSTS=localhost PORT=4000 npm run serve:ssr:cooperativa-ragko
```

> `NG_ALLOWED_HOSTS` es obligatorio desde Angular 21 (protección SSRF). En producción indique el dominio real,
> p. ej. `NG_ALLOWED_HOSTS=www.caramavida.com`. Si no se define, el servidor cae a renderizado en el cliente.
> Como `/es` y `/en` son estáticos, también se puede publicar solo `dist/cooperativa-ragko/browser`
> en un hosting estático (configurando la redirección `/` → `/es`).

## Estructura

```
src/
├─ assets/i18n/           es.json · en.json  ← TODOS los textos visibles
├─ app/
│  ├─ core/
│  │  ├─ i18n/            I18nService (signals), tipos, guard + resolver de idioma
│  │  ├─ seo/             SeoService: title, description, Open Graph, JSON-LD, hreflang
│  │  └─ services/        ContactService (envío), ContactIntentService, modelos del formulario
│  ├─ data/               site.config.ts (contacto, flags) · media.data.ts (imágenes) · honeys/sections
│  ├─ layout/             site-header · site-footer
│  ├─ pages/home/         ensambla las secciones
│  ├─ sections/           hero · origin · honeys · science · story · partnerships (+ contact-form)
│  └─ shared/             honey-card · study-card · cta-link · media-placeholder · language-switcher · origin-map · reveal
public/
├─ images/                fotografías y video (vacío: hoy se muestran placeholders rotulados)
└─ reports/               informes PDF descargables
```

## Editar textos y traducciones

- Todo el texto está en `src/assets/i18n/es.json` (idioma por defecto) y `en.json`.
- Ambos archivos **deben tener la misma estructura**. El tipo `Dictionary` se deriva de `es.json`, así que
  si falta una clave en `en.json` el build falla. Además, un test compara ambos archivos (`npm test`).
- Agregar un idioma: crear `xx.json`, añadirlo a `SUPPORTED_LANGS` (`core/i18n/i18n.types.ts`) y al mapa
  de `i18n.service.ts`.
- Datos no traducibles (correo, teléfono, dirección, URLs, flags) → `src/app/data/site.config.ts`.
- Flags: `showSamplesCta` (CTA «Solicitar muestras»), `showMailtoFallback`, `requireCorporateEmail`.

## Reemplazar imágenes

1. Copiar el archivo en `public/images/` (p. ej. `ulmo.jpg`).
2. En `src/app/data/media.data.ts`, cambiar `pending(800, 1000)` por
   `{ src: 'images/ulmo.jpg', width: 800, height: 1000 }` (tamaño real en píxeles).
3. El texto alternativo se edita en i18n (`imageAlt`, `story.gallery`, `hero.mediaLabel`, `origin.landscapeAlt`).

El componente `app-media` usa `NgOptimizedImage` (lazy por defecto, `priority` en el hero) cuando hay `src`.
Si no lo hay, muestra un bloque rotulado «Foto pendiente: …».
Video del hero: definir `hero.videoSrc` (MP4) y `hero.src` como póster. Se reproduce en silencio y nunca
cuando el usuario prefiere movimiento reducido.

Informes de estudios: copiar el PDF en `public/reports/` y poner `"reportUrl": "reports/archivo.pdf"`
en `science.studies` de ambos JSON. Mientras sea `null`, el botón aparece deshabilitado.

## Conectar el formulario a un backend

El envío está aislado en `src/app/core/services/contact.service.ts`. Hoy `submit()` solo simula un envío exitoso.
Para conectarlo:

1. Agregar `provideHttpClient(withFetch())` en `app.config.ts`.
2. Reemplazar el cuerpo de `submit()` por un `POST` al endpoint (API propia, Formspree, HubSpot, etc.).
   En el comentario del servicio hay un ejemplo.
3. El contrato del payload es `ContactRequest` (`contact.models.ts`). Incluye `lang` para responder en el idioma del visitante.

El formulario ya incluye validaciones, mensajes de error accesibles, foco en el primer error, honeypot antispam
y confirmación. El fallback `mailto:` aparece en cuanto se define `contact.email` en `site.config.ts`.

## SEO

- `SeoService` define por idioma `<html lang>`, `title`, `meta description`, Open Graph y un JSON-LD `Organization`.
  Todo esto se genera en el HTML prerenderizado.
- **hreflang + canonical:** se activan solos al definir `siteUrl` en `site.config.ts`.
- **sitemap.xml:** cuando exista el dominio, crear `public/sitemap.xml` con `/es` y `/en`
  (con `xhtml:link rel="alternate" hreflang`) y `public/robots.txt` que apunte a él.

## Accesibilidad y diseño

- Tokens de color y tipografía en `src/styles.css`. Los pares de texto cumplen WCAG AA (≥ 4,5:1).
- Enlace «Saltar al contenido», landmarks semánticos, foco visible y menú móvil con `aria-expanded`
  que se cierra con Escape. Al navegar por anclas, el foco se mueve a la sección.
- Animaciones de entrada sutiles, desactivadas con `prefers-reduced-motion`. Sin JavaScript, todo el contenido es visible.

## Contenido marcado «Ejemplo» (confirmar antes de publicar)

Estos textos del rediseño son ilustrativos. Aparecen con una etiqueta «Ejemplo» y una nota al pie
porque son afirmaciones de producto con peso comercial y legal (importadores UE). El productor debe
confirmarlos o reemplazarlos; luego basta con quitar la etiqueta.

- **Credenciales** (`credentials.items`, campo `example: true`): «Sin filtrar en caliente», «Cosecha responsable»,
  «Cristalización natural». «Flora nativa de Nahuelbuta» no está marcada (es el origen).
- **Fichas de miel** (`honeys.items`): notas de cata, nivel de intensidad (1–5) y textura de Ulmo y Tineo.
  La etiqueta se muestra en `shared/components/honey-card`.
- **Imágenes de ejemplo** (`data/media.data.ts`): fotos de Wikimedia Commons con licencia libre y crédito visible.
  Hay que reemplazarlas por fotografía propia (hero, fichas, origen, rituales y galería).

Otras notas del rediseño:
- El sello del hero dice «Bosque nativo · Nahuelbuta · Chile» (verificable), no «100% Cruda».
- El formulario de contacto sigue oculto. Todos los CTA llevan a la sección **Alianzas**. Para reactivarlo,
  descomentar el bloque en `partnerships.section.html` y volver a importar `ContactFormComponent`.
- Las traducciones al alemán, chino y japonés necesitan revisión de un hablante nativo.

## Lista de `[PENDIENTE]` para el cliente

**Identidad y medios**
- [x] Logo de Bosques & Praderas (header y footer, `public/images/marca/`), recortado del JPG original en dos versiones PNG transparentes. [PENDIENTE: versión vectorial (SVG) para máxima nitidez] · favicon (`public/favicon.ico`)
- [x] Foto del hero: fotografía propia del cliente (`public/images/cliente/apicultor-colmenas.jpg`) · [ ] foto de paisaje del territorio
- [ ] Fotos de producto: frasco de Ulmo y de Tineo
- [ ] 6 fotografías documentales (apicultor, flor de Ulmo, flor de Tineo, paisaje, cosecha, equipo)
- [ ] Imagen para compartir en redes (Open Graph, 1200×630) → `site.config.ts › ogImage`

**Contacto y legal** (`src/app/data/site.config.ts`)
- [ ] Dominio definitivo (`siteUrl`), que activa canonical y hreflang
- [ ] Correo comercial, teléfono y dirección institucional
- [ ] URL de la política de privacidad

**Territorio** (`origin.*`)
- [ ] Texto final sobre Caramávida (altitud, tipo de bosque, clima, comunidades), sin cifras no verificadas
- [ ] Formaciones vegetales presentes · validar redacción y fuente sobre endemismo
- [ ] Calendario floral validado para Ulmo y Tineo

**Mieles** (`honeys.items.*`, para Ulmo y Tineo)
- [ ] Validar especie botánica (*Eucryphia cordifolia* / *Weinmannia trichosperma*) con análisis melisopalinológico
- [ ] Meses de floración confirmados · perfil sensorial validado · texto breve de presentación

**Ciencia** (`science.*`)
- [ ] Denominación formal de la colaboración con la UFRO, equipo o laboratorio y alcance
- [ ] Descripción del índice NBI (siempre rotulado «índice propio en desarrollo»)
- [ ] Por estudio: título, fecha, metodología, muestra, laboratorio y PDF del informe

**Historia** (`story.*`)
- [ ] Origen de Bosques y Praderas, año y motivación · equipo y familias apicultoras
- [ ] Oficio apícola · prácticas de manejo (certificaciones solo si están vigentes y verificadas) · relación con el territorio

**Alianzas** (`partnerships.*`)
- [ ] Detalle del sistema de trazabilidad
- [ ] Formatos: granel, retail y otros
- [ ] Otros mercados prioritarios, además de la Unión Europea

> Para encontrarlos todos: buscar `PENDIENTE` (y `PENDING` en `en.json`) en el proyecto.
