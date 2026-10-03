import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import { LOCALES } from '@/i18n/config'
import { cestaMagazinu, interniCesty } from '@/i18n/routing'

/**
 * Témata magazínu jsou kategorie (DESIGN.md 8.5): změna názvu, popisu nebo
 * příznaku série mění domovskou stránku magazínu, stránkování, eyebrow hera
 * všech článků tématu a chipy karet na úvodu. 'layout' nad `/{l}/magazin`
 * pokryje celý podstrom route stromu (A14: cesty s prefixem jazyka).
 */
const revalidujMagazin = () => {
  for (const kod of LOCALES) revalidatePath('/' + kod + cestaMagazinu(), 'layout')
  for (const cesta of interniCesty('pages', 'home')) revalidatePath(cesta)
}

export const revalidateMagazinPoKategorii: CollectionAfterChangeHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidujMagazin()
  return doc
}

export const revalidateMagazinPoSmazaniKategorie: CollectionAfterDeleteHook = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) revalidujMagazin()
  return doc
}
