import type { Depth, FullSearchResult, LinkupImageResult } from "@/lib/linkup";
import demoCache from "@/lib/demo-cache.json";

export type DemoIconName = "phone" | "brain" | "glasses" | "truck" | "code";

export interface DemoScenario {
  slug: string;
  title: string;
  eyebrow: string;
  summary: string;
  icon: DemoIconName;
  query: string;
  depth: Depth;
  maxResults: number;
  fromDate: string;
  toDate: string;
  rangeLabel: string;
  command: string;
  result: FullSearchResult;
}

function mockCommand({
  query,
  depth,
  maxResults,
  fromDate,
  toDate,
}: {
  query: string;
  depth: Depth;
  maxResults: number;
  fromDate: string;
  toDate: string;
}) {
  return `linkup.search({
  q: "${query}",
  depth: "${depth}",
  outputType: ["sourcedAnswer", "structured", "searchResults"],
  maxResults: ${maxResults},
  fromDate: "${fromDate}",
  toDate: "${toDate}",
  includeImages: true
})`;
}

const DEMO_RANGE = {
  fromDate: "2026-01-01",
  toDate: "2026-05-20",
  rangeLabel: "Jan 1 to May 20, 2026",
};

function mockImages(
  slug: string,
  images: Array<{
    name: string;
    sourceName: string;
    caption: string;
    palette: string[];
  }>
): LinkupImageResult[] {
  return images.map((image, index) => ({
    type: "image",
    name: image.name,
    url: `https://demo.crimsonseek.local/${slug}/image-${index + 1}`,
    sourceName: image.sourceName,
    sourceUrl: `https://demo.crimsonseek.local/${slug}/visual-${index + 1}`,
    caption: image.caption,
    palette: image.palette,
  }));
}

const CACHED_DEMO_RESULTS = (
  demoCache as { results?: Record<string, FullSearchResult> }
).results ?? {};

