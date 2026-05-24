import { DebateArena } from "@/components/arena/debate-arena";

export default function HomePage() {
  return (
    <main
      id="debate"
      className="relative h-[calc(100dvh-56px)] min-h-0 overflow-hidden"
    >
      <DebateArena />
    </main>
  );
}
