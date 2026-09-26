import type { Post } from '@/payload-types'
import { getArticleSections } from '@/utilities/articleSeo'
import { formatDateTime } from '@/utilities/formatDateTime'

export function ArticleNavigation({ post }: { post: Post }) {
  const sections = getArticleSections(post.content)
  return (
    <div className="bg-[var(--id-cream)] text-[var(--id-ink-2)]">
      <div className="container py-6 text-[14px] leading-relaxed">
        <nav aria-label="Drobečková navigace">
          <ol className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
            <li><a className="underline underline-offset-4" href="/">Úvod</a></li>
            <li aria-hidden="true">/</li>
            <li><a className="underline underline-offset-4" href="/posts">Články</a></li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{post.title}</li>
          </ol>
        </nav>
        <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[var(--id-ink-3)]">
          <span>Vydává InteliDome</span>
          <span>Aktualizováno <time dateTime={post.updatedAt}>{formatDateTime(post.updatedAt)}</time></span>
        </p>
        {sections.length > 0 && (
          <details className="mt-4 max-w-[700px]">
            <summary className="w-fit cursor-pointer py-2 font-medium text-[var(--id-ink)]">V článku</summary>
            <nav aria-label="Obsah článku">
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
