# Procesos Industriales — UTN FRC, Ingeniería Industrial, 2026

Materia de 4.º año. Cátedra: Prof. Ing. Ricardo Bonaiuti, Mg. Ing. César Dalla Costa,
Ing. Darío Gonella, Ing. Alejandra Novara, Lic. Vivian Coggiola.

El objetivo de este repositorio es sostener un **sitio de apuntes** (`web/`) que reemplaza a los
resúmenes en PDF: una página por industria, con desarrollo teórico completo, diagramas, glosario,
flashcards y banco de multiple choice.

---

## Estructura de la carpeta

```
Procesos Industriales/
├── CLAUDE.md                         ← este archivo
├── 0.Regl-GuiaTemas26.Rev2.pdf       ← reglamento + programa de las 11 unidades
├── Notas de Cátedra.pdf
├── <Unidad del 1.º parcial>/         ← Fundiciones, Soldadura, Petroquímica, etc.
├── Segundo Parcial/
│   ├── Industria Papel-Madera/
│   │   ├── PAPEL Y MADERA 2026.pdf   ← presentación de la cátedra (fuente principal)
│   │   └── TRANSCRIPCIONES DE LOS VIDEOS CARGADOS EN UV/
│   │       └── *.pdf                 ← informes técnicos generados con NotebookLM
│   └── Tratamientos Superficiales/
└── web/                              ← EL SITIO
    ├── index.html                    ← portada: las 7 industrias del 2.º parcial
    ├── assets/
    │   ├── css/libdoc.css            ← toda la hoja de estilos
    │   └── js/
    │       ├── site.js               ← MAPA DEL SITIO + nav, buscador, tema, TOC, pager
    │       └── study.js              ← diagramas de flujo, flashcards, quiz, filtro de glosario
    └── papel-madera/                 ← una carpeta por industria
        └── *.html
```

---

## Cómo está hecho el sitio

- **HTML/CSS/JS estático puro.** Sin build, sin npm, sin dependencias externas.
  Se puede abrir con doble clic (`file://`) o servir con cualquier servidor.
