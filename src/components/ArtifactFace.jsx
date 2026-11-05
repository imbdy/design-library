import { categoryDetails } from '../data/projects'

/**
 * The visual face of a single design.
 * With a preview image: the image. Without one: a typographic title plate,
 * set on the key tone of the design's first collection — like a catalogue
 * plate waiting for its photograph, never a fake illustration.
 */
export default function ArtifactFace({ project, className = '' }) {
  const category = project?.categories?.[0]
  const tone = categoryDetails[category]?.tone ?? 'oat'

  if (project?.imageUrl) {
    return (
      <div className={`face face--image ${className}`}>
        <img src={project.imageUrl} alt="" loading="lazy" />
      </div>
    )
  }

  return (
    <div className={`face face--plate tone-${tone} ${className}`}>
      <span className="face__kicker">{category ?? 'Unfiled'}</span>
      <span className="face__title">{project?.title || 'Untitled'}</span>
      <span className="face__foot">
        <span>{project?.year ?? ''}</span>
        <span>No preview yet</span>
      </span>
    </div>
  )
}
