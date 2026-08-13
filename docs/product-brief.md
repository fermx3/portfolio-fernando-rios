# Brief de producto — Portfolio Fernando Ríos

**Estado:** en producción · https://www.fernandorios.dev
**Última revisión:** 2026-08-13

Este documento define qué es el producto, qué está entregado, qué queda fuera a propósito y qué falta. Todo lo que afirma es verificable con los comandos del [apéndice](#apéndice-cómo-verificar-este-documento).

---

## 1. Qué es y para quién

Portfolio bilingüe (EN/ES) de Fernando Ríos: data science, machine learning y desarrollo full-stack.

**Audiencia:** recruiters técnicos, hiring managers y clientes potenciales que evalúan capacidad real, no una lista de tecnologías.

**Tesis del producto:** demostrar con evidencia. Cada proyecto documenta el problema, la arquitectura, las decisiones y los resultados —no solo un título y un stack—. El diferenciador frente a un portfolio genérico es la profundidad del contenido, no el diseño.

---

## 2. Alcance actual — v1 en producción

| Área                     | Qué hay                                                                                                                                                    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Home**                 | 4 secciones: Hero, Featured Projects, About, Contact (`src/app/[locale]/page.tsx`)                                                                         |
| **Listado de proyectos** | Búsqueda por título/summary/tags · filtro por categoría · filtro por tags (lógica AND) · 3 ordenamientos · contador y estado vacío (`projects-client.tsx`) |
| **Detalle de proyecto**  | Galería con lightbox completa: navegación por teclado, dots, aspect ratio distinto para `mobile`/`web` (`project-gallery.tsx`)                             |
| **Contenido**            | 10 proyectos, paridad EN/ES al 100% (20 archivos en `content/projects/`)                                                                                   |
| **i18n**                 | EN/ES con toggle, rutas por locale, middleware de negociación                                                                                              |
| **Tema**                 | Dark/light con `next-themes`                                                                                                                               |
| **Infraestructura**      | SSG (26 páginas), sitemap, robots, 7 cabeceras de seguridad, CI de 4 pasos (format · lint · typecheck · build)                                             |

### Métricas verificadas

PageSpeed Insights, [corrida del 2026-08-13](https://pagespeed.web.dev/analysis/https-www-fernandorios-dev-es/fhcpnlfjjf):

| Categoría      | Móvil | Desktop |
| -------------- | ----- | ------- |
| Performance    | 98    | 100     |
| Accessibility  | 100   | 100     |
| Best Practices | 100   | 100     |
| SEO            | 100   | 100     |

| Métrica     | Móvil | Desktop |
| ----------- | ----- | ------- |
| LCP         | 2.4 s | 0.5 s   |
| CLS         | 0     | 0       |
| TBT         | 20 ms | 0 ms    |
| Speed Index | 1.5 s | 0.5 s   |

> El score de SEO de Lighthouse mide SEO técnico de una página aislada. **No detecta la ausencia de hreflang**, que es la carencia real de este sitio bilingüe (ver P1).

---

## 3. No-objetivos declarados

Fuera de alcance por decisión, no por olvido:

- **Blog** — el contenido de valor son los proyectos
- **CV descargable** — el sitio _es_ el CV
- **CMS** — el contenido en Git con validación Zod es suficiente para un autor único
- **Comentarios / analytics de terceros**
- **Tests E2E** — la superficie es estática y el CI ya cubre lint, tipos y build
- **Paginación** — 10 proyectos no la justifican; reevaluar a partir de ~25
- **Sección de experiencia laboral** — la trayectoria se lee a través de los proyectos

---

## 4. Backlog priorizado

### P0 — Integridad bilingüe

El sitio se vende como bilingüe, pero la superficie en español tiene inglés incrustado y pierde el idioma al navegar. Es lo que más daña la credibilidad ante un visitante hispanohablante.

| Defecto                                                                                                  | Ubicación                                                         |
| -------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Copyright en inglés fijo, **justo al lado de un `t("copyright")` traducido**                             | `src/components/layout/footer.tsx:17`                             |
| `"No projects found matching the selected filters."` en inglés fijo                                      | `src/components/projects/project-grid.tsx:14`                     |
| `aria-label="Toggle menu"` sin traducir                                                                  | `src/components/layout/navigation.tsx:57`                         |
| `metadata` es un objeto **estático en inglés** → las páginas ES sirven title, description y OG en inglés | `src/app/[locale]/layout.tsx:16`                                  |
| `openGraph.locale` fijo en `en_US` también para ES                                                       | `src/app/[locale]/layout.tsx:35`                                  |
| **Pérdida de idioma:** `href="/"` → `redirect("/en")` duro                                               | `src/app/page.tsx`, `navigation.tsx:28`, `projects-client.tsx:87` |
| El nav son anclas (`#hero`, `#projects`…) que **no existen fuera de la home**                            | `src/components/layout/navigation.tsx:13-18`                      |

**Criterio de aceptación:** navegar `/es` → proyectos → detalle → volver al inicio sin ver una sola palabra en inglés ni salir de `/es`. Metadata de `/es` en español al inspeccionar el HTML servido.

### P1 — SEO bilingüe

| Falta                                         | Impacto                                                                                                               |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `alternates.languages` (**hreflang**)         | Google no sabe que `/en/projects/x` y `/es/projects/x` son la misma página en dos idiomas. **La carencia más seria.** |
| `canonical` por página                        | Riesgo de contenido duplicado                                                                                         |
| Imagen OG                                     | Se declara `summary_large_image` pero no hay `images` → al compartir, la tarjeta sale **sin imagen**                  |
| JSON-LD                                       | Sin `Person` ni `CreativeWork`; se pierde presencia en resultados enriquecidos                                        |
| `sitemap.ts:7` usa `https://fernandorios.dev` | El sitio real es `www`. Apex y www deben resolverse consistentemente                                                  |

**Criterio de aceptación:** cada página declara hreflang recíproco EN↔ES y canonical propio; compartir un proyecto en LinkedIn muestra imagen; el sitemap usa el mismo host que sirve el sitio.

### P2 — Canal de contacto de ML engineer (dos fases)

Hoy el único canal real es `mailto:`, repetido en 3 sitios. La tarjeta izquierda de `contact.tsx:25` es un placeholder con `border-dashed` que dice _"coming soon"_ **desde marzo de 2026** (commit `1c3568c`), y quedaron 4 claves i18n huérfanas esperando un formulario que nunca se construyó: `contact.form.{name,email,message,send}`.

**La decisión de producto es no construir ese formulario.** Un formulario genérico no dice nada de un perfil de ML. El canal de contacto debe ser, en sí mismo, una demostración de capacidad.

#### Fase 1 — Asistente RAG: "Pregúntale a mi portfolio"

Chat que responde preguntas sobre experiencia y proyectos, recuperando sobre el corpus que **ya está versionado**. Es canal de contacto y demo de ML en el mismo componente: un recruiter ve el trabajo usándolo, no leyéndolo.

Criterios de aceptación:

- Corpus: `content/projects/*.mdx` en ambos idiomas + CV. No hay que crear contenido nuevo
- Responde en el idioma de la página activa
- **Cita el proyecto** del que sale cada respuesta, enlazando a `/[locale]/projects/[slug]`
- **No inventa**: si algo no está en el corpus, lo dice explícitamente
- Ofrece dejar email ante intención de contacto → **reemplaza** el placeholder, no se añade al lado
- Coste acotado: rate limit por sesión/IP y techo de tokens por conversación
- Degrada a `mailto` si el servicio falla o se agota la cuota
- Consume o elimina las 4 claves i18n huérfanas

Implicaciones técnicas a considerar antes de empezar:

- Hoy **todo es SSG**. Requiere `src/app/api/**` o una server action — la primera superficie dinámica del sitio
- Hay que ampliar `connect-src` en la CSP de `next.config.ts` (hoy `'self'`)
- Es la primera dependencia con coste recurrente del proyecto

#### Fase 2 — Demo ML embebida

Una demo real e interactiva incrustada en el sitio, con CTA hacia el asistente de la fase 1.

Criterios de aceptación:

- **Un solo modelo**, el de mayor impacto. Candidatos: `coffee-disease-detection` (clasificación de imagen, resultado visual inmediato) o `nebluna-analytics` (forecast, ya tiene API en Cloud Run)
- Latencia y coste acotados; el cold start se mitiga o se comunica al usuario
- Degrada a captura estática si el endpoint no responde
- No bloquea el LCP de la página que la aloja

### P3 — Deuda y código muerto

Nada de esto es visible para el usuario, pero cada punto es superficie que mantener:

**Código sin usar**

- `searchProjects` y `getProjectsByCategory` (`src/lib/content.ts`): **0 importaciones**. Su lógica está reimplementada a mano en `projects-client.tsx`. Además `content.ts` lleva `"use server"`, así que ambas son server actions expuestas sin motivo
- `src/i18n/routing.ts` define `routing` y **nadie lo importa**; los locales están duplicados a mano en `middleware.ts` y `src/i18n/request.ts`
- 5 dependencias MDX sin importar (`@mdx-js/mdx`, `@mdx-js/react`, `@next/mdx`, `remark`, `remark-html`) y `experimental.mdxRs` en la config

**Claves i18n huérfanas**

- `contact.form.{name,email,message,send}` — del formulario que no existe
- `about.social.title` — la tarjeta de sociales no renderiza encabezado

**Modelo de contenido**

- 6 campos validados por Zod que **nunca se renderizan**: `description`, `status`, `technologies`, `challenges`, `solutions`, `results`
- La tarjeta "Technologies" del detalle pinta `project.tags`, **no** `project.technologies` (`project-page-client.tsx:186`)
- `status` es `z.string()` libre con 3 valores en uso: `"completed"` (6), `"production"` (5), `"producción"` (5)
- `visualization` está en el enum y tiene botón de filtro, pero **ningún proyecto la usa** → filtro que siempre da 0 resultados
- `cli-task-manager` y `log-analyser` tienen `liveUrl: ""`; funciona por casualidad porque `""` es falsy
- `tattoo-kim` sin `images`, `description`, `technologies`, `status` ni `challenges`
- `sonambulo-estudio-creativo` apunta a `/images/projects/sonambulo/`, rompiendo la convención `<slug>` que documenta `CLAUDE.md`

**Riesgos latentes**

- Hay **exactamente 6 proyectos featured** y `getFeaturedProjects` corta en `.slice(0, 6)`. Un séptimo desaparecería de la home **en silencio**
- Sin `not-found.tsx`, `error.tsx` ni `loading.tsx`: el `notFound()` de un slug inexistente cae en el 404 por defecto de Next, sin layout ni traducción

---

## 5. Correcciones al README

Dos afirmaciones del `README.md` que no se sostienen:

1. **"MDX Content Management"** — el pipeline real es **Markdown**: `gray-matter` para el frontmatter y `markdown-it` para el cuerpo, inyectado con `dangerouslySetInnerHTML`. No existe `mdx-components.tsx` y ninguna dependencia MDX se importa. El contenido no puede incluir JSX.
2. **"SEO Optimized"** — cierto en SEO técnico de página aislada (Lighthouse SEO 100), pero un sitio bilingüe sin hreflang no está optimizado. Ver P1.

---

## Apéndice: cómo verificar este documento

```bash
# P0 — inglés incrustado en la superficie ES
grep -n "All rights reserved" src/components/layout/footer.tsx
grep -n "No projects found" src/components/projects/project-grid.tsx
grep -n 'export const metadata' src/app/\[locale\]/layout.tsx   # estática, no generateMetadata

# P1 — ausencias SEO
grep -rn "alternates\|hreflang\|ld+json\|canonical" src/   # sin resultados
grep -n "baseUrl =" src/app/sitemap.ts                     # apex, no www

# P2 — el placeholder y sus claves huérfanas
grep -n "comingSoon" src/components/sections/contact.tsx
grep -oE 't\("[^"]+"\)' src/components/sections/contact.tsx | sort -u   # form.name/email/message/send no aparecen

# P3 — código muerto
grep -rn "searchProjects\|getProjectsByCategory" src/ | grep -v content.ts   # sin resultados
grep -rn "i18n/routing" src/ | grep -v "routing.ts"                          # sin resultados
grep -l 'category: "visualization"' content/projects/*.mdx                   # sin resultados
grep -h '^status:' content/projects/*.mdx | sort | uniq -c                   # 3 valores distintos
grep -l 'featured: true' content/projects/*.mdx | grep -vc '\.es\.'          # 6 = el tope del slice
```
