import { DebateArena } from "@/components/arena/debate-arena";

export default function HomePage() {
  return (
    <main
      id="debate"
      className="relative min-h-[calc(100dvh-56px)] overflow-visible lg:h-[calc(100dvh-56px)] lg:min-h-0 lg:overflow-hidden"
    >
      <DebateArena />
    </main>
  );
}
