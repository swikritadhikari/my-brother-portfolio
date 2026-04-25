'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { portfolioStore } from '@/lib/portfolioStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useSyncExternalStore(
    portfolioStore.subscribe,
    portfolioStore.getSnapshot,
    portfolioStore.getServerSnapshot
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-reveal', {
        y: 100,
        opacity: 0,
        stagger: 0.2,
        duration: 1.5,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="about" 
      ref={containerRef}
      className="section-padding" 
      style={{ 
        position: 'relative',
        backgroundColor: '#020202', 
        borderTop: '1px solid rgba(255,255,255,0.05)',
        backgroundImage: settings.aboutBgImage ? `url(${settings.aboutBgImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'scroll' // Changed from fixed for better mobile support
      }}
    >
      {/* Dark gradient overlay for text readability */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(2,2,2,0.95) 0%, rgba(2,2,2,0.6) 100%)', zIndex: 0 }} />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem', position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
          
          <div className="about-reveal">
            <h2 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', fontWeight: 900, lineHeight: 1, letterSpacing: '-0.04em', fontFamily: 'Syne, sans-serif' }}>
              ABOUT <br />
              <span style={{ color: 'var(--accent)' }}>ME</span>
            </h2>
          </div>

          <div className="about-reveal">
            <p style={{ fontSize: '1.25rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.7)', fontWeight: 300, marginBottom: '2rem' }}>
              {settings.aboutText}
            </p>
            <button 
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="magnetic-btn"
              style={{ background: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'white', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', paddingBottom: '0.5rem' }}
            >
              GET IN TOUCH
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

        </div>
      </div>
    </section>
  );
}

