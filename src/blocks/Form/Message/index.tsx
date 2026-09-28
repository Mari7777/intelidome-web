'use client'
import RichText from '@/components/RichText'
import React from 'react'

import { Width } from '../Width'
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical'
import { useLocale } from '@/i18n/LocaleProvider'

export const Message: React.FC<{ message: DefaultTypedEditorState }> = ({ message }) => {
  const locale = useLocale()
  return (
    <Width className="my-12" width="100">
      {message && <RichText data={message} locale={locale} />}
    </Width>
  )
}
