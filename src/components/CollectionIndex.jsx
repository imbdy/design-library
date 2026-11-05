/**
 * The ledger: a numbered, ruled index of collections.
 * Selecting a row swaps the plate beside it; nothing navigates away.
 */
export default function CollectionIndex({ items, active, onSelect }) {
  return (
    <nav className="ledger" aria-label="Collections">
      <ol className="ledger__list">
        {items.map((item, index) => {
          const isActive = item.name === active
          return (
            <li key={item.name}>
              <button
                type="button"
                className={`ledger__row ${isActive ? 'is-active' : ''} ${item.count ? '' : 'is-empty'}`}
                aria-current={isActive ? 'true' : undefined}
                onClick={() => onSelect(item.name)}
              >
                <span className="ledger__no" aria-hidden="true">{String(index).padStart(2, '0')}</span>
                <span className={`ledger__key tone-${item.tone}`} aria-hidden="true" />
                <span className="ledger__name">{item.label}</span>
                <span className="ledger__count">
                  {item.count}
                  <span className="sr-only">{item.count === 1 ? ' design' : ' designs'}</span>
                </span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
