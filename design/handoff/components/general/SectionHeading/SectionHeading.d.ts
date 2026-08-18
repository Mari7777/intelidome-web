import * as React from 'react';

/**
 * SectionHeading — from intelidome-ds@0.1.0.
 */
export interface SectionHeadingProps {
  /** Accent kicker above the title (rendered as Eyebrow). */
  eyebrow?: string;
  /** The section title (SF Pro Display, tight tracking, balanced wrap). */
  title: string;
  /** Optional lead paragraph under the title (secondary ink). */
  lead?: string;
  /** Heading level for the title element. Default h2. */
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
  style?: CSSProperties;
  children?: React.ReactNode;
}

export declare const SectionHeading: React.ComponentType<SectionHeadingProps>;
