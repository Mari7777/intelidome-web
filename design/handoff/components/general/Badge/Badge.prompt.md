Badge from intelidome-ds. Use via `window.IntelidomeDS.Badge` (bundle loaded from the root `_ds_bundle.js`).

Status pill with a soft tinted background — „Skladem",
„Poslední kusy", „Vyprodáno", „Novinka". Colors follow the
site's semantic palette.

## Props

```ts
interface BadgeProps {
  /** Semantic tone: success (#1d8a4e), warn (#b76a00), danger (#c0392b), info (accent blue). */
  tone?: "success" | "warn" | "danger" | "info";
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}
```

## Examples

### Tones

```jsx
() => (
  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
    <Badge tone="success">Skladem</Badge>
    <Badge tone="warn">Poslední kusy</Badge>
    <Badge tone="danger">Vyprodáno</Badge>
    <Badge tone="info">Novinka</Badge>
  </div>
)
```

### Single

```jsx
() => <Badge tone="success">Skladem — odesíláme do 24 h</Badge>
```
