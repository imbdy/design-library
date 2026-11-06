export default function Icon({ name, size = 18, strokeWidth = 1.8 }) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': 'true',
  }

  const paths = {
    arrowUpRight: <><path d="M7 17 17 7" /><path d="M7 7h10v10" /></>,
    arrowRight: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    arrowDown: <><path d="M12 5v14" /><path d="m18 13-6 6-6-6" /></>,
    arrowUp: <><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>,
    arrowLeft:<><path d="M19 12H5" /><path d="m11 18-6-6 6-6" /></>,
    plus: <><path d="M12 5v14" /><path d="M5 12h14" /></>,
    edit: <><path d="m4 16.5-.8 3.3 3.3-.8L18.8 6.7a2.3 2.3 0 0 0-3.2-3.2L4 16.5Z" /><path d="m14 5 3 3" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    close: <><path d="m6 6 12 12" /><path d="m18 6-12 12" /></>,
    menu: <><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>,
    search: <><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></>,
    sparkle: <><path d="m12 3 1.3 5.7L19 10l-5.7 1.3L12 17l-1.3-5.7L5 10l5.7-1.3L12 3Z" /><path d="m19 16 .6 2.4L22 19l-2.4.6L19 22l-.6-2.4L16 19l2.4-.6L19 16Z" /></>,
    grid: <><rect x="4" y="4" width="6" height="6" rx="1" /><rect x="14" y="4" width="6" height="6" rx="1" /><rect x="4" y="14" width="6" height="6" rx="1" /><rect x="14" y="14" width="6" height="6" rx="1" /></>,
    layers: <><path d="m12 3 8 4.5-8 4.5-8-4.5L12 3Z" /><path d="m4 12 8 4.5 8-4.5" /><path d="m4 16.5 8 4.5 8-4.5" /></>,
    external: <><path d="M14 5h5v5" /><path d="M19 5 11 13" /><path d="M19 14v4a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h4" /></>,
    link: <><path d="M10 13.5 14 10" /><path d="M7.5 16.5 6 18a3 3 0 0 1-4.2-4.2l3.7-3.7a3 3 0 0 1 4.2 0" /><path d="m16.5 7.5 1.5-1.5A3 3 0 0 1 22.2 10.2L18.5 14a3 3 0 0 1-4.2 0" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    linkedin: <><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M8 10v6" /><path d="M8 7.5v.01" /><path d="M12 16v-3.5a2.5 2.5 0 0 1 5 0V16" /><path d="M12 10v6" /></>,
    github: <><path d="M9 19c-4 .9-4-2-5.5-2.5" /><path d="M14.5 21v-3.5c.05-1.25-.45-2.1-1.5-2.5 3.5-.4 7-1.7 7-7a5.4 5.4 0 0 0-1.5-3.8A5 5 0 0 0 18.4 1S17.2.6 14.5 2.5a13 13 0 0 0-5 0C6.8.6 5.6 1 5.6 1a5 5 0 0 0-.1 4.2A5.4 5.4 0 0 0 4 8c0 5.3 3.5 6.6 7 7-1.05.4-1.55 1.25-1.5 2.5V21" /></>,
    code: <><path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" /><path d="m14 5-4 14" /></>,
    image: <><rect x="3.5" y="4.5" width="17" height="15" /><circle cx="9" cy="10" r="1.6" /><path d="m4 17 5-5 4 4 3-3 4 4" /></>,
    frames: <><rect x="3.5" y="4.5" width="9" height="15" /><rect x="16" y="8" width="5" height="11.5" /><path d="M3.5 8h9" /></>,
  }

  return <svg {...common}>{paths[name] ?? paths.image}</svg>
}
