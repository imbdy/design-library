import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { profile } from '../data/profile'

const NAV = [
  { id: 'library', label: 'Library' },
  { id: 'about', label: 'About' },
]

/**
 * Page shell: a floating glass navigation pill and the main landmark.
 * The active item is marked by a small paper "tab" that slides between links.
 */
export default function AppFrame({ active, onNavigate, children }) {
  const linksRef = useRef(null)
  const indicatorRef = useRef(null)
  const itemRefs = useRef({})
  const [scrolled, setScrolled] = useState(false)

  const placeIndicator = useCallback(() => {
    const indicator = indicatorRef.current
    const links = linksRef.current
    const item = itemRefs.current[active]
    if (!indicator || !links || !item) return
    const lr = links.getBoundingClientRect()
    const ir = item.getBoundingClientRect()
    indicator.style.width = `${ir.width}px`
    indicator.style.transform = `translateX(${ir.left - lr.left}px)`
  }, [active])

  useLayoutEffect(() => {
    placeIndicator()
    window.addEventListener('resize', placeIndicator)
    document.fonts?.ready?.then(placeIndicator)
    return () => window.removeEventListener('resize', placeIndicator)
  }, [placeIndicator])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className="shell"
      onContextMenu={(event) => {
        if (event.target.closest('img')) event.preventDefault()
      }}
      onDragStart={(event) => {
        if (event.target.closest('img')) event.preventDefault()
      }}
    >
      <a className="skip-link" href="#main-content">Skip to content</a>

      <header className={`nav ${scrolled ? 'is-scrolled' : ''}`}>
        <a
          className="nav__brand"
          href="#library"
          onClick={(event) => { event.preventDefault(); onNavigate('library') }}
        >
          <span className="nav__mark" aria-hidden="true">{profile.initials}</span>
          <span className="sr-only">{profile.name}, design library home</span>
        </a>
        <span className="nav__divider" aria-hidden="true" />
        <nav className="nav__links" aria-label="Primary" ref={linksRef}>
          <span className="nav__indicator" ref={indicatorRef} aria-hidden="true" />
          {NAV.map((item) => (
            <a
              key={item.id}
              ref={(node) => { itemRefs.current[item.id] = node }}
              className={`nav__link ${active === item.id ? 'is-active' : ''}`}
              href={`#${item.id}`}
              aria-current={active === item.id ? 'true' : undefined}
              onClick={(event) => { event.preventDefault(); onNavigate(item.id) }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <main id="main-content" tabIndex="-1">{children}</main>
    </div>
  )
}
