# 🚀 Fernando Ríos - Portfolio

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38bdf8?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![MDX](https://img.shields.io/badge/MDX-3.1-1e293b?style=flat-square&logo=mdx)](https://mdxjs.com/)

> Modern, multilingual portfolio showcasing data science, machine learning, and full-stack development projects with a focus on clean design and performance.

## ✨ Features

- **🌍 Multilingual Support** - English/Spanish with `next-intl`
- **📱 Responsive Design** - Mobile-first approach with Tailwind CSS
- **🎨 Modern UI/UX** - Clean, professional design with smooth animations
- **📝 MDX Content Management** - Type-safe project content with Zod validation
- **🎯 Project Showcase** - Filterable portfolio with detailed project pages
- **🌙 Dark/Light Theme** - Theme switching with `next-themes`
- **⚡ Performance Optimized** - Next.js 16 with App Router and SSG
- **🏗️ Type Safety** - Full TypeScript implementation
- **📊 SEO Optimized** - Dynamic metadata and sitemap generation

## 🛠️ Tech Stack

### Core Framework

- **Next.js 16** - React framework with App Router
- **React 19** - Latest React with concurrent features
- **TypeScript 5** - Type-safe development

### Styling & UI

- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library

### Content & Internationalization

- **MDX** - Markdown with JSX for rich content
- **next-intl** - Internationalization for Next.js
- **Gray Matter** - Frontmatter parsing
- **Zod** - Runtime type validation

### Development & Quality

- **ESLint** - Code linting
- **Prettier** - Code formatting, enforced in CI
- **Husky + lint-staged** - Pre-commit formatting and autofix
- **GitHub Actions** - Format, lint, typecheck and build on every push and PR
- **Class Variance Authority** - Type-safe CSS variants
- **Tailwind Merge** - Conditional CSS class merging

## 🚀 Quick Start

### Prerequisites

- Node.js 20.9+ (pinned in `.nvmrc`; required by Next.js 16)
- pnpm 10+ (the only supported package manager — see `packageManager` in `package.json`)

### Installation

```bash
# Clone the repository
git clone https://github.com/fermx3/portfolio-fernando-rios.git

# Navigate to project directory
cd portfolio-fernando-rios

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the portfolio.

### Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

### Available Scripts

| Script              | What it does                                   |
| ------------------- | ---------------------------------------------- |
| `pnpm dev`          | Development server on port 3000                |
| `pnpm build`        | Production build (SSG)                         |
| `pnpm start`        | Serve the production build                     |
| `pnpm lint`         | ESLint                                         |
| `pnpm typecheck`    | `tsc --noEmit`                                 |
| `pnpm format`       | Format with Prettier                           |
| `pnpm format:check` | Verify formatting without writing (used by CI) |

## 🤖 AI-Assisted Development

This repo is set up for [Claude Code](https://claude.com/claude-code). See **[CLAUDE.md](CLAUDE.md)** for the stack, the non-negotiable rules, the MDX content model and the pre-push checklist.

Reusable skills live in `.claude/skills/`:

- **`verify`** - lint, typecheck, build and EN/ES parity checks
- **`add-project`** - scaffolds the EN/ES MDX pair for a new project

## 📁 Project Structure

```
├── .claude/                   # Claude Code config
│   ├── settings.json         # Versioned permissions
│   └── skills/               # verify, add-project
├── .github/workflows/        # CI pipeline
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── [locale]/          # Internationalized routes
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Home page
│   │   │   └── projects/      # Project pages
│   │   └── globals.css        # Global styles
│   ├── components/            # React components
│   │   ├── layout/           # Layout components
│   │   ├── sections/         # Page sections
│   │   ├── projects/         # Project-related components
│   │   ├── motion/           # Animation components
│   │   └── ui/               # Reusable UI components
│   ├── lib/                  # Utility functions
│   ├── types/                # TypeScript type definitions
│   └── i18n/                 # Internationalization config
├── content/                  # MDX content files
│   └── projects/             # Project documentation
├── messages/                 # Translation files
│   ├── en.json              # English translations
│   └── es.json              # Spanish translations
└── public/                  # Static assets
    └── images/              # Image assets
```

## 🎨 Key Components

### Project Management

- **Type-safe MDX**: Project content with frontmatter validation
- **Dynamic routing**: Automatic page generation from content
- **Category filtering**: Smart project organization
- **Featured projects**: Highlighted work on homepage

### Responsive Design

- **Mobile-first**: Optimized for all screen sizes
- **Progressive enhancement**: Smooth experience across devices
- **Performance focused**: Optimized images and lazy loading

### Internationalization

- **Route-based locales**: `/en` and `/es` routes
- **Dynamic content**: Localized project descriptions
- **SEO optimized**: Proper hreflang and meta tags

## 🌟 Featured Projects

The homepage highlights the six most recent featured projects:

- **📈 Nebluna Analytics** - Demand forecasting for coffee shops with Prophet + FastAPI on GCP Cloud Run
- **🚌 Compañeros en Ruta** - Cross-platform web and mobile app
- **💼 Portfolio Website** - This site
- **☕ Coffee Disease Detection** - ML system for agricultural disease detection
- **🎭 Sonámbulo Estudio Creativo** - Creative studio website
- **📱 PerfectApp** - Smart data center platform with VGG16 integration

Ten projects are published in total; the rest are on the projects page.

Each project includes:

- Detailed technical documentation
- Live demos and repository links
- Technology stack breakdown
- Challenges and solutions
- Visual galleries and screenshots

## 🔧 Customization

### Adding New Projects

Both language versions are required — a missing `.es.mdx` silently falls back to English.

1. Create the MDX pair in `content/projects/`:

```bash
content/projects/my-project.mdx      # English
content/projects/my-project.es.mdx   # Spanish
```

2. Include the required frontmatter (validated by Zod in `src/lib/validations.ts`):

```yaml
---
title: "Project Title"
summary: "Brief description"
# ml | data-science | full-stack | visualization | web-development | backend-development
category: "web-development"
featured: true
date: "2024-01-01" # YYYY-MM-DD, rendered in UTC
tags: ["React", "TypeScript"] # translated per locale
repoUrl: "https://github.com/username/repo" # required
repoPrivate: true # optional: renders a disabled "Private Repo" button
liveUrl: "https://project-demo.com" # optional
coverImage: "/images/projects/my-project/cover.png"
---
```

`slug` is derived from the filename — don't put it in the frontmatter.

> Invalid frontmatter makes `getAllProjects()` return an empty list **for the whole site**, with no visible error. If the projects page goes blank after adding a project, check the frontmatter first.

Or let Claude Code do it: the `add-project` skill handles the pair, the frontmatter and the verification.

### Theme Customization

Design tokens live in `src/app/globals.css` under `@theme inline` (Tailwind 4 is CSS-first — there is no `tailwind.config.ts`). Edit that block to change colors, radii and fonts; light and dark values are defined in the `:root` and `.dark` blocks below it.

### Adding New Locales

1. Add translation files in `messages/`
2. Update `src/i18n/routing.ts`
3. Create locale-specific routes

## 📈 Performance

- **Static generation**: every project page is prerendered at build time (SSG)
- **Image optimization**: `next/image` serving WebP and AVIF (configured in `next.config.ts`)
- **Core Web Vitals**: built against LCP, INP and CLS
- **Linting**: `eslint-config-next/core-web-vitals` runs in CI

## 🤝 Contributing

While this is a personal portfolio, suggestions and improvements are welcome:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 📞 Contact

**Fernando Ríos**

- Portfolio: [fernandorios.dev](https://www.fernandorios.dev/)
- GitHub: [@fermx3](https://github.com/fermx3)
- LinkedIn: [https://www.linkedin.com/in/riosafernando](https://www.linkedin.com/in/riosafernando)
- Email: fer.riosalcantara@gmail.com

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

</div>
