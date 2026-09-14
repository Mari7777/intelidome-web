'use client'

import type { StaticImageData } from 'next/image'

import { cn } from '@/utilities/ui'
import NextImage from 'next/image'
import React from 'react'

import type { Props as MediaProps } from '../types'

import { getMediaUrl } from '@/utilities/getMediaUrl'

// A base64 encoded image to use as a placeholder while the image is loading
const placeholderBlur =
  'data:image/png;base64,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'

/**
 * ImageMedia
 *
 * This component passes a **relative** `src` (e.g. `/media/...`) to Next.js Image.
 * The `getMediaUrl` utility constructs the full URL by prepending the base URL from env vars
 * (NEXT_PUBLIC_SERVER_URL). Next.js then optimizes this using `remotePatterns` configured
 * in next.config.js — no custom `loader` needed.
 *
 * Flow:
 *   1. Resource URL from Payload: `/media/image-123.jpg`
 *   2. getMediaUrl() adds base URL: `https://yourdomain.com/media/image-123.jpg`
 *   3. Next.js Image optimizes via remotePatterns: `/_next/image?url=...&w=1200&q=75`
 *
 * If your storage/plugin returns **external CDN URLs** (e.g. `https://cdn.example.com/...`),
 * choose ONE of the following:
 *   A) Allow the remote host in next.config.js:
 *      images: { remotePatterns: [{ protocol: 'https', hostname: 'cdn.example.com' }] }
 *   B) Provide a **custom loader** for CDN-specific transforms:
 *      const imageLoader: ImageLoader = ({ src, width, quality }) =>
 *        `https://cdn.example.com${src}?w=${width}&q=${quality ?? 75}`
 *      <Image loader={imageLoader} src="/media/hero.jpg" width={1200} height={600} alt="" />
 *   C) Skip optimization:
 *      <Image unoptimized src="https://cdn.example.com/hero.jpg" width={1200} height={600} alt="" />
 *
 * TL;DR: Template uses relative URLs + getMediaUrl() to construct full URLs, then relies on
 * remotePatterns for optimization. Only add `loader` if using external CDNs with custom transforms.
 */

