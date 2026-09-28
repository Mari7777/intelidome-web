'use client'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import { useLocale } from '@/i18n/LocaleProvider'
import { lokalizujCestu } from '@/i18n/routing'

// Klientská, protože `not-found` nedostává params — jazyk bere z provideru layoutu.
export default function NotFound() {
  const locale = useLocale()
  return (
    <div className="container py-28">
      <div className="prose max-w-none">
        <h1 style={{ marginBottom: 0 }}>404</h1>
        <p className="mb-4">Tahle stránka neexistuje.</p>
      </div>
      <Button asChild variant="default">
        <Link href={lokalizujCestu('/', locale)}>Zpět na úvod</Link>
      </Button>
    </div>
  )
}
