/* =========================================================================
   site.js — navegación, buscador, tema, TOC y paginación.
   TODO el mapa del sitio vive en la constante SITE de abajo: para agregar
   una industria o una página nueva se toca únicamente este archivo.
   ========================================================================= */

(function () {
  "use strict";

  var ROOT = window.SITE_ROOT || "";

  /* ---------------------------------------------------------------------
     1. MAPA DEL SITIO
     --------------------------------------------------------------------- */
  var SITE = {
    titulo: "Apuntes UTN FRC",
    subtitulo: "Ingeniería Industrial · UTN FRC",

    materias: [
      {
        id: "procesos-industriales",
        nombre: "Procesos Industriales",
        corto: "Procesos Industriales",
        icono: "🏭",
        estado: "listo",
        resumen: "Todo lo que entra en el segundo parcial de la cátedra: papel y madera, tratamiento de superficies, mecanizado, tratamientos térmicos, química y petroquímica, plástica y alimenticia.",
        unidades: [
          {
            id: "papel-madera",
            nombre: "Industria del Papel y la Madera",
            corto: "Papel y Madera",
            icono: "🌲",
            estado: "listo",
            resumen: "Del tronco al papel: anatomía y química de la madera, tableros, pastas celulósicas, proceso kraft, máquina de papel y bagazo de caña.",
            docente: "Ing. Vivian N. Coggiola",
            paginas: [
              { url: "index.html",        titulo: "Panorama de la unidad", desc: "Mapa completo, diagrama de flujo interactivo y las 12 cifras que hay que saber sí o sí.", claves: "mapa resumen general esquema panorama cifras" },
              { url: "madera.html",       titulo: "La madera como material", desc: "Definición, ámbitos de uso, partes del tronco y composición química.", claves: "celulosa lignina hemicelulosa extractivos albura duramen cambium medula corteza liber floema suber humedad higroscopico" },
              { url: "clasificacion.html",titulo: "Clasificación de la madera", desc: "Naturales duras y blandas, especies, y maderas artificiales o prefabricadas.", claves: "duras blandas pino tilo alamo abedul roble cerezo olmo caoba haya nogal fresno ebano teca contrachapado aglomerado MDF MDP tableros fibra terciada" },
              { url: "obtencion.html",    titulo: "Procesos de obtención", desc: "Tala, descortezado, despiece y trozado, secado natural y artificial.", claves: "tala descortezado aserrado despiece trozado secado natural artificial horno camara cepillado poda transporte" },
              { url: "contrachapado.html",titulo: "Fabricación de contrachapado", desc: "Pelado rotativo, encolado cruzado y prensado en caliente de tableros multilaminados.", claves: "plywood terciada pelado rotativo torno resina prensa anisotropia capas impares chapa" },
              { url: "papel.html",        titulo: "El papel: material y materias primas", desc: "Qué es el papel, fibra larga vs. fibra corta y por qué se elige cada madera.", claves: "papel fibra larga corta aglutinante cola carga talco opacidad gramaje pino abeto eucalipto" },
              { url: "pastas.html",       titulo: "Tipos de pasta celulósica", desc: "Pasta mecánica vs. química, kraft al sulfato, al sulfito y pasta soluble.", claves: "pasta mecanica quimica kraft sulfato sulfito termomecanico pasta soluble alfa rendimiento" },
              { url: "celulosa.html",     titulo: "Producción de celulosa (Etapas I–VII)", desc: "Preparación de la madera, cocción, blanqueo, secado y embalado.", claves: "etapas chipeadora digestor coccion licor blanqueo ECF TCF dioxido cloro peroxido ozono deslignificacion secado embalado" },
              { url: "maquina-papel.html",titulo: "La máquina de papel", desc: "Caja de entrada, mesa formadora, prensado, secado, calandrado, estucado y acabado.", claves: "maquina papel fourdrinier caja entrada mesa formadora tela prensado secado calandra calandrado estucado bobina acabado satinado" },
              { url: "bagazo.html",       titulo: "Papel a partir de caña de azúcar", desc: "Bagazo como materia prima alternativa: zafra, molienda, desmedulado y pulpa.", claves: "bagazo caña azucar zafra molienda trapiche meollo parenquima fibra desmedulado Ledesma" },
              { url: "ambiente.html",     titulo: "Cuestiones medioambientales", desc: "Agua, efluentes, residuos, emisiones, deforestación y reciclado.", claves: "ambiente agua efluentes dioxinas furanos residuos emisiones CO2 deforestacion reciclado destintado olor" },
              { url: "datos-clave.html",  titulo: "Tabla maestra de datos", desc: "Todos los números, rangos y valores del apunte en una sola planilla imprimible.", claves: "datos numeros cifras tabla resumen chuleta valores porcentajes temperatura" },
              { url: "glosario.html",     titulo: "Glosario", desc: "Todo el vocabulario técnico de la unidad, buscable.", claves: "glosario vocabulario definiciones terminos diccionario" },
              { url: "flashcards.html",   titulo: "Flashcards", desc: "Tarjetas de memorización por bloque temático.", claves: "flashcards tarjetas memorizar repaso" },
              { url: "quiz.html",         titulo: "Autoevaluación (multiple choice)", desc: "Banco de preguntas tipo parcial con corrección y explicación.", claves: "quiz multiple choice preguntas autoevaluacion parcial examen" }
            ]
          },
          {
            id: "tratamientos-superficiales",
            nombre: "Tratamiento de Superficies",
            corto: "Tratamientos Superficiales",
            icono: "⚙️",
            estado: "pendiente",
            resumen: "Galvanizado por inmersión en caliente, recubrimientos y protección anticorrosiva.",
            paginas: []
          },
          { id: "mecanizado",        nombre: "Procesos de Mecanizado",           corto: "Mecanizado",        icono: "🔩", estado: "pendiente", resumen: "Arranque de viruta: torneado, fresado, taladrado y rectificado.", paginas: [] },
          { id: "tratamientos-termicos", nombre: "Tratamientos Térmicos",        corto: "Trat. Térmicos",    icono: "🔥", estado: "pendiente", resumen: "Temple, revenido, recocido y normalizado de aceros.", paginas: [] },
          { id: "quimica-petroquimica", nombre: "Industria Química y Petroquímica", corto: "Química y Petroquímica", icono: "🧪", estado: "pendiente", resumen: "Refinación, craqueo y cadena de derivados del petróleo y el gas.", paginas: [] },
          { id: "plastica",          nombre: "Industria Plástica",               corto: "Plástica",          icono: "🧴", estado: "pendiente", resumen: "Polímeros, inyección, extrusión y soplado.", paginas: [] },
          { id: "alimenticia",       nombre: "Industria Alimenticia",            corto: "Alimenticia",       icono: "🥛", estado: "pendiente", resumen: "Industria láctea, aceites comestibles e industria de la carne.", paginas: [] }
        ]
      },
      {
        id: "instalaciones-industriales",
        nombre: "Instalaciones Industriales",
        corto: "Instalaciones Industriales",
        icono: "💨",
        estado: "listo",
        resumen: "Instalaciones de servicio de la planta. Por ahora: el tratamiento del aire comprimido.",
        unidades: [
          {
            id: "aire-comprimido",
            nombre: "Tratamiento del Aire Comprimido",
            corto: "Aire Comprimido",
            icono: "💨",
            estado: "listo",
            docente: "Ing. Luciano Manavella",
            resumen: "Post-enfriador, secado y filtrado: cómo se lleva el aire desde la descarga del compresor hasta la calidad que pide el consumo.",
            paginas: [
              { url: "index.html",    titulo: "Panorama de la unidad",          desc: "Los siete bloques del tema y cuáles están desarrollados.", claves: "panorama bloques aire comprimido mapa indice" },
              { url: "bloque-2.html", titulo: "Tratamiento del aire comprimido", desc: "Post-enfriador, las cinco técnicas de secado y el filtrado del aire comprimido.", claves: "post-enfriador secado absorcion adsorcion sobrecompresion membrana filtrado coalescente carbon activo punto de rocio prp tren" },
              { url: "bloque-3.html", titulo: "Acumulación: el depósito o pulmón", desc: "Las tres funciones del pulmón, el cálculo de su volumen, el caudal Normal y los tipos de purga.", claves: "deposito pulmon acumulacion pulsaciones condensado ciclon volumen caudal normal fad purga flotador electronica x(1-x)" },
              { url: "bloque-4.html", titulo: "Transporte y distribución: la red", desc: "Los tres niveles de tubería, red abierta vs. cerrada, el cuello de cisne, reglas de montaje y los materiales de cañería.", claves: "red principal secundaria servicio bajante abierta cerrada anillo cuello de cisne pendiente acero negro galvanizado inoxidable cobre aluminio termoplastico accesorios racores" },
              { url: "bloque-5.html", titulo: "El punto de consumo: la unidad FRL", desc: "Filtro, Regulador y Lubricador: el acondicionamiento local del aire comprimido en cada punto de consumo.", claves: "frl filtro regulador lubricador deflector diafragma valvula de asiento sangria venturi membrana de restriccion esfera manopla resorte" },
              { url: "bloque-6.html", titulo: "Proyecto integral de la instalación", desc: "Consumo medio, diámetro y pérdida de carga, selección de compresor, pulmón, filtros y sala de compresores: el proyecto completo con números.", claves: "consumo medio factor de simultaneidad coeficiente de utilizacion diametro perdida de carga velocidad caudal normal fad selecciona compresor sala de compresores ventilacion caso a b c" }
            ]
          }
        ]
      }
    ]
  };

  window.SITE = SITE;

  /* ---------------------------------------------------------------------
     2. Utilidades
     --------------------------------------------------------------------- */
  function el(tag, attrs, html) {
    var n = document.createElement(tag);
    if (attrs) { for (var k in attrs) { if (attrs[k] !== null && attrs[k] !== undefined) n.setAttribute(k, attrs[k]); } }
    if (html !== undefined) n.innerHTML = html;
    return n;
  }
  function norm(s) {
    return (s || "").toString().toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function pathSegments() {
    var p = location.pathname;
    if (p.charAt(p.length - 1) === "/") p += "index.html";
    return p.split("/").filter(Boolean);
  }
  function currentFile() {
    var segs = pathSegments();
    return segs[segs.length - 1] || "index.html";
  }
  function findMateria(id) {
    for (var i = 0; i < SITE.materias.length; i++) if (SITE.materias[i].id === id) return SITE.materias[i];
    return null;
  }
  function findUnidad(materia, id) {
    if (!materia) return null;
    for (var i = 0; i < materia.unidades.length; i++) if (materia.unidades[i].id === id) return materia.unidades[i];
    return null;
  }
  function currentLocation() {
    var parts = pathSegments();
    var dir1 = parts[parts.length - 2];
    var dir2 = parts[parts.length - 3];
    for (var i = 0; i < SITE.materias.length; i++) {
      var m = SITE.materias[i];
      if (m.id === dir1) return { materia: m, unidad: null };
      var u = findUnidad(m, dir1);
      if (u && m.id === dir2) return { materia: m, unidad: u };
    }
    var bodyM = findMateria(document.body.getAttribute("data-materia"));
    if (bodyM) return { materia: bodyM, unidad: findUnidad(bodyM, document.body.getAttribute("data-unidad")) };
    return { materia: null, unidad: null };
  }

  /* ---------------------------------------------------------------------
     3. Tema claro / oscuro
     --------------------------------------------------------------------- */
  function initTheme() {
    var saved = null;
    try { saved = localStorage.getItem("pi-theme"); } catch (e) {}
    if (saved) { document.documentElement.setAttribute("data-theme", saved); }
    else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      document.documentElement.setAttribute("data-theme", "dark");
    }
    syncThemeBtn();
  }
  function syncThemeBtn() {
    var b = document.getElementById("theme-toggle");
    if (!b) return;
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    b.textContent = dark ? "☀" : "☾";
    b.setAttribute("aria-label", dark ? "Cambiar a modo claro" : "Cambiar a modo oscuro");
    b.setAttribute("title", dark ? "Modo claro" : "Modo oscuro");
  }
  function toggleTheme() {
    var dark = document.documentElement.getAttribute("data-theme") === "dark";
    var next = dark ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try { localStorage.setItem("pi-theme", next); } catch (e) {}
    syncThemeBtn();
  }

  /* ---------------------------------------------------------------------
     4. Header
     --------------------------------------------------------------------- */
  function buildHeader() {
    var host = document.getElementById("site-header");
    if (!host) return;
    host.className = "site-header";
    host.innerHTML =
      '<button class="icon-btn" id="menu-toggle" aria-label="Abrir menú" aria-expanded="false">☰</button>' +
      '<a class="site-header__brand" href="' + ROOT + 'index.html">' +
        '<span class="site-header__mark" aria-hidden="true">PI</span>' +
        '<span>' + SITE.titulo + '</span>' +
      '</a>' +
      '<span class="site-header__sub">' + SITE.subtitulo + '</span>' +
      '<span class="site-header__spacer"></span>' +
      '<div class="search">' +
        '<input class="search__input" id="search-input" type="search" autocomplete="off" ' +
               'placeholder="Buscar en los apuntes…" aria-label="Buscar" ' +
               'role="combobox" aria-expanded="false" aria-controls="search-results">' +
        '<span class="search__hint">S</span>' +
        '<div class="search__results" id="search-results" role="listbox"></div>' +
      '</div>' +
      '<button class="icon-btn" id="theme-toggle">☾</button>';

    document.getElementById("theme-toggle").addEventListener("click", toggleTheme);
    syncThemeBtn();

    var mt = document.getElementById("menu-toggle");
    if (mt) mt.addEventListener("click", function () {
      var sb = document.querySelector(".sidebar");
      var sc = document.querySelector(".scrim");
      if (!sb) return;
      var open = sb.getAttribute("data-open") !== "true";
      sb.setAttribute("data-open", open ? "true" : "false");
      if (sc) sc.setAttribute("data-open", open ? "true" : "false");
      mt.setAttribute("aria-expanded", open ? "true" : "false");
    });
  }

  /* ---------------------------------------------------------------------
     5. Sidebar
     --------------------------------------------------------------------- */
  function buildSidebar() {
    var host = document.querySelector(".sidebar");
    if (!host) return;

    var loc = currentLocation();
    var file = currentFile();
    var html = "";

    function listaUnidades(materia, prefijo) {
      var out = '<div class="sidebar__group"><h2 class="sidebar__title">' + materia.corto + '</h2><ul class="sidebar__list">';
      materia.unidades.forEach(function (u) {
        if (u.estado === "listo") {
          out += '<li><a href="' + prefijo + u.id + '/index.html">' +
                    '<span class="sidebar__num">' + u.icono + '</span><span>' + u.corto + '</span></a></li>';
        } else {
          out += '<li><a href="#" data-pending="true" aria-disabled="true" tabindex="-1">' +
                    '<span class="sidebar__num">' + u.icono + '</span><span>' + u.corto + '</span></a></li>';
        }
      });
      return out + "</ul></div>";
    }

    if (loc.unidad) {
      html += '<a class="sidebar__back" href="' + ROOT + loc.materia.id + '/index.html">← ' + loc.materia.corto + '</a>';
      html += '<div class="sidebar__group"><h2 class="sidebar__title">' + loc.unidad.corto + '</h2><ul class="sidebar__list">';
      loc.unidad.paginas.forEach(function (p, i) {
        var cur = (p.url === file) ? ' aria-current="page"' : "";
        html += '<li><a href="' + p.url + '"' + cur + '>' +
                  '<span class="sidebar__num">' + String(i + 1).padStart(2, "0") + '</span>' +
                  '<span>' + p.titulo + '</span></a></li>';
      });
      html += "</ul></div>";
      html += listaUnidades(loc.materia, ROOT + loc.materia.id + "/");
    } else if (loc.materia) {
      html += '<a class="sidebar__back" href="' + ROOT + 'index.html">← Todas las materias</a>';
      html += listaUnidades(loc.materia, ROOT + loc.materia.id + "/");
    } else {
      html += '<div class="sidebar__group"><h2 class="sidebar__title">Materias</h2><ul class="sidebar__list">';
      SITE.materias.forEach(function (m) {
        html += '<li><a href="' + ROOT + m.id + '/index.html">' +
                  '<span class="sidebar__num">' + m.icono + '</span><span>' + m.corto + '</span></a></li>';
      });
      html += "</ul></div>";
    }

    host.innerHTML = html;

    host.addEventListener("click", function (e) {
      var a = e.target.closest("a[data-pending]");
      if (a) e.preventDefault();
    });
  }

  /* ---------------------------------------------------------------------
     6. Buscador
     --------------------------------------------------------------------- */
  var INDEX = [];

  function buildIndex() {
    SITE.materias.forEach(function (m) {
      m.unidades.forEach(function (u) {
        u.paginas.forEach(function (p) {
          INDEX.push({
            titulo: p.titulo,
            contexto: m.corto + " · " + u.corto,
            url: ROOT + m.id + "/" + u.id + "/" + p.url,
            blob: norm(p.titulo + " " + p.desc + " " + (p.claves || "") + " " + u.corto + " " + m.corto),
            desc: p.desc
          });
        });
      });
    });
    // encabezados de la página actual
    document.querySelectorAll(".content h2[id], .content h3[id]").forEach(function (h) {
      var t = h.textContent.trim();
      INDEX.push({
        titulo: t,
        contexto: (document.title.split("·")[0] || "").trim() + " · sección",
        url: "#" + h.id,
        blob: norm(t),
        desc: "En esta página"
      });
    });
  }

  function search(q) {
    var nq = norm(q).trim();
    if (nq.length < 2) return [];
    var terms = nq.split(/\s+/);
    var out = [];
    INDEX.forEach(function (it) {
      var score = 0, ok = true;
      terms.forEach(function (t) {
        var i = it.blob.indexOf(t);
        if (i < 0) { ok = false; return; }
        score += (i === 0 ? 10 : 4);
        if (norm(it.titulo).indexOf(t) >= 0) score += 8;
      });
      if (ok) out.push({ it: it, score: score });
    });
    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, 9).map(function (x) { return x.it; });
  }

  function initSearch() {
    var input = document.getElementById("search-input");
    var box = document.getElementById("search-results");
    if (!input || !box) return;
    var active = -1;

    function close() { box.setAttribute("data-open", "false"); input.setAttribute("aria-expanded", "false"); active = -1; }
    function render(hits, q) {
      if (!hits.length) {
        box.innerHTML = '<p class="search__empty">Sin resultados para “' + q.replace(/</g, "&lt;") + '”.</p>';
      } else {
        box.innerHTML = hits.map(function (h, i) {
          return '<a class="search__hit" href="' + h.url + '" role="option" data-i="' + i + '">' +
                   "<strong>" + h.titulo + "</strong><span>" + h.contexto + " — " + h.desc + "</span></a>";
        }).join("");
      }
      box.setAttribute("data-open", "true");
      input.setAttribute("aria-expanded", "true");
      active = -1;
    }

    input.addEventListener("input", function () {
      var q = input.value;
      if (q.trim().length < 2) { close(); return; }
      render(search(q), q);
    });

    input.addEventListener("keydown", function (e) {
      var hits = box.querySelectorAll(".search__hit");
      if (e.key === "Escape") { close(); input.blur(); return; }
      if (!hits.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        active += (e.key === "ArrowDown" ? 1 : -1);
        if (active < 0) active = hits.length - 1;
        if (active >= hits.length) active = 0;
        hits.forEach(function (h, i) { h.setAttribute("data-active", i === active ? "true" : "false"); });
        hits[active].scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && active >= 0) {
        e.preventDefault();
        hits[active].click();
      }
    });

    document.addEventListener("click", function (e) {
      if (!e.target.closest(".search")) close();
    });

    document.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "textarea" || tag === "select") return;
      if (e.key === "s" || e.key === "S" || e.key === "/") {
        e.preventDefault(); input.focus(); input.select();
      }
    });
  }

  /* ---------------------------------------------------------------------
     7. TOC con scroll-spy
     --------------------------------------------------------------------- */
  function buildTOC() {
    var host = document.querySelector(".toc");
    if (!host) return;
    var heads = Array.prototype.slice.call(document.querySelectorAll(".content h2, .content h3"));
    heads = heads.filter(function (h) { return !h.hasAttribute("data-no-toc"); });
    if (heads.length < 2) { host.style.display = "none"; return; }

    var used = {};
    var items = heads.map(function (h) {
      if (!h.id) {
        var base = norm(h.textContent).replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 44) || "sec";
        used[base] = (used[base] || 0) + 1;
        h.id = used[base] > 1 ? base + "-" + used[base] : base;
      }
      return { id: h.id, txt: h.textContent.replace(/^\d+\.\s*/, ""), lvl: h.tagName === "H3" ? 3 : 2, node: h };
    });

    host.innerHTML = '<p class="toc__title">En esta página</p><ul>' +
      items.map(function (i) {
        return '<li data-level="' + i.lvl + '"><a href="#' + i.id + '">' + i.txt + "</a></li>";
      }).join("") + "</ul>";

    var links = host.querySelectorAll("a");
    function spy() {
      var y = window.scrollY + (parseInt(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 56) + 40;
      var cur = items[0].id;
      for (var i = 0; i < items.length; i++) {
        if (items[i].node.offsetTop <= y) cur = items[i].id; else break;
      }
      links.forEach(function (a) {
        a.setAttribute("data-active", a.getAttribute("href") === "#" + cur ? "true" : "false");
      });
    }
    var ticking = false;
    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () { spy(); ticking = false; });
    }, { passive: true });
    spy();
  }

  /* ---------------------------------------------------------------------
     8. Paginación anterior / siguiente
     --------------------------------------------------------------------- */
  function buildPager() {
    var host = document.querySelector(".pager");
    if (!host) return;
    var loc = currentLocation();
    if (!loc.unidad) { host.remove(); return; }
    var file = currentFile();
    var i = -1;
    loc.unidad.paginas.forEach(function (p, k) { if (p.url === file) i = k; });
    if (i < 0) { host.remove(); return; }

    var html = "";
    if (i > 0) {
      html += '<a href="' + loc.unidad.paginas[i - 1].url + '"><span>← Anterior</span><b>' + loc.unidad.paginas[i - 1].titulo + "</b></a>";
    } else { html += "<span></span>"; }
    if (i < loc.unidad.paginas.length - 1) {
      html += '<a class="pager--next" href="' + loc.unidad.paginas[i + 1].url + '"><span>Siguiente →</span><b>' + loc.unidad.paginas[i + 1].titulo + "</b></a>";
    }
    host.innerHTML = html;
  }

  /* ---------------------------------------------------------------------
     9. Breadcrumb
     --------------------------------------------------------------------- */
  function buildBreadcrumb() {
    var host = document.querySelector(".breadcrumb");
    if (!host) return;
    var loc = currentLocation();
    var file = currentFile();
    var parts = ['<a href="' + ROOT + 'index.html">Inicio</a>'];
    if (loc.materia) parts.push('<span>/</span><a href="' + ROOT + loc.materia.id + '/index.html">' + loc.materia.corto + "</a>");
    if (loc.unidad) {
      parts.push('<span>/</span><a href="' + ROOT + loc.materia.id + '/' + loc.unidad.id + '/index.html">' + loc.unidad.corto + "</a>");
      var page = loc.unidad.paginas.filter(function (p) { return p.url === file; })[0];
      if (page && page.url !== "index.html") parts.push("<span>/</span><span>" + page.titulo + "</span>");
    }
    host.innerHTML = parts.join(" ");
  }

  /* ---------------------------------------------------------------------
     10. Arranque
     --------------------------------------------------------------------- */
  initTheme();
  document.addEventListener("DOMContentLoaded", function () {
    buildHeader();
    buildSidebar();
    buildBreadcrumb();
    buildTOC();
    buildPager();
    buildIndex();
    initSearch();

    var sc = document.querySelector(".scrim");
    if (sc) sc.addEventListener("click", function () {
      var sb = document.querySelector(".sidebar");
      if (sb) sb.setAttribute("data-open", "false");
      sc.setAttribute("data-open", "false");
      var mt = document.getElementById("menu-toggle");
      if (mt) mt.setAttribute("aria-expanded", "false");
    });
  });
})();
