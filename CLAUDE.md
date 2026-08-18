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
**Opcionales:** `description`, `objective`, `theme`, `impact`, `technologies[]`, `status`, `repoPrivate`, `liveUrl`, `demoUrl`, `images[]`, `challenges[]`, `solutions[]`, `results[]`

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
- Imágenes en `public/images/projects/<slug>/`. `pnpm check:content` verifica que existan.
- `impact` es el cierre de la página: qué cambió el proyecto y para quién. Va en el frontmatter, **no** como un `## Impact` al final del cuerpo — ahí quedaría antes de las secciones de Reto/Enfoque/Resultados y rompería el arco narrativo.
- `status` es un enum: `completed` | `production` | `archived`.

**Tags — reglas.** Los tags alimentan el filtro del listado, así que el vocabulario tiene que ser estable:

- **Nombre sin versión.** `Next.js`, no `Next.js 16`. Un sufijo de versión crea un segundo chip para la misma tecnología y parte los resultados: la versión va en la prosa, no en el tag.
- **No repitas la categoría.** `category: "ml"` ya pinta su propio filtro; añadir el tag `Machine Learning` duplica el chip.
- **Señal, no exhaustividad.** Entra lo que alguien buscaría: dominio (`Computer Vision`, `Time Series`, `SaaS`) y tecnología real (`TensorFlow`, `PostgreSQL`, `Expo`). No entra el detalle de implementación que ya está en `technologies` (`Argparse`, `JSON`, `Regex`), ni etiquetas vagas (`Web Design`, `Performance`, `Responsive Design`), ni el nombre del proyecto en otras palabras (`Task Management` en un gestor de tareas).
- **No podes por frecuencia.** Con 10 proyectos un tag aparece una vez porque el portfolio es pequeño, no porque sobre. Cortar por frecuencia dejaría al proyecto de visión por computadora sin un solo tag de ML.
- **Los arrays EN/ES se emparejan por posición**: mismo número de tags y en el mismo orden en los dos archivos.

`pnpm check:content` comprueba las tres primeras automáticamente.

> ⚠️ **Trampa conocida:** `getAllProjects()` en `src/lib/content.ts` envuelve todo en `try/catch` y devuelve `[]` al fallar. Si el frontmatter de **un solo** proyecto no pasa el schema de Zod, **desaparece la lista completa de proyectos** sin ningún error visible. Ante una página de proyectos vacía, sospecha primero de frontmatter inválido en el MDX que acabas de tocar.

## El asistente (`/api/ask`)

La tarjeta de contacto es un chat sobre los proyectos. **Es la única ruta dinámica del sitio**; todo lo demás sigue siendo SSG y debe seguir siéndolo.

- **Sin base vectorial.** El corpus va entero en el system prompt (`src/lib/assistant/corpus.ts`): 23k tokens en ES y 18k en EN, medidos con `usage`. Si crece mucho, lo primero que hay que revisar es esa decisión, no añadir retrieval por reflejo.
- **El corpus va cacheado** con `cache_control`. Es un prefix match: meter cualquier cosa volátil (fecha, id de sesión) antes del breakpoint anula la caché y multiplica el coste por ocho. No metas nada variable en el system prompt. El handler registra los tokens en cada petición; un `cache_read=0` repetido es la señal de que se rompió.
- **El cuerpo de la petición es entrada no confiable**, historial incluido: se pueden fabricar turnos del asistente. Ninguna decisión del servidor puede depender de lo que diga la conversación — roles en whitelist, y el system prompt y las tools siempre del servidor.
- **La salida del modelo se renderiza como texto.** Nunca con `dangerouslySetInnerHTML`, que sí se usa para el contenido de los proyectos porque ese es tuyo.
- **El cliente de Anthropic se instancia dentro del handler.** A nivel de módulo revienta el build del CI, que corre sin secretos.

Variables de entorno (todas opcionales; el asistente degrada un escalón por cada una que falte):

| Variable                            | Si falta                                              |
| ----------------------------------- | ----------------------------------------------------- |
| `ANTHROPIC_API_KEY`                 | El asistente queda offline y se ofrece el correo      |
| `RESEND_API_KEY`                    | Responde preguntas pero no recoge contactos           |
| `LEAD_TO_EMAIL` / `LEAD_FROM_EMAIL` | Usan `AUTHOR.email` y el dominio de pruebas de Resend |
| `UPSTASH_REDIS_REST_URL` + `_TOKEN` | El rate limit cae a un contador por instancia         |

> ⚠️ **Con el dominio de pruebas de Resend, `LEAD_TO_EMAIL` tiene que ser la dirección de la cuenta de Resend**, no cualquier otra: `onboarding@resend.dev` solo entrega ahí. Si no coinciden, Resend responde **403 `validation_error`** y el asistente cae al correo en vez de registrar el lead. Se arregla poniendo esa dirección, o verificando `fernandorios.dev` y cambiando `LEAD_FROM_EMAIL`.

### Qué cuesta esto

Medido sobre el corpus en español (23 016 tokens) con Opus 5 a $5/$25 por MTok:

|                           | Precio     | Coste      |
| ------------------------- | ---------- | ---------- |
| Escribir la caché (1.25×) | $6.25/MTok | **$0.144** |
| Leerla (0.1×)             | $0.50/MTok | $0.012     |
| Salida, ~250 tokens       | $25/MTok   | $0.006     |

**La pregunta que escribe la caché cuesta ocho veces más que la que la lee**, y ese es el número que gobierna el gasto: la caché dura 5 minutos, así que con visitas espaciadas —lo normal en un portfolio— casi toda primera pregunta de cada visitante es en frío. Citar solo el caso caliente subestima el coste por ocho.

Lo que hay que presupuestar es la **conversación**, no la pregunta: ~$0.15 la de un solo turno, ~$0.19 la de tres. Del orden de 50–65 conversaciones por cada 10 USD.

No cambies el TTL a 1 hora buscando ahorro: escribir cuesta el doble y solo compensa si llegan dos o más visitantes por hora.

El freno duro del gasto es el **tope mensual en la API key**, no el rate limit. El criterio para fijarlo no es el consumo esperado sino cuánto estás dispuesto a perder si alguien abusa del endpoint.

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
