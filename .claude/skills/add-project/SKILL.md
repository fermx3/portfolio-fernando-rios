---
name: add-project
description: Crea una entrada nueva de proyecto en el portfolio — el par MDX en inglés y español con frontmatter válido contra el schema de Zod, la carpeta de imágenes y la verificación de paridad. Úsala cuando el usuario pida agregar, crear o publicar un proyecto nuevo, o migrar un repo existente al portfolio.
---

# Add Project

Crear un proyecto son **dos archivos**, nunca uno. Si solo creas el `.mdx` en inglés, la versión en español cae al fallback del inglés y el portfolio queda a medias.

## Antes de escribir nada

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
Opcionales: `description`, `objective`, `theme`, `technologies[]`, `status`, `repoPrivate`, `liveUrl`, `demoUrl`, `images[]`, `challenges[]`, `solutions[]`, `results[]`

**`slug` NO va en el frontmatter** — se deriva del nombre de archivo.

### Qué se comparte y qué se traduce

| Idénticos en ambos archivos                                                                            | Traducidos                                                                                                                                  |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `date`, `featured`, `category`, `coverImage`, `images`, `repoUrl`, `repoPrivate`, `liveUrl`, `demoUrl` | `title`, `summary`, `description`, `objective`, `theme`, `status`, `tags`, `technologies`, `challenges`, `solutions`, `results` y el cuerpo |

`tags` y `technologies` van en el idioma del archivo (`"Data Science"` / `"Ciencia de Datos"`): `getAllTags()` es locale-aware y alimenta los filtros. `category` no se traduce nunca — es clave de enum y la UI la localiza al renderizar.

### Plantilla

```yaml
---
title: "<Título>"
summary: "<Una o dos frases: qué es y con qué está construido>"
description: "<Párrafo: alcance técnico completo>"
objective: "<Qué problema resuelve y para quién>"
theme: "<Una línea que enmarca el dominio>"
date: "YYYY-MM-DD"
status: "production" # traducir a "producción" en el .es.mdx
featured: false
category: "web-development"
tags: ["Tag Uno", "Tag Dos"]
technologies:
  - "Tecnología"
liveUrl: "https://..." # omitir si no hay demo
repoUrl: "https://github.com/fermx3/<repo>"
repoPrivate: true # solo si el repo es privado
coverImage: "/images/projects/<slug>/cover.png"
images:
  - "/images/projects/<slug>/captura.png"
  - { src: "/images/projects/<slug>/movil.png", type: "mobile", alt: "..." }
challenges:
  - "<Problema real que hubo que resolver>"
solutions:
  - "<Cómo se resolvió>"
results:
  - "<Resultado concreto y verificable>"
---
```

`images[]` acepta string (se asume `web`) u objeto `{ src, type: 'mobile' | 'web', alt }`. El `type` decide el aspect ratio en la galería y el lightbox — márcalo `mobile` en capturas de app móvil o se verán deformadas.

## Cuerpo

Markdown estándar tras el frontmatter. La estructura que siguen los proyectos existentes:

```markdown
## Project Overview

## The Problem

## Architecture

### <Subsecciones por capa>

## Challenges & Solutions

## Results
```

En el `.es.mdx`, traduce también los encabezados.

## Imágenes

Todo bajo `public/images/projects/<slug>/`. `cover.png` es obligatoria — es la miniatura de la tarjeta. Las rutas del frontmatter son absolutas desde `public/` (empiezan con `/images/...`, sin `public`).

## Verificación final — obligatoria

```bash
pnpm build
```

Cuenta las rutas generadas: deben aparecer **dos nuevas** (`/en/projects/<slug>` y `/es/projects/<slug>`).

> ⚠️ **Trampa crítica:** `getAllProjects()` envuelve todo en `try/catch` y devuelve `[]` al fallar. **Un frontmatter inválido en tu proyecto nuevo borra la lista completa de proyectos del sitio**, sin ningún error en consola ni en el build. Si tras agregar el proyecto la página `/projects` sale vacía, el culpable es tu frontmatter — no un bug de la UI.

Después corre la skill `verify` para cerrar con lint, typecheck y paridad EN/ES.
