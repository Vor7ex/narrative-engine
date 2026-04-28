'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import type { DialogueScene } from '@/engine/types';
import { resolveLineId } from '@/engine/types';
import { TypewriterText } from './TypewriterText';
import { ResponseButtons } from './ResponseButtons';
import { triggerSystem } from '@/engine/core/TriggerSystem';
import { useGameStateStore } from '@/engine/core/GameStateStore';

interface DialogueBoxProps {
  dialogue: DialogueScene;
}

interface DialogueContentProps {
  dialogue: DialogueScene;
  initialNodeId: string;
}

function DialogueContent({ dialogue, initialNodeId }: DialogueContentProps) {
  const [currentNodeId, setCurrentNodeId] = useState(initialNodeId);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [showResponses, setShowResponses] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentNode = dialogue.nodes[currentNodeId];
  const currentLine = currentNode?.lines[currentLineIndex];

  const handleLineComplete = () => {
    if (!currentNode) return;

    if (currentLineIndex < currentNode.lines.length - 1) {
      setCurrentLineIndex((prev) => prev + 1);
    } else if (currentNode.responses && currentNode.responses.length > 0) {
      setShowResponses(true);
    } else if (currentNode.onComplete) {
      triggerSystem.dispatch(currentNode.onComplete);
    }
  };

  const handleResponseSelect = (nextNodeId: string | undefined) => {
    if (nextNodeId) {
      setCurrentNodeId(nextNodeId);
      setCurrentLineIndex(0);
      setShowResponses(false);
    } else {
      useGameStateStore.getState().set({ activeDialogueId: null });
    }
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [currentLineIndex, showResponses]);

  if (!currentNode || !currentLine) {
    return null;
  }

  const lineId = resolveLineId(currentLine, dialogue.id, currentNodeId, currentLineIndex);

  return (
    <div className="h-full flex flex-col border-t-4 border-black">
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 scrollbar-thin"
        style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-charcoal) transparent' }}
      >
        {dialogue.avatar && (
          <div className="mb-4 relative w-24 h-24">
            <Image
              src={dialogue.avatar.asset.src}
              alt=""
              fill
              className="object-contain"
            />
          </div>
        )}

        <TypewriterText
          key={lineId}
          text={currentLine.text}
          speed={currentLine.speed ?? 30}
          onComplete={handleLineComplete}
          lineId={lineId}
        />

        {showResponses && currentNode.responses && (
          <ResponseButtons
            responses={currentNode.responses}
            onSelect={handleResponseSelect}
          />
        )}
      </div>
    </div>
  );
}

export function DialogueBox({ dialogue }: DialogueBoxProps) {
  return (
    <DialogueContent
      key={dialogue.id}
      dialogue={dialogue}
      initialNodeId={dialogue.rootNodeId}
    />
  );
}
