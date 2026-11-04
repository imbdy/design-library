import Icon from './Icon'
import VisualPreview from './VisualPreview'

export default function ProjectDetail({ project, onClose }) {
  return (
    <div className="detail-overlay" role="dialog" aria-modal="true" aria-labelledby="detail-title">
      <div className="detail-panel">
        <div className="detail-panel__topbar">
          <button className="icon-button" onClick={onClose} aria-label="Close project detail"><Icon name="close" /></button>
          <span>project / {project.year}</span>
          <span className="detail-panel__status"><span /> {project.status}</span>
        </div>
        <div className="detail-panel__content">
          <div className="detail-panel__intro">
            <div className="kicker">{project.eyebrow}</div>
            <h2 id="detail-title">{project.title}</h2>
            <p className="detail-panel__lead">{project.description}</p>
            <div className="detail-meta-grid">
              <div><span>Role</span><strong>{project.role}</strong></div>
              <div><span>Tools</span><strong>{project.tools.join(' · ')}</strong></div>
            </div>
          </div>
          <VisualPreview />
          <div className="detail-panel__story">
            <div className="story-label">01 / the beginning</div>
            <div>
              <h3>A library that grows with the work.</h3>
              {project.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </div>
          <div className="detail-panel__next">
            <span>Next milestone</span>
            <strong>Add the first real design study and its visual story.</strong>
            <Icon name="arrowRight" />
          </div>
        </div>
      </div>
    </div>
  )
}
