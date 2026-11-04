import { useEffect, useMemo, useState } from 'react'
import AppShell from './components/AppShell'
import Icon from './components/Icon'
import ProjectCard from './components/ProjectCard'
import ProjectDetail from './components/ProjectDetail'
import VisualPreview from './components/VisualPreview'
import { categories, projects } from './data/projects'

function SectionLabel({ number, children }) {
  return <div className="section-label"><span>{number}</span><span>{children}</span></div>
}

function EmptyLibraryState({ query, category }) {
  return (
    <div className="empty-state">
      <div className="empty-state__mark"><Icon name="layers" size={25} /></div>
      <div>
        <span className="kicker">{query || category !== 'All work' ? 'No match yet' : 'The archive is opening'}</span>
        <h3>{query ? `Nothing matches “${query}”.` : category !== 'All work' ? `No ${category.toLowerCase()} yet.` : 'The first pieces are still taking shape.'}</h3>
        <p>{query || category !== 'All work' ? 'Try another search or browse all work.' : 'This library will stay deliberately small and considered. New work will appear here as it becomes ready to share.'}</p>
      </div>
      {(query || category !== 'All work') && <button className="text-link" onClick={() => window.dispatchEvent(new CustomEvent('reset-library'))}>Reset view <Icon name="arrowRight" size={15} /></button>}
    </div>
  )
}

export default function App() {
  const [activeSection, setActiveSection] = useState('home')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All work')
  const [query, setQuery] = useState('')
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    const reset = () => { setSelectedCategory('All work'); setQuery('') }
    window.addEventListener('reset-library', reset)
    return () => window.removeEventListener('reset-library', reset)
  }, [])

  useEffect(() => {
    document.body.style.overflow = selectedProject ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [selectedProject])

  const navigate = (section) => {
    setActiveSection(section)
    document.getElementById(section)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const filteredProjects = useMemo(() => projects.filter((project) => {
    const matchesCategory = selectedCategory === 'All work' || project.categories.includes(selectedCategory)
    const haystack = `${project.title} ${project.description} ${project.categories.join(' ')}`.toLowerCase()
    return matchesCategory && haystack.includes(query.toLowerCase())
  }), [selectedCategory, query])

  return (
    <AppShell {...{ activeSection, onNavigate: navigate, mobileMenuOpen, setMobileMenuOpen }}>
      <section className="hero section-wrap" id="home">
        <div className="hero__copy">
          <div className="kicker kicker--with-dot"><span className="live-dot" /> personal design portfolio · 2026</div>
          <h1>A quiet place for <em>loud ideas.</em></h1>
          <p className="hero__lead">A growing collection of interfaces, experiments, and the thinking behind them — built by <strong>abood.</strong></p>
          <div className="hero__actions">
            <button className="button button--primary" onClick={() => navigate('library')}>Explore the library <Icon name="arrowUpRight" size={16} /></button>
            <button className="button button--quiet" onClick={() => navigate('about')}>About this space <Icon name="arrowRight" size={16} /></button>
          </div>
          <div className="hero__note"><span className="hero__note-line" /><span>Designing in public, one considered piece at a time.</span></div>
        </div>
        <VisualPreview />
        <div className="hero__side-note"><span>01—</span><span>scroll to explore</span></div>
      </section>

      <section className="section-wrap selected-work" id="work">
        <div className="section-heading">
          <div><SectionLabel number="01">Selected work</SectionLabel><h2>The workbench, <em>in progress.</em></h2></div>
          <p>One honest starting point is better than a shelf of placeholders. This library will grow as the work becomes ready to share.</p>
        </div>
        <div className="selected-work__grid">
          {projects.map((project) => <ProjectCard key={project.id} project={project} featured onOpen={setSelectedProject} />)}
          <div className="work-note-card"><span className="work-note-card__index">next up / 02</span><Icon name="sparkle" size={22} /><h3>The next study<br /><em>is yours to add.</em></h3><p>Each new piece will have room for context, not just a thumbnail.</p><span className="work-note-card__line" /></div>
        </div>
      </section>

      <section className="library section-wrap" id="library">
        <div className="section-heading section-heading--library">
          <div><SectionLabel number="02">Browse the archive</SectionLabel><h2>Design, <em>collected.</em></h2></div>
          <p>Explore by the kind of thinking behind the piece. The collection is intentionally small while it finds its shape.</p>
        </div>
        <div className="library-toolbar">
          <div className="filter-list" role="list" aria-label="Filter work by category">
            {categories.map((category) => <button key={category} className={`filter-button ${selectedCategory === category ? 'is-selected' : ''}`} onClick={() => setSelectedCategory(category)}>{category}</button>)}
          </div>
          <label className="search-field"><Icon name="search" size={16} /><span className="sr-only">Search the design library</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the library" /></label>
        </div>
        {filteredProjects.length > 0 ? <div className="library-grid">{filteredProjects.map((project) => <ProjectCard key={project.id} project={project} onOpen={setSelectedProject} />)}</div> : <EmptyLibraryState query={query} category={selectedCategory} />}
      </section>

      <section className="about section-wrap" id="about">
        <div className="about__aside"><SectionLabel number="03">About this space</SectionLabel><div className="about__coordinates">31°57′N<br />35°56′E</div></div>
        <div className="about__content"><h2>A portfolio that shows the <em>process,</em> too.</h2><p>This is a personal design library for UI/UX explorations, visual studies, and frontend work. It is being built as a real product — with enough room for unfinished ideas, careful case studies, and the lessons between them.</p><p>The details are intentionally still open. As the library grows, each piece will bring its own context: what it was trying to solve, what changed, and what I learned by making it.</p><div className="about__signature"><span>abood</span><span>designer · frontend learner</span></div></div>
        <div className="about__callout"><span className="callout-icon"><Icon name="sparkle" size={16} /></span><span>The best work is<br /><strong>still ahead.</strong></span></div>
      </section>

      {selectedProject && <ProjectDetail project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </AppShell>
  )
}
