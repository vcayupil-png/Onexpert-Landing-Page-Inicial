/* ══════════════════════════════════════════════════════════════════════════
   GUÍAS · biblioteca (solo guias/index.html)
   ──────────────────────────────────────────────────────────────────────────
   1. Filtro por categoría: botones data-filtro-cat="todas | Familias | Compañías"
      ocultan las tarjetas que no coinciden. Sin JS se ven todas.
   2. Enlaces antiguos: hasta la v11 cada guía estaba en esta misma página
      (guias/#id). Ahora cada una tiene su carpeta (guias/id/). Si alguien
      llega con un enlace antiguo, se le lleva a la página nueva.
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';


  /* ── 2. Redirección de enlaces antiguos (va primero) ─────────────────── */
  var id = decodeURIComponent(location.hash.slice(1));
  if (id && /^[a-z0-9-]+$/.test(id) && id !== 'biblioteca') {
    var tarjeta = document.querySelector('.guia-tarjeta__enlace[href="' + id + '/"], .guia-destacada__enlace[href="' + id + '/"]');
    if (tarjeta) { location.replace(id + '/'); return; }
  }


  /* ── 1. Filtro por categoría ─────────────────────────────────────────── */
  var botones = [].slice.call(document.querySelectorAll('[data-filtro-cat]'));
  if (!botones.length) return;
  var tarjetas = [].slice.call(document.querySelectorAll('.guia-tarjeta[data-cat]'));

  function filtrar(cat) {
    botones.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-filtro-cat') === cat)); });
    tarjetas.forEach(function (el) { el.hidden = !(cat === 'todas' || el.getAttribute('data-cat') === cat); });
  }
  botones.forEach(function (b) {
    b.addEventListener('click', function () { filtrar(b.getAttribute('data-filtro-cat')); });
  });
})();
