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
- **Class Variance Authority** - Type-safe CSS variants
- **Tailwind Merge** - Conditional CSS class merging

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- pnpm (recommended) or npm

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/portfolio-fernando-rios.git

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

## 📁 Project Structure

```
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

The portfolio showcases several key projects:

- **☕ Coffee Disease Detection** - ML system for agricultural disease detection
- **📱 PerfectApp** - Smart data center platform with VGG16 integration
- **🎨 Corazonada Tattoo** - Custom tattoo studio website with booking system

Each project includes:
- Detailed technical documentation
- Live demos and repository links
- Technology stack breakdown
- Challenges and solutions
- Visual galleries and screenshots

## 🔧 Customization

### Adding New Projects

1. Create MDX files in `content/projects/`:
```bash
# English version
content/projects/my-project.mdx

# Spanish version
content/projects/my-project.es.mdx
```

2. Include required frontmatter:
```yaml
---
title: "Project Title"
summary: "Brief description"
category: "web-development" # ml | data-science | full-stack | visualization
featured: true
date: "2024-01-01"
tags: ["React", "TypeScript"]
repoUrl: "https://github.com/username/repo"
liveUrl: "https://project-demo.com"
---
```

### Theme Customization

Modify `tailwind.config.ts` to customize:
- Color schemes
- Typography scales
- Spacing systems
- Animation timings

### Adding New Locales

1. Add translation files in `messages/`
2. Update `src/i18n/routing.ts`
3. Create locale-specific routes

## 📈 Performance

- **Lighthouse Score**: 95+ across all metrics
- **Core Web Vitals**: Optimized for LCP, FID, and CLS
- **Image Optimization**: Next.js Image component with WebP
- **Bundle Analysis**: Optimized chunks and tree shaking

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
- Portfolio: [https://www.fernandorios.dev/]
- GitHub: [@fermx3](https://github.com/fermx3)
- LinkedIn: [[https://www.linkedin.com/in/riosafernando](https://www.linkedin.com/in/riosafernando)
- Email: fer.riosalcantara@gmail.com

---

<div align="center">

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**

</div>
