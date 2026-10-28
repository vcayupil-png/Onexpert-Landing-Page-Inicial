# Cómo agregar una guía nueva · v12

Cada guía es una carpeta dentro de `guias/` con un `index.html`. No hay que programar: se copia una guía existente y se cambian los textos.

## Pasos

1. **Elige el id** (será la dirección): minúsculas, sin tildes ni espacios. Ej. `como-pedir-un-reembolso-dental` → `https://servicios.onexpert.cl/guias/como-pedir-un-reembolso-dental/`.
2. **Copia una carpeta** de `guias/` (por ejemplo `reembolsos-de-salud-sin-rechazos/`) y renómbrala con el id nuevo.
3. **Imágenes**
   - Ilustración: `imagenes/guias/<nombre>.webp` + `.jpg` · 1400 × 782 px.
   - Vista previa para redes: `imagenes/social/guias/<id>.jpg` · 1200 × 630 px.
4. **En el `index.html` copiado**, reemplaza (usa «buscar» con el id antiguo para no olvidar ninguno):
   - El comentario del inicio (título, dirección, palabras clave).
   - `<title>` (≤ 65 caracteres, termina en `| OneXpert`) y `<meta name="description">` (≤ 155).
   - `canonical`, `og:url`, `og:title`, `og:description`, `og:image`, `og:image:alt`, `article:section`, `article:tag` y los `twitter:*`.
   - El JSON-LD: `url`, `headline`, `description`, `abstract`, `image`, `articleSection`, `keywords`, `timeRequired`, las migas y la **pregunta** del `FAQPage`.
   - En el cuerpo: migas, categoría y minutos de lectura, `<h1>`, bajada, foto, el post-it «En corto» (**pregunta de intención** + respuesta en 2–3 frases, igual que en el FAQPage), el texto y el recuadro «Cómo ayuda».
   - En las dos barras «Compartir»: `data-url`, `data-titulo` y los enlaces (o déjalos: `js/compartir.js` los corrige solos con la dirección real).
   - «Sigue leyendo»: elige 3 guías relacionadas.
5. **Biblioteca** `guias/index.html`: copia una tarjeta, cambia el `href="<id>/"`, la imagen, la categoría (`data-cat="Familias"` o `"Compañías"`), los textos y los contadores del filtro. Agrega la guía al `blogPost` del JSON-LD.
6. **`sitemap.xml`**: agrega un bloque `<url>` con la dirección nueva.
7. **`llms.txt`**: agrega una línea en «Guías».

## Revisión rápida antes de publicar

- La pregunta de «En corto» y la del `FAQPage` dicen exactamente lo mismo.
- La imagen 1200 × 630 existe y pesa menos de 300 KB.
- Probar la vista previa en https://developers.facebook.com/tools/debug/ y en https://www.linkedin.com/post-inspector/.
