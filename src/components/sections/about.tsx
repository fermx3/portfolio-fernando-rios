import { useTranslations } from 'next-intl'
import { Github, Linkedin, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { FadeIn } from '@/components/motion/fade-in'
import { StaggerContainer, StaggerItem } from '@/components/motion/stagger-container'

interface EducationItem {
  institution: string
  program: string
  date: string
}

const techStack = {
  frontend: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Vue.js'],
  backend: ['Node.js', 'Python', 'FastAPI', 'PostgreSQL', 'MongoDB'],
  data: ['Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Jupyter'],
  tools: ['Git', 'Docker', 'AWS', 'Vercel', 'Figma', 'VS Code']
}

export function About() {
  const t = useTranslations('about')

  return (
    <Section id="about" variant="muted">
      <Container>
        <FadeIn direction="up">
          <h2 className="text-3xl font-bold tracking-tight text-center sm:text-4xl">
            {t('title')}
          </h2>
        </FadeIn>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Bio */}
          <FadeIn direction="up" delay={0.1}>
            <div className="space-y-6">
              <p className="text-lg text-muted-foreground leading-relaxed">
                {t('bio')}
              </p>

              {/* Social Links */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">{t('social.title')}</h3>
                <div className="flex gap-4">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://github.com/fermx3"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="mr-2 h-4 w-4" />
                      GitHub
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://www.linkedin.com/in/riosafernando/"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="mr-2 h-4 w-4" />
                      LinkedIn
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="mailto:fer.riosalcantara@gmail.com">
                      <Mail className="mr-2 h-4 w-4" />
                      Email
                    </a>
                  </Button>
                </div>
              </div>

              {/* Education */}
              <div>
                <h3 className="mb-4 text-lg font-semibold">{t('education.title')}</h3>
                <div className="space-y-4">
                  {t.raw('education.items').map((item: EducationItem, index: number) => (
                    <Card key={index}>
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

          {/* Tech Stack */}
          <FadeIn direction="up" delay={0.2}>
            <div>
              <h3 className="mb-6 text-lg font-semibold">{t('techStack.title')}</h3>

              <StaggerContainer className="space-y-6">
                {Object.entries(techStack).map(([category, technologies]) => (
                  <StaggerItem key={category}>
                    <Card>
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
