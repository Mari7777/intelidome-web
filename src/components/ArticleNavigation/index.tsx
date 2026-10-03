import type { Post } from '@/payload-types'
import { getArticleSections } from '@/utilities/articleSeo'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { Locale } from '@/i18n/config'
import { cestaMagazinu, lokalizujCestu } from '@/i18n/routing'
import { t } from '@/i18n/ui'

export function ArticleNavigation({ locale, post }: { locale: Locale; post: Post }) {
  const sections = getArticleSections(post.content)
  const skupiny = sections.some((section) => section.group && !section.autoGroup)
  const casti: { group?: string; start: number; items: typeof sections }[] = []
  sections.forEach((section, index) => {
    if (section.group || casti.length === 0) casti.push({ group: section.group, start: index + 1, items: [] })
    casti[casti.length - 1].items.push(section)
  })
  return (
    <div className="bg-[var(--id-cream)] text-[var(--id-ink-2)]">
      <div className="container py-6 text-[14px] leading-relaxed">
        <nav aria-label={t(locale, 'article.breadcrumb')}>
          <ol className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <li><a className="underline underline-offset-4" href={lokalizujCestu('/', locale)}>{t(locale, 'seo.breadcrumbHome')}</a></li>
            <li aria-hidden="true">/</li>
            <li><a className="underline underline-offset-4" href={lokalizujCestu(cestaMagazinu(), locale)}>{t(locale, 'seo.breadcrumbPosts')}</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{post.title}</li>
          </ol>
        </nav>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[var(--id-ink-3)]">
          <span>{t(locale, 'article.publisher')}</span>
          <span>{t(locale, 'article.updated')} <time dateTime={post.updatedAt}>{formatDateTime(post.updatedAt, locale)}</time></span>
        </p>
        {sections.length > 0 && (
          /* Dlouhý článek (kapitoly mají skupiny) má obsah členěný; po načtení
             je sbalený jako u ostatních článků (rozhodnutí autora 3. 10. 2026).
             Číslování běží průběžně přes skupiny (DESIGN.md 8.2, v2.12). */
          <details className={skupiny ? 'mt-4' : 'mt-4 max-w-[700px]'}>
            <summary className="w-fit cursor-pointer py-2 font-medium text-[var(--id-ink)]">{t(locale, 'article.toc')}</summary>
            <nav aria-label={t(locale, 'article.tocAria')}>
              {skupiny ? (
                /* Dva sloupce stránky (652 | 652, zlom 720 jako dvousloupec a FAQ);
                   pod 1130 px jeden sloupec (8.2a, porota kola 02). */
                <div className="mt-2 grid grid-cols-1 gap-x-[clamp(28px,4vw,56px)] gap-y-5 pb-2 min-[1130px]:grid-cols-2">
                  {casti.map((cast) => (
                    <div key={cast.start}>
                      {cast.group ? (
                        <p className="mb-2 font-[family-name:var(--id-f-display)] text-[12px] leading-[1.2] font-semibold tracking-[0.14em] text-[var(--id-ink-2)] uppercase">
                          {cast.group}
                        </p>
                      ) : null}
                      <ol className={cast.items[0]?.autoGroup ? 'grid gap-2 pl-6 list-none' : 'grid gap-2 pl-6 list-decimal'} start={cast.start}>
                        {cast.items.map((section) => (
                          <li key={section.id}><a className="text-[var(--id-accent)] underline underline-offset-4" href={`#${section.id}`}>{section.title}</a></li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              ) : (
                <ol className="mt-2 grid gap-2 pb-2 pl-5 list-decimal">
                  {sections.map((section) => (
                    <li key={section.id}><a className="text-[var(--id-accent)] underline underline-offset-4" href={`#${section.id}`}>{section.title}</a></li>
                  ))}
                </ol>
              )}
            </nav>
          </details>
        )}
      </div>
    </div>
  )
}
