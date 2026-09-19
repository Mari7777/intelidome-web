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

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return relationTo === 'posts' ? `/posts/${slug}` : `/${slug}`
}

const jsxConverters: JSXConvertersFunction<NodeTypes> = ({ defaultConverters }) => ({
  ...defaultConverters,
  ...LinkJSXConverter({ internalDocToHref }),
  blocks: {
    banner: ({ node }) => <BannerBlock className="id-edge" {...node.fields} />,
    chapter: ({ node }) => <ChapterBlock {...node.fields} />,
    figure: ({ node }) => (
      <FigureBlock className={node.fields.layout ? undefined : 'id-edge'} {...node.fields} />
    ),
    statTiles: ({ node }) => <StatTilesBlock {...node.fields} />,
    split: ({ node }) => <SplitBlock {...node.fields} />,
    summaryBand: ({ node }) => <SummaryBandBlock {...node.fields} />,
    productBand: ({ node }) => <ProductBandBlock {...node.fields} />,
    ctaBand: ({ node }) => <CtaBandBlock {...node.fields} />,
    calculator: ({ node }) => <CalculatorBlock {...node.fields} />,
    faq: ({ node }) => <FaqBlock {...node.fields} />,
    table: ({ node }) => <TableBlock {...node.fields} />,
    ingredients: ({ node }) => <IngredientsBlock {...node.fields} />,
    mediaBlock: ({ node }) => (
      <MediaBlock
        className="id-edge"
        imgClassName="m-0"
        {...node.fields}
        captionClassName="mx-auto max-w-[48rem]"
        enableGutter={false}
        disableInnerContainer={true}
      />
    ),
    code: ({ node }) => <CodeBlock {...node.fields} />,
    cta: ({ node }) => <CallToActionBlock {...node.fields} />,
  },
})

type Props = {
  data: DefaultTypedEditorState
  enableGutter?: boolean
  enableProse?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export default function RichText(props: Props) {
  const { className, data, enableProse = true, enableGutter = true, ...rest } = props

  // Česká sazba: jednopísmenné předložky nesmí viset na konci řádku.
  // Děláme to nad daty, ne nad hotovým JSX — formátovací uzly zůstanou celé.
  const sazba = nezlomitelneMezeryVeStromu(data)

  return (
    <ConvertRichText
      converters={jsxConverters}
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
