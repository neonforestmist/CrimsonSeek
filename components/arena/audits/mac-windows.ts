import type { DebateAudit } from "@/components/arena/audit-types";

export const macWindowsAudit: DebateAudit = {
  "arenaId": "mac-windows",
  "userPosition": "Macs are better than Windows PCs for most people.",
  "crimsonPosition": "CrimsonSeek argues the Windows countercase with current hardware, gaming, phone-link, and security evidence woven into short, natural replies.",
  "verdict": "This saved Mac vs Windows audit stays conversational: the user makes practical Mac claims, and CrimsonSeek answers with recent, directly relevant Windows evidence instead of pasted snippets.",
  "searchMoments": [
    {
      "id": "windows-modern-laptop-choice",
      "label": "Modern Windows laptop choice",
      "query": "2026 Windows laptop battery life MacBook alternative benchmarked reviews Dell XPS Lenovo Yoga Windows laptop choice",
      "summary": "Use recent laptop reviews to show that Windows is not just cheap, loud hardware; the platform now includes premium, efficient machines at several shapes and prices.",
      "evidence": [
        {
          "title": "Best Laptops 2026: benchmarked picks for productivity, portability, and battery life",
          "url": "https://www.tomshardware.com/laptops/best-laptops",
          "snippet": "Tom's Hardware updated its 2026 laptop guide and named the Dell XPS 14 its best Windows laptop, noting a 20-hour, 41-minute battery result on the base LCD model.",
          "sourceQuality": "Editorial source"
        },
        {
          "title": "The best Windows laptops of 2026",
          "url": "https://www.tomsguide.com/computing/laptops/best-windows-laptops",
          "snippet": "Tom's Guide updated its Windows laptop guide after benchmarking more than 50 models, highlighting current Windows choices across premium, work, creative, gaming, and value needs.",
          "sourceQuality": "Editorial source"
        },
        {
          "title": "Steam Hardware & Software Survey",
          "url": "https://store.steampowered.com/hwsurvey",
          "snippet": "Valve's April 2026 Steam survey reported Windows at 93.47% of surveyed Steam systems and macOS at 2.01%, keeping Windows the dominant PC gaming platform.",
          "sourceQuality": "Primary or official source"
        }
      ]
    },
    {
      "id": "windows-phone-security-workflow",
      "label": "Windows phone and security workflow",
      "query": "Windows 11 Phone Link iPhone Android messages calls notifications passkeys release health support lifecycle 2026",
      "summary": "Use Microsoft sources to answer the ecosystem and maintenance argument without pretending Windows is identical to macOS.",
      "evidence": [
        {
          "title": "Use Phone Link to Sync Your Android or iPhone to Your Windows Computer",
          "url": "https://www.microsoft.com/en-us/windows/sync-across-your-devices",
          "snippet": "Microsoft says Phone Link can connect Android or iPhone devices to Windows for calls, texts, notifications, and, on Android, recent photos and mobile apps.",
          "sourceQuality": "Primary or official source"
        },
        {
          "title": "Support for passkeys in Windows",
          "url": "https://learn.microsoft.com/en-us/windows/security/identity-protection/passkeys/",
          "snippet": "Microsoft Learn says Windows provides native passkey management and supports passkeys through Windows Hello, security keys, mobile devices, and compatible apps or browsers.",
          "sourceQuality": "Primary or official source"
        },
        {
          "title": "Windows release health",
          "url": "https://learn.microsoft.com/en-us/windows/release-health/",
          "snippet": "Microsoft's Windows release health page centralizes official update status, known issues, resolved issues, release notes, and servicing milestones for current Windows versions.",
          "sourceQuality": "Primary or official source"
        }
      ]
    }
  ],
  "messages": [
    {
      "id": "user-1",
      "role": "user",
      "content": "Macs are better for most people because the buying decision is calmer. You pick a MacBook, it is quiet, fast, has great battery life, and you do not have to sort through a hundred Windows models."
    },
    {
      "id": "assistant-1",
      "role": "assistant",
      "searchMomentId": "windows-modern-laptop-choice",
      "content": "That used to be the cleaner argument, but it is less decisive now. Windows still gives you the choice Apple avoids: a premium laptop, a cheaper school machine, a gaming PC, or something repairable. The high end is not weak either, with current reviews finding a Windows laptop that lasted {{20 hours and 41 minutes in battery testing}}(1), and broader testing covering {{more than 50 current Windows laptop models}}(2). If games matter at all, the ecosystem gap is not subtle: Steam's April 2026 survey had {{Windows on 93.47 percent of surveyed gaming PCs}}(3)."
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "But most people are not shopping for a gaming rig. They want their laptop to work with their phone, photos, messages, passwords, updates, and support without turning the computer into a side project."
    },
    {
      "id": "assistant-2",
      "role": "assistant",
      "searchMomentId": "windows-phone-security-workflow",
      "content": "Totally fair, but Windows is not just a toolbox full of chores anymore. Phone Link gives Windows users a practical version of the phone-hand-off story, including {{calls, texts, and notifications from Android or iPhone}}(1). Security is also more ordinary-user friendly than the old Windows stereotype: passkeys are built into Windows through {{native passkey management with Windows Hello}}(2). And when updates do get messy, Microsoft keeps the status public through {{official known-issue and servicing pages}}(3). macOS is still simpler, but Windows has a stronger everyday case than 'more options.'"
    }
  ]
};
