import type { DebateAudit } from "@/components/arena/audit-types";

export const iphoneAndroidAudit: DebateAudit = {
  "arenaId": "iphone-android",
  "userPosition": "iPhone is better than Android for most people.",
  "crimsonPosition": "CrimsonSeek argues the strongest current countercase in the iPhone vs Android debate, with source material woven directly into the reply.",
  "verdict": "This saved iPhone vs Android audit keeps the countercase short, current, and source-backed without treating Android choice as automatic chaos.",
  "searchMoments": [
    {
      "id": "android-security-maturity",
      "label": "Android security maturity",
      "query": "iPhone vs Android counter-evidence on Android security patches, privacy upgrades, and predictable protection",
      "summary": "Fresh Linkup check using Android security bulletins and current reporting on Android's 2026 security upgrades.",
      "evidence": [
        {
          "title": "Android Security Bulletin-May 2026 | Android Open Source Project",
          "url": "https://source.android.com/docs/security/bulletin/2026/2026-05-01",
          "snippet": "The May 2026 Android Security Bulletin says patch levels dated 2026-05-01 or later address the listed vulnerabilities.",
          "sourceQuality": "Primary or official source"
        },
        {
          "title": "12 new security features coming to Android phones in 2026",
          "url": "https://www.androidauthority.com/android-security-features-2026-3665372/",
          "snippet": "Google's 2026 Android security and privacy upgrades include protections against banking scam calls, device theft, malware, and fake Android builds.",
          "sourceQuality": "Editorial source"
        }
      ]
    },
    {
      "id": "android-camera-and-hardware",
      "label": "Android camera and hardware",
      "query": "iPhone vs Android counter-evidence on Android cameras, flagship hardware, software support, and app quality",
      "summary": "Fresh Linkup check using hands-on Android phone reviews to test whether Android still asks buyers to trade quality for choice.",
      "evidence": [
        {
          "title": "This is my new favorite camera phone and one of the best Android phones I've ever used",
          "url": "https://www.androidauthority.com/oppo-find-x9-ultra-review-3661474/",
          "snippet": "Android Authority said the OPPO Find X9 Ultra leapfrogged the best cameras from Apple, Google, and Samsung.",
          "sourceQuality": "Editorial source"
        },
        {
          "title": "Best Android Phones of 2026: Tested by Our Experts - CNET",
          "url": "https://www.cnet.com/tech/mobile/best-android-phone/",
          "snippet": "CNET's tested Android picks include phones with extremely capable cameras and enough power for everyday needs.",
          "sourceQuality": "Editorial source"
        }
      ]
    },
    {
      "id": "android-lower-risk",
      "label": "Android lower risk",
      "query": "iPhone vs Android counter-evidence on Android value, long software support, and lower-risk phone buying",
      "summary": "Fresh Linkup check using current Android buyer guides on software support, Pixel pricing, and flagship longevity.",
      "evidence": [
        {
          "title": "Best Android Phones of 2026: Tested by Our Experts - CNET",
          "url": "https://www.cnet.com/tech/mobile/best-android-phone/",
          "snippet": "CNET notes that Google and Samsung promise seven years of software updates on current flagship Android phones.",
          "sourceQuality": "Editorial source"
        },
        {
          "title": "Best Google Pixel Phone to Buy in 2026 - CNET",
          "url": "https://www.cnet.com/tech/mobile/best-google-pixel-phone/",
          "snippet": "CNET says the Pixel 10A remains a 500 dollar option even as phones have become more expensive.",
          "sourceQuality": "Editorial source"
        }
      ]
    }
  ],
  "messages": [
    {
      "id": "user-1",
      "role": "user",
      "content": "iPhone is better than Android for most people because the ecosystem is polished, secure, and predictable."
    },
    {
      "id": "assistant-1",
      "role": "assistant",
      "searchMomentId": "android-security-maturity",
      "content": "iPhone predictability is nice, but Android is not the messy security gamble people remember. Android publishes regular security bulletins with specific patch levels {{patch levels dated 2026-05-01 or later address the listed Android vulnerabilities}}(1), and Google's 2026 upgrades target scams, theft, malware, and fake builds {{Android security and privacy upgrades include protections against banking scam calls, device theft, malware, and fake Android builds}}(2). Predictable is not the same as automatically safer."
    },
    {
      "id": "user-2",
      "role": "user",
      "content": "Android choice is overrated when people mostly want great cameras, long updates, and apps that work well."
    },
    {
      "id": "assistant-2",
      "role": "assistant",
      "searchMomentId": "android-camera-and-hardware",
      "content": "Those priorities are reasonable, but Android now competes directly on them. Reviewers say the OPPO Find X9 Ultra jumped ahead of the best camera phones from Apple, Google, and Samsung {{the OPPO Find X9 Ultra leapfrogged the best cameras from Apple, Google, and Samsung}}(1). CNET's Android picks also include phones with strong cameras and enough power for normal use {{tested Android phones include extremely capable cameras and enough power for everyday needs}}(2). Choice matters when the choices are good."
    },
    {
      "id": "user-3",
      "role": "user",
      "content": "Resale value, accessories, Apple Stores, family features, and privacy make iPhone the lower-risk phone."
    },
    {
      "id": "assistant-3",
      "role": "assistant",
      "searchMomentId": "android-lower-risk",
      "content": "iPhone may still win on resale and stores, but the risk gap is smaller now. Google and Samsung promise long support on current flagships {{Google and Samsung promise seven years of software updates on current flagship Android phones}}(1), and Android buyers can still choose cheaper current options {{the Pixel 10A remains a 500 dollar option even as phones have become more expensive}}(2). Lower risk is not only about brand; it is also about support and price."
    }
  ]
};
