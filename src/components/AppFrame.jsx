import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'

const NAV = [
  { id: 'library', label: 'Library' },
  { id: 'about', label: 'About', more: ' & contact' }, // nbsp: a flex item would trim a normal leading space
]

/**
 * Page shell: a quiet top bar that turns to frosted paper once content
 * passes beneath it (the one place glass earns its keep), and the main landmark.
 */
export default function AppFrame({ active, onNavigate, children }) {
  const navRef = useRef(null)
  const markRef = useRef(null)
  const itemRefs = useRef({})
  const [scrolled, setScrolled] = useState(false)

  const placeMark = useCallback(() => {
    const mark = markRef.current
    const nav = navRef.current
    const item = itemRefs.current[active]
    if (!mark || !nav || !item) return
    const nr = nav.getBoundingClientRect()
    const ir = item.getBoundingClientRect()
    mark.style.width = `${ir.width}px`
    mark.style.transform = `translateX(${ir.left - nr.left}px)`
  }, [active])

  useLayoutEffect(() => {
    placeMark()
    window.addEventListener('resize', placeMark)
    document.fonts?.ready?.then(placeMark)
    return () => window.removeEventListener('resize', placeMark)
  }, [placeMark])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="shell">
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className={`topbar ${scrolled ? 'is-scrolled' : ''}`}>
        <div className="topbar__inner">
          <a className="topbar__brand" href="#library" onClick={(event) => { event.preventDefault(); onNavigate('library') }}>
            {profile.name}
            <span className="sr-only">, design library home</span>
          </a>
          <nav className="topbar__nav" aria-label="Primary" ref={navRef}>
            {NAV.map((item) => (
              <a
                key={item.id}
                ref={(node) => { itemRefs.current[item.id] = node }}
                className={`topbar__link ${active === item.id ? 'is-active' : ''}`}
                href={`#${item.id}`}
                aria-current={active === item.id ? 'true' : undefined}
                onClick={(event) => { event.preventDefault(); onNavigate(item.id) }}
              >
                {item.label}
                {item.more && <span className="topbar__more">{item.more}</span>}
              </a>
            ))}
            <span className="topbar__mark" ref={markRef} aria-hidden="true" />
          </nav>
        </div>
      </header>

      <main id="main-content" tabIndex="-1">{children}</main>
    </div>
  )
}
