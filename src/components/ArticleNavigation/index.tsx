import type { Post } from '@/payload-types'
import { getArticleSections } from '@/utilities/articleSeo'
import { formatDateTime } from '@/utilities/formatDateTime'
import type { Locale } from '@/i18n/config'
import { lokalizujCestu } from '@/i18n/routing'
import { t } from '@/i18n/ui'

export function ArticleNavigation({ locale, post }: { locale: Locale; post: Post }) {
  const sections = getArticleSections(post.content)
  return (
    <div className="bg-[var(--id-cream)] text-[var(--id-ink-2)]">
      <div className="container py-6 text-[14px] leading-relaxed">
        <nav aria-label={t(locale, 'article.breadcrumb')}>
          <ol className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <li><a className="underline underline-offset-4" href={lokalizujCestu('/', locale)}>{t(locale, 'seo.breadcrumbHome')}</a></li>
            <li aria-hidden="true">/</li>
            <li><a className="underline underline-offset-4" href={lokalizujCestu('/posts', locale)}>{t(locale, 'seo.breadcrumbPosts')}</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{post.title}</li>
          </ol>
        </nav>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[var(--id-ink-3)]">
          <span>{t(locale, 'article.publisher')}</span>
          <span>{t(locale, 'article.updated')} <time dateTime={post.updatedAt}>{formatDateTime(post.updatedAt, locale)}</time></span>
        </p>
        {sections.length > 0 && (
          <details className="mt-4 max-w-[700px]">
            <summary className="w-fit cursor-pointer py-2 font-medium text-[var(--id-ink)]">{t(locale, 'article.toc')}</summary>
            <nav aria-label={t(locale, 'article.tocAria')}>
              <ol className="mt-2 grid gap-2 pb-2 pl-5 list-decimal">
                {sections.map((section) => (
                  <li key={section.id}><a className="text-[var(--id-accent)] underline underline-offset-4" href={`#${section.id}`}>{section.title}</a></li>
                ))}
              </ol>
            </nav>
          </details>
        )}
      </div>
    </div>
  )
}
