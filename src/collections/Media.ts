import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: 'Médium',
    plural: 'Média',
  },
  folders: true,
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'portrait',
      type: 'upload',
      relationTo: 'media',
      label: 'Portrétový ořez',
      admin: {
        description:
          'Volitelně: samostatný ořez pro telefon na výšku. Bez něj se z 21:9 masteru ořízne přes 75 % plochy a telefon stahuje zbytečně velkou variantu (9.1).',
      },
    },
    {
      name: 'alt',
      type: 'text',
      localized: true,
      //required: true,
    },
    {
      /* Fokální bod (nahoře v UI) řídí ořez na šířku; na výšku se z 21:9
         fotky zobrazí jen ~20 % šířky, takže hero potřebuje druhý bod.
         Prázdné = použije se hlavní. */
      type: 'row',
      fields: [
        {
          name: 'focalPortraitX',
          type: 'number',
          label: 'Fokální bod na výšku — X (%)',
          min: 0,
          max: 100,
          admin: { width: '50%', description: 'Jen pro hero na telefonu (orientace na výšku).' },
        },
        {
          name: 'focalPortraitY',
          type: 'number',
          label: 'Fokální bod na výšku — Y (%)',
          min: 0,
          max: 100,
          admin: { width: '50%' },
        },
      ],
    },
    {
      name: 'caption',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
        // Náhledové crawlery (Facebook, LinkedIn, X) neumí AVIF, a protože
        // zdrojové fotky AVIF jsou, dědila by ho i tato varianta — karta
        // odkazu by zůstala bez obrázku (porota kola 06, výkon).
        formatOptions: { format: 'webp', options: { quality: 82 } },
      },
    ],
  },
}
