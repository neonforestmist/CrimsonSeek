import type { DebateAudit } from "@/components/arena/audit-types";

export const iphoneAndroidAudit: DebateAudit = {
  arenaId: "iphone-android",
  userPosition: "iPhone is better than Android for most people.",
  crimsonPosition:
    "Android is better for most people because it offers more choice, better price flexibility, deeper control, and faster hardware variety without forcing everyone through one company's gate.",
  verdict:
    "iPhone wins on polish, resale gravity, and ecosystem comfort. Android wins this saved debate on the broader public case: more price points, more form factors, more repair paths, more customization, and flagship hardware that does not wait for Cupertino permission.",
  searchMoments: [
    {
      id: "choice-value",
      label: "Choice and value",
      query: "Android phone price range device choice iPhone comparison Samsung Google Motorola CNET Android Authority",
      summary:
        "The first evidence check asks whether Android is just cheaper or actually broader. The sources show Android spans budget, midrange, foldable, gaming, and premium phones while iPhone buyers mostly choose between a few Apple-controlled tiers.",
      evidence: [
        {
          title: "Android Phones",
          url: "https://www.android.com/phones/",
          snippet:
            "Android presents a wide device ecosystem across brands, sizes, prices, and hardware styles, which makes the platform easier to match to different budgets and priorities.",
          sourceQuality: "Primary platform source",
        },
        {
          title: "Best Android Phones of 2026",
          url: "https://www.cnet.com/tech/mobile/best-android-phone/",
          snippet:
            "CNET's Android picks typically span premium flagships, value models, camera phones, and foldables, reinforcing that Android is not one phone strategy.",
          sourceQuality: "Technology buying guide",
        },
        {
          title: "Samsung Galaxy Smartphones",
          url: "https://www.samsung.com/us/smartphones/",
          snippet:
            "Samsung's Galaxy lineup covers budget A-series devices, S-series flagships, and foldables, showing how Android buyers can optimize for price, screen, camera, or form factor.",
          sourceQuality: "Manufacturer catalog",
        },
      ],
    },
    {
      id: "control-ecosystem",
      label: "Control and defaults",
      query: "Android customization default apps sideloading iPhone locked ecosystem The Verge Android Authority",
      summary:
        "The second evidence check tests whether iPhone convenience is worth the lock-in. Android's case gets stronger on default apps, launchers, file handling, app sources, and tighter user control over how the phone behaves.",
      evidence: [
        {
          title: "Switch to Android",
          url: "https://www.android.com/switch/",
          snippet:
            "Google markets Android around moving your data, choosing devices, and using Google services across phones, which supports the case that the platform is less tied to one hardware lane.",
          sourceQuality: "Primary platform source",
        },
        {
          title: "Android 15 Review",
          url: "https://www.androidauthority.com/android-15-review-3488617/",
          snippet:
            "Android Authority highlights Android's customization, privacy controls, and quality-of-life changes, which matter for users who want a phone that adapts to them.",
          sourceQuality: "Specialist Android analysis",
        },
        {
          title: "Apple's iPhone ecosystem is changing under regulatory pressure",
          url: "https://www.theverge.com/apple",
          snippet:
            "The Verge's Apple coverage has tracked pressure around app distribution, browser rules, messaging, and platform control, underscoring that iPhone simplicity comes with gatekeeping tradeoffs.",
          sourceQuality: "Technology reporting hub",
        },
      ],
    },
    {
      id: "repair-updates",
      label: "Repair, support, durability",
      query: "iFixit iPhone repair Samsung self repair Android updates seven years Apple support comparison",
      summary:
        "The third evidence check separates long-term ownership from brand comfort. Apple is strong on updates and resale, but Android flagships have closed much of the support gap while offering more repair options and competing hardware durability stories.",
      evidence: [
        {
          title: "Samsung Galaxy Self-Repair",
          url: "https://www.samsung.com/us/support/self-repair/",
          snippet:
            "Samsung's self-repair program gives owners access to parts and guides for supported Galaxy devices, strengthening Android's case on long-term ownership control.",
          sourceQuality: "Manufacturer repair program",
        },
        {
          title: "iPhone Repair",
          url: "https://www.ifixit.com/Device/iPhone",
          snippet:
            "iFixit documents iPhone repair procedures and repairability issues, which is useful evidence when judging ownership beyond the first glossy unboxing.",
          sourceQuality: "Independent repair resource",
        },
        {
          title: "Google Pixel phones now get 7 years of updates",
          url: "https://blog.google/products/pixel/software-support-pixel-8-pixel-8-pro/",
          snippet:
            "Google announced seven years of OS, security, and feature drop updates for Pixel 8 and Pixel 8 Pro, narrowing one of iPhone's classic long-support advantages.",
          sourceQuality: "Primary manufacturer source",
        },
      ],
    },
  ],
  messages: [
    {
      id: "user-1",
      role: "user",
      content:
        "iPhone is better for most people. It is simpler, more polished, more secure, and the ecosystem just works without making normal people become phone mechanics.",
    },
    {
      id: "assistant-1",
      role: "assistant",
      searchMomentId: "choice-value",
      content:
        "Simplicity is nice, but most people also have budgets, preferences, and hands that are not all Apple-approved dimensions. The evidence points to Android's biggest public-service feature: choice. Cheap phone, camera beast, foldable, huge battery, stylus, tiny-ish flagship, weird gaming slab. Android says pick your lane. iPhone says pick your storage tier.",
    },
    {
      id: "user-2",
      role: "user",
      content:
        "Choice sounds good until people buy the wrong thing. iPhones make the decision easy, get years of updates, keep resale value, and work smoothly with Macs, iPads, AirPods, and Apple Watch.",
    },
    {
      id: "assistant-2",
      role: "assistant",
      content:
        "That is a strong luxury answer, not a most-people answer. The Apple stack is amazing if you can afford the whole stack. Android's boring magic is that you can spend $250, $500, or $1,200 and still get a real smartphone instead of a cover charge for the ecosystem nightclub.",
    },
    {
      id: "user-3",
      role: "user",
      content:
        "But iPhone is safer for average users. Less tinkering, fewer sketchy app stores, cleaner privacy prompts, better FaceTime and iMessage, less chaos.",
    },
    {
      id: "assistant-3",
      role: "assistant",
      searchMomentId: "control-ecosystem",
      content:
        "Less chaos, yes. Less control, also yes. The sources show Android's pitch is customization, defaults, device choice, and fewer one-company bottlenecks. iMessage lock-in is not a product virtue, it is a velvet rope. Android lets people change launchers, defaults, keyboards, file flows, and app sources without asking Apple for a hall pass.",
    },
    {
      id: "user-4",
      role: "user",
      content:
        "Most people do not care about launchers or sideloading. They care that the camera opens fast, the phone feels premium, and customer support is easy when something breaks.",
    },
    {
      id: "assistant-4",
      role: "assistant",
      content:
        "Fair, but Android flagships are not bargain-bin science projects. Samsung, Google, OnePlus, and others compete hard on cameras, screens, charging, zoom, AI features, and battery life. Competition is the point. Apple can be excellent at its pace. Android makes everyone sprint.",
    },
    {
      id: "user-5",
      role: "user",
      content:
        "Long term, iPhones still age better. Updates, accessories, resale, repairs, cases, service, family sharing, all of it makes iPhone the lower-risk pick.",
    },
    {
      id: "assistant-5",
      role: "assistant",
      searchMomentId: "repair-updates",
      content:
        "Lower risk for some, sure. Automatic win, no. Google pushed Pixel support to seven years, Samsung has self-repair, and iFixit keeps reminding everyone that premium does not mean easy to fix. Android's long-term case is now credible: more parts of the market, more repair routes, more hardware bets, and fewer reasons to pretend one phone shape fits every human.",
    },
  ],
};
