Chip from intelidome-ds. Use via `window.IntelidomeDS.Chip` (bundle loaded from the root `_ds_bundle.js`).

Small neutral pill label (gray surface, hairline border) for feature
tags and meta info — e.g. „Bez nářadí" or „Zigbee 3.0".

## Props

```ts
interface ChipProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}
```

## Examples

### Default

```jsx
() => <Chip>Zigbee 3.0</Chip>
```

### FeatureRow

```jsx
() => (
  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
    <Chip>Bez nářadí</Chip>
    <Chip>Baterie 2× AA</Chip>
    <Chip>IP54</Chip>
    <Chip>Dosah 30 m</Chip>
  </div>
)
```
