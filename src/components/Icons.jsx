// Small inline SVG icons. They use `currentColor`, so Tailwind text colors style them.

function Svg({ children, className = "size-5", strokeWidth = 2, ...props }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
      {...props}
    >
      {children}
    </svg>
  );
}

export function ArrowRightIcon(props) {
  return (
    <Svg strokeWidth={2.5} {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Svg>
  );
}

export function ArrowLeftIcon(props) {
  return (
    <Svg strokeWidth={2.5} {...props}>
      <path d="M19 12H5M11 6l-6 6 6 6" />
    </Svg>
  );
}

export function ArrowDownIcon(props) {
  return (
    <Svg {...props}>
      <path d="M12 5v14M6 13l6 6 6-6" />
    </Svg>
  );
}

export function PhoneIcon(props) {
  return (
    <Svg strokeWidth={1.8} {...props}>
      <path d="M5 4h3l2 5-2.5 1.5a11 11 0 0 0 6 6L15 14l5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </Svg>
  );
}

export function MapPinIcon(props) {
  return (
    <Svg strokeWidth={1.8} {...props}>
      <path d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z" />
      <circle cx="12" cy="9" r="2.5" />
    </Svg>
  );
}

export function MailIcon(props) {
  return (
    <Svg strokeWidth={1.8} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </Svg>
  );
}

export function ManuscriptIcon(props) {
  return (
    <Svg strokeWidth={1.6} {...props}>
      <path d="M7 3h10v14a3 3 0 0 1-3 3H6a2 2 0 0 1-2-2v-2h9" />
      <path d="M17 3a2 2 0 0 1 2 2v1h-2" />
      <path d="m10 8-1.5 1.5L10 11M13 8l1.5 1.5L13 11" />
    </Svg>
  );
}

export function DraftIcon(props) {
  return (
    <Svg strokeWidth={1.6} {...props}>
      <path d="M13 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h5" />
      <path d="M13 3v5h5M18 8v3" />
      <path d="m20.5 14.5-5.5 5.5-2.5.5.5-2.5 5.5-5.5a1.4 1.4 0 0 1 2 2Z" />
    </Svg>
  );
}

export function IdeaIcon(props) {
  return (
    <Svg strokeWidth={1.6} {...props}>
      <path d="M9 18h6M10 21h4" />
      <path d="M12 3a6 6 0 0 0-3.5 10.9c.6.4 1 1.1 1 1.8V16h5v-.3c0-.7.4-1.4 1-1.8A6 6 0 0 0 12 3Z" />
      <path d="m9.5 9 1.8 1.8L15 7" />
    </Svg>
  );
}

// Four-point sparkle used as background decoration in the hero.
export function SparkleIcon({ className = "size-6" }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className}>
      <path
        fill="currentColor"
        d="M12 0c.6 6.4 5 11 12 12-7 1-11.4 5.6-12 12-.6-6.4-5-11-12-12C7 11 11.4 6.4 12 0Z"
      />
    </svg>
  );
}
