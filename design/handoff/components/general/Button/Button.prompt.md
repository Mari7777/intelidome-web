Button from intelidome-ds. Use via `window.IntelidomeDS.Button` (bundle loaded from the root `_ds_bundle.js`).

Pill-shaped action button in the InteliDome accent blue.
Primary = filled #0071e3, ghost = borderless accent text with a soft
hover wash, secondary = Apple-gray pill. 980px border radius.

## Props

```ts
interface ButtonProps {
  /** Visual style: `primary` (filled accent), `secondary` (gray pill), `ghost` (text-only accent). */
  variant?: "primary" | "secondary" | "ghost";
  /** Compact size for dense contexts. */
  size?: "md" | "sm";
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}
```

## Examples

### Primary

```jsx
() => <Button>Sestavit systém</Button>
```

### Variants

```jsx
() => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
    <Button variant="primary">Koupit most</Button>
    <Button variant="secondary">Porovnat</Button>
    <Button variant="ghost">Zjistit více</Button>
  </div>
)
```

### Small

```jsx
() => (
  <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
    <Button size="sm">Přidat ventil</Button>
    <Button size="sm" variant="ghost">Zrušit</Button>
  </div>
)
```

### Disabled

```jsx
() => <Button disabled>Vyprodáno</Button>
```
