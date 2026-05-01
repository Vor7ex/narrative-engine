import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SpriteRenderer } from '@/engine/renderers/SpriteRenderer';
import type { Sprite } from '@/engine/types';

vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, ...props }) => (
      <div data-testid="sprite-container" {...props}>{children}</div>
    )),
  },
}));

vi.mock('@/engine/renderers/ImageRenderer', () => ({
  ImageRenderer: vi.fn(() => <div data-testid="image-renderer">ImageRenderer</div>),
}));

vi.mock('@/engine/renderers/LottieRenderer', () => ({
  LottieRenderer: vi.fn(() => <div data-testid="lottie-renderer">LottieRenderer</div>),
}));

describe('SpriteRenderer', () => {
  const mockSpriteImage: Sprite = {
    id: 'test-sprite',
    asset: { kind: 'image', src: '/assets/characters/penguin.png' },
    position: { x: 10, y: 20 },
    size: { width: 50 },
    zIndex: 5,
  };

  const mockSpriteLottie: Sprite = {
    id: 'test-lottie',
    asset: { kind: 'lottie', src: '/assets/lottie/penguin-with-binoculars.json', loop: true, autoplay: false },
    position: { x: 30, y: 40 },
    size: { width: 25, height: 30 },
    zIndex: 10,
  };

  it('Debe renderizar un sprite PNG en la posición correcta', () => {
    render(<SpriteRenderer sprite={mockSpriteImage} />);

    const container = screen.getByTestId('sprite-container');
    expect(container).toHaveStyle({
      top: '20%',
      left: '10%',
      width: '50%',
      height: 'auto',
      aspectRatio: '1/1',
      zIndex: 5,
    });

    expect(screen.getByTestId('image-renderer')).toBeInTheDocument();
  });

  it('Debe delegar el sprite Lottie sin perder sus propiedades de layout', () => {
    render(<SpriteRenderer sprite={mockSpriteLottie} />);

    const container = screen.getByTestId('sprite-container');
    expect(container).toHaveStyle({
      top: '40%',
      left: '30%',
      width: '25%',
      height: '30%',
      zIndex: 10,
    });

    expect(screen.getByTestId('lottie-renderer')).toBeInTheDocument();
  });
});
