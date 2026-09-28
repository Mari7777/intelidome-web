import { notFound } from 'next/navigation'

/** Cokoli, co nechytí konkrétní stránka pod `[locale]`, je 404 s hlavičkou a patičkou. */
export default function Rest() {
  notFound()
}