function demoResult(slug: string, fallback: FullSearchResult): FullSearchResult {
  return CACHED_DEMO_RESULTS[slug] ?? fallback;
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    slug: "iphone-17-pro",
    title: "iPhone 17 Pro reviews",
    eyebrow: "Consumer tech",
    summary:
      "A premium phone launch with strong camera praise, practical buyer hesitation, and price sensitivity.",
    icon: "phone",
    query: "iPhone 17 Pro reviews and reception",
    depth: "standard",
    maxResults: 12,
    ...DEMO_RANGE,
    command: mockCommand({
      query: "iPhone 17 Pro reviews and reception",
      depth: "standard",
      maxResults: 12,
      ...DEMO_RANGE,
    }),
    result: demoResult("iphone-17-pro", {
      query: "iPhone 17 Pro reviews and reception",
      depth: "standard",
      fromDate: DEMO_RANGE.fromDate,
      toDate: DEMO_RANGE.toDate,
      answer: {
        answer:
          "Simulated result: The dashboard would frame the iPhone 17 Pro conversation as broadly positive, but not breathless. Reviewers and early buyers cluster around camera speed, thermals, and battery consistency, while upgrade hesitation centers on launch pricing and whether the AI features feel useful in daily use.\n\nThe strongest signal is practical enthusiasm. People sound impressed by the hardware, but they are comparing it closely against recent Pro models before deciding whether the upgrade is worth it.",
        sources: [
          {
            name: "Review roundup: camera and thermal notes",
            url: "https://demo.crimsonseek.local/iphone-17-pro/review-roundup",
            snippet:
              "A simulated editorial roundup highlighting camera responsiveness, sustained performance, and tradeoffs around price.",
          },
          {
            name: "Buyer forum: upgrade intent thread",
            url: "https://demo.crimsonseek.local/iphone-17-pro/buyer-forum",
            snippet:
              "Mock community discussion where owners compare upgrade value against the previous two Pro generations.",
          },
          {
            name: "Carrier preorder tracker",
            url: "https://demo.crimsonseek.local/iphone-17-pro/preorders",
            snippet:
              "Simulated demand signal showing strong early interest with regional variation in higher storage models.",
          },
          {
            name: "Camera samples and creator reactions",
            url: "https://demo.crimsonseek.local/iphone-17-pro/camera-samples",
            snippet:
              "Mock creator reactions focused on low-light capture, action stabilization, and color consistency.",
          },
        ],
      },
      images: mockImages("iphone-17-pro", [
        {
          name: "Camera sample comparison grid",
          sourceName: "Creator review",
          caption:
            "Low-light and motion samples drive the most visible praise in the review cycle.",
          palette: ["#111827", "#f97316", "#fed7aa"],
        },
        {
          name: "Preorder demand heatmap",
          sourceName: "Carrier tracker",
          caption:
            "Premium storage models show stronger demand in the simulated early preorder read.",
          palette: ["#0f766e", "#14b8a6", "#ccfbf1"],
        },
        {
          name: "Upgrade comparison board",
          sourceName: "Buyer forum",
          caption:
            "Owners compare the 17 Pro against the previous two Pro generations before upgrading.",
          palette: ["#334155", "#94a3b8", "#f8fafc"],
        },
      ]),
      sentiment: {
        overall_tone: "positive",
        positive_pct: 64,
        neutral_pct: 24,
        negative_pct: 12,
        hype_score: 76,
        controversy_score: 31,
        one_line_verdict:
          "People are excited by the polish, but the upgrade case has to survive the price conversation.",
        themes: [
          {
            title: "Camera speed",
            sentiment: "positive",
            summary:
              "Reviewers repeatedly praise faster capture, cleaner zoom, and stronger motion handling.",
            share_of_voice: 29,
          },
          {
            title: "Battery trust",
            sentiment: "positive",
            summary:
              "Early owner chatter treats battery life as more dependable under heavy use.",
            share_of_voice: 22,
          },
          {
            title: "Upgrade math",
            sentiment: "neutral",
            summary:
              "Buyers are interested, but many are weighing the difference from recent Pro models.",
            share_of_voice: 26,
          },
          {
            title: "Launch price",
            sentiment: "negative",
            summary:
              "The biggest complaint is that the premium tier keeps stretching what feels reasonable.",
            share_of_voice: 16,
          },
        ],
        notable_quotes: [
          {
            quote:
              "The camera feels like the thing that finally made the Pro model feel fast again.",
            sentiment: "positive",
            source: "Creator review",
          },
          {
            quote:
              "It looks great, but my 16 Pro is not suddenly obsolete.",
            sentiment: "neutral",
            source: "Buyer forum",
          },
          {
            quote:
              "The sticker shock is doing more damage than any missing feature.",
            sentiment: "negative",
            source: "Tech comments",
          },
        ],
      },
    }),
  },
  {
    slug: "gpt-5-launch",
    title: "GPT-5 launch reception",
    eyebrow: "AI platforms",
    summary:
      "A high-hype AI launch where workflow gains, benchmark skepticism, access, and safety share the room.",
    icon: "brain",
    query: "GPT-5 launch reception, reviews, and reactions",
    depth: "deep",
    maxResults: 25,
    ...DEMO_RANGE,
    command: mockCommand({
      query: "GPT-5 launch reception, reviews, and reactions",
      depth: "deep",
      maxResults: 25,
      ...DEMO_RANGE,
    }),
    result: demoResult("gpt-5-launch", {
      query: "GPT-5 launch reception, reviews, and reactions",
      depth: "deep",
      fromDate: DEMO_RANGE.fromDate,
      toDate: DEMO_RANGE.toDate,
      answer: {
        answer:
          "Simulated result: The GPT-5 launch dashboard would show a high-energy but divided conversation. Builders focus on stronger reasoning, code execution, and agent workflows. Skeptics ask whether benchmark gains translate into reliable production behavior, while enterprise users care most about latency, cost, governance, and migration paths.\n\nThe public tone is positive overall, but the controversy score is elevated because people are debating capability claims, access tiers, and how fast automation should move into knowledge work.",
        sources: [
          {
            name: "Developer migration thread",
            url: "https://demo.crimsonseek.local/gpt-5/developer-migration",
            snippet:
              "Mock developer reactions comparing reliability, tool calling, and coding workflows against prior models.",
          },
          {
            name: "Enterprise AI buyer memo",
            url: "https://demo.crimsonseek.local/gpt-5/enterprise-memo",
            snippet:
              "Simulated enterprise analysis focused on governance, latency, deployment cost, and rollout pressure.",
          },
          {
            name: "AI benchmark debate roundup",
            url: "https://demo.crimsonseek.local/gpt-5/benchmark-debate",
            snippet:
              "Mock roundup of benchmark praise, reproducibility questions, and real-world task comparisons.",
          },
          {
            name: "Safety and automation discussion",
            url: "https://demo.crimsonseek.local/gpt-5/safety-discussion",
            snippet:
              "Simulated discussion around agent autonomy, misuse, and workplace displacement concerns.",
          },
        ],
      },
      images: mockImages("gpt-5", [
        {
          name: "Agent workflow diagram",
          sourceName: "Developer migration thread",
          caption:
            "Builders focus on multi-step coding, tool use, and reliability under real workloads.",
          palette: ["#b93b1f", "#f7967a", "#fff1ec"],
        },
        {
          name: "Enterprise rollout readiness board",
          sourceName: "Enterprise buyer memo",
          caption:
            "Governance, latency, and migration cost are the practical adoption filters.",
          palette: ["#188038", "#81c995", "#e6f4ea"],
        },
        {
          name: "Benchmark debate snapshot",
          sourceName: "AI benchmark debate roundup",
          caption:
            "Public charts praise the jump while developers ask for task-level proof.",
          palette: ["#fbbc04", "#fdd663", "#fff7d6"],
        },
      ]),
      sentiment: {
        overall_tone: "mixed",
        positive_pct: 52,
        neutral_pct: 28,
        negative_pct: 20,
        hype_score: 90,
        controversy_score: 58,
        one_line_verdict:
          "The launch feels important, but the market wants proof that the gains survive real work.",
        themes: [
          {
            title: "Agent workflows",
            sentiment: "positive",
            summary:
              "Builders are excited about more capable planning, coding, and multi-step tool use.",
            share_of_voice: 31,
          },
          {
            title: "Benchmark trust",
            sentiment: "neutral",
            summary:
              "The loudest debate asks whether benchmark deltas reflect everyday reliability.",
            share_of_voice: 23,
          },
          {
            title: "Access tiers",
            sentiment: "negative",
            summary:
              "Some users worry that the best experience will sit behind expensive or limited plans.",
            share_of_voice: 18,
          },
          {
            title: "Enterprise rollout",
            sentiment: "positive",
            summary:
              "Teams see a clearer path to production if governance and latency meet expectations.",
            share_of_voice: 17,
          },
          {
            title: "Automation anxiety",
            sentiment: "negative",
            summary:
              "Concerns cluster around job displacement, model agency, and weak oversight.",
            share_of_voice: 11,
          },
        ],
        notable_quotes: [
          {
            quote:
              "The coding demos are impressive, but I want to see the boring production metrics.",
            sentiment: "neutral",
            source: "Developer forum",
          },
          {
            quote:
              "This is the first model release that makes agent roadmaps feel less speculative.",
            sentiment: "positive",
            source: "AI product lead",
          },
          {
            quote:
              "The capability jump is exciting and uncomfortable at the same time.",
            sentiment: "negative",
            source: "Policy discussion",
          },
        ],
      },
    }),
  },
  {
    slug: "vision-pro-year-in",
    title: "Vision Pro a year in",
    eyebrow: "Spatial computing",
    summary:
      "A long-tail adoption read with enterprise pilots, comfort complaints, and content gap discussion.",
    icon: "glasses",
    query: "Apple Vision Pro one year later, public reaction and adoption",
    depth: "deep",
    maxResults: 25,
    ...DEMO_RANGE,
    command: mockCommand({
      query: "Apple Vision Pro one year later, public reaction and adoption",
      depth: "deep",
      maxResults: 25,
      ...DEMO_RANGE,
    }),
    result: demoResult("vision-pro-year-in", {
      query: "Apple Vision Pro one year later, public reaction and adoption",
      depth: "deep",
      fromDate: DEMO_RANGE.fromDate,
      toDate: DEMO_RANGE.toDate,
      answer: {
        answer:
          "Simulated result: The Vision Pro conversation would read as mixed and unusually segmented. Enthusiasts still talk about immersion, remote work experiments, and enterprise visualization. Mainstream buyers focus on comfort, price, and the feeling that the app ecosystem has not caught up to the hardware.\n\nThe dashboard would make the split clear: the product earns respect, but broad adoption remains constrained by daily wearability and a thin set of must-use experiences.",
        sources: [
          {
            name: "Owner retention survey",
            url: "https://demo.crimsonseek.local/vision-pro/owner-retention",
            snippet:
              "Mock owner data separating heavy weekly use from occasional demo use and returns.",
          },
          {
            name: "Enterprise pilot notes",
            url: "https://demo.crimsonseek.local/vision-pro/enterprise-pilots",
            snippet:
              "Simulated pilots for design review, training, medicine, and field support workflows.",
          },
          {
            name: "Developer ecosystem watch",
            url: "https://demo.crimsonseek.local/vision-pro/dev-ecosystem",
            snippet:
              "Mock app ecosystem tracker showing strong demos but uneven repeat-use software.",
          },
          {
            name: "Comfort and ergonomics thread",
            url: "https://demo.crimsonseek.local/vision-pro/comfort-thread",
            snippet:
              "Simulated owner discussion around weight, fit, sessions longer than an hour, and accessories.",
          },
        ],
      },
      images: mockImages("vision-pro", [
        {
          name: "Spatial workspace mock",
          sourceName: "Owner retention survey",
          caption:
            "Power users keep returning to virtual monitors and focused work sessions.",
          palette: ["#4f46e5", "#a5b4fc", "#eef2ff"],
        },
        {
          name: "Enterprise pilot storyboard",
          sourceName: "Enterprise pilot notes",
          caption:
            "Design review, medicine, and field support create the clearest specialist use cases.",
          palette: ["#0f766e", "#5eead4", "#ecfeff"],
        },
        {
          name: "Comfort complaint cluster",
          sourceName: "Comfort and ergonomics thread",
          caption:
            "Weight, fit, and long-session fatigue remain the most visible adoption drag.",
          palette: ["#be123c", "#fb7185", "#fff1f2"],
        },
      ]),
      sentiment: {
        overall_tone: "mixed",
        positive_pct: 38,
        neutral_pct: 34,
        negative_pct: 28,
        hype_score: 47,
        controversy_score: 45,
        one_line_verdict:
          "The product still feels futuristic, but the everyday reason to wear it is not universal yet.",
        themes: [
          {
            title: "Immersive work",
            sentiment: "positive",
            summary:
              "Power users praise focused workspaces, virtual monitors, and high-end media sessions.",
            share_of_voice: 24,
          },
          {
            title: "Comfort limits",
            sentiment: "negative",
            summary:
              "Weight, fit, and fatigue remain the most consistent practical complaints.",
            share_of_voice: 27,
          },
          {
            title: "Enterprise pilots",
            sentiment: "positive",
            summary:
              "Companies see promise in training, visualization, and specialist workflows.",
            share_of_voice: 19,
          },
          {
            title: "App drought",
            sentiment: "negative",
            summary:
              "Users want more daily software that justifies the hardware after the novelty fades.",
            share_of_voice: 21,
          },
          {
            title: "Demo effect",
            sentiment: "neutral",
            summary:
              "The device remains easy to show off, but demos do not always convert to routine use.",
            share_of_voice: 9,
          },
        ],
        notable_quotes: [
          {
            quote:
              "It is still the best demo in tech, and still hard to wear every day.",
            sentiment: "neutral",
            source: "Owner survey",
          },
          {
            quote:
              "For design review, it solved a meeting problem we had for years.",
            sentiment: "positive",
            source: "Enterprise pilot",
          },
          {
            quote:
              "I love the screen and hate the decision to put it on after work.",
            sentiment: "negative",
            source: "User forum",
          },
        ],
      },
    }),
  },
  {
    slug: "cybertruck-reactions",
    title: "Cybertruck owner reactions",
    eyebrow: "EV ownership",
    summary:
      "A polarizing vehicle read with strong identity signaling, reliability anxiety, and heavy social debate.",
    icon: "truck",
    query: "Tesla Cybertruck owner reactions after delivery",
    depth: "standard",
    maxResults: 12,
    ...DEMO_RANGE,
    command: mockCommand({
      query: "Tesla Cybertruck owner reactions after delivery",
      depth: "standard",
      maxResults: 12,
      ...DEMO_RANGE,
    }),
    result: demoResult("cybertruck-reactions", {
      query: "Tesla Cybertruck owner reactions after delivery",
      depth: "standard",
      fromDate: DEMO_RANGE.fromDate,
      toDate: DEMO_RANGE.toDate,
      answer: {
        answer:
          "Simulated result: The Cybertruck dashboard would show the highest controversy in the gallery. Owners who love it praise acceleration, utility, attention, and the feeling of driving something unlike anything else. Critics and frustrated owners center the conversation on service wait times, fit-and-finish, range expectations, and whether the design is practical.\n\nThe result is a classic identity product: enthusiasm is real, but so is the backlash.",
        sources: [
          {
            name: "Owner delivery diary cluster",
            url: "https://demo.crimsonseek.local/cybertruck/delivery-diaries",
            snippet:
              "Mock owner posts comparing first-week excitement with early service and usability notes.",
          },
          {
            name: "EV forum reliability thread",
            url: "https://demo.crimsonseek.local/cybertruck/reliability-thread",
            snippet:
              "Simulated discussion of service tickets, panel alignment, software updates, and range variance.",
          },
          {
            name: "Truck utility comparison",
            url: "https://demo.crimsonseek.local/cybertruck/utility-comparison",
            snippet:
              "Mock comparison between Cybertruck use cases and conventional pickup expectations.",
          },
          {
            name: "Social reaction monitor",
            url: "https://demo.crimsonseek.local/cybertruck/social-monitor",
            snippet:
              "Simulated social listening report showing outsized attention compared with ownership volume.",
          },
        ],
      },
      images: mockImages("cybertruck", [
        {
          name: "Delivery diary photo grid",
          sourceName: "Owner delivery diary cluster",
          caption:
            "First-week excitement sits beside service notes and usability tradeoffs.",
          palette: ["#27272a", "#a1a1aa", "#f4f4f5"],
        },
        {
          name: "Service ticket timeline",
          sourceName: "EV forum reliability thread",
          caption:
              "Repair timing and parts availability create the sharpest owner pushback.",
          palette: ["#b91c1c", "#f87171", "#fee2e2"],
        },
        {
          name: "Social attention map",
          sourceName: "Social reaction monitor",
          caption:
            "Attention is outsized compared with ownership volume, which fuels polarization.",
          palette: ["#7c2d12", "#fb923c", "#ffedd5"],
        },
      ]),
      sentiment: {
        overall_tone: "mixed",
        positive_pct: 34,
        neutral_pct: 26,
        negative_pct: 40,
        hype_score: 68,
        controversy_score: 78,
        one_line_verdict:
          "Owners either love the statement or are exhausted by the compromises around it.",
        themes: [
          {
            title: "Identity pull",
            sentiment: "positive",
            summary:
              "Fans describe the vehicle as fun, distinctive, and emotionally satisfying.",
            share_of_voice: 25,
          },
          {
            title: "Service friction",
            sentiment: "negative",
            summary:
              "Complaints focus on repair timelines, part availability, and inconsistent handoff experiences.",
            share_of_voice: 27,
          },
          {
            title: "Utility debate",
            sentiment: "neutral",
            summary:
              "Owners disagree on whether the design helps or hurts daily truck use.",
            share_of_voice: 19,
          },
          {
            title: "Range reality",
            sentiment: "negative",
            summary:
              "Some drivers report a gap between expected and experienced range under real loads.",
            share_of_voice: 17,
          },
          {
            title: "Attention economy",
            sentiment: "positive",
            summary:
              "Even critical threads acknowledge the vehicle dominates attention wherever it appears.",
            share_of_voice: 12,
          },
        ],
        notable_quotes: [
          {
            quote:
              "Every errand turns into a conversation, which is either the point or the problem.",
            sentiment: "neutral",
            source: "Owner diary",
          },
          {
            quote:
              "It is ridiculous in the best way when it works exactly as promised.",
            sentiment: "positive",
            source: "EV forum",
          },
          {
            quote:
              "The service experience made the future feel very unfinished.",
            sentiment: "negative",
            source: "Reliability thread",
          },
        ],
      },
    }),
  },
  {
    slug: "rust-vs-zig",
    title: "Rust vs Zig in 2026",
    eyebrow: "Developer tools",
    summary:
      "A language ecosystem comparison with adoption momentum, build simplicity, and production risk signals.",
    icon: "code",
    query: "Rust vs Zig adoption and developer reactions in 2026",
    depth: "deep",
    maxResults: 25,
    ...DEMO_RANGE,
    command: mockCommand({
      query: "Rust vs Zig adoption and developer reactions in 2026",
      depth: "deep",
      maxResults: 25,
      ...DEMO_RANGE,
    }),
    result: demoResult("rust-vs-zig", {
      query: "Rust vs Zig adoption and developer reactions in 2026",
      depth: "deep",
      fromDate: DEMO_RANGE.fromDate,
      toDate: DEMO_RANGE.toDate,
      answer: {
        answer:
          "Simulated result: The Rust vs Zig dashboard would show a developer conversation that is more comparative than hostile. Rust is treated as the safer production bet with a mature ecosystem, stronger hiring market, and proven reliability story. Zig earns admiration for simplicity, compile-time control, cross-compilation, and the feeling that systems programming can be less ceremonial.\n\nThe split is not winner-take-all. The likely dashboard read is Rust for production confidence, Zig for teams optimizing for control, portability, and a lighter mental model.",
        sources: [
          {
            name: "Developer survey slice",
            url: "https://demo.crimsonseek.local/rust-zig/developer-survey",
            snippet:
              "Mock survey split by production usage, learning intent, and toolchain satisfaction.",
          },
          {
            name: "Systems language hiring tracker",
            url: "https://demo.crimsonseek.local/rust-zig/hiring-tracker",
            snippet:
              "Simulated hiring signal comparing Rust job demand with emerging Zig usage.",
          },
          {
            name: "Build systems comparison",
            url: "https://demo.crimsonseek.local/rust-zig/build-systems",
            snippet:
              "Mock technical discussion around package managers, cross-compilation, and dependency overhead.",
          },
          {
            name: "Production postmortem collection",
            url: "https://demo.crimsonseek.local/rust-zig/postmortems",
            snippet:
              "Simulated engineering writeups on safety, velocity, maintenance, and ecosystem maturity.",
          },
        ],
      },
      images: mockImages("rust-zig", [
        {
          name: "Ecosystem maturity matrix",
          sourceName: "Developer survey slice",
          caption:
            "Rust scores higher on production confidence while Zig leads on simplicity.",
          palette: ["#ea580c", "#fdba74", "#fff7ed"],
        },
        {
          name: "Hiring signal chart",
          sourceName: "Systems language hiring tracker",
          caption:
            "Rust has the stronger hiring market, while Zig shows rising experimentation.",
          palette: ["#962f18", "#fbbfaa", "#fff1ec"],
        },
        {
          name: "Toolchain comparison sketch",
          sourceName: "Build systems comparison",
          caption:
            "Cross-compilation and dependency overhead shape the most practical comparison.",
          palette: ["#166534", "#86efac", "#f0fdf4"],
        },
      ]),
      sentiment: {
        overall_tone: "positive",
        positive_pct: 48,
        neutral_pct: 37,
        negative_pct: 15,
        hype_score: 54,
        controversy_score: 35,
        one_line_verdict:
          "Developers respect Rust's maturity and like Zig's restraint, so the debate is mostly about fit.",
        themes: [
          {
            title: "Production trust",
            sentiment: "positive",
            summary:
              "Rust is praised for safety guarantees, libraries, and proof in serious infrastructure.",
            share_of_voice: 30,
          },
          {
            title: "Tooling simplicity",
            sentiment: "positive",
            summary:
              "Zig wins affection for cross-compilation, directness, and fewer layers.",
            share_of_voice: 25,
          },
          {
            title: "Learning curve",
            sentiment: "neutral",
            summary:
              "Rust's complexity is accepted by many teams, while Zig's model feels approachable but younger.",
            share_of_voice: 18,
          },
          {
            title: "Ecosystem maturity",
            sentiment: "negative",
            summary:
              "Zig skeptics point to package maturity, docs, and fewer production references.",
            share_of_voice: 15,
          },
          {
            title: "Hiring signal",
            sentiment: "neutral",
            summary:
              "Rust shows stronger hiring demand, while Zig shows stronger curiosity and experimentation.",
            share_of_voice: 12,
          },
        ],
        notable_quotes: [
          {
            quote:
              "Rust is what I would choose when the pager is mine.",
            sentiment: "positive",
            source: "Infrastructure engineer",
          },
          {
            quote:
              "Zig makes me feel like I can see the whole program again.",
            sentiment: "positive",
            source: "Systems forum",
          },
          {
            quote:
              "The question is not which language wins, it is where the failure mode matters.",
            sentiment: "neutral",
            source: "Engineering blog",
          },
        ],
      },
    }),
  },
];
