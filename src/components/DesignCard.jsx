import ArtifactFace from './ArtifactFace'

/** A single design inside a collection. Opens the detail view. */
export default function DesignCard({ project, onOpen }) {
  const meta = [project.categories?.join(' · ') || 'Unfiled', project.year].filter(Boolean).join(' — ')

  return (
    <button type="button" className="dcard" onClick={() => onOpen(project)}>
      <span className="dcard__frame">
        <ArtifactFace project={project} />
      </span>
      <span className="dcard__body">
        <span className="dcard__title">{project.title}</span>
        <span className="dcard__foot">
          <span className="dcard__meta">{meta}</span>
          {project.status && <span className="dcard__status">{project.status}</span>}
        </span>
      </span>
    </button>
  )
}
