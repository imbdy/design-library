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
 * Presentation details for each collection.
 * `tone` is the collection's key colour: a muted paper tone used for its
 * swatch in the index and for title plates of designs without an image.
 * `description` is optional — add a sentence here and it appears on the plate.
 */
export const categoryDetails = {
  Websites: { tone: 'mist', description: '' },
  Dashboards: { tone: 'sage', description: '' },
  Components: { tone: 'oat', description: '' },
  Experiments: { tone: 'clay', description: '' },
  'UX explorations': { tone: 'lilac', description: '' },
  'Motion studies': { tone: 'straw', description: '' },
}

export const categorySlug = (category) => category.toLowerCase().replace(/\s+/g, '-')

export const projects = [
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
