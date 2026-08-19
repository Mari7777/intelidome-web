import type { RequiredDataFromCollectionSlug } from 'payload'

// Fallback rendered when no 'home' page exists in the CMS yet,
// so a fresh deployment shows a placeholder instead of a 404.
export const homeStatic: RequiredDataFromCollectionSlug<'pages'> = {
  slug: 'home',
  _status: 'published',
  hero: {
    type: 'lowImpact',
    richText: {
      root: {
        type: 'root',
        children: [
          {
            type: 'heading',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'InteliDome',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            tag: 'h1',
            version: 1,
          },
          {
            type: 'paragraph',
            children: [
              {
                type: 'text',
                detail: 0,
                format: 0,
                mode: 'normal',
                style: '',
                text: 'Chytrá závlaha a automatizace zahrady. Web se připravuje.',
                version: 1,
              },
            ],
            direction: 'ltr',
            format: '',
            indent: 0,
            textFormat: 0,
            version: 1,
          },
        ],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    },
  },
  meta: {
    description: 'Chytrá závlaha a automatizace zahrady — návody, plánování a praxe.',
    title: 'InteliDome — chytrá závlaha a automatizace zahrady',
  },
  title: 'Úvod',
  layout: [],
}
