import type { DebateAudit } from "@/components/arena/audit-types";

export const aiInvestmentAudit: DebateAudit = {
  "arenaId": "ai-investment",
  "userPosition": "AI is worth the investment for most companies right now.",
  "crimsonPosition": "CrimsonSeek argues the strongest current countercase in the AI Worth the Investment debate, with source material woven directly into the reply.",
  "verdict": "This saved AI investment audit argues for disciplined, measured adoption rather than blanket spending, with compact citations tied to business-risk evidence.",
  "searchMoments": [
    {
      "id": "pilot-to-value-gap",
      "label": "Pilot-to-value gap",
      "query": "AI investment counter-evidence on generative AI pilots, business value, data quality, risk controls, and project abandonment",
      "summary": "Fresh Linkup check using analyst and management research on why AI enthusiasm does not always become measurable business value.",
      "evidence": [
        {
          "title": "Gartner Predicts 30% of Generative AI Projects Will Be Abandoned After Proof of Concept By End of 2025",
          "url": "https://www.gartner.com/en/newsroom/press-releases/2024-07-29-gartner-predicts-30-percent-of-generative-ai-projects-will-be-abandoned-after-proof-of-concept-by-end-of-2025",
          "snippet": "Gartner attributed expected GenAI project abandonment to poor data quality, inadequate risk controls, escalating costs, and unclear business value.",
          "sourceQuality": "Analyst research"
        },
        {
          "title": "AI-Generated \"Workslop\" Is Destroying Productivity",
          "url": "https://hbr.org/2025/09/ai-generated-workslop-is-destroying-productivity",
          "snippet": "Harvard Business Review reported that many workers are using generative AI, but few are seeing it create real value.",
          "sourceQuality": "Research or institutional source"
        }
      ]
    },
    {
      "id": "roi-discipline",
      "label": "ROI discipline",
      "query": "AI investment counter-evidence on small productivity gains, work quality, ROI measurement, and governance requirements",
      "summary": "Fresh Linkup check on whether small task gains justify AI spending without measurement, review loops, and governance.",
      "evidence": [
        {
          "title": "AI-Generated \"Workslop\" Is Destroying Productivity",
          "url": "https://hbr.org/2025/09/ai-generated-workslop-is-destroying-productivity",
          "snippet": "Harvard Business Review describes workslop as AI-generated work that looks polished but creates extra burden for coworkers.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "Gartner Survey Finds 45% of Organizations With High AI Maturity Keep AI Projects Operational for at Least Three Years",
          "url": "https://www.gartner.com/en/newsroom/press-releases/2025-06-30-gartner-survey-finds-forty-five-percent-of-organizations-with-high-artificial-intelligence-maturity-keep-artificial-intelligence-projects-operational-for-at-least-three-years",
          "snippet": "Gartner says high-maturity organizations are more likely to run ROI analysis, analyze risks, measure customer impact, and centralize AI governance.",
          "sourceQuality": "Analyst research"
        }
      ]
    },
    {
      "id": "strategy-before-speed",
      "label": "Strategy before speed",
      "query": "AI investment counter-evidence on waiting, competitive advantage, proprietary data, governance, and agentic convergence",
      "summary": "Fresh Linkup check on whether moving fast with generic AI tools creates advantage or pushes firms toward the same decisions.",
      "evidence": [
        {
          "title": "Beware the Agentic Convergence Trap",
          "url": "https://hbr.org/2026/05/beware-the-agentic-convergence-trap",
          "snippet": "Harvard Business Review warns that firms using the same public signals can build the same model of the market and lose strategic variation.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "Gartner Survey Finds 45% of Organizations With High AI Maturity Keep AI Projects Operational for at Least Three Years",
          "url": "https://www.gartner.com/en/newsroom/press-releases/2025-06-30-gartner-survey-finds-forty-five-percent-of-organizations-with-high-artificial-intelligence-maturity-keep-artificial-intelligence-projects-operational-for-at-least-three-years",
          "snippet": "Gartner links AI maturity with ROI analysis, risk analysis, customer-impact measurement, and centralized AI governance.",
          "sourceQuality": "Analyst research"
        }
      ]
    }
  ],
  "messages": [
    {
      "id": "user-1",
      "role": "user",
      "content": "AI is worth the investment for most companies right now because the learning curve matters and tools are getting cheaper."
    },
    {
      "id": "assistant-1",
      "role": "assistant",
      "searchMomentId": "pilot-to-value-gap",
      "content": "Cheaper tools lower the entry fee, but they do not make the investment good. Gartner warned that GenAI pilots can fail for basic reasons like bad data, weak risk controls, rising costs, and unclear business value {{GenAI project abandonment was tied to poor data quality, inadequate risk controls, escalating costs, and unclear business value}}(1). HBR also reports that many workers use AI without seeing real value {{many workers are using generative AI, but few are seeing it create real value}}(2). The learning curve only helps if the work improves."
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "Even small gains in writing, coding, support, analysis, and sales prep can justify licenses and training."
    },
    {
      "id": "assistant-2",
      "role": "assistant",
      "searchMomentId": "roi-discipline",
      "content": "Small gains count, but only if they are real gains. HBR calls out workslop: AI output that looks polished but creates more work for coworkers {{AI-generated work can look polished but create extra burden for coworkers}}(1). Mature AI teams do more than buy seats; they measure ROI, risk, customer impact, and governance {{high-maturity organizations are more likely to run ROI analysis, analyze risks, measure customer impact, and centralize AI governance}}(2). Without that, licenses can become a very tidy waste."
    },
    {
      "id": "user-3",
      "role": "user",
      "content": "Companies that wait will lose process knowledge while competitors build habits, data pipelines, and governance."
    },
    {
      "id": "assistant-3",
      "role": "assistant",
      "searchMomentId": "strategy-before-speed",
      "content": "Waiting forever is bad, but rushing with the same generic tools can erase advantage. HBR warns that companies using the same public signals can end up building the same market model {{firms using the same public signals can build the same model of the market}}(1). The better counterplan is narrow investment with mature controls {{AI maturity is linked with ROI analysis, risk analysis, customer-impact measurement, and centralized governance}}(2). Move carefully where the payoff is measurable."
    }
  ]
};
