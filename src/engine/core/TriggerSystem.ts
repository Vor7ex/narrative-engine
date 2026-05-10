import type { Trigger, ConditionalTrigger } from '../types';
import { useGameStateStore } from './GameStateStore';
import { playAnimationSequence } from './AnimationPlayer';

class TriggerSystem {
  private static instance: TriggerSystem;

  private constructor() {}

  static getInstance(): TriggerSystem {
    if (!TriggerSystem.instance) {
      TriggerSystem.instance = new TriggerSystem();
    }
    return TriggerSystem.instance;
  }

  async dispatch(trigger: Trigger): Promise<void> {
    if (trigger.type === 'composite') {
      await trigger.sequence.reduce(
        (p, t) => p.then(() => this.dispatch(t)),
        Promise.resolve()
      );
      return;
    }

    if (trigger.type === 'play-animation') {
      await playAnimationSequence(trigger.animation);
      return;
    }

    useGameStateStore.getState().set((prev) => {
      switch (trigger.type) {
        case 'navigate-scene':
          return { currentSceneId: trigger.sceneId };
        case 'navigate-dialogue':
          return { activeDialogueId: trigger.dialogueId };
        case 'set-flag':
          return {
            flags: {
              ...prev.flags,
              [trigger.key]: trigger.value,
            },
          };
        case 'play-audio':
        case 'stop-audio':
          return {};
        default:
          return {};
      }
    });
  }

  async dispatchConditional(conditional: ConditionalTrigger): Promise<void> {
    const state = useGameStateStore.getState();

    if (conditional.condition && !conditional.condition(state)) {
      return;
    }

    await this.dispatch(conditional.trigger);
  }
}

export const triggerSystem = TriggerSystem.getInstance();