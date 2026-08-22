import type { Block } from 'payload'

/**
 * Produktový pás článku (DESIGN.md 8.2 řádek N+1) — jediný vnitřní obsidian
 * na stránce (8.1 p. 8). Tady článek poprvé mluví o systému, ne o zahradě.
 */
export const ProductBand: Block = {
  slug: 'productBand',
  interfaceName: 'ProductBandBlock',
  labels: { singular: 'Produktový pás (tmavý)', plural: 'Produktové pásy' },
  fields: [
    { name: 'eyebrow', type: 'text', label: 'Nadřádek' },
    { name: 'title', type: 'text', required: true, label: 'Titulek' },
    {
      name: 'body',
      type: 'textarea',
      required: true,
      label: 'Text',
      admin: { description: 'Odstavce oddělte prázdným řádkem. **Tučně** takto.' },
    },
    {
      name: 'features',
      type: 'array',
      label: 'Vlastnosti',
      minRows: 3,
      maxRows: 3,
      fields: [
        { name: 'title', type: 'text', required: true, label: 'Název' },
        { name: 'text', type: 'text', required: true, label: 'Popis' },
      ],
    },
  ],
}
