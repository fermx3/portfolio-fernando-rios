---
name: add-project
description: Crea una entrada nueva de proyecto en el portfolio — el par MDX en inglés y español con frontmatter válido contra el schema de Zod, la carpeta de imágenes y la verificación de paridad. Úsala cuando el usuario pida agregar, crear o publicar un proyecto nuevo, o migrar un repo existente al portfolio.
---

# Add Project

Crear un proyecto son **dos archivos**, nunca uno. Si solo creas el `.mdx` en inglés, la versión en español cae al fallback del inglés y el portfolio queda a medias.

## Antes de escribir nada

Lee `docs/content-guidelines.md`. Ahí están los topes por campo, la estructura del cuerpo y las reglas de confidencialidad.

Pregunta al usuario lo que no puedas deducir del repo del proyecto:

1. **Slug** — kebab-case, será la URL (`/en/projects/<slug>`). Debe coincidir con el nombre de archivo.
2. **`category`** — enum cerrado, elige una:
   `data-science` · `full-stack` · `ml` · `visualization` · `web-development` · `backend-development`
3. **`featured`** — ¿va en la home? Solo se muestran los **6 primeros** featured, ordenados por fecha descendente.
4. **`repoUrl`** — obligatorio siempre. Si el repo es privado, igual va la URL y se añade `repoPrivate: true` (la UI renderiza un botón "Private Repo" deshabilitado en lugar del enlace).
5. **`liveUrl` / `demoUrl`** — opcionales. Si faltan, no se renderiza el botón de demo.
6. **`date`** — `YYYY-MM-DD` estricto, lo valida una regex en el schema. Se renderiza en UTC.

Si el usuario apunta a un repo local o de GitHub, léelo para redactar `summary`, `description`, `challenges`, `solutions` y `results` con detalle real (stack, decisiones, métricas). No inventes resultados ni cifras.

## Archivos a crear

```
content/projects/<slug>.mdx        # inglés
content/projects/<slug>.es.mdx     # español
public/images/projects/<slug>/     # cover.png + capturas
```

## Frontmatter

Requeridos: `title`, `summary`, `category`, `tags[]`, `featured`, `date`, `repoUrl`, `coverImage`
Opcionales: `description`, `objective`, `theme`, `impact`, `metric`, `team`, `context`, `technologies[]`, `status`, `repoPrivate`, `liveUrl`, `demoUrl`, `images[]`, `challenges[]`, `solutions[]`, `results[]`

**`slug` NO va en el frontmatter** — se deriva del nombre de archivo.

### Qué se comparte y qué se traduce

| Idénticos en ambos archivos                                                                                                         | Traducidos                                                                                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `date`, `featured`, `category`, `coverImage`, `images`, `repoUrl`, `repoPrivate`, `liveUrl`, `demoUrl`, `metric.value`, `team.size` | `title`, `summary`, `description`, `objective`, `theme`, `status`, `tags`, `technologies`, `challenges`, `solutions`, `results`, `metric.label`, `team.role`, `context` y el cuerpo |

**Tags — antes de inventar uno, mira los que ya existen:**

```bash
grep -h '^tags:' content/projects/*.mdx | grep -v '\.es\.' | tr ',' '\n' | tr -d '[]"' | sed 's/^ *//' | sort | uniq -c | sort -rn
```

Reglas: nombre **sin versión** (`Next.js`, no `Next.js 16`) · **no repitas la categoría** del propio proyecto · pon **dominio y tecnología real**, no detalle de implementación que ya va en `technologies` ni etiquetas vagas tipo `Responsive Design` · los arrays EN/ES **se emparejan por posición**, mismo número y mismo orden. `pnpm check:content` valida las tres primeras.

`tags` y `technologies` van en el idioma del archivo (`"Data Science"` / `"Ciencia de Datos"`): `getAllTags()` es locale-aware y alimenta los filtros. `category` no se traduce nunca — es clave de enum y la UI la localiza al renderizar.

### Plantilla

```yaml
---
title: "<Título>"
summary: "<Qué es y con qué está construido>" # 1 frase, ≤ 30 palabras
description: "<Alcance técnico que summary no dice>" # ≤ 45 palabras
objective: "<Problema que resuelve>" # ≤ 15 palabras
theme: "<Dominio>" # ≤ 8 palabras; omitir si no aporta
impact: "<Qué cambió y para quién>" # ≤ 2 frases; cierre de la página
metric: # opcional; solo una cifra verificable en el repo
  value: "<cifra>" # idéntico en EN y ES
  label: "<qué mide>" # ≤ 10 palabras, se traduce
team: # opcional; solo proyectos en equipo
  size: 4 # idéntico en EN y ES
  role: "<tu papel>"
context: "<origen del proyecto>" # opcional
date: "YYYY-MM-DD"
status: "production" # enum: completed | production | archived (NO se traduce)
featured: false
category: "web-development"
tags: ["Tag Uno", "Tag Dos"]
technologies: # único lugar del stack; sin descripciones
  - "Tecnología"
liveUrl: "https://..." # omitir si no hay demo
repoUrl: "https://github.com/fermx3/<repo>"
repoPrivate: true # solo si el repo es privado
coverImage: "/images/projects/<slug>/cover.png"
images:
  - "/images/projects/<slug>/captura.png"
  - { src: "/images/projects/<slug>/movil.png", type: "mobile", alt: "..." }
challenges: # máx. 3, ≤ 15 palabras c/u; pareados con solutions por índice
  - "<Problema real que hubo que resolver>"
solutions: # máx. 3, ≤ 15 palabras c/u
  - "<Cómo se resolvió>"
results: # máx. 3; solo verificables en el repo
  - "<Resultado concreto y verificable>"
---
```

`images[]` acepta string (se asume `web`) u objeto `{ src, type: 'mobile' | 'web', alt }`. El `type` decide el aspect ratio en la galería y el lightbox — márcalo `mobile` en capturas de app móvil o se verán deformadas.

## Cuerpo

Tono, estructura, tope de 200 palabras y confidencialidad: **[`docs/content-guidelines.md`](../../../docs/content-guidelines.md). Léelo antes de redactar; es obligatorio.**

El ejemplo a seguir es `content/projects/portfolio-website.mdx` (y su `.es.mdx`).

## Imágenes

Todo bajo `public/images/projects/<slug>/`. `cover.png` es obligatoria — es la miniatura de la tarjeta. Las rutas del frontmatter son absolutas desde `public/` (empiezan con `/images/...`, sin `public`).

## Verificación final — obligatoria

```bash
pnpm check:content   # imágenes existen, paridad EN/ES, tope de featured
pnpm build
```

Cuenta las rutas generadas: deben aparecer **dos nuevas** (`/en/projects/<slug>` y `/es/projects/<slug>`).

> ⚠️ **Trampa crítica:** `getAllProjects()` envuelve todo en `try/catch` y devuelve `[]` al fallar. **Un frontmatter inválido en tu proyecto nuevo borra la lista completa de proyectos del sitio**, sin ningún error en consola ni en el build. Si tras agregar el proyecto la página `/projects` sale vacía, el culpable es tu frontmatter — no un bug de la UI.

Reporta el número de palabras de cada archivo (`wc -w`) y confirma que el cuerpo, lo que va después del segundo `---`, queda en ≤ 200.

Después corre la skill `verify` para cerrar con lint, typecheck y paridad EN/ES.
