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

### ~~P0 — Integridad bilingüe~~ · resuelto 2026-08-13

La superficie en español tenía inglés incrustado y perdía el idioma al navegar. Resuelto:

- Copyright del footer y `aria-label` del menú móvil, ahora traducidos
- `metadata` pasó de objeto estático a `generateMetadata`: `/es` sirve title, description, `og:locale` y `og:url` en español
- Todos los enlaces internos usan el `Link` locale-aware de `src/i18n/navigation.ts`; `href="/"` ya no cae en el `redirect("/en")` de la raíz
- El nav apunta a `/#seccion` en vez de anclas sueltas, así que funciona desde cualquier página
- `routing` es ahora la única fuente de locales, consumida por `middleware.ts`, `request.ts` y el toggle de idioma

**Corrección al diagnóstico original.** Este documento listaba `"No projects found matching the selected filters."` (`project-grid.tsx:14`) como defecto visible. **Era falso:** ambos llamadores del grid filtran con `length > 0` y renderizan su propio estado vacío traducido, así que esa rama era inalcanzable. Se eliminó como código muerto en vez de traducirse.

**Efecto secundario medido:** al declarar el locale con `setRequestLocale`, `/[locale]` y `/[locale]/projects` pasaron de renderizado dinámico a prerenderizado. El sitio entero es ahora estático.

### ~~P1 — SEO bilingüe~~ · resuelto 2026-08-15

- **hreflang recíproco** (`en`, `es`, `x-default`) y **canonical propio** en home, listado y detalle de proyecto
- **Imagen OG** generada por idioma en `src/app/[locale]/opengraph-image.tsx`
- **JSON-LD**: `Person` en la home, `CreativeWork` en cada proyecto
- **Host unificado**: `src/lib/site.ts` es la única fuente. El sitemap pasó de 24 URLs con el apex a 24 con `www`, con 72 `xhtml:link` de alternates, y ya no lista la raíz (que redirige). `robots.txt` es ahora generado

**El apex redirige (307) a `www`**, comprobado con `curl`, así que `www` es el host canónico y el sitemap anterior publicaba 24 redirecciones a los crawlers.

**Trampa encontrada al implementar:** declarar `openGraph` en el `generateMetadata` de una página **anula la imagen basada en archivo** que debería heredar. El listado y el detalle se quedaron sin `og:image` hasta declararla explícitamente con el helper `ogImage(locale)`. Si en el futuro alguna página nueva define `openGraph`, tiene que incluir `images` o repetirá el fallo.

**Nota:** la ruta `opengraph-image` se renderiza a demanda (sale como dinámica en el build), no en tiempo de build. La CDN la cachea y las páginas HTML siguen siendo estáticas.

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
- 5 dependencias MDX sin importar (`@mdx-js/mdx`, `@mdx-js/react`, `@next/mdx`, `remark`, `remark-html`) y `experimental.mdxRs` en la config

> La duplicación de locales entre `routing.ts`, `middleware.ts` y `request.ts` que figuraba aquí se resolvió al arreglar P0.

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
# P0 — resuelto: estas comprobaciones deben salir en verde
curl -s https://www.fernandorios.dev/es | grep -o '©[^<]*'          # en español
curl -s https://www.fernandorios.dev/es | grep -o '<title>[^<]*'    # en español
grep -rn 'from "next/link"' src/                                    # sin resultados: todo usa @/i18n/navigation
grep -rn "getCurrentLocale" src/                                    # sin resultados: nadie deriva el locale a mano
pnpm build | grep -c '●'                                            # las rutas [locale] salen prerenderizadas

# P1 — resuelto: estas comprobaciones deben salir en verde
# grep -o | wc -l, no grep -c: el HTML de producción viene minificado en una sola
# línea, así que -c devolvería 1 aunque haya tres etiquetas.
curl -s https://www.fernandorios.dev/es | grep -o 'rel="alternate" hrefLang' | wc -l   # 3: en, es, x-default
curl -s https://www.fernandorios.dev/es | grep -o 'rel="canonical" href="[^"]*"'
curl -s https://www.fernandorios.dev/sitemap.xml | grep -o '<loc>https://fernandorios.dev' | wc -l  # 0: ninguna apex
curl -s https://www.fernandorios.dev/es/projects/nebluna-analytics | grep -o 'og:image" content="[^"]*"'
curl -sI https://www.fernandorios.dev/es/opengraph-image | grep -i content-type   # image/png

# P2 — el placeholder y sus claves huérfanas
grep -n "comingSoon" src/components/sections/contact.tsx
grep -oE 't\("[^"]+"\)' src/components/sections/contact.tsx | sort -u   # form.name/email/message/send no aparecen

# P3 — código muerto
grep -rn "searchProjects\|getProjectsByCategory" src/ | grep -v content.ts   # sin resultados
grep -l 'category: "visualization"' content/projects/*.mdx                   # sin resultados
grep -h '^status:' content/projects/*.mdx | sort | uniq -c                   # 3 valores distintos
grep -l 'featured: true' content/projects/*.mdx | grep -vc '\.es\.'          # 6 = el tope del slice
```
