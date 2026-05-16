import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BackgroundLayer } from '@/engine/renderers/BackgroundLayer';
import type { Background } from '@/engine/types';

vi.mock('framer-motion', () => ({
  motion: {
    div: vi.fn(({ children, ...props }) => (
      <div data-testid="background-container" {...props}>{children}</div>
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

describe('BackgroundLayer', () => {
  const mockBackgroundImage: Background = {
    id: 'forest-bg',
    asset: { kind: 'image', src: '/assets/backgrounds/forest.png' },
  };

  const mockBackgroundLottie: Background = {
    id: 'ocean-bg',
    asset: { kind: 'lottie', src: '/assets/lottie/ocean.json', loop: true, autoplay: true },
  };

  it('Debe registrar su ID al montar', async () => {
    const { registerAnimation } = await import('@/engine/core/AnimationRegistry');

    render(<BackgroundLayer background={mockBackgroundImage} />);

    expect(registerAnimation).toHaveBeenCalledWith(
      'forest-bg',
      expect.objectContaining({ start: expect.any(Function), stop: expect.any(Function) })
    );
  });

  it('Debe desregistrar su ID al desmontar', async () => {
    const { unregisterAnimation } = await import('@/engine/core/AnimationRegistry');

    const { unmount } = render(<BackgroundLayer background={mockBackgroundImage} />);
    unmount();

    expect(unregisterAnimation).toHaveBeenCalledWith('forest-bg');
  });

  it('Debe renderizar ImageRenderer para assets de tipo imagen', () => {
    render(<BackgroundLayer background={mockBackgroundImage} />);
    expect(screen.getByTestId('image-renderer')).toBeInTheDocument();
  });

  it('Debe renderizar LottieRenderer para assets de tipo lottie', () => {
    render(<BackgroundLayer background={mockBackgroundLottie} />);
    expect(screen.getByTestId('lottie-renderer')).toBeInTheDocument();
  });
});