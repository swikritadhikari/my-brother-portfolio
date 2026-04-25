'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, X, Loader2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSyncExternalStore } from 'react';
import { portfolioStore } from '@/lib/portfolioStore';

gsap.registerPlugin(ScrollTrigger);

export default function VideoGrid() {
  const { videos } = useSyncExternalStore(
    portfolioStore.subscribe,
    portfolioStore.getSnapshot,
    portfolioStore.getServerSnapshot
  );

  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const containerRef = useRef<HTMLDivElement>(null);

  const mainVlogs = videos.filter(v => v.type === 'video' || v.type === undefined);
  const mainVideos = mainVlogs.slice(0, visibleCount);

  useEffect(() => {
    if (!containerRef.current || mainVideos.length === 0) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.video-card');
      cards.forEach((card) => {
        const el = card as HTMLElement;
        
        // 3D Tilt Effect
        el.addEventListener('mousemove', (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const rotateX = (y - centerY) / 10;
          const rotateY = (centerX - x) / 10;

          gsap.to(el, {
            rotateX: rotateX,
            rotateY: rotateY,
            scale: 1.02,
            duration: 0.5,
            ease: 'power3.out',
            transformPerspective: 1000
          });
        });

        el.addEventListener('mouseleave', () => {
          gsap.to(el, {
            rotateX: 0,
            rotateY: 0,
            scale: 1,
            duration: 0.5,
            ease: 'power3.out'
          });
        });

        // Entrance Animation
        gsap.from(el, {
          y: 100,
          opacity: 0,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=100px',
            toggleActions: 'play none none reverse'
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [mainVideos.length]);

  return (
    <section id="work" className="section" ref={containerRef}>
      <div className="container">
        <div className="flex between end" style={{ marginBottom: '5rem' }}>
          <div className="fade-up">
            <span className="text-accent" style={{ fontWeight: 800, letterSpacing: '0.3em', fontSize: '0.75rem', textTransform: 'uppercase' }}>Selected Works</span>
            <h2 style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)', fontFamily: 'var(--font-syne)', fontWeight: 800, marginTop: '1rem', letterSpacing: '-0.04em' }}>
              CINEMATIC <br /> <span className="text-gradient">NARRATIVES</span>
            </h2>
          </div>
          <div className="desktop-only fade-up">
            <p style={{ maxWidth: '300px', fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
              A collection of high-end visual stories tailored for emotional resonance and pace.
            </p>
          </div>
        </div>

        <div className="grid-portfolio">
          {mainVideos.length > 0 ? (
            mainVideos.map((video) => (
              <div 
                key={video.id} 
                className="video-card glass-card" 
                style={{ overflow: 'visible' }}
                onClick={() => {
                  setPlayingVideoId(video.id);
                  setIframeLoading(video.id);
                }}
              >
                <div className="video-card-thumb" style={{ borderRadius: '1.5rem', aspectRatio: '16/9', background: '#050505', position: 'relative', overflow: 'hidden' }}>
                  {playingVideoId === video.id ? (
                    <>
                      {iframeLoading === video.id && (
                        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', zIndex: 10 }}>
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                            <Loader2 className="text-accent" size={32} />
                          </motion.div>
                        </div>
                      )}
                      <iframe
                        src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1`}
                        style={{ width: '100%', height: '100%', border: 'none' }}
                        allowFullScreen
                        onLoad={() => setIframeLoading(null)}
                      />
                    </>
                  ) : (
                    <>
                      <Image 
                        src={video.thumbnail} 
                        alt={video.title} 
                        fill
                        style={{ objectFit: 'cover' }} 
                        className="hover-scale"
                        unoptimized
                      />
                      <div className="play-button-glass">
                        <Play size={20} fill="white" />
                      </div>
                    </>
                  )}
                </div>
                <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 1rem' }}>
                  <div style={{ flex: 1, paddingRight: '1rem' }}>
                    <h3 style={{ fontSize: '1.6rem', fontFamily: 'var(--font-syne)', fontWeight: '800', lineHeight: 1.1, marginBottom: '0.5rem', letterSpacing: '-0.04em' }}>{video.title}</h3>
                    <span style={{ color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.25em', opacity: 0.8 }}>{video.category}</span>
                  </div>
                  <div style={{ width: '45px', height: '45px', background: 'rgba(255,255,255,0.05)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <ArrowRight size={20} className="text-accent" />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '10rem 0', opacity: 0.4 }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 700, letterSpacing: '0.15em', fontFamily: 'var(--font-syne)' }}>NO PROJECTS PUBLISHED</p>
              <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: 'var(--text-dim)' }}>Visit the Admin Dashboard to add your cinematic work.</p>
            </div>
          )}
        </div>

        {mainVlogs.length > visibleCount && (
          <div className="flex center" style={{ marginTop: '5rem' }}>
            <button 
              className="btn-luxury"
              onClick={() => setVisibleCount(prev => prev + 4)}
            >
              LOAD MORE PROJECTS
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
