import { MediaBlock } from '@/blocks/MediaBlock/Component'
import {
  DefaultNodeTypes,
  SerializedBlockNode,
  SerializedLinkNode,
  type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'

import { CodeBlock, CodeBlockProps } from '@/blocks/Code/Component'

import type {
  BannerBlock as BannerBlockProps,
  CallToActionBlock as CTABlockProps,
  ChapterBlock as ChapterBlockProps,
  CalculatorBlock as CalculatorBlockProps,
  CtaBandBlock as CtaBandBlockProps,
  FaqBlock as FaqBlockProps,
  FigureBlock as FigureBlockProps,
  MediaBlock as MediaBlockProps,
  ProductBandBlock as ProductBandBlockProps,
  SplitBlock as SplitBlockProps,
  StatTilesBlock as StatTilesBlockProps,
  SummaryBandBlock as SummaryBandBlockProps,
  TableBlock as TableBlockProps,
  IngredientsBlock as IngredientsBlockProps,
} from '@/payload-types'
import { BannerBlock } from '@/blocks/Banner/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { ChapterBlock } from '@/blocks/Chapter/Component'
import { CalculatorBlock } from '@/blocks/Calculator/Component'
import { CtaBandBlock } from '@/blocks/CtaBand/Component'
import { FaqBlock } from '@/blocks/Faq/Component'
import { FigureBlock } from '@/blocks/Figure/Component'
import { ProductBandBlock } from '@/blocks/ProductBand/Component'
import { SplitBlock } from '@/blocks/Split/Component'
import { StatTilesBlock } from '@/blocks/StatTiles/Component'
import { SummaryBandBlock } from '@/blocks/SummaryBand/Component'
import { TableBlock } from '@/blocks/Table/Component'
import { IngredientsBlock } from '@/blocks/Ingredients/Component'
import { nezlomitelneMezeryVeStromu } from '@/utilities/czechTypography'
import { cn } from '@/utilities/ui'

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | CTABlockProps
      | MediaBlockProps
      | BannerBlockProps
      | CodeBlockProps
      | ChapterBlockProps
      | FigureBlockProps
      | SplitBlockProps
      | StatTilesBlockProps
      | SummaryBandBlockProps
      | ProductBandBlockProps
      | CalculatorBlockProps
      | CtaBandBlockProps
      | FaqBlockProps
      | TableBlockProps
      | IngredientsBlockProps
    >

import type { Locale } from '@/i18n/config'
import { lokalizujCestu } from '@/i18n/routing'

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

/**
 * Konvertory pro daný jazyk (A13): interní i vlastní odkazy začínající `/`
 * dostanou prefix, bloky s vlastním textem/odkazy dostanou `locale`.
 * Jedna instance na jazyk — RichText je sdílený server/klient modul, takže
 * místo hooku drží memo modulová mapa.
 */
const vytvorKonvertory = (locale: Locale): JSXConvertersFunction<NodeTypes> => {
  // Z knihovny zůstává jen `autolink` (externí adresy); `link` je vlastní.
  const odkazy = LinkJSXConverter({ internalDocToHref })
  return ({ defaultConverters }) => ({
    ...defaultConverters,
    ...odkazy,
    // Vlastní `link` (ne obal knihovního): interní i vlastní `/…` prefixovat, výstup stejný.
    link: ({ node, nodesToJSX }) => {
      const children = nodesToJSX({ nodes: node.children })
      const rel = node.fields.newTab ? 'noopener noreferrer' : undefined
      const target = node.fields.newTab ? '_blank' : undefined
      const href =
        node.fields.linkType === 'internal'
          ? internalDocToHref({ linkNode: node })
          : (node.fields.url ?? '')
      return (
        <a href={lokalizujCestu(href, locale)} rel={rel} target={target}>
          {children}
        </a>
      )
    },
    blocks: {
      banner: ({ node }) => <BannerBlock className="id-edge" {...node.fields} locale={locale} />,
      chapter: ({ node }) => <ChapterBlock {...node.fields} />,
      figure: ({ node }) => (
        <FigureBlock className={node.fields.layout ? undefined : 'id-edge'} {...node.fields} />
      ),
      statTiles: ({ node }) => <StatTilesBlock {...node.fields} />,
      split: ({ node }) => <SplitBlock {...node.fields} locale={locale} />,
      summaryBand: ({ node }) => <SummaryBandBlock {...node.fields} />,
      productBand: ({ node }) => <ProductBandBlock {...node.fields} />,
      ctaBand: ({ node }) => <CtaBandBlock {...node.fields} locale={locale} />,
      calculator: ({ node }) => <CalculatorBlock {...node.fields} />,
      faq: ({ node }) => <FaqBlock {...node.fields} locale={locale} />,
      table: ({ node }) => <TableBlock {...node.fields} />,
      ingredients: ({ node }) => <IngredientsBlock {...node.fields} locale={locale} />,
      mediaBlock: ({ node }) => (
        <MediaBlock
          className="id-edge"
          imgClassName="m-0"
          {...node.fields}
          captionClassName="mx-auto max-w-[48rem]"
          enableGutter={false}
          disableInnerContainer={true}
          locale={locale}
        />
      ),
      code: ({ node }) => <CodeBlock {...node.fields} />,
      cta: ({ node }) => <CallToActionBlock {...node.fields} locale={locale} />,
    },
  })
}

const konvertory = new Map<Locale, JSXConvertersFunction<NodeTypes>>()
const konvertoryPro = (locale: Locale) => {
  let k = konvertory.get(locale)
  if (!k) {
    k = vytvorKonvertory(locale)
    konvertory.set(locale, k)
  }
  return k
}

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
  /** Povinný: modul je sdílený server/klient, hook by v RSC grafu nešel (A10). */
  locale: Locale
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, data, enableProse = true, enableGutter = true, locale, ...rest } = props

  // Česká sazba: jednopísmenné předložky nesmí viset na konci řádku.
  // Děláme to nad daty, ne nad hotovým JSX — formátovací uzly zůstanou celé.
  const sazba = nezlomitelneMezeryVeStromu(data)

  return (
    <ConvertRichText
      converters={konvertoryPro(locale)}
      data={sazba}
      className={cn(
        'payload-richtext',
        {
          container: enableGutter,
          'max-w-none': !enableGutter,
          'mx-auto prose md:prose-md dark:prose-invert': enableProse,
        },
        className,
      )}
      {...rest}
    />
  )
}
