'use client';

import { useState, useEffect, useRef } from 'react';

interface TypewriterTextProps {
  text: string;
  speed?: number;
  onComplete: () => void;
  lineId: string;
}

export function TypewriterText({ text, speed = 30, onComplete, lineId }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousTextRef = useRef<string>(text);
  const hasCompletedRef = useRef<boolean>(false);

  useEffect(() => {
    hasCompletedRef.current = false;
  }, [lineId]);

  useEffect(() => {
    if (text !== previousTextRef.current) {
      previousTextRef.current = text;
      setDisplayedText('');
      setIsComplete(false);

      let index = 0;
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.slice(0, index + 1));
          index++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
          if (!hasCompletedRef.current) {
            hasCompletedRef.current = true;
            onComplete();
          }
        }
      }, speed);

      return () => clearInterval(interval);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, speed]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedText]);

  return (
    <div ref={containerRef} className="overflow-hidden">
      <p className="text-lg leading-relaxed" style={{ fontFamily: 'var(--font-dialogue)' }}>
        {displayedText}
        {!isComplete && <span className="animate-pulse">|</span>}
      </p>
    </div>
  );
}
