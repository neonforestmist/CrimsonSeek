import type { DebateAudit } from "@/components/arena/audit-types";

export const aiJobsAudit: DebateAudit = {
  "arenaId": "ai-jobs",
  "userPosition": "AI will create more good jobs than it destroys.",
  "crimsonPosition": "CrimsonSeek argues the strongest current countercase in the AI in Jobs debate, with source material woven directly into the reply.",
  "verdict": "This saved AI jobs audit keeps the countercase cautious and readable: productivity may rise, but job quality and job distribution are still unsettled.",
  "searchMoments": [
    {
      "id": "job-growth-uncertainty",
      "label": "Job growth uncertainty",
      "query": "AI jobs counter-evidence on productivity, employment effects, automation exposure, and labor market uncertainty",
      "summary": "Fresh Linkup check using labor research and official statistics to test whether productivity gains already prove net job creation.",
      "evidence": [
        {
          "title": "AI growth acceleration versus distributional fairness | Brookings",
          "url": "https://www.brookings.edu/articles/ai-growth-acceleration-versus-distributional-fairness/",
          "snippet": "Brookings cites tracker evidence that current measures of AI exposure, automation, and augmentation show no systematic relation to employment or unemployment changes.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "Productivity and Artificial Intelligence : U.S. Bureau of Labor Statistics",
          "url": "https://www.bls.gov/productivity/articles-and-research/ai-and-productivity/home.htm",
          "snippet": "BLS says AI has captured attention because researchers are still trying to track its development and its effect on workers and the economy.",
          "sourceQuality": "Primary or official source"
        }
      ]
    },
    {
      "id": "task-substitution-risk",
      "label": "Task substitution risk",
      "query": "AI jobs counter-evidence on task substitution, worker mobility, enterprise gains, and deskilling risk",
      "summary": "Fresh Linkup check using workforce research on whether AI mostly augments workers or starts replacing work tasks.",
      "evidence": [
        {
          "title": "AI, strategy, and the future of work: Oxford economist Jean-Paul Carvalho",
          "url": "https://www.mckinsey.com/capabilities/strategy-and-corporate-finance/our-insights/ai-strategy-and-the-future-of-work-oxford-economist-jean-paul-carvalho",
          "snippet": "McKinsey's interview says AI agents are becoming increasingly substitutable for human labor, with evidence of full substitutability in some tasks.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "The rise of the human-AI workforce | McKinsey",
          "url": "https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/the-rise-of-the-human-ai-workforce",
          "snippet": "McKinsey says most companies are not yet seeing meaningful enterprise-level gains from AI, even though the potential value is large.",
          "sourceQuality": "Research or institutional source"
        }
      ]
    },
    {
      "id": "retraining-gap",
      "label": "Retraining gap",
      "query": "AI jobs counter-evidence on retraining capacity, future skills, measurement gaps, and labor transition speed",
      "summary": "Fresh Linkup check using skills and economic-measurement sources to test whether retraining can absorb AI disruption fast enough.",
      "evidence": [
        {
          "title": "What are the most valuable skills for the jobs of the future? | World Economic Forum",
          "url": "https://www.weforum.org/videos/future-of-jobs-valuable-skills/",
          "snippet": "The World Economic Forum says AI and big data, leadership, and social influence will be high-demand skills over the next five years.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "AI & Economic Measurement | NBER",
          "url": "https://www.nber.org/programs-projects/projects-and-centers/8951-ai-economic-measurement",
          "snippet": "NBER's AI economic measurement project includes work on how traditional labor market and productivity measures may need changes to capture AI's effects.",
          "sourceQuality": "Research or institutional source"
        }
      ]
    }
  ],
  "messages": [
    {
      "id": "user-1",
      "role": "user",
      "content": "AI will create more good jobs than it destroys because it raises productivity and creates new roles around automation."
    },
    {
      "id": "assistant-1",
      "role": "assistant",
      "searchMomentId": "job-growth-uncertainty",
      "content": "Productivity can create jobs, but it does not guarantee good jobs for the same workers. Brookings points out that current AI exposure measures do not yet line up neatly with employment changes {{current measures of AI exposure, automation, and augmentation show no systematic relation to employment or unemployment changes}}(1). BLS is still studying how to track AI's effects on workers and the economy {{researchers are still trying to track AI's effect on workers and the economy}}(2). The honest counter is uncertainty, not automatic job growth."
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "Exposure to AI does not mean replacement. It means workers can offload boring tasks and move up the value chain."
    },
    {
      "id": "assistant-2",
      "role": "assistant",
      "searchMomentId": "task-substitution-risk",
      "content": "That can happen, but it is not the only path. Some AI agents are becoming substitutes for human labor in specific tasks {{AI agents are becoming increasingly substitutable for human labor}}(1), and many companies still are not seeing meaningful gains from AI at the enterprise level {{most companies are not yet seeing meaningful enterprise-level gains from AI}}(2). If the gains are weak, managers may cut tasks before they create better roles."
    },
    {
      "id": "user-3",
      "role": "user",
      "content": "Companies and schools can retrain people, so the upside should outweigh the disruption."
    },
    {
      "id": "assistant-3",
      "role": "assistant",
      "searchMomentId": "retraining-gap",
      "content": "Retraining helps, but it has to move as fast as the labor market changes. The skills list is shifting toward AI, data, leadership, and social influence {{AI and big data, leadership, and social influence will be high-demand skills over the next five years}}(1). At the same time, economists are still updating the basic measurements needed to see AI's labor effects clearly {{labor market and productivity measures may need changes to capture AI's effects}}(2). That is a shaky base for promising the upside will win."
    }
  ]
};
