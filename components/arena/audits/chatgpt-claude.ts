import type { DebateAudit } from "@/components/arena/audit-types";

export const chatgptClaudeAudit: DebateAudit = {
  arenaId: "chatgpt-claude",
  userPosition: "ChatGPT is better than Claude for serious work.",
  crimsonPosition:
    "Claude is better for serious work when the job rewards judgment, long context, careful writing, and code edits over app surface area.",
  verdict:
    "ChatGPT wins on ecosystem gravity. Claude wins this saved debate on work quality: sharper writing, steadier long-context reasoning, and benchmark-grade coding credibility without the dashboard confetti.",
  searchMoments: [
    {
      id: "work-benchmarks",
      label: "Serious work baseline",
      query: "Claude Sonnet 4.5 GPT-5 serious work coding agents benchmark",
      summary:
        "The first evidence check asks whether Claude is a vibes pick or a serious-work contender. The sources show ChatGPT has a huge work story, but Claude is explicitly built and marketed for coding, agents, computer use, and domain-heavy work.",
      evidence: [
        {
          title: "Introducing Claude Sonnet 4.5",
          url: "https://www.anthropic.com/news/claude-sonnet-4-5",
          snippet:
            "Anthropic positions Sonnet 4.5 around coding, agents, computer use, and demanding professional domains, which puts Claude directly in the serious-work lane.",
          sourceQuality: "Primary source",
        },
        {
          title: "GPT-5 is here",
          url: "https://openai.com/gpt-5",
          snippet:
            "OpenAI frames GPT-5 as a work model for writing, research, analysis, coding, and problem solving, making this a real frontier comparison rather than a mascot fight.",
          sourceQuality: "Primary source",
        },
        {
          title: "Claude 4.5 Sonnet vs GPT-5",
          url: "https://artificialanalysis.ai/models/comparisons/claude-4-5-sonnet-thinking-vs-gpt-5",
          snippet:
            "Artificial Analysis provides side-by-side model comparisons across benchmark families, pricing, and speed so the debate can leave brand loyalty at the door.",
          sourceQuality: "Independent model analysis",
        },
      ],
    },
    {
      id: "coding-editing",
      label: "Coding and edit quality",
      query: "Aider leaderboard Claude Sonnet OpenAI GPT coding benchmark",
      summary:
        "The second evidence check pressures the claim that ChatGPT is automatically the safer professional coding choice. Coding benchmarks and web-development arenas keep Claude models in the top conversation, especially for edit-heavy workflows.",
      evidence: [
        {
          title: "Aider LLM Leaderboards",
          url: "https://aider.chat/docs/leaderboards/",
          snippet:
            "Aider tracks real code editing performance across models and has repeatedly shown Claude Sonnet models as strong choices for practical file-editing work.",
          sourceQuality: "Coding benchmark",
        },
        {
          title: "Introducing GPT-5 for developers",
          url: "https://openai.com/index/introducing-gpt-5-for-developers",
          snippet:
            "OpenAI reports strong GPT-5 coding performance and agentic workflow gains, which sets a high bar Claude still has to clear in real developer work.",
          sourceQuality: "Primary source",
        },
        {
          title: "LMArena Leaderboard",
          url: "https://lmarena.ai/leaderboard/",
          snippet:
            "LMArena's crowd-judged leaderboards include frontier Claude and OpenAI models near the top of coding and web-development comparisons.",
          sourceQuality: "Crowdsourced arena signal",
        },
      ],
    },
    {
      id: "workflow-judgment",
      label: "Workflow judgment",
      query: "Claude extended thinking long context professional writing workflow TechCrunch",
      summary:
        "The third evidence check looks past raw benchmark scores and asks which assistant behaves better inside messy work. Claude's case is strongest when the task needs disciplined prose, context retention, and a calm model that does not turn every memo into a product launch.",
      evidence: [
        {
          title: "Claude 3.7 Sonnet and Claude Code",
          url: "https://www.anthropic.com/news/claude-3-7-sonnet",
          snippet:
            "Anthropic describes Claude 3.7 Sonnet as a hybrid reasoning model and says it optimized for real-world tasks that reflect how businesses use language models.",
          sourceQuality: "Primary source",
        },
        {
          title: "Anthropic launches a new AI model that thinks as long as you want",
          url: "https://techcrunch.com/2025/02/24/anthropic-launches-a-new-ai-model-that-thinks-as-long-as-you-want/",
          snippet:
            "TechCrunch covered Anthropic's extended-thinking push and Claude Code, highlighting a product direction aimed at complex, developer-facing work.",
          sourceQuality: "Technology reporting",
        },
        {
          title: "Introducing upgrades to Codex",
          url: "https://openai.com/index/introducing-upgrades-to-codex/",
          snippet:
            "OpenAI's Codex upgrades show ChatGPT's ecosystem strength, but also narrow the comparison to specific workflows where Claude can still win on output judgment.",
          sourceQuality: "Primary source",
        },
      ],
    },
  ],
  messages: [
    {
      id: "user-1",
      role: "user",
      content:
        "ChatGPT is better for serious work. It has the ecosystem, the tools, the memory, the apps, and everyone already knows how to use it.",
    },
    {
      id: "assistant-1",
      role: "assistant",
      searchMomentId: "work-benchmarks",
      content:
        "Nice opener, but that is a distribution argument wearing a hard hat. The sources say ChatGPT is absolutely a work platform. They also say Claude is built for coding, agents, computer use, and domain-heavy work. Serious work is not a popularity contest. It is output under pressure, and Claude belongs in that ring.",
    },
    {
      id: "user-2",
      role: "user",
      content:
        "But ChatGPT is better across more tasks. I can write, code, analyze files, use images, search, and bounce between projects in one place.",
    },
    {
      id: "assistant-2",
      role: "assistant",
      content:
        "Range is useful. So is not turning every task into a buffet. Claude's edge is focus: cleaner prose, fewer jazz hands, better handling of dense context, and less urge to over-format a serious answer into a carnival brochure.",
    },
    {
      id: "user-3",
      role: "user",
      content:
        "For coding, ChatGPT still feels safer. Codex, GPT-5, and the developer ecosystem make it the obvious pick.",
    },
    {
      id: "assistant-3",
      role: "assistant",
      searchMomentId: "coding-editing",
      content:
        "Obvious pick is doing a lot of cardio there. OpenAI's coding case is strong, yes. But Aider and LMArena keep Claude models in the front pack for practical coding and web-development work. If the job is editing a repo, preserving intent, and not spraying clever nonsense into a diff, Claude is not the backup singer. It is lead vocals.",
    },
    {
      id: "user-4",
      role: "user",
      content:
        "Even if Claude writes nicely, serious work needs reliability. ChatGPT is where businesses are investing.",
    },
    {
      id: "assistant-4",
      role: "assistant",
      searchMomentId: "workflow-judgment",
      content:
        "Enterprise adoption proves ChatGPT is easy to buy, not that it wins every desk. The evidence points to Claude's real-world workflow bet: extended thinking, Claude Code, long-context discipline, and business-task tuning. For legal drafts, strategy memos, code reviews, and thorny analysis, the boring superpower is judgment. Claude has teeth there.",
    },
    {
      id: "user-5",
      role: "user",
      content:
        "I still think ChatGPT is the default serious-work tool because it integrates with everything and keeps getting faster.",
    },
    {
      id: "assistant-5",
      role: "assistant",
      content:
        "Default, sure. Best, not automatic. ChatGPT is the office tower. Claude is the locked room where the hard paragraph, the weird bug, and the 40-page context dump get handled without fireworks. For serious work, I will take the assistant that reads like it is trying to understand the problem, not win the product demo.",
    },
  ],
};
