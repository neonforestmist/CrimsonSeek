import {
  BadgeDollarSign,
  BriefcaseBusiness,
  School,
} from "lucide-react";
import type { ArenaId } from "@/components/arena/arena-data";

type ArenaMarkProps = {
  id: ArenaId;
  active?: boolean;
  className?: string;
};

const baseMark =
  "relative inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-md border shadow-[inset_0_1px_0_rgba(255,255,255,0.72),0_1px_2px_rgba(21,18,14,0.05)]";
const singleIconClass = "h-[22px] w-[22px]";
const duoIconClass = "h-[13px] w-[13px]";

export function ArenaMark({ id, active = false, className = "" }: ArenaMarkProps) {
  const tone = active
    ? "border-accent-500 bg-accent-500 text-white"
    : "border-accent-100 bg-accent-50/74 text-accent-700";

  return (
    <span className={`${baseMark} ${tone} ${className}`}>
      {renderMark(id)}
    </span>
  );
}

function renderMark(id: ArenaId) {
  switch (id) {
    case "chatgpt-claude":
      return <OpenAIMark className={singleIconClass} />;
    case "mac-windows":
      return (
        <span className="inline-flex items-center gap-0.5">
          <AppleMark className={duoIconClass} />
          <WindowsMark className={duoIconClass} />
        </span>
      );
    case "iphone-android":
      return <IPhoneMark className={singleIconClass} />;
    case "ai-jobs":
      return <BriefcaseBusiness className={singleIconClass} strokeWidth={2.35} />;
    case "phones-school":
      return <School className={singleIconClass} strokeWidth={2.35} />;
    case "ai-investment":
      return <BadgeDollarSign className={singleIconClass} strokeWidth={2.35} />;
    case "custom":
      return (
        <span className="material-symbols-rounded text-[22px] leading-none">
          edit_square
        </span>
      );
  }
}

function OpenAIMark({ className = "" }: { className?: string }) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>OpenAI</title>
      <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
    </svg>
  );
}

function WindowsMark({ className = "" }: { className?: string }) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Windows</title>
      <path d="M3,12V6.75L9,5.43v6.48L3,12M20,3v8.75L10,11.9V5.21L20,3M3,13l6,.09V19.9L3,18.75V13m17,.25V22L10,20.09v-7Z" />
    </svg>
  );
}

function AppleMark({ className = "" }: { className?: string }) {
  return (
    <svg
      fill="currentColor"
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>Apple</title>
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.26.82-1.31.05-2.31-1.34-3.14-2.57-1.7-2.45-3-6.93-1.25-9.96.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.86 3.29.86.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.97-.09.06-2.17 1.26-2.15 3.85.03 3.09 2.71 4.12 2.74 4.13-.03.07-.43 1.48-1.46 2.94M13.02 3.5c.69-.83 1.83-1.46 2.87-1.5.13 1.2-.35 2.39-1.01 3.25-.66.85-1.74 1.51-2.86 1.42-.15-1.17.39-2.4 1-3.17Z" />
    </svg>
  );
}

function IPhoneMark({ className = "" }: { className?: string }) {
  return (
    <svg
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>iPhone</title>
      <rect x="7" y="2.5" width="10" height="19" rx="2.35" strokeWidth="2" />
      <path d="M10.5 5.25h3" strokeWidth="2" />
      <path d="M11.25 18.25h1.5" strokeWidth="2" />
    </svg>
  );
}
