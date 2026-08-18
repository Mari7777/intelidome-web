Callout from intelidome-ds. Use via `window.IntelidomeDS.Callout` (bundle loaded from the root `_ds_bundle.js`).

Soft tinted highlight box with a leading tone dot — advice,
tips and warnings inside guide pages (e.g. watering advice
in „Rádce zavlažování").

## Props

```ts
interface CalloutProps {
  /** Semantic tone of the highlight box. */
  tone?: "success" | "warn" | "info";
  /** Optional bold first line. */
  title?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}
```

## Examples

### Info

```jsx
() => (
  <Callout tone="info" title="Tip" style={{ maxWidth: 460 }}>
    Zalévejte brzy ráno — odpar je nejnižší a voda se dostane ke kořenům.
  </Callout>
)
```

### Success

```jsx
() => (
  <Callout tone="success" style={{ maxWidth: 460 }}>
    Most je připojený a všechny ventily jsou online.
  </Callout>
)
```

### Warn

```jsx
() => (
  <Callout tone="warn" title="Pozor na mráz" style={{ maxWidth: 460 }}>
    Před zimou vypusťte rozvody — zamrzlá voda může poškodit ventily.
  </Callout>
)
```
