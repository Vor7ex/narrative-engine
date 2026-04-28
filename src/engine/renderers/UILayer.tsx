'use client';

import type { UIElement } from '../types';
import { useGameStateStore } from '../core/GameStateStore';
import { triggerSystem } from '../core/TriggerSystem';

interface UILayerProps {
  elements: UIElement[];
}

export function UILayer({ elements }: UILayerProps) {
  const state = useGameStateStore();

  return (
    <div className="absolute inset-0 z-[var(--z-ui)] pointer-events-none">
      {elements.map((element) => {
        if (element.visible && !element.visible(state)) {
          return null;
        }

        return (
          <button
            key={element.id}
            className="absolute bg-charcoal text-text-primary px-4 py-2 border-2 border-black shadow-hard pointer-events-auto"
            style={{
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
            }}
            onClick={() => triggerSystem.dispatchConditional(element.onTap)}
          >
            {element.label}
          </button>
        );
      })}
    </div>
  );
}