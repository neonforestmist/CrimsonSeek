import type { DebateAudit } from "@/components/arena/audit-types";

export const macWindowsAudit: DebateAudit = {
  arenaId: "mac-windows",
  userPosition: "Macs are better than Windows PCs for most people.",
  crimsonPosition:
    "Windows PCs are better for most people because choice, price, gaming, compatibility, and upgrade paths matter more than Apple polish.",
  verdict:
    "Mac wins the premium appliance argument. Windows wins the most-people argument: more budgets, more shapes, more games, more legacy compatibility, and more escape hatches when real life gets weird.",
  searchMoments: [
    {
      id: "value-choice",
      label: "Value and hardware choice",
      query: "MacBook Air specs Windows laptop choices 2026 value hardware choice",
      summary:
        "The first evidence check tests whether Mac polish beats the practical spread of Windows hardware. The source trail surfaces Apple's clean MacBook story, then stacks it against Windows choice across prices, form factors, and upgrade paths.",
      evidence: [
        {
          title: "MacBook Air - Tech Specs",
          url: "https://www.apple.com/macbook-air/specs/",
          snippet:
            "Apple's own specs make the MacBook Air case: polished hardware, long battery claims, Apple Intelligence, and tight iPhone integration in a simple laptop lineup.",
          sourceQuality: "Primary product spec",
        },
        {
          title: "Best Windows laptops in 2026: 9 top-rated PCs tested and reviewed",
          url: "https://www.windowscentral.com/best-laptop-usb-c",
          snippet:
            "Windows Central's tested roundup spans Surface, ASUS, Lenovo, convertibles, business machines, gaming laptops, and value picks, showing Windows buyers are not locked into one laptop philosophy.",
          sourceQuality: "Independent buying guide",
        },
        {
          title: "Windows 11 System Requirements",
          url: "https://support.microsoft.com/en-us/windows/windows-11-system-requirements-86c11283-ea52-4782-9efd-7674389a7ba3",
          snippet:
            "Microsoft documents Windows 11 across PCs and notes that some systems allow RAM or storage upgrades, which matters when buyers want a longer runway from cheaper hardware.",
          sourceQuality: "Primary support documentation",
        },
      ],
    },
    {
      id: "gaming-software",
      label: "Gaming and software gravity",
      query: "Windows 11 gaming DirectX 12 Ultimate PC Game Pass best gaming laptops 2026",
      summary:
        "The second evidence check asks the gaming claim. Macs have improved, but the source cards point to Windows as the default home for PC game APIs, dedicated GPUs, desktops, handhelds, storefronts, and upgradeable rigs.",
      evidence: [
        {
          title: "Gaming on Windows 11: Windows Gaming PC & Laptops",
          url: "https://www.microsoft.com/en-us/windows/windows-11-pc-gaming",
          snippet:
            "Microsoft highlights DirectX 12 Ultimate, Auto HDR, DirectStorage, Game Bar, PC Game Pass, and broad game support as core Windows 11 gaming advantages.",
          sourceQuality: "Primary platform source",
        },
        {
          title: "Best Gaming Laptops 2026: Tested and reviewed",
          url: "https://www.tomshardware.com/laptops/gaming-laptops/best-gaming-laptops",
          snippet:
            "Tom's Hardware tests Windows gaming laptops across budgets and GPUs, including dedicated Nvidia configurations built for portable high-performance play.",
          sourceQuality: "Benchmarked buying guide",
        },
        {
          title: "Best Gaming PCs of 2026",
          url: "https://www.tomshardware.com/best-picks/best-gaming-pcs/",
          snippet:
            "Tom's Hardware emphasizes desktop PC flexibility, where buyers can choose parts around the games they play, the resolution they want, and the performance they need.",
          sourceQuality: "Benchmarked buying guide",
        },
      ],
    },
    {
      id: "compat-business",
      label: "Apps and compatibility",
      query: "Windows app compatibility business Mac Boot Camp Apple silicon Microsoft App Assure",
      summary:
        "The third evidence check looks at the boring stuff that decides daily life: old apps, office standards, school software, business tools, remote desktops, and Windows fallback options on Macs.",
      evidence: [
        {
          title: "Windows 365 and App Assure",
          url: "https://learn.microsoft.com/en-us/microsoft-365/fasttrack/windows-and-app-assure",
          snippet:
            "Microsoft says App Assure helps address Windows 10/11 and Microsoft 365 app compatibility issues, which is a strong enterprise counter to the idea that Mac simplicity always wins.",
          sourceQuality: "Official enterprise documentation",
        },
        {
          title: "Install Windows 10 on your Mac with Boot Camp Assistant",
          url: "https://support.apple.com/en-us/102622",
          snippet:
            "Apple's Boot Camp support page says Windows 10 installation is for Intel-based Macs and lists Apple silicon MacBook models as excluded, limiting native Windows fallback on modern Macs.",
          sourceQuality: "Primary support documentation",
        },
        {
          title: "Get started with Windows App to connect to devices and apps",
          url: "https://learn.microsoft.com/en-us/windows-app/get-started-connect-devices-desktops-apps",
          snippet:
            "Microsoft documents Windows App access from Windows, macOS, iOS/iPadOS, Android/Chrome OS, web browsers, and more, showing Windows workspaces can be reached across devices.",
          sourceQuality: "Official product documentation",
        },
      ],
    },
  ],
  messages: [
    {
      id: "user-1",
      role: "user",
      content:
        "Macs are better for most people. The hardware is polished, macOS is cleaner, battery life rocks, and iPhone integration saves ordinary people from driver archaeology.",
    },
    {
      id: "assistant-1",
      role: "assistant",
      searchMomentId: "value-choice",
      content:
        "Clean is not the same as best for most. The source trail pulls Apple's MacBook story, then Windows throws down the map: budget laptops, premium ultrabooks, touchscreens, 2-in-1s, desktops, gaming rigs, and some upgradeable hardware. Apple sells the boutique. Windows sells the city.",
    },
    {
      id: "user-2",
      role: "user",
      content:
        "Most people do not want a city. They want one good laptop that works for years. MacBook Air nails that without bloatware, fan noise, or weird OEM app sludge.",
    },
    {
      id: "assistant-2",
      role: "assistant",
      content:
        "Fair. MacBook Air is the appliance dream. But most people also include students with $500, accountants who need a numpad, gamers, office workers with ancient printers, and parents buying the best deal at Costco. One beautiful lane does not beat a whole map.",
    },
    {
      id: "user-3",
      role: "user",
      content:
        "Gaming is a niche. For real life, people browse, write docs, edit photos, and video chat. Macs handle that beautifully and stay fast.",
    },
    {
      id: "assistant-3",
      role: "assistant",
      searchMomentId: "gaming-software",
      content:
        "Gaming is not just a hobby box. It drives GPUs, drivers, graphics APIs, stores, controllers, and peripherals. The source trail points to DirectX, Auto HDR, DirectStorage, PC Game Pass, and a huge Windows hardware bench. Macs can play more than before. Windows is still where the library lives rent-free.",
    },
    {
      id: "user-4",
      role: "user",
      content:
        "The average person does not care about RTX cards. They care that the machine is reliable and pleasant. macOS updates feel calmer than Windows updates.",
    },
    {
      id: "assistant-4",
      role: "assistant",
      searchMomentId: "compat-business",
      content:
        "Pleasant matters. So does the school testing app, the accounting plug-in, the scanner driver, the remote desktop, and the tool your employer bought in 2014 and refuses to bury. Microsoft has an app compatibility program. Apple still documents Boot Camp around Intel Macs. Windows is messy because it supports the mess.",
    },
    {
      id: "user-5",
      role: "user",
      content:
        "But the Apple ecosystem is magic. AirDrop, iMessage, Continuity, Apple Stores, fewer choices. That is why Macs are better for normal humans.",
    },
    {
      id: "assistant-5",
      role: "assistant",
      searchMomentId: "value-choice",
      content:
        "Magic is real if you bought the wand, the robe, and the castle. My verdict stays Windows because most people starts with fit and price, not taste. More budgets, more form factors, more ports, more stores, more repair options, more weird-but-useful machines. Macs are a gorgeous answer for Apple people. Windows is the broader answer for people people.",
    },
  ],
};
