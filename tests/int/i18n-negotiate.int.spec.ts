// @vitest-environment node
import { describe, expect, it } from 'vitest'

import { vyjednejJazyk } from '../../src/i18n/negotiate'

describe('vyjednejJazyk', () => {
  it('bere první živý jazyk z Accept-Language, `de-AT` → `de`', () => {
    expect(vyjednejJazyk({ acceptLanguage: 'de-AT,de;q=0.9,en;q=0.8', live: ['cs', 'de'] })).toBe('de')
  })

  it('řadí podle q-hodnot, ne podle pořadí zápisu', () => {
    expect(vyjednejJazyk({ acceptLanguage: 'de;q=0.5,en;q=0.9', live: ['cs', 'de', 'en'] })).toBe('en')
    expect(vyjednejJazyk({ acceptLanguage: 'fr,de;q=0.3,en;q=0.2', live: ['cs', 'de', 'en'] })).toBe('de')
  })

  it('země je jen záloha, když jazyk prohlížeče není živý', () => {
    expect(vyjednejJazyk({ acceptLanguage: 'fr', country: 'DE', live: ['cs', 'de'] })).toBe('de')
    expect(vyjednejJazyk({ acceptLanguage: 'fr', country: 'FR', live: ['cs', 'de'] })).toBe('cs')
    expect(vyjednejJazyk({ acceptLanguage: 'fr', country: 'at', live: ['cs', 'de'] })).toBe('de')
  })

  it('bez Accept-Language nepřesměrovává', () => {
    expect(vyjednejJazyk({ acceptLanguage: null, country: 'DE', live: ['cs', 'de'] })).toBeNull()
    expect(vyjednejJazyk({ acceptLanguage: '', country: 'DE', live: ['cs', 'de'] })).toBeNull()
  })

  it('nikdy nevrátí jazyk mimo live', () => {
    expect(vyjednejJazyk({ acceptLanguage: 'de-AT,de;q=0.9', country: 'DE', live: ['cs'] })).toBe('cs')
    expect(vyjednejJazyk({ acceptLanguage: 'en', country: 'HU', live: ['cs', 'de'] })).toBe('cs')
  })
})
