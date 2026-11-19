/* Panel de la nariz electrónica · interacción y animación.
   Sin este archivo la página sigue completa; aquí solo se añade movimiento. */
(function () {
    "use strict";
    var $ = function (s, r) { return (r || document).querySelector(s); };
    var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
    var reducido = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var SVGNS = "http://www.w3.org/2000/svg";
    function leerJSON(id) { var el = document.getElementById(id); try { return el ? JSON.parse(el.textContent) : null; } catch (e) { return null; } }
    var CLASES = leerJSON("json-clases") || {};
    var DIAG = leerJSON("json-diagrama") || {};
    var DATA = leerJSON("json-dataset");
    function nombreClase(c) { return CLASES[c] ? CLASES[c][0] : c; }
    function colorClase(c) { return CLASES[c] ? CLASES[c][1] : "#888"; }

    /* ── 1. Aparición al hacer scroll + contadores ───────────────────────── */
    function contar(el) {
        if (el.dataset.contado) return;
        el.dataset.contado = "1";
        var fin = parseFloat(el.dataset.contar), dec = parseInt(el.dataset.decimales || "0", 10), suf = el.dataset.sufijo || "";
        if (isNaN(fin) || reducido) return;
        var t0 = null, dur = 1300;
        function paso(t) {
            if (!t0) t0 = t;
            var k = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - k, 3);
            el.textContent = (fin * e).toFixed(dec) + suf;
            if (k < 1) requestAnimationFrame(paso);
        }
        requestAnimationFrame(paso);
    }
    var obs = "IntersectionObserver" in window ? new IntersectionObserver(function (entradas) {
        entradas.forEach(function (en) {
            if (!en.isIntersecting) return;
            en.target.classList.add("visible");
            $$("[data-contar]", en.target).forEach(contar);
            if (en.target.matches("[data-contar]")) contar(en.target);
            obs.unobserve(en.target);
        });
    }, { threshold: 0.15 }) : null;
    $$(".revelar, .portada, .kpis, .ds-grid, .avance, .anillo").forEach(function (el) {
        if (obs) obs.observe(el); else el.classList.add("visible");
    });

    /* Anillo de avance: anima de 0 al porcentaje */
    var anillo = $(".anillo[data-pct]");
    if (anillo && !reducido) {
        var meta = +anillo.dataset.pct, t0 = null;
        anillo.style.setProperty("--p", 0);
        setTimeout(function () {
            requestAnimationFrame(function g(t) {
                if (!t0) t0 = t;
                var k = Math.min(1, (t - t0) / 1400), e = 1 - Math.pow(1 - k, 3);
                anillo.style.setProperty("--p", (meta * e).toFixed(1));
                if (k < 1) requestAnimationFrame(g);
            });
        }, 250);
    }

    /* ── 2. Barra de lectura y sección activa en el menú ────────────────── */
    var barraLectura = $(".progreso-lectura span");
    var enlaces = $$(".barra-sup nav a");
    var secciones = enlaces.map(function (a) { return document.getElementById(a.hash.slice(1)); });
    function alDesplazar() {
        var h = document.documentElement, max = h.scrollHeight - h.clientHeight;
        if (barraLectura) barraLectura.style.transform = "scaleX(" + (max > 0 ? h.scrollTop / max : 0) + ")";
        var activo = 0;
        secciones.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < 140) activo = i; });
        enlaces.forEach(function (a, i) { a.classList.toggle("activo", i === activo); });
    }
    window.addEventListener("scroll", alDesplazar, { passive: true });
    alDesplazar();

    /* ── 3. Moléculas flotando en la portada ────────────────────────────── */
    var lienzo = $(".moleculas");
    if (lienzo && lienzo.getContext && !reducido) {
        var ctx = lienzo.getContext("2d"), parts = [], W = 0, H = 0, dpr = Math.min(2, window.devicePixelRatio || 1);
        var etiquetas = ["NH₃", "C₂H₆O", "C₃H₆O", "CH₃COOH", "O₂"];
        function medir() {
            W = lienzo.clientWidth; H = lienzo.clientHeight;
            lienzo.width = W * dpr; lienzo.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }
        medir(); window.addEventListener("resize", medir);
        for (var i = 0; i < 26; i++) parts.push({
            x: Math.random() * W, y: Math.random() * H, r: 2 + Math.random() * 4,
            vx: (Math.random() - .5) * .35, vy: -.15 - Math.random() * .35, t: i % 6 === 0 ? etiquetas[i % 5] : null
        });
        var visibleHero = true;
        if (obs) new IntersectionObserver(function (e) { visibleHero = e[0].isIntersecting; }).observe(lienzo);
        (function anim() {
            if (visibleHero) {
                ctx.clearRect(0, 0, W, H);
                parts.forEach(function (p, i) {
                    p.x += p.vx; p.y += p.vy;
                    if (p.y < -20) { p.y = H + 20; p.x = Math.random() * W; }
                    if (p.x < -20) p.x = W + 20; if (p.x > W + 20) p.x = -20;
                    for (var j = i + 1; j < parts.length; j++) {
                        var q = parts[j], d = Math.hypot(p.x - q.x, p.y - q.y);
                        if (d < 90) { ctx.strokeStyle = "rgba(160,235,222," + (0.18 * (1 - d / 90)) + ")"; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); }
                    }
                    ctx.fillStyle = "rgba(160,235,222,.45)"; ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 7); ctx.fill();
                    if (p.t) { ctx.fillStyle = "rgba(220,245,240,.55)"; ctx.font = "600 12px system-ui"; ctx.fillText(p.t, p.x + 8, p.y + 4); }
                });
            }
            requestAnimationFrame(anim);
        })();
    }

    /* ── 4. Diagrama interactivo ────────────────────────────────────────── */
    var svg = $(".diagrama-svg");
    var NOMBRE_ETAPA = { sensado: "Sensado", proceso: "Procesamiento", ia: "Inteligencia artificial", decision: "Decisión", alerta: "Alertas", salida: "Salidas" };
    if (svg) {
        var nodos = {}; $$(".nodo", svg).forEach(function (g) { nodos[g.dataset.nodo] = g; });
        var aristas = $$(".arista", svg);
        var capaPart = $(".particulas", svg);
        var infoEt = $("[data-info-etapa]"), infoTit = $("[data-info-titulo]"), infoTxt = $("[data-info-texto]");

        function mostrarInfo(clave) {
            var d = DIAG[clave]; if (!d) return;
            infoEt.textContent = NOMBRE_ETAPA[d[2]] || "Bloque";
            infoTit.textContent = d[0]; infoTxt.textContent = d[1];
            $$(".nodo", svg).forEach(function (g) { g.classList.toggle("sel", g.dataset.nodo === clave); });
        }
        function resaltar(clave, on) {
            svg.classList.toggle("enfoque", on);
            aristas.forEach(function (a) {
                var rel = a.dataset.de === clave || a.dataset.a === clave;
                a.classList.toggle("rel", on && rel);
                if (on && rel) { (nodos[a.dataset.de] || {}).classList && nodos[a.dataset.de].classList.add("rel"); nodos[a.dataset.a] && nodos[a.dataset.a].classList.add("rel"); }
            });
            if (!on) $$(".nodo.rel", svg).forEach(function (n) { n.classList.remove("rel"); });
            if (on && nodos[clave]) nodos[clave].classList.add("rel");
        }
        Object.keys(nodos).forEach(function (k) {
            var g = nodos[k];
            g.addEventListener("click", function () { mostrarInfo(k); });
            g.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); mostrarInfo(k); } });
            g.addEventListener("mouseenter", function () { resaltar(k, true); });
            g.addEventListener("mouseleave", function () { resaltar(k, false); });
            g.addEventListener("focus", function () { resaltar(k, true); });
            g.addEventListener("blur", function () { resaltar(k, false); });
        });
        $$(".ley-item", svg).forEach(function (l) {
            l.addEventListener("mouseenter", function () { svg.classList.add("filtro"); $$(".nodo.et-" + l.dataset.etapa, svg).forEach(function (n) { n.classList.add("rel"); }); });
            l.addEventListener("mouseleave", function () { svg.classList.remove("filtro"); $$(".nodo.rel", svg).forEach(function (n) { n.classList.remove("rel"); }); });
        });

        /* Partículas que viajan por las conexiones */
        var vivas = [];
        function lanzar(arista, clase, vel) {
            var c = document.createElementNS(SVGNS, "circle");
            c.setAttribute("r", clase === "pulso" ? 7 : 3.5);
            c.setAttribute("class", "part " + (clase || "") + " " + (arista.classList.contains("si") ? "p-si" : arista.classList.contains("no") ? "p-no" : ""));
            capaPart.appendChild(c);
            vivas.push({ el: c, path: arista, L: arista.getTotalLength(), s: 0, v: vel || (0.9 + Math.random() * .5) });
        }
        var diagVisible = false;
        if (obs) new IntersectionObserver(function (e) { diagVisible = e[0].isIntersecting; }).observe(svg); else diagVisible = true;
        var ultimo = 0;
        function bucle(t) {
            if (diagVisible && !reducido && !document.hidden) {
                if (t - ultimo > 420) {
                    ultimo = t;
                    var a = aristas[Math.floor(Math.random() * aristas.length)];
                    if (!a.classList.contains("si") || simulando) lanzar(a);
                }
                var terminados = [];
                vivas = vivas.filter(function (p) {
                    p.s += p.v * 2.2;
                    if (p.s >= p.L) { p.el.remove(); if (p.fin) terminados.push(p.fin); return false; }
                    var pt = p.path.getPointAtLength(p.s);
                    p.el.setAttribute("cx", pt.x); p.el.setAttribute("cy", pt.y);
                    p.el.style.opacity = Math.min(1, Math.min(p.s, p.L - p.s) / 18);
                    return true;
                });
                terminados.forEach(function (f) { f(); });
            }
            requestAnimationFrame(bucle);
        }
        requestAnimationFrame(bucle);

        /* Simulación con una muestra real del dataset */
        var simulando = false;
        var btnSim = $("[data-simular]"), btnAm = $("[data-simular-amoniaco]");
        var consola = $(".consola"), lista = $("[data-consola]"), res = $("[data-resultado]");
        function arista(de, a) { return aristas.filter(function (x) { return x.dataset.de === de && x.dataset.a === a; })[0]; }
        function encender(clave, ms) {
            var n = nodos[clave]; if (!n) return;
            n.classList.add("activo");
            setTimeout(function () { n.classList.remove("activo"); }, ms || 900);
        }
        function linea(txt) { var li = document.createElement("li"); li.innerHTML = txt; lista.appendChild(li); }
        function valor(clave, txt) { var t = nodos[clave] && $(".valor", nodos[clave]); if (t) t.textContent = txt; }
        function simular(soloClase) {
            if (simulando || !DATA) return;
            var pool = DATA.puntos.filter(function (p) { return p.part === "prueba" && (!soloClase || p.c === soloClase); });
            if (!pool.length) return;
            var m = pool[Math.floor(Math.random() * pool.length)];
            simulando = true; btnSim.disabled = btnAm.disabled = true;
            consola.hidden = false; lista.innerHTML = ""; res.innerHTML = ""; res.className = "resultado";
            $$(".valor", svg).forEach(function (t) { t.textContent = ""; });
            var pasos = [
                [["mq135", "mq3"], function () {
                    valor("mq135", m.x.toFixed(3)); valor("mq3", m.y.toFixed(3));
                    linea("Muestra <b>" + m.id + "</b> · sesión " + m.s + " · sustancia real: <b>" + nombreClase(m.c) + "</b>");
                    linea("Respuesta MQ-135 = <b>" + m.x.toFixed(3) + "</b> · MQ-3 = <b>" + m.y.toFixed(3) + "</b>");
                }, [["mq3", "acond"], ["mq135", "acond"]]],
                [["acond"], null, [["acond", "adc"]]],
                [["adc"], function () { valor("adc", m.a135 + " · " + m.a3); linea("ADC máx.: MQ-135 " + m.a135 + " · MQ-3 " + m.a3 + " (de 4095)"); }, [["adc", "esp32"]]],
                [["esp32"], null, [["esp32", "proc"]]],
                [["proc", "calib"], function () { linea("Respuesta normalizada = estable ÷ base"); }, [["proc", "knn"]]],
                [["knn", "entren"], function () {
                    valor("knn", nombreClase(m.p) + " · " + Math.round(m.conf * 100) + " %");
                    linea("KNN: los vecinos más cercanos votan <b>" + nombreClase(m.p) + "</b> (" + Math.round(m.conf * 100) + " % de los votos)");
                }, [["knn", "decision"]]],
                [["decision"], null, null]
            ];
            var detectado = m.p !== "aire_limpio";
            if (detectado) {
                pasos[6][2] = [["decision", "alertas"]];
                pasos.push([["alertas"], function () { linea("<span class='rojo'>Compuesto detectado → se activan las alertas</span>"); }, [["alertas", "ble"], ["alertas", "buzzer"], ["alertas", "led"]]]);
                pasos.push([["ble", "buzzer", "led"], function () { svg.classList.add("alarma"); setTimeout(function () { svg.classList.remove("alarma"); }, 1800); }, [["ble", "registro"]]]);
                pasos.push([["registro"], function () { linea("En el flujo representado, la app recibe la notificación y registra el evento"); }, null]);
            } else {
                pasos[6][2] = [["decision", "monitoreo"]];
                pasos.push([["monitoreo"], function () { linea("Aire limpio → el monitoreo continúa"); }, [["monitoreo", "proc"]]]);
            }
            var i = 0;
            (function siguiente() {
                if (i >= pasos.length) {
                    var ok = m.p === m.c;
                    res.className = "resultado " + (detectado ? "alerta" : "limpio");
                    res.innerHTML = "<span class='punto-c' style='background:" + colorClase(m.p) + "'></span><b>" + (detectado ? "¡" + nombreClase(m.p) + " detectado!" : "Aire limpio") +
                        "</b><small>" + (ok ? "✓ Coincide con la sustancia real" : "✗ La sustancia real era " + nombreClase(m.c) + ": error del modelo") + "</small>";
                    simulando = false; btnSim.disabled = btnAm.disabled = false;
                    return;
                }
                var p = pasos[i++];
                p[0].forEach(function (k) { encender(k, 1100); });
                if (p[1]) p[1]();
                // El avance no depende de las animaciones ni de la visibilidad del SVG.
                var salidas = p[2] || [];
                salidas.forEach(function (par) {
                    var a = arista(par[0], par[1]);
                    if (a && !reducido && diagVisible && !document.hidden) lanzar(a, "pulso", 2.2);
                });
                setTimeout(siguiente, reducido ? 250 : 900);
            })();
        }
        if (btnSim && DATA) {
            btnSim.hidden = btnAm.hidden = false;
            btnSim.addEventListener("click", function () { simular(); });
            btnAm.addEventListener("click", function () { simular("amoniaco"); });
        }
    }

    /* ── 5. App: pasos que señalan la pantalla ──────────────────────────── */
    var pasosApp = $$("[data-pasos-app] li"), zonas = $$(".zona");
    if (pasosApp.length) {
        var actual = 0, auto = null;
        function marcar(i) {
            actual = i;
            pasosApp.forEach(function (li, j) { li.classList.toggle("activo", j === i); });
            var z = pasosApp[i].dataset.zona;
            zonas.forEach(function (el) { el.classList.toggle("activo", el.dataset.zona === z); });
        }
        function arrancar() { if (reducido) return; clearInterval(auto); auto = setInterval(function () { marcar((actual + 1) % pasosApp.length); }, 2800); }
        pasosApp.forEach(function (li, i) {
            li.addEventListener("mouseenter", function () { clearInterval(auto); marcar(i); });
            li.addEventListener("focus", function () { clearInterval(auto); marcar(i); });
            li.addEventListener("click", function () { clearInterval(auto); marcar(i); });
            li.addEventListener("mouseleave", arrancar);
        });
        marcar(0); arrancar();
    }

    /* ── 6. Dataset: gráfica de dispersión interactiva ──────────────────── */
    var cont = $("[data-dispersion]");
    if (cont && DATA) {
        var ocultas = {}, part = "todas";
        var W = 640, H = 420, m = { l: 52, r: 16, t: 14, b: 44 };
        var xs = DATA.puntos.map(function (p) { return p.x; }), ys = DATA.puntos.map(function (p) { return p.y; });
        var x0 = 0, x1 = Math.ceil(Math.max.apply(null, xs) * 10) / 10, y0 = 0, y1 = Math.ceil(Math.max.apply(null, ys) * 10) / 10;
        function sx(v) { return m.l + (v - x0) / (x1 - x0) * (W - m.l - m.r); }
        function sy(v) { return H - m.b - (v - y0) / (y1 - y0) * (H - m.t - m.b); }
        var s = document.createElementNS(SVGNS, "svg");
        s.setAttribute("viewBox", "0 0 " + W + " " + H); s.setAttribute("class", "graf");
        s.setAttribute("role", "img"); s.setAttribute("aria-label", "Dispersión de la respuesta del MQ-135 contra la del MQ-3 por clase");
        var html = "";
        for (var v = 0; v <= x1 + 1e-9; v += 0.2) html += "<line class='rej' x1='" + sx(v) + "' x2='" + sx(v) + "' y1='" + m.t + "' y2='" + (H - m.b) + "'/><text class='eje' x='" + sx(v) + "' y='" + (H - m.b + 18) + "' text-anchor='middle'>" + v.toFixed(1) + "</text>";
        for (v = 0; v <= y1 + 1e-9; v += 0.2) html += "<line class='rej' y1='" + sy(v) + "' y2='" + sy(v) + "' x1='" + m.l + "' x2='" + (W - m.r) + "'/><text class='eje' x='" + (m.l - 8) + "' y='" + (sy(v) + 4) + "' text-anchor='end'>" + v.toFixed(1) + "</text>";
        html += "<text class='eje-t' x='" + ((W + m.l) / 2) + "' y='" + (H - 6) + "' text-anchor='middle'>Respuesta MQ-135 (estable ÷ base)</text>";
        html += "<text class='eje-t' transform='rotate(-90)' x='" + (-(H - m.b + m.t) / 2) + "' y='14' text-anchor='middle'>Respuesta MQ-3</text>";
        s.innerHTML = html;
        var gPts = document.createElementNS(SVGNS, "g"); s.appendChild(gPts);
        DATA.puntos.forEach(function (p, i) {
            var c = document.createElementNS(SVGNS, "circle");
            c.setAttribute("cx", sx(p.x)); c.setAttribute("cy", sy(p.y)); c.setAttribute("r", p.part === "prueba" ? 5 : 4);
            c.setAttribute("fill", colorClase(p.c));
            c.setAttribute("class", "pt" + (p.part === "prueba" ? " prueba" : "") + (p.part === "prueba" && p.p !== p.c ? " error" : ""));
            c.style.transitionDelay = (i % 60) * 8 + "ms";
            c.__p = p; gPts.appendChild(c);
        });
        cont.appendChild(s);
        var tip = document.createElement("div"); tip.className = "tip"; tip.hidden = true; cont.appendChild(tip);
        gPts.addEventListener("mousemove", function (e) {
            var p = e.target.__p; if (!p) { tip.hidden = true; return; }
            tip.hidden = false;
            tip.innerHTML = "<b>" + p.id + "</b> · " + nombreClase(p.c) + "<br>MQ-135 " + p.x.toFixed(3) + " · MQ-3 " + p.y.toFixed(3) +
                (p.t90 ? "<br>t90 " + p.t90 + " s" : "") + "<br>Sesión " + p.s + " · " + p.part +
                (p.part === "prueba" ? "<br>KNN: <b>" + nombreClase(p.p) + "</b> " + (p.p === p.c ? "✓" : "✗") : "");
            var r = cont.getBoundingClientRect();
            tip.style.left = Math.min(e.clientX - r.left + 14, r.width - 190) + "px"; tip.style.top = (e.clientY - r.top + 14) + "px";
        });
        gPts.addEventListener("mouseleave", function () { tip.hidden = true; });
        function aplicar() {
            $$(".pt", gPts).forEach(function (c) {
                var p = c.__p, ver = !ocultas[p.c] && (part === "todas" || p.part === part);
                c.classList.toggle("oculto", !ver);
            });
        }
        var chips = $("[data-chips]");
        DATA.orden.forEach(function (k) {
            var b = document.createElement("button");
            b.type = "button"; b.className = "chip-clase"; b.setAttribute("aria-pressed", "true");
            b.innerHTML = "<i style='background:" + colorClase(k) + "'></i>" + nombreClase(k);
            b.addEventListener("click", function () { ocultas[k] = !ocultas[k]; b.setAttribute("aria-pressed", String(!ocultas[k])); aplicar(); });
            b.addEventListener("mouseenter", function () { s.classList.add("enfoque"); $$(".pt", gPts).forEach(function (c) { c.classList.toggle("foco", c.__p.c === k); }); });
            b.addEventListener("mouseleave", function () { s.classList.remove("enfoque"); });
            chips.appendChild(b);
        });
        $$("[data-particion] button").forEach(function (b) {
            b.addEventListener("click", function () {
                part = b.dataset.p;
                $$("[data-particion] button").forEach(function (x) { x.setAttribute("aria-pressed", String(x === b)); });
                aplicar();
            });
        });
    }

    /* ── 7. Etapas desplegables, impresión y visor de imágenes ──────────── */
    var etapas = $$("#ruta details");
    $$("[data-ruta]").forEach(function (b) {
        b.hidden = false;
        b.addEventListener("click", function () { etapas.forEach(function (d) { d.open = b.dataset.ruta === "abrir"; }); });
    });
    var previo = [];
    window.addEventListener("beforeprint", function () {
        $$(".revelar").forEach(function (el) { el.classList.add("visible"); });
        previo = etapas.map(function (d) { return d.open; });
        etapas.forEach(function (d) { d.open = true; });
    });
    window.addEventListener("afterprint", function () { etapas.forEach(function (d, i) { d.open = previo[i]; }); });
    var visor = document.getElementById("visor");
    if (visor && visor.showModal) {
        $$("a.ampliar").forEach(function (a) {
            a.addEventListener("click", function (e) {
                e.preventDefault();
                var img = $("img", visor);
                img.src = a.href; img.alt = a.dataset.titulo;
                $("p", visor).textContent = a.dataset.titulo;
                visor.showModal();
            });
        });
        visor.addEventListener("click", function (e) { if (e.target === visor) visor.close(); });
    }
})();
