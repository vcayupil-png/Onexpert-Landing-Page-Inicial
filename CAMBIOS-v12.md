# Cambios v12 · OneXpert Servicios · 21 de octubre de 2026

## 1. Menú y navegación

| Pedido | Cómo quedó |
|---|---|
| Audiencias: mucho espacio vacío al llegar desde el menú | El id `#audiencias` ya no está al inicio de la sección: es un ancla (`<span class="ancla">`) entre el encabezado y las tarjetas. Al llegar, la frase «La experiencia del asegurado termina reflejándose en el NPS…» queda arriba y ya se ven las dos fotos. Además, en escritorio bajó el aire sobre las tarjetas (104 → 44 px) y se corrigió un error que sumaba 200 px a TODAS las anclas (había dos márgenes de 100 px superpuestos). |
| «Onex Servicios» → **Beneficios** | Menú, menú móvil, pie y botón del hero. Ids limpios: `#beneficios`, `#beneficios-titulo`, `#beneficios-pilares`, y cada pilar `#portal-del-asegurado`, `#liquidacion-agil`, `#reporteria-gestion-riesgos` (antes `contigo`, `apoyo-psicologico`, `orientacion-financiera`, `continuidad-educacional`). |
| **Respaldo** en el menú | Nuevo enlace. El menú marca «Respaldo» al pasar por ese bloque y «Soluciones» en el resto de la macro-sección (`js/interacciones.js` §3 ahora entiende secciones anidadas y anclas). |
| Guías en el menú | En la portada lleva a la sección `#guias` (se ilumina al llegar). En las páginas internas lleva a la biblioteca. |
| 7 enlaces | El menú completo se ve desde 1200 px; por debajo, botón de menú. |

## 2. Beneficios · fichas

- **Fichas que se traslapaban:** las filas del acordeón ahora tienen 0,6 rem de separación; la tarjeta abierta y la que tiene el cursor ya no se tocan.
- **Lista con nota adhesiva** (Portal del Asegurado y Reportería): el PNG tenía 300 × 60 px con la nota en el extremo derecho, por eso quedaba lejos del texto. Se recortó a la nota (`imagenes/graficos/notita-mini.png`, 33 × 33), se muestra a 15 px, levemente girada y más tenue. Cada ítem va en una línea a todo el ancho (`<ul class="lista-nota">`, antes un `<dl>` mal formado).
- **Reportería:** clase especial `.lista-nota--reporteria`: nota y texto corridos a la izquierda y más interlineado.
- La columna del texto de Beneficios es más ancha (1,2 : 0,8): los pilares se leen en menos líneas.
- Post-it «Lo más difícil llega después del pago.»: título en Handlee 2,55 → 2,35 rem (≈ 2 puntos menos).

## 3. Respaldo

- Encabezado, cita y foto comparten una rejilla: la foto de la familia sube y queda nivelada con el titular y la bajada. Para ajustarla: `--foto-y` en `css/05-secciones.css` §5.7.
- Cita «Después de un siniestro, el pago…»: peso 500 → 400.

## 4. Guías

- **Una página por guía** (`guias/<id>/index.html`), con su propia vista previa al compartir: Open Graph de tipo artículo, imagen 1200 × 630 propia (`imagenes/social/guias/`), título y descripción para Google, JSON-LD (BlogPosting + migas + FAQPage).
- **Botón para compartir** arriba y al final de cada guía: WhatsApp, LinkedIn, Facebook, X, correo, copiar enlace y el menú nativo del teléfono. Sin scripts de terceros. Detalle en `seo/open-graph.md`.
- Pregunta de intención visible en el post-it «En corto» de cada guía.
- «Sigue leyendo» con 3 guías relacionadas al final.
- Los enlaces antiguos (`guias/#id`) llevan solos a la página nueva.
- Expertito: post-it −10 % (176–275 px; móvil 214 px) y la cara −10 % dentro del papel, centrada.
- Cómo agregar una guía: `seo/nueva-guia.md`.

## 5. Pie de página

- Cuatro columnas sin repetir: marca · Soluciones · Beneficios · Contacto. Se quitaron enlaces duplicados («Compañías y sponsors», «Contacto», «El programa», dos enlaces a guías) y los pilares antiguos.
- Correos con **texto de ayuda** al pasar el cursor o con el teclado:
  - comercial@: compañías, corredores y sponsors · cotizaciones, demostraciones, alianzas · horario.
  - contigo@: asegurados y beneficiarios con un caso en curso · le responde su ejecutivo.

## 6. Código

- **CSS reorganizado por tema**: de 11 hojas (6 base + 5 capas de versiones v8, v9, v10, v10.1 que se pisaban entre sí) a 8 hojas sin capas: `01-tokens · 02-base · 03-vidrio · 04-componentes · 05-secciones · 06-movimiento · 07-guias · 08-expertito`. `05-secciones.css` sigue el mismo orden que `index.html`.
- Cada regla quedó una sola vez con su valor final; se borró el código de componentes que este sitio no usa (portal, productos, packs, WhatsApp…). −24 % de peso.
- Verificado con capturas píxel a píxel antes de los cambios de diseño: misma apariencia.
- Una sola petición a Google Fonts (antes tres; Schoolbell ya no se usa).
- Más aire entre bloques en HTML y CSS, comentarios con índice y referencias actualizadas. Las secciones de `index.html` quedaron numeradas 01–08.
- Cabecera, menú y pie salen de la misma plantilla en todas las páginas.
- `.htaccess`: cabeceras de seguridad (nosniff, anti-clickjacking, Referrer-Policy, Permissions-Policy; HSTS listo para activar) y caché de imágenes.
- 404: la imagen apuntaba a `/servicio_v11/…`; ahora usa rutas relativas a `<base href>`.

## 7. SEO y búsqueda con IA

- Descripción, Open Graph y JSON-LD reescritos con el contenido actual (Portal del Asegurado, liquidación ágil, reportería, empleador).
- `ProfessionalService` con 9 servicios; `FAQPage` con las **5** preguntas visibles (se sumó la del corredor).
- Palabras clave y **preguntas de intención** documentadas en el `<head>` y en `seo/SEO-y-GEO.md`.
- `alt` descriptivo en todas las fotos (se corrigió «Bomberos…» en la foto del terremoto).
- `llms.txt` reescrito, con sección «Preguntas que responde este sitio» y la dirección propia de cada guía.
- `sitemap.xml` con las 8 guías y sus imágenes.

## 8. Correcciones de texto (revisar si alguna no corresponde)

- «Ppermite» → «Permite» · «compañia» → «compañía» · «Liquidación Agil» → «Ágil».
- Respuesta del corredor: se quitó la frase repetida («consolidar la info de tus clientes») y «apoyo técnico actualizar» → «contar con apoyo técnico actualizado».
- «Onexpert» → «OneXpert» en esa pregunta.

## Pendientes

- Al publicar: cambiar `kreatividademocional.com/servicio` por `servicios.onexpert.cl` (imágenes de redes) y la ruta de `.htaccess` / `<base href>` de la 404.
- La bajada de Preguntas frecuentes menciona «costos», pero no hay pregunta de costos.
- Algunas guías y las lecturas de la portada aún nombran «orientación financiera» y «continuidad educacional» de Onex Servicios (programa anterior).
- 7 fotos siguen llegando desde Unsplash mediante `js/imagenes.js` (equipo-operaciones, analitica, equipo-portatiles, reunion-portatil, familia-manos, familia-playa, apoyo-manos): descargarlas y borrar ese script antes de publicar.
- Confirmar «más de veinte años» (Respaldo).
