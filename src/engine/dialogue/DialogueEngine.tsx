'use client';

import type { ReactNode } from 'react';

interface DialogueEngineProps {
  children?: ReactNode;
}

export function DialogueEngine({ children }: DialogueEngineProps) {
  return (
    <div className="absolute inset-0 z-[var(--z-dialogue)]">
      {children}
    </div>
  );
}