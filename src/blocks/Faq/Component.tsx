import type { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'

import React from 'react'

import RichText from '@/components/RichText'
import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'

// Local props — the generated `FaqBlock` type does not exist until `generate:types` runs.
export type FaqBlockItem = {
  question: string
  answer: DefaultTypedEditorState
  id?: string | null
}

export type FaqBlockProps = {
  className?: string
  heading?: string | null
  items?: FaqBlockItem[] | null
  lead?: string | null
  id?: string | null
  blockName?: string | null
  blockType?: 'faq'
}

/** Lexical node types that end a block of text — a space is appended after them. */
const BLOCK_LEVEL_TYPES = new Set([
  'block',
  'heading',
  'horizontalrule',
  'linebreak',
  'list',
  'listitem',
  'paragraph',
  'quote',
  'table',
  'tablecell',
  'tablerow',
])

const MAX_DEPTH = 24

/**
 * Walks any Lexical editor state and concatenates its `text` nodes.
 * Tolerates missing/!object/cyclically deep input — never throws.
 */
const collectText = (node: unknown, depth: number): string => {
  if (node == null || depth > MAX_DEPTH) return ''
  if (typeof node === 'string') return node
  if (Array.isArray(node)) return node.map((child) => collectText(child, depth + 1)).join('')
  if (typeof node !== 'object') return ''

  const record = node as Record<string, unknown>
  let out = ''

  if (typeof record.text === 'string') out += record.text
  if (record.root != null) out += collectText(record.root, depth + 1)
  if (Array.isArray(record.children)) out += collectText(record.children, depth + 1)
  if (typeof record.type === 'string' && BLOCK_LEVEL_TYPES.has(record.type)) out += ' '

  return out
}

const richTextToPlainText = (data: unknown): string =>
  collectText(data, 0).replace(/\s+/g, ' ').trim()

// Closing section of an article: native <details>/<summary> accordion (works without JS)
// plus FAQPage data matching the visible answers; no promise of search rich results.
export const FaqBlock: React.FC<FaqBlockProps> = ({ className, heading, id, items, lead }) => {
  const entries = (Array.isArray(items) ? items : []).filter(
    (item) => item && typeof item.question === 'string' && item.question.trim() !== '',
  )

  if (entries.length === 0) return null

  const headingText = heading && heading.trim() !== '' ? heading.trim() : 'Časté otázky'
  const headingId = id ? `faq-${id}-heading` : undefined

  const questions = entries
    .map((item) => ({
      name: item.question.trim(),
      text: richTextToPlainText(item.answer),
    }))
    .filter((entry) => entry.text !== '')

  const schema =
    questions.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: questions.map((entry) => ({
            '@type': 'Question',
            name: entry.name,
            acceptedAnswer: {
              '@type': 'Answer',
              text: entry.text,
            },
          })),
        }
      : null

  return (
    <section
      aria-labelledby={headingId}
      className={cn('rv id-edge id-2col not-prose w-full', className)}
      data-block="faq"
    >
      <div>
      <span className="mb-[14px] flex w-fit items-center gap-[10px] font-[family-name:var(--id-f-display)] text-[12px] leading-[1.2] font-semibold tracking-[0.14em] text-[var(--id-accent)] uppercase">
        <span aria-hidden="true" className="h-[1.5px] w-[22px] shrink-0 bg-[var(--id-accent)]" />
        Otázky a&nbsp;odpovědi
      </span>

      <h2
        className="m-0 font-[family-name:var(--id-f-display)] text-[length:var(--id-t-title)] font-semibold leading-[1.05] tracking-[-0.025em] text-balance text-[var(--id-ink)]"
        id={headingId}
      >
        {headingText}
      </h2>
      {lead ? <p className="id-faq__lead">{nezlomitelneMezery(lead)}</p> : null}
      </div>

      <div className="border-b border-[var(--id-line-soft)]">
        {entries.map((item, index) => (
          <details className="group" key={item.id ?? `${index}`}>
            <summary className="flex cursor-pointer list-none items-start justify-between gap-6 border-t border-[var(--id-line-soft)] py-[20px] font-[family-name:var(--id-f-display)] text-[length:var(--id-t-subtitle)] font-medium leading-[1.25] tracking-[-0.015em] text-[var(--id-ink)] [text-wrap:balance] [transition:color_250ms] hover:text-[var(--id-accent)] [&::-webkit-details-marker]:hidden">
              <span className="text-balance">{nezlomitelneMezery(item.question)}</span>
              <span
                aria-hidden="true"
                className="relative mt-[5px] h-[13px] w-[13px] shrink-0"
              >
                <span className="absolute left-0 top-1/2 h-[1.5px] w-full -translate-y-1/2 rounded-full bg-[var(--id-ink-3)]" />
                <span className="absolute left-1/2 top-0 h-full w-[1.5px] -translate-x-1/2 rounded-full bg-[var(--id-ink-3)] group-open:rotate-90 motion-safe:transition-transform motion-safe:duration-[250ms] motion-safe:ease-[cubic-bezier(0.22,0.61,0.36,1)] motion-reduce:transition-none" />
              </span>
            </summary>

            <div className="pb-[18px] pr-8 text-[17px] leading-[1.65] text-[var(--id-ink-2)] [&_p:last-child]:mb-0 [&_p]:mb-4">
              <RichText data={item.answer} enableGutter={false} enableProse={false} />
            </div>
          </details>
        ))}
      </div>

      {schema ? (
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }}
          type="application/ld+json"
        />
      ) : null}
    </section>
  )
}
