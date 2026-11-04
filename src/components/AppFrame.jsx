import { useEffect, useRef, useState } from 'react'
import BrandMark from './BrandMark'
import Icon from './Icon'

const NAV = [
  { id: 'entrance', label: 'Entrance', index: '01' },
  { id: 'collection', label: 'Collection', index: '02' },
  { id: 'rooms', label: 'Rooms', index: '03' },
]

export default function AppFrame({ active, onNavigate, mobileOpen, setMobileOpen, onAdd, children }) {
  const shellRef = useRef(null)
  const navRef = useRef(null)
  const lensRef = useRef(null)
  const itemRefs = useRef({})
  const [softLight, setSoftLight] = useState(false)

  /* position the glass lens under a level button */
  const placeLens = (btn) => {
    const lens = lensRef.current
    const nav = navRef.current
    if (!lens || !nav || !btn) return
    const nr = nav.getBoundingClientRect()
    const br = btn.getBoundingClientRect()
    lens.style.width = `${br.width - 12}px`
    lens.style.height = `${br.height - 12}px`
    lens.style.transform = `translate(${br.left - nr.left + 6}px, ${br.top - nr.top + 6}px)`
  }

  /* the active level drives the glass lens */
  useEffect(() => {
    placeLens(itemRefs.current[active])
    const onResize = () => placeLens(itemRefs.current[active])
    window.addEventListener('resize', onResize)
    document.fonts?.ready?.then(() => placeLens(itemRefs.current[active]))
    return () => window.removeEventListener('resize', onResize)
  }, [active])

  /* ambient pointer — hall parallax */
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
        shell.querySelector('.hall-light')?.style.setProperty('--lx', x.toFixed(2) + '%')
        shell.querySelector('.hall-light')?.style.setProperty('--ly', y.toFixed(2) + '%')
      })
    }
    window.addEventListener('pointermove', update, { passive: true })
    return () => { cancelAnimationFrame(frame); window.removeEventListener('pointermove', update) }
  }, [])

  const tiltLens = (event) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const nav = navRef.current
    if (!nav) return
    const r = nav.getBoundingClientRect()
    nav.style.setProperty('--nx', ((event.clientX - r.left) / r.width).toFixed(3))
    nav.style.setProperty('--ny', ((event.clientY - r.top) / r.height).toFixed(3))
  }
  const settleLens = () => {
    untiltLens()
    placeLens(itemRefs.current[active])
  }
  const untiltLens = () => {
    const nav = navRef.current
    nav?.style.setProperty('--nx', '0.5')
    nav?.style.setProperty('--ny', '0.5')
  }

  return (
    <div className={`vault-shell ${softLight ? 'vault-shell--soft-lit' : ''}`} ref={shellRef}>
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

      {/* floating liquid-glass index slab */}
      <header className="vault-topbar">
        <span className="vault-topbar__glare" aria-hidden="true" />
        <a className="vault-topbar__brand" href="#entrance" onClick={(event) => { event.preventDefault(); onNavigate('entrance') }} aria-label="Nordic Specimen Vault, entrance level">
          <BrandMark />
          <strong>Nordic Specimen Vault</strong>
          <small>private design archive</small>
        </a>
        <span className="vault-topbar__divider" aria-hidden="true" />
        <nav
          className="vault-topbar__index"
          aria-label="Exhibition levels"
          ref={navRef}
          onMouseMove={tiltLens}
          onMouseLeave={settleLens}
        >
          <span className="nav-lens" ref={lensRef} aria-hidden="true">
            <span className="nav-lens__tilt"><span className="nav-lens__core" /></span>
          </span>
          {NAV.map((item) => (
            <button
              key={item.id}
              ref={(node) => (itemRefs.current[item.id] = node)}
              className={active === item.id ? 'is-active' : ''}
              onMouseEnter={() => placeLens(itemRefs.current[item.id])}
              onClick={() => onNavigate(item.id)}
            >
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="vault-topbar__side">
          <button className="vault-topbar__theme" onClick={() => setSoftLight((current) => !current)} aria-pressed={softLight} aria-label={softLight ? 'Restore full ambient light' : 'Soften ambient light'}><span>☼</span><i /><span>◐</span></button>
          <button className="vault-topbar__new" onClick={onAdd}>
            <Icon name="plus" size={14} />
            Get started
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
