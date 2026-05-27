import type { DebateAudit } from "@/components/arena/audit-types";

export const chatgptClaudeAudit: DebateAudit = {
  "arenaId": "chatgpt-claude",
  "userPosition": "ChatGPT is better than Claude for serious work.",
  "crimsonPosition": "CrimsonSeek argues the strongest current countercase in the ChatGPT vs Claude debate, with source material woven directly into the reply.",
  "verdict": "This saved ChatGPT vs Claude audit uses current source trails, concise counterarguments, and inline source-backed citation material instead of detached link lists.",
  "searchMoments": [
    {
      "id": "claude-workflow-depth",
      "label": "Claude workflow depth",
      "query": "ChatGPT vs Claude counter-evidence on serious work ecosystem, reliability, Claude Code, and workplace apps",
      "summary": "Fresh Linkup check using TechCrunch reporting on Claude Code adoption and Claude's workplace app integrations.",
      "evidence": [
        {
          "title": "Claude Code rolls out a voice mode capability | TechCrunch",
          "url": "https://techcrunch.com/2026/03/03/claude-code-rolls-out-a-voice-mode-capability/",
          "snippet": "Anthropic is bringing Voice Mode to Claude Code, its AI coding assistant for developers, with a gradual release and a broader rollout planned.",
          "sourceQuality": "Editorial source"
        },
        {
          "title": "Anthropic launches interactive Claude apps, including Slack and other workplace tools | TechCrunch",
          "url": "https://techcrunch.com/2026/01/26/anthropic-launches-interactive-claude-apps-including-slack-and-other-workplace-tools/",
          "snippet": "Claude users can call up workplace apps inside the chatbot interface, including Slack, Canva, Figma, Box, and Clay.",
          "sourceQuality": "Editorial source"
        }
      ]
    },
    {
      "id": "claude-tools-in-one-place",
      "label": "Claude tools in one place",
      "query": "ChatGPT vs Claude counter-evidence on coding, file work, search, and team workflows in Claude",
      "summary": "Fresh Linkup check focused on whether Claude now covers the practical work surfaces the user says only ChatGPT has.",
      "evidence": [
        {
          "title": "Claude Code rolls out a voice mode capability | TechCrunch",
          "url": "https://techcrunch.com/2026/03/03/claude-code-rolls-out-a-voice-mode-capability/",
          "snippet": "Claude Code is Anthropic's coding assistant for developers, and Voice Mode is meant to make coding workflows more conversational and hands-free.",
          "sourceQuality": "Editorial source"
        },
        {
          "title": "Anthropic launches interactive Claude apps, including Slack and other workplace tools | TechCrunch",
          "url": "https://techcrunch.com/2026/01/26/anthropic-launches-interactive-claude-apps-including-slack-and-other-workplace-tools/",
          "snippet": "Anthropic's launch apps for Claude are mostly workplace tools, with Slack, Canva, Figma, Box, Clay, and a Salesforce implementation expected.",
          "sourceQuality": "Editorial source"
        }
      ]
    },
    {
      "id": "claude-enterprise-safety",
      "label": "Claude enterprise safety",
      "query": "ChatGPT vs Claude counter-evidence on enterprise standardization, safety, security work, and integrations",
      "summary": "Fresh Linkup check using current reporting on Anthropic's safety principles, cybersecurity work, and workplace integration strategy.",
      "evidence": [
        {
          "title": "Anthropic revises Claude's 'Constitution,' and hints at chatbot consciousness | TechCrunch",
          "url": "https://techcrunch.com/2026/01/21/anthropic-revises-claudes-constitution-and-hints-at-chatbot-consciousness/",
          "snippet": "Anthropic revised the set of principles used to guide Claude's behavior and describe the context in which the model should operate.",
          "sourceQuality": "Editorial source"
        },
        {
          "title": "Anthropic debuts preview of powerful new AI model Mythos in new cybersecurity initiative | TechCrunch",
          "url": "https://techcrunch.com/2026/04/07/anthropic-mythos-ai-model-preview-security/",
          "snippet": "Anthropic's Project Glasswing involves 12 partner organizations using a frontier model for defensive security work and critical software security.",
          "sourceQuality": "Editorial source"
        }
      ]
    }
  ],
  "messages": [
    {
      "id": "user-1",
      "role": "user",
      "content": "ChatGPT is better than Claude for serious work because it has the broader product ecosystem, tools, and everyday reliability."
    },
    {
      "id": "assistant-1",
      "role": "assistant",
      "searchMomentId": "claude-workflow-depth",
      "content": "A bigger ecosystem helps, but serious work is about finishing the job cleanly. Claude is not just a nice writer anymore: Anthropic is building developer workflows around Claude Code {{Anthropic is bringing Voice Mode to Claude Code, its AI coding assistant for developers}}(1), and Claude can pull workplace apps into the chat {{Claude users can call up workplace apps inside the chatbot interface, including Slack, Canva, Figma, Box, and Clay}}(2). That makes the Claude case practical, not just polished."
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "Claude may write nicely, but serious work needs coding, file analysis, search, and team workflows in one place."
    },
    {
      "id": "assistant-2",
      "role": "assistant",
      "searchMomentId": "claude-tools-in-one-place",
      "content": "That is exactly why Claude is a stronger counterexample than it used to be. Coding is covered by Claude Code, which is being built for developer work {{Claude Code is Anthropic's coding assistant for developers}}(1). Team workflow is covered by interactive apps such as Slack, Figma, Box, and Clay inside Claude {{Anthropic's launch apps for Claude are mostly workplace tools}}(2). ChatGPT may still be broader, but the gap is not a wall."
    },
    {
      "id": "user-3",
      "role": "user",
      "content": "If a company has to standardize, ChatGPT is safer because employees already know it and OpenAI keeps shipping integrations."
    },
    {
      "id": "assistant-3",
      "role": "assistant",
      "searchMomentId": "claude-enterprise-safety",
      "content": "Familiarity is useful, but safety is not the same as popularity. Anthropic has updated the principles that guide Claude's behavior {{Anthropic revised the set of principles used to guide Claude's behavior}}(1), and it is also putting frontier models into defensive security work with partners {{12 partner organizations are using a frontier model for defensive security work and critical software security}}(2). For standardizing, that is a real enterprise safety argument."
    }
  ]
};
