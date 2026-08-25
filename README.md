# Apuntes de Procesos Industriales

Apuntes de estudio de **Procesos Industriales** — Ingeniería Industrial, UTN Facultad Regional
Córdoba, ciclo lectivo 2026.

### 👉 [Ver los apuntes](https://mauriicioferreyra.github.io/apuntes-procesos-industriales/)

---

## Qué hay acá

Un sitio con el desarrollo completo de las industrias que entran en el **segundo parcial**.
Cada unidad tiene teoría desarrollada, diagramas de proceso interactivos, tabla de datos, glosario,
flashcards y un banco de preguntas de multiple choice con corrección automática.

| Industria | Estado |
|-----------|--------|
| **Industria del Papel y la Madera** | ✅ Completa — 15 páginas |
| Tratamiento de Superficies | ⬜ Pendiente |
| Procesos de Mecanizado | ⬜ Pendiente |
| Tratamientos Térmicos | ⬜ Pendiente |
| Industria Química y Petroquímica | ⬜ Pendiente |
| Industria Plástica | ⬜ Pendiente |
| Industria Alimenticia | ⬜ Pendiente |

### La unidad de Papel y Madera incluye

- **11 páginas de desarrollo**: la madera como material, clasificación y especies, procesos de
  obtención, contrachapado, el papel, tipos de pasta celulósica, producción de celulosa (etapas I–VII),
  la máquina de papel, papel a partir de bagazo de caña y cuestiones medioambientales.
- **6 diagramas de flujo interactivos** — se toca una etapa y muestra qué entra, qué sale, con qué
  equipo se hace y qué variables se controlan.
- **68 preguntas** de multiple choice con explicación de por qué cada opción es correcta o incorrecta.
- **71 flashcards** agrupadas en 12 bloques temáticos.
- **Glosario de 78 términos**, filtrable.
- **Tabla maestra de datos** con todos los valores numéricos y la diapositiva de la que salió cada uno,
  más una chuleta de una carilla lista para imprimir.

---

## Cómo usarlo

Se abre desde el navegador, en la computadora o en el celular:
**https://mauriicioferreyra.github.io/apuntes-procesos-industriales/**

Atajos útiles:

| Tecla | Qué hace |
|-------|----------|
| `S` o `/` | Abre el buscador desde cualquier página |
| `↑` `↓` | Recorren los resultados de búsqueda |
| `←` `→` | Cambian de flashcard |
| `Espacio` | Da vuelta la flashcard |
| `Ctrl` + `P` | Imprime la página sin menús ni barras laterales |

Hay modo claro y oscuro (el botón ☾ arriba a la derecha), y funciona bien en pantalla de celular.

---

## Sobre las fuentes

El contenido es de **elaboración propia**, redactado a partir del material de la cátedra y de las
transcripciones de los videos de la Universidad Virtual. **Las presentaciones y notas de cátedra no
se publican en este repositorio**: son de autoría de los docentes y están disponibles para los
alumnos en la UV.

Dentro del sitio, cada afirmación cita la diapositiva de la que proviene, y todo lo que **no** sale
de la cátedra está marcado explícitamente como ampliación externa. Cuando la fuente se contradice a
sí misma o difiere de la práctica industrial, está señalado en un recuadro aparte con una
recomendación de qué conviene responder en el parcial.

> ⚠️ Esto es material de estudio hecho por un alumno. **No reemplaza a las clases ni al material
> oficial de la cátedra**, y puede contener errores. Ante cualquier diferencia, vale lo que dice
> la cátedra.

---

## Para desarrolladores (y para mi yo del futuro)

HTML, CSS y JavaScript estáticos. Sin build, sin dependencias, sin `npm install`.

```bash
# Ver el sitio en local
cd web && python -m http.server 8765
# → http://localhost:8765
```

También funciona abriendo `web/index.html` con doble clic.

El mapa completo del sitio —industrias, páginas, orden de la barra lateral, índice del buscador—
vive en una sola constante `SITE` al principio de [`web/assets/js/site.js`](web/assets/js/site.js).
Para agregar una industria se toca ese archivo y se crean los HTML nuevos.

Las convenciones de contenido (tipos de recuadro, trazabilidad de fuentes, esqueleto de páginas)
están documentadas en [`CLAUDE.md`](CLAUDE.md).

Cada push a `main` republica el sitio automáticamente vía GitHub Actions.
