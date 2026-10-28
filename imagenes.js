/* ══════════════════════════════════════════════════════════════════════════
   IMÁGENES · respaldo remoto
   ──────────────────────────────────────────────────────────────────────────
   ⚠ ARCHIVO TEMPORAL. BÓRRALO ANTES DE PUBLICAR.

   Las fotos del sitio se referencian siempre en local (imagenes/fotos/…).
   Mientras no las hayas descargado, este script las pide a Unsplash para
   que puedas revisar la web completa desde ya.

   Cómo funciona: cada <img> con  data-remoto="https://images.unsplash.com/…"
   que no logre cargar su archivo local cambia su src al remoto. Si tampoco
   carga, se oculta y queda visible el degradado de marca del contenedor.

   Para producción:
     1. Ejecuta  imagenes/fotos/descargar-fotos.sh  (o .ps1 en Windows)
     2. Borra este archivo y su <script> al final del HTML
     3. Opcional: borra los atributos data-remoto
   Así ninguna imagen se carga desde un dominio externo, lo que simplifica
   la política de seguridad de contenidos (CSP).
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  function fallar(img) {
    var remoto = img.getAttribute('data-remoto');
    if (remoto && !img.hasAttribute('data-intento-remoto')) {
      img.setAttribute('data-intento-remoto', '');
      img.src = remoto;
      return;
    }
    img.classList.add('img--sin-foto');
  }

  document.querySelectorAll('img[data-remoto]').forEach(function (img) {
    img.addEventListener('error', function () { fallar(img); });
    /* el archivo local pudo fallar antes de que este script se ejecutara */
    if (img.complete && img.naturalWidth === 0) fallar(img);
  });
})();
