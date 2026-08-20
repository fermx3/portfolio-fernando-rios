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

El único canal era `mailto:`, repetido en 3 sitios. La tarjeta izquierda de `contact.tsx` era un placeholder con `border-dashed` que decía _"coming soon"_ **desde marzo de 2026** (commit `1c3568c`), con 3 claves i18n huérfanas esperando un formulario que nunca se construyó.

**La decisión de producto es no construir ese formulario.** Un formulario genérico no dice nada de un perfil de ML. El canal de contacto debe ser, en sí mismo, una demostración de capacidad.

#### ~~Fase 1 — Asistente "Pregúntale a mi portfolio"~~ · entregado 2026-08-17

Chat que responde sobre los proyectos citando la fuente, y que recoge el contacto dentro de la conversación en vez de junto a ella. Sustituye al placeholder; las claves `contact.form.*` se eliminaron.

Criterios cumplidos:

- Corpus: `content/projects/*.mdx` en ambos idiomas (**no hay CV en el repo**; si aparece, entra como una sección más en `src/lib/assistant/corpus.ts`)
- Responde en el idioma de la página activa
- Cita el proyecto con `[[slug]]`, que el cliente convierte en enlace a `/[locale]/projects/[slug]`
- No inventa: el prompt le prohíbe suponer formación, disponibilidad o tarifas, nada de lo cual está en el corpus
- Captura el contacto con la tool `capture_lead` → Resend
- Coste acotado: prompt caching, rate limit distribuido, techo de `max_tokens`, historial recortado. Medido: ~$0.15 la conversación de un turno, ~$0.19 la de tres — el desglose y por qué el caso caliente engaña están en `CLAUDE.md`
- Degrada a `mailto` sin API key, con error o pasado el límite

**Tres supuestos del brief que resultaron falsos al implementarlo:**

| Se asumía                                 | Lo que era cierto                                                                                                                                                                                                 |
| ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hacía falta RAG con base vectorial        | El corpus cabe entero en el prompt: 23k tokens en ES y 18k en EN, medidos con `usage`. Sin embeddings ni chunking, y además responde mejor a preguntas transversales ("¿en qué proyectos usaste X?") que un top-k |
| Había que ampliar `connect-src` en la CSP | No. El navegador solo llama a `/api/ask`, mismo origen; la salida a Anthropic es del servidor. `connect-src 'self'` ya lo cubría                                                                                  |
| Faltaba tocar el middleware               | Su matcher ya excluía `api` (`middleware.ts:9`)                                                                                                                                                                   |

Lo que sí se confirmó: es la **primera superficie dinámica** del sitio (`/api/ask`, el resto sigue siendo SSG) y el **primer coste recurrente**.

**Decisiones de seguridad, porque es un endpoint público con una capacidad que produce efectos:**

- El historial que manda el cliente es falsificable, así que **ninguna decisión del servidor depende de lo que diga la conversación**: roles en whitelist, system prompt y tools siempre del servidor
- `to` y `from` del correo los fija el servidor. El peor caso de una conversación manipulada es ruido en la bandeja propia, no un relay hacia terceros
- El correo se manda en texto plano, con los campos marcados como no verificados
- La salida del modelo se renderiza como **texto**, nunca con `dangerouslySetInnerHTML` — y solo los slugs que existen se vuelven enlaces
- El freno duro del gasto es el tope mensual en la API key, no el rate limit: en serverless un contador por instancia es best-effort aunque esté sobre Upstash. Se fija por lo que estás dispuesto a perder ante un abuso, no por el consumo previsto

No se añadió clasificador de entrada ni lista de frases prohibidas: a esta escala añaden latencia y falsos positivos sin cerrar nada que lo anterior no cierre.

#### Fase 2 — Demo ML embebida · pendiente

Una demo real e interactiva incrustada en el sitio, con CTA hacia el asistente de la fase 1.

Criterios de aceptación:

