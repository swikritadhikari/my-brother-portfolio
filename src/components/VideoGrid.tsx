'use client';

import { useState, useEffect, useRef, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, ArrowRight, Loader2 } from "lucide-react";
import { portfolioStore } from "@/lib/portfolioStore";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function VideoGrid() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { videos } = useSyncExternalStore(
    portfolioStore.subscribe,
    portfolioStore.getSnapshot,
    portfolioStore.getServerSnapshot
  );

  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    // Parallax Reveal on Scroll
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray('.video-card');
      cards.forEach((card) => {
        const el = card as HTMLElement;
        gsap.from(el, {
          y: 100,
          opacity: 0,
          rotateX: -10,
          scrollTrigger: {
            trigger: el,
            start: 'top bottom-=100px',
            toggleActions: 'play none none reverse'
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [videos, visibleCount]); // Re-run if videos list or visible count changes

  const [iframeLoading, setIframeLoading] = useState<string | null>(null);

  const mainVlogs = videos.filter(v => v.type === 'video' || v.type === undefined);
  const mainVideos = mainVlogs.slice(0, visibleCount);

  return (
    <section id="work" ref={containerRef} className="section-padding" style={{ backgroundColor: '#000' }}>
      <div className="container">
        <div className="flex-between" style={{ marginBottom: '6rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '3rem' }}>
          <div style={{ maxWidth: '600px' }}>
            <h2 className="text-section" style={{ fontWeight: '800' }}>Selected Works</h2>
            <p style={{ color: 'var(--text-dim)', fontSize: '1.2rem', marginTop: '1rem' }}>
              Redefining commercial aesthetics through narrative precision and technical innovation.
            </p>
          </div>
          <div className="flex" style={{ gap: '2rem' }}>
             <span style={{ fontSize: '0.7rem', fontWeight: 'bold', letterSpacing: '0.2em' }}>SCROLL TO EXPLORE</span>
             <div style={{ width: '100px', height: '1px', background: 'var(--glass-border)', alignSelf: 'center' }} />
          </div>
        </div>

        {mainVideos.length === 0 ? (
          <div className="flex center column" style={{ padding: '10rem 0', opacity: 0.5 }}>
            <p style={{ fontSize: '1.2rem', letterSpacing: '0.1em' }}>NO MAIN VIDEOS FOUND</p>
            <span style={{ fontSize: '0.8rem', marginTop: '1rem' }}>Add some cinematic vlogs in the Admin panel.</span>
          </div>
        ) : (
          <div className="grid-portfolio">
            {mainVideos.map((video) => (
              <div 
                key={video.id} 
                className="video-card" 
                onClick={() => {
                  setPlayingVideoId(video.id);
                  setIframeLoading(video.id);
                }}
              >
                <div className="video-card-thumb" style={{ borderRadius: '0', aspectRatio: '16/9', background: '#050505', position: 'relative' }}>
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
                      <img 
                        src={video.thumbnail} 
                        alt={video.title} 
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)' }} 
                        className="hover-scale"
                      />
                      <div className="play-button">
                        <Play size={24} fill="white" />
                      </div>
                    </>
                  )}
                </div>
                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '0 0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: '800', lineHeight: 1.2, marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>{video.title}</h3>
                    <span style={{ color: 'var(--accent)', fontSize: '0.7rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.2em' }}>{video.category}</span>
                  </div>
                  <div style={{ padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '50%' }}>
                    <ArrowRight size={20} className="text-accent" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}



        {mainVlogs.length > visibleCount && (
          <div className="flex center" style={{ marginTop: '8rem' }}>
            <button 
              className="btn-luxury magnetic-btn flex center" 
              disabled={isLoadingMore}
              onClick={() => {
                setIsLoadingMore(true);
                setTimeout(() => {
                  setVisibleCount(v => v + 6);
                  setIsLoadingMore(false);
                }, 1200);
              }}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', gap: '1rem' }}
            >
              {isLoadingMore ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                    <Loader2 size={18} />
                  </motion.div>
                  SYNCHRONIZING CONTENT...
                </>
              ) : (
                "LOAD MORE WORKS"
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
