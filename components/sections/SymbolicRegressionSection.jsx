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

export default function SymbolicRegressionSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section ref={ref} id="symbolic-regression" className="section section-narrow">
      <motion.div
        custom={0}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
      >
        <span className="section-label">Applications</span>
        <h2 style={{ marginBottom: '1.5rem' }}>Symbolic Regression Perspective</h2>
        <p style={{ marginBottom: '2.5rem' }}>
          Because every expression in EML form is a binary tree with a uniform structure,
          these trees can be treated as <em>trainable computation graphs</em>. This opens
          the door to gradient-based symbolic regression — searching over mathematical
          expressions using the same optimization techniques that power deep learning.
        </p>
      </motion.div>

      {/* Computation graph concept */}
      <motion.div
        custom={1}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
      >
        <div className="card" style={{ borderTop: '2px solid rgba(108,99,255,0.3)' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(108,99,255,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            fontSize: '1.2rem',
          }}>
            🌳
          </div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Uniform Structure</h3>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
            Every expression is a binary tree. No special nodes, no variable-arity
            functions. The search space becomes structurally homogeneous.
          </p>
        </div>

        <div className="card" style={{ borderTop: '2px solid rgba(245,158,11,0.3)' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(245,158,11,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            fontSize: '1.2rem',
          }}>
            ∇
          </div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Differentiable</h3>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
            Since eml is composed of exp and ln — both smooth and differentiable —
            gradients flow through the entire tree. Backpropagation works naturally.
          </p>
        </div>

        <div className="card" style={{ borderTop: '2px solid rgba(52,211,153,0.3)' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '10px',
            background: 'rgba(52,211,153,0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            fontSize: '1.2rem',
          }}>
            📐
          </div>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>Trainable Parameters</h3>
          <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>
            Leaf constants become learnable parameters. The tree depth controls
            expressiveness. Structure search meets continuous optimization.
          </p>
        </div>
      </motion.div>

      {/* Optimization flow */}
      <motion.div
        custom={2}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
        style={{
          background: 'var(--bg-tertiary)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '1rem',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
          letterSpacing: '0.15em',
          marginBottom: '1.5rem',
        }}>
          Optimization Pipeline
        </p>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          flexWrap: 'wrap',
        }}>
          {[
            { label: 'EML Tree', color: '#6c63ff' },
            { label: 'Forward Pass', color: '#22d3ee' },
            { label: 'Loss Computation', color: '#f472b6' },
            { label: 'Backpropagation', color: '#f59e0b' },
            { label: 'Parameter Update', color: '#34d399' },
          ].map((step, i, arr) => (
            <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{
                padding: '0.5rem 1rem',
                borderRadius: '0.5rem',
                background: `${step.color}12`,
                border: `1px solid ${step.color}30`,
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: step.color,
                whiteSpace: 'nowrap',
              }}>
                {step.label}
              </span>
              {i < arr.length - 1 && (
                <svg width="20" height="12" viewBox="0 0 20 12">
                  <path d="M2 6 L14 6 M10 2 L14 6 L10 10" stroke="var(--text-dim)" strokeWidth="1.5" fill="none" />
                </svg>
              )}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '1.5rem' }}>
          <Formula
            tex={"\\theta^{(t+1)} = \\theta^{(t)} - \\eta \\, \\nabla_{\\theta} \\, \\mathcal{L}\\bigl(\\text{eml}_{\\theta}(x),\\, y\\bigr)"}
            displayMode={true}
          />
        </div>
      </motion.div>
    </section>
  );
}
