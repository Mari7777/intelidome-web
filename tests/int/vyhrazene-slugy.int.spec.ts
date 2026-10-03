import { describe, expect, it } from 'vitest'
import type { RowField, TextField } from 'payload'

import { slugBezKoduJazyka } from '../../src/fields/slugBezKoduJazyka'

/** Slug stránky ani článku nesmí být kód jazyka ani cesta, kterou web obsluhuje jinak (ADR-008, ADR-009 bod 8). */
const validace = () => {
  const pole: RowField = { type: 'row', fields: [{ type: 'text', name: 'slug' } as TextField] }
  const slug = slugBezKoduJazyka(pole).fields[0] as TextField
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (value: string) => (slug.validate as any)(value, { required: false, req: { t: (k: string) => k, payload: { config: {} } } })
}

describe('vyhrazené slugy', () => {
  it.each(['magazin', 'posts', 'search', 'Magazin', 'POSTS', 'api', 'admin', 'en', 'de'])('%s je zakázaný', (hodnota) => {
    expect(validace()(hodnota)).toEqual(expect.any(String))
    expect(validace()(hodnota)).not.toBe(true)
  })

  it.each(['jak-zasit-travnik', 'magazin-o-zavlaze', 'o-nas'])('%s projde', (hodnota) => {
    expect(validace()(hodnota)).toBe(true)
  })
})
