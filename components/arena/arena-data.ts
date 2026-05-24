import {
  BadgeDollarSign,
  BrainCircuit,
  BriefcaseBusiness,
  MonitorSmartphone,
  School,
  Smartphone,
  Swords,
  type LucideIcon,
} from "lucide-react";

export type ArenaId =
  | "custom"
  | "chatgpt-claude"
  | "mac-windows"
  | "iphone-android"
  | "ai-jobs"
  | "phones-school"
  | "ai-investment";

export interface ArenaPreset {
  id: ArenaId;
  title: string;
  kicker: string;
  signal: string;
  prompt: string;
  stanceHint: string;
  opposition: string;
  icon: LucideIcon;
  tags: string[];
  sides?: {
    label: string;
    prompt: string;
    stanceHint: string;
  }[];
}

export interface EvidenceItem {
  title: string;
  url: string;
  snippet: string;
  sourceQuality: string;
}

export const ARENAS: ArenaPreset[] = [
  {
    id: "chatgpt-claude",
    title: "ChatGPT vs Claude",
    kicker: "Models, taste, serious work",
    signal: "Take a side in the model war and let CrimsonSeek argue the other one with benchmarks, user reports, and product evidence.",
    prompt: "ChatGPT is better than Claude for serious work.",
    stanceHint: "CrimsonSeek takes Claude's side and looks for evidence against your model preference.",
    opposition: "Claude may be better for long context, writing judgment, and some professional workflows.",
    icon: BrainCircuit,
    tags: ["AI", "LLMs", "tools"],
    sides: [
      {
        label: "ChatGPT",
        prompt: "ChatGPT is better than Claude for serious work.",
        stanceHint:
          "CrimsonSeek takes Claude's side and looks for evidence against your model preference.",
      },
      {
        label: "Claude",
        prompt: "Claude is better than ChatGPT for serious work.",
        stanceHint:
          "CrimsonSeek takes ChatGPT's side and looks for evidence against your model preference.",
      },
    ],
  },
  {
    id: "mac-windows",
    title: "Mac vs Windows",
    kicker: "Workflows, price, gaming",
    signal: "Argue your operating system loyalty and make CrimsonSeek find the strongest evidence for the other side.",
    prompt: "Macs are better than Windows PCs for most people.",
    stanceHint: "CrimsonSeek takes the Windows side and tests the claim against cost, repairability, gaming, compatibility, and upgrade paths.",
    opposition: "Windows may win on value, flexibility, games, enterprise compatibility, and hardware choice.",
    icon: MonitorSmartphone,
    tags: ["computers", "OS", "work"],
    sides: [
      {
        label: "Mac",
        prompt: "Macs are better than Windows PCs for most people.",
        stanceHint:
          "CrimsonSeek takes the Windows side and tests the claim against cost, repairability, gaming, compatibility, and upgrade paths.",
      },
      {
        label: "Windows",
        prompt: "Windows PCs are better than Macs for most people.",
        stanceHint:
          "CrimsonSeek takes the Mac side and tests the claim against reliability, portability, battery life, resale value, and creative workflows.",
      },
    ],
  },
  {
    id: "iphone-android",
    title: "iPhone vs Android",
    kicker: "Ecosystems, cameras, control",
    signal: "Pick the phone tribe you believe in and make CrimsonSeek argue the other side from real reviews and owner complaints.",
    prompt: "iPhone is better than Android for most people.",
    stanceHint: "CrimsonSeek takes Android's side and looks for evidence on cost, customization, repair, choice, and hardware variety.",
    opposition: "Android may offer better value, more device choice, more control, and faster hardware experimentation.",
    icon: Smartphone,
    tags: ["phones", "Apple", "Android"],
    sides: [
      {
        label: "iPhone",
        prompt: "iPhone is better than Android for most people.",
        stanceHint:
          "CrimsonSeek takes Android's side and looks for evidence on cost, customization, repair, choice, and hardware variety.",
      },
      {
        label: "Android",
        prompt: "Android is better than iPhone for most people.",
        stanceHint:
          "CrimsonSeek takes iPhone's side and looks for evidence on privacy, long-term updates, app quality, cameras, and ecosystem reliability.",
      },
    ],
  },
  {
    id: "ai-jobs",
    title: "AI in Jobs",
    kicker: "Productivity, layoffs, wages",
    signal: "Defend or attack workplace AI and CrimsonSeek will build the countercase from labor data, surveys, and real deployments.",
    prompt: "AI will create more good jobs than it destroys.",
    stanceHint: "CrimsonSeek argues the risk side with evidence on displacement, deskilling, surveillance, wage pressure, and uneven gains.",
    opposition: "AI may concentrate gains for employers while exposing workers to displacement, monitoring, and lower bargaining power.",
    icon: BriefcaseBusiness,
    tags: ["jobs", "AI", "labor"],
    sides: [
      {
        label: "AI helps workers",
        prompt: "AI will create more good jobs than it destroys.",
        stanceHint:
          "CrimsonSeek argues the risk side with evidence on displacement, deskilling, surveillance, wage pressure, and uneven gains.",
      },
      {
        label: "AI hurts workers",
        prompt: "AI will destroy more good jobs than it creates.",
        stanceHint:
          "CrimsonSeek argues the upside case with evidence on productivity, new roles, worker augmentation, lower barriers, and firm growth.",
      },
    ],
  },
  {
    id: "phones-school",
    title: "Phones in School",
    kicker: "Focus, safety, social life",
    signal: "Take a side on school phone bans and make CrimsonSeek argue the opposite using studies, teacher reports, and student realities.",
    prompt: "Schools should ban phones during the school day.",
    stanceHint: "CrimsonSeek argues against a blanket ban and looks for evidence on safety, accessibility, enforcement, and student autonomy.",
    opposition: "Strict bans may create safety, equity, enforcement, and accessibility problems even when distraction is real.",
    icon: School,
    tags: ["school", "phones", "teens"],
    sides: [
      {
        label: "Ban phones",
        prompt: "Schools should ban phones during the school day.",
        stanceHint:
          "CrimsonSeek argues against a blanket ban and looks for evidence on safety, accessibility, enforcement, and student autonomy.",
      },
      {
        label: "Allow phones",
        prompt: "Schools should allow phones during the school day.",
        stanceHint:
          "CrimsonSeek argues for stricter bans and looks for evidence on distraction, bullying, mental health, academic focus, and classroom management.",
      },
    ],
  },
  {
    id: "ai-investment",
    title: "AI Worth the Investment",
    kicker: "Budgets, ROI, hype cycles",
    signal: "Argue whether AI spending is rational or overhyped, then make CrimsonSeek hunt for the evidence that weakens your case.",
    prompt: "AI is worth the investment for most companies right now.",
    stanceHint: "CrimsonSeek takes the skeptical CFO position and tests the claim against ROI, implementation cost, reliability, and adoption risk.",
    opposition: "AI spending may be premature when workflows, data quality, governance, and measurable ROI are still unclear.",
    icon: BadgeDollarSign,
    tags: ["AI", "business", "ROI"],
    sides: [
      {
        label: "Worth it",
        prompt: "AI is worth the investment for most companies right now.",
        stanceHint:
          "CrimsonSeek takes the skeptical CFO position and tests the claim against ROI, implementation cost, reliability, and adoption risk.",
      },
      {
        label: "Overhyped",
        prompt: "AI investment is overhyped for most companies right now.",
        stanceHint:
          "CrimsonSeek takes the pro-investment side and tests the claim against automation gains, customer support, software velocity, and competitive pressure.",
      },
    ],
  },
];

export const CUSTOM_ARENA: ArenaPreset = {
  id: "custom",
  title: "Bring Anything",
  kicker: "Anything is up for debate",
  signal:
    "Bring your own claim and CrimsonSeek will take the opposing side with fast Linkup evidence.",
  prompt: "",
  stanceHint:
    "CrimsonSeek reads your exact claim, chooses the strongest opposing side, and searches for evidence that pressure-tests it.",
  opposition:
    "The countercase depends on the position you write.",
  icon: Swords,
  tags: [],
};
