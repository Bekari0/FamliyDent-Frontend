import React from "react";
import type { ClinicSpace } from "@/lib/data/types";

interface ClinicSpaceSelectorProps {
  spaces: ClinicSpace[];
  activeSpaceId: string;
  onSelectSpace: (space: ClinicSpace) => void;
}

export function ClinicSpaceSelector({
  spaces,
  activeSpaceId,
  onSelectSpace,
}: ClinicSpaceSelectorProps) {
  return (
    <div className="flex flex-wrap md:flex-col gap-2 w-full">
      {spaces.map((space) => {
        const isActive = space.id === activeSpaceId;
        return (
          <button
            key={space.id}
            onClick={() => onSelectSpace(space)}
            className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 cursor-pointer flex items-center justify-between border ${
              isActive
                ? "bg-accent/15 border-accent/40 text-ink font-semibold shadow-sm"
                : "bg-paper border-rule text-muted hover:text-ink hover:bg-paper-2"
            }`}
          >
            <span className="text-sm font-medium">{space.title}</span>
            {isActive && <span className="w-2 h-2 rounded-full bg-accent shadow-[0_0_8px_var(--color-accent)]" />}
          </button>
        );
      })}
    </div>
  );
}
