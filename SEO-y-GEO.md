# SEO y SEO generativo (GEO) · OneXpert Servicios · v12

Cómo está preparado el sitio para Google y para los buscadores con inteligencia artificial (ChatGPT, Claude, Perplexity, Gemini, Copilot y las respuestas con IA de Google). Actualizado el 21 de octubre de 2026 con los textos que tiene hoy la página.

---

## 1. Dónde está cada cosa

| Qué | Archivo | Dónde |
|---|---|---|
| Título, descripción, palabras clave, preguntas de intención | `index.html` | `<head>`, bloque **1 · SEO** |
| Open Graph (vista previa en redes) | `index.html`, `guias/index.html`, cada `guias/<id>/index.html` | bloque **2** |
| Datos estructurados (schema.org) | mismos archivos | bloque **6 · JSON-LD** |
| Único `<h1>` | `index.html` | titular del hero |
| Textos alternativos (`alt`) | todas las páginas | cada `<img>` |
| Resumen para asistentes de IA | `llms.txt` | raíz |
| Permisos para rastreadores | `robots.txt` | raíz |
| Mapa del sitio (incluye cada guía) | `sitemap.xml` | raíz |

---

## 2. Página principal

**Título (62 car.)** · `Administración de siniestros TPA en Chile | OneXpert Servicios`

**Descripción (156 car.)** · `TPA para compañías de seguros en Chile: administramos siniestros y reembolsos con portal del asegurado, liquidación ágil, dashboards y reportería de riesgos.`

**Palabras clave**

| Tipo | Palabras |
|---|---|
| Principal | administración de siniestros · TPA seguros Chile |
| Secundarias | tercero administrador de siniestros · outsourcing de siniestros · portal del asegurado · reembolsos de salud · liquidación de siniestros de vida y salud |
| Empresas | reportería de siniestralidad · gestión de riesgos en seguros colectivos · historial de gasto de colaboradores |
| Long tail | NPS compañía de seguros · Ley 21.719 datos sensibles · siniestros catastróficos · integración con la aseguradora |
| Marca | OneXpert Servicios · Onex Servicios |

### Preguntas de intención

Es lo que una persona escribe en Google o le pregunta a una IA. Cada una tiene una sección que la responde con texto visible; las que están en **negrita** también van en el `FAQPage` del JSON-LD.

| Pregunta | Dónde se responde |
|---|---|
| **¿Qué es un TPA en seguros?** | Preguntas frecuentes |
| **¿Tengo que cambiar mis sistemas para externalizar siniestros?** | Preguntas frecuentes |
| **Si soy corredor, ¿me sirve un TPA?** | Preguntas frecuentes |
| **¿Cómo se protegen los datos sensibles de los asegurados?** | Preguntas frecuentes + Soluciones (introducción) |
| **¿Cuánto demora la liquidación de un siniestro en Chile?** | Preguntas frecuentes |
| ¿Cómo mejorar el NPS de una aseguradora? | Audiencias |
| ¿Dónde pido y reviso mis reembolsos del seguro? | Beneficios · Portal del Asegurado |
| ¿Qué reportería de siniestralidad puede recibir mi empresa? | Beneficios · Reportería para Gestión de Riesgos |
| ¿Qué pasa con los siniestros después de un terremoto? | Soluciones · Eventos de gran escala + guía de las 72 horas |
| ¿Cuándo conviene externalizar la gestión de siniestros? | Soluciones · Gestión de siniestros + guía de los peaks |

### Datos estructurados (bloque 6)

Un solo `@graph`:

- **Organization** · con dos `contactPoint` (comercial y asegurados) y `knowsAbout`.
- **WebSite** y **WebPage** (`dateModified` 2026-10-21).
- **ProfessionalService** · 9 servicios, con los nombres de la página: gestión de siniestros como TPA, eventos de gran escala, enlaces tecnológicos, seguimiento en línea, carga de documentos con validación, Portal del Asegurado, liquidación ágil, reportería para gestión de riesgos, SLA y reportería mensual.
- **FAQPage** · las **5** preguntas visibles, con el mismo texto (incluida «Si soy corredor…», que ya tiene respuesta).

> **Regla del FAQPage:** las respuestas del JSON-LD deben ser idénticas a las visibles. Si editas una respuesta en la sección 05, edítala también en el bloque 6.

---

## 3. Guías

Desde la v12 **cada guía tiene su propia página**: `guias/<id>/index.html`. Antes estaban todas en una sola página (`guias/#id`), y eso tenía dos problemas:

1. Las redes sociales no leen el `#` de una dirección: todas las guías compartidas mostraban la misma imagen y el mismo título.
2. Google indexa páginas, no fragmentos: una guía dentro de otra página casi no puede posicionar sola.

Cada guía ahora tiene:

