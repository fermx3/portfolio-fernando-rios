---
name: edit-project
description: "Edita una entrada existente del portfolio (par MDX EN/ES): actualizar contenido tras cambios en el repo del proyecto, condensar textos, corregir afirmaciones desactualizadas, cambiar featured/status o agregar imágenes. Úsala cuando el proyecto ya existe en content/projects/. Para proyectos nuevos usa add-project."
---

# Edit Project

Una entrada son **dos archivos**: `content/projects/<slug>.mdx` y `<slug>.es.mdx`. Todo lo que cambies en uno se cambia en el otro.

## Antes de editar

1. Lee [`docs/content-guidelines.md`](../../../docs/content-guidelines.md). Ahí están los topes por campo, la estructura del cuerpo y las reglas de confidencialidad.
2. Identifica el slug y lee **ambos** archivos del par. Si solo existe uno, detente y avisa.
3. Si el cambio viene del repo del proyecto, lee el repo (`repoUrl`) y compáralo con lo que dice la entrada. Lista las afirmaciones que el código ya no respalda y las funcionalidades nuevas que faltan.
4. Pregunta al usuario solo lo que no puedas deducir.

## Tipos de edición

- **Actualizar contenido:** aplica los cambios del repo respetando los topes y la regla "un dato, un lugar".
- **Condensar:** reescribe contra la tabla de topes. Reporta palabras antes → después y qué eliminaste por no poder verificarlo.
- **Corregir:** arregla solo lo pedido; no reescribas el resto sin permiso.
- **Metadatos:**
  - `featured`: la home solo muestra los **6 más recientes** y `pnpm check:content` falla si hay más de 6. Avisa si el cambio desplaza a otro proyecto.
  - `status`: enum `completed` | `production` | `archived`. No se traduce.
  - `metric`: si la cifra cambió en el repo, actualiza `value` en los dos archivos a la vez. Si ya no se puede verificar, borra `metric` entero; no lo reformules.
- **Imágenes:** el archivo va en `public/images/projects/<slug>/`, la ruta en ambos archivos, y `type: "mobile"` en las capturas de móvil.

## Lo que no se toca sin pedirlo explícitamente

- **slug / nombre de archivo:** cambia la URL pública y rompe enlaces y sitemap. Si el usuario lo pide, adviértelo antes.
- **`date`:** controla el orden y qué proyectos son featured.
- **`category`, `repoUrl`, `liveUrl`, `demoUrl`, `coverImage`.**

## Paridad

Todo cambio en un idioma se replica en el otro en el mismo commit. Nunca dejes un par desalineado: los campos estructurales son idénticos, y `tags` / `technologies` se emparejan por posición.

## Verificación — obligatoria

```bash
pnpm check:content && pnpm build
```

Confirma que `/en/projects/<slug>` y `/es/projects/<slug>` siguen generándose y que `/projects` no sale vacío.

> ⚠️ `getAllProjects()` envuelve todo en `try/catch` y devuelve `[]` al fallar: **un frontmatter inválido vacía el listado completo sin error visible.** Si `/projects` sale vacío, el culpable es el archivo que acabas de editar.

Después corre la skill `verify`.

## Reporte final

Por archivo: palabras antes → después (`wc -w`; el actual de `git show HEAD:<archivo>`), campos modificados y afirmaciones eliminadas o corregidas.
