import * as React from 'react';

/**
 * Badge — from intelidome-ds@0.1.0.
 */
export interface BadgeProps {
  /** Semantic tone: success (#1d8a4e), warn (#b76a00), danger (#c0392b), info (accent blue). */
  tone?: "success" | "warn" | "danger" | "info";
  children: React.ReactNode;
  className?: string;
  id?: string;
  style?: CSSProperties;
}

export declare const Badge: React.ComponentType<BadgeProps>;
