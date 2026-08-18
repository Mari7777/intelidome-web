Input from intelidome-ds. Use via `window.IntelidomeDS.Input` (bundle loaded from the root `_ds_bundle.js`).

Text field in the InteliDome form style: 14px radius, hairline
border, accent focus ring (3px soft blue). Label 13px semibold,
hint 12px tertiary gray.

## Props

```ts
interface InputProps {
  /** Field label above the input. */
  label?: string;
  /** Helper text under the input (turns red in error state). */
  hint?: string;
  /** Error state: danger border + hint color. */
  error?: boolean;
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
  <Input label="E-mail" placeholder="jana@example.cz" type="email" />
)
```

### WithHint

```jsx
() => (
  <Input
    label="Průtok ventilu"
    placeholder="12"
    hint="Litry za minutu — najdete na štítku ventilu."
  />
)
```

### ErrorState

```jsx
() => (
  <Input
    label="PSČ"
    defaultValue="123"
    error
    hint="PSČ musí mít 5 číslic."
  />
)
```
