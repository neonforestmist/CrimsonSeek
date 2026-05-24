import type { ArenaId } from "@/components/arena/arena-data";
import type { DebateAudit } from "@/components/arena/audit-types";
import { aiInvestmentAudit } from "@/components/arena/audits/ai-investment";
import { aiJobsAudit } from "@/components/arena/audits/ai-jobs";
import { chatgptClaudeAudit } from "@/components/arena/audits/chatgpt-claude";
import { iphoneAndroidAudit } from "@/components/arena/audits/iphone-android";
import { macWindowsAudit } from "@/components/arena/audits/mac-windows";
import { phonesSchoolAudit } from "@/components/arena/audits/phones-school";

export const AUDITS_BY_ARENA_ID: Partial<Record<ArenaId, DebateAudit>> = {
  "chatgpt-claude": chatgptClaudeAudit,
  "mac-windows": macWindowsAudit,
  "iphone-android": iphoneAndroidAudit,
  "ai-jobs": aiJobsAudit,
  "phones-school": phonesSchoolAudit,
  "ai-investment": aiInvestmentAudit,
};
