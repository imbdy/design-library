import { useEffect, useRef } from 'react'
import Icon from './Icon'

/**
 * Inspection chamber — the selected artifact occupies a wall of its own;
 * the room around it recedes. Keyboard: Escape left/ArrowRight/ArrowLeft.
 */
export default function InspectionView({ project, number, onClose, onPrevious, onNext, onEdit, onDelete }) {
  const closeRef = useRef(null)

  useEffect(() => {
    closeRef.current?.focus({ preventScroll: true })
    const onKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose() }
      else if (event.key === 'ArrowLeft') onPrevious?.()
      else if (event.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrevious, onNext])

  const categoryLabel = project.categories?.[0] ?? 'Interface study'

  return (
    <div className="inspect-overlay">
      <div className="inspect" role="dialog" aria-modal="true" aria-labelledby="inspect-title">
        <button ref={closeRef} className="inspect__close" onClick={onClose} aria-label="Close inspection, return to collection">
          <Icon name="close" />
        </button>

        {/* the wall the artifact rests on */}
        <section className="inspect__stage">
          <div className="inspect__wall">
            <div className="inspect__art">
              {project.imageUrl ? (
                <img src={project.imageUrl} alt={`Full view of ${project.title}`} />
              ) : (
                <div className="artifact__specimen">
                  <span className="rule-wood" />
                  <h4>{project.title}</h4>
                  <span className="artifact__tags">{categoryLabel} · {project.year ?? ''}</span>
                </div>
              )}
            </div>
          </div>
          <div className="inspect__plate">
            <b>{String(number).padStart(2, '0')} / {categoryLabel}</b>
            <span>specimen {project.year ?? ''}</span>
          </div>
        </section>

        {/* quiet label surface */}
        <aside className="inspect__side">
          <div className="inspect__id">
            <span className="sig sig--wood">{project.eyebrow ?? 'Exhibit'}</span>
            <h2 id="inspect-title">{project.title}</h2>
          </div>

          <div className="inspect__meta">
            <div><span>Category</span><b>{project.categories?.join(' · ') || 'Unfiled'}</b></div>
            <div><span>Year</span><b>{project.year ?? '—'}</b></div>
            <div><span>State</span><b>{project.status ?? 'Saved locally'}</b></div>
            {project.tools?.length > 0 && <div><span>Tools</span><b>{project.tools.join(' · ')}</b></div>}
            {project.role && <div><span>Role</span><b>{project.role}</b></div>}
          </div>

          <p className="inspect__desc">{project.description}</p>
          {Array.isArray(project.body) && project.body.length > 0 && project.body.some((p) => p !== project.description) && (
            <div>
              {project.body.filter((p) => p !== project.description).map((paragraph) => (
                <p key={paragraph} className="inspect__desc" style={{ marginTop: 12 }}>{paragraph}</p>
              ))}
            </div>
          )}
          {project.sourceUrl && (
            <a className="vault-link" href={project.sourceUrl} target="_blank" rel="noreferrer" style={{ marginTop: 18 }}>
              Open project <Icon name="external" size={13} />
            </a>
          )}

          {project.tags?.length > 0 && (
            <div className="inspect__tags">
              {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
            </div>
          )}

          {project.supportingImages?.length > 0 && (
            <div className="inspect__support">
              {project.supportingImages.map((image) => <img key={image} src={image} alt="" loading="lazy" />)}
            </div>
          )}

          <div className="inspect__actions">
            <button className="vault-link" onClick={onEdit}><Icon name="edit" size={13} /> Edit the record</button>
            <button className="vault-link vault-link--danger" onClick={onDelete}><Icon name="close" size={12} /> Remove</button>
          </div>

          {/* adjacent wings */}
          <div className="inspect__wings">
            <button className="inspect__wing" disabled={!onPrevious} onClick={onPrevious}>
              <span>← adjacent wing</span>
              <small>{onPrevious ? 'Previous exhibit' : 'Start of the hallway'}</small>
            </button>
            <button className="inspect__wing" disabled={!onNext} onClick={onNext}>
              <span>adjacent wing →</span>
              <small>{onNext ? 'Next exhibit' : 'End of the hallway'}</small>
            </button>
          </div>
        </aside>
      </div>
    </div>
  )
}
