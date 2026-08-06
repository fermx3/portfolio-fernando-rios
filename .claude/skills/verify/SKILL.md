---
name: verify
description: Ejecuta la verificación completa del portfolio antes de commitear o pushear — lint, typecheck, build y paridad EN/ES de contenido y traducciones. Úsala cuando el usuario diga "verifica", "¿ya quedó?", "listo para push", antes de abrir un PR, o después de tocar archivos en content/projects/ o messages/.
---

# Verify

Corre estos cuatro bloques **en orden** y **detente en el primer fallo**. Reporta el output real del error, no un resumen.

## 1. Lint

```bash
pnpm lint
```

Los warnings no bloquean. Solo los errores.

## 2. Typecheck

```bash
pnpm typecheck
```

## 3. Build

```bash
pnpm build
```

Al terminar, revisa el conteo de rutas generadas: debe haber **2 páginas por proyecto** (una `/en/...` y una `/es/...`). Si el total bajó respecto a lo esperado, hay un MDX que no está entrando — ve al paso 4.

## 4. Paridad EN/ES

Esto es lo que el lint y el typecheck **no** pueden atrapar, y es la fuente de bugs más común del repo.

```bash
# a) Todo .mdx debe tener su par .es.mdx y viceversa
cd content/projects
comm -3 \
  <(ls *.mdx | grep -v '\.es\.mdx$' | sed 's/\.mdx$//' | sort) \
  <(ls *.es.mdx | sed 's/\.es\.mdx$//' | sort)
# Sin output = paridad correcta
```

```bash
# b) Las claves de traducción deben coincidir entre idiomas
cd messages
diff <(node -e "const f=(o,p='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'&&v?f(v,p+k+'.'):[p+k]);console.log(f(require('./en.json')).sort().join('\n'))") \
     <(node -e "const f=(o,p='')=>Object.entries(o).flatMap(([k,v])=>typeof v==='object'&&v?f(v,p+k+'.'):[p+k]);console.log(f(require('./es.json')).sort().join('\n'))")
# Sin output = paridad correcta
```

```bash
# c) Los campos estructurales deben coincidir en cada par
cd content/projects
for s in $(ls *.mdx | grep -v '\.es\.mdx$' | sed 's/\.mdx$//'); do
  for f in featured date category coverImage repoUrl repoPrivate liveUrl demoUrl; do
    en=$(grep -m1 "^$f:" "$s.mdx"); es=$(grep -m1 "^$f:" "$s.es.mdx")
    [ "$en" = "$es" ] || echo "$s -> $f difiere: EN[$en] ES[$es]"
  done
done
# Sin output = paridad correcta
```

**No** compares `title`, `summary`, `description`, `objective`, `theme`, `status`, `tags`, `technologies`, `challenges`, `solutions`, `results` ni el cuerpo: esos se traducen a propósito. En particular `tags` **debe** estar en el idioma del archivo, porque `getAllTags()` es locale-aware y alimenta los filtros.

## Trampa crítica

`getAllProjects()` en `src/lib/content.ts` envuelve todo en `try/catch` y devuelve `[]` al fallar. **Un solo frontmatter inválido borra la lista completa de proyectos, sin error visible.**

Si el build pasa pero la página de proyectos sale vacía, valida el frontmatter contra el schema de `src/lib/validations.ts`:

```bash
node -e "
const fs=require('fs'),path=require('path');
for (const f of fs.readdirSync('content/projects')) {
  const raw=fs.readFileSync(path.join('content/projects',f),'utf8');
  const m=raw.match(/^---\n([\s\S]*?)\n---/);
  if(!m) { console.log('SIN FRONTMATTER:', f); continue; }
  for (const req of ['title','summary','category','tags','featured','date','repoUrl','coverImage'])
    if(!new RegExp('^'+req+':','m').test(m[1])) console.log(f,'-> falta:',req);
  const d=m[1].match(/^date:\s*\"?(.+?)\"?\s*$/m);
  if(d && !/^\d{4}-\d{2}-\d{2}$/.test(d[1])) console.log(f,'-> date invalida:',d[1]);
}
console.log('scan completo');
"
```

## Al terminar

- Si todo pasa: confírmalo en una línea, sin ceremonia.
- Si algo falla: muestra el error real y **detente**. No lo arregles sin preguntar.
