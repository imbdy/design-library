import Icon from './Icon'

export default function VisualPreview({ compact = false }) {
  return (
    <div className={`visual-preview ${compact ? 'visual-preview--compact' : ''}`} aria-label="Abstract preview of the design library interface">
      <div className="preview-orb preview-orb--one" />
      <div className="preview-orb preview-orb--two" />
      <div className="preview-frame">
        <div className="preview-topline">
          <span className="preview-window-dots"><i /><i /><i /></span>
          <span className="preview-topline__label">library / 01</span>
          <span className="preview-status"><span /> live build</span>
        </div>
        <div className="preview-content">
          <div className="preview-sidebar">
            <span className="preview-sidebar__brand">AB<span>/</span></span>
            <span className="preview-sidebar__line preview-sidebar__line--active" />
            <span className="preview-sidebar__line" />
            <span className="preview-sidebar__line" />
            <span className="preview-sidebar__line preview-sidebar__line--short" />
          </div>
          <div className="preview-canvas">
            <div className="preview-canvas__heading">
              <span>selected work</span>
              <Icon name="arrowUpRight" size={14} />
            </div>
            <div className="preview-artboard">
              <div className="preview-artboard__glow" />
              <div className="preview-artboard__panel">
                <span className="mini-label">interface study</span>
                <span className="mini-title">soft systems<span>.</span></span>
                <span className="mini-line" />
                <span className="mini-line mini-line--short" />
              </div>
              <div className="preview-artboard__chip">in progress</div>
            </div>
            <div className="preview-canvas__footer"><span>one entry</span><span>explore ↗</span></div>
          </div>
        </div>
      </div>
      <div className="preview-float preview-float--top"><Icon name="sparkle" size={14} /><span>crafted slowly</span></div>
      <div className="preview-float preview-float--bottom"><span className="preview-float__dot" /> <span>design / code</span></div>
    </div>
  )
}
