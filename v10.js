/* ═══════════════════════════════════════════════════════════════════════
   v10 · ANCLAS INTELIGENTES + EXPERTITO
   ───────────────────────────────────────────────────────────────────────
   Se carga después de interacciones.js y v8.js. Independiente: si lo
   borras, los enlaces siguen funcionando como anclas normales.

   Índice
     1. Anclas del pie que llegan al bloque exacto
        · tarjetas horizontales de Soluciones (Catástrofes, TPA…): calcula
          el punto del scroll en que esa tarjeta queda en pantalla
        · pilares de Beneficios (#portal-del-asegurado…): abre el acordeón
     2. Destello breve en el bloque de destino
     3. Expertito: las pupilas siguen suavemente al cursor
   ═══════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CABECERA = 100;   /* alto que ocupa la cápsula de la cabecera */


  /* ── 1. Anclas ─────────────────────────────────────────────────────── */
  function abrirPregunta(p) {
    var b = p.querySelector('.pregunta__boton');
    if (b && b.getAttribute('aria-expanded') !== 'true') b.click();
  }

  function destinoScroll(el) {
    var panel = el.closest('.panel-h');
    var h = panel && panel.closest('[data-componente="horizontal"]');
    if (h && h.classList.contains('is-activo')) {
      /* Modo horizontal fijo: la pista se mueve k · distancia al bajar.
         Buscamos el k en que la tarjeta queda alineada a la izquierda. */
      var pista = h.querySelector('.horizontal__pista');
      var ultima = pista.lastElementChild;
      var margen = parseFloat(getComputedStyle(pista).paddingLeft) || 0;
      var distancia = ultima.offsetLeft + ultima.offsetWidth + margen - window.innerWidth;
      var recorrido = h.offsetHeight - window.innerHeight;
      var k = distancia > 0 ? Math.min(Math.max((panel.offsetLeft - margen) / distancia, 0), 1) : 0;
      var arriba = h.getBoundingClientRect().top + window.scrollY;
      return arriba + k * recorrido + 2;
    }
    return el.getBoundingClientRect().top + window.scrollY - CABECERA;
  }

  function irA(id, suave) {
    var el = id && document.getElementById(id);
    if (!el) return false;
    var p = el.classList.contains('pregunta') ? el : null;
    if (p) abrirPregunta(p);
    /* esperar un fotograma: el acordeón cambia el alto antes de medir */
    requestAnimationFrame(function () {
      window.scrollTo({ top: destinoScroll(el), behavior: suave && !reducir ? 'smooth' : 'auto' });
      destello(el.closest('.panel-h') || el);
    });
    return true;
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return;
    var id = decodeURIComponent(a.getAttribute('href').slice(1));
    var el = id && document.getElementById(id);
    if (!el) return;
    /* solo intervenimos donde el ancla normal no basta */
    if (!el.closest('.panel-h') && !el.classList.contains('pregunta')) return;
    e.preventDefault();
    if (history.pushState) history.pushState(null, '', '#' + id);
    irA(id, true);
  });

  /* Llegando con la URL ya con #catastrofes, #apoyo-psicologico… */
  if (location.hash.length > 1) {
    var inicial = decodeURIComponent(location.hash.slice(1));
    var el0 = document.getElementById(inicial);
    if (el0 && (el0.closest('.panel-h') || el0.classList.contains('pregunta'))) {
      window.addEventListener('load', function () {
        /* se espera a la tipografía: el modo horizontal recalcula su alto al cargarla */
        var listo = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
        listo.then(function () { setTimeout(function () { irA(inicial, false); }, 400); });
      });
    }
  }


  /* ── 2. Destello en el destino ─────────────────────────────────────── */
  function destello(el) {
    if (reducir || !el) return;
    el.classList.remove('is-destino');
    void el.offsetWidth;
    el.classList.add('is-destino');
    setTimeout(function () { el.classList.remove('is-destino'); }, 2200);
  }


  /* ── 3. Expertito: mirada que sigue al cursor ──────────────────────── */
  var caras = [].slice.call(document.querySelectorAll('[data-expertito]'));
  if (caras.length && !reducir && window.matchMedia('(pointer: fine)').matches) {
    var pendiente = false, ultimo = null;
    document.addEventListener('pointermove', function (e) {
      ultimo = e;
      if (pendiente) return;
      pendiente = true;
      requestAnimationFrame(function () {
        pendiente = false;
        caras.forEach(function (c) {
          var mira = c.querySelector('.expertito__mira');
          if (!mira || !c.classList.contains('is-visible')) return;
          var r = c.getBoundingClientRect();
          if (r.bottom < 0 || r.top > window.innerHeight) return;
          var dx = ultimo.clientX - (r.left + r.width / 2);
          var dy = ultimo.clientY - (r.top + r.height * 0.45);
          var d = Math.sqrt(dx * dx + dy * dy) || 1;
          var f = Math.min(d / 420, 1);              /* cuanto más lejos, más mira */
          mira.style.transform = 'translate(' + (dx / d * 26 * f).toFixed(1) + 'px,' + (dy / d * 22 * f).toFixed(1) + 'px)';
        });
      });
    }, { passive: true });
  }
})();
