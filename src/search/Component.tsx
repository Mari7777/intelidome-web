'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import { lokalizujCestu } from '@/i18n/routing'
import { t } from '@/i18n/ui'

export const Search: React.FC = () => {
  const [value, setValue] = useState('')
  const router = useRouter()
  const locale = useLocale()

  const debouncedValue = useDebounce(value)

  useEffect(() => {
    router.push(lokalizujCestu(`/search${debouncedValue ? `?q=${debouncedValue}` : ''}`, locale))
  }, [debouncedValue, locale, router])

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault()
        }}
      >
        <Label htmlFor="search" className="sr-only">
          {t(locale, 'search.field')}
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder={t(locale, 'search.field')}
        />
        <button type="submit" className="sr-only">
          {t(locale, 'search.field')}
        </button>
      </form>
    </div>
  )
}
