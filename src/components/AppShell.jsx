import { useEffect, useRef } from 'react'
import BrandMark from './BrandMark'
import Icon from './Icon'

export default function AppShell({ activeSection, onNavigate, mobileMenuOpen, setMobileMenuOpen, children }) {
  const shellRef = useRef(null)
  const links = [
    { id: 'home', label: 'Atelier' },
    { id: 'library', label: 'Library' },
    { id: 'experiments', label: 'Experiments' },
    { id: 'about', label: 'About' },
  ]

  const navigate = (id) => {
    onNavigate(id)
    setMobileMenuOpen(false)
  }

  useEffect(() => {
    let frame = 0
    const updatePointer = (event) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth) * 100
        const y = (event.clientY / window.innerHeight) * 100
        shellRef.current?.style.setProperty('--pointer-x', `${x.toFixed(2)}%`)
        shellRef.current?.style.setProperty('--pointer-y', `${y.toFixed(2)}%`)
      })
    }
    window.addEventListener('pointermove', updatePointer, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', updatePointer) }
  }, [])

  return <div className="site-shell" ref={shellRef}>
    <div className="site-backdrop" aria-hidden="true" />
    <header className="site-header">
      <a className="brand" href="#home" onClick={(event) => { event.preventDefault(); navigate('home') }} aria-label="Liquid Atelier home"><BrandMark /><span className="brand__copy"><strong>AB</strong><span>liquid atelier</span></span></a>
      <nav className={`site-nav ${mobileMenuOpen ? 'site-nav--open' : ''}`} aria-label="Primary navigation">
        {links.map((link) => <a className={activeSection === link.id ? 'is-active' : ''} href={`#${link.id}`} key={link.id} onClick={(event) => { event.preventDefault(); navigate(link.id) }}><span>{link.label}</span>{activeSection === link.id && <i />}</a>)}
      </nav>
      <div className="header-actions"><span className="header-status"><i /> archive in progress</span><button className="menu-button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-expanded={mobileMenuOpen} aria-label={mobileMenuOpen ? 'Close navigation' : 'Open navigation'}><Icon name={mobileMenuOpen ? 'close' : 'menu'} /></button></div>
    </header>
    <div className="site-workspace"><main>{children}</main><footer className="site-footer"><div className="site-footer__compact"><span className="site-footer__brand"><BrandMark /><b>LIQUID ATELIER</b></span><span>LOCAL COLLECTION · {new Date().getFullYear()}</span><span>NO PAGE SCROLL / CHOOSE A ROOM</span><button onClick={() => navigate('contact')}>open line <Icon name="arrowUpRight" size={13} /></button></div></footer></div>
  </div>
}
