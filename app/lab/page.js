'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Link from 'next/link';
import D3Tree from '@/components/D3Tree';
import Formula from '@/components/Formula';
import {
  parseExpression,
  astToEml,
  astToLatex,
  treeToD3Hierarchy,
  resetIdCounter,
  EXAMPLE_EXPRESSIONS,
} from '@/lib/mathEngine';

export default function LabPage() {
  const [input, setInput] = useState('exp(x)');
  const [parsed, setParsed] = useState(null);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('eml');
  const [activeNode, setActiveNode] = useState(null);
  const [treeSize, setTreeSize] = useState({ width: 700, height: 500 });
  const treeContainerRef = useRef(null);

  // Parse on input change
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        resetIdCounter();
        const ast = parseExpression(input);
        const latexOrig = astToLatex(ast);
        const d3Ast = treeToD3Hierarchy(ast);

        resetIdCounter();
        const ast2 = parseExpression(input);
        const eml = astToEml(ast2);
        const latexEml = astToLatex(eml);
        const d3Eml = treeToD3Hierarchy(eml);

        setParsed({ ast, eml, latexOrig, latexEml, d3Ast, d3Eml });
        setError(null);
      } catch (e) {
        setError(e.message);
        setParsed(null);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [input]);

  // Resize observer
  useEffect(() => {
    const container = treeContainerRef.current;
    if (!container) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setTreeSize({ width: Math.max(400, width - 20), height: Math.max(300, height - 20) });
      }
    });

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  const handleNodeClick = useCallback((nodeData) => {
    setActiveNode(nodeData);
  }, []);

  const currentD3Data = viewMode === 'eml' ? parsed?.d3Eml : parsed?.d3Ast;
  const currentLatex = viewMode === 'eml' ? parsed?.latexEml : parsed?.latexOrig;

  return (
    <div style={{
      minHeight: '100vh',
      paddingTop: '70px',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Lab Header */}
      <div style={{
        padding: '1rem 1.5rem',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        background: 'var(--bg-secondary)',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link href="/" style={{
            textDecoration: 'none',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}>
            ← Paper
          </Link>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: '0.85rem',
            color: 'var(--accent-secondary)',
          }}>
            Interactive Lab
          </span>
        </div>

        {/* View toggle */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-primary)',
          borderRadius: '0.5rem',
          padding: '3px',
          border: '1px solid var(--border-subtle)',
        }}>
          {['ast', 'eml'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '0.375rem',
                border: 'none',
                background: viewMode === mode ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === mode ? 'white' : 'var(--text-secondary)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              {mode === 'ast' ? 'AST' : 'EML Tree'}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        minHeight: 0,
      }}>
        {/* Left Panel */}
        <div style={{
          borderRight: '1px solid var(--border-subtle)',
          background: 'var(--bg-secondary)',
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.5rem',
          overflowY: 'auto',
        }}>
          {/* Input */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem',
            }}>
              Expression
            </label>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="input-field"
              placeholder="e.g. sin(x) + exp(x)"
            />
            {error && (
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: '#f87171',
                marginTop: '0.5rem',
              }}>
                {error}
              </p>
            )}
          </div>

          {/* Examples */}
          <div>
            <label style={{
              display: 'block',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-tertiary)',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              marginBottom: '0.5rem',
            }}>
              Examples
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {EXAMPLE_EXPRESSIONS.map((ex) => (
                <button
                  key={ex.expr}
                  onClick={() => setInput(ex.expr)}
                  style={{
                    padding: '0.35rem 0.75rem',
                    borderRadius: '0.375rem',
                    border: `1px solid ${input === ex.expr ? 'rgba(108,99,255,0.4)' : 'var(--border-subtle)'}`,
                    background: input === ex.expr ? 'rgba(108,99,255,0.1)' : 'var(--bg-card)',
                    color: input === ex.expr ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.7rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {ex.label}
                </button>
              ))}
            </div>
          </div>

          {/* Formula display */}
          {parsed && currentLatex && (
            <div>
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
              }}>
                {viewMode === 'eml' ? 'EML Representation' : 'Parsed Expression'}
              </label>
              <div style={{
                padding: '1rem',
                background: 'var(--bg-card)',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-subtle)',
                overflowX: 'auto',
              }}>
                <Formula tex={currentLatex} displayMode={true} />
              </div>
            </div>
          )}

          {/* Node inspector */}
          {activeNode && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.7rem',
                color: 'var(--text-tertiary)',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '0.5rem',
              }}>
                Node Inspector
              </label>
              <div style={{
                padding: '1rem',
                background: 'var(--bg-card)',
                borderRadius: '0.75rem',
                border: '1px solid var(--border-accent)',
              }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--text-dim)',
                    }}>
                      Type
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--accent-secondary)',
                      fontWeight: 600,
                    }}>
                      {activeNode.nodeType}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--text-dim)',
                    }}>
                      Label
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-primary)',
                      fontWeight: 600,
                    }}>
                      {activeNode.name}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--text-dim)',
                    }}>
                      Children
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-primary)',
                    }}>
                      {activeNode.children ? activeNode.children.length : 0}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'var(--text-dim)',
                    }}>
                      ID
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.65rem',
                      color: 'var(--text-dim)',
                    }}>
                      {activeNode.id}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Panel — Tree Canvas */}
        <div
          ref={treeContainerRef}
          style={{
            background: 'var(--bg-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Grid background */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
          }} />

          {/* Radial glow */}
          <div style={{
            position: 'absolute',
            width: '50%',
            height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(108,99,255,0.05) 0%, transparent 70%)',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />

          {currentD3Data ? (
            <D3Tree
              data={currentD3Data}
              width={treeSize.width}
              height={treeSize.height}
              onNodeClick={handleNodeClick}
              activeNodeId={activeNode?.id}
            />
          ) : (
            <div style={{
              textAlign: 'center',
              color: 'var(--text-dim)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.85rem',
            }}>
              {error ? 'Fix expression to see tree' : 'Enter an expression to visualize'}
            </div>
          )}

          {/* View label */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-dim)',
            textTransform: 'uppercase',
            letterSpacing: '0.15em',
            background: 'rgba(10,11,15,0.7)',
            padding: '0.3rem 0.75rem',
            borderRadius: '0.25rem',
            border: '1px solid var(--border-subtle)',
          }}>
            {viewMode === 'eml' ? 'EML Tree' : 'Abstract Syntax Tree'} • Scroll to zoom • Drag to pan
          </div>
        </div>
      </div>
    </div>
  );
}
