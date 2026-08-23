import type { BannerBlock as BannerBlockProps } from 'src/payload-types'

import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

type Props = {
  className?: string
} & BannerBlockProps

// Rendered as an InteliDome DS callout — tinted box with a tone dot.
export const BannerBlock: React.FC<Props> = ({ className, content, style }) => {
  return (
    <div className={cn('mx-auto w-full', className)}>
      <div
        className={cn('id-callout', {
          'id-callout--info': style === 'info',
          'id-callout--danger': style === 'error',
          'id-callout--success': style === 'success',
          'id-callout--warn': style === 'warning',
        })}
      >
        <span className="id-callout__dot" aria-hidden="true" />
        <RichText data={content} enableGutter={false} enableProse={false} />
      </div>
    </div>
  )
}
