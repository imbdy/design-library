export const categories = [
  'All designs',
  'Websites',
  'Dashboards',
  'Components',
  'Experiments',
  'UX explorations',
  'Motion studies',
]

/**
 * Presentation details for each collection on the library page.
 * `motif` picks the drawn cover used until a design in the collection
 * has a preview image; `tint` picks one of three paper tones.
 */
export const categoryDetails = {
  Websites: { description: 'Complete pages and sites, from first layout to launch.', motif: 'websites', tint: 'lavender' },
  Dashboards: { description: 'Dense data, made calm and readable.', motif: 'dashboards', tint: 'sand' },
  Components: { description: 'Buttons, inputs, cards and their states.', motif: 'components', tint: 'pearl' },
  Experiments: { description: 'Ideas tried before they’re certain.', motif: 'experiments', tint: 'pearl' },
  'UX explorations': { description: 'Flows and the reasoning behind them.', motif: 'flows', tint: 'sand' },
  'Motion studies': { description: 'Timing, easing and transitions, studied on their own.', motif: 'motion', tint: 'lavender' },
}

export const categorySlug = (category) => category.toLowerCase().replace(/\s+/g, '-')

export const projects = [
  {
    id: 'abdallah-portfolio',
    title: 'Personal portfolio',
    eyebrow: 'Portfolio site',
    description:
      'A cinematic portfolio for AI / ML engineering and UI/UX work, bringing liquid typography, glass surfaces, motion, and project storytelling into one focused experience.',
    categories: ['Websites', 'Experiments'],
    status: 'Published',
    year: '2026',
    role: 'Art direction · Interaction design · Frontend',
    tools: ['HTML', 'CSS', 'JavaScript'],
    tags: ['portfolio', 'motion', '3D', 'AI / ML'],
    imageUrl: '/portfolio/preview.png',
    body: [
      'The portfolio is designed as a single, cinematic world rather than a collection of disconnected pages.',
      'It combines a liquid hero, a live design-system playground, an agentic-loop visualization, and project case studies in a lightweight standalone experience.',
    ],
    sourceUrl: 'https://imbdy.dev',
  },
  {
    id: 'personal-design-library',
    title: 'Personal design library',
    eyebrow: 'The site itself',
    description:
      'A growing home for UI studies, experiments, and frontend work — designed as a living piece of the portfolio.',
    categories: ['Websites', 'Experiments'],
    status: 'In progress',
    year: '2026',
    role: 'Design direction · Frontend foundation',
    tools: ['Figma', 'React', 'CSS'],
    body: [
      'This is the first entry in the library: the system that will hold the work that comes next.',
      'The first milestone focuses on the browsing experience, the visual language, and a content model that can grow without turning the site into an admin dashboard.',
    ],
  },
]
