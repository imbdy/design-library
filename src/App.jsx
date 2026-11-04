import { useEffect, useMemo, useState } from 'react'
import AppFrame from './components/AppFrame'
import ArtifactPanel from './components/ArtifactPanel'
import InspectionView from './components/InspectionView'
import VaultScene from './components/VaultScene'
import Exhibit, { FORMATS } from './components/Exhibit'
import Icon from './components/Icon'
import { categories, projects as seedProjects } from './data/projects'

function VacantState({ query, category, onAdd, onReset }) {
  const filtered = Boolean(query) || category !== 'All designs'
  return (
    <div className="vacant reveal is-in">
      <div className="vacant__mark"><Icon name="frames" size={22} /></div>
      <div>
        <h3>{filtered ? 'Nothing hangs here yet.' : 'The hallway is empty.'}</h3>
        <p>{filtered ? 'No artifact matches this wing of the archive. Try another search, or clear the filters.' : 'New work will be installed here as soon as you place the first piece.'}</p>
      </div>
      {filtered
        ? <button className="vault-btn vault-btn--frost" onClick={onReset}>Return to full collection <Icon name="arrowRight" size={15} /></button>
        : <button className="vault-btn vault-btn--wood" onClick={onAdd}><Icon name="plus" size={15} /> Place the first exhibit</button>}
    </div>
  )
}

function RoomExperiments({ onAdd, collection }) {
  const filled = collection.filter((p) => p.imageUrl).length
  const experiments = collection.filter((p) => p.categories?.includes('Experiments')).length
  return (
    <section className="room reveal" aria-labelledby="room-exp-title">
      <div className="room__copy">
        <span className="sig sig--wood">Room 03 / open plan</span>
        <h2 id="room-exp-title">Not every idea needs a finished case study.</h2>
        <p>A reserve room for motion studies, component sketches, and unfinished directions. File them here while they are still questions, not answers.</p>
        <button className="vault-btn vault-btn--wood" onClick={onAdd}><Icon name="plus" size={15} /> Add an experiment</button>
      </div>
      <div className="room__side" aria-hidden="true">
        <div className="room-axis"><i /><i /><i /><b>OPEN / UNFILED</b></div>
        <div className="stat"><span>Artifacts in the vault</span><b>{String(collection.length).padStart(2, '0')}</b></div>
        <div className="stat"><span>Filed as experiments</span><b>{String(experiments).padStart(2, '0')}</b></div>
        <div className="stat"><span>Carrying a photograph</span><b>{String(filled).padStart(2, '0')}</b></div>
      </div>
    </section>
  )
}

function RoomNotes() {
  return (
    <section className="room room--quiet reveal" aria-labelledby="room-notes-title">
      <div className="room__copy">
        <span className="sig sig--wood">Room 04 / reading room</span>
        <h2 id="room-notes-title">About the archive.</h2>
        <p>This is a working vault rather than a finished showroom. A personal library for interface studies, experiments, and the decisions behind them — kept close, kept honest.</p>
        <button className="vault-btn vault-btn--frost" onClick={() => window.open('https://github.com/imbdy/design-library', '_blank', 'noopener,noreferrer')}>
          Open the repository <Icon name="external" size={15} />
        </button>
      </div>
      <div className="room__side" aria-hidden="true">
        <div className="stat"><span>archive</span><b>Personal design library</b></div>
        <div className="stat"><span>focus</span><b>UI/UX · frontend · systems</b></div>
        <div className="stat"><span>storage</span><b>Preserved locally</b></div>
        <div className="stat"><span>keeper</span><b>abood — designer · frontend learner</b></div>
      </div>
    </section>
  )
}

