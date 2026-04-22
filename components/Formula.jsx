'use client';

import { useEffect, useRef } from 'react';
import katex from 'katex';

export default function Formula({ tex, displayMode = true, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current && tex) {
      try {
        katex.render(tex, ref.current, {
          displayMode,
          throwOnError: false,
          strict: false,
          trust: true,
          macros: {
            '\\eml': '\\text{eml}',
          },
        });
      } catch (e) {
        if (ref.current) {
          ref.current.textContent = tex;
        }
      }
    }
  }, [tex, displayMode]);

  return <span ref={ref} className={`formula-inline ${className}`} />;
}
