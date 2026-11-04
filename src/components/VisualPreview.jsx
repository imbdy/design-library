import Icon from './Icon'

export default function VisualPreview({ compact = false, project }) {
  const hasCustomImage = Boolean(project?.imageUrl)

  return (
    <div className={`visual-preview ${compact ? 'visual-preview--compact' : ''} ${hasCustomImage ? 'visual-preview--custom' : ''}`} aria-label={`Preview of ${project?.title ?? 'the personal design library'}`}>
      <div className="preview-frame">
        {hasCustomImage && <img className="preview-image" src={project.imageUrl} alt="" loading="lazy" />}
        <div className="preview-topline">
          <span className="preview-topline__label">{project?.eyebrow ?? '01 / the site itself'}</span>
          <span className="preview-topline__year">{project?.year ?? '2026'}</span>
        </div>
        <div className="preview-specimen">
          <div className="preview-specimen__rule" />
          <span className="preview-specimen__kicker">{project?.categories?.[0] ?? 'personal design library'}</span>
          <div className="preview-specimen__title">{project?.title ? <>{project.title.split(' ').slice(0, 2).join(' ')}<br /><em>{project.title.split(' ').slice(2).join(' ') || 'to explore.'}</em></> : <>A place<br /><em>to explore.</em></>}</div>
          <div className="preview-specimen__mark">AB<span>/</span></div>
          <div className="preview-specimen__footer">
            <span>design / code / process</span>
            <span>scroll to enter <Icon name="arrowDown" size={13} /></span>
          </div>
        </div>
      </div>
      <div className="preview-float preview-float--top"><span>work in progress</span><span className="preview-float__dot" /></div>
      <div className="preview-float preview-float--bottom"><Icon name="sparkle" size={14} /><span>crafted slowly</span></div>
    </div>
  )
}
