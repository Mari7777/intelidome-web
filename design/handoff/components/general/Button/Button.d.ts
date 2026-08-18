import * as React from 'react';

/**
 * Button — from intelidome-ds@0.1.0.
 * @replaces button
 */
export interface ButtonProps {
  /** Visual style: `primary` (filled accent), `secondary` (gray pill), `ghost` (text-only accent). */
  variant?: "primary" | "secondary" | "ghost";
  /** Compact size for dense contexts. */
  size?: "md" | "sm";
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}

export declare const Button: React.ComponentType<ButtonProps>;
