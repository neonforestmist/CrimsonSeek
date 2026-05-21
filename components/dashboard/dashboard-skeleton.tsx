import { GlassCard } from "@/components/ui/glass-card";

function Bar({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-full bg-gradient-to-r from-canvas-soft via-divider to-canvas-soft ${className ?? ""}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <GlassCard intensity="elevated" padding="p-8">
          <Bar className="mb-5 h-3 w-20" />
          <Bar className="mb-2 h-3.5 w-full" />
          <Bar className="mb-2 h-3.5 w-[95%]" />
          <Bar className="mb-2 h-3.5 w-[88%]" />
          <Bar className="mb-2 h-3.5 w-[92%]" />
          <Bar className="h-3.5 w-[60%]" />
        </GlassCard>

        <GlassCard intensity="regular">
          <Bar className="mb-3 h-3 w-1/3" />
          <Bar className="h-40 w-full rounded-2xl" />
        </GlassCard>

        <div className="grid gap-3 sm:grid-cols-2">
          {[0, 1, 2, 3].map((i) => (
            <GlassCard key={i} intensity="subtle" padding="p-4">
              <Bar className="mb-3 h-3 w-1/2" />
              <Bar className="mb-2 h-3 w-full" />
              <Bar className="h-3 w-3/4" />
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <GlassCard intensity="elevated">
          <Bar className="mx-auto mb-5 h-3 w-24" />
          <Bar className="mx-auto h-40 w-40 rounded-full" />
        </GlassCard>
        <GlassCard>
          <Bar className="mb-3 h-3 w-1/3" />
          <Bar className="mb-2 h-3 w-full" />
          <Bar className="h-3 w-2/3" />
        </GlassCard>
      </div>
    </div>
  );
}
