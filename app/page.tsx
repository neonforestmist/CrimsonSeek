import { DebateArena } from "@/components/arena/debate-arena";

export default function HomePage() {
  return (
    <main
      id="debate"
      className="relative min-h-[calc(100svh-56px)] overflow-visible lg:min-h-[calc(100dvh-56px)]"
    >
      <DebateArena />
    </main>
  );
}
