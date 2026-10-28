# Cambios v9 · OneXpert Servicios · octubre 2026

Archivos nuevos: `css/08-ajustes-v9.css` · `css/09-guias.css` · `js/guias.js` · `guias/index.html` · `llms.txt` · `seo/SEO-y-GEO.md` · `imagenes/guias/` · `imagenes/social/og-guias.jpg`
Archivos modificados: `index.html` · `js/v8.js` · `robots.txt` · `sitemap.xml` · `seo/open-graph.md` · `imagenes/fotos/CREDITOS.md` · `imagenes/fotos/madre-hija.*` · `imagenes/social/og-servicios.jpg`

## 1. Estilos generales y UI

| Pedido | Cómo quedó | Dónde |
|---|---|---|
| Biseles del Liquid Glass más notorios | Canto de luz de 1,5 px arriba, abajo y a los lados, volumen interior (luz arriba, sombra abajo) y filo más grueso y brillante. Intensidad regulable con `--bisel`. | `08-ajustes-v9.css` §8.1 |
| Quitar las líneas horizontales entre secciones | Las secciones con foto de fondo y el hero se funden por arriba y por abajo con una máscara degradada (`--fundido`); el velo ya no termina en navy sólido. | §8.2 |
| Post-it de los rótulos +50 % | 10 px → 15 px, con doblez, brillo y sombra. | §8.3 |
| Imagen OG = madre e hija con la manta | Nueva `og-servicios.jpg` (1200×630) con la foto, el cuadro cálido y el titular. `?v=9`. | `<head>` bloque 2 |
| Transparencias de la foto madre e hija | El interior de la figura tenía 99,6 % de opacidad; ahora es 100 %. Solo los bordes conservan el suavizado. | `imagenes/fotos/madre-hija.*` |
| Título y subtítulo repetidos en Preguntas frecuentes | Rótulo: «Preguntas frecuentes». Titular: «Antes de externalizar tus siniestros, esto es lo que conviene saber.» | sección 09 |

## 2. Contenido por sección

| Sección | Cambio |
|---|---|
| Compañías y sponsors | Nuevo dashboard, encuadrado sobre los gráficos, con más contraste y viñeta suave (§8.4). |
| Soluciones · números 01–04 | Sin neón: color sólido, peso medio y 78 % de opacidad (§8.5). |
| Soluciones · descripciones | Letra más grande (≈1,02–1,14 rem); subtítulos intactos. |
| Soluciones · tarjeta 3 | Nueva foto de servidores. |
| Soluciones · tarjeta 4 | Nueva foto familiar (madre con su hijo en brazos). |
| Tecnología · Seguimiento | Nuevo dashboard. |
| Tecnología · Solicitudes con menos interacciones | Nueva foto de mujer firmando. Se corrigió «Iteraciones» → «interacciones». |
| Tecnología · Seguridad de datos sensibles | Nuevo dashboard en tablet. |
| Indicadores · Tablero de operación | Nuevo dashboard en tablet. |
| Indicadores · Reportería mensual | Nueva foto (mujer leyendo el reporte). |
| Respaldo · espaciado | Menos aire entre titular, comillas y texto. |
| Respaldo · cita | Comillas gigantes al fondo (20 % de opacidad); la frase en cursiva queda encima como cita textual. |
| Respaldo · firma | «Liquidación de siniestros, administración y acompañamiento» con un resaltado leve tipo marcador. |

## 3. Ventana «Agenda una cita»

- Se eliminó el texto «La invitación le llega a carla.orlandi… escríbele directamente» (`js/v8.js` §5).
- Márgenes compactos: la ventana cabe completa sin scroll en pantallas desde 720 px de alto (probada en 1440×900, 1366×768, 1280×720 y móvil 390×844).

## 4. Guías y blog

- Las 3 guías del inicio usan las ilustraciones del personaje de papel.
- Cada guía tiene «Leer la guía completa» → su artículo en la biblioteca.
- Botón **«Ver todas las guías»** al final de la sección.
- Nueva página **`guias/index.html`**: portada, guía destacada, filtro Familias / Compañías, 8 guías completas con bloque «En corto» (post-it), pasos numerados y llamado a la acción.
- «Guías» se agregó a la navegación, al menú móvil y al pie («Todas las guías y artículos»).

## 5. SEO y SEO generativo

Todo explicado en `seo/SEO-y-GEO.md`. Resumen: título y descripción nuevos, `<h1>` único, JSON-LD completo (incluye FAQPage y BlogPosting), `robots.txt` con rastreadores de IA, `llms.txt`, `sitemap.xml` con imágenes.

## 6. Corrección de paso

- El botón «Agenda una cita» de Contacto tenía el correo roto (`carla.Si soy corredor, ¿me sirve Onexpert?di@…`). Corregido a `carla.orlandi@plexotech.cl`.

## Pendientes del cliente

- Respuesta de la pregunta «Si soy corredor, ¿me sirve OneXpert?» (hoy dice «Si, pero…»).
- Versiones en alta de los 4 dashboards (llegaron entre 443 y 626 px).
- Confirmar licencias de las imágenes nuevas.
- Revisión legal/comercial de las 5 guías nuevas antes de publicar.
