import type { DebateAudit } from "@/components/arena/audit-types";

export const phonesSchoolAudit: DebateAudit = {
  "arenaId": "phones-school",
  "userPosition": "Schools should ban phones during the school day.",
  "crimsonPosition": "CrimsonSeek argues the strongest current countercase in the Phones in School debate, with source material woven directly into the reply.",
  "verdict": "This saved Phones in School audit argues for a stricter-but-not-blanket approach, using readable counterpoints and clear inline evidence.",
  "searchMoments": [
    {
      "id": "ban-vs-skills",
      "label": "Ban vs skills",
      "query": "Phones in school counter-evidence on full-day bans, student support, digital skills, and implementation challenges",
      "summary": "Fresh Linkup check using teen survey data and government consultation material on phone restrictions, digital skills, and policy pilots.",
      "evidence": [
        {
          "title": "Internet & Technology - Research and data from Pew Research Center",
          "url": "https://www.pewresearch.org/topic/internet-technology/",
          "snippet": "Pew reports that about one in five teens support banning cellphones during the entire school day, including lunch and time between classes.",
          "sourceQuality": "Research or institutional source"
        },
        {
          "title": "Growing up in the online world: a national conversation - GOV.UK",
          "url": "https://www.gov.uk/government/consultations/growing-up-in-the-online-world-a-national-consultation/growing-up-in-the-online-world-a-national-conversation",
          "snippet": "The UK consultation is testing social media bans, curfews, and daily limits to learn about implementation challenges and potential impact.",
          "sourceQuality": "Primary or official source"
        }
      ]
    },
    {
      "id": "restriction-not-chaos",
      "label": "Restriction, not chaos",
      "query": "Phones in school counter-evidence on simple rules, exceptions, existing restrictions, and teacher workload",
      "summary": "Fresh Linkup check on whether schools need an all-day ban or clearer restriction policies with room for legitimate exceptions.",
      "evidence": [
        {
          "title": "The Children's Wellbeing and School Act passes into law | Children's Commissioner for England",
          "url": "https://www.childrenscommissioner.gov.uk/news-and-blogs/the-childrens-wellbeing-and-school-act-passes-into-law/",
          "snippet": "The Children's Commissioner says the overwhelming majority of schools were already restricting device use before the new school smartphone ban.",
          "sourceQuality": "Primary or official source"
        },
        {
          "title": "Growing up in the online world: a national conversation - GOV.UK",
          "url": "https://www.gov.uk/government/consultations/growing-up-in-the-online-world-a-national-consultation/growing-up-in-the-online-world-a-national-conversation",
          "snippet": "The UK consultation says pilots will test different interventions and show the implementation challenges of bans, curfews, and limits.",
          "sourceQuality": "Primary or official source"
        }
      ]
    },
    {
      "id": "attention-and-self-control",
      "label": "Attention and self-control",
      "query": "Phones in school counter-evidence on classroom attention, digital self-control, exam cheating, and healthy technology habits",
      "summary": "Fresh Linkup check using exam malpractice data and digital-skills policy material to test whether bans alone teach responsible behavior.",
      "evidence": [
        {
          "title": "Thousands of students risk their qualifications by taking phones into exam hall as GCSE and A Level exams begin - GOV.UK",
          "url": "https://www.gov.uk/government/news/thousands-of-students-risk-their-qualifications-by-taking-phones-into-exam-hall-as-gcse-and-a-level-exams-begin",
          "snippet": "Ofqual warned that 2,225 cases of student malpractice involved mobile phones or smart devices in the previous summer exam series.",
          "sourceQuality": "Primary or official source"
        },
        {
          "title": "Growing up in the online world: a national conversation - GOV.UK",
          "url": "https://www.gov.uk/government/consultations/growing-up-in-the-online-world-a-national-consultation/growing-up-in-the-online-world-a-national-conversation",
          "snippet": "The UK consultation says children need digital skills for social life, school, and future jobs that may not yet exist.",
          "sourceQuality": "Primary or official source"
        }
      ]
    }
  ],
  "messages": [
    {
      "id": "user-1",
      "role": "user",
      "content": "Schools should ban phones during the school day because students cannot focus with a social slot machine nearby."
    },
    {
      "id": "assistant-1",
      "role": "assistant",
      "searchMomentId": "ban-vs-skills",
      "content": "The focus problem is real, but a full-day ban may skip the harder lesson. Only about one in five teens support banning phones for the entire school day {{about one in five teens support banning cellphones during the entire school day}}(1), and governments are still testing bans, curfews, and limits to see what actually works {{pilots are testing social media bans, curfews, and daily limits to learn about implementation challenges and impact}}(2). Class restrictions make sense; pretending phones disappear does not."
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "Exceptions make bans messy, but teachers need simple rules and a real break from notifications and group chats."
    },
    {
      "id": "assistant-2",
      "role": "assistant",
      "searchMomentId": "restriction-not-chaos",
      "content": "Teachers do need simple rules. The counter is that simple does not have to mean total. Most schools were already restricting device use before national bans arrived {{the overwhelming majority of schools were already restricting device use}}(1), and policy pilots are still studying the implementation problems around bans, curfews, and limits {{pilots will show the implementation challenges of bans, curfews, and limits}}(2). A clear class-time rule can protect attention without making every health, access, or travel case a discipline fight."
    },
    {
      "id": "user-3",
      "role": "user",
      "content": "Digital self-control can wait. Classrooms should protect attention first."
    },
    {
      "id": "assistant-3",
      "role": "assistant",
      "searchMomentId": "attention-and-self-control",
      "content": "Attention should come first during lessons, but self-control cannot wait forever. Exam halls already have strict rules, yet thousands of phone and smart-device malpractice cases still happened {{2,225 cases of student malpractice involved mobile phones or smart devices}}(1). Schools also have to prepare students for a future where digital skills matter {{children need digital skills for social life, school, and future jobs}}(2). So the stronger policy is tight classroom control plus coached responsibility."
    }
  ]
};
