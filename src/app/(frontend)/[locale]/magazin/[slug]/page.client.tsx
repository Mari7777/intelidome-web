'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect } from 'react'
import { movedArticleAnchor } from '@/utilities/magazineMovedAnchors'

const PageClient: React.FC = () => {
  /* Article header is light (no image behind the site header) */
  const { setHeaderTheme } = useHeaderTheme()

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])
  useEffect(() => {
    const followMovedChapter = () => {
      const target = movedArticleAnchor(window.location.pathname, window.location.hash)
      if (!target) return
      const destination = new URL(target, window.location.origin)
      destination.search = window.location.search
      window.location.replace(destination.href)
    }
    followMovedChapter()
    window.addEventListener('hashchange', followMovedChapter)
    return () => window.removeEventListener('hashchange', followMovedChapter)
  }, [])
  return <React.Fragment />
}

export default PageClient
