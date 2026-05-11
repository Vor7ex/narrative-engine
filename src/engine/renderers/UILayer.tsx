'use client';

import { motion } from 'framer-motion';
import type { UIElement } from '@/engine/types';
import { useGameStateStore } from '@/engine/core/GameStateStore';
import { triggerSystem } from '@/engine/core/TriggerSystem';

interface UILayerProps {
  elements: UIElement[];
}

const STYLE_CLASSES = {
  primary: {
    base: 'bg-interactive text-text-primary border-2 border-black shadow-hard',
    hover: 'hover:bg-cerulean hover:shadow-hard-sm',
    ghost: false,
  },
  secondary: {
    base: 'bg-charcoal text-text-primary border-2 border-black shadow-hard',
    hover: 'hover:bg-twilight hover:shadow-hard-sm',
    ghost: false,
  },
  ghost: {
    base: 'bg-transparent text-text-primary border-2 border-black shadow-none',
    hover: 'hover:bg-charcoal/50 hover:shadow-hard-sm',
    ghost: true,
  },
};

const BUTTON_BASE = 'absolute pointer-events-auto cursor-pointer px-4 py-2 select-none font-ui text-sm uppercase tracking-wide';

const animationVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const buttonTransition = {
  duration: 0.1,
  ease: 'easeOut' as const,
};

export function UILayer({ elements }: UILayerProps) {
  const state = useGameStateStore();

  return (
    <div className="absolute inset-0 z-[var(--z-ui)] pointer-events-none">
      {elements.map((element) => {
        const isVisible = !element.visible || element.visible(state);
        const isDisabled = element.disabled?.(state);

        if (!isVisible) return null;

        const styleConfig = STYLE_CLASSES[element.style ?? 'secondary'];
        const hasHoverHandler = !!element.onHover;
        const isInteractive = !isDisabled && hasHoverHandler;
        const cursorClass = isInteractive ? 'cursor-pointer' : isDisabled ? 'cursor-not-allowed' : 'cursor-default';

        return (
          <motion.button
            key={element.id}
            initial="hidden"
            animate="visible"
            whileHover={isInteractive ? { scale: 1.02, x: -1, y: -1 } : undefined}
            whileTap={isDisabled ? undefined : { scale: 0.95, x: 2, y: 2 }}
            transition={buttonTransition}
            variants={animationVariants}
            className={`${BUTTON_BASE} ${styleConfig.base} ${cursorClass}`}
            style={{
              left: `${element.position.x}%`,
              top: `${element.position.y}%`,
            }}
            onClick={() => {
              if (isDisabled) return;
              triggerSystem.dispatchConditional(element.onTap);
            }}
            onPointerEnter={() => {
              if (isDisabled || !element.onHover) return;
              triggerSystem.dispatchConditional(element.onHover);
            }}
            disabled={isDisabled}
            aria-disabled={isDisabled}
          >
            {element.label}
          </motion.button>
        );
      })}
    </div>
  );
}