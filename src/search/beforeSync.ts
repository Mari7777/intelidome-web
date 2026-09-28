import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'
import type { CollectionSlug } from 'payload'

import { jeLocale, type Locale } from '@/i18n/config'

export const beforeSyncWithSearch: BeforeSync = async ({ req, originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  const { slug, id, categories, title, meta } = originalDoc

  /* Plugin synchronizuje per jazyk. Skutečný jazyk synchronizace předává jen
     do `skipSync` (viz plugins/index.ts → `req.context.searchSyncLocale`);
     `req.locale` je při Reindexu jazyk adminu, proto je až záložní. Bez jazyka
     jde o výchozí cs. `originalDoc` má zapnutý fallback, takže by nepřeložený
     článek nesl české meta pod cizím jazykem. Pro ne-cs proto čteme ještě
     jednou bez fallbacku (A17): brána `prelozeno` + meta/title jen z daného jazyka. */
  const kandidat = req.context?.searchSyncLocale ?? req.locale
  const jazyk: Locale = jeLocale(kandidat) ? kandidat : 'cs'
  let prelozeno = true
  let metaTitle: string | null | undefined = meta?.title || title
  let metaDescription: string | null | undefined = meta?.description

  if (jazyk !== 'cs') {
    const vlastni = await req.payload.findByID({
      collection: collection as CollectionSlug,
      id,
      locale: jazyk,
      fallbackLocale: false,
      depth: 0,
      disableErrors: true,
      select: { prelozeno: true, meta: true, title: true },
      req,
    })
    const d = vlastni as { prelozeno?: boolean | null; title?: string | null; meta?: { title?: string | null; description?: string | null } } | null
    prelozeno = Boolean(d?.prelozeno)
    metaTitle = d?.meta?.title || d?.title || undefined
    metaDescription = d?.meta?.description ?? undefined
  }

  const modifiedDoc: DocToSync = {
    ...searchDoc,
    slug,
    prelozeno,
    meta: {
      ...meta,
      title: metaTitle,
      image: meta?.image?.id || meta?.image,
      description: metaDescription,
    },
    categories: [],
  }

  if (categories && Array.isArray(categories) && categories.length > 0) {
    const populatedCategories: { id: string | number; title: string }[] = []
    for (const category of categories) {
      if (!category) {
        continue
      }

      if (typeof category === 'object') {
        populatedCategories.push(category)
        continue
      }

      const doc = await req.payload.findByID({
        collection: 'categories',
        id: category,
        disableErrors: true,
        depth: 0,
        select: { title: true },
        req,
      })

      if (doc !== null) {
        populatedCategories.push(doc)
      } else {
        console.error(
          `Failed. Category not found when syncing collection '${collection}' with id: '${id}' to search.`,
        )
      }
    }

    modifiedDoc.categories = populatedCategories.map((each) => ({
      relationTo: 'categories',
      categoryID: String(each.id),
      title: each.title,
    }))
  }

  return modifiedDoc
}
