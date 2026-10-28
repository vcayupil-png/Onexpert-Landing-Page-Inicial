/* ══════════════════════════════════════════════════════════════════════════
   PARALLAX
   ──────────────────────────────────────────────────────────────────────────
   Dos tipos de movimiento, ambos configurables desde el HTML:

   1. Al desplazarse ─ atributo  data-parallax="0.3"
      El número es la velocidad relativa. 0 = se mueve con la página;
      0.3 = se queda atrás un 30 %; negativo = se adelanta.
      Úsalo en capas de fondo (fotos, facetas) y, con valores bajos, en el
      contenido para dar profundidad.

   2. Con el ratón ─ atributo  data-parallax-raton="16"
      El número son los píxeles máximos de desplazamiento. Solo actúa dentro
      del contenedor marcado con  data-parallax-zona  (el hero).

   Rendimiento: solo se calculan los elementos que están en pantalla
   (IntersectionObserver) y una vez por fotograma (requestAnimationFrame).
   Se desactiva por completo con «reducir movimiento» y en pantallas táctiles
   sin puntero fino (el parallax de ratón).
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducir) return;

  /* ── 1. Parallax al desplazarse ─────────────────────────────────────── */
  var capas = [].slice.call(document.querySelectorAll('[data-parallax]'));
  var visibles = new Set();
  var pendiente = false;

  function calcular() {
    pendiente = false;
    var alto = window.innerHeight;
    visibles.forEach(function (el) {
      var velocidad = parseFloat(el.getAttribute('data-parallax')) || 0;
      /* distancia entre el centro de la sección y el centro de la ventana */
      var zona = el.closest('[data-parallax-seccion]') || el.parentElement;
      var r = zona.getBoundingClientRect();
      var desplazamiento = (r.top + r.height / 2 - alto / 2) * -velocidad;
      el.style.translate = '0 ' + desplazamiento.toFixed(1) + 'px';
    });
  }
  function pedir() {
    if (!pendiente) { pendiente = true; requestAnimationFrame(calcular); }
  }

  if ('IntersectionObserver' in window) {
    var observador = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) visibles.add(e.target); else visibles.delete(e.target);
      });
      pedir();
    }, { rootMargin: '20% 0px 20% 0px' });
    capas.forEach(function (el) { observador.observe(el); });
  } else {
    capas.forEach(function (el) { visibles.add(el); });
  }
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', pedir, { passive: true });
  pedir();

  /* ── 2. Parallax con el ratón (solo punteros finos) ─────────────────── */
  if (!window.matchMedia('(pointer: fine)').matches) return;

  document.querySelectorAll('[data-parallax-zona]').forEach(function (zona) {
    var piezas = [].slice.call(zona.querySelectorAll('[data-parallax-raton]'));
    if (!piezas.length) return;
    var marco = false, px = 0, py = 0;

    zona.addEventListener('pointermove', function (e) {
      var r = zona.getBoundingClientRect();
      px = (e.clientX - r.left) / r.width - 0.5;   /* -0.5 … 0.5 */
      py = (e.clientY - r.top) / r.height - 0.5;
      if (marco) return;
      marco = true;
      requestAnimationFrame(function () {
        marco = false;
        piezas.forEach(function (p) {
          var fuerza = parseFloat(p.getAttribute('data-parallax-raton')) || 10;
          p.style.transform = 'translate3d(' + (px * fuerza * -2).toFixed(1) + 'px,' + (py * fuerza * -2).toFixed(1) + 'px,0)';
        });
      });
    });
    zona.addEventListener('pointerleave', function () {
      piezas.forEach(function (p) { p.style.transform = ''; });
    });
  });
})();
