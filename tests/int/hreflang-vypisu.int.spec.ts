// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from 'vitest'

/* Sekce 6 (krok 5): hreflang výpisu článků. Živé jazyky a Payload jsou
   zaměněné, aby test prokázal obě větve bez zápisu do DB. */
const zive = { hodnota: ['cs'] as string[] }
const find = vi.fn()

vi.mock('../../src/i18n/live', () => ({
  get LIVE_LOCALES() {
    return zive.hodnota
  },
}))
vi.mock('payload', () => ({ getPayload: async () => ({ find }) }))
vi.mock('@payload-config', () => ({ default: Promise.resolve({}) }))
vi.mock('next/cache', () => ({ unstable_cache: (fn: () => unknown) => fn }))

import { hreflangVypisu } from '../../src/i18n/vypis'

describe('hreflangVypisu (sekce 6)', () => {
  beforeEach(() => find.mockReset())

  it('jediný živý jazyk → nic, bez čtení DB (dnešní výstup)', async () => {
    zive.hodnota = ['cs']
    expect(await hreflangVypisu('/magazin')).toBeUndefined()
    expect(find).not.toHaveBeenCalled()
  })

  it('dva živé jazyky bez přeloženého článku → nic', async () => {
    zive.hodnota = ['cs', 'de']
    find.mockResolvedValue({ docs: [{ slug: 'a', prelozeno: { cs: false } }] })
    expect(await hreflangVypisu('/magazin')).toBeUndefined()
    expect(find).toHaveBeenCalledTimes(1)
    expect(find.mock.calls[0][0]).toMatchObject({ collection: 'posts', locale: 'all', fallbackLocale: false, select: { slug: true, prelozeno: true } })
  })

  it('přeložený článek → reciproční množina + x-default (jen živé jazyky s překladem)', async () => {
    zive.hodnota = ['cs', 'de']
    find.mockResolvedValue({ docs: [{ slug: 'a', prelozeno: { de: true } }, { slug: 'b', prelozeno: { en: true } }] })
    expect(await hreflangVypisu('/magazin')).toEqual({ cs: '/magazin', de: '/de/magazin', 'x-default': '/magazin' })
  })
})
