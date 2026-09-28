import { cn } from '@/utilities/ui'
import React from 'react'

import { Card, CardPostData } from '@/components/Card'
import type { Locale } from '@/i18n/config'
import { zobrazitelny } from '@/i18n/zobrazitelny'

export type Props = {
  locale: Locale
  posts: CardPostData[]
}

export const CollectionArchive: React.FC<Props> = (props) => {
  const { locale, posts: vsechny } = props
  // Populované/vybrané dokumenty neprošly dotazem s `prelozeno` — filtr tady (A18).
  const posts = vsechny?.filter((doc) => zobrazitelny(doc, locale))

  return (
    <div className={cn('container')}>
      <div>
        <div className="grid grid-cols-4 sm:grid-cols-8 lg:grid-cols-12 gap-y-4 gap-x-4 lg:gap-y-8 lg:gap-x-8 xl:gap-x-8">
          {posts?.map((result, index) => {
            if (typeof result === 'object' && result !== null) {
              return (
                <div className="col-span-4" key={index}>
                  <Card className="h-full" doc={result} relationTo="posts" showCategories />
                </div>
              )
            }

            return null
          })}
        </div>
      </div>
    </div>
  )
}
