/* ══════════════════════════════════════════════════════════════════════════
   COMPARTIR UNA GUÍA · v12 (solo en guias/<id>/index.html)
   ──────────────────────────────────────────────────────────────────────────
   La barra «Compartir esta guía» funciona sin JavaScript: son enlaces
   normales a WhatsApp, LinkedIn, Facebook, X y correo. Este archivo suma:
     1. Botón «Compartir» con el menú nativo del teléfono o del sistema
        (navigator.share), solo donde el navegador lo permite.
     2. «Copiar enlace» al portapapeles, con aviso.
     3. Usa la dirección REAL de la página (sirve también en el sitio de
        prueba) y vuelve a armar los enlaces de cada red con ella.
   La vista previa (imagen, título y descripción) la arman las redes con
   las etiquetas Open Graph del <head> de cada guía.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var barras = [].slice.call(document.querySelectorAll('[data-compartir]'));
  if (!barras.length) return;

  /* dirección limpia de la página (sin #ancla ni ?parámetros) */
  var url = location.origin + location.pathname;
  var e = encodeURIComponent;

  barras.forEach(function (barra) {
    var titulo = barra.getAttribute('data-titulo') || document.title;
    var aviso = barra.querySelector('.compartir__aviso');

    function avisar(texto) {
      if (!aviso) return;
      aviso.textContent = texto;
      clearTimeout(avisar.t);
      avisar.t = setTimeout(function () { aviso.textContent = ''; }, 3200);
    }


    /* ── 3. Enlaces de cada red con la dirección real ─────────────────── */
    var redes = {
      whatsapp: 'https://wa.me/?text=' + e(titulo + ' ' + url),
      linkedin: 'https://www.linkedin.com/sharing/share-offsite/?url=' + e(url),
      facebook: 'https://www.facebook.com/sharer/sharer.php?u=' + e(url),
      x:        'https://twitter.com/intent/tweet?url=' + e(url) + '&text=' + e(titulo)
    };
    barra.querySelectorAll('[data-red]').forEach(function (a) {
      var red = a.getAttribute('data-red');
      if (redes[red]) a.href = redes[red];
      if (red === 'correo') a.href = 'mailto:?subject=' + e(titulo) + '&body=' + e(url);
    });


    /* ── 1. Menú nativo de compartir ──────────────────────────────────── */
    var nativo = barra.querySelector('.compartir__nativo');
    if (nativo && navigator.share) {
      nativo.hidden = false;
      nativo.addEventListener('click', function () {
        navigator.share({ title: titulo, url: url }).catch(function () { /* cancelado */ });
      });
    }


    /* ── 2. Copiar enlace ─────────────────────────────────────────────── */
    var copiar = barra.querySelector('.compartir__copiar');
    if (copiar && navigator.clipboard && window.isSecureContext) {
      copiar.hidden = false;
      copiar.addEventListener('click', function () {
        navigator.clipboard.writeText(url).then(function () {
          copiar.classList.add('is-copiado');
          avisar('Enlace copiado. Ya puedes pegarlo donde quieras.');
          setTimeout(function () { copiar.classList.remove('is-copiado'); }, 2000);
        }, function () { avisar('No se pudo copiar. Copia la dirección desde la barra del navegador.'); });
      });
    }
  });
})();