- `<title>` y descripción propios (tabla abajo).
- **Open Graph de tipo `article`** con su imagen de 1200 × 630 (`imagenes/social/guias/<id>.jpg`), fecha, sección y etiquetas.
- **JSON-LD**: `BlogPosting` completo + `BreadcrumbList` (Inicio › Guías › guía) + `FAQPage` con su pregunta de intención.
- **Pregunta de intención visible** dentro del post-it «En corto», seguida de la respuesta directa en 2–3 frases. Es el formato que más citan los buscadores con IA.
- Botón **Compartir** (ver `seo/open-graph.md`).
- «Sigue leyendo»: 3 guías relacionadas (enlazado interno).

| Guía | Título SEO | Pregunta de intención |
|---|---|---|
| como-administrar-una-indemnizacion | Cómo administrar una indemnización: el primer año \| OneXpert | ¿Qué hacer con una indemnización de seguro de vida? |
| estudios-de-los-hijos-despues-de-un-siniestro | Estudios de los hijos después de un siniestro \| OneXpert | ¿Cómo proteger los estudios de los hijos después de un siniestro? |
| primeras-72-horas-de-una-catastrofe | Las primeras 72 horas de una catástrofe \| OneXpert | ¿Qué debe hacer una aseguradora en las primeras 72 horas de una catástrofe? |
| que-hacer-despues-de-un-choque | Qué hacer después de un choque: 6 pasos \| OneXpert | ¿Qué hacer después de un choque para que el seguro responda? |
| reembolsos-de-salud-sin-rechazos | Reembolsos de salud sin rechazos: qué enviar \| OneXpert | ¿Por qué rechazan un reembolso de salud y cómo evitarlo? |
| seguro-de-accidentes-personales | Seguro de accidentes personales: qué cubre \| OneXpert | ¿Qué cubre un seguro de accidentes personales y cómo se cobra? |
| preparar-la-operacion-de-siniestros-para-los-peaks | Siniestros en peaks: cuándo conviene un TPA \| OneXpert | ¿Cuándo conviene externalizar la gestión de siniestros a un TPA? |
| ley-21719-datos-sensibles-siniestros | Ley 21.719: qué exigir a quien administra siniestros \| OneXpert | ¿Qué exige la Ley N° 21.719 a quien administra siniestros? |

Los enlaces antiguos (`guias/#id`) siguen funcionando: `js/guias.js` lleva a la página nueva.

---

## 4. Textos alternativos de las imágenes

Todas las fotografías tienen un `alt` que describe la imagen **y** su contexto en el sitio (ej. «Viviendas destruidas por un terremoto: un evento de gran escala que multiplica los siniestros»). Así suman a la búsqueda de imágenes y al contexto de la página.

- Las fotos de fondo (hero, Audiencias, Beneficios, Compromiso) también tienen `alt`, pero su contenedor lleva `aria-hidden="true"`: Google las lee y los lectores de pantalla no repiten algo decorativo.
- Llevan `alt=""` a propósito solo los gráficos sin contenido: la nota adhesiva de las listas, las facetas de la marca y el logo de color (oculto; el visible es el blanco, con `alt="OneXpert Servicios"`).

---

## 5. GEO: cómo nos encuentran las IA

1. **`llms.txt`** (raíz): resumen en Markdown con datos clave, las preguntas que responde el sitio y la lista de páginas y guías con su dirección propia. Reescrito en la v12 con el contenido actual (Portal del Asegurado, liquidación ágil, reportería).
2. **`robots.txt`** permite a los rastreadores de IA que citan fuentes (OAI-SearchBot, Claude-SearchBot, PerplexityBot…).
3. **Respuestas directas**: preguntas frecuentes y «En corto» de cada guía responden en la primera frase.
4. **Datos verificables**: plazos legales (45/90 días, DFL 251), normas (NCG 454, NCG 573, Leyes 19.628, 21.663, 21.719) y cifras (24/7, 100 %).

---

## 6. Después de publicar

1. Cambiar `kreatividademocional.com/servicio` por `servicios.onexpert.cl` en todo el sitio (ver `seo/open-graph.md`).
2. Subir `sitemap.xml` a Google Search Console y Bing Webmaster Tools.
3. Validar el JSON-LD de la portada, la biblioteca y una guía en https://search.google.com/test/rich-results
4. Revisar la vista previa de 2–3 guías en el depurador de Facebook y el Post Inspector de LinkedIn.

## Pendientes de contenido (no los cambié)

- La bajada de Preguntas frecuentes menciona «costos», pero no hay una pregunta sobre costos.
- Algunas guías y lecturas todavía nombran servicios del programa anterior («orientación financiera», «continuidad educacional» de Onex Servicios). Conviene revisarlas contra los pilares actuales.
- «Más de veinte años» (Respaldo) sigue marcado para confirmar.
