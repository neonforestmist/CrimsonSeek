import type { DebateAudit } from "@/components/arena/audit-types";

export const aiInvestmentAudit: DebateAudit = {
  "arenaId": "ai-investment",
  "userPosition": "AI is worth the investment for most companies right now.",
  "crimsonPosition": "CrimsonSeek argues the disciplined-investment side: AI can be useful, but broad spending only makes sense when ROI, workflow fit, data readiness, and governance are already clear.",
  "verdict": "This saved AI investment audit pushes against blanket AI spending while staying practical: invest narrowly, measure honestly, and scale only where the work actually improves.",
  "searchMoments": [
    {
      "id": "roi-before-rush",
      "label": "ROI before rush",
      "query": "2025 enterprise generative AI ROI pilots adoption financial impact implementation risk",
      "summary": "Recent enterprise AI research shows a sharp gap between broad experimentation and measurable business value.",
      "evidence": [
        {
          "title": "The GenAI Divide: State of AI in Business 2025",
          "url": "https://mlq.ai/media/quarterly_decks/v0.1_State_of_AI_in_Business_2025_Report.pdf",
          "snippet": "MIT NANDA's 2025 report describes high enterprise experimentation but a much smaller share of pilots reaching measurable financial impact.",
          "sourceQuality": "Research report"
        },
        {
          "title": "IBM Study: CEOs Double Down on AI While Navigating Enterprise Hurdles",
          "url": "https://newsroom.ibm.com/2025-05-06-ibm-study-ceos-double-down-on-ai-while-navigating-enterprise-hurdles",
          "snippet": "IBM's 2025 CEO study reports that only 25% of AI initiatives have delivered expected ROI, and only 16% have scaled enterprise-wide.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "From Potential to Profit: Closing the AI Impact Gap",
          "url": "https://www.bcg.com/publications/2025/closing-the-ai-impact-gap",
          "snippet": "BCG says companies seeing significant AI value focus on a small set of initiatives, change core processes, upskill teams, and measure returns.",
          "sourceQuality": "Analyst research"
        }
      ]
    },
    {
      "id": "small-gains-real-costs",
      "label": "Small gains, real costs",
      "query": "2025 2026 enterprise AI productivity ROI measurement infrastructure cost governance operational fit",
      "summary": "Recent adoption and infrastructure research suggests small productivity gains only matter when they survive measurement, integration, review, and operating costs.",
      "evidence": [
        {
          "title": "2025 AI Adoption Report: Gen AI Fast-Tracks Into the Enterprise",
          "url": "https://knowledge.wharton.upenn.edu/special-report/2025-ai-adoption-report/",
          "snippet": "Wharton's 2025 enterprise report frames GenAI adoption as moving from experimentation toward disciplined ROI measurement.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "Gartner Says AI Projects in I&O Stall Ahead of Meaningful ROI Returns",
          "url": "https://www.gartner.com/en/newsroom/press-releases/2026-04-07-gartner-says-artificial-intelligence-projects-in-infrastructure-and-operations-stall-ahead-of-meaningful-roi-returns",
          "snippet": "Gartner says AI ROI depends less on model sophistication and more on integration, governance, and alignment with real operational needs.",
          "sourceQuality": "Analyst research"
        },
        {
          "title": "AI Infrastructure Spending Caps Historic Year at ~$90 Billion in Q4 2025",
          "url": "https://www.idc.com/resource-center/blog/ai-infrastructure-spending-caps-historic-year-at-90-billion-in-q4-2025-2029-spending-to-eclipse-1-trillion/",
          "snippet": "IDC describes AI capacity as becoming a structural cost for enterprises operating at scale.",
          "sourceQuality": "Analyst research"
        }
      ]
    }
  ],
  "messages": [
    {
      "id": "user-1",
      "role": "user",
      "content": "AI is worth the investment for most companies right now. Even if the first projects are messy, the cost of waiting is higher: teams need reps, leaders need to learn where AI actually fits, and competitors are already wiring it into support, sales, coding, and analysis."
    },
    {
      "id": "assistant-1",
      "role": "assistant",
      "searchMomentId": "roi-before-rush",
      "content": "Starting now can be smart, but 'most companies' is doing too much work. The current enterprise picture is not buy AI, get leverage; it is learn carefully or burn budget. Broad experimentation still leaves {{most pilots short of measurable financial impact}}(1), CEOs report {{only a quarter of AI initiatives met ROI expectations}}(2), and the winners concentrate on {{a small set of measured workflows}}(3). So yes, invest, but only where the business case is boringly clear."
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "I still think the upside is practical. If people save time on writing, coding, support, reporting, and sales prep, the gains do not have to be perfect to matter. A company can start with cheap tools, train people, and let the strongest use cases prove themselves."
    },
    {
      "id": "assistant-2",
      "role": "assistant",
      "searchMomentId": "small-gains-real-costs",
      "content": "Small wins are real, but they are easy to double-count. A faster draft still needs review, a support answer still needs escalation rules, and a coding assistant still rides on security, data, and cloud costs. Even bullish enterprise data treats {{ROI measurement as the grown-up part}}(1). Gartner says returns depend on {{integration, governance, and operational fit}}(2), while IDC says AI capacity is becoming {{a structural cost at enterprise scale}}(3). That is not anti-AI; it is anti-vibes."
    }
  ]
};
