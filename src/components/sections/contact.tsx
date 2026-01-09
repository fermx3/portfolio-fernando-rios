"use client"

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Container } from '@/components/layout/container'
import { Section } from '@/components/layout/section'
import { FadeIn } from '@/components/motion/fade-in'

export function Contact() {
  const t = useTranslations('contact')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Client-side only for now
    alert('Form submission not implemented yet. Please use email directly.')
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Section id="contact">
      <Container>
        <FadeIn direction="up">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </FadeIn>

        <div className="mt-16 grid gap-8 lg:grid-cols-2">
          {/* Contact Form */}
          <FadeIn direction="left" delay={0.1}>
            <Card>
              <CardHeader>
                <CardTitle>Send a Message</CardTitle>
                <CardDescription>
                  {t('form.note')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Input
                      placeholder={t('form.name')}
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      type="email"
                      placeholder={t('form.email')}
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <textarea
                      placeholder={t('form.message')}
                      value={formData.message}
                      onChange={(e) => handleInputChange('message', e.target.value)}
                      className="min-h-30 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    <Send className="mr-2 h-4 w-4" />
                    {t('form.send')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </FadeIn>

          {/* Direct Contact */}
          <FadeIn direction="right" delay={0.2}>
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>{t('direct.title')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button asChild variant="outline" className="w-full justify-start">
                  <a href="mailto:fer.riosalcantara@gmail.com">
                    <Mail className="mr-2 h-4 w-4" />
                    {t('direct.email')}
                  </a>
                </Button>
                <div className="rounded-lg bg-muted p-4">
                  <h4 className="font-medium mb-2">Quick Response</h4>
                  <p className="text-sm text-muted-foreground">
                    I typically respond to emails within 24 hours. Let&apos;s discuss how we can work together!
                  </p>
                </div>
              </CardContent>
            </Card>
          </FadeIn>
        </div>
      </Container>
    </Section>
  )
}
