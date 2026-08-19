import React from 'react'

const defaultLabels = {
  few: 'záznamy',
  plural: 'záznamů',
  singular: 'záznam',
}

const defaultCollectionLabels = {
  posts: {
    few: 'články',
    plural: 'článků',
    singular: 'článek',
  },
}

// Czech plural forms: 1 článek / 2–4 články / 5+ článků
const pluralize = (
  count: number,
  labels: { few?: string; plural?: string; singular?: string },
): string | undefined => {
  if (count === 1) return labels.singular
  if (count >= 2 && count <= 4) return labels.few ?? labels.plural
  return labels.plural
}

export const PageRange: React.FC<{
  className?: string
  collection?: keyof typeof defaultCollectionLabels
  collectionLabels?: {
    few?: string
    plural?: string
    singular?: string
  }
  currentPage?: number
  limit?: number
  totalDocs?: number
}> = (props) => {
  const {
    className,
    collection,
    collectionLabels: collectionLabelsFromProps,
    currentPage,
    limit,
    totalDocs,
  } = props

  let indexStart = (currentPage ? currentPage - 1 : 1) * (limit || 1) + 1
  if (totalDocs && indexStart > totalDocs) indexStart = 0

  let indexEnd = (currentPage || 1) * (limit || 1)
  if (totalDocs && indexEnd > totalDocs) indexEnd = totalDocs

  const labels =
    collectionLabelsFromProps ||
    (collection ? defaultCollectionLabels[collection] : undefined) ||
    defaultLabels

  return (
    <div className={[className, 'font-semibold'].filter(Boolean).join(' ')}>
      {(typeof totalDocs === 'undefined' || totalDocs === 0) && 'Nic jsme nenašli.'}
      {typeof totalDocs !== 'undefined' &&
        totalDocs > 0 &&
        `Zobrazeno ${indexStart}${indexStart > 0 ? `–${indexEnd}` : ''} z ${totalDocs} ${
          pluralize(totalDocs, labels) ?? ''
        }`}
    </div>
  )
}
