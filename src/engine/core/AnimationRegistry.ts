import type { EngineAnimationControls } from '../types/animation';

const registry = new Map<string, EngineAnimationControls>();

export function registerAnimation(id: string, controls: EngineAnimationControls): void {
  if (registry.has(id)) {
    console.warn(`[AnimationRegistry] ID "${id}" ya está registrado. Sobreescribiendo. Asegúrate de que el componente anterior se desmontó correctamente.`);
  }
  registry.set(id, controls);
}

export function unregisterAnimation(id: string): void {
  registry.delete(id);
}

export function getAnimationControls(id: string): EngineAnimationControls | undefined {
  return registry.get(id);
}

export function clearAllAnimations(): void {
  registry.clear();
}