- **Un solo modelo**, el de mayor impacto. Candidatos: `coffee-disease-detection` (clasificación de imagen, resultado visual inmediato) o `nebluna-analytics` (forecast, ya tiene API en Cloud Run)
- Latencia y coste acotados; el cold start se mitiga o se comunica al usuario
- Degrada a captura estática si el endpoint no responde
- No bloquea el LCP de la página que la aloja

> **Antes de escribir código hay que comprobar el estado real de los endpoints.** Esta sección se redactó antes de construir la fase 1 y elige entre dos candidatos a ciegas. Los dos proyectos son de 2025, así que lo primero es ver si sus servicios en Cloud Run siguen vivos, qué latencia tienen en frío y quién paga ese cómputo — es el segundo coste recurrente del sitio, y a diferencia del asistente no lo acota un tope de gasto en una API key.
>
> Esa comprobación es la que decide el modelo, no la lista de arriba. Y con ella hay que rehacer la sección con la estructura que acabó teniendo la fase 1: contexto verificado, decisiones con su porqué, superficie de ataque y criterios comprobables. Aplica casi todo lo aprendido —rate limit, degradación, entrada no confiable— con un agravante: aquí el visitante **sube un fichero**, así que el riesgo es mayor que en el chat, no menor.

### ~~P3 — Deuda y código muerto~~ · resuelto 2026-08-16

- **Código muerto**: `searchProjects` y `getProjectsByCategory` eliminadas; 6 dependencias MDX desinstaladas junto con `pageExtensions` y `experimental.mdxRs` (el pipeline real siempre fue `gray-matter` + `markdown-it`)
- **12 claves i18n huérfanas** eliminadas en ambos idiomas
- **`status`** pasó de `z.string()` libre a enum; `"producción"` normalizado a `"production"`
- **Páginas de error**: `not-found.tsx` y `error.tsx` dentro de `[locale]`, traducidas y con el layout del sitio
- **Tope de featured**: `getFeaturedProjects` avisa por consola si hay más de 6, en vez de descartarlos en silencio
- **Convención de carpetas**: `sonambulo/` → `sonambulo-estudio-creativo/`
- La galería de `cli-task-manager` era la propia portada repetida; eliminada

**Lo que faltaba y no estaba en la lista.** El schema de Zod valida que `coverImage` sea un string, nunca que el archivo exista — por eso 16 rutas declaradas estuvieron dando 404 en producción durante meses sin que lint, typecheck ni build dijeran nada. Ahora `pnpm check:content` (en el CI y en la skill `verify`) comprueba que toda imagen exista, que viva bajo `/images/projects/<slug>/`, que no haya URLs en cadena vacía, que cada proyecto tenga sus dos idiomas y que no se pase el tope de featured. Al estrenarla encontró de inmediato los `liveUrl: ""` de dos proyectos.

### Auditoría de concisión (2026-08-16)

Tras renderizar `challenges`/`solutions`/`results`, la página de proyecto pasó a mostrar hasta **12 viñetas nuevas** además del cuerpo. Medido:

- **`summary` vs `description`**: solape léxico del 9-30%. Se complementan, no se repiten. Renderizar ambos está justificado
- **`## Impact` del cuerpo vs viñetas de `results`**: 5 proyectos tenían esa sección
  - **perfectapp**: duplicación casi literal (spreadsheets, programa de lealtad, exportación CSV aparecían en ambos) → **sección eliminada**
  - Los otros 4 se resolvieron por **posición, no por recorte**: `## Impact` era la última sección del cuerpo, así que al renderizar las viñetas el cierre quedaba _antes_ de Reto/Enfoque/Resultados y la historia volvía a empezar tras la conclusión. Ahora es un campo `impact` del frontmatter que se renderiza al final de la página, con tratamiento visual propio
- Cuerpos entre 204 y 752 palabras, media 464. Ninguno excesivo para una página de detalle

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
