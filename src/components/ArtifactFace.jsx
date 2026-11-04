export default function ArtifactFace({ project, compact = false }) {
  const img = project?.imageUrl
  const category = project?.categories?.[0] ?? 'Interface study'
  const title = project?.title ?? 'Untitled study'
  const words = title.split(' ')
  const cut = Math.max(1, Math.ceil(words.length / 2))
  const first = words.slice(0, cut).join(' ')
  const second = words.slice(cut).join(' ')

  return (
    <div className="artifact" aria-label={`Artifact preview of ${title}`}>
      <div className="artifact__mat">
        <div className="artifact__glass">
          {img ? (
            <img src={img} alt="" loading="lazy" />
          ) : (
            <div className={`artifact__specimen ${compact ? 'is-compact' : ''}`}>
              <span className="rule-wood" />
              <h4>{first}<br /><em>{second || 'in progress'}</em></h4>
              <span className="artifact__tags">{category} · {project?.year ?? ''}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
