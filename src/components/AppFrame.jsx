import { useEffect, useRef } from 'react'
import BrandMark from './BrandMark'
import Icon from './Icon'

const NAV = [
  { id: 'entrance', label: 'Entrance', index: '01' },
  { id: 'collection', label: 'Collection', index: '02' },
  { id: 'rooms', label: 'Rooms', index: '03' },
]

export default function AppFrame({ active, onNavigate, mobileOpen, setMobileOpen, onAdd, children }) {
  const shellRef = useRef(null)

  /* ambient pointer — drives the hall's controlled parallax */
  useEffect(() => {
    const shell = shellRef.current
    if (!shell) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    let frame = 0
    const update = (event) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth) * 100
        const y = (event.clientY / window.innerHeight) * 100
        shell.style.setProperty('--px', x.toFixed(2))
        shell.style.setProperty('--py', y.toFixed(2))
        const hall = shell.querySelector('.hall-light')
        hall?.style.setProperty('--lx', x.toFixed(2) + '%')
        hall?.style.setProperty('--ly', y.toFixed(2) + '%')
      })
    }
    window.addEventListener('pointermove', update, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', update) }
  }, [])

  return (
    <div className="vault-shell" ref={shellRef}>
      {/* vertical exhibition index */}
      <aside className="vault-rail" aria-hidden="true">
        <span className="vault-rail__mark"><i>SV</i></span>
        <span className="vault-rail__title">Specimen vault — exhibition levels</span>
        <span className="vault-rail__steps">
          {NAV.map((item) => (
            <span key={item.id} className={active === item.id ? 'is-active' : ''} />
          ))}
        </span>
      </aside>

      {/* thin architectural index bar */}
      <header className="vault-topbar">
        <a className="vault-topbar__brand" href="#entrance" onClick={(event) => { event.preventDefault(); onNavigate('entrance') }} aria-label="Nordic Specimen Vault, entrance level">
          <BrandMark />
          <strong>Nordic Specimen Vault</strong>
          <small>private design archive</small>
        </a>
        <nav className="vault-topbar__index" aria-label="Exhibition levels">
          {NAV.map((item) => (
            <button key={item.id} className={active === item.id ? 'is-active' : ''} onClick={() => onNavigate(item.id)}>
              <i>{item.index}</i>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="vault-topbar__side">
          <span className="vault-topbar__status"><i /> local ledger</span>
          <button className="vault-topbar__new" onClick={onAdd}>
            <Icon name="plus" size={14} />
            New artifact
            <kbd>⌘K</kbd>
          </button>
          <button className="menu-btn" onClick={() => setMobileOpen(!mobileOpen)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}>
            <Icon name={mobileOpen ? 'close' : 'menu'} />
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div className="nav-sheet" role="dialog" aria-label="Navigation">
          {NAV.map((item) => (
            <button key={item.id} className={`nav-sheet__item ${active === item.id ? 'is-active' : ''}`} onClick={() => onNavigate(item.id)}>
              {item.label}
              <i>{item.index}</i>
            </button>
          ))}
          <div className="nav-sheet__foot">
            <button className="vault-btn vault-btn--wood" onClick={() => { setMobileOpen(false); onAdd() }}>
              <Icon name="plus" size={15} /> New artifact
            </button>
            <span className="sig sig--dim">stored locally in this browser</span>
          </div>
        </div>
      )}

      <main>{children}</main>

      <footer className="vault-foot">
        <span><strong>Nordic specimen vault</strong></span>
        <span>an exhibition of interface studies</span>
        <span>63°N / fjord light</span>
        <span className="sig--wood">collection preserved locally</span>
        <button onClick={() => onNavigate('rooms')}>about the archive <Icon name="arrowUpRight" size={12} /></button>
      </footer>
    </div>
  )
}
