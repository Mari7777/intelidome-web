/** Small Lexical helpers shared by the approved editorial revision of the lawn series. */
export type ArticleNode = { type: string; version: number; [key: string]: any }
export type ArticleDocument = {
  root: {
    type: string
    children: ArticleNode[]
    direction: 'ltr' | 'rtl' | null
    format: 'left' | 'start' | 'center' | 'right' | 'end' | 'justify' | ''
    indent: number
    version: number
    [key: string]: any
  }
  [key: string]: any
}

export function cloneDocument(input: unknown): ArticleDocument {
  const doc = structuredClone(input) as ArticleDocument
  if (!Array.isArray(doc?.root?.children)) throw new Error('Expected a Lexical article document')
  return doc
}

const text = (value: string, format = 0): ArticleNode => ({
  type: 'text', text: value, format, detail: 0, mode: 'normal', style: '', version: 1,
})

function inline(markdown: string, format = 0): ArticleNode[] {
  const nodes: ArticleNode[] = []
  const pattern = /\[([^\]]+)\]\(([^\s)]+)\)|\*\*([^*]+)\*\*/g
  let last = 0
  for (const match of markdown.matchAll(pattern)) {
    if (match.index! > last) nodes.push(text(markdown.slice(last, match.index), format))
    if (match[1]) nodes.push({
      type: 'link', children: inline(match[1], format), direction: 'ltr', format: '', indent: 0,
      version: 2, fields: { linkType: 'custom', newTab: false, url: match[2] },
    })
    else nodes.push(text(match[3], format | 1))
    last = match.index! + match[0].length
  }
  if (last < markdown.length) nodes.push(text(markdown.slice(last), format))
  return nodes.length ? nodes : [text('')]
}

export const paragraph = (markdown: string): ArticleNode => ({
  type: 'paragraph', children: inline(markdown), direction: 'ltr', format: '', indent: 0,
  textFormat: 0, version: 1,
})

export const block = (fields: Record<string, unknown>): ArticleNode => ({
  type: 'block', fields, format: '', version: 2,
})

export function setFaq(doc: ArticleDocument, question: string, markdown: string): void {
  const faq = doc.root.children.find((node) => node.fields?.blockType === 'faq')
  const item = faq?.fields.items.find((entry: any) => entry.question === question)
  if (!item) throw new Error(`Expected FAQ question: ${question}`)
  item.answer = {
    root: { type: 'root', children: [paragraph(markdown)], direction: 'ltr', format: '', indent: 0, version: 1 },
  }
}

export function renumberFigures(doc: ArticleDocument): void {
  let number = 0
  for (const node of doc.root.children) {
    const fields = node.fields
    if (['split', 'figure'].includes(fields?.blockType) && fields.number) {
      fields.number = String(++number).padStart(2, '0')
      if (fields.blockType === 'figure') fields.blockName = `Obr. ${fields.number}`
    }
  }
}
