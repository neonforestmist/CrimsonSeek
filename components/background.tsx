"use client";

/**
 * Background: a calm, consistent material wash shared by every route.
 */
export function Background() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-0"
      style={{
        background:
          "linear-gradient(145deg, #fff6ef 0%, #f6eadf 48%, #eef0e9 100%)",
      }}
    >
      <div
        className="absolute inset-x-0 top-0 h-24 opacity-70"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.8), rgba(255,255,255,0))",
        }}
      />
    </div>
  );
}
