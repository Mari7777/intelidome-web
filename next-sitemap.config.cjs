// Keep this origin policy aligned with src/utilities/getURL.ts.
const configuredOrigin =
  process.env.NEXT_PUBLIC_SERVER_URL?.trim() ||
  process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim() ||
  (process.env.NODE_ENV === 'development' ? 'http://localhost:3100' : 'https://www.intelidome.com')

const siteURL = new URL(
  /^[a-z][a-z\d+.-]*:\/\//i.test(configuredOrigin)
    ? configuredOrigin
    : `https://${configuredOrigin}`,
)
if (!['http:', 'https:'].includes(siteURL.protocol)) {
  throw new Error('Sitemap site URL must use HTTP or HTTPS')
}
const siteUrl = siteURL.origin

// Public images under /api/media/file and Next.js assets under /_next stay crawlable.
// Named agents do not inherit the wildcard group's rules.
const disallow = ['/admin', '/next']
const userAgents = [
  '*',
  'OAI-SearchBot',
  'GPTBot',
  'Claude-SearchBot',
  'ClaudeBot',
  'Claude-Web',
  'PerplexityBot',
  'Google-Extended',
]

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  // Published URLs and modification dates come from the two CMS-backed routes.
  exclude: ['/*'],
  robotsTxtOptions: {
    policies: userAgents.map((userAgent) => ({ userAgent, allow: '/', disallow })),
    additionalSitemaps: [`${siteUrl}/pages-sitemap.xml`, `${siteUrl}/posts-sitemap.xml`],
  },
}
