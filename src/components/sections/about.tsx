import { getTranslations } from 'next-intl/server'
import { Github, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { FadeIn } from '@/components/motion/fade-in'
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger-container'
import ProfilePicture from '@/components/ui/profile-picture'

interface EducationItem {
  institution: string
  program: string
  date: string
}

interface AboutProps {
  locale: string
}

const techStack = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS'],
  backend: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'MongoDB'],
  data: ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'Jupyter'],
  tools: ['Git', 'Docker', 'AWS', 'Vercel', 'VS Code', 'Google Colab', 'GCP']
}

export async function About({ locale }: AboutProps) {
  const t = await getTranslations({ locale, namespace: 'about' })

  return (
    <Section id="about" variant="muted">
      <Container>
        <FadeIn direction="up">
          <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
            {t('title')}
          </h2>
        </FadeIn>

        <div className="mt-16 grid gap-8 lg:grid-cols-2 lg:gap-16">
          {/* Profile Card - Solo */}
          <FadeIn direction="left" delay={0.1}>
            <div>
              <Card className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-lime-500/10 via-transparent to-blue-500/10"></div>
                <CardContent className="pt-8 pb-6 text-center relative">
                  <div className="mb-6 flex justify-center">
                    <div className="relative">
                      <ProfilePicture className="ring-lime-400/30 shadow-xl" />
                      <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-lime-400 rounded-full ring-4 ring-background"></div>
                    </div>
                  </div>
                  <h3 className="font-bold text-xl mb-2">Fernando Rios</h3>
                  <p className="text-muted-foreground text-sm">{t('role')}</p>

                  {/* Social Links - Compact horizontal */}
                  <div className="mt-6">
                    <div className="flex justify-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href="https://github.com/fermx3"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Github className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href="https://www.linkedin.com/in/riosafernando/"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <a href="mailto:fer.riosalcantara@gmail.com">
                          <Mail className="h-4 w-4" />
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </FadeIn>

          {/* Bio & Education - Together */}
          <FadeIn direction="up" delay={0.2}>
            <div className="space-y-6">
              <div>
                <h3 className="mb-4 text-lg font-semibold">{t('aboutMe')}</h3>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  {t('bio')}
                </p>
              </div>

              {/* Education */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">{t('education.title')}</h3>
                <div className="space-y-4">
                  {t.raw('education.items').map((item: EducationItem, index: number) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="pt-6">
                        <div className="space-y-2">
                          <h4 className="font-semibold text-foreground">{item.institution}</h4>
                          <p className="text-muted-foreground">{item.program}</p>
                          <p className="text-sm text-muted-foreground">{item.date}</p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Tech Stack - Full width section below */}
        <div className="mt-16">
          <FadeIn direction="up" delay={0.3}>
            <div>
              <h3 className="mb-8 text-lg font-semibold">{t('techStack.title')}</h3>

              <StaggerContainer className="space-y-6">
                {Object.entries(techStack).map(([category, technologies]) => (
                  <StaggerItem key={category}>
                    <Card className="hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base">
                          {t(`techStack.${category}`)}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex flex-wrap gap-2">
                          {technologies.map((tech) => (
                            <Badge key={tech} variant="secondary">
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            </div>
          </FadeIn>
        </div>
      </Container>
    </Section>
  )
}
