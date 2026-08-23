import React from 'react'

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
const tileClassName = (index: number, count: number): string => {
  const opensRowOnTablet = index % 2 === 0
  const isFirstRowOnTablet = index < 2
  const opensRowOnDesktop = index === 0 || count === 1

  return cn(
    // padding 22/18/18 while wrapped, 28/26/4 once the tiles stand in one row
    'min-w-0 pt-[22px] pr-[18px] pb-[18px] pl-0 md:pt-[28px] md:pr-[26px] md:pb-[4px]',
    'border-[color:var(--id-line-soft)]',
    // single column: every tile but the first needs its own horizontal hairline
    index > 0 && 'border-t',
    // two columns
    opensRowOnTablet ? 'sm:border-l-0 sm:pl-0' : 'sm:border-l sm:pl-[18px]',
    isFirstRowOnTablet ? 'sm:border-t-0' : 'sm:border-t',
    // one row: vertical hairlines only, the shared top hairline sits on the grid
    opensRowOnDesktop ? 'md:border-l-0 md:pl-0' : 'md:border-l md:pl-[26px]',
    'md:border-t-0',
  )
}

export const StatTilesBlock: React.FC<StatTilesBlockProps> = ({ className, tiles }) => {
  const items = (tiles ?? []).filter((tile) => Boolean(tile?.value || tile?.label))

  if (items.length === 0) return null

  return (
    <div className={cn('not-prose mx-auto w-full', className)}>
      <div
        data-rv-group
        className={cn(
          'grid grid-cols-1 border-t border-[color:var(--id-line-soft)]',
          items.length > 1 && 'sm:grid-cols-2',
          DESKTOP_COLUMNS[items.length] ?? 'md:grid-cols-4',
        )}
      >
        {items.map((tile, index) => (
          <div key={tile.id ?? index} className={cn('rv', tileClassName(index, items.length))}>
            <div
              className={cn(
                'font-[family-name:var(--id-f-display)] font-semibold tabular-nums',
                'text-[length:clamp(26px,3vw,40px)] leading-[1.05] tracking-[-0.02em]',
                'text-[color:var(--id-ink)]',
              )}
            >
              {tile.value}
              {tile.unit ? (
                <small className="ml-[2px] text-[length:0.52em] font-semibold tracking-normal text-[color:var(--id-ink-2)]">
                  {tile.unit}
                </small>
              ) : null}
            </div>
            <div className="mt-[6px] text-[length:13px] leading-[1.45] text-[color:var(--id-ink-2)]">
              {tile.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
