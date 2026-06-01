import { describe, it, expect, vi, beforeEach } from 'vitest';
import { registerAnimation, unregisterAnimation, getAnimationControls, clearAllAnimations } from '@/engine/core/AnimationRegistry';

describe('AnimationRegistry', () => {
  beforeEach(() => {
    clearAllAnimations();
  });

  it('Debe almacenar y retornar controls dado un id', () => {
    const mockControls = { start: vi.fn(), stop: vi.fn() };
    registerAnimation('sprite-1', mockControls as any);

    const controls = getAnimationControls('sprite-1');
    expect(controls).toBe(mockControls);
  });

  it('Debe retornar undefined para IDs no registrados', () => {
    const controls = getAnimationControls('no-existe');
    expect(controls).toBeUndefined();
  });

  it('Debe lanzar warn cuando se registra ID duplicado', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const mockControls = { start: vi.fn(), stop: vi.fn() };

    registerAnimation('sprite-1', mockControls as any);
    registerAnimation('sprite-1', mockControls as any);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('sprite-1')
    );
    warnSpy.mockRestore();
  });

  it('Debe eliminar un control al llamar unregisterAnimation', () => {
    const mockControls = { start: vi.fn(), stop: vi.fn() };
    registerAnimation('sprite-1', mockControls as any);
    unregisterAnimation('sprite-1');

    const controls = getAnimationControls('sprite-1');
    expect(controls).toBeUndefined();
  });

  it('Debe limpiar todos los controles con clearAllAnimations', () => {
    registerAnimation('sprite-1', { start: vi.fn(), stop: vi.fn() } as any);
    registerAnimation('sprite-2', { start: vi.fn(), stop: vi.fn() } as any);
    clearAllAnimations();

    expect(getAnimationControls('sprite-1')).toBeUndefined();
    expect(getAnimationControls('sprite-2')).toBeUndefined();
  });
});