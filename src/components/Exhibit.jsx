import ArtifactFace from './ArtifactFace'
import Icon from './Icon'

/**
 * Editorial display formats — the sequence varies deliberately:
 * panorama, offset panel, standard panel, large view, inset artifact.
 */
export const FORMATS = [
  { width: 'is-wide', frame: 'panorama', drop: '' },
  { width: 'is-panel', frame: 'portrait', drop: 'rise' },
  { width: 'is-standard', frame: 'min', drop: '' },
  { width: 'is-large', frame: 'panorama', drop: 'rise' },
  { width: 'is-panel', frame: 'min', drop: 'drop' },
  { width: 'is-inset', frame: 'standard', drop: '' },
]

export default function Exhibit({ project, number, format, onOpen }) {
  return (
    <div className={`piece-slot ${format.width} ${format.drop ? `piece-slot--${format.drop}` : ''}`}>
      <article className={`exhibit exhibit--${format.frame}`}>
        <button
          className="exhibit__frame"
          onClick={() => onOpen(project)}
          aria-label={`Inspect ${project.title}`}
        >
          <ArtifactFace project={project} />
          <span className="artifact__arrow" aria-hidden="true"><Icon name="arrowRight" size={14} /></span>
        </button>
        <div className="exhibit__plate">
          <span className="no">{String(number).padStart(2, '0')} /</span>
          <h3>{project.title}</h3>
          <span className="yr">{project.year ?? ''}</span>
        </div>
        <p className="exhibit__sub">{project.categories?.[0] ?? 'Unfiled'}{project.tags?.[0] ? ` · ${project.tags[0]}` : ''}</p>
      </article>
    </div>
  )
}
