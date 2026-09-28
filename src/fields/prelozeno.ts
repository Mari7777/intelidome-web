import type { CheckboxField } from 'payload'

/**
 * Jediný predikát existence překladu dokumentu (ADR-008, A4): lokalizovaný
 * checkbox na Posts a Pages. Čeština se nekontroluje (`zobrazitelny` ji
 * pouští vždy); ostatní jazyky jsou veřejné až po zaškrtnutí A zapnutí jazyka
 * v `LIVE_LOCALES`. Categories a Media pole nemají.
 */
export const prelozeno: CheckboxField = {
  name: 'prelozeno',
  type: 'checkbox',
  localized: true,
  defaultValue: false,
  label: 'Překlad hotový',
  admin: {
    position: 'sidebar',
    description:
      'Zaškrtněte, až je překlad v tomto jazyce úplný. Čeština se nekontroluje. Veřejné až po zapnutí jazyka v kódu (LIVE_LOCALES).',
  },
}
