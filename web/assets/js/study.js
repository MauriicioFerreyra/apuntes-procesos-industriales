/* =========================================================================
   study.js — componentes de estudio: diagrama de flujo interactivo,
   flashcards, quiz de multiple choice y filtro de glosario.

   Cada componente lee sus datos de un <script type="application/json">
   dentro de la misma página, así el contenido vive junto al texto y se
   edita sin tocar este archivo.
   ========================================================================= */

(function () {
  "use strict";

  function json(id) {
    var n = document.getElementById(id);
    if (!n) return null;
    try { return JSON.parse(n.textContent); }
    catch (e) { console.error("JSON inválido en #" + id, e); return null; }
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  function norm(s) {
    return (s || "").toString().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  /* =======================================================================
     1. DIAGRAMA DE FLUJO INTERACTIVO
     <div class="flow" data-flow="ID"></div>
     Datos: [{ n, titulo, sub, cuerpo, entra, sale, equipo, variables }]
     ======================================================================= */
  function initFlows() {
    document.querySelectorAll(".flow[data-flow]").forEach(function (host) {
      var pasos = json(host.getAttribute("data-flow"));
      if (!pasos || !pasos.length) return;

      var track = document.createElement("div");
      track.className = "flow__track";
      track.setAttribute("role", "tablist");

      pasos.forEach(function (p, i) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "flow__step";
        b.setAttribute("aria-expanded", "false");
        b.setAttribute("data-i", i);
        b.innerHTML =
          '<span class="flow__step-n">' + esc(p.n || ("0" + (i + 1)).slice(-2)) + "</span>" +
          '<span class="flow__step-t">' + esc(p.titulo) + "</span>" +
          (p.sub ? '<span class="flow__step-s">' + esc(p.sub) + "</span>" : "");
        track.appendChild(b);
      });

      var panel = document.createElement("div");
      panel.className = "flow__panel";
      panel.innerHTML = '<p class="flow__empty">Tocá cualquier etapa para ver qué entra, qué sale, con qué equipo y qué variables se controlan.</p>';

      host.appendChild(track);
      host.appendChild(panel);

      function abrir(i) {
        var p = pasos[i];
        track.querySelectorAll(".flow__step").forEach(function (b, k) {
          b.setAttribute("aria-expanded", k === i ? "true" : "false");
        });
        var io = "";
        if (p.entra)     io += "<div><b>Entra</b>" + p.entra + "</div>";
        if (p.sale)      io += "<div><b>Sale</b>" + p.sale + "</div>";
        if (p.equipo)    io += "<div><b>Equipo</b>" + p.equipo + "</div>";
        if (p.variables) io += "<div><b>Variables a controlar</b>" + p.variables + "</div>";
        panel.innerHTML =
          "<h4>" + esc(p.n ? p.n + ". " : "") + esc(p.titulo) + "</h4>" +
          "<p>" + p.cuerpo + "</p>" +
          (io ? '<div class="flow__io">' + io + "</div>" : "");
      }

      track.addEventListener("click", function (e) {
        var b = e.target.closest(".flow__step");
        if (b) abrir(parseInt(b.getAttribute("data-i"), 10));
      });
      track.addEventListener("keydown", function (e) {
        if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
        var b = e.target.closest(".flow__step");
        if (!b) return;
        var i = parseInt(b.getAttribute("data-i"), 10) + (e.key === "ArrowRight" ? 1 : -1);
        if (i < 0) i = pasos.length - 1;
        if (i >= pasos.length) i = 0;
        var nx = track.querySelector('.flow__step[data-i="' + i + '"]');
        if (nx) { nx.focus(); abrir(i); }
      });
    });
  }

  /* =======================================================================
     2. FLASHCARDS
     <div id="flashcards"></div> + <script type="application/json" id="fc-data">
     Datos: [{ tema, q, a }]
     ======================================================================= */
  function initFlashcards() {
    var host = document.getElementById("flashcards");
    if (!host) return;
    var todas = json("fc-data");
    if (!todas || !todas.length) return;

    var temas = [];
    todas.forEach(function (c) { if (temas.indexOf(c.tema) < 0) temas.push(c.tema); });

    host.innerHTML =
      '<div class="fc-toolbar">' +
        '<label class="small text-soft" for="fc-tema">Bloque:</label>' +
        '<select class="select" id="fc-tema">' +
          '<option value="">Todos (' + todas.length + ")</option>" +
          temas.map(function (t) {
            var n = todas.filter(function (c) { return c.tema === t; }).length;
            return '<option value="' + esc(t) + '">' + esc(t) + " (" + n + ")</option>";
          }).join("") +
        "</select>" +
        '<button class="btn btn--sm" id="fc-shuffle">🔀 Mezclar</button>' +
        '<span class="fc-progress" id="fc-progress"></span>' +
      "</div>" +
      '<div class="flashcard" id="fc-card" data-flipped="false" tabindex="0" role="button" aria-label="Tarjeta: tocá para ver la respuesta">' +
        '<div class="flashcard__inner">' +
          '<div class="flashcard__face">' +
            '<span class="flashcard__tag" id="fc-tag"></span>' +
            '<p class="flashcard__q" id="fc-q"></p>' +
            '<span class="flashcard__hint">Tocá la tarjeta o apretá Espacio para dar vuelta</span>' +
          "</div>" +
          '<div class="flashcard__face flashcard__face--back">' +
            '<span class="flashcard__tag">Respuesta</span>' +
            '<div class="flashcard__a" id="fc-a"></div>' +
          "</div>" +
        "</div>" +
      "</div>" +
      '<div class="fc-toolbar">' +
        '<button class="btn" id="fc-prev">← Anterior</button>' +
        '<button class="btn btn--primary" id="fc-next">Siguiente →</button>' +
      "</div>";

    var mazo = todas.slice(), i = 0;
    var card = document.getElementById("fc-card");

    function pintar() {
      if (!mazo.length) {
        document.getElementById("fc-q").textContent = "No hay tarjetas en este bloque.";
        document.getElementById("fc-a").textContent = "";
        document.getElementById("fc-tag").textContent = "";
        document.getElementById("fc-progress").textContent = "";
        return;
      }
      if (i >= mazo.length) i = 0;
      if (i < 0) i = mazo.length - 1;
      card.setAttribute("data-flipped", "false");
      document.getElementById("fc-tag").textContent = mazo[i].tema;
      document.getElementById("fc-q").innerHTML = mazo[i].q;
      document.getElementById("fc-a").innerHTML = mazo[i].a;
      document.getElementById("fc-progress").textContent = (i + 1) + " / " + mazo.length;
    }
    function flip() { card.setAttribute("data-flipped", card.getAttribute("data-flipped") === "true" ? "false" : "true"); }

    card.addEventListener("click", flip);
    card.addEventListener("keydown", function (e) {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
    });
    document.getElementById("fc-next").addEventListener("click", function () { i++; pintar(); });
    document.getElementById("fc-prev").addEventListener("click", function () { i--; pintar(); });
    document.getElementById("fc-shuffle").addEventListener("click", function () { shuffle(mazo); i = 0; pintar(); });
    document.getElementById("fc-tema").addEventListener("change", function (e) {
      var t = e.target.value;
      mazo = t ? todas.filter(function (c) { return c.tema === t; }) : todas.slice();
      i = 0; pintar();
    });
    document.addEventListener("keydown", function (e) {
      var tag = (e.target.tagName || "").toLowerCase();
      if (tag === "input" || tag === "select" || tag === "textarea") return;
      if (e.key === "ArrowRight") { i++; pintar(); }
      if (e.key === "ArrowLeft") { i--; pintar(); }
    });

    pintar();
  }

  /* =======================================================================
     3. QUIZ MULTIPLE CHOICE
     <div id="quiz"></div> + <script type="application/json" id="quiz-data">
     Datos: [{ tema, q, opts:[], ok: índice, fb: "explicación" }]
     ======================================================================= */
  function initQuiz() {
    var host = document.getElementById("quiz");
    if (!host) return;
    var banco = json("quiz-data");
    if (!banco || !banco.length) return;

    var temas = [];
    banco.forEach(function (q) { if (temas.indexOf(q.tema) < 0) temas.push(q.tema); });

    var barra = document.createElement("div");
    barra.className = "fc-toolbar no-print";
    barra.innerHTML =
      '<label class="small text-soft" for="quiz-tema">Bloque:</label>' +
      '<select class="select" id="quiz-tema">' +
        '<option value="">Todos (' + banco.length + ")</option>" +
        temas.map(function (t) {
          var n = banco.filter(function (q) { return q.tema === t; }).length;
          return '<option value="' + esc(t) + '">' + esc(t) + " (" + n + ")</option>";
        }).join("") +
      "</select>" +
      '<button class="btn btn--sm" id="quiz-shuffle">🔀 Mezclar</button>' +
      '<button class="btn btn--sm" id="quiz-reset">↺ Reiniciar</button>';

    var lista = document.createElement("div");
    lista.id = "quiz-list";

    var marcador = document.createElement("div");
    marcador.className = "quiz-score no-print";
    marcador.innerHTML =
      '<span><span class="quiz-score__n" id="quiz-ok">0</span> <span class="text-soft">correctas de</span> ' +
      '<span id="quiz-tot">0</span></span>' +
      '<div class="quiz-bar"><div class="quiz-bar__fill" id="quiz-fill"></div></div>' +
      '<span class="text-soft small" id="quiz-msg">Respondé para ver tu puntaje.</span>';

    host.appendChild(barra);
    host.appendChild(lista);
    host.appendChild(marcador);

    var set = banco.slice(), ok = 0, resp = 0;
    var LETRAS = ["A", "B", "C", "D", "E"];

    function pintar() {
      ok = 0; resp = 0;
      lista.innerHTML = set.map(function (q, i) {
        return '<div class="quiz-q" data-i="' + i + '" data-answered="false">' +
          '<div class="quiz-q__head">' +
            '<span class="quiz-q__n">' + (i + 1) + "</span>" +
            '<p class="quiz-q__text">' + q.q + "</p>" +
          "</div>" +
          '<ul class="quiz-opts">' +
            q.opts.map(function (o, k) {
              return '<li><label class="quiz-opt" data-k="' + k + '">' +
                '<input type="radio" name="q' + i + '" value="' + k + '">' +
                '<span class="quiz-opt__letter">' + LETRAS[k] + ".</span>" +
                "<span>" + o + "</span></label></li>";
            }).join("") +
          "</ul>" +
          '<div class="quiz-fb"></div>' +
        "</div>";
      }).join("");
      document.getElementById("quiz-tot").textContent = set.length;
      actualizar();
    }

    function actualizar() {
      document.getElementById("quiz-ok").textContent = ok;
      var pct = set.length ? Math.round((ok / set.length) * 100) : 0;
      document.getElementById("quiz-fill").style.width = pct + "%";
      var msg = document.getElementById("quiz-msg");
      if (resp === 0) { msg.textContent = "Respondé para ver tu puntaje."; return; }
      var pr = Math.round((ok / resp) * 100);
      if (resp < set.length) { msg.textContent = resp + " respondidas · " + pr + "% de acierto"; }
      else if (pr >= 80) { msg.textContent = "🎯 " + pr + "% — listo para el parcial."; }
      else if (pr >= 60) { msg.textContent = "👍 " + pr + "% — repasá los errores."; }
      else { msg.textContent = "📚 " + pr + "% — volvé a leer los bloques que fallaste."; }
    }

    lista.addEventListener("change", function (e) {
      var input = e.target;
      if (input.type !== "radio") return;
      var qbox = input.closest(".quiz-q");
      if (qbox.getAttribute("data-answered") === "true") return;

      var i = parseInt(qbox.getAttribute("data-i"), 10);
      var q = set[i];
      var elegida = parseInt(input.value, 10);
      var acierto = elegida === q.ok;

      qbox.setAttribute("data-answered", "true");
      qbox.querySelectorAll(".quiz-opt").forEach(function (lab) {
        var k = parseInt(lab.getAttribute("data-k"), 10);
        lab.querySelector("input").disabled = true;
        if (k === q.ok) lab.setAttribute("data-state", "correct");
        else if (k === elegida) lab.setAttribute("data-state", "wrong");
      });

      var fb = qbox.querySelector(".quiz-fb");
      fb.className = "quiz-fb " + (acierto ? "quiz-fb--ok" : "quiz-fb--bad");
      fb.innerHTML = "<b>" + (acierto ? "✔ Correcto" : "✘ Incorrecto — la correcta es la " + LETRAS[q.ok]) + "</b>" + q.fb;

      resp++;
      if (acierto) ok++;
      actualizar();
    });

    document.getElementById("quiz-tema").addEventListener("change", function (e) {
      var t = e.target.value;
      set = t ? banco.filter(function (q) { return q.tema === t; }) : banco.slice();
      pintar();
    });
    document.getElementById("quiz-shuffle").addEventListener("click", function () { shuffle(set); pintar(); });
    document.getElementById("quiz-reset").addEventListener("click", function () { pintar(); window.scrollTo({ top: 0, behavior: "smooth" }); });

    pintar();
  }

  /* =======================================================================
     4. FILTRO DE GLOSARIO
     <input id="gloss-filter"> sobre elementos .gloss-item
     ======================================================================= */
  function initGlossary() {
    var input = document.getElementById("gloss-filter");
    if (!input) return;
    var items = Array.prototype.slice.call(document.querySelectorAll(".gloss-item"));
    var vacio = document.getElementById("gloss-empty");
    var contador = document.getElementById("gloss-count");

    items.forEach(function (it) { it.dataset.blob = norm(it.textContent); });

    function filtrar() {
      var q = norm(input.value).trim();
      var n = 0;
      items.forEach(function (it) {
        var visible = !q || it.dataset.blob.indexOf(q) >= 0;
        it.hidden = !visible;
        if (visible) n++;
      });
      if (vacio) vacio.hidden = n > 0;
      if (contador) contador.textContent = n + " de " + items.length + " términos";
    }
    input.addEventListener("input", filtrar);
    filtrar();
  }

  /* =======================================================================
     5. Tablas: envoltorio con scroll horizontal automático
     ======================================================================= */
  function wrapTables() {
    document.querySelectorAll(".content table").forEach(function (t) {
      if (t.parentElement && t.parentElement.classList.contains("table-wrap")) return;
      var w = document.createElement("div");
      w.className = "table-wrap";
      t.parentNode.insertBefore(w, t);
      w.appendChild(t);
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    wrapTables();
    initFlows();
    initFlashcards();
    initQuiz();
    initGlossary();
  });
})();
