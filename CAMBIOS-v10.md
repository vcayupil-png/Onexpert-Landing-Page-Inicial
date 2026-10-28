# Cambios v10 · OneXpert Servicios · 21 de octubre de 2026

Archivos nuevos: `css/10-ajustes-v10.css` · `css/11-expertito.css` · `js/v10.js` · `privacidad/index.html` · `404.html` · `.htaccess`
Archivos modificados: `index.html` · `guias/index.html` (cabecera, menú y pie sincronizados) · `sitemap.xml` · `llms.txt`

## 1. Menú y navegación global

| Pedido | Cómo quedó | Dónde |
|---|---|---|
| Redistribuir el menú | Logo · enlaces centrados con el mismo aire · botón. El menú completo se ve desde 1120 px (antes 1240). Menú móvil igualado al de escritorio (se quitaron «Empresas» y «Tecnología», que apuntaban a anclas inexistentes). | §10.1 |
| Espaciado global | Una sola medida para todo: `--seccion-y` (antes 150 px por lado = 300 px entre secciones; ahora ≈116 px por lado), `--bloque-y` entre bloques de una macro-sección y `--cabeza-y` bajo cada encabezado. Se cerraron los huecos que dejaron los módulos eliminados. En secciones con foto, el texto ya no empieza dentro del fundido. | §10.2 |
| Textos y tipografía | Escala única: h1 › h2 sección › h2 sub-bloque › h3 tarjeta grande › h3 tarjeta. Tarjetas apiladas, horizontales, mosaico y audiencias usan el mismo tamaño de h3. | §10.2 |

## 2. Fotos y fondos

- **Hero «Administración · Gestión · Riesgo de seguros»**: foto de la mano en el hombro con más saturación y viveza (`saturate 1.42`, contraste y brillo leves). §10.4
- **Trazabilidad (madre e hija)**: 8 luces bokeh dentro del recuadro, con deriva y respiración continuas (11–22 s por ciclo, desfasadas). La figura queda quieta adelante. §10.4

## 3. Macro-sección «Soluciones»

`<div class="macro" id="soluciones">` agrupa cuatro bloques; el menú «Soluciones» queda activo en todo el tramo:

1. **Introducción** (`#tecnologia`): rótulo «Soluciones con tecnología y respaldo» + tarjetas de tecnología.
2. **Bloque 1** (`#como-ayudamos`): Soluciones corporativas · ¿Cómo podemos ayudar? (4 tarjetas, ahora con anclas propias).
3. **Bloque 2** (`#indicadores`): Indicadores y compromiso.
4. **Bloque 3** (`#respaldo`): Respaldo.

Entre bloques hay menos aire que entre secciones y los titulares bajan un paso, para que se lean como partes de una misma sección.

## 4. Onex Servicios · propuesta de valor

- Rótulo: «Onex Servicios · Nuestra propuesta de valor».
- Titular: «Beneficios para ti **y para tus clientes.**» (alternativas en comentario: «Nuestra propuesta de valor», «Un enfoque integral»).
- La frase «Acompañamos al asegurado de una forma que también favorece a tu compañía» pasa a la bajada.
- Nuevo par de tarjetas **Beneficios compartidos**: Para tu compañía / Para tu asegurado.

## 5. Guías · Expertito

- Post-it grande (230–360 px) como introducción de la sección, junto al titular.
- Cara de Expertito vectorizada a partir del boceto (trazo de bolígrafo azul, círculos dobles, líneas de movimiento, brillos y sonrisa con remates).
- Animación (≈4,6 s): se dibuja el contorno → aparece el papel → ojo izquierdo → ojo derecho → líneas → pupilas → brillos → sonrisa → frase «¡Hola! Te acompaño en cada guía.». Después parpadea cada 6 s y flota suave.
- Las pupilas siguen el cursor con suavidad (`js/v10.js` §3).

## 6. Microanimaciones

| Ícono | Animación |
|---|---|
| Independencia técnica | La balanza busca el equilibrio (los platos se mantienen colgando). |
| Especialización y experiencia | **Ícono nuevo**: medalla que se mece y estrella que destella. El corazón anterior pasó a Acompañamiento. |
| Tecnología propia | Un dato viaja de un sistema al otro y el de destino se ilumina. |
| Acompañamiento | **Ícono nuevo**: dos personas, una con la mano en el hombro de la otra; el corazón late y la mano da un leve apretón. |
| SLA por tipo de siniestro | Agujas que giran (como el reloj 24/7). |
| Tablero de operación | Barras que suben y bajan como datos en vivo. |
| Reportería mensual | **Ícono nuevo** (antes repetía el de persona + escudo): hoja de reporte, la curva del mes se traza, el último dato late. |

Todas arrancan cuando el ícono termina de dibujarse y se detienen con «reducir movimiento».

## 7. Botón «Agenda una cita» y pie

- Se quitó el efecto de letras que saltan en todos los botones de cita.
- Hover nuevo: halo coral + amarillo post-it, canto amarillo y una respiración lenta de brillo.
- Pie: cada enlace baja a su bloque. Las tarjetas horizontales (TPA, Catástrofes, Integración) calculan su posición dentro del scroll; los pilares (Apoyo psicológico, Orientación financiera, Continuidad educacional) abren su acordeón. Funciona también al llegar con la URL (`/#catastrofes`). Destello breve en el destino.
- «Empresas» → «Compañías y sponsors» (`#companias`); «Integración por API» → «Integración con tus sistemas».
- Correos con ícono de sobre clicable.

## 8. Páginas nuevas y SEO

- **`privacidad/index.html`**: política de privacidad con índice, 10 apartados (Ley 19.628 / 21.719), JSON-LD WebPage + migas. ⚠ Borrador: completar razón social, RUT y domicilio, confirmar plazo de conservación (propuesta: 24 meses) y pasar por revisión legal.
- **`404.html`**: «Esta página se despegó.» con Expertito que se dibuja, busca con la mirada y cuelga de una esquina. Sin JavaScript, `noindex`. Activación en `.htaccess`. ⚠ Al pasar a producción cambiar `/servicio/` por `/` en `.htaccess` y en `<base href>` de `404.html`.
- **FAQPage (JSON-LD)**: ahora contiene solo las 4 preguntas visibles, con el mismo texto (antes declaraba 7, tres de ellas no visibles: Google lo penaliza).
- `sitemap.xml` con la página de privacidad; `llms.txt` con Soluciones, Catástrofes, propuesta de valor y privacidad.

## Pendientes del cliente

- Datos legales del responsable para la política de privacidad y su revisión.
- Respuesta de «Si soy corredor, ¿me sirve OneXpert?».
- Versiones en alta de los dashboards (pendiente desde v9).

## v10.1 · ajustes finales (21 oct)

- Titulares un ~12 % más chicos en toda la escala (h1, h2, sub-bloques y h3 de tarjetas).
- «stand-alone» nunca se corta (`.sin-corte`), y el titular de Soluciones ya no se mete bajo el post-it «No olvidar 2027».
- Post-it de Expertito en Guías: −15 % (máx. 306 px; móvil 238 px).
- Títulos de los post-it que se escriben a mano (y etiquetas manuscritas de la página de guías): tipografía **Caveat** (Google Fonts).
- 404: usa el post-it en PNG entregado (`imagenes/expertito/expertito-postit.webp` + `.png`), que entra «pegándose» y luego cuelga de una esquina y se mece.
