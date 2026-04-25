'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { portfolioStore } from '@/lib/portfolioStore';

export default function Navbar() {
  const { settings } = useSyncExternalStore(
    portfolioStore.subscribe,
    portfolioStore.getSnapshot,
    portfolioStore.getServerSnapshot
  );

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="fixed z-high flex center"
      style={{ top: '2rem', left: 0, right: 0 }}
    >
      <div className="container">
        <div className="glass-nav">
          <Link href="/" style={{ fontSize: 'clamp(1.1rem, 4vw, 1.5rem)', fontWeight: '900', letterSpacing: '-0.05em', whiteSpace: 'nowrap' }}>
            {settings.siteName}<span style={{ color: 'var(--accent)' }}>.</span>
          </Link>
          
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
            <button onClick={() => document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' })} className="hover-accent" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Work</button>
            <button onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })} className="hover-accent" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>About</button>
            <button onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })} className="hover-accent" style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontWeight: '700', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Contact</button>
            <Link href="/admin" style={{ opacity: 0.3, fontSize: '0.65rem', marginLeft: '0.5rem' }}>Admin</Link>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
