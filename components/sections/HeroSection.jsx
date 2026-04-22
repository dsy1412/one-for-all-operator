'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Formula from '../Formula';

export default function HeroSection() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const formulaRef = useRef(null);
  const treeRef = useRef(null);
  const particlesRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set([titleRef.current, subtitleRef.current, formulaRef.current], {
        opacity: 0,
        y: 40,
      });

      // Particles setup
      if (particlesRef.current) {
        const symbols = ['exp', 'ln', 'sin', 'cos', '+', '−', '×', '÷', '∫', '∑', 'π', 'e', '∂', '√', '∞'];
        for (let i = 0; i < 30; i++) {
          const span = document.createElement('span');
          span.textContent = symbols[Math.floor(Math.random() * symbols.length)];
          span.style.cssText = `
            position: absolute;
            font-family: "JetBrains Mono", monospace;
            font-size: ${8 + Math.random() * 14}px;
            color: rgba(108, 99, 255, ${0.05 + Math.random() * 0.1});
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            pointer-events: none;
            user-select: none;
          `;
          particlesRef.current.appendChild(span);

          gsap.to(span, {
            y: `+=${-30 + Math.random() * 60}`,
            x: `+=${-20 + Math.random() * 40}`,
            opacity: 0,
            duration: 4 + Math.random() * 6,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut',
            delay: Math.random() * 5,
          });
        }
      }

      // Hero timeline
      const tl = gsap.timeline({ delay: 0.3 });

      tl.to(titleRef.current, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      })
      .to(subtitleRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.4')
      .to(formulaRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
      }, '-=0.3');

      // Animate the SVG tree
      if (treeRef.current) {
        const paths = treeRef.current.querySelectorAll('line');
        const circles = treeRef.current.querySelectorAll('circle');
        const texts = treeRef.current.querySelectorAll('text');

        gsap.set([...paths, ...circles, ...texts], { opacity: 0 });

        tl.to(circles, {
          opacity: 1,
          scale: 1,
          stagger: 0.08,
          duration: 0.5,
          ease: 'back.out(1.7)',
        }, '-=0.2')
        .to(paths, {
          opacity: 0.3,
          stagger: 0.06,
          duration: 0.4,
          ease: 'power2.out',
        }, '-=0.3')
        .to(texts, {
          opacity: 1,
          stagger: 0.06,
          duration: 0.3,
          ease: 'power2.out',
        }, '-=0.2');
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      id="hero"
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '2rem',
      }}
    >
      {/* Background math symbols */}
      <div
        ref={particlesRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Radial glow background */}
      <div style={{
        position: 'absolute',
        width: '60vw',
        height: '60vw',
        maxWidth: '800px',
        maxHeight: '800px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        pointerEvents: 'none',
        zIndex: 0,
      }} />

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: '900px' }}>
        <div ref={titleRef}>
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--accent-secondary)',
            marginBottom: '1.5rem',
          }}>
            A Universal Function Generator
          </p>
          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.1,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            background: 'linear-gradient(135deg, #e8e6f0 0%, #a78bfa 50%, #6c63ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            All Elementary Functions<br />
            from a Single Binary Operator
          </h1>
        </div>

        <p ref={subtitleRef} style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(1rem, 1.4vw, 1.2rem)',
          color: 'var(--text-secondary)',
          lineHeight: 1.7,
          maxWidth: '550px',
          margin: '0 auto 2.5rem',
        }}>
          Discover how a single recursive operator can generate every exponential,
          logarithmic, trigonometric, and polynomial function.
        </p>

        {/* Main formula */}
        <div ref={formulaRef} className="formula-card" style={{
          display: 'inline-block',
          padding: '2rem 3rem',
          marginBottom: '3rem',
        }}>
          <Formula
            tex={"\\text{eml}(x,\\, y) \\;=\\; e^{x} - \\ln(y)"}
            displayMode={true}
          />
        </div>

        {/* Abstract tree illustration */}
        <div ref={treeRef} style={{ margin: '2rem auto 0', maxWidth: '400px' }}>
          <svg viewBox="0 0 400 220" width="100%" height="auto">
            {/* Links */}
            <line x1="200" y1="30" x2="120" y2="90" stroke="rgba(108,99,255,0.3)" strokeWidth="1.5" />
            <line x1="200" y1="30" x2="280" y2="90" stroke="rgba(108,99,255,0.3)" strokeWidth="1.5" />
            <line x1="120" y1="90" x2="70" y2="155" stroke="rgba(108,99,255,0.2)" strokeWidth="1.5" />
            <line x1="120" y1="90" x2="170" y2="155" stroke="rgba(108,99,255,0.2)" strokeWidth="1.5" />
            <line x1="280" y1="90" x2="230" y2="155" stroke="rgba(108,99,255,0.2)" strokeWidth="1.5" />
            <line x1="280" y1="90" x2="330" y2="155" stroke="rgba(108,99,255,0.2)" strokeWidth="1.5" />
            <line x1="70" y1="155" x2="45" y2="200" stroke="rgba(108,99,255,0.1)" strokeWidth="1" />
            <line x1="70" y1="155" x2="95" y2="200" stroke="rgba(108,99,255,0.1)" strokeWidth="1" />
            <line x1="330" y1="155" x2="305" y2="200" stroke="rgba(108,99,255,0.1)" strokeWidth="1" />
            <line x1="330" y1="155" x2="355" y2="200" stroke="rgba(108,99,255,0.1)" strokeWidth="1" />

            {/* Root */}
            <circle cx="200" cy="30" r="18" fill="rgba(108,99,255,0.15)" stroke="#6c63ff" strokeWidth="2" />
            <text x="200" y="35" textAnchor="middle" fill="#a78bfa" fontSize="11" fontFamily="JetBrains Mono, monospace" fontWeight="600">eml</text>

            {/* Level 1 */}
            <circle cx="120" cy="90" r="15" fill="rgba(108,99,255,0.1)" stroke="#6c63ff" strokeWidth="1.5" />
            <text x="120" y="94" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="JetBrains Mono, monospace">eml</text>
            <circle cx="280" cy="90" r="15" fill="rgba(108,99,255,0.1)" stroke="#6c63ff" strokeWidth="1.5" />
            <text x="280" y="94" textAnchor="middle" fill="#a78bfa" fontSize="10" fontFamily="JetBrains Mono, monospace">eml</text>

            {/* Level 2 */}
            <circle cx="70" cy="155" r="13" fill="rgba(108,99,255,0.08)" stroke="#6c63ff" strokeWidth="1" />
            <text x="70" y="159" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono, monospace">eml</text>
            <circle cx="170" cy="155" r="12" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="1" />
            <text x="170" y="159" textAnchor="middle" fill="#34d399" fontSize="9" fontFamily="JetBrains Mono, monospace">1</text>
            <circle cx="230" cy="155" r="12" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" strokeWidth="1" />
            <text x="230" y="159" textAnchor="middle" fill="#f59e0b" fontSize="9" fontFamily="JetBrains Mono, monospace">x</text>
            <circle cx="330" cy="155" r="13" fill="rgba(108,99,255,0.08)" stroke="#6c63ff" strokeWidth="1" />
            <text x="330" y="159" textAnchor="middle" fill="#a78bfa" fontSize="9" fontFamily="JetBrains Mono, monospace">eml</text>

            {/* Level 3 leaves */}
            <circle cx="45" cy="200" r="10" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" strokeWidth="1" />
            <text x="45" y="204" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="JetBrains Mono, monospace">x</text>
            <circle cx="95" cy="200" r="10" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="1" />
            <text x="95" y="204" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="JetBrains Mono, monospace">1</text>
            <circle cx="305" cy="200" r="10" fill="rgba(52,211,153,0.12)" stroke="#34d399" strokeWidth="1" />
            <text x="305" y="204" textAnchor="middle" fill="#34d399" fontSize="8" fontFamily="JetBrains Mono, monospace">1</text>
            <circle cx="355" cy="200" r="10" fill="rgba(245,158,11,0.12)" stroke="#f59e0b" strokeWidth="1" />
            <text x="355" y="204" textAnchor="middle" fill="#f59e0b" fontSize="8" fontFamily="JetBrains Mono, monospace">x</text>
          </svg>
        </div>

        {/* Scroll indicator */}
        <div style={{
          marginTop: '3rem',
          opacity: 0.4,
          animation: 'float 3s ease-in-out infinite',
        }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
          </svg>
        </div>
      </div>
    </section>
  );
}
