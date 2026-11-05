import CategoryCover from './CategoryCover'
import { categoryDetails } from '../data/projects'

/**
 * The visual face of a single design: its preview image when it has one,
 * otherwise the drawn cover of its first collection.
 */
export default function ArtifactFace({ project, className = '' }) {
  const category = project?.categories?.[0]
  const details = categoryDetails[category] ?? { motif: 'experiments', tint: 'pearl' }

  return (
    <div className={`face ${className}`}>
      <CategoryCover motif={details.motif} tint={details.tint} image={project?.imageUrl} />
      {!project?.imageUrl && <span className="face__note">No preview yet</span>}
    </div>
  )
}
