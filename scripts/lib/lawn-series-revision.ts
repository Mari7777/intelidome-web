import { optimizeLawnArticle } from './lawn-seo-content'
import { reviseSoilGuide } from './lawn-series-puda'
import { reviseAmendments } from './lawn-series-primesi'
import { revisePreparationArticle, reviseProfileArticle } from './lawn-series-practice'

/** Apply the same editorial text to the local seeds and to existing CMS articles. */
export const LAWN_SERIES_REVISIONS = {
  'krasny-travnik-zacina-pod-zemi-2': reviseSoilGuide,
  'pisek-biochar-a-dalsi-primesi': reviseAmendments,
  'kalkulator-na-planovani-pudniho-profilu': reviseProfileArticle,
  'jak-pripravit-a-ulozit-smes': revisePreparationArticle,
} as const

export type LawnSeriesSlug = keyof typeof LAWN_SERIES_REVISIONS

export const LAWN_SERIES_SLUGS = Object.keys(LAWN_SERIES_REVISIONS) as LawnSeriesSlug[]

export function reviseLawnArticle(slug: LawnSeriesSlug, content: unknown) {
  return optimizeLawnArticle(slug, LAWN_SERIES_REVISIONS[slug](content))
}