export const ImageMedia: React.FC<MediaProps> = (props) => {
  const {
    alt: altFromProps,
    fill,
    pictureClassName,
    imgClassName,
    priority,
    resource,
    size: sizeFromProps,
    src: srcFromProps,
    loading: loadingFromProps,
  } = props

  let width: number | undefined
  let height: number | undefined
  let alt = altFromProps
  let src: StaticImageData | string = srcFromProps || ''
  // Fokální bod z knihovny médií (Media má `focalPoint: true`): u `fill`
  // s object-fit cover rozhoduje, co z fotky zůstane v záběru — art
  // direction patří k fotografii, ne do globálního CSS (hero článku 1
  // chtělo 62 %, sonda článku 2 chce 30 %, aby titulek neležel přes rýč).
  const focal: Record<string, string> = {}
  let portretSrc: string | undefined

  if (!src && resource && typeof resource === 'object') {
    const { alt: altFromResource, height: fullHeight, url, width: fullWidth } = resource

    width = fullWidth!
    height = fullHeight!
    alt = altFromResource || ''
    const { focalX, focalY, focalPortraitX, focalPortraitY } = resource as {
      focalX?: number | null
      focalY?: number | null
      focalPortraitX?: number | null
      focalPortraitY?: number | null
    }
    if (typeof focalX === 'number' && typeof focalY === 'number') {
      focal['--id-focal'] = `${focalX}% ${focalY}%`
    }
    if (typeof focalPortraitX === 'number' && typeof focalPortraitY === 'number') {
      focal['--id-focal-portrait'] = `${focalPortraitX}% ${focalPortraitY}%`
    }

    const cacheTag = resource.updatedAt

    src = getMediaUrl(url, cacheTag)

    // Portrétový ořez: telefon na výšku jinak stahuje celý 21:9 master
    // a přes 75 % plochy zahodí (koš B). Zdroj je už oříznutý na fokál,
    // takže se NESMÍ ořezávat podruhé — proto `--id-focal-portrait: center`.
    const portrait = (resource as { portrait?: unknown }).portrait
    if (portrait && typeof portrait === 'object' && 'url' in portrait) {
      const p = portrait as { url?: string | null; updatedAt?: string | null }
      if (p.url) {
        portretSrc = getMediaUrl(p.url, p.updatedAt ?? cacheTag)
        focal['--id-focal-portrait'] = 'center'
      }
    }
  }

  const loading = loadingFromProps || (!priority ? 'lazy' : undefined)

  /*
    `sizes` popisuje, jak ŠIROKÝ bude slot na obrazovce — tedy délky (px, vw),
    nikdy deskriptory `w`. Původní generátor skládal `(max-width: 768px) 1536w`,
    což je syntakticky neplatné: prohlížeč celý atribut zahodil a spadl na
    100vw, takže do 880px slotu stahoval variantu pro 1920 px.

    Výchozí hodnota odpovídá mřížce článku (8.1): do tabletu plná šířka,
    nad ním obsahový sloupec. Hero a full-bleed si `100vw` předá samo.
  */
  const sizes = sizeFromProps ?? '(min-width: 1024px) 960px, (min-width: 768px) 90vw, 100vw'

  /* Deskriptory `w` pro <source>: Next optimalizuje i zdroj ze <source>,
     jen si o něj musíme říct sami — komponenta `next/image` umí jeden src.
     Šířky MUSÍ být z `deviceSizes` Nextu (640/750/828/1080/1200/1920/2048/
     3840), jinak optimalizátor vrátí 400 „width is not allowed". */
  const portretSrcSet = portretSrc
    ? [640, 750, 828, 1080, 1200]
        .map((w) => `/_next/image?url=${encodeURIComponent(portretSrc as string)}&w=${w}&q=72 ${w}w`)
        .join(', ')
    : undefined
  const hlavniSrcSet =
    typeof src === 'string' && src
      ? [640, 828, 1200, 1920, 2048, 3840]
          .map((w) => `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=72 ${w}w`)
          .join(', ')
      : undefined

  /*
    `priority` u next/image vloží preload na SVŮJ src — tedy na master,
    i když <source> nakonec vybere portrét, takže telefon stáhne obojí
    (naměřeno 142 kB navíc). S portrétovým zdrojem proto preload skládáme
    sami, po jednom pro každou větev <picture>, a komponentě necháváme
    jen `fetchPriority`.
  */
  const vlastniPreload = Boolean(portretSrcSet && priority)

  return (
    <picture className={cn(pictureClassName)}>
      {vlastniPreload ? (
        <>
          <link
            rel="preload"
            as="image"
            media="(orientation: portrait) and (max-width: 560px)"
            imageSizes="100vw"
            imageSrcSet={portretSrcSet}
            fetchPriority="high"
          />
          <link
            rel="preload"
            as="image"
            media="not all and (orientation: portrait) and (max-width: 560px)"
            imageSizes={sizes}
            imageSrcSet={hlavniSrcSet}
            fetchPriority="high"
          />
        </>
      ) : null}
      {portretSrcSet ? (
        <source media="(orientation: portrait) and (max-width: 560px)" sizes="100vw" srcSet={portretSrcSet} />
      ) : null}
      <NextImage
        alt={alt || ''}
        className={cn(imgClassName)}
        fill={fill}
        height={!fill ? height : undefined}
        placeholder="blur"
        blurDataURL={placeholderBlur}
        priority={vlastniPreload ? undefined : priority}
        fetchPriority={priority ? 'high' : undefined}
        quality={72}
        loading={loading}
        sizes={sizes}
        src={src}
        style={Object.keys(focal).length ? (focal as React.CSSProperties) : undefined}
        width={!fill ? width : undefined}
      />
    </picture>
  )
}
