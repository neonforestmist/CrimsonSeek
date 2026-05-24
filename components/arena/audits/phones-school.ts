import type { DebateAudit } from "@/components/arena/audit-types";

export const phonesSchoolAudit: DebateAudit = {
  arenaId: "phones-school",
  userPosition: "Schools should ban phones during the school day.",
  crimsonPosition:
    "Schools should restrict phones hard during instruction, but blanket daylong bans are too blunt because safety, accessibility, enforcement, and digital self-management still matter.",
  verdict:
    "The ban side wins the distraction diagnosis. CrimsonSeek wins the policy argument: phone-free learning time, yes, but not a one-size-fits-all school day ban. The smarter rule is tight classroom restriction, clear storage, narrow exceptions, parent communication channels, and actual measurement instead of vibes with a confiscation bucket.",
  searchMoments: [
    {
      id: "distraction-baseline",
      label: "Distraction baseline",
      query:
        "UNESCO smartphones school distraction Pew teens smartphone access JAMA school hours smartphone use",
      summary:
        "The first evidence check asks whether phone distraction is real. The source cards say yes, but they also show why a serious policy has to manage a near-universal youth technology, not pretend it can be wished out of student life.",
      evidence: [
        {
          title:
            "Smartphones in school? Only when they clearly support learning",
          url: "https://www.unesco.org/en/articles/smartphones-school-only-when-they-clearly-support-learning",
          snippet:
            "UNESCO frames smartphones as a classroom disruption risk while still grounding school technology policy in whether a tool clearly supports learning.",
          sourceQuality: "International education policy source",
        },
        {
          title: "How Teens and Parents Approach Screen Time",
          url: "https://www.pewresearch.org/internet/2024/03/11/how-teens-and-parents-approach-screen-time/",
          snippet:
            "Pew reports that 95% of U.S. teens have access to a smartphone and that teens describe mixed emotional effects when they go without one.",
          sourceQuality: "Nonpartisan survey research",
        },
        {
          title: "Smartphone Engagement During School Hours Among US Youths",
          url: "https://jamanetwork.com/journals/jamanetworkopen/fullarticle/2837133",
          snippet:
            "JAMA Network Open measured active smartphone engagement during school hours, keeping the distraction concern anchored in observed behavior rather than hallway folklore.",
          sourceQuality: "Peer-reviewed medical journal",
        },
      ],
    },
    {
      id: "ban-outcomes",
      label: "Ban outcomes",
      query:
        "school cellphone bans academic achievement attendance Education Week NBER lockable pouches NCES phone restrictions",
      summary:
        "The second evidence check looks for the payoff. The evidence supports restrictions as a way to cut in-school phone access, but the academic and behavior results are mixed enough to make blanket-ban certainty look overcaffeinated.",
      evidence: [
        {
          title: "Do Student Cellphone Bans Improve Academic Achievement?",
          url: "https://www.edweek.org/technology/do-student-cellphone-bans-improve-academic-achievement/2026/05",
          snippet:
            "Education Week reports on national research finding that lockable pouch bans reduced phone use but did not clearly lift achievement, attendance, or attention in the short term.",
          sourceQuality: "Education reporting on national research",
        },
        {
          title:
            "The Effects of School Phone Bans: National Evidence from Lockable Pouches",
          url: "https://www.nber.org/papers/w35132",
          snippet:
            "NBER researchers found pouch adoption substantially reduced phone use, while first-year discipline and well-being effects were mixed and test-score gains were limited.",
          sourceQuality: "Economic research working paper",
        },
        {
          title:
            "New Schools Data Examine Violent Incidents, Bullying, Drug Possession, Restorative Practices, Security Staff, and More",
          url: "https://ies.ed.gov/learn/press-release/new-schools-data-examine-violent-incidents-bullying-drug-possession-restorative-practices-security",
          snippet:
            "NCES reported that 76% of U.S. public schools prohibited non-academic cellphone or smartphone use during school hours in 2021-22.",
          sourceQuality: "U.S. Department of Education data",
        },
      ],
    },
    {
      id: "exceptions-and-skills",
      label: "Exceptions and skills",
      query:
        "GOV.UK mobile phones schools reasonable adjustments APA adolescent social media coaching Education Week statewide cellphone ban local policy",
      summary:
        "The third evidence check tests the blanket part of the ban. The strongest sources keep pointing toward structured limits with exceptions, adult coaching, and local implementation instead of one rule pretending every student has the same life.",
      evidence: [
        {
          title: "Mobile phones in schools",
          url: "https://www.gov.uk/government/publications/mobile-phones-in-schools/mobile-phones-in-schools",
          snippet:
            "GOV.UK guidance supports phone-free schools by default, but it also names reasonable adjustments, medical needs, and individual circumstances that can require access.",
          sourceQuality: "Government guidance",
        },
        {
          title: "Health Advisory on Social Media Use in Adolescence",
          url: "https://www.apa.org/topics/social-media-internet/health-advisory-adolescent-social-media-use",
          snippet:
            "APA advises limits and boundaries alongside adult discussion, monitoring, and coaching, which supports digital habit-building rather than confiscation as a full strategy.",
          sourceQuality: "Professional psychology guidance",
        },
        {
          title: "These School Leaders Don't Want a Statewide Cellphone Ban. Here's Why",
          url: "https://www.edweek.org/technology/these-school-leaders-dont-want-a-statewide-cellphone-ban-heres-why/2026/02",
          snippet:
            "Education Week highlights school leaders arguing for local discretion, a useful check on statewide or districtwide blanket bans that ignore implementation realities.",
          sourceQuality: "Education policy reporting",
        },
      ],
    },
  ],
  messages: [
    {
      id: "user-1",
      role: "user",
      content:
        "Schools should ban phones during the school day. Kids cannot focus when a slot machine is buzzing in their pocket between every paragraph.",
    },
    {
      id: "assistant-1",
      role: "assistant",
      searchMomentId: "distraction-baseline",
      content:
        "Distraction is real. You win that diagnosis cleanly. But the evidence also says phones are near-universal teen infrastructure, not a weird contraband yo-yo. A school policy has to reduce classroom drag without pretending medical alerts, family logistics, accessibility, and digital life vanish at first bell.",
    },
    {
      id: "user-2",
      role: "user",
      content:
        "That sounds soft. If phones are allowed anywhere, they leak everywhere. Hallways, bathrooms, lunch, group chats, drama. Ban them bell to bell and students can breathe.",
    },
    {
      id: "assistant-2",
      role: "assistant",
      content:
        "Bell-to-bell sounds tidy because it deletes the mess from the sentence. In the building, someone has to search, store, track, exempt, return, punish, and answer parents. Congratulations, you invented a second attendance office that specializes in rectangles.",
    },
    {
      id: "user-3",
      role: "user",
      content:
        "Teachers already have enough work because of phones. A blanket ban makes enforcement simple: no phones, no arguments, no Snapchat court cases at lunch.",
    },
    {
      id: "assistant-3",
      role: "assistant",
      searchMomentId: "ban-outcomes",
      content:
        "Simple on paper, spicy in practice. The research trail says strict pouch-style bans can cut phone use, but the payoff on grades, attendance, attention, and behavior is mixed in the short term. If the cure needs constant policing and produces cloudy outcomes, maybe do not tattoo it onto every school day like sacred law.",
    },
    {
      id: "user-4",
      role: "user",
      content:
        "Cloudy outcomes are still better than letting students scroll through algebra. Schools are for learning, not managing every possible exception.",
    },
    {
      id: "assistant-4",
      role: "assistant",
      searchMomentId: "exceptions-and-skills",
      content:
        "Exceptions are not loopholes. They are students with diabetes monitors, disability accommodations, caregiving duties, transit needs, and messy home situations. Even pro-restriction guidance leaves room for them. The smarter policy is phone-free instruction, locked-away defaults, fast exceptions, and digital coaching. Less circus, more engineering.",
    },
    {
      id: "user-5",
      role: "user",
      content:
        "Digital coaching is nice in theory. In reality, kids need a clean break. Adults can barely handle phones. Why expect seventh graders to self-regulate?",
    },
    {
      id: "assistant-5",
      role: "assistant",
      content:
        "Do not expect them to self-regulate cold. Train it. Keep phones away during class, make lunch rules explicit, give families an office contact route, protect medical access, and measure whether the policy improves learning instead of just improving adult morale. A blanket ban is a hammer. Schools need a toolkit.",
    },
  ],
};
