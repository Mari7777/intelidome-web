import type { RowField, TextField, TextFieldSingleValidation } from 'payload'
import { text } from 'payload/shared'

import { jeLocale } from '@/i18n/config'

/**
 * Slug nesmí být kódem jazyka: `/en` je adresa jazykové verze, ne stránky (A2).
 * Ani vyhrazenou cestou (`/api`, `/admin`, `/next`…), kterou proxy obchází —
 * taková stránka by nikdy nebyla dostupná. Přidává se k `slugField` přes
 * `overrides`, slugify zůstává beze změny. `magazin` zastíní statická routa
 * domovské stránky článků, `posts` pohltí trvalé přesměrování starých adres
 * a `search` zastíní stránka hledání (ADR-009 bod 8).
 */
const VYHRAZENE = ['api', 'admin', 'next', '_next', '_vercel', 'magazin', 'posts', 'search']

export const slugBezKoduJazyka = (field: RowField): RowField => {
  const slug = field.fields.find((f): f is TextField => f.type === 'text' && f.name === 'slug')
  if (slug) {
    const validace: TextFieldSingleValidation = (value, options) => {
      if (jeLocale(value)) return 'Kód jazyka je rezervovaný, zvolte jiný slug.'
      if (typeof value === 'string' && VYHRAZENE.includes(value.toLowerCase())) {
        return 'Tato cesta je vyhrazená pro systém, zvolte jiný slug.'
      }
      return text(value, options)
    }
    slug.validate = validace
  }
  return field
}
