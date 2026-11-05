import CategoryCover from './CategoryCover'
import Icon from './Icon'

/** One collection on the library shelf. The whole card is the control. */
export default function CategoryCard({ name, details, count, image, index, wide = false, onOpen }) {
  const countLabel = count ? `${count} ${count === 1 ? 'design' : 'designs'}` : 'Nothing filed yet'

  return (
    <button type="button" className={`ccard ${wide ? 'ccard--wide' : ''} ${count ? '' : 'is-empty'}`} onClick={onOpen}>
      <span className="ccard__frame">
        <CategoryCover motif={details.motif} tint={details.tint} image={image} className="ccard__cover" />
        <span className="ccard__no" aria-hidden="true">No. {String(index).padStart(2, '0')}</span>
        <span className="ccard__go" aria-hidden="true"><Icon name="arrowUpRight" size={15} /></span>
      </span>
      <span className="ccard__body">
        <span className="ccard__head">
          <span className="ccard__name">{name}</span>
          <span className="ccard__count">{countLabel}</span>
        </span>
        <span className="ccard__desc">{details.description}</span>
      </span>
    </button>
  )
}
