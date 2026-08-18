Card from intelidome-ds. Use via `window.IntelidomeDS.Card` (bundle loaded from the root `_ds_bundle.js`).

White surface card with a 20px radius, hairline border and the
signature soft shadow (0 4px 24px). The basic building block of
InteliDome pages — content sections, product tiles, feature grids.

## Props

```ts
interface CardProps {
  /** Lift the card on hover (translate + larger shadow). */
  hover?: boolean;
  /** Slightly tinted (#fbfbfd) background instead of pure white. */
  tinted?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}
```

## Examples

### Default

```jsx
() => (
  <Card style={{ maxWidth: 380 }}>
    <h3 style={{ margin: '0 0 8px', fontFamily: 'var(--id-f-display)', fontWeight: 600 }}>
      Plánování podle počasí
    </h3>
    <p style={{ margin: 0, color: 'var(--id-ink-2)', fontSize: 15, lineHeight: 1.5 }}>
      Most InteliDome posune zálivku, když má pršet — trávník dostane vodu jen
      tehdy, kdy ji potřebuje.
    </p>
  </Card>
)
```

### ProductTile

```jsx
() => (
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
)
```

### Tinted

```jsx
() => (
  <Card tinted style={{ maxWidth: 380 }}>
    <p style={{ margin: 0, fontSize: 15, color: 'var(--id-ink-2)' }}>
      Jemně tónovaný povrch pro sekundární obsah (#fbfbfd).
    </p>
  </Card>
)
```
