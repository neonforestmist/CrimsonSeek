import type { DebateAudit } from "@/components/arena/audit-types";

export const phonesSchoolAudit: DebateAudit = {
  "arenaId": "phones-school",
  "userPosition": "Schools should ban phones during the school day.",
  "crimsonPosition": "CrimsonSeek argues for strict phone control during learning time without pretending a blanket day-long ban solves attention, mental health, safety, and access by itself.",
  "verdict": "This saved audit treats school phone bans as a real tool with real tradeoffs: clear restrictions, documented exceptions, and evidence-aware expectations.",
  "searchMoments": [
    {
      "id": "focus-without-overreach",
      "label": "Focus without overreach",
      "query": "2026 school phone bans smartphone use during school class bans full day bans test scores",
      "summary": "Current source trail checks whether distraction justifies a full-day ban or a tighter instruction-first policy.",
      "evidence": [
        {
          "title": "Smartphone Use During School Hours by US Youth",
          "url": "https://jamanetwork.com/journals/jama/article-abstract/2843506",
          "snippet": "JAMA reports that U.S. adolescents spend more than one hour per day on smartphones during school hours, with social media the largest use category.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "How US teens view school cellphone bans",
          "url": "https://www.pewresearch.org/short-reads/2026/01/13/about-4-in-10-teens-support-cellphone-bans-in-classrooms-fewer-back-all-day-restrictions/",
          "snippet": "Pew's fall 2025 teen survey found 41% support classroom cellphone bans, while only 17% support banning phones for the entire school day.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "National study of school cell phone bans shows benefits are not immediate",
          "url": "https://ed.stanford.edu/news/national-study-school-cell-phone-bans-shows-benefits-are-not-immediate",
          "snippet": "Stanford's summary of the NBER pouch study says strict pouch policies reduced phone use, but did not produce major short-term gains in test scores, attendance, classroom attention, or perceived cyberbullying.",
          "sourceQuality": "Research or institutional source"
        }
      ]
    },
    {
      "id": "exceptions-and-enforcement",
      "label": "Access and enforcement",
      "query": "2025 2026 school phone ban exceptions emergency IEP translation medical enforcement digital literacy",
      "summary": "Current source trail checks safety, accessibility, and implementation tradeoffs around phone-free school days.",
      "evidence": [
        {
          "title": "Cell Phone and Electronic Device Policy",
          "url": "https://www.schools.nyc.gov/DevicePolicy",
          "snippet": "NYC's 2025-26 phone-free policy stores devices bell-to-bell while allowing exceptions for medical monitoring, translation, IEP/504 needs, caregiving, and individual emergencies.",
          "sourceQuality": "Primary or official source"
        },
        {
          "title": "Curbing Cell Phone Use in Classrooms",
          "url": "https://www.nasbe.org/curbing-cell-phone-use-in-classrooms/",
          "snippet": "NASBE says bans alone will not address complicated online harms or teach appropriate technology use, and emphasizes stakeholder-informed policy design.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "Survey: Parents and teens support school cellphone bans",
          "url": "https://www.brookings.edu/articles/survey-parents-and-teens-support-school-cellphone-bans-and-most-dont-perceive-major-downsides/",
          "snippet": "Brookings reports that restrictions reduce phone use but do not eliminate it, with enforcement leakage still present under school policies.",
          "sourceQuality": "Research or institutional source"
        }
      ]
    }
  ],
  "messages": [
    {
      "id": "user-1",
      "role": "user",
      "content": "Schools should ban phones during the school day, not just during tests or lectures. The apps are engineered to win attention, and teenagers are being asked to out-discipline companies with billions of dollars. Even a phone in a backpack pulls people out of class, and lunch group chats turn small drama into everyone's problem before fifth period."
    },
    {
      "id": "assistant-1",
      "role": "assistant",
      "searchMomentId": "focus-without-overreach",
      "content": "The distraction problem is real, so I would not wave this away. The sharper answer is phones away during learning, not pretending a full-day ban fixes school by itself. Recent JAMA research makes the attention case concrete: {{students spend real school time on phones}}(1). But Pew found teens much more open to classroom bans than all-day bans: {{classroom limits have more legitimacy with students}}(2). And the national pouch study found lower phone use without automatic academic gains: {{phone-free systems are not an instant academic cure}}(3). Protect class time hard. Judge the rest by evidence."
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "I get that some students need a device for diabetes apps, translation, pickups, or real family emergencies. But once schools create a bunch of exceptions, the rule becomes hard for teachers to enforce. I would rather have one clean bell-to-bell rule, with the office handling emergencies, than another policy that only works for students who already follow rules."
    },
    {
      "id": "assistant-2",
      "role": "assistant",
      "searchMomentId": "exceptions-and-enforcement",
      "content": "A clean rule helps teachers. It just has to be clean about use, not blind about need. NYC's current model is useful because it is bell-to-bell and still protects medical monitoring, translation, IEP and 504 needs, caregiving, and emergencies: {{strict phone-free days still need protected access paths}}(1). NASBE makes the bigger point: {{removing the device is not teaching the habit}}(2). Brookings also found restrictions reduce use without making it disappear: {{strong rules still leave enforcement leakage}}(3). So yes: strong storage, no desk-by-desk bargaining, and real exceptions written down before the conflict starts."
    }
  ]
};
