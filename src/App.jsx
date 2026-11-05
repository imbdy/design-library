import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import AppFrame from './components/AppFrame'
import AboutSection from './components/AboutSection'
import ArtifactPanel from './components/ArtifactPanel'
import CollectionIndex from './components/CollectionIndex'
import DesignCard from './components/DesignCard'
import InspectionView from './components/InspectionView'
import Icon from './components/Icon'
import { categories, categoryDetails, categorySlug, projects as seedProjects } from './data/projects'

const ALL = 'All designs'
const STORAGE_KEY = 'liquid-atelier-projects'
const shelf = categories.filter((category) => category !== ALL)
const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const isStacked = () => window.matchMedia('(max-width: 899px)').matches

/** `#collection/<slug>` → collection name; anything else → all designs */
function viewFromHash() {
  const match = window.location.hash.match(/^#collection\/(.+)$/)
  if (!match || match[1] === 'all') return ALL
  return shelf.find((category) => categorySlug(category) === match[1]) ?? ALL
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
      return Array.isArray(parsed) ? parsed : seedProjects
    } catch { return seedProjects }
  })
  const plateRef = useRef(null)

  /* ---------- navigation ---------- */

  const scrollToId = (id) => {
    const behavior = prefersReducedMotion() ? 'auto' : 'smooth'
    if (id === 'library') window.scrollTo({ top: 0, behavior })
    else document.getElementById(id)?.scrollIntoView({ behavior, block: 'start' })
  }

  const selectCollection = useCallback((category) => {
    window.history.replaceState(null, '', `#collection/${category === ALL ? 'all' : categorySlug(category)}`)
    setQuery('')
    setView(category)
    /* stacked layout: the plate sits below the index, so bring it into view */
    if (isStacked()) {
      requestAnimationFrame(() => plateRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' }))
    }
  }, [])

  useEffect(() => {
    const onHash = () => setView(viewFromHash())
    window.addEventListener('hashchange', onHash)
    if (window.location.hash === '#about') requestAnimationFrame(() => scrollToId('about'))
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  /* which section the visitor is in drives the top-bar mark */
  useEffect(() => {
    let frame = 0
    const update = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const about = document.getElementById('about')
        if (!about) return
        const atEnd = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
        setActive(atEnd || about.getBoundingClientRect().top < window.innerHeight * 0.5 ? 'about' : 'library')
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

  const countFor = (category) => (category === ALL ? collection.length : collection.filter((p) => p.categories?.includes(category)).length)

  const indexItems = [
    { name: ALL, label: 'All designs', tone: 'all', count: collection.length },
    ...shelf.map((category) => ({ name: category, label: category, tone: categoryDetails[category]?.tone ?? 'oat', count: countFor(category) })),
  ]

  const inView = useMemo(
    () => collection.filter((project) => view === ALL || project.categories?.includes(view)),
    [collection, view],
  )

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

  const collectionNo = shelf.indexOf(view) + 1
  const description = categoryDetails[view]?.description
  const layout = filteredProjects.length === 1 ? 'one' : filteredProjects.length === 2 ? 'two' : 'many'

  return (
    <AppFrame active={active} onNavigate={(section) => scrollToId(section)}>
      <section className="library" id="library" aria-label="Design library">
        {/* ---------- left: masthead + ledger ---------- */}
        <div className="library__ledger">
          <div className="library__sticky">
            <header className="masthead">
              <p className="kicker">Personal archive</p>
              <h1 className="masthead__title">My Design <em>Library</em></h1>
              <p className="masthead__lede">Interface studies, experiments, and the decisions behind them — collected in one place.</p>
            </header>

            <CollectionIndex items={indexItems} active={view} onSelect={selectCollection} />

            <a className="library__about" href="#about" onClick={(event) => { event.preventDefault(); scrollToId('about') }}>
              About &amp; contact <Icon name="arrowDown" size={14} />
            </a>
          </div>
        </div>

        {/* ---------- right: the plate ---------- */}
        <section className="plate" ref={plateRef} aria-labelledby="plate-title" key={view}>
          <header className="plate__head">
            <div className="plate__heading">
              <p className="kicker">{view === ALL ? `Index · ${plural(shelf.length, 'collection')}` : `Collection ${String(collectionNo).padStart(2, '0')} of ${String(shelf.length).padStart(2, '0')}`}</p>
              <h2 id="plate-title" className="plate__title">{view}</h2>
              {description && <p className="plate__desc">{description}</p>}
            </div>
            <div className="plate__tools">
              {inView.length > 1 && (
                <>
                  <label className="field-inline">
                    <Icon name="search" size={15} />
                    <span className="sr-only">Search {view === ALL ? 'all designs' : view}</span>
                    <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search" />
                  </label>
                  <label className="field-inline field-inline--select">
                    <span className="sr-only">Sort order</span>
                    <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}>
                      <option value="recent">Newest</option>
                      <option value="alphabetical">A–Z</option>
                    </select>
                  </label>
                </>
              )}
              <p className="plate__count" aria-live="polite">
                {query ? `${filteredProjects.length} of ${plural(inView.length, 'design')}` : plural(inView.length, 'design')}
              </p>
            </div>
          </header>

          <div className="plate__body">
            {filteredProjects.length ? (
              <ul className={`works works--${layout}`} aria-label={`Designs in ${view}`}>
                {filteredProjects.map((project) => (
                  <li key={project.id}>
                    <DesignCard project={project} featured={layout === 'one'} onOpen={setSelectedProject} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className={`vacancy tone-${categoryDetails[view]?.tone ?? 'oat'}`}>
                <p className="vacancy__title">{query ? 'No designs match that search.' : 'Nothing filed here yet.'}</p>
                <p className="vacancy__text">
                  {query ? 'Try another word, or clear the search.' : `Work in ${view} will appear on this plate once it’s added to the library.`}
                </p>
                {query
                  ? <button type="button" className="text-btn" onClick={() => setQuery('')}>Clear search</button>
                  : <button type="button" className="text-btn" onClick={() => selectCollection(ALL)}>See all designs <Icon name="arrowRight" size={14} /></button>}
              </div>
            )}
          </div>

          <footer className="plate__foot">
            <span>Stored in this browser</span>
            <button type="button" className="text-btn text-btn--quiet" onClick={openAdd} title="Add a design (Ctrl/⌘ K)">
              <Icon name="plus" size={14} /> Add a design
            </button>
          </footer>
        </section>
      </section>

      <AboutSection onBackToLibrary={() => scrollToId('library')} />

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
