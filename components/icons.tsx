import React from 'react';

// Generic Icon Props
type IconProps = React.SVGProps<SVGSVGElement>;

// Service Icons
export const WrenchScrewdriverIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 1 1-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 0 0 4.486-6.336l-3.276 3.277a3.004 3.004 0 0 1-4.243-4.243l3.275-3.275a4.5 4.5 0 0 0-6.336 4.486c.061.58.053 1.193-.14 1.743m5.108-.233-5.25-5.25a3.375 3.375 0 0 0-4.773-4.773l-5.25 5.25m3.109 3.556a3.375 3.375 0 1 1-4.773-4.773l5.25-5.25m0 0l4.773 4.773m0 0l-5.25 5.25m5.25-5.25 5.25 5.25" />
  </svg>
);

export const BoltIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
  </svg>
);

export const PaintBrushIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.998 15.998 0 0 1 3.388-1.62" />
  </svg>
);

export const ShieldCheckIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286Zm0 0A11.953 11.953 0 0 1 12 2.625c1.171 0 2.31.162 3.402.469m-6.804 0L6.75 4.686a11.953 11.953 0 0 0-3.152.981m6.804 0a.75.75 0 0 0-.297.632v3.018c0 .414.336.75.75.75h6.168a.75.75 0 0 0 .632-.297l.805-1.396a.75.75 0 0 0-.297-.933l-4.28-2.472a.75.75 0 0 0-.933.297Z" />
  </svg>
);

export const TruckIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 0 1 3.375-3.375h9.75a3.375 3.375 0 0 1 3.375 3.375v1.875M10.5 6h9m-9 3h9m5.25-3H5.25a2.25 2.25 0 0 0-2.25 2.25v4.5a2.25 2.25 0 0 0 2.25 2.25H19.5a2.25 2.25 0 0 0 2.25-2.25v-4.5a2.25 2.25 0 0 0-2.25-2.25H15M10.5 6H5.25a2.25 2.25 0 0 0-2.25 2.25v4.5a2.25 2.25 0 0 0 2.25 2.25H19.5" />
  </svg>
);

export const ComputerDesktopIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25A2.25 2.25 0 0 1 5.25 3h13.5A2.25 2.25 0 0 1 21 5.25Z" />
  </svg>
);

// New Service Icons
export const CogIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0 0 15 0m-15 0a7.5 7.5 0 1 1 15 0m-15 0H3m18 0h-1.5m-15 0H3.75m16.5 0h-1.5m-1.5 6.42-1.026-1.026a2.25 2.25 0 0 0-3.182 0l-1.026 1.026m3.182-3.182-1.026-1.026a2.25 2.25 0 0 0-3.182 0l-1.026 1.026m3.182-3.182-1.026-1.026a2.25 2.25 0 0 0-3.182 0l-1.026 1.026M12 4.5v.01M12 19.5v.01" />
    </svg>
);
export const BeakerIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.5 1.591L5.25 14.25M9.75 3.104a2.25 2.25 0 0 0-2.25 2.25c0 1.242.99 2.25 2.25 2.25s2.25-1.008 2.25-2.25c0-1.242-.99-2.25-2.25-2.25M9.75 3.104C11.232 3.104 12 4.34 12 5.356m0 0v5.714a2.25 2.25 0 0 0 .5 1.591L18.75 14.25M12 5.356c1.488 0 2.25.99 2.25 2.25s-.762 2.25-2.25 2.25S9.75 8.848 9.75 7.606c0-1.26.762-2.25 2.25-2.25m0 0 1.5 1.5M4.5 21v-6.75A2.25 2.25 0 0 1 6.75 12h10.5a2.25 2.25 0 0 1 2.25 2.25v6.75" />
    </svg>
);
export const FireIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 3.75 3.75 0 0 0-1.993-2.193 3.75 3.75 0 0 0-4.243 4.242 3.75 3.75 0 0 0 5.74 5.42Z" />
    </svg>
);
export const HomeModernIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205 3 1m-3-1-3-1.091m0 0-3 1.091m0 0 3 1.091m0 0-3-1.091m0-2.182-3-1.091m12 0-3 1.091m-9-3.273 3-1.091M9 3l3 1.091" />
    </svg>
);
export const KeyIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
    </svg>
);
export const PaintBucketIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21.75-3.75 9A8.25 8.25 0 0 1 12 2.25a8.25 8.25 0 0 1 15.75 6.75L12 21.75Z" />
    </svg>
);
export const TvIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 20.25h12m-7.5-3.75v3.75m3.75-3.75v3.75m-7.5-12h12v-3.75a.75.75 0 0 0-.75-.75h-10.5a.75.75 0 0 0-.75.75v3.75m-3.75 0h19.5v12h-19.5v-12Z" />
    </svg>
);
export const WifiIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 0 1 7.424 0M5.136 11.886c3.87-3.87 10.154-3.87 14.024 0M19.712 8.734c-6.482-6.482-17.034-6.482-23.516 0" />
    </svg>
);
export const BuildingStorefrontIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5A2.25 2.25 0 0 0 11.25 11.25H4.5A2.25 2.25 0 0 0 2.25 13.5V21M3 3h12M13.5 3h4.5M3 3v4.5M13.5 3v4.5m0-4.5h4.5m-4.5 0v4.5m0-4.5h1.125c.621 0 1.125.504 1.125 1.125V11.25m-9 0h9" />
    </svg>
);


// UI Icons
export const StarIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
    </svg>
);

export const MapPinIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
    </svg>
);

export const XMarkIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
);

export const CurrencyDollarIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182.799-.64 1.769-.64 2.568 0l.879.659M12 6a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z" />
    </svg>
);

export const UserCircleIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
);

export const SparklesIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

export const UsersIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-4.663M15 19.128a9.37 9.37 0 0 0-3.232-2.502M10.5 11.25a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Z" />
  </svg>
);

export const BriefcaseIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.07a2.25 2.25 0 0 1-2.25 2.25H5.92a2.25 2.25 0 0 1-2.15-2.012a2.25 2.25 0 0 1-.05-1.018V7.75a2.25 2.25 0 0 1 2.25-2.25h13.5a2.25 2.25 0 0 1 2.25 2.25v2.85m-18 0h18M12 15.75h.008v.008H12v-.008Z" />
  </svg>
);

export const PaperAirplaneIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
    </svg>
);

export const ChatBubbleOvalLeftEllipsisIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.761 9.761 0 0 1-2.56-1.037L3 21.75l1.037-3.56a9.76 9.76 0 0 1-1.037-2.56C3 7.444 7.03 3.75 12 3.75s9 3.694 9 8.25Z" />
    </svg>
);

export const ArrowLeftIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
    </svg>
);

export const ClipboardDocumentListIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 12 2.25a2.251 2.251 0 0 1 1.024.195m-1.024-.195A2.251 2.251 0 0 0 12 2.25a2.251 2.251 0 0 0-1.024.195m0 0A48.455 48.455 0 0 1 7.5 2.25c-2.318 0-4.512.645-6.374 1.766A2.25 2.25 0 0 0 1.5 6.108v11.785c0 1.218.99 2.203 2.203 2.203h3.992c.123 0 .237-.02.348-.057m-4.54-1.858 1.556-2.658a2.25 2.25 0 0 1 3.839 0l1.556 2.658m0 0a2.25 2.25 0 0 1-3.839 0" />
    </svg>
);


// Admin Icons
export const PencilSquareIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
    </svg>
);

export const TrashIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.067-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
    </svg>
);

export const LockClosedIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);

export const LockOpenIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
);