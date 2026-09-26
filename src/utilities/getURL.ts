import canUseDOM from './canUseDOM'

/** Public origin shared by canonical URLs, feeds, images and sitemaps. */
export const getServerSideURL = () => {
  const configured = process.env.NEXT_PUBLIC_SERVER_URL?.trim() || process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim()
  const fallback = process.env.NODE_ENV === 'development'
    ? 'http://localhost:3100'
    : 'https://www.intelidome.com'
  const value = configured?.trim() || fallback
  const url = new URL(/^[a-z][a-z\d+.-]*:\/\//i.test(value) ? value : `https://${value}`)
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('Site URL must use HTTP or HTTPS')
  return url.origin
}

/** Resolve relative media paths without corrupting absolute storage/CDN URLs. */
export const absoluteSiteURL = (value: string) => new URL(value, `${getServerSideURL()}/`).href

export const getClientSideURL = () => canUseDOM ? window.location.origin : getServerSideURL()
