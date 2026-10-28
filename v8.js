/* ══════════════════════════════════════════════════════════════════════════
   V8 · rediseño líquido + seguridad del formulario (octubre 2026)
   ──────────────────────────────────────────────────────────────────────────
   Idéntico en ambos sitios. Cada bloque es independiente.

   Índice
     0. Configuración  ← CAMBIA AQUÍ la clave del captcha
     1. Lente líquida de la navegación
     2. Post-it escrito a mano
     3. Formulario seguro (filtro de caracteres, validación, trampa, captcha)
     4. Video texturizado del pie (solo se reproduce cuando se ve)
     5. Agendar cita (Outlook / Microsoft Bookings) con la persona de contacto
   ══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  /* ── 0. Configuración ────────────────────────────────────────────────────
     CAPTCHA · Cloudflare Turnstile (gratuito, sin «elige los semáforos»).
     La clave de abajo es la CLAVE DE PRUEBA oficial de Cloudflare: siempre
     aprueba. Antes de publicar:
       1. Crea el sitio en dash.cloudflare.com → Turnstile.
       2. Pega aquí la «Site Key» (pública).
       3. En el servidor valida el token con la «Secret Key» en
          https://challenges.cloudflare.com/turnstile/v0/siteverify
          Sin esa validación en el servidor, el captcha no protege nada.  */
  var CONFIG = {
    turnstileSitekey: '1x00000000000000000000AA',
    turnstileScript: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
    segundosMinimos: 3,           /* un envío más rápido que esto se trata como bot */

    /* CITAS · todos los botones con data-bookings abren la ventana de cita.
       citaCorreo:  a quién le llega la invitación (Outlook / Teams).
       bookingsUrl: enlace de la página de Microsoft Bookings. Para obtenerlo:
         Outlook web → Calendario → «Bookings with me» → «Copiar vínculo»
         (o Microsoft Bookings → página de reservas → «Compartir»).
         Mientras esté vacío, la cita se coordina con la invitación de Outlook. */
    citaCorreo: 'contacto@onexpert.cl',
    bookingsUrl: '',
    citaMinutos: 30
  };

  var reducir = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ── 1. Lente líquida de la navegación ───────────────────────────────── */
  document.querySelectorAll('.nav').forEach(function (nav) {
    var lente = document.createElement('span');
    lente.className = 'nav__lente';
    lente.setAttribute('aria-hidden', 'true');
    nav.insertBefore(lente, nav.firstChild);
    var enlaces = [].slice.call(nav.querySelectorAll('.nav__enlace'));
    /* v9 · en páginas internas (guias/) el enlace de la página trae aria-current="page" desde el HTML */
    var actual = enlaces.filter(function (a) { return a.getAttribute('aria-current') === 'page'; })[0] || null, temporizador;

    function mover(a) {
      if (!a) { lente.classList.remove('is-lista'); return; }
      var ancho = a.offsetWidth + 14;
      var x = a.offsetLeft - 7;
      var antes = parseFloat(lente.style.getPropertyValue('--lente-x')) || x;
      lente.style.setProperty('--lente-ancho', ancho + 'px');
      lente.style.setProperty('--lente-x', x + 'px');
      /* se estira en proporción a la distancia y luego rebota */
      if (!reducir && lente.classList.contains('is-lista')) {
        var estira = Math.min(1 + Math.abs(x - antes) / 400, 1.35);
        lente.style.setProperty('--lente-estira', estira.toFixed(3));
        clearTimeout(temporizador);
        temporizador = setTimeout(function () { lente.style.setProperty('--lente-estira', '1'); }, 200);
      }
      lente.classList.add('is-lista');
    }
    function alActual() { mover(actual); }

    enlaces.forEach(function (a) {
      a.addEventListener('pointerenter', function () { mover(a); });
      a.addEventListener('focus', function () { mover(a); });
    });
    nav.addEventListener('pointerleave', alActual);
    nav.addEventListener('focusout', function () { setTimeout(alActual, 0); });

    /* la sección visible la marca js/interacciones.js con aria-current */
    if ('MutationObserver' in window) {
      new MutationObserver(function () {
        actual = enlaces.filter(function (a) { var v = a.getAttribute('aria-current'); return v === 'true' || v === 'page'; })[0] || null;
        if (!nav.matches(':hover')) alActual();
      }).observe(nav, { attributes: true, subtree: true, attributeFilter: ['aria-current'] });
    }
    window.addEventListener('resize', alActual, { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(alActual);
  });


  /* ── 2. Post-it escrito a mano ───────────────────────────────────────────
     Parte el título en letras (los lectores de pantalla leen la frase
     completa en un span oculto) y las «escribe» cuando el post-it entra
     en pantalla. Un lápiz sigue la última letra.                         */
  var PASO = 52, ESPERA = 250;
  var LAPIZ = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21l1.2-4.4L16.6 4.2a2 2 0 0 1 2.8 0l.4.4a2 2 0 0 1 0 2.8L7.4 19.8z"/><path d="M14.5 6.3l3.2 3.2"/></svg>';
  var SUBRAYADO = '<svg class="postit__subrayado" viewBox="0 0 200 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M3 8c30-5 60-6 95-3s65 3 99-2"/></svg>';

  document.querySelectorAll('.postit').forEach(function (postit) {
    var titulo = postit.querySelector('.postit__titulo');
    if (!titulo || titulo.querySelector('.letra')) return;
    var texto = titulo.textContent.replace(/\s+/g, ' ').trim();
    titulo.textContent = '';

    var lector = document.createElement('span');
    lector.className = 'solo-lectores';
    lector.textContent = texto;
    var visible = document.createElement('span');
    visible.setAttribute('aria-hidden', 'true');

    var i = 0;
    texto.split(' ').forEach(function (palabra, n, todas) {
      var p = document.createElement('span');
      p.className = 'palabra';
      palabra.split('').forEach(function (c) {
        var l = document.createElement('span');
        l.className = 'letra';
        l.style.setProperty('--i', i++);
        l.textContent = c;
        p.appendChild(l);
      });
      visible.appendChild(p);
      if (n < todas.length - 1) {
        var esp = document.createElement('span');
        esp.className = 'letra';
        esp.style.setProperty('--i', i++);
        esp.textContent = ' ';
        visible.appendChild(esp);
      }
    });
    titulo.appendChild(lector);
    titulo.appendChild(visible);
    titulo.insertAdjacentHTML('beforeend', SUBRAYADO);
    var lapiz = document.createElement('span');
    lapiz.className = 'postit__lapiz';
    lapiz.setAttribute('aria-hidden', 'true');
    lapiz.innerHTML = LAPIZ;
    titulo.appendChild(lapiz);

    var fin = ESPERA + i * PASO + 160;
    postit.style.setProperty('--fin', (fin / 1000).toFixed(2) + 's');
    postit.classList.add('postit--escritura');
  });

  function escribir(postit) {
    if (postit.classList.contains('is-escrito')) return;
    postit.classList.add('is-escrito');
    if (reducir) return;
    var letras = [].slice.call(postit.querySelectorAll('.postit__titulo .letra'));
    var lapiz = postit.querySelector('.postit__lapiz');
    var titulo = postit.querySelector('.postit__titulo');
    if (!lapiz || !titulo) return;
    lapiz.style.opacity = '0.85';
    letras.forEach(function (l, k) {
      setTimeout(function () {
        var r = l.getBoundingClientRect(), t = titulo.getBoundingClientRect();
        lapiz.style.transform = 'translate(' + (r.right - t.left - 2).toFixed(1) + 'px,' + (r.bottom - t.top - 24).toFixed(1) + 'px)';
      }, ESPERA + k * PASO);
    });
    setTimeout(function () { lapiz.style.opacity = '0'; }, ESPERA + letras.length * PASO + 300);
  }

  var postits = document.querySelectorAll('.postit--escritura');
  if (!('IntersectionObserver' in window)) {
    postits.forEach(function (p) { p.classList.add('is-escrito'); });
  } else {
    var obsPostit = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (!e.isIntersecting) return;
        obsPostit.unobserve(e.target);
        setTimeout(function () { escribir(e.target); }, 350);
      });
    }, { threshold: 0.55 });
    postits.forEach(function (p) { obsPostit.observe(p); });
  }


  /* ── 3. Formulario seguro ────────────────────────────────────────────────
     Capa del navegador (la del servidor es OBLIGATORIA igual):
       · Lista blanca de caracteres por tipo de campo (data-filtro).
         Bloquea  < > / \ { } [ ] ` " ' ; = | $ & # * ^ ~  y similares,
         que son los que permiten insertar HTML, scripts o consultas.
       · Largo máximo (maxlength en el HTML).
       · Campo trampa invisible + tiempo mínimo de llenado (anti-bots).
       · Captcha Turnstile: sin token, no se envía.
       · Validación de correo, RUT (dígito verificador) y consentimiento.  */
  var FILTROS = {
    nombre:   /[^\p{L}\p{M}\p{N}\s.,()\-]/gu,
    texto:    /[^\p{L}\p{M}\p{N}\s.,()\-]/gu,
    correo:   /[^A-Za-z0-9.@_+\-]/g,
    rut:      /[^0-9kK.\-]/g,
    telefono: /[^0-9+\s()\-]/g,
    parrafo:  /[^\p{L}\p{M}\p{N}\s.,:¿?¡!()%°\-]/gu
  };
  var AVISO_CARACTERES = 'Estos símbolos pueden usarse para insertar código: < > / \\ { } " \' ; = $ &';

  var ICONO_ALERTA = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 3.2 18 17H2z"/><path d="M10 8.3v3.9M10 14.6v.1"/></svg>';
  var ICONO_ESCUDO = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2.5 16 5v4.6c0 3.8-2.6 6.6-6 7.9-3.4-1.3-6-4.1-6-7.9V5z"/><path d="M7.6 7.6l4.8 4.8M12.4 7.6l-4.8 4.8"/></svg>';
  var ICONO_OK = '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="10" cy="10" r="7.5"/><path d="m6.6 10.2 2.3 2.3 4.6-4.9"/></svg>';

  /* tipo: 'error' (validación) o 'seguridad' (caracteres bloqueados) */
  function aviso(campo, texto, tipo) {
    var a = campo.querySelector('.campo__aviso');
    if (!a) {
      a = document.createElement('span');
      a.className = 'campo__aviso';
      a.setAttribute('role', 'alert');
      campo.appendChild(a);
    }
    a.innerHTML = '';
    if (texto) {
      a.insertAdjacentHTML('afterbegin', tipo === 'seguridad' ? ICONO_ESCUDO : ICONO_ALERTA);
      var s = document.createElement('span');
      s.textContent = texto;               /* textContent: nunca se interpreta como HTML */
      a.appendChild(s);
    }
    a.classList.toggle('is-visible', !!texto);
    a.classList.toggle('campo__aviso--seguridad', tipo === 'seguridad');
    campo.classList.toggle('is-error', !!texto);
    if (texto) {
      campo.classList.remove('is-sacudida');
      void campo.offsetWidth;              /* reinicia la animación */
      campo.classList.add('is-sacudida');
    }
  }

  /* lista legible de los caracteres que se quitaron: «<» «/» */
  function bloqueados(antes, filtro) {
    var vistos = {};
    (antes.match(filtro) || []).forEach(function (c) { if (c.trim()) vistos[c] = 1; });
    return Object.keys(vistos).slice(0, 6).map(function (c) { return '«' + c + '»'; }).join(' ');
  }

  function rutValido(rut) {
    var limpio = rut.replace(/[.\-]/g, '').toUpperCase();
    if (!/^\d{7,8}[0-9K]$/.test(limpio)) return false;
    var cuerpo = limpio.slice(0, -1), dv = limpio.slice(-1), suma = 0, m = 2;
    for (var k = cuerpo.length - 1; k >= 0; k--) { suma += parseInt(cuerpo[k], 10) * m; m = m === 7 ? 2 : m + 1; }
    var r = 11 - (suma % 11);
    return dv === (r === 11 ? '0' : r === 10 ? 'K' : String(r));
  }

  /* Carga diferida del captcha: solo cuando el formulario se acerca */
  var turnstileListo = null;
  function cargarTurnstile() {
    if (turnstileListo) return turnstileListo;
    turnstileListo = new Promise(function (ok, mal) {
      if (window.turnstile) { ok(window.turnstile); return; }
      var s = document.createElement('script');
      s.src = CONFIG.turnstileScript;
      s.async = true;
      s.onload = function () {
        var n = 0;
        (function esperar() {
          if (window.turnstile) ok(window.turnstile);
          else if (n++ < 50) setTimeout(esperar, 100);
          else mal();
        })();
      };
      s.onerror = mal;
      document.head.appendChild(s);
      setTimeout(mal, 12000);
    });
    return turnstileListo;
  }

  document.querySelectorAll('form[data-seguro]').forEach(function (form) {
    var inicio = Date.now();
    var estado = form.querySelector('.formulario__estado');
    var widget = form.querySelector('.captcha__widget');
    var estadoCaptcha = form.querySelector('.captcha__estado');
    var idWidget = null, token = '';
    var captcha = form.querySelector('.captcha');
    function estadoCap(tipo, texto) {
      if (captcha) captcha.setAttribute('data-estado', tipo);
      if (estadoCaptcha) estadoCaptcha.textContent = texto;
    }

    function mensaje(tipo, texto) {
      if (!estado) return;
      estado.className = 'formulario__estado is-' + tipo;
      estado.innerHTML = tipo === 'ok' ? ICONO_OK : ICONO_ALERTA;
      var s = document.createElement('span');
      s.textContent = texto;
      estado.appendChild(s);
    }

    /* 3a · filtro en vivo (teclado, pegar, autocompletar) */
    form.querySelectorAll('[data-filtro]').forEach(function (el) {
      var filtro = FILTROS[el.getAttribute('data-filtro')];
      if (!filtro) return;
      el.addEventListener('input', function () {
        var original = el.value;
        var limpio = original.replace(filtro, '');
        if (limpio !== original) {
          var pos = el.selectionStart - (el.value.length - limpio.length);
          el.value = limpio;
          try { el.setSelectionRange(pos, pos); } catch (err) { /* select/email */ }
          var campo = el.closest('.campo');
          var lista = bloqueados(original, filtro);
          aviso(campo, (lista ? 'Quitamos ' + lista + ' por seguridad. ' : 'Quitamos un símbolo no permitido. ') + AVISO_CARACTERES, 'seguridad');
          clearTimeout(campo._tAviso);
          campo._tAviso = setTimeout(function () { aviso(campo, ''); }, 4500);
        } else if (el.closest('.campo').hasAttribute('data-validacion')) {
          el.closest('.campo').removeAttribute('data-validacion');
          aviso(el.closest('.campo'), '');
        }
      });
    });

    /* 3b · captcha */
    if (widget) {
      var montar = function () {
        estadoCap('cargando', 'Cargando verificación…');
        cargarTurnstile().then(function (ts) {
          if (idWidget !== null) return;
          idWidget = ts.render(widget, {
            sitekey: CONFIG.turnstileSitekey,
            theme: 'dark',
            language: 'es',
            callback: function (t) { token = t; estadoCap('ok', 'Verificación completada. Ya puedes enviar.'); },
            'expired-callback': function () { token = ''; estadoCap('error', 'La verificación venció. Vuelve a marcarla.'); },
            'error-callback': function () { token = ''; estadoCap('error', 'No pudimos verificar. Intenta de nuevo.'); }
          });
          estadoCap('pendiente', 'Marca la casilla para confirmar que no eres un robot.');
        }, function () {
          estadoCap('error', 'No se pudo cargar la verificación anti-spam. Revisa tu conexión o escríbenos por correo.');
        });
      };
      if ('IntersectionObserver' in window) {
        var obsForm = new IntersectionObserver(function (e) {
          if (e[0].isIntersecting) { obsForm.disconnect(); montar(); }
        }, { rootMargin: '400px 0px' });
        obsForm.observe(form);
      } else { montar(); }
    }

    /* 3c · envío */
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var errores = 0;

      /* trampa: un bot llena todo, una persona no ve este campo */
      var trampa = form.querySelector('.trampa input');
      if ((trampa && trampa.value) || (Date.now() - inicio) / 1000 < CONFIG.segundosMinimos) {
        mensaje('error', 'No pudimos procesar el envío. Espera unos segundos e inténtalo otra vez.');
        return;
      }

      form.querySelectorAll('input:not([type="checkbox"]):not([type="hidden"]), select, textarea').forEach(function (el) {
        if (el.closest('.trampa')) return;
        var campo = el.closest('.campo');
        if (!campo) return;
        var filtro = FILTROS[el.getAttribute('data-filtro')];
        if (filtro && el.value) el.value = el.value.replace(filtro, '');
        el.value = el.value.replace(/[ \t]{2,}/g, ' ').trim();
        var problema = '';
        if (el.required && !el.value) problema = 'Este campo es obligatorio.';
        else if (el.type === 'email' && el.value && !/^[A-Za-z0-9._+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$/.test(el.value)) problema = 'Revisa el formato del correo.';
        else if (el.getAttribute('data-filtro') === 'rut' && el.value && !rutValido(el.value)) problema = 'El RUT no es válido. Revisa el dígito verificador.';
        else if (el.maxLength > 0 && el.value.length > el.maxLength) problema = 'El texto es demasiado largo.';
        aviso(campo, problema);
        if (problema) { errores++; campo.setAttribute('data-validacion', ''); }
      });

      var casilla = form.querySelector('.consentimiento input');
      if (casilla && !casilla.checked) { errores++; mensaje('error', 'Para continuar, marca la autorización de tratamiento de datos.'); }

      if (errores) {
        if (!casilla || casilla.checked) mensaje('error', 'Revisa los campos marcados.');
        var primero = form.querySelector('.is-error input, .is-error select, .is-error textarea');
        if (primero) primero.focus();
        return;
      }
      if (widget && !token) { mensaje('error', 'Completa la verificación anti-spam antes de enviar.'); if (captcha) { captcha.classList.remove('is-sacudida'); void captcha.offsetWidth; captcha.classList.add('is-sacudida'); } return; }

      /* ENVÍO REAL: define data-endpoint="/ruta" en el <form>. El servidor
         debe volver a validar todo, escapar los textos y verificar el token
         del captcha (campo cf-turnstile-response). */
      var destino = form.getAttribute('data-endpoint');
      var terminar = function () {
        mensaje('ok', form.getAttribute('data-gracias') || 'Gracias. Recibimos tu solicitud y te contactaremos pronto.');
        form.reset();
        token = '';
        if (window.turnstile && idWidget !== null) window.turnstile.reset(idWidget);
      };
      if (destino) {
        fetch(destino, { method: 'POST', body: new FormData(form), credentials: 'same-origin' })
          .then(function (r) { if (!r.ok) throw new Error(); terminar(); })
          .catch(function () { mensaje('error', 'No pudimos enviar el formulario. Inténtalo de nuevo o escríbenos por correo.'); });
      } else {
        terminar();      /* maqueta: sin servidor conectado todavía */
      }
    });
  });


  /* ── 4. Video texturizado del pie ────────────────────────────────────── */
  document.querySelectorAll('.pie__textura video').forEach(function (v) {
    v.muted = true;
    if (reducir || !('IntersectionObserver' in window)) return;
    new IntersectionObserver(function (e) {
      if (e[0].isIntersecting) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    }, { rootMargin: '200px 0px' }).observe(v);
  });


  /* ── 5. Agendar cita ─────────────────────────────────────────────────────
     Al pulsar un botón [data-bookings] se abre una ventana de vidrio donde la
     persona elige día y hora. Tres salidas, sin servidor:
       1. «Enviar invitación en Outlook»: abre Outlook (Microsoft 365) con la
          reunión ya armada y CONFIG.citaCorreo como invitada → llega al
          calendario de Microsoft de la persona de contacto.
       
       3. «Ver disponibilidad en Microsoft Bookings»: aparece solo si
          CONFIG.bookingsUrl tiene valor.
     Sin JavaScript, el enlace es un mailto: a la misma persona.            */
  var dosDig = function (n) { return (n < 10 ? '0' : '') + n; };
  function fechaLocal(d) { return d.getFullYear() + '-' + dosDig(d.getMonth() + 1) + '-' + dosDig(d.getDate()) + 'T' + dosDig(d.getHours()) + ':' + dosDig(d.getMinutes()) + ':00'; }
  function fechaICS(d) { return d.getUTCFullYear() + dosDig(d.getUTCMonth() + 1) + dosDig(d.getUTCDate()) + 'T' + dosDig(d.getUTCHours()) + dosDig(d.getUTCMinutes()) + '00Z'; }
  function icsTexto(s) { return String(s).replace(/[\\;,]/g, function (c) { return '\\' + c; }).replace(/\n/g, '\\n'); }
  function diaLocal(d) { return d.getFullYear() + '-' + dosDig(d.getMonth() + 1) + '-' + dosDig(d.getDate()); }

  var botonesCita = document.querySelectorAll('a[data-bookings]');
  if (botonesCita.length && window.HTMLDialogElement) {
    var sitio = document.documentElement.getAttribute('data-sitio') === 'liquidadora' ? 'OneXpert Liquidadora' : 'OneXpert Servicios';
    var CAL_SVG = '<svg class="boton__icono" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4.5" width="14" height="12.5" rx="2.5"/><path d="M3 8.5h14M7 2.8v3.4M13 2.8v3.4"/></svg>';
    var horas = [];
    for (var h = 9; h <= 17; h++) { horas.push(dosDig(h) + ':00'); if (h < 17) horas.push(dosDig(h) + ':30'); }

    var dlg = document.createElement('dialog');
    dlg.className = 'agenda vidrio vidrio--fuerte';
    dlg.setAttribute('aria-labelledby', 'cita-titulo');
    dlg.innerHTML =
      '<button class="agenda__cerrar" type="button" aria-label="Cerrar">×</button>' +
      '<p class="rotulo">Agenda una cita</p>' +
      '<h2 class="agenda__titulo" id="cita-titulo">Elige un día y una hora</h2>' +
      '<p class="agenda__bajada">Te llevamos directo al calendario de Microsoft de nuestro equipo comercial. La reunión dura ' + CONFIG.citaMinutos + ' minutos y puede ser por Teams.</p>' +
      '<form class="agenda__form" novalidate>' +
        '<div class="campos-2">' +
          '<div class="campo"><label for="cita-nombre">Nombre y cargo</label><input id="cita-nombre" type="text" maxlength="80" data-filtro="nombre" autocomplete="name" required></div>' +
          '<div class="campo"><label for="cita-empresa">Compañía</label><input id="cita-empresa" type="text" maxlength="80" data-filtro="texto" autocomplete="organization" required></div>' +
        '</div>' +
        '<div class="campos-2">' +
          '<div class="campo"><label for="cita-dia">Día (lunes a viernes)</label><input id="cita-dia" type="date" required></div>' +
          '<div class="campo"><label for="cita-hora">Hora (Chile)</label><select id="cita-hora" required>' + horas.map(function (x) { return '<option>' + x + '</option>'; }).join('') + '</select></div>' +
        '</div>' +
        '<div class="campo"><label for="cita-tema">Tema (opcional)</label><input id="cita-tema" type="text" maxlength="120" data-filtro="parrafo"></div>' +
        '<div class="agenda__acciones">' +
          '<button class="boton boton--accion" type="submit" value="outlook">' + CAL_SVG + '<span class="boton__texto" data-texto="Enviar invitación en Outlook"><span>Enviar invitación en Outlook</span></span></button>' +
        '</div>' +
        '<p class="formulario__estado" role="status" aria-live="polite"></p>' +
      '</form>' +
      '<div class="agenda__bookings" hidden><a class="boton boton--cita" target="_blank" rel="noopener noreferrer">' + CAL_SVG + '<span class="boton__texto" data-texto="Ver disponibilidad en Microsoft Bookings"><span>Ver disponibilidad en Microsoft Bookings</span></span></a></div>';
      /* v9 · se quitó el pie «La invitación le llega a …» (pedido del cliente):
         el correo de destino sigue en CONFIG.citaCorreo y en el mensaje de confirmación. */
    document.body.appendChild(dlg);

    if (CONFIG.bookingsUrl) {
      var bk = dlg.querySelector('.agenda__bookings');
      bk.hidden = false;
      bk.querySelector('a').href = CONFIG.bookingsUrl;
    }
    var formCita = dlg.querySelector('.agenda__form');
    var estadoCita = formCita.querySelector('.formulario__estado');
    var dia = dlg.querySelector('#cita-dia');

    /* mismo filtro de seguridad que el formulario principal */
    formCita.querySelectorAll('[data-filtro]').forEach(function (el) {
      var filtro = FILTROS[el.getAttribute('data-filtro')];
      el.addEventListener('input', function () {
        var original = el.value, limpio = original.replace(filtro, '');
        if (limpio !== original) {
          el.value = limpio;
          var campo = el.closest('.campo'), lista = bloqueados(original, filtro);
          aviso(campo, (lista ? 'Quitamos ' + lista + ' por seguridad. ' : 'Quitamos un símbolo no permitido. ') + AVISO_CARACTERES, 'seguridad');
          clearTimeout(campo._tAviso);
          campo._tAviso = setTimeout(function () { aviso(campo, ''); }, 4500);
        }
      });
    });

    function abrirCita(e) {
      e.preventDefault();
      var min = new Date();
      min.setDate(min.getDate() + 1);
      while (min.getDay() === 0 || min.getDay() === 6) min.setDate(min.getDate() + 1);
      dia.min = diaLocal(min);
      if (!dia.value || dia.value < dia.min) dia.value = dia.min;
      estadoCita.className = 'formulario__estado';
      dlg.showModal();
      dlg.querySelector('#cita-nombre').focus();
    }
    botonesCita.forEach(function (a) { a.addEventListener('click', abrirCita); });
    dlg.querySelector('.agenda__cerrar').addEventListener('click', function () { dlg.close(); });
    dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });   /* clic fuera de la ventana */

    function estado(tipo, texto) {
      estadoCita.className = 'formulario__estado is-' + tipo;
      estadoCita.innerHTML = tipo === 'ok' ? ICONO_OK : ICONO_ALERTA;
      var s = document.createElement('span'); s.textContent = texto; estadoCita.appendChild(s);
    }

    formCita.addEventListener('submit', function (e) {
      e.preventDefault();
      var modo = (e.submitter && e.submitter.value) || 'outlook';
      var nombre = dlg.querySelector('#cita-nombre'), empresa = dlg.querySelector('#cita-empresa');
      var tema = dlg.querySelector('#cita-tema'), hora = dlg.querySelector('#cita-hora');
      var faltan = 0;
      [nombre, empresa, dia].forEach(function (el) {
        el.value = el.value.trim();
        var problema = el.value ? '' : 'Este campo es obligatorio.';
        if (el === dia && el.value) {
          var d0 = new Date(el.value + 'T12:00:00');
          if (el.value < el.min) problema = 'Elige una fecha desde mañana.';
          else if (d0.getDay() === 0 || d0.getDay() === 6) problema = 'Atendemos de lunes a viernes.';
        }
        aviso(el.closest('.campo'), problema);
        if (problema) faltan++;
      });
      if (faltan) { estado('error', 'Revisa los campos marcados.'); return; }

      var inicio = new Date(dia.value + 'T' + hora.value + ':00');
      var fin = new Date(inicio.getTime() + CONFIG.citaMinutos * 60000);
      var asunto = 'Reunión ' + sitio + ' · ' + empresa.value;
      var cuerpo = 'Solicitud de cita desde ' + (location.hostname || 'el sitio web') +
        '\n\nNombre y cargo: ' + nombre.value + '\nCompañía: ' + empresa.value +
        (tema.value ? '\nTema: ' + tema.value : '') +
        '\n\nHorario propuesto: ' + dia.value + ' a las ' + hora.value + ' (hora de Chile).';

      if (modo === 'ics') {
        var ics = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//OneXpert//Cita web//ES', 'METHOD:REQUEST', 'BEGIN:VEVENT',
          'UID:' + Date.now() + '@onexpert.cl', 'DTSTAMP:' + fechaICS(new Date()), 'DTSTART:' + fechaICS(inicio), 'DTEND:' + fechaICS(fin),
          'SUMMARY:' + icsTexto(asunto), 'DESCRIPTION:' + icsTexto(cuerpo),
          'ATTENDEE;ROLE=REQ-PARTICIPANT;RSVP=TRUE:mailto:' + CONFIG.citaCorreo,
          'END:VEVENT', 'END:VCALENDAR'].join('\r\n');
        var enlace = document.createElement('a');
        enlace.href = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
        enlace.download = 'cita-onexpert.ics';
        document.body.appendChild(enlace); enlace.click(); enlace.remove();
        estado('ok', 'Descargamos la invitación. Ábrela con Outlook y envíala: le llegará a ' + CONFIG.citaCorreo + '.');
        return;
      }
      /* Outlook web (Microsoft 365): reunión armada con la persona de contacto como invitada */
      var url = 'https://outlook.office.com/calendar/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent' +
        '&subject=' + encodeURIComponent(asunto) +
        '&body=' + encodeURIComponent(cuerpo) +
        '&startdt=' + encodeURIComponent(fechaLocal(inicio)) +
        '&enddt=' + encodeURIComponent(fechaLocal(fin)) +
        '&to=' + encodeURIComponent(CONFIG.citaCorreo) +
        '&online=true';
      window.open(url, '_blank', 'noopener');
      estado('ok', 'Abrimos Outlook con la reunión lista. Revisa y pulsa «Enviar»: la invitación le llegará a ' + CONFIG.citaCorreo + '.');
    });
  }
})();
