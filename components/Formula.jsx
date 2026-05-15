'use client';

import { useMemo } from 'react';
import katex from 'katex';

const renderOptions = {
  throwOnError: false,
  strict: false,
  trust: true,
  macros: {
    '\\eml': '\\text{eml}',
  },
};

export default function Formula({ tex, displayMode = true, className = '' }) {
  const html = useMemo(() => {
    if (!tex) return '';

    try {
      return katex.renderToString(tex, {
        ...renderOptions,
        displayMode,
      });
    } catch {
      return '';
    }
  }, [tex, displayMode]);

  if (!html) {
    return <span className={`formula-inline ${className}`}>{tex}</span>;
  }

  return (
    <span
      className={`formula-inline ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
