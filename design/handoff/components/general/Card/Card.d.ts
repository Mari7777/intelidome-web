import * as React from 'react';

/**
 * Card — from intelidome-ds@0.1.0.
 */
export interface CardProps {
  /** Lift the card on hover (translate + larger shadow). */
  hover?: boolean;
  /** Slightly tinted (#fbfbfd) background instead of pure white. */
  tinted?: boolean;
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}

export declare const Card: React.ComponentType<CardProps>;
