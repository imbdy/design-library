import Icon from './Icon'
import { profile } from '../data/profile'

/**
 * About / Contact — the library's colophon. Sits on a deeper sand sheet
 * so it reads as the closing page of the same catalogue.
 */
export default function AboutSection({ onBackToLibrary }) {
  const links = profile.links.filter((link) => link.href)

  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="about__sheet">
        <div className="about__grid">
          <div className="about__intro">
            <p className="eyebrow">About</p>
            <h2 id="about-title" className="display display--about">
              {profile.headline} <em>{profile.headlineEmphasis}</em>
            </h2>
            <div className="about__text">
              {profile.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
            <dl className="facts">
              <div><dt>Role</dt><dd>{profile.role}</dd></div>
              <div><dt>Focus</dt><dd>{profile.focus.join(' · ')}</dd></div>
            </dl>
          </div>

          <aside className="contact" aria-labelledby="contact-title">
            <h3 id="contact-title" className="contact__title">Get in touch</h3>
            <p className="contact__note">Questions, feedback, or a project in mind — I’d be glad to hear from you.</p>
            <ul className="contact__list">
              {links.map((link) => {
                const external = !link.href.startsWith('mailto:')
                return (
                  <li key={link.id}>
                    <a
                      className="contact__row"
                      href={link.href}
                      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
                    >
                      <span className="contact__label">{link.label}</span>
                      <span className="contact__value">{link.value}</span>
                      <Icon name={external ? 'arrowUpRight' : 'arrowRight'} size={15} />
                      {external && <span className="sr-only"> (opens in a new tab)</span>}
                    </a>
                  </li>
                )
              })}
            </ul>
          </aside>
        </div>

        <footer className="colophon">
          <span>© {new Date().getFullYear()} {profile.name}</span>
          <span className="colophon__set">Set in Newsreader &amp; Hanken Grotesk</span>
          <a href="#library" onClick={(event) => { event.preventDefault(); onBackToLibrary() }}>
            Back to the library <Icon name="arrowUp" size={13} />
          </a>
        </footer>
      </div>
    </section>
  )
}
