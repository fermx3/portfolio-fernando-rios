// FILE: src/app/[locale]/page.tsx
import { Hero } from '@/components/sections/hero'
import { FeaturedProjects } from '@/components/projects/featured-projects'
import { About } from '@/components/sections/about'
import { Contact } from '@/components/sections/contact'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedProjects />
      <About />
      <Contact />
    </>
  )
}
