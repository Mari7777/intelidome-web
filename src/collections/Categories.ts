import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { slugField } from 'payload'
import { slugify } from '../utilities/slugify'
import { revalidateMagazinPoKategorii, revalidateMagazinPoSmazaniKategorie } from '../hooks/revalidateMagazin'

export const Categories: CollectionConfig = {
  slug: 'categories',
  labels: {
    singular: 'Kategorie',
    plural: 'Kategorie',
  },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    description: 'Kategorie jsou témata magazínu: téma článku je jeho první kategorie (DESIGN.md 8.5).',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      localized: true,
      required: true,
    },
    slugField({
      position: undefined,
      slugify: ({ valueToSlugify }) => slugify(valueToSlugify),
    }),
    {
      name: 'popis',
      type: 'textarea',
      localized: true,
      maxLength: 220,
      label: 'Popis tématu (Magazín)',
      admin: { description: 'Jedna až dvě věty pod názvem tématu na stránce Magazín.' },
    },
    {
      name: 'serie',
      type: 'checkbox',
      defaultValue: false,
      label: 'Číslovaná série: články na sebe navazují (řadit od nejstaršího, „Díl 1 z 5“)',
    },
  ],
  hooks: {
    afterChange: [revalidateMagazinPoKategorii],
    afterDelete: [revalidateMagazinPoSmazaniKategorie],
  },
}
