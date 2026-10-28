# Open Graph, compartir y favicon · OneXpert Servicios · v12

Las etiquetas viven en el `<head>` de cada página, bloque **2 · OPEN GRAPH**. No las muevas a un archivo externo: Facebook, LinkedIn y WhatsApp no ejecutan JavaScript.

## 1. Una vista previa por página

| Página | og:type | Imagen (1200 × 630) |
|---|---|---|
| Portada `index.html` | website | `imagenes/social/og-servicios.jpg` (madre e hija) |
| Biblioteca `guias/index.html` | website | `imagenes/social/og-guias.jpg` |
| Cada guía `guias/<id>/index.html` | **article** | `imagenes/social/guias/<id>.jpg` |

Las 8 imágenes de guías se recortaron a 1200 × 630 desde la ilustración principal de cada guía (centradas, 55–117 KB). Si cambias la ilustración de una guía, exporta también su versión 1200 × 630 con el mismo nombre y sube el `?v=1` a `?v=2` en su página.

Medidas: **1200 × 630 px**, JPG, menos de 300 KB, sin texto importante en los 60 px del borde (WhatsApp recorta a cuadrado al centro).

## 2. ⚠ Dominio de prueba

Las imágenes apuntan hoy a `https://kreatividademocional.com/servicio/imagenes/…` para que la vista previa funcione mientras el sitio está en prueba. Las direcciones de las páginas (`og:url`, `canonical`) ya usan `https://servicios.onexpert.cl/`.

**Al publicar:** busca `kreatividademocional.com/servicio` y reemplázalo por `servicios.onexpert.cl` en todos los `.html`. Después pasa 2–3 direcciones por:

- Facebook: https://developers.facebook.com/tools/debug/ (botón «Volver a extraer»)
- LinkedIn: https://www.linkedin.com/post-inspector/

Mientras el sitio esté en prueba, WhatsApp y LinkedIn ya muestran la imagen; Facebook puede intentar leer `og:url` en el dominio definitivo y no mostrarla hasta publicar.

## 3. Botón «Compartir esta guía»

Está arriba (bajo el título) y al final de cada guía.

- **Sin JavaScript** funciona igual: son enlaces a WhatsApp, LinkedIn, Facebook, X y correo con la dirección de la guía.
- **Con JavaScript** (`js/compartir.js`):
  - En teléfonos y navegadores que lo permiten aparece el botón coral **Compartir**, que abre el menú nativo (Instagram, Telegram, Mensajes, etc.).
  - **Copiar enlace** copia la dirección y avisa «Enlace copiado».
  - Usa la dirección real de la página, así también funciona en el sitio de prueba.
- No carga scripts de terceros (ni de Facebook ni de LinkedIn), así que no afecta la privacidad ni la política de seguridad (CSP).

## 4. Favicon (`imagenes/favicon/`)

| Archivo | Medida | Uso |
|---|---|---|
| `favicon.ico` | 32 × 32 (incluye 16 × 16) | navegadores antiguos |
| `favicon.svg` | vectorial | navegadores modernos |
| `favicon-96x96.png` | 96 × 96 | accesos directos |
| `apple-touch-icon.png` | 180 × 180, sin transparencia | iPhone y iPad |
| `icon-192.png` / `icon-512.png` | 192 y 512 | Android (`site.webmanifest`) |
| `icon-maskable-512.png` | 512, símbolo en el 80 % central | Android con íconos recortados |

`theme-color` (#152838) colorea la barra del navegador en móviles.
