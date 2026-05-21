import { SearchForm } from "@/components/home/search-form";
import { ModesSection } from "@/components/sections/section-modes";
import { DashboardSection } from "@/components/sections/section-dashboard";

export default function HomePage() {
  return (
    <>
      <main className="relative flex min-h-screen flex-col items-center justify-center px-4 pb-20 pt-28 sm:px-6 sm:pb-28 sm:pt-36 md:pt-44">
        <div
          className="w-full max-w-[960px]"
          style={{
            animation: "page-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both",
          }}
        >
          <h1 className="mb-5 text-balance text-center text-[40px] font-semibold leading-[0.98] text-ink sm:mb-6 sm:text-[62px] sm:leading-[0.96] md:text-[92px]">
            Investigative search
            <br className="hidden sm:block" />
            <span className="sm:hidden">{" "}</span>
            with{" "}
            <span className="crimson-mark">CrimsonSeek</span>
          </h1>

          <p className="mx-auto mb-8 mt-3 max-w-[620px] text-balance text-center text-[15px] leading-relaxed text-ink-soft sm:mb-12 sm:mt-4 sm:text-[16.5px] md:text-[18px]">
            Web intelligence for evolving narratives. Track how the
            discourse around any topic shifts across modular time
            periods, sourced from broad web retrieval by Linkup.
          </p>

          <SearchForm />
        </div>
      </main>

      <ModesSection />
      <DashboardSection />
    </>
  );
}