- **Diseño inspirado en [LibDoc](https://github.com/ita-design-system/eleventy-libdoc)**:
  sidebar persistente, TOC flotante con scroll-spy, buscador con atajo `S`, modo claro/oscuro,
  y hoja de impresión limpia.
- **Servir en local:**
  ```bash
  cd web && python -m http.server 8765
  ```

### Reglas de mantenimiento

1. **El mapa del sitio vive en un solo lugar:** la constante `SITE` al principio de
   `web/assets/js/site.js`. La sidebar, la portada, el buscador y la paginación se generan
   desde ahí. Para agregar una página o una industria, se toca **solo ese archivo** (más el HTML nuevo).
2. **Cada página HTML es autónoma en contenido pero comparte el chasis.** Copiar cualquier página
   existente como plantilla: el `<head>`, el `<header id="site-header">`, la `.sidebar`,
   la `.breadcrumb`, la `.toc`, la `.pager` y los dos `<script>` finales se dejan tal cual.
   Solo cambia lo que está dentro de `<main class="content">`.
3. **`window.SITE_ROOT`** se declara en el `<head>` de cada página: `""` en la portada,
   `"../"` en las páginas de industria.
4. **Los datos de los componentes interactivos van en la misma página**, como
   `<script type="application/json">`, para que el contenido se edite junto al texto.

---

## Cómo cargar una industria nueva

### 1. Leer las fuentes completas antes de escribir

- La **presentación de la cátedra** es la fuente principal y **manda sobre cualquier otra**.
- Muchas diapositivas son **solo imagen** y no tienen texto extraíble. Hay que renderizarlas y leerlas
  como imagen, o se pierden tablas comparativas y diagramas enteros:
  ```bash
  python -c "import fitz; d=fitz.open('X.pdf'); [d[i-1].get_pixmap(matrix=fitz.Matrix(1.6,1.6)).save(f'p{i}.png') for i in (13,18,37)]"
  ```
- Las **transcripciones de video** complementan, no reemplazan. Si contradicen a la presentación,
  gana la presentación y **se deja la contradicción anotada**.

### 2. Registrar la industria en `site.js`

En `SITE.unidades`, cambiar `estado: "pendiente"` por `"listo"` y cargar el array `paginas`:

```js
{
  id: "tratamientos-superficiales",     // = nombre de la carpeta
  nombre: "Tratamiento de Superficies",
  corto: "Tratamientos Superficiales",  // para la sidebar
  icono: "⚙️",
  estado: "listo",
  resumen: "…",                          // subtítulo de la tarjeta de portada
  docente: "Ing. …",
  paginas: [
    { url: "index.html", titulo: "Panorama de la unidad", desc: "…", claves: "palabras sueltas para el buscador" },
    …
  ]
}
```

### 3. Escribir las páginas siguiendo el esqueleto estándar

Orden que funcionó bien y conviene repetir:

| # | Página | Contenido |
|---|--------|-----------|
| 1 | `index.html` | **Panorama**: de qué se trata la unidad, diagrama de flujo interactivo global, las cifras clave, mapa de las páginas, trampas típicas |
| 2–n | temáticas | El desarrollo, **en el mismo orden en que lo da la cátedra** |
| n+1 | `datos-clave.html` | Tabla maestra de todos los números con su diapositiva de origen + chuleta imprimible |
| n+2 | `glosario.html` | Todo el vocabulario, con sinónimos, filtrable |
| n+3 | `flashcards.html` | Tarjetas por bloque |
| n+4 | `quiz.html` | Multiple choice con explicación de cada respuesta |

### 4. Verificar antes de dar por terminado

```bash
# JSON de flashcards / quiz / diagramas
python -c "import io,json,re,glob; [print(f, i, len(json.loads(m.group(2)))) for f in glob.glob('web/**/*.html',recursive=True) for i,m in [(0,m) for m in re.finditer(r'<script type=\"application/json\" id=\"([^\"]+)\">(.*?)</script>', io.open(f,encoding='utf-8').read(), re.S)]]"
```

- Las 4 piezas interactivas responden: diagrama de flujo, quiz, flashcards, filtro de glosario.
- Sin errores en consola, sin scroll horizontal en 375 px de ancho.
- Enlaces internos sin romper.

---

## Convenciones de contenido (importante)

### Tono y nivel

Nivel de 4.º año de ingeniería. **Explicar el porqué, no solo el qué.** Cuando la cátedra enuncia un
procedimiento sin justificarlo, agregar la justificación técnica —marcada como ampliación—, porque es
lo que se pregunta en un oral.

### Los cinco tipos de callout

| Clase | Color | Para qué |
|-------|-------|----------|
| `callout--dato` | naranja | Un número, rango o porcentaje que conviene memorizar |
| `callout--ojo` | rojo | Error frecuente, confusión típica, trampa de multiple choice |
| `callout--parcial` | verde | Lo que la cátedra remarca o suele tomar |
| `callout--nota` | azul | Aclaración, contexto o **ampliación externa a la cátedra** |
| `callout--duda` | violeta | Vacío, ambigüedad, contradicción de la fuente o divergencia con la bibliografía |

### Trazabilidad de las fuentes — no negociable

- Todo dato de la cátedra se cita con su diapositiva: «Diap. 66», «diapositiva 37».
- Todo lo que **no** venga de la cátedra se marca explícitamente como
  <span>ampliación externa</span>, con la etiqueta `<span class="badge badge--accent">Ampliación</span>`
  o la frase «*(Ampliación externa.)*».
- **Las contradicciones de la fuente no se corrigen en silencio.** Se documentan en un
  `callout--duda`, explicando qué dice la cátedra, qué dice la práctica industrial, y **qué conviene
  responder en el parcial**. Ejemplos ya documentados en Papel y Madera:
  - humedad de secado «< 3 %» (real: 8–12 %);
  - maderas blandas descritas como «hoja perenne» y «hoja caduca» en la misma diapositiva;
  - el abedul listado como blanda y como dura;
  - «consta de cinco etapas» seguido de una lista de cuatro;
  - fibra larga/corta invertida entre la presentación y el video;
  - NO₂ y SO₂ listados como gases de efecto invernadero.

### Formato

- Español rioplatense, **voseo** («fijate», «tené en cuenta», «poné»).
- Valores numéricos con `<span class="val">130–179 °C</span>`.
- Términos técnicos con `<span class="term">…</span>`.
- Cada página cierra con `<h2 id="resumen">En resumen</h2>` y un `.page-foot` que cita las fuentes.

---

## Estado de las unidades del 2.º parcial

| Industria | Estado | Fuente disponible |
|-----------|--------|-------------------|
| Papel y Madera | ✅ Completa — 15 páginas | Presentación 2026 + 3 informes de video |
| Tratamiento de Superficies | ⬜ Pendiente | `Tratamiento_de_Superficies_Metalicas_Trabajo - Dario.ppt` + informe de galvanizado por inmersión en caliente (está guardado por error en la carpeta de Papel-Madera) |
| Procesos de Mecanizado | ⬜ Pendiente | Sin material |
| Tratamientos Térmicos | ⬜ Pendiente | Sin material |
| Industria Química y Petroquímica | ⬜ Pendiente | Sin material |
| Industria Plástica | ⬜ Pendiente | Sin material |
| Industria Alimenticia | ⬜ Pendiente | Sin material |

> El reparto de unidades entre parciales está **deducido** de cómo están organizadas las carpetas;
> no figura en el reglamento. Si la cátedra anuncia otro reparto, actualizar `SITE.unidades` en
> `site.js` y la tabla del programa en `web/index.html`.

---

## Reglamento (resumen operativo)

| Requisito | Regular | Aprobación directa |
|-----------|---------|--------------------|
| Asistencia | 75 % | 85 % |
| Nota en las 2 autoevaluaciones | ≥ 6 | ≥ 8 |
| Nota en el TPI | ≥ 6 | ≥ 8 |

- **Un solo recuperatorio**, para **una sola** de las dos autoevaluaciones. El **TPI no se recupera**.
- Las actividades asincrónicas de la UV son obligatorias e impactan en la asistencia.
- Canales oficiales: Autogestión Académica, UV y `procesos.industriales.frc@gmail.com`.
