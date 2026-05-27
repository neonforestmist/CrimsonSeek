import type { DebateAudit } from "@/components/arena/audit-types";

export const aiJobsAudit: DebateAudit = {
  "arenaId": "ai-jobs",
  "userPosition": "AI will create more good jobs than it destroys.",
  "crimsonPosition": "CrimsonSeek argues the worker-risk countercase with recent labor, adoption, displacement, and augmentation evidence.",
  "verdict": "This saved AI jobs audit keeps the optimism in view while pressuring the transition costs workers actually face.",
  "searchMoments": [
    {
      "id": "ai-jobs-transition-cost",
      "label": "Transition cost",
      "query": "AI jobs 2025 2026 labor market productivity displacement task exposure adoption BLS WEF Federal Reserve",
      "summary": "Checks whether productivity and new AI roles prove that workers will quickly land in better jobs.",
      "evidence": [
        {
          "title": "The Future of Jobs Report 2025",
          "url": "https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/2-jobs-outlook/",
          "snippet": "WEF projects both job creation and job displacement by 2030, including 170 million jobs created and 92 million displaced, for a net gain of 78 million jobs.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "AI impacts in BLS employment projections",
          "url": "https://www.bls.gov/opub/ted/2025/ai-impacts-in-bls-employment-projections.htm",
          "snippet": "BLS says AI is expected to primarily affect occupations whose core tasks can be most easily replicated by generative AI in its current form.",
          "sourceQuality": "Primary or official source"
        },
        {
          "title": "The State of Generative AI Adoption in 2025",
          "url": "https://www.stlouisfed.org/on-the-economy/2025/nov/state-generative-ai-adoption-2025",
          "snippet": "The St. Louis Fed finds work adoption rising, but generative AI accounted for 5.7% of work hours in August 2025 and reported time savings equal to 1.6% of all work hours.",
          "sourceQuality": "Research or institutional source"
        }
      ]
    },
    {
      "id": "ai-jobs-augmentation-limits",
      "label": "Augmentation limits",
      "query": "AI jobs 2025 augmentation replacement early career workers freelancers automation labor demand Stanford Brookings WEF",
      "summary": "Checks whether AI exposure is mostly augmentation or whether some workers are already seeing substitution pressure.",
      "evidence": [
        {
          "title": "Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence",
          "url": "https://digitaleconomy.stanford.edu/publications/canaries-in-the-coal-mine/",
          "snippet": "Stanford's ADP-based study finds early-career workers ages 22-25 in AI-exposed occupations experienced 16% relative employment declines, with declines concentrated where AI automates rather than augments labor.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "Is generative AI a job killer? Evidence from the freelance market",
          "url": "https://www.brookings.edu/articles/is-generative-ai-a-job-killer-evidence-from-the-freelance-market/",
          "snippet": "Brookings reports that freelancers in more AI-exposed occupations saw a 2% decline in contracts and a 5% drop in earnings after new AI software arrived.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "Skills outlook | The Future of Jobs Report 2025",
          "url": "https://www.weforum.org/publications/the-future-of-jobs-report-2025/in-full/3-skills-outlook/",
          "snippet": "WEF's skills analysis finds no assessed skill had very high current substitution capacity from GenAI, while many skills still face moderate or rising substitution pressure.",
          "sourceQuality": "Research or institutional source"
        }
      ]
    }
  ],
  "messages": [
    {
      "id": "user-1",
      "role": "user",
      "content": "AI is going to create more good jobs than it destroys. Every major technology scares people at first, but once companies learn how to use it, productivity rises, new roles appear, and people move into better work instead of wasting time on repetitive tasks."
    },
    {
      "id": "assistant-1",
      "role": "assistant",
      "searchMomentId": "ai-jobs-transition-cost",
      "content": "Maybe, but that skips the messy middle. Even the optimistic jobs outlook still includes serious churn: {{WEF still expects 92 million jobs displaced by 2030}}(1). BLS also frames the near-term risk around tasks GenAI can actually copy, not a clean upgrade path for every worker: {{GenAI most affects tasks it can replicate}}(2). And adoption is broad but still shallow enough that the better-jobs story is not proven yet: {{AI made up 5.7 percent of work hours}}(3)."
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "Exposure still does not mean replacement, though. If AI can draft an email, summarize a file, or help a junior analyst write code, that sounds like augmentation. People can spend less time on grind work and more time doing judgment, relationships, and creative problem-solving."
    },
    {
      "id": "assistant-2",
      "role": "assistant",
      "searchMomentId": "ai-jobs-augmentation-limits",
      "content": "That is the best version of the AI jobs case, and it is real in some work. The problem is that help and replacement depend on the task. Stanford found the pressure landing hardest on younger workers in exposed roles: {{AI-exposed early-career workers saw 16 percent employment declines}}(1). Brookings found exposed freelancers losing work and pay: {{AI-exposed freelancers saw fewer contracts and lower earnings}}(2). So the fair counter is not that AI replaces everyone. It is that augmentation only protects workers when companies design the job around the person: {{no skill had very high GenAI substitution capacity}}(3)."
    }
  ]
};
