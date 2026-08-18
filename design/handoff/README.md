## InteliDome conventions (read before styling)

**Setup.** No provider/wrapper needed — components are plain CSS-styled React.
All styling comes from the `styles.css` import closure (tokens + component CSS
in `_ds_bundle.css`). Fonts are the Apple system stack (`-apple-system` → SF Pro
on Apple devices, Helvetica/Arial elsewhere) — never add webfont imports.

**Styling idiom: CSS custom properties, not utility classes.** Components carry
their own `id-*` classes; for your own layout glue use inline styles or small
style blocks that reference the brand tokens:

| Token family | Names |
|---|---|
| Ink | `--id-ink` (#1d1d1f), `--id-ink-2` (#6e6e73 secondary), `--id-ink-3` (#86868b tertiary) |
| Surfaces | `--id-bg` (#fff), `--id-bg-2` (#f5f5f7 gray), `--id-bg-3` (#fbfbfd tinted), `--id-surface` |
| Brand | `--id-accent` (#0071e3), `--id-accent-deep`, `--id-accent-soft`, `--id-green`, `--id-warn`, `--id-danger` (+ `-soft` tints) |
| Lines/shadows | `--id-line`, `--id-line-soft`, `--id-shadow`, `--id-shadow-lg` |
| Type | `--id-f-display` (headings), `--id-f-body`, `--id-f-mono` |
| Geometry | `--id-r-card` (20px), `--id-r-md` (14px), `--id-r-sm`, `--id-r-pill` (980px), `--id-maxw` (1120px), `--id-ease` |

Headings you write yourself: `font-family: var(--id-f-display); font-weight: 600;
letter-spacing: -0.025em; line-height: 1.07; color: var(--id-ink)`. Body text
15–17px, secondary text in `--id-ink-2`. Page background is white (or
`--id-bg-2` for alternating sections); content max-width `--id-maxw`.

**Where the truth lives.** Read `styles.css` → `_ds_bundle.css` (tokens defined
at the top, every `id-*` class below). Per-component API: each `<Name>.d.ts`;
usage: each `<Name>.prompt.md`.

**Idiomatic build example** (product tile — verified preview):

```tsx
<Card hover style={{ maxWidth: 320 }}>
  <Badge tone="success">Skladem</Badge>
  <h3 style={{ margin: '12px 0 4px', fontFamily: 'var(--id-f-display)', fontWeight: 600 }}>
    InteliDome Pro most
  </h3>
  <p style={{ margin: '0 0 16px', color: 'var(--id-ink-2)', fontSize: 14 }}>
    Zigbee koordinátor pro až 128 zařízení
  </p>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
    <strong style={{ fontSize: 20, letterSpacing: '-0.02em' }}>2 990 Kč</strong>
    <Button size="sm">Do košíku</Button>
  </div>
</Card>
```

Components: Badge, Button, Callout, Card, Chip, Eyebrow, Input, SectionHeading.
Sections open with `SectionHeading` (eyebrow + title + lead). Actions are pill
`Button`s — primary filled accent, ghost for tertiary; never rectangular buttons.

# IntelidomeDS (intelidome-ds@0.1.0)

This design system is the published intelidome-ds React library, bundled as a single
browser global. All 8 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.IntelidomeDS`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.IntelidomeDS.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { Badge } = window.IntelidomeDS;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<Badge />);
```

## Tokens

29 CSS custom properties from intelidome-ds. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **color** (3): `--id-bg-2`, `--id-bg-3`, `--id-surface`
- **shadow** (2): `--id-shadow`, `--id-shadow-lg`
- **other** (24): `--id-bg`, `--id-ink`, `--id-ink-2`, …

## Components

### general
- `Badge` — Status pill with a soft tinted background  Skladem,
- `Button` — Pill-shaped action button in the InteliDome accent blue.
- `Callout` — Soft tinted highlight box with a leading tone dot  advice,
- `Card` — White surface card with a 20px radius, hairline border and the
- `Chip` — Small neutral pill label (gray surface, hairline border) for feature
- `Eyebrow` — Accent-blue kicker label with a leading dot, placed above section
- `Input` — Text field in the InteliDome form style: 14px radius, hairline
- `SectionHeading` — Standard InteliDome section opener: accent eyebrow, large display
