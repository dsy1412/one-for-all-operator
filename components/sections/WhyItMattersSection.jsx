'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Formula from '../Formula';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

const comparisonData = [
  {
    title: 'Boolean Logic',
    subtitle: 'NAND Gate',
    icon: '⊼',
    color: '#22d3ee',
    description: 'A single NAND gate can construct every Boolean function. This concept of functional completeness is well established in discrete mathematics.',
    formula: '\\text{NAND}(a, b) = \\neg(a \\wedge b)',
  },
  {
    title: 'Continuous Mathematics',
    subtitle: 'EML Operator',
    icon: 'ε',
    color: '#6c63ff',
    description: 'The EML operator achieves functional completeness for all elementary functions in continuous mathematics — exponential, logarithmic, trigonometric, and algebraic.',
    formula: '\\text{eml}(x, y) = e^x - \\ln(y)',
  },
];

export default function WhyItMattersSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="why-it-matters" className="section section-narrow" style={{ paddingTop: 'var(--section-padding)', paddingBottom: 'var(--section-padding)' }}>
      <motion.div
        custom={0}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
      >
        <span className="section-label">Context</span>
        <h2 style={{ marginBottom: '1.5rem' }}>Why This Matters</h2>
        <p style={{ marginBottom: '3rem' }}>
          In Boolean logic, a single gate — NAND — can express every possible logical function.
          This is called <em>functional completeness</em>. For continuous mathematics, achieving the
          same with a single operator for all elementary functions has long been considered impossible.
          The EML operator proves otherwise.
        </p>
      </motion.div>

      {/* Comparison Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '3rem',
      }}>
        {comparisonData.map((item, i) => (
          <motion.div
            key={item.title}
            custom={i + 1}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariants}
            className="card"
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${item.color}, transparent)`,
            }} />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
            }}>
              <span style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: `${item.color}15`,
                border: `1px solid ${item.color}30`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                color: item.color,
                fontWeight: 700,
              }}>
                {item.icon}
              </span>
              <div>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{item.title}</h3>
                <span style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: item.color,
                  letterSpacing: '0.05em',
                }}>
                  {item.subtitle}
                </span>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.65, marginBottom: '1.25rem' }}>
              {item.description}
            </p>
            <div style={{
              padding: '1rem',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '0.5rem',
              textAlign: 'center',
            }}>
              <Formula tex={item.formula} displayMode={true} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Reduction Visual */}
      <motion.div
        custom={3}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
        style={{
          textAlign: 'center',
          padding: '2rem',
          borderRadius: '1rem',
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.75rem',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '1.5rem',
        }}>
          Operator Reduction
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          flexWrap: 'wrap',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            gap: '0.5rem',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
            {['+', '−', '×', '÷', 'exp', 'ln', 'sin', 'cos', 'tan', 'xⁿ', '√'].map((op, i) => (
              <span key={i} style={{
                padding: '0.3rem 0.6rem',
                borderRadius: '0.375rem',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                fontSize: '0.8rem',
              }}>
                {op}
              </span>
            ))}
          </span>
          <svg width="40" height="20" viewBox="0 0 40 20">
            <path d="M5 10 L30 10 M25 5 L30 10 L25 15" stroke="var(--accent-primary)" strokeWidth="2" fill="none" />
          </svg>
          <span style={{
            padding: '0.5rem 1.25rem',
            borderRadius: '0.5rem',
            background: 'rgba(108,99,255,0.15)',
            border: '1px solid rgba(108,99,255,0.3)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 600,
            color: 'var(--accent-secondary)',
            fontSize: '1rem',
            boxShadow: '0 0 20px rgba(108,99,255,0.15)',
          }}>
            eml
          </span>
        </div>
      </motion.div>
    </section>
  );
}
