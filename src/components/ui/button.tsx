'use client'

import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

// InteliDome DS: buttons are always pills (--id-r-pill), never rectangular.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--id-r-pill)] text-[15px] font-medium tracking-[-0.01em] transition-[color,background-color,box-shadow] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 [&_svg]:shrink-0 ring-ring/10 outline-ring/50 focus-visible:ring-4 focus-visible:outline-1 aria-invalid:focus-visible:ring-0",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-[var(--id-accent-deep)]',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-[var(--id-line)] bg-background hover:bg-[var(--id-bg-2)]',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-[#ebebf0]',
        ghost: 'text-accent hover:bg-accent-soft',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        clear: '',
        default: 'h-11 px-6 has-[>svg]:px-5',
        sm: 'h-9 px-[18px] has-[>svg]:px-4',
        lg: 'h-12 px-8 has-[>svg]:px-6',
        icon: 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, ...props }) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
