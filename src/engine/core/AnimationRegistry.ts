const registry = new Map<string, unknown>();

export function registerAnimation(id: string, controls: unknown): void {
  registry.set(id, controls);
}

export function unregisterAnimation(id: string): void {
  registry.delete(id);
}

export function getAnimationControls(id: string): unknown {
  return registry.get(id);
}

export function clearAllAnimations(): void {
  registry.clear();
}