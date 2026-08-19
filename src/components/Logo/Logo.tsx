import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  loading?: 'lazy' | 'eager'
  priority?: 'auto' | 'high' | 'low'
}

// Text wordmark — the design handoff ships no logo asset.
export const Logo = (props: Props) => {
  const { className } = props

  return (
    <span
      className={clsx(
        'font-display text-xl font-semibold tracking-tight text-[var(--id-ink)]',
        className,
      )}
    >
      Inteli<span className="text-[var(--id-accent)]">Dome</span>
    </span>
  )
}
