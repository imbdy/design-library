import { useEffect, useMemo, useState } from 'react'
import AppShell from './components/AppShell'
import AddDesignPanel from './components/AddDesignPanel'
import Icon from './components/Icon'
import ProjectCard from './components/ProjectCard'
import ProjectDetail from './components/ProjectDetail'
import { categories, projects as seedProjects } from './data/projects'

const panelMeta = {
  collection: { index: '01', label: 'The collection', title: <>Design work, <em>in focus.</em></>, description: 'A quiet archive of interfaces, experiments, and the thinking behind them — collected slowly by abood.' },
  experiments: { index: '02', label: 'Experiments', title: <>Small ideas, <em>open-ended.</em></>, description: 'A place for interaction studies, unfinished directions, and things that are still learning what they want to be.' },
  about: { index: '03', label: 'About the studio', title: <>A portfolio with room for the <em>process.</em></>, description: 'imbdy.dev is a personal design library for UI/UX explorations, visual studies, and frontend work.' },
  contact: { index: '04', label: 'Open a line', title: <>Leave a note for the <em>studio.</em></>, description: 'The public contact channel is still being shaped. For now, the repository is the most direct way to follow the work.' },
}

function EmptyLibraryState({ query, category, onAdd }) {
  return <div className="empty-state"><div className="empty-state__mark"><Icon name="layers" size={25} /></div><div><span className="kicker">{query || category !== 'All designs' ? 'No match yet' : 'The archive is opening'}</span><h3>{query ? `Nothing matches “${query}”.` : category !== 'All designs' ? `No ${category.toLowerCase()} yet.` : 'The first pieces are still taking shape.'}</h3><p>{query || category !== 'All designs' ? 'Try another search or browse all designs.' : 'This library stays deliberately small and considered. New work appears here as it becomes ready to share.'}</p></div>{(query || category !== 'All designs') && <button className="text-link" onClick={() => window.dispatchEvent(new CustomEvent('reset-library'))}>Reset view <Icon name="arrowRight" size={15} /></button>}{!query && category === 'All designs' && <button className="text-link" onClick={onAdd}>Add the first piece <Icon name="plus" size={15} /></button>}</div>
}

function WorkspaceHeading({ meta, count, onAdd }) {
  return <div className="atelier-stage__heading"><div><div className="section-label"><span>{meta.index}</span><span>{meta.label}</span></div><h1>{meta.title}</h1><p>{meta.description}</p></div><div className="atelier-stage__heading-actions"><span className="atelier-count">{String(count).padStart(2, '0')} pieces</span><button className="button button--add" onClick={onAdd}><Icon name="plus" size={15} /> Add design</button></div></div>
}

function AboutPanel() {
  return <div className="atelier-information"><div className="information-index">FIELD NOTES / 01</div><div className="information-grid"><div><span>Based in</span><strong>Amman, Jordan</strong></div><div><span>Focus</span><strong>UI/UX · frontend · systems</strong></div><div><span>Working mode</span><strong>Designing in public</strong></div></div><div className="information-copy"><p>This is a working archive rather than a finished showroom. Each piece has room for the decisions behind it, the rough edges, and the next question it opened.</p><p>The site is also an artifact: a small test of how a portfolio can feel like a place to return to, not a page to pass through.</p></div><div className="information-signature"><span>abood</span><span>designer · frontend learner</span></div></div>
}

function ContactPanel() {
  return <div className="atelier-contact"><div className="contact-mark"><Icon name="arrowUpRight" size={28} /></div><div><div className="information-index">CONTACT / CURRENTLY OPEN</div><h2>Follow the work as it takes shape.</h2><p>No invented inbox, no silent form. The public repository is the current open door while a direct contact channel is being prepared.</p><a className="button button--primary" href="https://github.com/imbdy/design-library" target="_blank" rel="noreferrer">Open the repository <Icon name="external" size={15} /></a></div></div>
}

function ExperimentsPanel({ onAdd }) {
  return <div className="atelier-experiments"><div className="experiments-orbit" aria-hidden="true"><span /><span /><span /></div><div className="information-index">EXPERIMENTS / UNFILED</div><h2>Not every idea needs a finished case study.</h2><p>This space is ready for motion studies, component sketches, and small interactions. Add the first one when it is ready to be seen.</p><button className="button button--quiet" onClick={onAdd}><Icon name="plus" size={15} /> Add an experiment</button></div>
}

