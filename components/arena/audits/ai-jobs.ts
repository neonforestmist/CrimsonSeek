import type { DebateAudit } from "@/components/arena/audit-types";

export const aiJobsAudit: DebateAudit = {
  arenaId: "ai-jobs",
  userPosition: "AI will create more good jobs than it destroys.",
  crimsonPosition:
    "AI will put workers at risk through displacement, deskilling, surveillance, wage pressure, and uneven bargaining power unless the gains are deliberately shared.",
  verdict:
    "AI can create real work. CrimsonSeek wins this saved debate because net jobs are not the same as good jobs: exposure is broad, transitions are painful, and productivity gains do not automatically land in paychecks.",
  searchMoments: [
    {
      id: "exposure-map",
      label: "Worker exposure map",
      query:
        "Pew Brookings ILO generative AI worker exposure jobs clerical women",
      summary:
        "The first evidence check asks whether job risk is just panic theater. The source trail surfaces a consistent picture: exposure is broad, office-heavy, and unevenly distributed across gender, education, wage, and occupation lines.",
      evidence: [
        {
          title: "Which U.S. Workers Are More Exposed to AI on Their Jobs?",
          url: "https://www.pewresearch.org/social-trends/2023/07/26/which-u-s-workers-are-more-exposed-to-ai-on-their-jobs/",
          snippet:
            "Pew estimates that 19% of U.S. workers were in the most AI-exposed jobs in 2022, with higher exposure among college-educated, higher-wage, Asian, White, and female workers.",
          sourceQuality: "Nonpartisan survey and labor-data analysis",
        },
        {
          title: "Generative AI, the American worker, and the future of work",
          url: "https://www.brookings.edu/articles/generative-ai-the-american-worker-and-the-future-of-work/",
          snippet:
            "Brookings finds more than 30% of workers could see at least half of their occupation's tasks disrupted by generative AI, with office and administrative roles especially exposed.",
          sourceQuality: "Think tank labor-market analysis",
        },
        {
          title:
            "Generative AI and Jobs: A global analysis of potential effects on job quantity and quality",
          url: "https://www.ilo.org/publications/generative-ai-and-jobs-global-analysis-potential-effects-job-quantity-and",
          snippet:
            "The ILO finds clerical work is the broad occupation group most exposed to generative AI and flags gendered risk because clerical jobs are a major source of female employment.",
          sourceQuality: "International labor research",
        },
      ],
    },
    {
      id: "net-jobs-skills",
      label: "Net jobs and skill gaps",
      query:
        "WEF Future of Jobs 2025 BLS AI employment projections McKinsey occupational transitions 2030",
      summary:
        "The second evidence check tests the optimistic net-jobs claim. The source trail finds credible growth signals, then ruins the confetti by showing churn, skill mismatch, and transitions landing hardest on workers with less cushion.",
      evidence: [
        {
          title:
            "Future of Jobs Report 2025: 78 Million New Job Opportunities by 2030 but Urgent Upskilling Needed",
          url: "https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/",
          snippet:
            "The World Economic Forum projects 170 million roles created and 92 million displaced by 2030, a net gain of 78 million, while warning that 39% of key skills may change.",
          sourceQuality: "Global employer survey and forecast",
        },
        {
          title: "AI impacts in BLS employment projections",
          url: "https://www.bls.gov/opub/ted/2025/ai-impacts-in-bls-employment-projections.htm",
          snippet:
            "BLS says AI may support demand for software developers and data infrastructure roles, but also documents competition and task change in occupations exposed to AI tools.",
          sourceQuality: "U.S. government labor projections",
        },
        {
          title: "Generative AI and the future of work in America",
          url: "https://www.mckinsey.com/mgi/our-research/generative-ai-and-the-future-of-work-in-america",
          snippet:
            "McKinsey estimates up to 30% of U.S. work hours could be automated by 2030 and that 12 million additional occupational transitions may be needed.",
          sourceQuality: "Management research institute report",
        },
      ],
    },
    {
      id: "job-quality-bargaining",
      label: "Job quality and bargaining",
      query:
        "OECD Employment Outlook 2023 AI labor market job quality NBER generative AI productivity substitution",
      summary:
        "The third evidence check asks who captures the AI dividend. The source trail finds productivity upside, but also warnings about job quality, surveillance, work intensity, and substitution when firms can codify worker skill into software.",
      evidence: [
        {
          title:
            "Artificial intelligence and jobs: No signs of slowing labour demand (yet)",
          url: "https://www.oecd.org/en/publications/2023/07/oecd-employment-outlook-2023_904bcef3/full-report/artificial-intelligence-and-jobs-no-signs-of-slowing-labour-demand-yet_5aebe670.html",
          snippet:
            "OECD reports limited evidence of slowing labor demand so far, but says job quality may be affected before job quantity through risks such as work intensity, privacy, bias, and accountability.",
          sourceQuality: "International policy and labor analysis",
        },
        {
          title: "Generative AI at Work",
          url: "https://www.nber.org/papers/w31161",
          snippet:
            "An NBER study of 5,179 customer support agents found a 14% average productivity lift from generative AI, with much larger gains for novice and lower-skilled workers.",
          sourceQuality: "Peer-reviewed-style working paper",
        },
        {
          title: "Generative AI and Firm Values",
          url: "https://www.nber.org/papers/w31222",
          snippet:
            "NBER researchers find market and labor-demand evidence consistent with a labor-technology substitution channel for firms whose workforces are highly exposed to generative AI.",
          sourceQuality: "Economic working paper",
        },
      ],
    },
  ],
  messages: [
    {
      id: "user-1",
      role: "user",
      content:
        "AI will create more good jobs than it destroys. Every major technology wave looks scary, then productivity rises, new industries appear, and people end up doing better work.",
    },
    {
      id: "assistant-1",
      role: "assistant",
      searchMomentId: "exposure-map",
      content:
        "That is the TED Talk version. The labor map is spicier. Pew, Brookings, and the ILO all show broad exposure, especially in office and clerical work. If AI can hit half your tasks, the question is not just new jobs. It is who keeps power when the spreadsheet learns to type back.",
    },
    {
      id: "user-2",
      role: "user",
      content:
        "Exposure does not mean destruction. It can mean help. AI handles the dull stuff, humans move up the value chain, and boring work gets automated away.",
    },
    {
      id: "assistant-2",
      role: "assistant",
      content:
        "Moving up the value chain is a gorgeous phrase until rent is due Friday. A tool that removes dull tasks can also remove entry-level ladders, compress teams, and let managers say five people can now do the work of nine. Congrats, the boring task left. So did the training ground.",
    },
    {
      id: "user-3",
      role: "user",
      content:
        "But the macro picture is positive. WEF expects a net gain in jobs, and BLS shows strong growth in software, data, cybersecurity, and AI-adjacent roles.",
    },
    {
      id: "assistant-3",
      role: "assistant",
      searchMomentId: "net-jobs-skills",
      content:
        "Net gain is doing Olympic-level hand-waving there. WEF also says 92 million roles get displaced and 39% of key skills change. McKinsey sees 12 million U.S. occupational transitions. BLS growth in AI-adjacent jobs is real, but a displaced claims processor does not magically respawn as a machine-learning engineer with dental.",
    },
    {
      id: "user-4",
      role: "user",
      content:
        "People can retrain. Companies need workers who know the business, so it makes sense to upskill employees instead of tossing them aside.",
    },
    {
      id: "assistant-4",
      role: "assistant",
      searchMomentId: "job-quality-bargaining",
      content:
        "Sure, if firms choose patience over margin. OECD's warning is the quiet part: job quality can take the hit before headcount does. More monitoring, faster pace, thinner discretion, algorithmic evaluation, more stress. A job can survive and still get worse. That is not a victory parade, that is a badge swipe with vibes.",
    },
    {
      id: "user-5",
      role: "user",
      content:
        "Productivity still matters. If AI helps novice workers perform better, that can spread opportunity and raise wages instead of killing jobs.",
    },
    {
      id: "assistant-5",
      role: "assistant",
      searchMomentId: "job-quality-bargaining",
      content:
        "The NBER call-center result is genuinely hopeful: novices got a big lift. But it also shows the playbook being absorbed into the tool. Once software captures know-how, employers can share the gains, or they can redesign jobs, lower bargaining power, and buy fewer ladders. My side is not anti-AI. It is anti-fairytale. Good jobs require worker power, not just better autocomplete.",
    },
  ],
};
