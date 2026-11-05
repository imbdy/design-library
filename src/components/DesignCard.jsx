import ArtifactFace from './ArtifactFace'
import Icon from './Icon'

/**
 * One design on the plate. `featured` is used when a collection holds a
 * single design: the work gets the whole plate, with its description beside it.
 */
export default function DesignCard({ project, onOpen, featured = false }) {
  const meta = [project.categories?.join(' · ') || 'Unfiled', project.year].filter(Boolean).join(' — ')

  return (
    <button type="button" className={`work ${featured ? 'work--featured' : ''}`} onClick={() => onOpen(project)}>
      <span className="work__frame">
        <ArtifactFace project={project} />
      </span>
      <span className="work__caption">
        <span className="work__text">
          <span className="work__title">{project.title}</span>
          {featured && project.description && <span className="work__desc">{project.description}</span>}
        </span>
        <span className="work__meta">
          <span>{meta}</span>
          {project.status && <span className="work__status">{project.status}</span>}
          {featured && <span className="work__open">View details <Icon name="arrowRight" size={14} /></span>}
        </span>
      </span>
    </button>
  )
}
