import BrandMark from './BrandMark'
import Icon from './Icon'

export default function AppShell({ activeSection, onNavigate, mobileMenuOpen, setMobileMenuOpen, children }) {
  const links = [
    { id: 'home', label: 'Home' },
    { id: 'library', label: 'Library' },
    { id: 'about', label: 'About' },
  ]

  const navigate = (id) => {
    onNavigate(id)
    setMobileMenuOpen(false)
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="brand" href="#home" onClick={() => navigate('home')} aria-label="AB design library home">
          <BrandMark />
          <span className="brand__copy"><strong>AB</strong><span>design library</span></span>
        </a>
        <nav className={`site-nav ${mobileMenuOpen ? 'site-nav--open' : ''}`} aria-label="Primary navigation">
          {links.map((link) => (
            <a className={activeSection === link.id ? 'is-active' : ''} href={`#${link.id}`} key={link.id} onClick={() => navigate(link.id)}>
              <span>{link.label}</span>{activeSection === link.id && <i />}
            </a>
          ))}
        </nav>
        <div className="header-actions">
          <span className="header-status"><i /> work in progress</span>
          <button className="menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}>
            <Icon name={mobileMenuOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="site-footer__brand"><BrandMark /><span>made with intention<span className="footer-dot">.</span></span></div>
        <span>© {new Date().getFullYear()} · an evolving archive</span>
        <a href="#home" onClick={() => navigate('home')}>back to top <Icon name="arrowUpRight" size={14} /></a>
      </footer>
    </div>
  )
}
