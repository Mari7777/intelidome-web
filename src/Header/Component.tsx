import { HeaderClient } from './Component.client'
import { getCachedGlobal } from '@/utilities/getGlobals'
import React from 'react'
import type { Locale } from '@/i18n/config'

export async function Header({ liveLocales, locale }: { liveLocales: readonly Locale[]; locale: Locale }) {
  const headerData = await getCachedGlobal('header', 1, locale)()

  return <HeaderClient data={headerData} liveLocales={liveLocales} />
}
