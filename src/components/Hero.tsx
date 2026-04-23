'use client';

import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import gsap from 'gsap';
import { portfolioStore } from '@/lib/portfolioStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, X } from 'lucide-react';


export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [showStoryPlayer, setShowStoryPlayer] = useState(false);
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [storyLoading, setStoryLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  
  const { settings, videos } = useSyncExternalStore(
    portfolioStore.subscribe,
    portfolioStore.getSnapshot,
    portfolioStore.getServerSnapshot
  );

  const shorts = videos.filter(v => v.type === 'short');

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal everything that has opacity: 0
      gsap.to('.fade-up', {
        opacity: 1,
        y: 0,
        duration: 1.2,
        delay: 0.5,
        stagger: 0.2,
        ease: 'power3.out'
      });

      gsap.to('.reveal-text span', {
        opacity: 1,
        y: 0,
        duration: 1.5,
        ease: 'expo.out',
        stagger: 0.1
      });

      gsap.from('.hero-glow', {
        opacity: 0,
        scale: 0.5,
        duration: 3,
        ease: 'power2.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, [settings]);

  const handleOpenShowreel = (e: React.MouseEvent) => {
    e.preventDefault();
    if (shorts.length > 0) {
      setActiveStoryIndex(0);
      setShowStoryPlayer(true);
    } else {
      alert("No shorts found! Try importing from your YouTube channel or manually tagging a video as a 'Vertical Short' in the Admin panel.");
    }
  };

  const nextStory = () => {
    if (activeStoryIndex < shorts.length - 1) {
      setActiveStoryIndex(prev => prev + 1);
    } else {
      setShowStoryPlayer(false);
    }
  };

  const prevStory = () => {
    if (activeStoryIndex > 0) {
      setActiveStoryIndex(prev => prev - 1);
    }
  };

  return (
    <section className="hero-section" ref={containerRef}>
      <div className="hero-glow" />
      
      <div className="container relative">
        <div style={{ marginBottom: '2rem' }}>
          <span className="fade-up" style={{ 
            color: 'var(--accent)', 
            fontWeight: 'bold', 
            letterSpacing: '0.4em', 
            textTransform: 'uppercase', 
            fontSize: '11px',
            marginBottom: '1.5rem',
            display: 'block',
            opacity: 0
          }}>
            {settings.heroTagline}
          </span>
          <h1 className="text-hero text-black">
            <span className="reveal-text">
              <span className="text-gradient" style={{ opacity: 0 }}>{settings.heroLine1}</span>
            </span>
            <span className="reveal-text">
              <span style={{ opacity: 0 }}>{settings.heroLine2}</span>
            </span>
            <span className="reveal-text">
              <span style={{ opacity: 0 }}>{settings.heroLine3}</span>
            </span>
          </h1>
        </div>

        <p className="fade-up" style={{ 
          color: 'var(--text-dim)', 
          maxWidth: '800px', 
          margin: '0 auto 4rem', 
          fontSize: '1.5rem',
          fontWeight: '300',
          lineHeight: '1.4',
          opacity: 0
        }}>
          {settings.heroDescription}
        </p>

        <div className="fade-up flex center" style={{ gap: '2rem', opacity: 0 }}>
          <button 
            type="button"
            className="btn-luxury magnetic-btn flex center" 
            style={{ gap: '1rem' }}
            onClick={handleOpenShowreel}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch Showreel
          </button>
          <button 
            type="button"
            className="btn-luxury magnetic-btn" 
            style={{ background: 'var(--glass)', border: '1px solid var(--glass-border)' }}
            onClick={() => {
              document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            EXPLORE WORK
          </button>
        </div>
      </div>

      {/* IG Story Modal */}
      <AnimatePresence>
        {showStoryPlayer && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.98)', zIndex: 100002, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}
            onClick={() => setShowStoryPlayer(false)}
            data-lenis-prevent
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              style={{ position: 'relative', width: '100%', maxWidth: '420px', height: '100%', maxHeight: '850px', background: '#000', borderRadius: '1.5rem', overflow: 'hidden', boxShadow: '0 40px 100px rgba(0,0,0,0.8)' }}
              onClick={e => e.stopPropagation()}
              onPointerDown={() => setIsPaused(true)}
              onPointerUp={() => setIsPaused(false)}
            >
              {/* Progress Bars */}
              <div style={{ position: 'absolute', top: '15px', left: '12px', right: '12px', display: 'flex', gap: '6px', zIndex: 10 }}>
                {shorts.map((_, i) => (
                  <div key={i} style={{ flex: 1, height: '3px', background: 'rgba(255,255,255,0.15)', borderRadius: '10px', overflow: 'hidden' }}>
                    <motion.div 
                      key={`${i}-${storyLoading}-${isPaused}`}
                      initial={{ width: i < activeStoryIndex ? '100%' : '0%' }}
                      animate={{ 
                        width: i === activeStoryIndex ? (isPaused || storyLoading ? 'auto' : '100%') : i < activeStoryIndex ? '100%' : '0%' 
                      }}
                      transition={{ 
                        duration: i === activeStoryIndex ? (isPaused || storyLoading ? 9999 : 15) : 0, 
                        ease: 'linear' 
                      }}
                      onAnimationComplete={() => { if (i === activeStoryIndex && !storyLoading && !isPaused) nextStory(); }}
                      style={{ height: '100%', background: '#fff' }}
                    />
                  </div>
                ))}
              </div>

              {/* Story Header */}
              <div style={{ position: 'absolute', top: '40px', left: '15px', right: '15px', display: 'flex', alignItems: 'center', gap: '10px', zIndex: 10 }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid var(--accent)', padding: '2px', overflow: 'hidden' }}>
                  <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span style={{ color: 'white', fontWeight: 800, fontSize: '13px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>{settings.siteName}</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {shorts[activeStoryIndex].category === 'Import' ? 'Featured Work' : shorts[activeStoryIndex].category}
                  </span>
                </div>
              </div>

              {/* Loader */}
              {storyLoading && (
                <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', zIndex: 5 }}>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 className="text-accent" size={40} />
                  </motion.div>
                </div>
              )}

              {/* Video Content */}
              <div style={{ height: '100%', pointerEvents: 'none' }}>
                <iframe
                  key={shorts[activeStoryIndex].youtubeId}
                  src={`https://www.youtube.com/embed/${shorts[activeStoryIndex].youtubeId}?autoplay=1&controls=0&mute=0&modestbranding=1&rel=0&iv_load_policy=3&disablekb=1&enablejsapi=1`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="autoplay"
                  onLoad={() => setStoryLoading(false)}
                />
              </div>

              {/* Overlay for detecting holds/taps without blocking video load */}
              <div 
                style={{ position: 'absolute', inset: 0, zIndex: 20 }} 
                onPointerDown={() => setIsPaused(true)}
                onPointerUp={() => setIsPaused(false)}
              >
                <div style={{ position: 'absolute', top: 0, left: 0, width: '30%', height: '100%', cursor: 'pointer' }} onClick={prevStory} />
                <div style={{ position: 'absolute', top: 0, right: 0, width: '70%', height: '100%', cursor: 'pointer' }} onClick={nextStory} />
              </div>

              {/* Close Button */}
              <button 
                onClick={() => setShowStoryPlayer(false)}
                style={{ position: 'absolute', top: '40px', right: '15px', background: 'none', border: 'none', color: 'white', zIndex: 30, cursor: 'pointer', padding: '5px' }}
              >
                <X size={24} />
              </button>

              {/* Title Overlay */}
              <div style={{ position: 'absolute', bottom: '30px', left: '20px', right: '20px', zIndex: 25 }}>
                <h3 style={{ color: 'white', fontSize: '1rem', fontWeight: 900, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
                  {shorts[activeStoryIndex].title}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
