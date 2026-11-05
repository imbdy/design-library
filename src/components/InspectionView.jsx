import { useEffect, useRef } from 'react'
import ArtifactFace from './ArtifactFace'
import Icon from './Icon'

/**
 * Detail view for a single design. Keyboard: Escape closes, ← / → move
 * between neighbouring designs in the current collection.
 */
export default function InspectionView({ project, number, total, onClose, onPrevious, onNext, onEdit, onDelete }) {
  const closeRef = useRef(null)

  /* focus the close button on open; give focus back to whatever opened us */
  useEffect(() => {
    const opener = document.activeElement
    closeRef.current?.focus({ preventScroll: true })
    return () => { if (opener instanceof HTMLElement && document.contains(opener)) opener.focus({ preventScroll: true }) }
  }, [])

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === 'Escape') { event.preventDefault(); onClose() }
      else if (event.key === 'ArrowLeft') onPrevious?.()
      else if (event.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, onPrevious, onNext])

  const extraParagraphs = Array.isArray(project.body) ? project.body.filter((p) => p && p !== project.description) : []

  return (
    <div className="overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <div className="detail" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <button ref={closeRef} type="button" className="icon-btn detail__close" onClick={onClose} aria-label="Close and return to the collection">
          <Icon name="close" size={18} />
        </button>

        <section className="detail__stage" aria-label="Preview">
          {project.imageUrl
            ? <img className="detail__img" src={project.imageUrl} alt={`Preview of ${project.title}`} />
            : <ArtifactFace project={project} className="detail__face" />}
        </section>

        <div className="detail__side">
          <div className="detail__id">
            <p className="eyebrow">{project.eyebrow ?? 'Design'}{total > 1 ? ` · ${number} of ${total}` : ''}</p>
            <h2 id="detail-title" className="display display--detail">{project.title}</h2>
          </div>

          <p className="detail__desc">{project.description}</p>
          {extraParagraphs.map((paragraph) => <p key={paragraph} className="detail__desc detail__desc--more">{paragraph}</p>)}

          <dl className="facts facts--detail">
            <div><dt>Collection</dt><dd>{project.categories?.join(' · ') || 'Unfiled'}</dd></div>
            <div><dt>Year</dt><dd>{project.year ?? '—'}</dd></div>
            <div><dt>Status</dt><dd>{project.status ?? 'Saved locally'}</dd></div>
            {project.role && <div><dt>Role</dt><dd>{project.role}</dd></div>}
            {project.tools?.length > 0 && <div><dt>Tools</dt><dd>{project.tools.join(' · ')}</dd></div>}
          </dl>

          {project.tags?.length > 0 && (
            <ul className="tags" aria-label="Tags">
              {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
            </ul>
          )}

          {project.sourceUrl && (
            <a className="btn btn--ink detail__source" href={project.sourceUrl} target="_blank" rel="noreferrer">
              Open project <Icon name="external" size={15} />
            </a>
          )}

          {project.supportingImages?.length > 0 && (
            <div className="detail__support">
              {project.supportingImages.map((image) => <img key={image} src={image} alt="" loading="lazy" />)}
            </div>
          )}

          <div className="detail__foot">
            <div className="detail__pager">
              <button type="button" className="icon-btn" disabled={!onPrevious} onClick={onPrevious} aria-label="Previous design">
                <Icon name="arrowLeft" size={16} />
              </button>
              <button type="button" className="icon-btn" disabled={!onNext} onClick={onNext} aria-label="Next design">
                <Icon name="arrowRight" size={16} />
              </button>
            </div>
            <div className="detail__manage">
              <button type="button" className="text-link text-link--small" onClick={onEdit}><Icon name="edit" size={13} /> Edit</button>
              <button type="button" className="text-link text-link--small text-link--danger" onClick={onDelete}><Icon name="close" size={12} /> Remove</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
