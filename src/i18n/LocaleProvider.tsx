'use client'

import React, { createContext, useContext } from 'react'

import { DEFAULT_LOCALE, type Locale } from './config'

const LocaleContext = createContext<Locale | null>(null)

/** Zdroj jazyka pro klientské komponenty (A10); provider sedí v `[locale]/layout.tsx`. */
export const LocaleProvider: React.FC<{ locale: Locale; children: React.ReactNode }> = ({
  locale,
  children,
}) => <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>

export function useLocale(): Locale {
  const locale = useContext(LocaleContext)
  if (locale === null) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('useLocale: chybí LocaleProvider, používám „cs“')
    }
    return DEFAULT_LOCALE
  }
  return locale
}
