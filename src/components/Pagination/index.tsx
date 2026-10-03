'use client'
import {
  Pagination as PaginationComponent,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { cn } from '@/utilities/ui'
import { useLocale } from '@/i18n/LocaleProvider'
import { cestaMagazinu, lokalizujCestu } from '@/i18n/routing'
import { t } from '@/i18n/ui'
import { useRouter } from 'next/navigation'
import React from 'react'

export const Pagination: React.FC<{
  className?: string
  page: number
  totalPages: number
}> = (props) => {
  const router = useRouter()
  const locale = useLocale()
  const jdiNa = (cislo: number) => router.push(lokalizujCestu(cestaMagazinu(cislo), locale))

  const { className, page, totalPages } = props
  const hasNextPage = page < totalPages
  const hasPrevPage = page > 1

  const hasExtraPrevPages = page - 1 > 1
  const hasExtraNextPages = page + 1 < totalPages

  return (
    <div className={cn('my-12', className)}>
      <PaginationComponent>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              ariaLabel={t(locale, 'pagination.prevAria')}
              disabled={!hasPrevPage}
              label={t(locale, 'pagination.prev')}
              onClick={() => {
                jdiNa(page - 1)
              }}
            />
          </PaginationItem>

          {hasExtraPrevPages && (
            <PaginationItem>
              <PaginationEllipsis label={t(locale, 'pagination.more')} />
            </PaginationItem>
          )}

          {hasPrevPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  jdiNa(page - 1)
                }}
              >
                {page - 1}
              </PaginationLink>
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationLink
              isActive
              onClick={() => {
                jdiNa(page)
              }}
            >
              {page}
            </PaginationLink>
          </PaginationItem>

          {hasNextPage && (
            <PaginationItem>
              <PaginationLink
                onClick={() => {
                  jdiNa(page + 1)
                }}
              >
                {page + 1}
              </PaginationLink>
            </PaginationItem>
          )}

          {hasExtraNextPages && (
            <PaginationItem>
              <PaginationEllipsis label={t(locale, 'pagination.more')} />
            </PaginationItem>
          )}

          <PaginationItem>
            <PaginationNext
              ariaLabel={t(locale, 'pagination.nextAria')}
              disabled={!hasNextPage}
              label={t(locale, 'pagination.next')}
              onClick={() => {
                jdiNa(page + 1)
              }}
            />
          </PaginationItem>
        </PaginationContent>
      </PaginationComponent>
    </div>
  )
}
