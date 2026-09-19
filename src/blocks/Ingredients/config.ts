import type { Block } from 'payload'

/**
 * Karta složek — čtveřice materiálů pohromadě (fotka + jméno + role +
 * kam v profilu patří). Vizuální rozcestník před podrobnými sekcemi;
 * texty karet jsou redakční zkratky, podrobnosti nese próza pod blokem.
 */
export const Ingredients: Block = {
  slug: 'ingredients',
  interfaceName: 'IngredientsBlock',
  labels: { singular: 'Karta složek', plural: 'Karty složek' },
  fields: [
    { name: 'heading', type: 'text', label: 'Titulek (h3)' },
    {
      name: 'lead',
      type: 'textarea',
      label: 'Uvozující věta (nepovinná)',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 2,
      maxRows: 6,
      label: 'Složky',
      labels: { singular: 'Složka', plural: 'Složky' },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Fotografie materiálu',
          admin: { description: 'Čtvercový detail materiálu (9.1). Alt se bere z knihovny médií.' },
        },
        { name: 'name', type: 'text', required: true, label: 'Název' },
        { name: 'text', type: 'textarea', required: true, label: 'Role ve směsi (1–2 věty)' },
        {
          name: 'note',
          type: 'text',
          label: 'Kam patří',
          admin: { placeholder: '0–10 cm · 2–5 % objemu' },
        },
        { name: 'title', type: 'text', label: 'Titulek panelu (celý název sekce)' },
        {
          name: 'detail',
          type: 'richText',
          label: 'Podrobný text (panel pod kartami)',
          admin: { description: 'Plná sekce složky — zobrazí se po výběru karty.' },
        },
        {
          name: 'drawing',
          type: 'text',
          label: 'Kresba v panelu (klíč z registru, volitelné)',
          admin: { placeholder: 'mykorhizni-vlakna' },
        },
        { name: 'drawingAlt', type: 'text', label: 'Popis kresby pro odečítač' },
      ],
    },
  ],
}
