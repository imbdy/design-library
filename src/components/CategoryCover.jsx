/**
 * Drawn covers for collections (and for designs without a preview image).
 * Each motif is a small paper cut-out of what the collection holds,
 * drawn with the same three materials: paper, ink, and a single iris accent.
 */
const MOTIFS = {
  websites: (
    <>
      <rect className="m-card m-card--back" x="92" y="30" width="176" height="120" rx="9" />
      <rect className="m-card" x="56" y="48" width="192" height="128" rx="9" />
      <path className="m-rule" d="M56 67h192" />
      <circle className="m-soft" cx="69" cy="57.5" r="2.6" />
      <circle className="m-soft" cx="78" cy="57.5" r="2.6" />
      <circle className="m-soft" cx="87" cy="57.5" r="2.6" />
      <rect className="m-ink" x="72" y="82" width="84" height="8" rx="4" />
      <rect className="m-soft" x="72" y="96" width="62" height="5" rx="2.5" />
      <rect className="m-accent" x="72" y="110" width="34" height="11" rx="5.5" />
      <rect className="m-tint" x="170" y="80" width="62" height="44" rx="5" />
      <rect className="m-tint" x="72" y="136" width="48" height="26" rx="4" />
      <rect className="m-tint" x="126" y="136" width="48" height="26" rx="4" />
      <rect className="m-tint" x="180" y="136" width="52" height="26" rx="4" />
    </>
  ),
  dashboards: (
    <>
      <rect className="m-card" x="44" y="34" width="156" height="134" rx="9" />
      <rect className="m-ink" x="60" y="50" width="52" height="6" rx="3" />
      <rect className="m-soft" x="60" y="61" width="34" height="4" rx="2" />
      <path className="m-rule" d="M60 150h124" />
      <rect className="m-soft" x="64" y="114" width="12" height="36" rx="3" />
      <rect className="m-soft" x="84" y="96" width="12" height="54" rx="3" />
      <rect className="m-soft" x="104" y="122" width="12" height="28" rx="3" />
      <rect className="m-accent" x="124" y="84" width="12" height="66" rx="3" />
      <rect className="m-soft" x="144" y="104" width="12" height="46" rx="3" />
      <rect className="m-soft" x="164" y="92" width="12" height="58" rx="3" />
      <rect className="m-card" x="186" y="52" width="92" height="58" rx="9" />
      <rect className="m-soft" x="198" y="63" width="30" height="4" rx="2" />
      <path className="m-stroke-accent" d="M198 97l13-8 11 4 13-15 12 6 15-14" />
      <rect className="m-card" x="186" y="118" width="92" height="50" rx="9" />
      <circle className="m-stroke-soft" cx="208" cy="143" r="11" />
      <path className="m-stroke-accent" d="M208 132a11 11 0 0 1 10.5 14.2" />
      <rect className="m-ink" x="228" y="137" width="34" height="5" rx="2.5" />
      <rect className="m-soft" x="228" y="146" width="22" height="4" rx="2" />
    </>
  ),
  components: (
    <>
      <rect className="m-ink" x="44" y="40" width="96" height="30" rx="15" />
      <rect className="m-paper" x="68" y="52.5" width="48" height="5" rx="2.5" />
      <rect className="m-card" x="150" y="40" width="96" height="30" rx="15" />
      <rect className="m-soft" x="174" y="52.5" width="48" height="5" rx="2.5" />
      <rect className="m-accent" x="44" y="88" width="54" height="28" rx="14" />
      <circle className="m-paper" cx="84" cy="102" r="10" />
      <rect className="m-card" x="112" y="90" width="24" height="24" rx="6" />
      <path className="m-stroke-accent" d="M118 102.5l4.5 4.5 8-9" />
      <rect className="m-card" x="150" y="88" width="126" height="28" rx="8" />
      <path className="m-stroke-accent" d="M163 96v12" />
      <rect className="m-soft" x="170" y="99.5" width="54" height="5" rx="2.5" />
      <path className="m-track" d="M44 146h232" />
      <path className="m-track-accent" d="M44 146h118" />
      <circle className="m-card" cx="162" cy="146" r="9" />
    </>
  ),
  experiments: (
    <>
      <circle className="m-dash" cx="160" cy="100" r="74" />
      <path className="m-dash" d="M40 100h240M160 18v164" />
      <circle className="m-card" cx="136" cy="96" r="46" />
      <rect className="m-tint m-multiply" x="150" y="76" width="74" height="74" rx="5" />
      <path className="m-stroke-ink" d="M88 154a72 72 0 0 1 128-46" />
      <circle className="m-accent" cx="214" cy="66" r="13" />
      <circle className="m-ink" cx="88" cy="154" r="3.5" />
    </>
  ),
  flows: (
    <>
      <path className="m-stroke-soft" d="M98 104c18 0 16-22 34-22M190 82c20 0 16 38 34 38" />
      <circle className="m-accent" cx="115" cy="93" r="4" />
      <circle className="m-ink" cx="207" cy="101" r="3.5" />
      <rect className="m-card" x="40" y="60" width="58" height="88" rx="8" />
      <rect className="m-ink" x="50" y="72" width="32" height="5" rx="2.5" />
      <rect className="m-tint" x="50" y="84" width="38" height="26" rx="4" />
      <rect className="m-soft" x="50" y="118" width="30" height="4" rx="2" />
      <rect className="m-soft" x="50" y="127" width="22" height="4" rx="2" />
      <rect className="m-card" x="132" y="38" width="58" height="88" rx="8" />
      <rect className="m-ink" x="142" y="50" width="26" height="5" rx="2.5" />
      <rect className="m-soft" x="142" y="62" width="38" height="12" rx="3" />
      <rect className="m-soft" x="142" y="79" width="38" height="12" rx="3" />
      <rect className="m-accent" x="142" y="102" width="38" height="12" rx="6" />
      <rect className="m-card" x="224" y="76" width="58" height="88" rx="8" />
      <circle className="m-tint" cx="253" cy="106" r="14" />
      <path className="m-stroke-accent" d="M246.5 106l4.5 4.5 8-9" />
      <rect className="m-ink" x="238" y="130" width="30" height="5" rx="2.5" />
      <rect className="m-soft" x="242" y="140" width="22" height="4" rx="2" />
    </>
  ),
  motion: (
    <>
      <path className="m-grid" d="M48 40v120M88 40v120M128 40v120M168 40v120M208 40v120M248 40v120M48 40h224M48 80h224M48 120h224M48 160h224" />
      <path className="m-stroke-soft" d="M48 160h92M272 40H150" />
      <path className="m-stroke-ink" d="M48 160c92 0 102-120 224-120" />
      <rect className="m-card" x="136" y="156" width="8" height="8" rx="2" />
      <rect className="m-card" x="146" y="36" width="8" height="8" rx="2" />
      <circle className="m-trail" cx="84.5" cy="152.7" r="3" style={{ opacity: 0.18 }} />
      <circle className="m-trail" cx="113.9" cy="134.1" r="3.8" style={{ opacity: 0.28 }} />
      <circle className="m-trail" cx="140.1" cy="109" r="4.6" style={{ opacity: 0.4 }} />
      <circle className="m-trail" cx="166.9" cy="82.2" r="5.4" style={{ opacity: 0.52 }} />
      <circle className="m-trail" cx="198.5" cy="58.8" r="6.2" style={{ opacity: 0.66 }} />
      <circle className="m-trail" cx="238.6" cy="43.4" r="7" style={{ opacity: 0.8 }} />
      <circle className="m-accent" cx="272" cy="40" r="9" />
      <circle className="m-ink" cx="48" cy="160" r="3.5" />
    </>
  ),
}

export default function CategoryCover({ motif = 'websites', tint = 'pearl', image, className = '' }) {
  return (
    <div className={`cover cover--${tint} ${className}`}>
      {image ? (
        <img className="cover__img" src={image} alt="" loading="lazy" />
      ) : (
        <svg className="cover__art" viewBox="30 20 260 160" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
          {MOTIFS[motif] ?? MOTIFS.websites}
        </svg>
      )}
    </div>
  )
}
