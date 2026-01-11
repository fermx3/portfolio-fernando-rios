import { Hero } from '@/components/sections/hero'
import { FeaturedProjects } from '@/components/projects/featured-projects'
import { About } from '@/components/sections/about'
import { Contact } from '@/components/sections/contact'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params

  return (
    <>
      <Hero />
      <FeaturedProjects locale={locale} />
      <About locale={locale} />
      <Contact />
    </>
  )
}
