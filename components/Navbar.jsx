'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/#why-it-matters', label: 'Why' },
  { href: '/#core-operator', label: 'Operator' },
  { href: '/#grammar', label: 'Grammar' },
  { href: '/#pipeline', label: 'Pipeline' },
  { href: '/lab', label: 'Lab', highlight: true },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '0 1.5rem',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{
        maxWidth: '72rem',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '60px',
        padding: scrolled ? '0 1.5rem' : '0',
        background: scrolled ? 'rgba(10, 11, 15, 0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderRadius: scrolled ? '0 0 1rem 1rem' : '0',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.05)' : 'none',
        transition: 'all 0.3s ease',
      }}>
        <Link href="/" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '1rem',
            color: 'var(--accent-secondary)',
            letterSpacing: '-0.02em',
          }}>
            eml
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.6rem',
            color: 'var(--text-dim)',
            letterSpacing: '0.05em',
          }}>
            (x, y)
          </span>
        </Link>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                textDecoration: 'none',
                padding: '0.4rem 0.875rem',
                borderRadius: '0.375rem',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                fontWeight: 500,
                color: link.highlight ? 'white' : 'var(--text-secondary)',
                background: link.highlight ? 'var(--accent-primary)' : 'transparent',
                border: link.highlight ? 'none' : '1px solid transparent',
                transition: 'all 0.2s ease',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={(e) => {
                if (!link.highlight) {
                  e.target.style.color = 'var(--text-primary)';
                  e.target.style.background = 'rgba(255,255,255,0.04)';
                }
              }}
              onMouseLeave={(e) => {
                if (!link.highlight) {
                  e.target.style.color = 'var(--text-secondary)';
                  e.target.style.background = 'transparent';
                }
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
