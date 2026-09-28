import { Post } from '@/payload-types'
import { DEFAULT_LOCALE, type Locale } from '@/i18n/config'

/**
 * Výčet jmen ve větě podle jazyka (A12). Čeština zůstává u původního ručního
 * skládání („A a B“, „A, B a C“): ICU vzor pro cs sází za spojku pevnou
 * mezeru („a\u00a0B“), což by dnešní výstup změnilo (byte-identita, zlatý
 * snímek). Ostatní jazyky: `Intl.ListFormat` typu conjunction.
 */
export const formatSeznam = (items: readonly string[], locale: Locale = DEFAULT_LOCALE): string => {
  if (locale !== DEFAULT_LOCALE) return new Intl.ListFormat(locale, { type: 'conjunction' }).format(items)
  if (items.length === 0) return ''
  if (items.length === 1) return items[0]
  return `${items.slice(0, -1).join(', ')} a ${items[items.length - 1]}`
}

/**
 * Formats an array of populatedAuthors from Posts into a prettified string.
 * @param authors - The populatedAuthors array from a Post.
 * @param locale - jazyk stránky (spojka a čárky podle jazyka)
 * @returns A prettified string of authors.
 * @example
 *
 * [Author1, Author2] becomes 'Author1 a Author2'
 * [Author1, Author2, Author3] becomes 'Author1, Author2 a Author3'
 *
 */
export const formatAuthors = (
  authors: NonNullable<NonNullable<Post['populatedAuthors']>[number]>[],
  locale: Locale = DEFAULT_LOCALE,
) => {
  // Ensure we don't have any authors without a name
  const authorNames = authors.map((author) => author.name).filter((name): name is string => Boolean(name))

  if (authorNames.length === 0) return ''
  return formatSeznam(authorNames, locale)
}