export default function App() {
  const [activePanel, setActivePanel] = useState('collection')
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All designs')
  const [query, setQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)
  const [sortOrder, setSortOrder] = useState('recent')
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [collection, setCollection] = useState(() => {
    try {
      const saved = window.localStorage.getItem('liquid-atelier-projects')
      const parsed = saved ? JSON.parse(saved) : null
      return Array.isArray(parsed) ? parsed : seedProjects
    } catch {
      return seedProjects
    }
  })

  useEffect(() => {
    const reset = () => { setSelectedCategory('All designs'); setQuery(''); setSortOrder('recent') }
    window.addEventListener('reset-library', reset)
    return () => window.removeEventListener('reset-library', reset)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'hidden' }
  }, [])

  const navigate = (section) => {
    const panel = section === 'home' || section === 'library' ? 'collection' : section
    setActiveSection(section)
    setActivePanel(panel)
    setMobileMenuOpen(false)
  }

  const filteredProjects = useMemo(() => {
    const filtered = collection.filter((project) => {
      const matchesCategory = selectedCategory === 'All designs' || project.categories.includes(selectedCategory)
      const haystack = `${project.title} ${project.description} ${project.categories.join(' ')} ${project.tags?.join(' ') ?? ''}`.toLowerCase()
      return matchesCategory && haystack.includes(query.toLowerCase())
    })
    return [...filtered].sort((a, b) => sortOrder === 'alphabetical' ? a.title.localeCompare(b.title) : String(b.year).localeCompare(String(a.year)))
  }, [collection, selectedCategory, query, sortOrder])

  const saveCollection = (nextCollection) => { setCollection(nextCollection); window.localStorage.setItem('liquid-atelier-projects', JSON.stringify(nextCollection)) }
  const handleSaveProject = (project) => { const exists = collection.some((item) => item.id === project.id); saveCollection(exists ? collection.map((item) => item.id === project.id ? project : item) : [project, ...collection]); setEditingProject(null); setIsAddOpen(false); setSelectedProject(project) }
  const openAdd = () => { setEditingProject(null); setIsAddOpen(true) }
  const meta = panelMeta[activePanel]

  return <AppShell {...{ activeSection, onNavigate: navigate, mobileMenuOpen, setMobileMenuOpen }}>
    <div className="atelier-workspace" id="home">
      <aside className="atelier-rail">
        <div className="atelier-rail__identity"><div className="atelier-rail__monogram">AB<span>/</span></div><div><strong>imbdy.dev</strong><span>LIQUID ATELIER</span></div></div>
        <p className="atelier-rail__intro">A living archive for quiet interfaces, useful experiments, and the space between them.</p>
        <div className="atelier-rail__group"><div className="atelier-rail__label">Navigate</div><button className={activePanel === 'collection' ? 'is-active' : ''} onClick={() => navigate('library')}><span>01</span> Collection <Icon name="arrowRight" size={13} /></button><button className={activePanel === 'experiments' ? 'is-active' : ''} onClick={() => navigate('experiments')}><span>02</span> Experiments <Icon name="arrowRight" size={13} /></button><button className={activePanel === 'about' ? 'is-active' : ''} onClick={() => navigate('about')}><span>03</span> About <Icon name="arrowRight" size={13} /></button><button className={activePanel === 'contact' ? 'is-active' : ''} onClick={() => navigate('contact')}><span>04</span> Contact <Icon name="arrowRight" size={13} /></button></div>
        <div className="atelier-rail__group atelier-rail__group--filters"><div className="atelier-rail__label">Filter collection</div>{categories.map((category) => <button key={category} className={selectedCategory === category ? 'is-active' : ''} onClick={() => { setSelectedCategory(category); setActivePanel('collection') }}><span className="filter-index">{category === 'All designs' ? '×' : '—'}</span>{category}</button>)}</div>
        <button className="atelier-add" onClick={openAdd}><Icon name="plus" size={15} /><span>Add a new piece</span><kbd>⌘ K</kbd></button>
        <div className="atelier-rail__status"><i /> local archive<br /><span>stored in this browser</span></div>
      </aside>

      <section className="atelier-stage" aria-live="polite">
        <div className="atelier-stage__bar"><span>IMBDY / {meta.index}</span><span>{activePanel === 'collection' ? 'SELECTED WORKSPACE' : 'FOCUSED VIEW'} <i /></span></div>
        <div className="atelier-stage__content"><WorkspaceHeading meta={meta} count={collection.length} onAdd={openAdd} />
          {activePanel === 'collection' && <><div className="atelier-controls"><div className="atelier-controls__filters"><span>Showing</span><strong>{selectedCategory}</strong></div><div className="atelier-controls__right"><label className="search-field"><Icon name="search" size={14} /><span className="sr-only">Search the design library</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Find a piece" /></label><label className="sort-field"><span>Sort</span><select value={sortOrder} onChange={(event) => setSortOrder(event.target.value)}><option value="recent">Recent</option><option value="alphabetical">A–Z</option></select></label></div></div>{filteredProjects.length > 0 ? <div className={`atelier-project-grid ${filteredProjects.length === 1 ? 'is-sparse' : ''}`}>{filteredProjects.slice(0, 3).map((project, index) => <ProjectCard key={project.id} project={project} featured={false} variant={index % 3 === 1 ? 'offset' : ''} onOpen={setSelectedProject} />)}</div> : <EmptyLibraryState query={query} category={selectedCategory} onAdd={openAdd} />}</>}
          {activePanel === 'experiments' && <ExperimentsPanel onAdd={openAdd} />}
          {activePanel === 'about' && <AboutPanel />}
          {activePanel === 'contact' && <ContactPanel />}
        </div>
      </section>

      <aside className="atelier-dock"><div className="atelier-dock__label">Environment / 01</div><div className="atelier-scene-card"><div className="atelier-scene-card__top"><span>ATMOSPHERE</span><span>LIVE</span></div><div className="atelier-scene-card__line" /><h2>Designed as a place to <em>return to.</em></h2><p>The background moves with the pointer. The archive changes when you choose a different room.</p><div className="atelier-scene-card__meter"><span /><span /><span /><span /><span /></div></div><button className="atelier-dock__link" onClick={() => navigate('about')}><span><small>PROFILE / AB</small><strong>Read the field notes</strong></span><Icon name="arrowUpRight" size={15} /></button><button className="atelier-dock__link" onClick={() => navigate('contact')}><span><small>OPEN LINE / 04</small><strong>Follow the work</strong></span><Icon name="arrowUpRight" size={15} /></button><div className="atelier-dock__footer"><span>31°57′N</span><span>35°56′E</span><span>2026</span></div></aside>
    </div>
    {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} onEdit={() => { setEditingProject(selectedProject); setSelectedProject(null); setIsAddOpen(true) }} />}
    {isAddOpen && <AddDesignPanel project={editingProject} onClose={() => { setIsAddOpen(false); setEditingProject(null) }} onSave={handleSaveProject} />}
  </AppShell>
}
