'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    setIsTouch(window.matchMedia("(pointer: coarse)").matches);
  }, []);

  useEffect(() => {
    if (isTouch) return;

    const cursor = cursorRef.current;
    const follower = followerRef.current;
    if (!cursor || !follower) return;

    const onMouseMove = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.4,
        ease: "power3.out",
      });
    };

    const onMouseDown = () => {
      gsap.to([cursor, follower], { scale: 0.8, duration: 0.3 });
    };
    const onMouseUp = () => {
      gsap.to([cursor, follower], { scale: 1, duration: 0.3 });
    };

    const onHoverStart = () => {
      gsap.to(follower, {
        scale: 2.5,
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.2)",
        opacity: 1,
        duration: 0.4,
      });
      gsap.to(cursor, { opacity: 0, duration: 0.2 });
    };

    const onHoverEnd = () => {
      gsap.to(follower, {
        scale: 1,
        background: "var(--accent)",
        border: "none",
        opacity: 0.3,
        duration: 0.4,
      });
      gsap.to(cursor, { opacity: 1, duration: 0.2 });
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    // Initial listeners for existing elements
    const interactiveElements = document.querySelectorAll('button, a, .video-card, input, select, textarea');
    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', onHoverStart);
      el.addEventListener('mouseleave', onHoverEnd);
    });

    // Mutation observer to handle dynamically added elements
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) {
            const targets = node.querySelectorAll('button, a, .video-card, input, select, textarea');
            targets.forEach(el => {
              el.addEventListener('mouseenter', onHoverStart);
              el.addEventListener('mouseleave', onHoverEnd);
            });
            if (node.matches('button, a, .video-card, input, select, textarea')) {
              node.addEventListener('mouseenter', onHoverStart);
              node.addEventListener('mouseleave', onHoverEnd);
            }
          }
        });
      });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      interactiveElements.forEach(el => {
        el.removeEventListener('mouseenter', onHoverStart);
        el.removeEventListener('mouseleave', onHoverEnd);
      });
      observer.disconnect();
    };
  }, [isTouch]);

  if (isTouch) return null;

  return (
    <>
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          background: "white",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999999,
          mixBlendMode: "difference",
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        ref={followerRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "32px",
          height: "32px",
          background: "var(--accent)",
          opacity: 0.3,
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 999998,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}
