'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView } from 'motion/react';
import Formula from '../Formula';
import D3Tree from '../D3Tree';
import { parseExpression, astToEml, astToLatex, treeToD3Hierarchy, resetIdCounter, EXAMPLE_EXPRESSIONS } from '@/lib/mathEngine';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

export default function PipelineSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [selectedExpr, setSelectedExpr] = useState('exp(x)');
  const [activeStep, setActiveStep] = useState(0); // 0: Expression, 1: AST, 2: EML
  const [parsed, setParsed] = useState(null);

  useEffect(() => {
    try {
      resetIdCounter();
      const ast = parseExpression(selectedExpr);
      const latexOrig = astToLatex(ast);
      const d3Ast = treeToD3Hierarchy(ast);

      resetIdCounter();
      const ast2 = parseExpression(selectedExpr);
      const eml = astToEml(ast2);
      const latexEml = astToLatex(eml);
      const d3Eml = treeToD3Hierarchy(eml);

      setParsed({ ast, eml, latexOrig, latexEml, d3Ast, d3Eml });
    } catch (e) {
      setParsed(null);
    }
  }, [selectedExpr]);

  const steps = [
    { label: 'Expression', color: '#e8e6f0' },
    { label: 'AST', color: '#22d3ee' },
    { label: 'EML Tree', color: '#6c63ff' },
  ];

  return (
    <section ref={ref} id="pipeline" className="section" style={{ maxWidth: '72rem' }}>
      <motion.div
        custom={0}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
        style={{ maxWidth: '48rem' }}
      >
        <span className="section-label">Transformation</span>
        <h2 style={{ marginBottom: '1.5rem' }}>Expression → AST → EML Tree</h2>
        <p style={{ marginBottom: '2.5rem' }}>
          Every mathematical expression passes through a transformation pipeline:
          first parsed into an Abstract Syntax Tree, then converted into a pure
          EML representation where every node is either a constant or an <em>eml</em> application.
        </p>
      </motion.div>

      {/* Expression picker */}
      <motion.div
        custom={1}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
        }}
      >
        {EXAMPLE_EXPRESSIONS.slice(0, 6).map((ex) => (
          <button
            key={ex.expr}
            onClick={() => { setSelectedExpr(ex.expr); setActiveStep(0); }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '0.5rem',
              border: `1px solid ${selectedExpr === ex.expr ? 'rgba(108,99,255,0.5)' : 'var(--border-subtle)'}`,
              background: selectedExpr === ex.expr ? 'rgba(108,99,255,0.12)' : 'var(--bg-card)',
              color: selectedExpr === ex.expr ? 'var(--accent-secondary)' : 'var(--text-secondary)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {ex.label}
          </button>
        ))}
      </motion.div>

      {/* Step indicator */}
      <motion.div
        custom={2}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          marginBottom: '2rem',
          justifyContent: 'center',
        }}
      >
        {steps.map((step, i) => (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setActiveStep(i)}
              style={{
                padding: '0.5rem 1.25rem',
                borderRadius: '2rem',
                border: `1px solid ${activeStep === i ? step.color + '50' : 'var(--border-subtle)'}`,
                background: activeStep === i ? step.color + '18' : 'transparent',
                color: activeStep === i ? step.color : 'var(--text-tertiary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                letterSpacing: '0.05em',
              }}
            >
              {step.label}
            </button>
            {i < steps.length - 1 && (
              <svg width="30" height="12" viewBox="0 0 30 12" style={{ margin: '0 0.25rem' }}>
                <path d="M2 6 L22 6 M18 2 L22 6 L18 10" stroke="var(--text-dim)" strokeWidth="1.5" fill="none" />
              </svg>
            )}
          </div>
        ))}
      </motion.div>

      {/* Main visualization area */}
      {parsed && (
        <motion.div
          custom={3}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={fadeUpVariants}
          style={{
            background: 'var(--bg-tertiary)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '1rem',
            padding: '2rem',
            minHeight: '420px',
          }}
        >
          {activeStep === 0 && (
            <motion.div
              key="expr"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              style={{ textAlign: 'center', paddingTop: '2rem' }}
            >
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                marginBottom: '2rem',
              }}>
                Original Expression
              </p>
              <div className="formula-card" style={{ display: 'inline-block', padding: '2rem 3rem' }}>
                <Formula tex={parsed.latexOrig} displayMode={true} />
              </div>
              <div style={{ marginTop: '2rem' }}>
                <button onClick={() => setActiveStep(1)} className="btn-primary">
                  Parse to AST →
                </button>
              </div>
            </motion.div>
          )}

          {activeStep === 1 && (
            <motion.div
              key="ast"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: '#22d3ee',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}>
                  Abstract Syntax Tree
                </p>
                <button onClick={() => setActiveStep(2)} className="btn-primary" style={{ fontSize: '0.75rem', padding: '0.5rem 1.25rem' }}>
                  Convert to EML →
                </button>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <D3Tree data={parsed.d3Ast} width={600} height={350} />
              </div>
            </motion.div>
          )}

          {activeStep === 2 && (
            <motion.div
              key="eml"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}>
                <p style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.7rem',
                  color: '#6c63ff',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}>
                  EML Tree
                </p>
                <div style={{
                  padding: '0.5rem 1rem',
                  background: 'rgba(108,99,255,0.1)',
                  borderRadius: '0.5rem',
                  border: '1px solid rgba(108,99,255,0.2)',
                }}>
                  <Formula tex={parsed.latexEml} displayMode={false} className="text-sm" />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <D3Tree data={parsed.d3Eml} width={600} height={350} />
              </div>
            </motion.div>
          )}
        </motion.div>
      )}
    </section>
  );
}
