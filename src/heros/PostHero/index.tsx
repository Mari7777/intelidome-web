import { formatDateTime } from 'src/utilities/formatDateTime'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatAuthors } from '@/utilities/formatAuthors'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { readingTime } from '@/utilities/readingTime'

/**
 * Filmový hero článku (DESIGN.md 8.2 ř. 1 + prompt 1).
 *
 * Obsidiánový pás přes celou obrazovku, fotografie nese emoci (9.1:
 * full-bleed bez radiusu, scrim nejvýš do 45 % výšky), obsah sedí dole.
 * Nástup je orchestrovaný, ne jeden fade na všem: titulek stoupá z masky
 * po řádcích, ostatní se prolne. Bez fotografie zůstává čistý pás.
 */
export const PostHero: React.FC<{ post: Post }> = ({ post }) => {
  const { categories, content, heroImage, meta, populatedAuthors, publishedAt, title } = post

  const hasAuthors =
    populatedAuthors && populatedAuthors.length > 0 && formatAuthors(populatedAuthors) !== ''

  const categoryTitles = (categories ?? [])
    .filter((category): category is Exclude<typeof category, number> => typeof category === 'object')
    .map((category) => category?.title || '')
    .filter(Boolean)

  const eyebrow = categoryTitles.length ? categoryTitles.join(' · ') : 'Návody · Závlaha'

  // Titulek po řádcích: každý má VLASTNÍ masku, aby mohl stoupat zvlášť
  // se staggerem (6.3.3). Kvalifikátor za dvojtečkou je druhý hlas.
  const [headline, qualifier] = splitTitle(title)
  // 16 znaků: „začíná pod zemí" (15) se vejde na řádek na 1440 i 393 —
  // se 14 vznikal sirotek „zemí" a předložka „pod" na konci řádku.
  const lines = splitLines(headline, 16)

  // Lead nese slib. Použijeme meta description (už je napsaná a je to
  // přesně slib článku); kvalifikátor je nouzová varianta.
  const lead = meta?.description?.trim() || qualifier

  const minutes = readingTime(content)
  const metaItems = [
    minutes ? nezlomitelneMezery(`${minutes} min čtení`) : null,
    hasAuthors ? formatAuthors(populatedAuthors) : null,
    'InteliDome Journal',
    publishedAt ? <time dateTime={publishedAt}>{formatDateTime(publishedAt)}</time> : null,
  ].filter(Boolean) as React.ReactNode[]

  return (
    <header
      className="id-hero relative flex min-h-[100svh] flex-col justify-end overflow-hidden bg-obsidian"
      data-surface="dark"
    >
      {heroImage && typeof heroImage !== 'string' && (
        <div className="absolute inset-0">
          <Media
            fill
            imgClassName="id-hero__img h-full w-full object-cover"
            priority
            resource={heroImage}
            pictureClassName="h-full w-full"
            // Na výšku (telefon) se z 21:9 masteru zobrazí jen ~22 % šířky —
            // požadovaná šířka obrázku se proto odvíjí od výšky viewportu.
            size="(orientation: portrait) 236vh, 100vw"
          />
          <div className="id-hero__scrim absolute inset-0" />
        </div>
      )}

      <div className="relative container pt-[clamp(96px,14vw,160px)] pb-[clamp(40px,6vw,64px)]">
        <p className="id-hero__eyebrow id-hero__fade">{eyebrow}</p>

        <h1 className="id-hero__title mt-5 max-w-[13ch] text-ink-dark">
          {lines.map((line, index) => (
            <React.Fragment key={line}>
              {/* mezera mezi blokovými řádky: textContent jinak slepí „trávníkzačíná" */}
              {index > 0 && ' '}
              <span className="id-hline">
                <span style={{ animationDelay: `${index * 0.12}s` }}>{line}</span>
              </span>
            </React.Fragment>
          ))}
        </h1>

        {lead && <p className="id-hero__lead id-hero__fade">{nezlomitelneMezery(lead)}</p>}

        <p className="id-hero__fade id-hero__meta">
          {metaItems.map((item, index) => (
            <React.Fragment key={index}>
              {index > 0 && ' '}
              {/* oddělovač patří k předchozí položce — na 320 px se láme po položkách, ne „· datum" */}
              <span className="id-hero__meta-item">
                {item}
                {index < metaItems.length - 1 && <span aria-hidden="true">&nbsp;·</span>}
              </span>
            </React.Fragment>
          ))}
        </p>
      </div>

      <a className="id-hero__cue" href="#obsah" aria-label="Přejít na článek">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M8 2v11M3.5 9 8 13.5 12.5 9"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </header>
  )
}

/** Rozdělí titulek na hlavní větu a kvalifikátor za dvojtečkou. */
function splitTitle(title: string): [string, string | null] {
  const at = title.indexOf(':')
  if (at === -1) return [title, null]
  return [title.slice(0, at).trim(), title.slice(at + 1).trim() || null]
}

/** Rozdělí titulek na řádky o max. `maxChars` znacích — každý dostane
 *  vlastní masku, takže mohou stoupat se staggerem (DESIGN.md 6.3.3). */
function splitLines(text: string, maxChars: number): string[] {
  const lines: string[] = []
  let current = ''
  for (const word of text.split(/\s+/)) {
    const candidate = current ? `${current} ${word}` : word
    if (candidate.length > maxChars && current) {
      lines.push(current)
      current = word
    } else {
      current = candidate
    }
  }
  if (current) lines.push(current)
  return lines
}
