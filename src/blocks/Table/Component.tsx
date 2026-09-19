import React from 'react'

import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'

export type TableBlockProps = {
  heading?: string | null
  width?: string | null
  columns?: { label?: string | null; align?: string | null; id?: string | null }[] | null
  rows?: { cells?: { value?: string | null; id?: string | null }[] | null; id?: string | null }[] | null
  note?: string | null
  blockName?: string | null
  blockType?: 'table'
  className?: string
}

/**
 * Datová tabulka (DS: hairliny --id-line-soft UVNITŘ komponenty, tabular-nums,
 * hlavička na label škále). První buňka řádku je <th scope="row"> — tabulky
 * článků jsou vždy „položka → hodnoty". Na telefonu tabulka roluje vodorovně
 * ve vlastním kontejneru; stránka samotná nikdy.
 */
export const TableBlock: React.FC<TableBlockProps> = ({
  className,
  columns,
  heading,
  note,
  rows,
  width,
}) => {
  const sloupce = columns ?? []
  if (sloupce.length === 0) return null

  return (
    <div className={cn('rv id-table-block not-prose', width === 'edge' && 'id-edge', className)}>
      {heading ? <h3 className="id-table__h">{nezlomitelneMezery(heading)}</h3> : null}
      <div className="id-table-wrap" tabIndex={0}>
        <table className="id-table">
          <thead>
            <tr>
              {sloupce.map((col, i) => (
                <th key={col.id ?? i} scope="col" className={col.align === 'right' ? 'ta-r' : undefined}>
                  {nezlomitelneMezery(col.label ?? '')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(rows ?? []).map((row, ri) => (
              <tr key={row.id ?? ri}>
                {(row.cells ?? []).map((cell, ci) => {
                  const obsah = nezlomitelneMezery(cell.value ?? '')
                  const doprava = sloupce[ci]?.align === 'right' ? 'ta-r' : undefined
                  return ci === 0 ? (
                    <th key={cell.id ?? ci} scope="row" className={doprava}>
                      {obsah}
                    </th>
                  ) : (
                    <td key={cell.id ?? ci} className={doprava}>
                      {obsah}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {note ? <p className="id-table__note">{nezlomitelneMezery(note)}</p> : null}
    </div>
  )
}
