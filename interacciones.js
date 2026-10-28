/* ══════════════════════════════════════════════════════════════════════════
   INTERACCIONES
   ──────────────────────────────────────────────────────────────────────────
   Todo lo que responde al usuario. Cada bloque es independiente: si borras
   uno, los demás siguen funcionando.

   Índice
     1. Cabecera: la cápsula se compacta al bajar + barra de progreso
     2. Menú lateral
     3. Enlace activo de la navegación
     4. Preguntas, tarjetas-imagen y lecturas que se abren
     5. Paneles horizontales («¿Cómo podemos ayudarle?»)
     6. Tarjetas apiladas: la de atrás se achica
     7. Revelado al desplazarse (y dibujo de íconos)
     8. Contadores
     9. Hero: el texto se aclara al bajar
    10. Botones magnéticos
    11. Inclinación 3D de tarjetas
    12. Brillo del vidrio que sigue al cursor
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var raiz = document.documentElement;
  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var punteroFino = window.matchMedia('(pointer: fine)').matches;
  var alBajar = [];                     /* funciones que corren en cada fotograma de scroll */


  /* ── 1. Cabecera ─────────────────────────────────────────────────────── */
  var cabecera = document.querySelector('.cabecera');
  var progreso = document.querySelector('.cabecera__progreso');
  alBajar.push(function () {
    var y = window.scrollY;
    if (cabecera) cabecera.classList.toggle('is-solida', y > 40);
    if (progreso) {
      var total = document.documentElement.scrollHeight - window.innerHeight;
      progreso.style.setProperty('--progreso', total > 0 ? Math.min(y / total, 1).toFixed(4) : 0);
    }
  });


  /* ── 2. Menú lateral ─────────────────────────────────────────────────── */
  var botonMenu = document.querySelector('.menu-boton');
  var menu = document.getElementById('panel-menu');
  if (botonMenu && menu) {
    [].forEach.call(menu.querySelectorAll('.panel-menu__enlace'), function (a, i) { a.style.setProperty('--i', i); });
    var abrir = function (sino) {
      raiz.classList.toggle('menu-abierto', sino);
      botonMenu.setAttribute('aria-expanded', sino ? 'true' : 'false');
      botonMenu.setAttribute('aria-label', sino ? 'Cerrar menú' : 'Abrir menú');
      if (sino) menu.removeAttribute('inert'); else menu.setAttribute('inert', '');
    };
    botonMenu.addEventListener('click', function () { abrir(!raiz.classList.contains('menu-abierto')); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a') || e.target.hasAttribute('data-cerrar-menu')) abrir(false); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && raiz.classList.contains('menu-abierto')) { abrir(false); botonMenu.focus(); }
    });
  }


  /* ── 3. Enlace activo de la navegación ───────────────────────────────────
     v12 · cada enlace del menú apunta a un id (#audiencias, #respaldo…).
     Ese id puede ser la sección completa o un ancla dentro de ella (en
     Audiencias el ancla está junto a la bajada). Se observa la SECCIÓN que
     lo contiene ([data-seccion]) y, si hay varias en pantalla (Respaldo
     está dentro de Soluciones), gana la que empieza más abajo en la página. */
  var enlaces = [].slice.call(document.querySelectorAll('.nav__enlace[href^="#"]'));
  if (enlaces.length && 'IntersectionObserver' in window) {
    var zonas = [];                       /* { el: sección, enlace: <a> } */
    enlaces.forEach(function (a) {
      var destino = document.getElementById(a.getAttribute('href').slice(1));
      if (!destino) return;
      var zona = destino.hasAttribute('data-seccion') ? destino : (destino.closest('[data-seccion]') || destino);
      zonas.push({ el: zona, enlace: a, visible: false });
    });
    var marcar = function () {
      var activa = null;
      zonas.forEach(function (z) {
        if (z.visible && (!activa || activa.el.compareDocumentPosition(z.el) & Node.DOCUMENT_POSITION_FOLLOWING)) activa = z;
      });
      enlaces.forEach(function (x) { x.removeAttribute('aria-current'); });
      if (activa) activa.enlace.setAttribute('aria-current', 'true');
    };
    var obsNav = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        zonas.forEach(function (z) { if (z.el === e.target) z.visible = e.isIntersecting; });
      });
      marcar();
    }, { rootMargin: '-45% 0px -50% 0px' });
    zonas.forEach(function (z) { obsNav.observe(z.el); });
  }


  /* ── 4. Elementos que se abren ───────────────────────────────────────────
     Preguntas (.pregunta), tarjetas-imagen (.mosaico__tarjeta) y lecturas:
     el botón cambia aria-expanded y el contenedor recibe .is-abierta.    */
  function alternar(boton, contenedor) {
    var abierto = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', abierto ? 'false' : 'true');
    if (contenedor) contenedor.classList.toggle('is-abierta', !abierto);
  }
  document.querySelectorAll('.pregunta__boton').forEach(function (b) {
    b.addEventListener('click', function () { alternar(b, b.closest('.pregunta')); });
  });
  document.querySelectorAll('.mosaico__boton').forEach(function (b) {
    b.addEventListener('click', function () { alternar(b, b.closest('.mosaico__tarjeta')); });
  });
  document.querySelectorAll('.lectura__boton').forEach(function (b) {
    b.addEventListener('click', function () { alternar(b, b.closest('.lectura')); });
  });


  /* ── 5. Paneles horizontales ─────────────────────────────────────────────
     Solo en pantallas ≥ 900 px y sin «reducir movimiento». La sección se
     alarga (un tramo de scroll por panel) y la pista se desplaza.        */
  var horizontales = [].slice.call(document.querySelectorAll('[data-componente="horizontal"]'));
  /* v7: además del ancho, exige un alto mínimo de pantalla. Y si con todo
     algún texto no cabe en su tarjeta, se apaga el modo horizontal: nunca
     se corta un texto. */
  var anchoMin = window.matchMedia('(min-width: 900px) and (min-height: 640px)');
  function textoCortado(h) {
    return [].some.call(h.querySelectorAll('.panel-h__texto'), function (t) {
      return t.scrollHeight > t.clientHeight + 2;
    });
  }
  function prepararHorizontal() {
    horizontales.forEach(function (h) {
      var activo = anchoMin.matches && !reducir;
      h.classList.toggle('is-activo', activo);
      if (activo && textoCortado(h)) { activo = false; h.classList.remove('is-activo'); }
      var n = parseInt(h.getAttribute('data-paneles'), 10) || 1;
      h.style.height = activo ? (n * 70 + 60) + 'vh' : '';
      if (!activo) h.querySelector('.horizontal__pista').style.transform = '';
    });
  }
  function moverHorizontal() {
    horizontales.forEach(function (h) {
      if (!h.classList.contains('is-activo')) return;
      var pista = h.querySelector('.horizontal__pista');
      var r = h.getBoundingClientRect();
      var recorrido = r.height - window.innerHeight;
      var k = recorrido > 0 ? Math.min(Math.max(-r.top / recorrido, 0), 1) : 0;
      /* v7: el recorrido termina con la última tarjeta entera en pantalla,
         con el mismo margen que la primera tiene a la izquierda */
      var ultima = pista.lastElementChild;
      var margen = parseFloat(getComputedStyle(pista).paddingLeft) || 0;
      var distancia = ultima ? ultima.offsetLeft + ultima.offsetWidth + margen - window.innerWidth
                             : pista.scrollWidth - window.innerWidth;
      pista.style.transform = 'translate3d(' + (-k * Math.max(distancia, 0)).toFixed(1) + 'px,0,0)';
      var barra = h.querySelector('.horizontal__barra span');
      if (barra) barra.style.setProperty('--avance', k.toFixed(4));
      var cont = h.querySelector('.horizontal__contador b');
      var n = parseInt(h.getAttribute('data-paneles'), 10) || 1;
      if (cont) cont.textContent = String(Math.min(n, Math.floor(k * n) + 1)).padStart(2, '0');
    });
  }
  if (horizontales.length) {
    prepararHorizontal();
    /* la tipografía web cambia el alto de los textos: se revisa al cargarla */
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(prepararHorizontal);
    alBajar.push(moverHorizontal);
    anchoMin.addEventListener ? anchoMin.addEventListener('change', prepararHorizontal) : anchoMin.addListener(prepararHorizontal);
  }


  /* ── 6. Tarjetas apiladas ────────────────────────────────────────────────
     Cuando la tarjeta siguiente empieza a cubrirla, la anterior se achica
     hasta un 94 % (variable --escala).                                   */
  var apiladas = [].slice.call(document.querySelectorAll('.apilada'));
  if (apiladas.length && !reducir) {
    alBajar.push(function () {
      apiladas.forEach(function (t, i) {
        var sig = apiladas[i + 1];
        if (!sig) return;
        var a = t.getBoundingClientRect(), b = sig.getBoundingClientRect();
        var k = Math.min(Math.max(1 - (b.top - a.top) / a.height, 0), 1);
        t.style.setProperty('--escala', (1 - k * 0.06).toFixed(4));
      });
    });
  }


  /* ── 7. Revelado al desplazarse ──────────────────────────────────────── */
  var aRevelar = document.querySelectorAll('.revelar');
  if (reducir || !('IntersectionObserver' in window)) {
    aRevelar.forEach(function (el) { el.classList.add('is-visible'); });
  } else {
    var obsRev = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); obsRev.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    aRevelar.forEach(function (el) { obsRev.observe(el); });
  }


  /* ── 8. Contadores ───────────────────────────────────────────────────────
     <span data-contador="45">45</span> cuenta de 0 a 45 al aparecer.
     El número final ya está en el HTML: sin JS se ve igual.              */
  var contadores = document.querySelectorAll('[data-contador]');
  if (!reducir && 'IntersectionObserver' in window) {
    var obsCont = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        obsCont.unobserve(e.target);
        var el = e.target, fin = parseFloat(el.getAttribute('data-contador')), t0 = null;
        (function paso(t) {
          if (t) { if (!t0) t0 = t; }
          var k = t0 ? Math.min((t - t0) / 1600, 1) : 0;
          el.textContent = Math.round(fin * (1 - Math.pow(1 - k, 3))).toLocaleString('es-CL');
          if (k < 1) requestAnimationFrame(paso);
        })();
      });
    }, { threshold: 0.6 });
    contadores.forEach(function (c) { obsCont.observe(c); });
  }


  /* ── 9. Hero: el texto se aclara al bajar ────────────────────────────── */
  var desv = document.querySelector('[data-desvanecer]');
  if (desv && !reducir) {
    alBajar.push(function () {
      var k = Math.min(window.scrollY / (window.innerHeight * 0.8), 1);
      desv.style.opacity = (1 - k * 0.9).toFixed(3);
      desv.style.translate = '0 ' + (k * 70).toFixed(1) + 'px';
    });
  }


  /* ── 10. Botones magnéticos ──────────────────────────────────────────── */
  if (punteroFino && !reducir) {
    document.querySelectorAll('[data-magnetico]').forEach(function (b) {
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.16).toFixed(1) + 'px,' +
                            ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)';
      });
      b.addEventListener('pointerleave', function () { b.style.transform = ''; });
    });
  }


  /* ── 11. Inclinación 3D de tarjetas ──────────────────────────────────────
     data-inclinar → gira hasta 6° siguiendo al cursor.                   */
  if (punteroFino && !reducir) {
    document.querySelectorAll('[data-inclinar]').forEach(function (t) {
      t.addEventListener('pointermove', function (e) {
        var r = t.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = 'perspective(1200px) rotateX(' + (y * -6).toFixed(2) + 'deg) rotateY(' + (x * 6).toFixed(2) + 'deg) translateY(-4px)';
      });
      t.addEventListener('pointerleave', function () { t.style.transform = ''; });
    });
  }


  /* ── 12. Brillo del vidrio que sigue al cursor ────────────────────────────
     Escribe --mx y --my (en %) en la superficie .vidrio bajo el cursor. */
  if (punteroFino && !reducir) {
    document.addEventListener('pointermove', function (e) {
      var v = e.target.closest && e.target.closest('.vidrio');
      if (!v) return;
      var r = v.getBoundingClientRect();
      v.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
      v.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    }, { passive: true });
  }


  /* ── Bucle de scroll: un solo cálculo por fotograma ──────────────────── */
  var pendiente = false;
  function tick() { pendiente = false; alBajar.forEach(function (f) { f(); }); }
  function pedir() { if (!pendiente) { pendiente = true; requestAnimationFrame(tick); } }
  window.addEventListener('scroll', pedir, { passive: true });
  window.addEventListener('resize', function () { prepararHorizontal && horizontales.length && prepararHorizontal(); pedir(); }, { passive: true });
  tick();
})();
