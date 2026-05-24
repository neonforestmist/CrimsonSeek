import type { DebateAudit } from "@/components/arena/audit-types";

export const aiInvestmentAudit: DebateAudit = {
  arenaId: "ai-investment",
  userPosition: "AI is worth the investment for most companies right now.",
  crimsonPosition:
    "AI spending deserves a skeptical CFO lens because measurable ROI depends on workflow redesign, data readiness, governance, security, adoption, and disciplined value tracking.",
  verdict:
    "AI is worth serious experimentation, but CrimsonSeek wins this saved debate on the word most. The payoff is real for mature teams with clear use cases. For everyone else, the invoice arrives before the transformation.",
  searchMoments: [
    {
      id: "roi-scoreboard",
      label: "ROI scoreboard",
      query:
        "McKinsey BCG MIT NANDA generative AI enterprise ROI bottom line impact 2025",
      summary:
        "The first evidence check asks whether AI spending is broadly paying back. The source trail finds a split: adoption is loud, but enterprise-wide financial impact is still concentrated in a small high-performer group.",
      evidence: [
        {
          title: "The State of AI: Global Survey 2025",
          url: "https://www.mckinsey.com/capabilities/quantumblack/our-insights/the-state-of-ai",
          snippet:
            "McKinsey reports that meaningful enterprise-wide bottom-line impact from AI remains rare, with AI high performers representing about 6% of respondents.",
          sourceQuality: "Global executive survey and management research",
        },
        {
          title: "Are You Generating Value from AI? The Widening Gap",
          url: "https://www.bcg.com/publications/2025/are-you-generating-value-from-ai-the-widening-gap",
          snippet:
            "BCG finds only 5% of firms are generating strong AI value, while 35% are scaling AI and beginning to generate value.",
          sourceQuality: "Strategy consultancy research",
        },
        {
          title: "Scaling AI for results: Strategies from MIT Sloan Management Review",
          url: "https://mitsloan.mit.edu/ideas-made-to-matter/scaling-ai-results-strategies-mit-sloan-management-review",
          snippet:
            "MIT Sloan reports that researchers looking for examples of enterprises achieving major generative AI transformations did not find them, underscoring the gap between pilots and scaled results.",
          sourceQuality: "MIT Sloan business research coverage",
        },
      ],
    },
    {
      id: "implementation-drag",
      label: "Implementation drag",
      query:
        "Bain Gartner Deloitte generative AI proof of concept abandoned unclear business value data quality costs governance",
      summary:
        "The second evidence check asks whether buying tools is enough. The source trail says no with a straight face: pilots stall when data, risk controls, operating models, funding, and ownership are mushy.",
      evidence: [
        {
          title:
            "Gartner Predicts 30% of Generative AI Projects Will Be Abandoned After Proof of Concept By End of 2025",
          url: "https://www.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025",
          snippet:
            "Gartner attributes expected GenAI project abandonment to poor data quality, inadequate risk controls, escalating costs, and unclear business value.",
          sourceQuality: "Analyst forecast and enterprise technology research",
        },
        {
          title:
            "Generative AI virtually ubiquitous in global business as the technology spreads at a near-unprecedented rate",
          url: "https://www.bain.com/about/media-center/press-releases/2024/generative-ai-virtually-ubiquitous-in-global-business-as-the-technology-spreads-at-a-near-unprecedented-rate--bain--company-proprietary-survey/",
          snippet:
            "Bain says companies are budgeting about $5 million per year on average for generative AI activities and infrastructure, rising to $50 million for 20% of the largest companies.",
          sourceQuality: "Proprietary enterprise survey",
        },
        {
          title: "State of Generative AI in the Enterprise Q4",
          url: "https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/state-of-generative-ai.html",
          snippet:
            "Deloitte reports leaders are building bridges to ROI while recognizing that scaling GenAI requires patience, nuance, and governance work.",
          sourceQuality: "Global enterprise survey",
        },
      ],
    },
    {
      id: "governance-tax",
      label: "Governance tax",
      query:
        "Deloitte IBM Gartner AI governance risk controls responsible AI enterprise ROI security compliance",
      summary:
        "The third evidence check prices the boring stuff. The source trail shows that serious AI programs need governance, ownership, security, measurement, data foundations, and human oversight. Translation: the spreadsheet has legs.",
      evidence: [
        {
          title: "State of Generative AI in the Enterprise Q4",
          url: "https://www2.deloitte.com/us/en/pages/about-deloitte/articles/press-releases/state-of-generative-ai.html",
          snippet:
            "Deloitte finds 69% of respondents say fully implementing a generative AI governance strategy will take more than a year.",
          sourceQuality: "Global enterprise survey",
        },
        {
          title: "AI in Action 2024 Report",
          url: "https://www.ibm.com/think/reports/ai-in-action",
          snippet:
            "IBM says AI leaders differ through strategy, technical staffing, flexible infrastructure, accessible governed data, and targeted applications.",
          sourceQuality: "IBM and Harris Poll global business research",
        },
        {
          title:
            "Gartner Survey Finds 45% of Organizations With High AI Maturity Keep AI Projects Operational for at Least Three Years",
          url: "https://www.gartner.com/en/newsroom/press-releases/2025-06-30-gartner-survey-finds-forty-five-percent-of-organizations-with-high-artificial-intelligence-maturity-keep-artificial-intelligence-projects-operational-for-at-least-three-years",
          snippet:
            "Gartner finds high-maturity organizations are more likely to run ROI analysis, analyze risk factors, measure customer impact, and centralize AI governance and infrastructure.",
          sourceQuality: "Analyst survey on AI maturity",
        },
      ],
    },
  ],
  messages: [
    {
      id: "user-1",
      role: "user",
      content:
        "AI is worth the investment for most companies right now. The tools are cheap compared with labor, adoption is moving fast, and companies that wait will hand the learning curve to competitors.",
    },
    {
      id: "assistant-1",
      role: "assistant",
      searchMomentId: "roi-scoreboard",
      content:
        "Bold start. Tiny problem: the scoreboard is not a parade. McKinsey puts AI high performers at about 6%, BCG says only 5% are generating strong value, and MIT Sloan found major enterprise GenAI transformations hard to locate. AI can pay. Most companies are still looking for the receipt.",
    },
    {
      id: "user-2",
      role: "user",
      content:
        "But even modest gains justify the spend. If employees save a few hours a week on writing, coding, support, analysis, and sales prep, the ROI is obvious.",
    },
    {
      id: "assistant-2",
      role: "assistant",
      content:
        "Obvious ROI is usually where budgets go to nap. Time saved is not the same as cash captured. If the workflow does not change, the metric becomes vibes per seat. Cute dashboard, sad CFO.",
    },
    {
      id: "user-3",
      role: "user",
      content:
        "Companies have to learn by doing. Pilots are the price of capability. You do not build AI muscle by sitting out the cycle and reading trend reports.",
    },
    {
      id: "assistant-3",
      role: "assistant",
      searchMomentId: "implementation-drag",
      content:
        "Learning by doing is fine. Learning by funding a fog machine is not. Gartner flags abandoned GenAI proofs of concept from poor data, weak risk controls, cost creep, and unclear business value. Bain says spending is already real money. If the pilot has no owner, metric, or process change, it is not muscle. It is cardio in a meeting room.",
    },
    {
      id: "user-4",
      role: "user",
      content:
        "That is why the right move is to invest now but focus on use cases. Customer support, software development, finance operations, marketing, and knowledge management all have obvious productivity upside.",
    },
    {
      id: "assistant-4",
      role: "assistant",
      searchMomentId: "governance-tax",
      content:
        "Use cases matter, yes. The invoice has line items. Deloitte says most leaders expect GenAI governance to take more than a year. IBM points to strategy, technical staff, infrastructure, governed data, and targeted apps as the divider. Gartner's mature firms run ROI and risk analysis, then centralize governance. That is not plug-and-play. That is a program.",
    },
    {
      id: "user-5",
      role: "user",
      content:
        "Still, doing nothing is riskier. AI will reshape industries. The companies that build data pipelines, policies, and employee habits now will be ready when the tools get better.",
    },
    {
      id: "assistant-5",
      role: "assistant",
      searchMomentId: "roi-scoreboard",
      content:
        "I am not arguing for couch-based strategy. Invest where the pain is measurable and the workflow owner is awake. But your claim says most companies, right now. The evidence says winners are the disciplined minority: narrow use cases, redesigned processes, governed data, clear measurement, real adoption. Everyone else is buying a shiny intern with cloud bills.",
    },
    {
      id: "user-6",
      role: "user",
      content:
        "Most companies can start small, though. A few licenses, employee training, and internal champions are not huge bets. That is still investment, and it compounds.",
    },
    {
      id: "assistant-6",
      role: "assistant",
      searchMomentId: "implementation-drag",
      content:
        "Small starts are sane. The phrase worth the investment still needs a denominator. Licenses are the cover charge. The real tab is integration, data cleanup, review loops, security, retraining, procurement, vendor risk, and managers learning how to measure work without inventing nonsense KPIs. Compounding works when the principal is real.",
    },
  ],
};
