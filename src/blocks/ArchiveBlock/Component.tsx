import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload, type Where } from 'payload'
import React from 'react'
import RichText from '@/components/RichText'

import { CollectionArchive } from '@/components/CollectionArchive'
import type { Locale } from '@/i18n/config'

export const ArchiveBlock: React.FC<
  ArchiveBlockProps & {
    id?: string
    locale: Locale
  }
> = async (props) => {
  const { id, categories, introContent, limit: limitFromProps, locale, populateBy, selectedDocs } = props

  const limit = limitFromProps || 3

  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })

    const flattenedCategories = categories?.map((category) => {
      if (typeof category === 'object') return category.id
      else return category
    })

    const podminky: Where[] = []
    if (flattenedCategories && flattenedCategories.length > 0) {
      podminky.push({
        categories: {
          in: flattenedCategories,
        },
      })
    }
    // Cizí jazyk jen dokumenty s hotovým překladem (A18); čeština beze změny.
    if (locale !== 'cs') podminky.push({ prelozeno: { equals: true } })

    const fetchedPosts = await payload.find({
      collection: 'posts',
      depth: 1,
      limit,
      locale,
      ...(podminky.length > 0 ? { where: podminky.length === 1 ? podminky[0] : { and: podminky } } : {}),
    })

    posts = fetchedPosts.docs
  } else {
    if (selectedDocs?.length) {
      const filteredSelectedPosts = selectedDocs.map((post) => {
        if (typeof post.value === 'object') return post.value
      }) as Post[]

      posts = filteredSelectedPosts
    }
  }

  return (
    <div className="my-16" id={`block-${id}`}>
      {introContent && (
        <div className="container mb-16">
          <RichText className="ms-0 max-w-[48rem]" data={introContent} enableGutter={false} locale={locale} />
        </div>
      )}
      <CollectionArchive locale={locale} posts={posts} />
    </div>
  )
}
