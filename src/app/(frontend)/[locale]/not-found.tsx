'use client'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n/LocaleProvider'
import { lokalizujCestu } from '@/i18n/routing'
import { t } from '@/i18n/ui'

// Klientská, protože `not-found` nedostává params — jazyk bere z provideru layoutu.
export default function NotFound() {
  const locale = useLocale()
  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">{t(locale, 'notFound.text')}</p>
      </div>
      <Button asChild variant="default">
        <Link href={lokalizujCestu('/', locale)}>{t(locale, 'notFound.back')}</Link>
      </Button>
    </div>
  )
}
