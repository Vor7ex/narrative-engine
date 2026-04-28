'use client';

import type { DialogueResponse } from '@/engine/types';

interface ResponseButtonsProps {
  responses: DialogueResponse[];
  onSelect: (nextNodeId: string | undefined) => void;
}

export function ResponseButtons({ responses, onSelect }: ResponseButtonsProps) {
  return (
    <div className="mt-4 flex flex-col gap-2">
      {responses.map((response, index) => (
        <button
          key={index}
          className="bg-interactive text-text-primary px-4 py-2 border-2 border-black shadow-hard hover:shadow-hard-sm transition-shadow text-left"
          onClick={() => onSelect(response.nextNodeId ?? undefined)}
        >
          {response.label}
        </button>
      ))}
    </div>
  );
}