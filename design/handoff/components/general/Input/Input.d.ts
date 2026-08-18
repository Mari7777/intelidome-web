import * as React from 'react';

/**
 * Input — from intelidome-ds@0.1.0.
 * @replaces input
 */
export interface InputProps {
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

export declare const Input: React.ComponentType<InputProps>;
