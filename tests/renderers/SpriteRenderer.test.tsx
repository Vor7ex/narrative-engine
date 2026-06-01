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
  useAnimationControls: vi.fn(() => ({
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn(),
  })),
}));

vi.mock('@/engine/renderers/ImageRenderer', () => ({
  ImageRenderer: vi.fn(() => <div data-testid="image-renderer">ImageRenderer</div>),
}));

vi.mock('@/engine/renderers/LottieRenderer', () => ({
  LottieRenderer: vi.fn(() => <div data-testid="lottie-renderer">LottieRenderer</div>),
}));

vi.mock('@/engine/core/AnimationRegistry', () => ({
  registerAnimation: vi.fn(),
  unregisterAnimation: vi.fn(),
  getAnimationControls: vi.fn(),
  clearAllAnimations: vi.fn(),
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

  it('Debe registrar su ID en el AnimationRegistry al montar', async () => {
    const { registerAnimation } = await import('@/engine/core/AnimationRegistry');

    render(<SpriteRenderer sprite={mockSpriteImage} />);

    expect(registerAnimation).toHaveBeenCalledWith(
      'test-sprite',
      expect.objectContaining({ start: expect.any(Function), stop: expect.any(Function) })
    );
  });

  it('Debe desregistrar su ID al desmontar', async () => {
    const { unregisterAnimation } = await import('@/engine/core/AnimationRegistry');

    const { unmount } = render(<SpriteRenderer sprite={mockSpriteImage} />);
    unmount();

    expect(unregisterAnimation).toHaveBeenCalledWith('test-sprite');
  });
});
