import type { ClinicSpace } from "@/lib/reference-content/types";

interface ClinicSpaceSelectorProps {
  spaces: readonly ClinicSpace[];
  activeSpaceId: string;
  onSelectSpace: (space: ClinicSpace) => void;
}

export function ClinicSpaceSelector({ spaces, activeSpaceId, onSelectSpace }: ClinicSpaceSelectorProps) {
  return (
    <nav className="flex w-full flex-wrap gap-2 md:flex-col" aria-label="Зоны клиники">
      {spaces.map((space) => {
        const isActive = space.id === activeSpaceId;
        return (
          <button
            key={space.id}
            type="button"
            aria-pressed={isActive}
            aria-controls="clinic-space-detail"
            onClick={() => onSelectSpace(space)}
            className={`flex min-h-11 w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-colors motion-reduce:transition-none ${
              isActive
                ? "border-accent/40 bg-accent/15 font-semibold text-ink shadow-sm"
                : "border-rule bg-paper text-editorial-muted hover:bg-paper-2 hover:text-ink"
            }`}
          >
            <span className="text-sm font-medium">{space.title}</span>
            {isActive && <span aria-hidden="true" className="h-2 w-2 rounded-full bg-accent" />}
          </button>
        );
      })}
    </nav>
  );
}
