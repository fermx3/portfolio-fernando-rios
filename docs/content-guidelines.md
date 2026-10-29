# Reglas de redacción de proyectos

Fuente única de las reglas para escribir las entradas de `content/projects/`. Las skills `add-project` y `edit-project` remiten aquí; no copies estas reglas en otro sitio.

El schema (qué campos existen y cuáles son obligatorios) vive en `src/lib/validations.ts`. Este documento cubre **qué se escribe** en cada uno.

## Principio

Menos es más. Una entrada describe **qué hace el proyecto y con qué está construido**. Si una frase no aporta un hecho técnico o una funcionalidad, se borra.

El repo del proyecto manda: si el texto contradice el código, se corrige el texto. Nunca inventar cifras; un resultado sin respaldo verificable se elimina, no se reformula.

Dos razones para el recorte: quien lee un portfolio escanea, no lee un artículo; y el frontmatter y el cuerpo enteros viajan al system prompt del asistente (`src/lib/assistant/corpus.ts`), así que cada palabra se paga en cada petición.

## Un dato, un lugar

La página renderiza todos los campos. Cada uno tiene un solo trabajo y ninguno repite a otro:

| Campo                | Trabajo                              | Tope                      |
| -------------------- | ------------------------------------ | ------------------------- |
| summary              | Qué es + con qué. Tarjeta y meta SEO | 1 frase, ≤ 30 palabras    |
| description          | Alcance técnico que summary no dice  | ≤ 45 palabras             |
| objective            | Problema que resuelve                | ≤ 15 palabras             |
| theme                | Dominio. Si no aporta, se omite      | ≤ 8 palabras              |
| impact               | Qué cambió y para quién (cierre)     | ≤ 2 frases                |
| metric               | La cifra de la tarjeta y del detalle | 1 por proyecto, opcional  |
| team / context       | Equipo y origen, fila de datos       | solo si existen           |
| challenges/solutions | Pareados por índice                  | máx. 3, ≤ 15 palabras c/u |
| results              | Solo verificables                    | máx. 3                    |
| technologies         | Único lugar donde va el stack        | sin descripciones         |

`summary`, `objective` y `theme` aparecen también en la tarjeta del listado; `impact` cierra la página de detalle.

### metric

`{ value, label }`: `value` es la cifra (`"96.8%"`, `"3"`, `"1,900+"`) y `label` la explica en ≤ 10 palabras (`"plataformas: web, iOS y Android"`). Se lee como una frase, `value` + `label`.

- **Verificable en el repo del proyecto**, como `results`. Si no hay una cifra que se pueda comprobar, el proyecto va sin `metric`: la tarjeta funciona igual. Nunca rellenar con una cifra genérica.
- **Que no caduque.** Si la cifra crece sola (tests, usuarios), escribe un piso redondeado con `+` (`"1,900+"`), que sigue siendo cierto cuando crece.
- **`value` idéntico en EN y ES**, sin unidades que se traduzcan: la unidad va en `label` (`"7–90"` + `"días de pronóstico…"`). Separador de miles con coma y decimales con punto en los dos idiomas. `pnpm check:content` lo comprueba.

### team y context

`team: { size, role }` solo en proyectos hechos en equipo; `role` es tu papel (`"Liderazgo del proyecto"`). `context` dice de dónde salió el proyecto (`"Proyecto final, bootcamp de Data Science & AI de Le Wagon"`), ≤ 10 palabras. `size` se comparte entre EN y ES; `role` y `context` se traducen.

## Cuerpo (≤ 200 palabras)

Estructura fija:

```markdown
## Resumen <!-- EN: ## Overview. 2–3 frases -->

## Implementación Técnica <!-- EN: ## Technical Implementation -->

### <Área> <!-- una por área: datos, seguridad, interfaz…; 1–3 frases -->

## Funcionalidad <!-- EN: ## Features. Viñetas de una línea -->
```

Prohibido en el cuerpo:

- Secciones de stack, despliegue o "decisiones de diseño": ya viven en `technologies` / `solutions`.
- Repetir cualquier campo del frontmatter.
- Adjetivos de relleno: moderno, fluido, robusto, limpio, profesional, potente.
- Explicar qué es una tecnología.
- Aperturas de ensayo, aforismos, metáforas, guiones largos.

`## Challenges & Solutions` y `## Results` nunca se escriben en el cuerpo: la página los renderiza desde el frontmatter.

## Confidencialidad (no negociable)

Nunca incluir: secretos, nombres de variables de entorno, URLs internas o de APIs privadas, parámetros de seguridad (límites de rate limit, tamaños máximos, umbrales), esquemas de BD, volúmenes de operación, precios, ingresos, nombres de clientes finales ni lógica de negocio que el cliente no publicaría.

Las protecciones se describen por su tipo ("límite por IP"), nunca por sus valores. El repo del portfolio es público.

## Paridad EN/ES

Mismo contenido en ambos archivos. `tags` y `technologies` con el mismo número y orden: se emparejan por posición. Encabezados traducidos en el `.es.mdx`.

## Ejemplo

`content/projects/portfolio-website.mdx` y su `.es.mdx`.
