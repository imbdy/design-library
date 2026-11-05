/**
 * Who keeps the library. Everything the About / Contact section shows
 * comes from here — edit this file rather than the components.
 * A link with an empty `href` is hidden.
 */
export const profile = {
  name: 'Abdallah Obeidat',
  firstName: 'Abdallah',
  initials: 'AO',
  role: 'Designer · frontend learner',
  // the headline is set as plain text followed by an italic emphasis
  headline: 'I design interfaces, and I’m learning to',
  headlineEmphasis: 'build them well.',
  intro: [
    'This library is my working archive rather than a finished showroom — a home for interface studies, experiments, and the decisions behind them.',
    'I keep the pieces that taught me something, finished or not, so the thinking stays visible next to the result.',
  ],
  focus: ['UI/UX design', 'Frontend', 'Design systems'],
  links: [
    { id: 'email', label: 'Email', value: 'me@imbdy.dev', href: 'mailto:me@imbdy.dev' },
    { id: 'linkedin', label: 'LinkedIn', value: 'Abdallah Obeidat', href: 'https://www.linkedin.com/in/abdallah-obeidat-028039388' },
    { id: 'github', label: 'GitHub', value: '@imbdy', href: 'https://github.com/imbdy' },
    { id: 'source', label: 'Source', value: 'imbdy/design-library', href: 'https://github.com/imbdy/design-library' },
  ],
}
