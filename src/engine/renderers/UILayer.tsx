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
  },
  secondary: {
    base: 'bg-charcoal text-text-primary border-2 border-black shadow-hard',
    hover: 'hover:bg-twilight hover:shadow-hard-sm',
  },
  ghost: {
    base: 'bg-transparent text-text-primary border-2 border-black shadow-none',
    hover: 'hover:bg-charcoal/50 hover:shadow-hard-sm',
  },
};

const BUTTON_BASE = 'absolute pointer-events-auto px-4 py-2 select-none font-ui text-sm uppercase tracking-wide';

const animationVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
};

const buttonTransition = {
  duration: 0.1,
  ease: 'easeOut' as const,
};

function getStyleConfig(style?: string) {
  return STYLE_CLASSES[style as keyof typeof STYLE_CLASSES] ?? STYLE_CLASSES.secondary;
}

function getCursorClass(hasHover: boolean, isDisabled: boolean): string {
  if (isDisabled) return 'cursor-not-allowed';
  if (hasHover) return 'cursor-pointer';
  return 'cursor-default';
}

function getButtonClassName(element: UIElement, isDisabled: boolean): string {
  const styleConfig = getStyleConfig(element.style);
  const hasHover = !!element.onHover;
  const cursorClass = getCursorClass(hasHover, isDisabled);
  return `${BUTTON_BASE} ${styleConfig.base} ${cursorClass}`;
}

interface UIButtonProps {
  element: UIElement;
  isDisabled: boolean;
}

function UIButtonRenderer({ element, isDisabled }: UIButtonProps) {
  const styleConfig = getStyleConfig(element.style);
  const hasHover = !!element.onHover;
  const isInteractive = !isDisabled && hasHover;

  return (
    <motion.button
      key={element.id}
      initial="hidden"
      animate="visible"
      whileHover={isInteractive ? { scale: 1.02, x: -1, y: -1 } : undefined}
      whileTap={isDisabled ? undefined : { scale: 0.95, x: 2, y: 2 }}
      transition={buttonTransition}
      variants={animationVariants}
      className={getButtonClassName(element, isDisabled)}
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
}

export function UILayer({ elements }: UILayerProps) {
  const state = useGameStateStore();

  return (
    <div className="absolute inset-0 z-[var(--z-ui)] pointer-events-none">
      {elements
        .filter((element) => !element.visible || element.visible(state))
        .map((element) => (
          <UIButtonRenderer
            key={element.id}
            element={element}
            isDisabled={element.disabled?.(state) ?? false}
          />
        ))}
    </div>
  );
}