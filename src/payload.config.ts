import { postgresAdapter } from '@payloadcms/db-postgres'
import { cs } from '@payloadcms/translations/languages/cs'
import { en } from '@payloadcms/translations/languages/en'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  // Lokální vývoj nemá poštovní server — e-maily (obnova hesla) se místo
  // odeslání vypíšou do logu i s odkazem. V produkci sem přijde skutečný
  // adaptér (Resend/SMTP).
  email: () => ({
    name: 'dev-console',
    defaultFromName: 'InteliDome (dev)',
    defaultFromAddress: 'dev@intelidome.cz',
    sendEmail: async (message) => {
      const html = typeof message.html === 'string' ? message.html : ''
      const link = html.match(/https?:\/\/[^"'\s<>]*reset[^"'\s<>]*/)?.[0]
      console.log(
        `\n=== E-MAIL (dev) → ${String(message.to)}\n${String(message.subject)}` +
          (link ? `\nODKAZ: ${link}` : `\n${html}`) +
          `\n===\n`,
      )
      return { messageId: 'dev-console' }
    },
  }),
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // Content localization: schema is trilingual from day one (F1 publishes Czech only).
  // Frontend queries without an explicit locale resolve to the default 'cs'.
  localization: {
    locales: ['cs', 'en', 'de'],
    defaultLocale: 'cs',
    fallback: true,
  },
  // Admin UI language (owner works in Czech).
  i18n: {
    supportedLanguages: { cs, en },
    fallbackLanguage: 'cs',
  },
  // This config helps us configure global or default features that the other editors can inherit
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  collections: [Pages, Posts, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [Header, Footer],
  plugins,
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        // Allow logged in users to execute this endpoint (default)
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        // If there is no logged in user, then check
        // for the Vercel Cron secret to be present as an
        // Authorization header:
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
