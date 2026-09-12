import React from 'react'

import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'

/**
 * Local prop types — the generated `StatTilesBlock` in src/payload-types does not
 * exist until `generate:types` runs after this block is registered. Shapes match
 * what Payload emits for this config, so spreading `node.fields` stays assignable.
 */
export type StatTile = {
  value: string
  unit?: string | null
  label: string
  id?: string | null
}

export type StatTilesBlockProps = {
  tiles?: StatTile[] | null
  id?: string | null
  blockName?: string | null
  blockType?: 'statTiles'
  className?: string
  /** Sloupce na desktopu; výchozí = počet dlaždic (max 4). Souhrn na ose prózy (700 px) sází 2×2. */
  columns?: 2 | 3 | 4
}

/**
 * Number of columns on desktop mirrors the number of tiles. Full literal class
 * names only — Tailwind scans source text, so these can never be built by
 * string concatenation.
 */
const DESKTOP_COLUMNS: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

/**
 * Hairline grid, no cards and no shadows (DS 7.6).
 *
 * The row above the tiles carries the only shared border; every tile draws its
 * own left hairline except the one that opens its row — and that one also loses
 * its left padding so the first number sits flush with the text column.
 * Because the wrap point is known per breakpoint (1 col → 2 cols → N cols), the
 * position of each tile within its row is computable at render time, so no
 * arbitrary `nth-child` variants are needed.
 */
const tileClassName = (index: number, count: number, cols: number): string => {
  const opensRowOnTablet = index % 2 === 0
  const isFirstRowOnTablet = index < 2
  const opensRowOnDesktop = index % cols === 0
  const isFirstRowOnDesktop = index < cols
  const isLastRowOnDesktop = index >= count - (count % cols || cols)

  return cn(
    // padding 22/18/18 while wrapped, 28/26/4 once the tiles stand in one row
    'min-w-0 pt-[22px] pr-[18px] pb-[18px] pl-0 md:pt-[28px] md:pr-[26px]',
    isLastRowOnDesktop ? 'md:pb-[4px]' : 'md:pb-[22px]',
    'border-[color:var(--id-line-soft)]',
    // single column: every tile but the first needs its own horizontal hairline
    index > 0 && 'border-t',
    // two columns
    opensRowOnTablet ? 'sm:border-l-0 sm:pl-0' : 'sm:border-l sm:pl-[18px]',
    isFirstRowOnTablet ? 'sm:border-t-0' : 'sm:border-t',
    // desktop rows: vertical hairlines inside a row, the shared top hairline sits on the grid
    opensRowOnDesktop ? 'md:border-l-0 md:pl-0' : 'md:border-l md:pl-[26px]',
    isFirstRowOnDesktop ? 'md:border-t-0' : 'md:border-t',
  )
}

export const StatTilesBlock: React.FC<StatTilesBlockProps> = ({ className, columns, tiles }) => {
  const items = (tiles ?? []).filter((tile) => Boolean(tile?.value || tile?.label))

  if (items.length === 0) return null

  const cols = Math.min(columns ?? items.length, 4)

  return (
    <div className={cn('not-prose mx-auto w-full', className)}>
      <div
        data-rv-group
        className={cn(
          'grid grid-cols-1 border-t border-[color:var(--id-line-soft)]',
          items.length > 1 && 'sm:grid-cols-2',
          DESKTOP_COLUMNS[cols] ?? 'md:grid-cols-4',
        )}
      >
        {items.map((tile, index) => (
          <div key={tile.id ?? index} className={cn('rv', tileClassName(index, items.length, cols))}>
            <div
              className={cn(
                'font-[family-name:var(--id-f-display)] font-semibold tabular-nums',
                // stupeň stat-num z DS (4.2 / 7.6); dlouhý rozsah řeší sazba 2×2, ne menší písmo
                'text-[length:var(--id-t-stat)] leading-[1.05] tracking-[-0.02em]',
                'text-[color:var(--id-ink)]',
              )}
            >
              {/* Rozsah „2,5–7,5" drží pohromadě; jednotka smí spadnout na další řádek. */}
              <span className="whitespace-nowrap">{tile.value}</span>
              {/* místo zlomu: bez něj by jednotka nespadla na další řádek a přetekla do sousední dlaždice */}
              <wbr />
              {tile.unit ? (
                <small className="ml-[2px] text-[length:0.52em] font-semibold tracking-normal text-[color:var(--id-ink-2)]">
                  {tile.unit}
                </small>
              ) : null}
            </div>
            <div className="mt-[6px] text-[length:13px] leading-[1.45] text-[color:var(--id-ink-2)]">
              {nezlomitelneMezery(tile.label)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
