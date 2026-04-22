'use client';

import HeroSection from '@/components/sections/HeroSection';
import WhyItMattersSection from '@/components/sections/WhyItMattersSection';
import CoreOperatorSection from '@/components/sections/CoreOperatorSection';
import GrammarSection from '@/components/sections/GrammarSection';
import PipelineSection from '@/components/sections/PipelineSection';
import SymbolicRegressionSection from '@/components/sections/SymbolicRegressionSection';
import ImplicationsSection from '@/components/sections/ImplicationsSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
      <div className="section-divider" />
      <WhyItMattersSection />
      <div className="section-divider" />
      <CoreOperatorSection />
      <div className="section-divider" />
      <GrammarSection />
      <div className="section-divider" />
      <PipelineSection />
      <div className="section-divider" />
      <SymbolicRegressionSection />
      <div className="section-divider" />
      <ImplicationsSection />

      {/* Footer with Paper Attribution */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '3rem 1.5rem 2rem',
      }}>
        <div style={{
          maxWidth: '48rem',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '1.5rem',
        }}>
          {/* Paper credit */}
          <div style={{
            padding: '1.25rem 2rem',
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '0.75rem',
            textAlign: 'center',
            maxWidth: '560px',
            width: '100%',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--accent-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.15em',
              marginBottom: '0.75rem',
            }}>
              Based on the Original Research
            </p>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              lineHeight: 1.5,
              marginBottom: '0.5rem',
              fontWeight: 600,
            }}>
              &ldquo;All elementary functions from a single binary operator&rdquo;
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-tertiary)',
              marginBottom: '0.75rem',
            }}>
              arXiv:2603.21852 · Computer Science · Symbolic Computation · 2026
            </p>
            <a
              href="https://arxiv.org/abs/2603.21852"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'var(--accent-secondary)',
                textDecoration: 'none',
                padding: '0.35rem 0.85rem',
                borderRadius: '0.375rem',
                border: '1px solid rgba(108,99,255,0.25)',
                background: 'rgba(108,99,255,0.06)',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(108,99,255,0.15)';
                e.target.style.borderColor = 'rgba(108,99,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(108,99,255,0.06)';
                e.target.style.borderColor = 'rgba(108,99,255,0.25)';
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
              Read paper on arXiv
            </a>
          </div>

          {/* Branding line */}
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-dim)',
              margin: '0 0 0.35rem',
              lineHeight: 1.5,
            }}>
              <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>All-in-One</span>{' '}
              · An interactive visualization inspired by the paper above
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--text-dim)',
              margin: 0,
              opacity: 0.6,
            }}>
              This is a fan-made educational project, not affiliated with the original author.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
