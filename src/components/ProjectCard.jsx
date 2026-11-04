import Icon from './Icon'
import VisualPreview from './VisualPreview'

export default function ProjectCard({ project, featured = false, onOpen }) {
  return (
    <article className={`project-card ${featured ? 'project-card--featured' : ''}`}>
      <button className="project-card__open" onClick={() => onOpen(project)} aria-label={`Open ${project.title}`}>
        <VisualPreview compact={!featured} />
      </button>
      <div className="project-card__body">
        <div>
          <div className="project-card__eyebrow">{project.eyebrow}</div>
          <h3>{project.title}</h3>
        </div>
        <span className="project-card__year">{project.year}</span>
        <p>{project.description}</p>
        <div className="project-card__footer">
          <div className="tag-list">
            {project.categories.map((category) => <span className="tag" key={category}>{category}</span>)}
          </div>
          <button className="text-link" onClick={() => onOpen(project)}>View case <Icon name="arrowUpRight" size={15} /></button>
        </div>
      </div>
    </article>
  )
}
