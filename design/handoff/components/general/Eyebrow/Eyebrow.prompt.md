Eyebrow from intelidome-ds. Use via `window.IntelidomeDS.Eyebrow` (bundle loaded from the root `_ds_bundle.js`).

Accent-blue kicker label with a leading dot, placed above section
titles — e.g. „Chytrá závlaha". Pairs with SectionHeading.

## Props

```ts
interface EyebrowProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}
```

## Examples

### Default

```jsx
() => <Eyebrow>Chytrá závlaha</Eyebrow>
```

### AboveTitle

```jsx
() => (
  <div>
    <Eyebrow>Rádce zavlažování</Eyebrow>
    <h2
      style={{
        margin: '10px 0 0',
        fontFamily: 'var(--id-f-display)',
        fontWeight: 600,
        letterSpacing: '-0.025em',
        color: 'var(--id-ink)',
      }}
    >
      Kolik vody trávník opravdu potřebuje
    </h2>
  </div>
)
```
