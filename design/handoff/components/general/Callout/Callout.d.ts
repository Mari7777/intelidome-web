import * as React from 'react';

/**
 * Callout — from intelidome-ds@0.1.0.
 */
export interface CalloutProps {
  /** Semantic tone of the highlight box. */
  tone?: "success" | "warn" | "info";
  /** Optional bold first line. */
  title?: string;
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}

export declare const Callout: React.ComponentType<CalloutProps>;
