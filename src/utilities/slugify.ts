/**
 * Slug formatter that transliterates Czech diacritics instead of dropping them.
 *
 * Payload's built-in slugify strips anything outside [A-Za-z0-9_], so
 * "Jak naplánovat závlahu" becomes "jak-naplnovat-zvlahu". Decomposing to NFD
 * first turns "á" into "a" + a combining mark, so only the mark is removed.
 */
export const slugify = (value?: string | null): string =>
  (value ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // combining diacritical marks
    .trim()
    .toLowerCase()
    .replace(/[^\w-]+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
