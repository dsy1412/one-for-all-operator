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

const decompositions = [
  {
    label: 'Exponential extraction',
    description: 'Set y = 1 to isolate the exponential:',
    formula: '\\text{eml}(x, 1) = e^x - \\ln(1) = e^x',
    color: '#22d3ee',
  },
  {
    label: 'Logarithmic extraction',
    description: 'Set x = 0 to expose the logarithm:',
    formula: '\\text{eml}(0, y) = e^0 - \\ln(y) = 1 - \\ln(y)',
    color: '#f59e0b',
  },
  {
    label: 'Identity value',
    description: 'At the origin, eml produces the unity constant:',
    formula: '\\text{eml}(0, 1) = e^0 - \\ln(1) = 1',
    color: '#34d399',
  },
];

export default function CoreOperatorSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="core-operator" className="section section-narrow">
      <motion.div
        custom={0}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
      >
        <span className="section-label">Definition</span>
        <h2 style={{ marginBottom: '1.5rem' }}>The Core Operator</h2>
        <p style={{ marginBottom: '2.5rem' }}>
          The EML operator combines the two most fundamental transcendental functions — the
          exponential and the natural logarithm — into a single asymmetric binary operation.
          Its simplicity is deceptive: from this one operator, every elementary function can be
          constructed.
        </p>
      </motion.div>

      {/* Main formula spotlight */}
      <motion.div
        custom={1}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
        className="formula-card glow-box"
        style={{
          marginBottom: '3rem',
          padding: '3rem 2rem',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--accent-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginBottom: '1rem',
        }}>
          Core Definition
        </p>
        <Formula
          tex={"\\text{eml}(x,\\, y) \\;\\triangleq\\; e^{x} - \\ln(y)"}
          displayMode={true}
        />
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.85rem',
          color: 'var(--text-tertiary)',
          marginTop: '1.25rem',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          An asymmetric binary operator embedding both exponential growth and logarithmic compression.
        </p>
      </motion.div>

      {/* Decomposition cards */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        {decompositions.map((item, i) => (
          <motion.div
            key={item.label}
            custom={i + 2}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariants}
            className="card"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1.2fr',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: item.color,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}>
                {item.label}
              </span>
              <p style={{ fontSize: '0.9rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
                {item.description}
              </p>
            </div>
            <div style={{
              padding: '1rem',
              background: 'rgba(0,0,0,0.3)',
              borderRadius: '0.75rem',
              textAlign: 'center',
              borderLeft: `2px solid ${item.color}30`,
            }}>
              <Formula tex={item.formula} displayMode={true} />
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
