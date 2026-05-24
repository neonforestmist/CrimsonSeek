import type { ArenaId, EvidenceItem } from "@/components/arena/arena-data";

export interface EvidenceSearchMoment {
  id: string;
  label: string;
  query: string;
  summary: string;
  evidence: EvidenceItem[];
}

export interface AuditMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  searchMomentId?: string;
}

export interface DebateAudit {
  arenaId: ArenaId;
  userPosition: string;
  crimsonPosition: string;
  verdict: string;
  searchMoments: EvidenceSearchMoment[];
  messages: AuditMessage[];
}
