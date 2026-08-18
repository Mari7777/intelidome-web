SectionHeading from intelidome-ds. Use via `window.IntelidomeDS.SectionHeading` (bundle loaded from the root `_ds_bundle.js`).

Standard InteliDome section opener: accent eyebrow, large display
title (clamp 28–40px, -0.025em tracking) and an optional lead in
secondary gray. Max width 640px, left-aligned.

## Props

```ts
interface SectionHeadingProps {
  /** Accent kicker above the title (rendered as Eyebrow). */
  eyebrow?: string;
  /** The section title (SF Pro Display, tight tracking, balanced wrap). */
  title: string;
  /** Optional lead paragraph under the title (secondary ink). */
  lead?: string;
  /** Heading level for the title element. Default h2. */
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}
```

## Examples

### Default

```jsx
() => (
  <SectionHeading
    eyebrow="Chytrá závlaha"
    title="Zavlažujte přesně, ne od oka"
    lead="InteliDome řídí každý ventil podle plánů, počasí a vlhkosti půdy — voda teče, jen když má."
  />
)
```

### TitleOnly

```jsx
() => (
  <SectionHeading title="Jak vybrat kapkovou závlahu" />
)
```

### Hero

```jsx
() => (
  <SectionHeading
    as="h1"
    eyebrow="InteliDome"
    title="Zahrada, která se zalévá sama"
    lead="Postavte si chytrý závlahový systém za jedno odpoledne."
  />
)
```
