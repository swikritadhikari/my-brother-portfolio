'use client';

import { useEffect, useRef, useSyncExternalStore } from 'react';
import { portfolioStore } from '@/lib/portfolioStore';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { settings } = useSyncExternalStore(
    portfolioStore.subscribe,
    portfolioStore.getSnapshot,
    portfolioStore.getServerSnapshot
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-reveal', {
        y: 80,
        opacity: 0,
        stagger: 0.2,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer id="contact" ref={containerRef} style={{ padding: 'clamp(4rem, 10vw, 10rem) 1.5rem', textAlign: 'center', background: '#050505', borderTop: '1px solid rgba(255,255,255,0.05)', position: 'relative', zIndex: 10 }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 className="footer-reveal" style={{ fontSize: 'clamp(2.5rem, 8vw, 6rem)', fontWeight: 900, marginBottom: '3rem', letterSpacing: '-0.04em', fontFamily: 'Syne, sans-serif', lineHeight: 1.1 }}>
          {settings.footerLine1} <br/><span style={{ color: 'var(--accent)' }}>{settings.footerLine2}</span>
        </h2>
        
        <p className="footer-reveal" style={{ marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem', color: 'rgba(255,255,255,0.6)', fontSize: '1.2rem', lineHeight: 1.6 }}>
          {settings.aboutText}
        </p>

        <div className="footer-reveal">
          <a 
            href={`mailto:${settings.contactEmail}`}
            style={{ fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 300, color: 'white', textDecoration: 'none', borderBottom: '2px solid var(--accent)', paddingBottom: '0.5rem', display: 'inline-block', transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'var(--accent)'}
            onMouseLeave={e => e.currentTarget.style.color = 'white'}
          >
            {settings.contactEmail}
          </a>
        </div>

        {/* Functional Social Links */}
        <div className="footer-reveal footer-socials" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          {settings.instagram && <a href={settings.instagram} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>Instagram</a>}
          {settings.linkedin && <a href={settings.linkedin} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>LinkedIn</a>}
          {settings.youtube && <a href={settings.youtube} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none', transition: 'color 0.3s' }} onMouseEnter={e => e.currentTarget.style.color = 'white'} onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>YouTube</a>}
        </div>

        {/* Global copyright tag */}
        <div className="footer-reveal" style={{ marginTop: '6rem', paddingTop: '2rem', borderTop: '1px solid rgba(255,255,255,0.05)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.2)' }}>
          {settings.copyrightText}
        </div>
      </div>
    </footer>
  );
}

