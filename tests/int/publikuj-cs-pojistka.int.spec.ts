import { describe, expect, it, vi } from 'vitest'

import { publikujCs } from '../../scripts/lib/publikuj-cs'

/** Seedery ani revize nesmí vrátit do obsahu starou adresu článků (ADR-009 bod 7). */
const payload = () => ({
  update: vi.fn(async () => ({})),
  findByID: vi.fn(async () => ({ prelozeno: {} })),
  logger: { warn: vi.fn() },
})

const zapis = (p: ReturnType<typeof payload>, body: string) =>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  publikujCs(p as any, { collection: 'posts', id: 1, data: { content: { root: { children: [{ fields: { body } }] } } } as any })

describe('pojistka publikujCs proti /posts', () => {
  it.each(['[odkaz](/posts/x)', '[výpis](/posts)', '[kotva](/posts#a)'])('%s odmítne a nic nezapíše', async (body) => {
    const p = payload()
    await expect(zapis(p, body)).rejects.toThrow(/ADR-009/)
    expect(p.update).not.toHaveBeenCalled()
  })

  it.each(['[odkaz](/magazin/x)', 'Jak se ukládají posts v databázi', '[sitemapa](/posts-sitemap.xml)'])('%s propustí', async (body) => {
    const p = payload()
    await zapis(p, body)
    expect(p.update).toHaveBeenCalledTimes(1)
  })
})
