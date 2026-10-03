import moved from './magazineMovedAnchors.json'

/** Fragment se neposílá serveru. Staré záložky přesuneme až v prohlížeči. */
export function movedArticleAnchor(pathname: string, hash: string): string | null {
  if (!hash) return null
  const csPath = pathname.replace(/^\/cs(?=\/)/, '').replace(/^\/posts(?=\/)/, '/magazin')
  let fragment: string
  try { fragment = decodeURIComponent(hash) } catch { return null }
  return (moved as Record<string, string>)[csPath + fragment] ?? null
}
