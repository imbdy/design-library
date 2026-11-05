import Icon from './Icon'
import { profile } from '../data/profile'

/**
 * About / Contact — the catalogue's colophon. It uses the library's two-column
 * grid, and both lower blocks are ruled ledgers like the collection index,
 * aligned on the same baseline so the page reads as one document.
 */
export default function AboutSection({ onBackToLibrary }) {
  const links = profile.links.filter((link) => link.href)

  return (
    <section className="about" id="about" aria-labelledby="about-title">
      <div className="about__inner">
        <div className="about__id">
          <p className="kicker">About</p>
          <h2 id="about-title" className="about__name">{profile.name}</h2>
        </div>

        <div className="about__body">
          <p className="about__statement">{profile.statement}</p>
          {profile.intro.map((paragraph) => <p key={paragraph} className="about__text">{paragraph}</p>)}
        </div>

        <div className="about__profile">
          <h3 className="kicker" id="profile-title">Profile</h3>
          <dl className="rows" aria-labelledby="profile-title">
            <div className="rows__row"><dt>Role</dt><dd>{profile.role}</dd></div>
            <div className="rows__row"><dt>Focus</dt><dd>{profile.focus.join(' · ')}</dd></div>
          </dl>
        </div>

        <div className="about__contact">
          <h3 className="kicker" id="contact">Contact</h3>
          <ul className="rows" aria-labelledby="contact">
            {links.map((link) => {
              const external = !link.href.startsWith('mailto:')
              return (
                <li key={link.id}>
                  <a className="rows__row rows__row--link" href={link.href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}>
                    <span className="rows__label">{link.label}</span>
                    <span className="rows__value">{link.value}</span>
                    <Icon name={external ? 'arrowUpRight' : 'arrowRight'} size={16} />
                    {external && <span className="sr-only"> (opens in a new tab)</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>

      <footer className="colophon">
        <span>© {new Date().getFullYear()} {profile.name}</span>
        <span className="colophon__set">Set in Newsreader &amp; Schibsted Grotesk</span>
        <a href="#library" onClick={(event) => { event.preventDefault(); onBackToLibrary() }}>
          Back to the library <Icon name="arrowUp" size={14} />
        </a>
      </footer>
    </section>
  )
}
