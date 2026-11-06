import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AppFrame from './components/AppFrame'
import AboutSection from './components/AboutSection'
import ArtifactPanel from './components/ArtifactPanel'
import CategoryCard from './components/CategoryCard'
import CategoryCover from './components/CategoryCover'
import DesignCard from './components/DesignCard'
import InspectionView from './components/InspectionView'
import Icon from './components/Icon'
import { categories, categoryDetails, categorySlug, projects as seedProjects } from './data/projects'
import { profile } from './data/profile'

const ALL = 'All designs'
const STORAGE_KEY = 'liquid-atelier-projects'
const shelf = categories.filter((category) => category !== ALL)
const fallbackDetails = { description: '', motif: 'experiments', tint: 'pearl' }
const detailsFor = (category) => categoryDetails[category] ?? fallbackDetails
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** `#collection/<slug>` → category name (or null for the library overview) */
function viewFromHash() {
  const match = window.location.hash.match(/^#collection\/(.+)$/)
  if (!match) return null
  if (match[1] === 'all') return ALL
  return shelf.find((category) => categorySlug(category) === match[1]) ?? null
}

function EmptyShelf({ category, query, onClearSearch, onBack }) {
  const details = detailsFor(category)
  return (
    <div className="empty">
      <CategoryCover motif={details.motif} tint={details.tint} className="empty__cover" />
      <div className="empty__copy">
        <h2>{query ? 'No designs match that search.' : 'Nothing filed here yet.'}</h2>
        <p>
          {query
            ? 'Try another word, or clear the search to see the whole collection.'
            : `Work in ${category} will appear here as soon as it’s added to the library.`}
        </p>
        <div className="empty__actions">
          {query && <button type="button" className="btn btn--quiet" onClick={onClearSearch}>Clear search</button>}
          <button type="button" className="text-link" onClick={onBack}>
            <Icon name="arrowLeft" size={15} /> Back to all collections
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [active, setActive] = useState('library')
  const [view, setView] = useState(viewFromHash)
  const [query, setQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('recent')
  const [selectedProject, setSelectedProject] = useState(null)
  const [addOpen, setAddOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [collection, setCollection] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      const parsed = saved ? JSON.parse(saved) : null
      if (!Array.isArray(parsed)) return seedProjects
      const savedIds = new Set(parsed.map((project) => project.id))
      return [...parsed, ...seedProjects.filter((project) => !savedIds.has(project.id))]
    } catch { return seedProjects }
  })

  const headingRef = useRef(null)
  const returnFocusTo = useRef(null)
  const pendingFocus = useRef(false)

  /* ---------- navigation ---------- */

  const scrollToId = (id) => {
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    if (id === 'library') window.scrollTo({ top: 0, behavior })
    else document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
  }

  const openCollection = useCallback((category, { replace = false } = {}) => {
    const hash = `#collection/${category === ALL ? 'all' : categorySlug(category)}`
    if (replace) window.history.replaceState(null, '', hash)
    else window.history.pushState(null, '', hash)
    if (!replace) returnFocusTo.current = category
    pendingFocus.current = true
    setQuery('')
    setView(category)
    if (window.scrollY > 0) scrollToId('library')
  }, [])

  const closeCollection = useCallback(() => {
    window.history.pushState(null, '', '#library')
    setQuery('')
    setView(null)
  }, [])

  const navigate = (section) => {
    if (section === 'library' && view !== null) closeCollection()
    scrollToId(section)
  }

  /* browser back / forward between overview and collections */
  useEffect(() => {
    const onPop = () => { setQuery(''); setView(viewFromHash()) }
    window.addEventListener('popstate', onPop)
    if (window.location.hash === '#about') requestAnimationFrame(() => scrollToId('about'))
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  /* move focus to the new heading when a collection opens; back to its card when it closes */
  useEffect(() => {
    if (view !== null && pendingFocus.current) {
      pendingFocus.current = false
      headingRef.current?.focus({ preventScroll: true })
    } else if (view === null && returnFocusTo.current) {
      const target = document.querySelector(`[data-collection="${categorySlug(returnFocusTo.current)}"] .ccard`)
      returnFocusTo.current = null
      target?.focus({ preventScroll: true })
    }
  }, [view])

  /* which section the visitor is in drives the nav indicator */
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const about = document.getElementById('about')
        if (!about) return
        const nearBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
        setActive(nearBottom || about.getBoundingClientRect().top < window.innerHeight * 0.5 ? 'about' : 'library')
      })
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { cancelAnimationFrame(frame); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  /* ⌘/Ctrl + K opens the add-design panel */
  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setEditingProject(null); setAddOpen(true) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    document.body.style.overflow = addOpen || selectedProject ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [addOpen, selectedProject])

  /* ---------- data ---------- */

  const byRecent = useMemo(() => [...collection].sort((a, b) => String(b.year).localeCompare(String(a.year))), [collection])
  const countFor = (category) => (category === ALL ? collection.length : collection.filter((p) => p.categories?.includes(category)).length)
  const coverFor = (category) => byRecent.find((p) => p.categories?.includes(category) && p.imageUrl)?.imageUrl

  const inView = useMemo(() => {
    if (view === null) return []
    return collection.filter((project) => view === ALL || project.categories?.includes(view))
  }, [collection, view])

  const filteredProjects = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const list = inView.filter((project) => {
      const haystack = `${project.title} ${project.description} ${project.categories?.join(' ') ?? ''} ${project.tags?.join(' ') ?? ''}`.toLowerCase()
      return haystack.includes(needle)
    })
    return [...list].sort((a, b) => (sortOrder === 'alphabetical' ? a.title.localeCompare(b.title) : String(b.year).localeCompare(String(a.year))))
  }, [inView, query, sortOrder])

  const saveCollection = (next) => {
    setCollection(next)
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* storage unavailable — keep in memory */ }
  }
  const handleSaveProject = (project) => {
    const exists = collection.some((item) => item.id === project.id)
    saveCollection(exists ? collection.map((item) => (item.id === project.id ? project : item)) : [project, ...collection])
    setEditingProject(null); setAddOpen(false); setSelectedProject(project)
  }
  const handleDeleteProject = (project) => {
    if (!window.confirm(`Remove “${project.title}” from your library? This can’t be undone.`)) return
    saveCollection(collection.filter((item) => item.id !== project.id))
    setSelectedProject(null)
  }
  const openAdd = () => { setEditingProject(null); setAddOpen(true) }

  const selectedIndex = selectedProject ? filteredProjects.findIndex((p) => p.id === selectedProject.id) : -1
  const previousProject = selectedIndex > 0 ? filteredProjects[selectedIndex - 1] : null
  const nextProject = selectedIndex >= 0 && selectedIndex < filteredProjects.length - 1 ? filteredProjects[selectedIndex + 1] : null

  /* ---------- views ---------- */

  const overview = (
    <div className="library__view library__view--overview" key="overview">
      <header className="intro">
        <div className="intro__title">
          <p className="eyebrow">A personal archive by {profile.name}</p>
          <h1 className="display display--hero">My Design <em>Library</em></h1>
        </div>
        <div className="intro__aside">
          <p className="intro__lede">
            Interface studies, experiments, and the decisions behind them — gathered into collections you can wander through at your own pace.
          </p>
          <div className="intro__meta">
            <span className="intro__count">{plural(collection.length, 'design')} · {plural(shelf.length, 'collection')}</span>
            <button type="button" className="text-link" onClick={() => openCollection(ALL)}>
              Browse all designs <Icon name="arrowRight" size={15} />
            </button>
          </div>
        </div>
      </header>

      <ul className="collections" aria-label="Collections">
        {shelf.map((category, index) => (
          <li key={category} className="collections__item" data-collection={categorySlug(category)}>
            <CategoryCard
              name={category}
              details={detailsFor(category)}
              count={countFor(category)}
              image={coverFor(category)}
              index={index + 1}
              wide={index === 0 || index === shelf.length - 1}
              onOpen={() => openCollection(category)}
            />
          </li>
        ))}
      </ul>
    </div>
  )

  const shelfView = view !== null && (
    <div className="library__view" key={`collection-${view}`}>
      <header className="shelf-head">
        <nav className="crumbs" aria-label="Breadcrumb">
          <button type="button" className="crumbs__back" onClick={closeCollection}>
            <Icon name="arrowLeft" size={15} /> My Design Library
          </button>
          <span className="crumbs__sep" aria-hidden="true">/</span>
          <span aria-current="page">{view}</span>
        </nav>
        <div className="shelf-head__row">
          <div>
            <h1 className="display display--shelf" tabIndex="-1" ref={headingRef}>{view}</h1>
            <p className="shelf-head__desc">{view === ALL ? 'Every design in the library, across all collections.' : detailsFor(view).description}</p>
          </div>
          <div className="shelf-head__side">
            <p className="shelf-head__count" aria-live="polite">
              {query ? `${filteredProjects.length} of ${plural(inView.length, 'design')}` : plural(inView.length, 'design')}
            </p>
            <button type="button" className="btn btn--quiet" onClick={openAdd} title="Add a design (Ctrl/⌘ K)">
              <Icon name="plus" size={15} /> Add design
            </button>
          </div>
        </div>
      </header>

      <div className="toolbar">
        <div className="chips" role="group" aria-label="Switch collection">
          {[ALL, ...shelf].map((category) => (
            <button
              key={category}
              type="button"
              className="chip"
              aria-pressed={view === category}
              onClick={() => view !== category && openCollection(category, { replace: true })}
            >
              {category === ALL ? 'All' : category}
              <span className="chip__n">{countFor(category)}</span>
            </button>
          ))}
        </div>
        <div className="toolbar__tools">
          <label className="search">
            <Icon name="search" size={15} />
            <span className="sr-only">Search {view === ALL ? 'all designs' : view}</span>
            <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
          </label>
          <label className="select">
            <span className="sr-only">Sort order</span>
            <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
              <option value="recent">Newest first</option>
              <option value="alphabetical">A → Z</option>
            </select>
          </label>
        </div>
      </div>

      {filteredProjects.length ? (
        <ul className="designs" aria-label={`Designs in ${view}`}>
          {filteredProjects.map((project) => (
            <li key={project.id}><DesignCard project={project} onOpen={setSelectedProject} /></li>
          ))}
        </ul>
      ) : (
        <EmptyShelf category={view} query={query} onClearSearch={() => setQuery('')} onBack={closeCollection} />
      )}
    </div>
  )

  return (
    <AppFrame active={active} onNavigate={navigate}>
      <section className="library" id="library" aria-label="Design library">
        {view === null ? overview : shelfView}
        {view === null && (
          <a className="library__next" href="#about" onClick={(event) => { event.preventDefault(); scrollToId('about') }}>
            About {profile.firstName} &amp; contact <Icon name="arrowDown" size={14} />
          </a>
        )}
      </section>

      <AboutSection onBackToLibrary={() => navigate('library')} />

      {selectedProject && (
        <InspectionView
          project={selectedProject}
          number={selectedIndex >= 0 ? selectedIndex + 1 : 1}
          total={filteredProjects.length}
          onClose={() => setSelectedProject(null)}
          onPrevious={previousProject ? () => setSelectedProject(previousProject) : undefined}
          onNext={nextProject ? () => setSelectedProject(nextProject) : undefined}
          onEdit={() => { setEditingProject(selectedProject); setSelectedProject(null); setAddOpen(true) }}
          onDelete={() => handleDeleteProject(selectedProject)}
        />
      )}
      {addOpen && (
        <ArtifactPanel
          project={editingProject}
          onClose={() => { setAddOpen(false); setEditingProject(null) }}
          onSave={handleSaveProject}
        />
      )}
    </AppFrame>
  )
}
