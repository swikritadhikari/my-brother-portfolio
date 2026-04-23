'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'none'
      });
      gsap.to(ring, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.3,
        ease: 'power2.out'
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, ring], { scale: 0.8, duration: 0.2 });
    };

    const onMouseUp = () => {
      gsap.to([cursor, ring], { scale: 1, duration: 0.2 });
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isSelectable = target.closest('button, a, .video-card');
      if (isSelectable) {
        setIsHovering(true);
        gsap.to(ring, { 
          scale: 2.5, 
          borderColor: 'var(--accent)', 
          backgroundColor: 'rgba(var(--accent-rgb), 0.1)',
          duration: 0.4 
        });
        gsap.to(cursor, { scale: 0, duration: 0.2 });
      } else {
        setIsHovering(false);
        gsap.to(ring, { 
          scale: 1, 
          borderColor: 'rgba(255,255,255,0.3)', 
          backgroundColor: 'transparent',
          duration: 0.4 
        });
        gsap.to(cursor, { scale: 1, duration: 0.2 });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    window.addEventListener('mouseover', handleHover);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('mouseover', handleHover);
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '8px',
          height: '8px',
          backgroundColor: 'var(--accent)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 100001,
          transform: 'translate(-50%, -50%)',
          mixBlendMode: 'difference'
        }}
      />
      <div 
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '40px',
          height: '40px',
          border: '1px solid rgba(255,255,255,0.3)',
          borderRadius: '50%',
          pointerEvents: 'none',
          zIndex: 100001,
          transform: 'translate(-50%, -50%)',
          transition: 'border-color 0.3s, background-color 0.3s'
        }}
      />
    </>
  );
}
