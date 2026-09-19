import React from 'react'

import { nezlomitelneMezery } from '@/utilities/czechTypography'
import { TableWrap } from './TableWrap'
import { cn } from '@/utilities/ui'

export type TableBlockProps = {
  heading?: string | null
  surface?: string | null
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
  surface,
  width,
}) => {
  const sloupce = columns ?? []
  if (sloupce.length === 0) return null

  /*
    Přehledová tabulka jako krémový PÁS nese posun povrchu (8.1 p. 3+5) —
    v dlouhém článku vsazený blok rytmus neudělá. Jako pás nesmí `rv`
    viset na kořeni (do obrazu by se vsouval celý povrch): kořen nese
    skupinu a odhalují se jeho děti (6.3.2). Obsah pásu drží sloupec
    podle `width` — pás si maluje povrch přes celé okno.
  */
  const jePas = surface === 'krem'
  const koren = jePas
    ? cn('id-table-block not-prose id-band id-band--cream id-band--self', className)
    : cn('rv id-table-block not-prose', width === 'edge' && 'id-edge', className)

  const obsah = (
    <div className={jePas ? cn('id-table-band__inner', width !== 'edge' && 'id-table-band__inner--prose') : undefined}>
      {heading ? <h3 className={cn('id-table__h', jePas && 'rv')}>{nezlomitelneMezery(heading)}</h3> : null}
      <TableWrap className={jePas ? 'rv' : undefined} label={heading ?? `Tabulka: ${sloupce[0]?.label ?? ''}`}>
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
                    <td key={cell.id ?? ci} className={doprava} data-label={sloupce[ci]?.label ?? undefined}>
                      {obsah}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </TableWrap>
      {note ? <p className={cn('id-table__note', jePas && 'rv')}>{nezlomitelneMezery(note)}</p> : null}
    </div>
  )

  return (
    <div className={koren} {...(jePas ? { 'data-rv-group': '' } : {})}>
      {obsah}
    </div>
  )
}
