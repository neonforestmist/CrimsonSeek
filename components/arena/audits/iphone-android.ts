import type { DebateAudit } from "@/components/arena/audit-types";

export const iphoneAndroidAudit: DebateAudit = {
  "arenaId": "iphone-android",
  "userPosition": "iPhone is better than Android for most people.",
  "crimsonPosition": "CrimsonSeek argues the current Android countercase with long support, security, repairability, price, and app-safety evidence.",
  "verdict": "This saved iPhone vs Android audit treats Android choice as a concrete fit question rather than a vague preference for customization.",
  "searchMoments": [
    {
      "id": "android-security-and-updates",
      "label": "Android security and updates",
      "query": "current Android counter-evidence on Pixel Galaxy software support Android 16 security privacy iPhone comparison",
      "summary": "Use official Pixel, Samsung, and Android sources to show that good Android phones are now long-support, security-forward devices rather than short-lived risky picks.",
      "evidence": [
        {
          "title": "Pixel 8 and Pixel 8 Pro to get 7 years of software updates",
          "url": "https://blog.google/products/pixel/software-support-pixel-8-pixel-8-pro",
          "snippet": "Google announced seven years of software support for Pixel 8 and Pixel 8 Pro, including Android OS upgrades, security updates, and regular Feature Drops.",
          "sourceQuality": "Primary or official source"
        },
        {
          "title": "Samsung Unveils Galaxy S26 Series",
          "url": "https://news.samsung.com/us/samsung-unveils-galaxy-s26-series-most-intuitive-galaxy-ai-phone-yet/",
          "snippet": "Samsung says the Galaxy S26 series is supported for seven generations of OS upgrades and seven years of security updates.",
          "sourceQuality": "Primary or official source"
        },
        {
          "title": "Android 16: Productivity, security and more features on Android",
          "url": "https://blog.google/products-and-platforms/platforms/android/android-16/",
          "snippet": "Google says Android 16 Advanced Protection bundles stronger defenses against harmful apps, unsafe sites, scam calls, and other risks.",
          "sourceQuality": "Primary or official source"
        }
      ]
    },
    {
      "id": "android-choice-repair-and-app-safety",
      "label": "Android choice, repair, and app safety",
      "query": "current Android counter-evidence on Pixel 10a price Fairphone repairability Google Play Protect app safety",
      "summary": "Use recent official sources to frame Android choice as targeted fit: lower price, repairable hardware, and a monitored app ecosystem.",
      "evidence": [
        {
          "title": "Pixel 10a: Everything you need, at a price you'll love",
          "url": "https://blog.google/products-and-platforms/devices/pixel/google-pixel-10a/",
          "snippet": "Google positions Pixel 10a as a $499 phone with core Pixel features and seven years of software updates.",
          "sourceQuality": "Primary or official source"
        },
        {
          "title": "Fairphone Gen. 6 press release",
          "url": "https://www.fairphone.com/wp-content/uploads/2025/07/The-Fairphone-Gen.-6-Press-Release-Final.docx.pdf",
          "snippet": "Fairphone says Gen. 6 has twelve easily replaceable parts, single-screwdriver repairs, software support through 2033, and a five-year warranty.",
          "sourceQuality": "Primary or official source"
        },
        {
          "title": "How Google Play and Android app ecosystems stayed safe in 2025",
          "url": "https://blog.google/products-and-platforms/platforms/google-play/how-we-kept-google-play-safe-in-2025/",
          "snippet": "Google says Play Protect scans over 350 billion Android apps daily and its 2025 defenses blocked large numbers of policy-violating apps and bad developer accounts.",
          "sourceQuality": "Primary or official source"
        }
      ]
    }
  ],
  "messages": [
    {
      "id": "user-1",
      "role": "user",
      "content": "iPhone is still better for most people. You get long updates, better privacy defaults, less app-store sketchiness, and the whole thing feels predictable for families. Android has improved, but unless you buy the right model, you can end up with delayed updates or random security gaps."
    },
    {
      "id": "assistant-1",
      "role": "assistant",
      "searchMomentId": "android-security-and-updates",
      "content": "That used to be the cleanest iPhone argument, but it is not as one-sided anymore. A current Pixel or Galaxy is a long-support phone now, not a short-term gamble: {{Pixel 8 phones get seven years of software support}}(1), {{Galaxy flagships get seven OS generations}}(2), and {{Android 16 bundles stronger protection against scams and unsafe apps}}(3). The better distinction is not iPhone safe, Android risky. It is good Androids are mature, bad Androids are still a bad bet."
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "Where iPhone still feels safer to me is the actual buying decision. I can recommend one to my parents and not worry about the carrier model, bloatware, weird skins, repair headaches, or whether the camera and apps will feel second-rate in two years."
    },
    {
      "id": "assistant-2",
      "role": "assistant",
      "searchMomentId": "android-choice-repair-and-app-safety",
      "content": "That is fair, but it argues for better Android recommendations, not for writing Android off. The current Android countercase is not 'buy anything.' It is 'pick the lane that matches the risk.' If price matters, {{Pixel 10a keeps the long-support Pixel path at $499}}(1). If repairs matter, {{Fairphone Gen. 6 offers twelve replaceable parts}}(2). If app safety matters, {{Play Protect scans over 350 billion Android apps daily}}(3). iPhone is simpler to recommend, but Android can be the smarter fit when cost, repairability, privacy posture, or device choice actually matters."
    }
  ]
};
