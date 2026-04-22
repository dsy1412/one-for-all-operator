'use client';

import { useRef, useState, useCallback } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import Formula from '../Formula';

const fadeUpVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] },
  }),
};

// Grammar tree expansion logic
function createGrammarNode(depth = 0, maxDepth = 3) {
  return {
    id: Math.random().toString(36).substr(2, 9),
    symbol: 'S',
    expanded: false,
    depth,
    maxDepth,
  };
}

function GrammarTree({ node, onExpand, depth = 0 }) {
  const isLeaf = node.expanded && node.isTerminal;
  const hasChildren = node.expanded && !node.isTerminal;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <motion.div
        layout
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onClick={() => !node.expanded && onExpand(node.id)}
        style={{
          width: node.expanded ? (node.isTerminal ? '36px' : '48px') : '42px',
          height: node.expanded ? (node.isTerminal ? '36px' : '48px') : '42px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: node.isTerminal ? '0.75rem' : '0.85rem',
          fontWeight: 600,
          cursor: node.expanded ? 'default' : 'pointer',
          background: node.isTerminal
            ? 'rgba(52,211,153,0.12)'
            : node.expanded
              ? 'rgba(108,99,255,0.15)'
              : 'rgba(108,99,255,0.08)',
          border: `1.5px solid ${
            node.isTerminal
              ? 'rgba(52,211,153,0.4)'
              : node.expanded
                ? 'rgba(108,99,255,0.4)'
                : 'rgba(108,99,255,0.2)'
          }`,
          color: node.isTerminal ? '#34d399' : '#a78bfa',
          transition: 'all 0.2s ease',
          boxShadow: !node.expanded ? '0 0 12px rgba(108,99,255,0.15)' : 'none',
          position: 'relative',
        }}
      >
        {node.isTerminal ? node.value : node.expanded ? 'eml' : 'S'}
        {!node.expanded && (
          <span style={{
            position: 'absolute',
            bottom: '-18px',
            fontSize: '0.55rem',
            color: 'var(--text-dim)',
            whiteSpace: 'nowrap',
          }}>
            click
          </span>
        )}
      </motion.div>

      {hasChildren && (
        <div style={{ position: 'relative', marginTop: '0.5rem' }}>
          {/* Connector lines */}
          <svg width="120" height="30" viewBox="0 0 120 30" style={{ display: 'block', margin: '0 auto' }}>
            <line x1="60" y1="0" x2="25" y2="28" stroke="rgba(108,99,255,0.2)" strokeWidth="1.5" />
            <line x1="60" y1="0" x2="95" y2="28" stroke="rgba(108,99,255,0.2)" strokeWidth="1.5" />
          </svg>
          <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
            {node.children.map((child) => (
              <GrammarTree key={child.id} node={child} onExpand={onExpand} depth={depth + 1} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function GrammarSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const [tree, setTree] = useState(createGrammarNode());

  const handleExpand = useCallback((nodeId) => {
    setTree((prev) => expandNode(prev, nodeId));
  }, []);

  const handleReset = useCallback(() => {
    setTree(createGrammarNode());
  }, []);

  return (
    <section ref={ref} id="grammar" className="section section-narrow">
      <motion.div
        custom={0}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
      >
        <span className="section-label">Formal System</span>
        <h2 style={{ marginBottom: '1.5rem' }}>Grammar & Recursive Structure</h2>
        <p style={{ marginBottom: '2rem' }}>
          The entire system can be described by a remarkably simple grammar.
          Every expression in the EML language is either the base constant <strong>1</strong>,
          or a recursive application of the <em>eml</em> operator to two sub-expressions.
        </p>
      </motion.div>

      {/* Grammar rule */}
      <motion.div
        custom={1}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={fadeUpVariants}
        className="formula-card"
        style={{ marginBottom: '2.5rem', padding: '2rem' }}
      >
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          color: 'var(--accent-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.2em',
          marginBottom: '1rem',
        }}>
          Production Rule
        </p>
        <Formula
          tex={"S \\;\\to\\; 1 \\;\\mid\\; \\text{eml}(S,\\, S)"}
          displayMode={true}
        />
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.85rem',
          color: 'var(--text-tertiary)',
          marginTop: '1rem',
          maxWidth: '500px',
          marginLeft: 'auto',
          marginRight: 'auto',
        }}>
          Two productions. One terminal. One recursive. Every elementary function emerges
          from this binary branching.
        </p>
      </motion.div>

      {/* Interactive grammar tree */}
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
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-tertiary)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
          }}>
            Interactive Expansion
          </span>
          <button onClick={handleReset} className="btn-ghost" style={{ padding: '0.4rem 1rem', fontSize: '0.75rem' }}>
            Reset
          </button>
        </div>

        <div style={{ minHeight: '200px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '1rem', overflow: 'auto' }}>
          <AnimatePresence mode="wait">
            <GrammarTree node={tree} onExpand={handleExpand} />
          </AnimatePresence>
        </div>

        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: '0.8rem',
          color: 'var(--text-dim)',
          marginTop: '1.5rem',
        }}>
          Click on any <span style={{ color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>S</span> node to expand it into either <span style={{ color: '#34d399', fontFamily: 'var(--font-mono)' }}>1</span> or <span style={{ color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>eml(S, S)</span>
        </p>
      </motion.div>
    </section>
  );
}

// Helper: recursively expand a node by ID
function expandNode(node, targetId) {
  if (node.id === targetId && !node.expanded) {
    // Randomly decide: terminal (1) or eml(S, S)
    // Bias towards eml for first few levels
    const goTerminal = node.depth >= 3 ? Math.random() > 0.3 : Math.random() > 0.75;

    if (goTerminal) {
      return {
        ...node,
        expanded: true,
        isTerminal: true,
        value: '1',
      };
    }

    return {
      ...node,
      expanded: true,
      isTerminal: false,
      children: [
        createGrammarNode(node.depth + 1),
        createGrammarNode(node.depth + 1),
      ],
    };
  }

  if (node.children) {
    return {
      ...node,
      children: node.children.map((child) => expandNode(child, targetId)),
    };
  }

  return node;
}
