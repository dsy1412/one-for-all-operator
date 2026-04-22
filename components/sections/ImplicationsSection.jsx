'use client';

import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import Link from 'next/link';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

const implications = [
  {
    icon: '🧠',
    title: 'Symbolic AI',
    description: 'A single operator as the computational primitive enables leaner symbolic reasoning systems with reduced rule complexity.',
    color: '#6c63ff',
  },
  {
    icon: '🔄',
    title: 'Uniform Representation',
    description: 'All elementary functions share the same tree grammar. No special-casing for trigonometric, exponential, or polynomial functions.',
    color: '#22d3ee',
  },
  {
    icon: '🔍',
    title: 'Differentiable Search',
    description: 'Continuous optimization over EML trees enables gradient-based symbolic regression, combining structure search with parameter fitting.',
    color: '#f59e0b',
  },
  {
    icon: '⚙️',
    title: 'Program Synthesis',
    description: 'Automatically generating mathematical programs becomes a structured tree search problem with known bounds on expressiveness.',
    color: '#f472b6',
  },
  {
    icon: '📊',
    title: 'Explainability',
    description: 'EML trees provide transparent, interpretable mathematical structures — every node has clear semantic meaning.',
    color: '#34d399',
  },
  {
    icon: '🧬',
    title: 'Structure Learning',
    description: 'Discovering the mathematical structure underlying data can be framed as EML tree architecture search.',
    color: '#a78bfa',
  },
];

export default function ImplicationsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="implications" className="section" style={{ maxWidth: '72rem' }}>
      <motion.div
        custom={0}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
        style={{ maxWidth: '48rem' }}
      >
        <span className="section-label">Impact</span>
        <h2 style={{ marginBottom: '1.5rem' }}>Research Implications</h2>
        <p style={{ marginBottom: '3rem' }}>
          The existence of a single universal operator for all elementary functions has
          far-reaching consequences across symbolic computation, machine learning,
          and mathematical foundations.
        </p>
      </motion.div>

      {/* Implications grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '1.25rem',
        marginBottom: '4rem',
      }}>
        {implications.map((item, i) => (
          <motion.div
            key={item.title}
            custom={i + 1}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            variants={fadeUpVariants}
            className="card"
            style={{ position: 'relative' }}
          >
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}>
              <span style={{
                fontSize: '1.5rem',
                lineHeight: 1,
                flexShrink: 0,
                marginTop: '0.1rem',
              }}>
                {item.icon}
              </span>
              <div>
                <h3 style={{
                  fontSize: '1rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  color: item.color,
                }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: '0.85rem', lineHeight: 1.6, margin: 0 }}>
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        custom={7}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
        style={{
          textAlign: 'center',
          padding: '3rem 2rem',
          background: 'linear-gradient(135deg, var(--bg-card) 0%, rgba(108,99,255,0.06) 100%)',
          borderRadius: '1.5rem',
          border: '1px solid var(--border-accent)',
        }}
      >
        <h3 style={{
          fontSize: '1.5rem',
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #e8e6f0 0%, #a78bfa 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Explore the Interactive Lab
        </h3>
        <p style={{
          maxWidth: '500px',
          margin: '0 auto 2rem',
          fontSize: '0.95rem',
        }}>
          Enter any mathematical expression and watch it transform into an EML tree
          in real time. Zoom, pan, and inspect every node.
        </p>
        <Link href="/lab" className="btn-primary" style={{ textDecoration: 'none', fontSize: '1rem', padding: '0.875rem 2.5rem' }}>
          Open Interactive Lab →
        </Link>
      </motion.div>
    </section>
  );
}
