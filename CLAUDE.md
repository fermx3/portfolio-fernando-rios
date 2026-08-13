# Portfolio Fernando Ríos — Claude Code Playbook

**Stack:** Next.js 16.1 (App Router) · React 19.2 · TypeScript 5 (strict) · Tailwind 4 · next-intl · MDX
**Deploy:** Vercel → https://www.fernandorios.dev
**Node:** ver `.nvmrc` (22.23.1) · piso real `>=20.9.0` (lo exige Next 16)
**Gestor:** pnpm. `pnpm-lock.yaml` es el único lockfile válido.

## Reglas no negociables

- Commits en **Conventional Commits** (`feat:`, `fix:`, `chore:`) — es la convención de todo el historial.
- TypeScript `strict: true`. Nada de `any` ni `@ts-ignore` sin comentario que lo justifique.
- **Paridad EN/ES obligatoria.** Todo proyecto necesita el par `<slug>.mdx` + `<slug>.es.mdx`. Los campos estructurales deben ser **idénticos**; los de contenido se traducen (ver tabla abajo). Toda clave nueva en `messages/en.json` debe existir en `messages/es.json`.
- **Fechas en formato `YYYY-MM-DD`**, renderizadas en UTC por `formatDate()` para que el día no se corra por zona horaria. El schema lo valida con regex.
- No agregar dependencias sin justificarlo antes.
- Nunca editar a mano `pnpm-lock.yaml`, `.next/` ni `node_modules/`.

## Modelo de contenido (lo más importante de este repo)

Los proyectos son MDX en `content/projects/`, con frontmatter validado por Zod en `src/lib/validations.ts`.

**Campos requeridos:** `title`, `summary`, `category`, `tags[]`, `featured`, `date`, `repoUrl`, `coverImage`
**Opcionales:** `description`, `objective`, `theme`, `technologies[]`, `status`, `repoPrivate`, `liveUrl`, `demoUrl`, `images[]`, `challenges[]`, `solutions[]`, `results[]`

`category` es un enum cerrado:
`data-science` | `full-stack` | `ml` | `visualization` | `web-development` | `backend-development`

**Qué se comparte y qué se traduce entre el par EN/ES:**

| Idénticos (estructurales)                                                                              | Traducidos (contenido)                                                                                                                      |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `date`, `featured`, `category`, `coverImage`, `images`, `repoUrl`, `repoPrivate`, `liveUrl`, `demoUrl` | `title`, `summary`, `description`, `objective`, `theme`, `status`, `tags`, `technologies`, `challenges`, `solutions`, `results` y el cuerpo |

`category` se mantiene igual porque es una clave de enum; la UI la traduce al renderizar. `tags` **sí** se traducen: `getAllTags()` es locale-aware y alimenta los filtros en el idioma activo.

**Convenciones:**

- `slug` NO va en el frontmatter — se deriva del nombre de archivo en `src/lib/content.ts`.
- Sin `liveUrl`/`demoUrl` → no se renderiza el botón de demo.
- `repoPrivate: true` → la UI muestra un botón "Private Repo" deshabilitado. `repoUrl` sigue siendo obligatorio.
- `images[]` acepta string o `{ src, type: 'mobile' | 'web', alt }`; el `type` decide el aspect ratio en la galería/lightbox.
- Imágenes en `public/images/<slug>/`.

> ⚠️ **Trampa conocida:** `getAllProjects()` en `src/lib/content.ts` envuelve todo en `try/catch` y devuelve `[]` al fallar. Si el frontmatter de **un solo** proyecto no pasa el schema de Zod, **desaparece la lista completa de proyectos** sin ningún error visible. Ante una página de proyectos vacía, sospecha primero de frontmatter inválido en el MDX que acabas de tocar.

## Cómo trabajar aquí

- Alcance del producto en `docs/product-brief.md`: qué está entregado, qué queda fuera a propósito y el backlog priorizado. Consúltalo antes de proponer features nuevas.
- Permisos versionados en `.claude/settings.json`. Lo específico de máquina va en `.claude/settings.local.json` (git-ignored).
- Skills reutilizables en `.claude/skills/`.
- `/clear` entre features grandes para resetear contexto.

## Checklist antes de push

- [ ] `pnpm lint` pasa
- [ ] `pnpm typecheck` pasa
- [ ] `pnpm build` compila
- [ ] Si tocaste contenido o traducciones: paridad EN/ES verificada
- [ ] La lista de proyectos sigue renderizando (ver la trampa de arriba)
- [ ] Sin errores en la consola del navegador
