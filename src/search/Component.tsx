'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { useState, useEffect } from 'react'
import { useDebounce } from '@/utilities/useDebounce'
import { useRouter } from 'next/navigation'
import { useLocale } from '@/i18n/LocaleProvider'
import { lokalizujCestu } from '@/i18n/routing'

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
          Hledat
        </Label>
        <Input
          id="search"
          onChange={(event) => {
            setValue(event.target.value)
          }}
          placeholder="Hledat"
        />
        <button type="submit" className="sr-only">
          Hledat
        </button>
      </form>
    </div>
  )
}
