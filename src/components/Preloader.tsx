'use client';

import { useState, useEffect, useSyncExternalStore } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { portfolioStore } from '@/lib/portfolioStore';

export default function Preloader() {
  const [percent, setPercent] = useState(0);
  const [complete, setComplete] = useState(false);

  const { settings } = useSyncExternalStore(
    portfolioStore.subscribe,
    portfolioStore.getSnapshot,
    portfolioStore.getServerSnapshot
  );

  const words = (settings.preloaderText || "BINAYA.").split("");

  useEffect(() => {
    // Artificial load progress
    const interval = setInterval(() => {
      setPercent((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setComplete(true), 1200); // Wait for the "Complete" state to breathe
          return 100;
        }
        return prev + Math.floor(Math.random() * 8) + 1;
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  // Panel staggered variants
  const panelVariants = {
    initial: { y: 0 },
    exit: (i: number) => ({
      y: '-100%',
      transition: { 
        duration: 0.8, 
        ease: [0.76, 0, 0.24, 1] as const,
        delay: i * 0.05 
      }
    })
  }; 

  return (
    <AnimatePresence mode="wait">
      {!complete && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100000, pointerEvents: 'none' }}>
          {/* STAGGERED BACKGROUND PANELS */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex' }}>
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                custom={i}
                variants={panelVariants}
                initial="initial"
                exit="exit"
                style={{ flex: 1, background: '#050505', borderRight: i < 4 ? '1px solid rgba(255,255,255,0.02)' : 'none' }}
              />
            ))}
          </div>

          {/* CONTENT OVERLAY */}
          <motion.div
            exit={{ opacity: 0, transition: { duration: 0.4 } }}
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              pointerEvents: 'auto'
            }}
          >
            {/* Film Grain for Preloader */}
            <div className="noise-overlay" style={{ opacity: 0.1 }} />

            <div style={{ position: 'relative', textAlign: 'center', zIndex: 10 }}>
              {/* BRAND TEXT REVEAL */}
              <div style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                {words.map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ 
                      duration: 1, 
                      ease: [0.16, 1, 0.3, 1],
                      delay: i * 0.05 
                    }}
                    style={{
                      display: 'inline-block',
                      fontFamily: 'Syne',
                      fontSize: 'clamp(1.5rem, 6vw, 4rem)',
                      fontWeight: 900,
                      letterSpacing: '0.05em',
                      color: char === " " ? "transparent" : "white",
                      width: char === " " ? "0.5em" : "auto",
                      background: 'linear-gradient(to bottom, #fff, rgba(255,255,255,0.3))',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: char === " " ? "transparent" : "transparent"
                    }}
                  >
                    {char}
                  </motion.span>
                ))}
              </div>
              
              {/* PROGRESS SECTION */}
              <div style={{ position: 'relative', width: '300px', margin: '0 auto' }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  fontFamily: 'Inter', 
                  fontSize: '10px', 
                  letterSpacing: '0.3em',
                  marginBottom: '10px',
                  color: 'var(--accent)'
                }}>
                  <span>{settings.preloaderSubtext || "ESTABLISHING SHOT"}</span>
                  <span>{percent}%</span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: '1px', 
                  background: 'rgba(255,255,255,0.1)', 
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <motion.div 
                    style={{ 
                      position: 'absolute', 
                      left: 0, 
                      top: 0, 
                      height: '100%', 
                      background: 'white',
                      width: `${percent}%` 
                    }} 
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