export default function App() {
  const [active, setActive] = useState('entrance')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All designs')
  const [query, setQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [sortOrder, setSortOrder] = useState('recent')
  const [addOpen, setAddOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [collection, setCollection] = useState(() => {
    try {
      const saved = window.localStorage.getItem('liquid-atelier-projects')
      const parsed = saved ? JSON.parse(saved) : null
      return Array.isArray(parsed) ? parsed : seedProjects
    } catch { return seedProjects }
  })

  /* reveal-on-arrival for exhibition rooms */
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('is-in') })
    }, { threshold: 0.12 })
    document.querySelectorAll('.reveal:not(.is-in)').forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  })

  useEffect(() => {
    const reset = () => { setSelectedCategory('All designs'); setQuery(''); setSortOrder('recent') }
    window.addEventListener('reset-library', reset)
    const onKey = (event) => { if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); setAddOpen(true) } }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('reset-library', reset); window.removeEventListener('keydown', onKey) }
  }, [])

  useEffect(() => { document.body.style.overflow = addOpen || selectedProject ? 'hidden' : ''; return () => { document.body.style.overflow = '' } }, [addOpen, selectedProject])

  const navigate = (section) => {
    setActive(section)
    setMobileOpen(false)
    window.setTimeout(() => document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 0)
  }

  const filteredProjects = useMemo(() => {
    const list = collection.filter((project) => {
      const matchesCategory = selectedCategory === 'All designs' || project.categories?.includes(selectedCategory)
      const haystack = `${project.title} ${project.description} ${project.categories?.join(' ') ?? ''} ${project.tags?.join(' ') ?? ''}`.toLowerCase()
      return matchesCategory && haystack.includes(query.toLowerCase())
    })
    return [...list].sort((a, b) => sortOrder === 'alphabetical' ? a.title.localeCompare(b.title) : String(b.year).localeCompare(String(a.year)))
  }, [collection, selectedCategory, query, sortOrder])

  const saveCollection = (next) => { setCollection(next); window.localStorage.setItem('liquid-atelier-projects', JSON.stringify(next)) }
  const handleSaveProject = (project) => {
    const exists = collection.some((item) => item.id === project.id)
    saveCollection(exists ? collection.map((item) => item.id === project.id ? project : item) : [project, ...collection])
    setEditingProject(null); setAddOpen(false); setSelectedProject(project)
  }
  const handleDeleteProject = (project) => {
    if (!window.confirm(`Install null instead of “${project.title}”? The record will be removed from this archive.`)) return
    saveCollection(collection.filter((item) => item.id !== project.id))
    setSelectedProject(null)
  }
  const openAdd = () => { setEditingProject(null); setAddOpen(true) }

  const selectedIndex = selectedProject ? filteredProjects.findIndex((p) => p.id === selectedProject.id) : -1
  const previousProject = selectedIndex > 0 ? filteredProjects[selectedIndex - 1] : null
  const nextProject = selectedIndex >= 0 && selectedIndex < filteredProjects.length - 1 ? filteredProjects[selectedIndex + 1] : null
  const recent = useMemo(() => [...collection].sort((a, b) => String(b.year).localeCompare(String(a.year))).slice(0, 3), [collection])

  return (
    <AppFrame active={active} onNavigate={navigate} mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} onAdd={openAdd}>
      {/* LEVEL 01 — ENTRANCE */}
      <section className="entrance" id="entrance">
        <div className="entrance__editorial">
          <div className="entrance__head">
            <span className="sig-row"><span className="rule-wood" /><span className="sig">Nordic specimen vault / level 01</span></span>
            <h1 className="display entrance__headline">The archive holds <em>specimens</em></h1>
            <p className="entrance__lede">Interface studies, motion experiments, and unfinished ideas — collected, framed, and preserved inside one quiet architectural hall.</p>
          </div>
          <div className="entrance__actions">
            <button className="vault-btn vault-btn--snow" onClick={() => navigate('collection')}>Walk the collection <Icon name="arrowDown" size={15} /></button>
            <button className="vault-btn vault-btn--frost" onClick={openAdd}><Icon name="plus" size={15} /> New artifact</button>
          </div>
          <div className="entrance__index-foot">
            <b>01</b>
            <p>Every design is treated as an individual exhibit — hung, labelled, and kept for return visits.</p>
          </div>
        </div>
        <VaultScene pieces={recent} />
      </section>

      {/* LEVEL 02 — COLLECTION */}
      <section className="gallery" id="collection">
        <div className="gallery-head reveal">
          <div className="gallery-head__id">
            <span className="sig sig--wood">02 / the collection</span>
            <h2 className="display">One hallway, every <em>exhibit.</em></h2>
            <p>Move between the pieces as you would through an exhibition. Filter a wing, search a name, or inspect anything that draws you closer.</p>
          </div>
          <div className="gallery-head__count" aria-hidden="true">
            <b>{String(collection.length).padStart(2, '0')}</b>
            <span>exhibits installed</span>
          </div>
        </div>

        <div className="gallery-strip">
          <div className="gallery-strip__cats" role="tablist" aria-label="Filter the collection by category">
            {categories.map((category) => (
              <button key={category} className={selectedCategory === category ? 'is-active' : ''} onClick={() => setSelectedCategory(category)}>
                {category === 'All designs' ? 'All wings' : category}
              </button>
            ))}
          </div>
          <div className="gallery-strip__right">
            <label className="gallery-strip__search">
              <Icon name="search" size={14} />
              <span className="sr-only">Search the collection</span>
              <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="search the archive…" />
            </label>
            <label className="gallery-strip__sort">
              <span className="sr-only">Sort order</span>
              <select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)} aria-label="Sort order">
                <option value="recent">Newest first</option>
                <option value="alphabetical">A → Z</option>
              </select>
            </label>
          </div>
        </div>

        {filteredProjects.length ? (
          <div className="hallway">
            {filteredProjects.map((project, index) => (
              <Exhibit
                key={project.id}
                project={project}
                number={index + 1}
                format={FORMATS[index % FORMATS.length]}
                onOpen={setSelectedProject}
              />
            ))}
            <button className="niche-reserve reveal" onClick={openAdd}>
              <span className="sig">Reserve · next slot {String(collection.length + 1).padStart(2, '0')}</span>
              <strong>Make room for the <em>next idea.</em></strong>
              <small>Every archive grows one honest piece at a time.</small>
            </button>
          </div>
        ) : (
          <VacantState query={query} category={selectedCategory} onAdd={openAdd} onReset={() => window.dispatchEvent(new CustomEvent('reset-library'))} />
        )}

        {/* LEVEL 03 — ROOMS */}
        <div className="rooms" id="rooms">
          <div className="head">
            <span className="sig sig--wood">03 / side rooms</span>
          </div>
          <RoomExperiments onAdd={openAdd} collection={collection} />
          <RoomNotes />
        </div>

        <div className="closing reveal">
          <span className="sig">The work continues</span>
          <p>Good ideas need somewhere quiet to collect — <em>this is that place.</em></p>
          <button className="vault-btn vault-btn--frost" onClick={openAdd}>Install a new exhibit <Icon name="arrowUpRight" size={15} /></button>
        </div>
      </section>

      {selectedProject && (
        <InspectionView
          project={selectedProject}
          number={selectedIndex >= 0 ? selectedIndex + 1 : 1}
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
