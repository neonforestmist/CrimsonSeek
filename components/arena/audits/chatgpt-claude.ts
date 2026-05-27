import type { DebateAudit } from "@/components/arena/audit-types";

export const chatgptClaudeAudit: DebateAudit = {
  "arenaId": "chatgpt-claude",
  "userPosition": "ChatGPT is better than Claude for serious work.",
  "crimsonPosition": "CrimsonSeek argues the current Claude countercase: ChatGPT may be broader, but Claude is no longer thin on serious work, coding, research, or team context.",
  "verdict": "This saved ChatGPT vs Claude audit uses current official source trails and short citation anchors that synthesize the evidence inside normal sentences.",
  "searchMoments": [
    {
      "id": "claude-work-stack",
      "label": "Claude work stack",
      "query": "current Claude countercase against ChatGPT broader product ecosystem serious work Claude Code Claude Slack Sonnet 4.6",
      "summary": "Current official sources showing Claude's model, coding, business-plan, and Slack workflow depth.",
      "evidence": [
        {
          "title": "Introducing Claude Sonnet 4.6",
          "url": "https://www.anthropic.com/news/claude-sonnet-4-6",
          "snippet": "Claude Sonnet 4.6 is the default model in Claude.ai and Claude Cowork, with file creation, connectors, skills, and compaction included in Claude's current product surface.",
          "sourceQuality": "Official Anthropic source"
        },
        {
          "title": "Claude Code and new admin controls for business plans",
          "url": "https://www.anthropic.com/news/claude-code-on-team-and-enterprise",
          "snippet": "Team and Enterprise customers can upgrade to premium seats that include both Claude and Claude Code under one subscription.",
          "sourceQuality": "Official Anthropic source"
        },
        {
          "title": "Claude and Slack",
          "url": "https://claude.com/blog/claude-and-slack",
          "snippet": "Claude can connect to Slack and search channels, direct messages, and shared files for better responses and research.",
          "sourceQuality": "Official Claude source"
        }
      ]
    },
    {
      "id": "claude-search-files-integrations",
      "label": "Claude search and files",
      "query": "current Claude countercase web search citations integrations GitHub Google Drive Gmail Calendar file creation connectors Sonnet 4.6",
      "summary": "Current official sources showing Claude now covers web search, citations, integrations, file work, and long-context work surfaces.",
      "evidence": [
        {
          "title": "Claude can now search the web",
          "url": "https://claude.com/blog/web-search",
          "snippet": "Web search is available globally on all Claude plans, and Claude provides direct citations when it uses web information.",
          "sourceQuality": "Official Claude source"
        },
        {
          "title": "Set up Claude integrations",
          "url": "https://support.claude.com/en/articles/10168395-set-up-claude-integrations",
          "snippet": "Claude integrations include GitHub, Google Drive, Gmail, and Google Calendar across Claude plans.",
          "sourceQuality": "Official Claude Help Center"
        },
        {
          "title": "Introducing Claude Sonnet 4.6",
          "url": "https://www.anthropic.com/news/claude-sonnet-4-6",
          "snippet": "Claude Sonnet 4.6 includes file creation, connectors, skills, compaction, stronger coding, computer use, long-context reasoning, and knowledge work.",
          "sourceQuality": "Official Anthropic source"
        }
      ]
    }
  ],
  "messages": [
    {
      "id": "user-1",
      "role": "user",
      "content": "ChatGPT is still better for serious work. I need one place for writing, coding, research, files, and daily team stuff, and Claude usually feels like the better writer but the thinner product."
    },
    {
      "id": "assistant-1",
      "role": "assistant",
      "searchMomentId": "claude-work-stack",
      "content": "I get the one-place argument, but that version of Claude is a little out of date. Claude is now anchored around Sonnet 4.6 as the {{default model in Claude.ai and Claude Cowork}}(1), Team and Enterprise seats can put {{Claude and Claude Code under one subscription}}(2), and Slack can bring real work context into the conversation because Claude {{searches Slack channels, direct messages, and shared files}}(3). ChatGPT may still be broader, but Claude is not thin anymore."
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "Maybe, but serious work is not just Slack and vibe. I need web search, docs, Gmail, code, and file work without constantly jumping between tabs or trusting a model that only sounds confident."
    },
    {
      "id": "assistant-2",
      "role": "assistant",
      "searchMomentId": "claude-search-files-integrations",
      "content": "Fair, but that is exactly where Claude has caught up in useful ways. Its search story is no longer stale because {{web search is now available globally on all Claude plans}}(1), its connector surface covers {{GitHub, Google Drive, Gmail, and Google Calendar integrations}}(2), and Sonnet 4.6 gives the app practical work surfaces like {{file creation, connectors, skills, and compaction}}(3). The better counter is not that Claude beats ChatGPT everywhere. It is that the gap is now narrow enough that quality, context, and follow-through can matter more than menu size."
    }
  ]
};
