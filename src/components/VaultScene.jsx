import ArtifactFace from './ArtifactFace'

function ReservePlane({ label }) {
  return (
    <div className="piece-frame reserve-plane">
      <span className="rule-wood" />
      <b>Reserved</b>
      <small>{label} · awaiting acquisition</small>
    </div>
  )
}

/**
 * The entrance hall — a CSS-3D architectural installation.
 * Layers (back → front): far recess, display wall, guide lines,
 * framed artifacts at separate depths, curved glass partition,
 * timber plinths, floor plane, directional light.
 */
export default function VaultScene({ pieces = [] }) {
  const [lead, second, deep] = pieces

  return (
    <div className="hall">
      <div className="hall__stage">
        <div className="hall__layer hall-far" />
        <div className="hall__layer hall-wall" />
        <div className="hall__layer hall-lines" aria-hidden="true"><i /><i /><i /><i /></div>

        {/* deep artifact, secured inside the wall niche */}
        {deep ? (
          <div className="hall-piece nsv-piece-deep" style={{ left: '38.5%', top: '11%', width: '11%', height: '25%', transform: 'translateZ(-170px) rotateY(-6deg)' }}>
            <div className="piece-frame" style={{ height: '100%', boxShadow: '0 18px 40px rgba(0,0,0,.5)' }}>
              <ArtifactFace project={deep} compact />
            </div>
            <div className="hall-piece__caption" style={{ transform: 'translateY(8px)' }}>
              <b>{deep.title}</b><span>NEST 03</span>
            </div>
          </div>
        ) : (
          <div className="hall-piece nsv-piece-deep" style={{ left: '38.5%', top: '11%', width: '11%', height: '25%', transform: 'translateZ(-170px) rotateY(-6deg)' }}>
            <ReservePlane label="NEST 03" />
          </div>
        )}

        {/* secondary artifact, proud of the wall */}
        {second ? (
          <div className="hall-piece nsv-piece-second" style={{ left: '43%', top: '41%', width: '13.5%', height: '34%', transform: 'translateZ(-20px) rotateY(-7deg)' }}>
            <div className="piece-frame" style={{ height: '100%' }}>
              <ArtifactFace project={second} compact />
            </div>
            <div className="hall-piece__caption" style={{ transform: 'translateY(8px)' }}>
              <b>{second.title}</b><span>PLAN 02</span>
            </div>
          </div>
        ) : (
          <div className="hall-piece nsv-piece-second" style={{ left: '43%', top: '41%', width: '13.5%', height: '34%', transform: 'translateZ(-20px) rotateY(-7deg)' }}>
            <ReservePlane label="PLAN 02" />
          </div>
        )}

        {/* translucent partition, curved + liquid seam */}
        <div className="hall__layer hall-glass" />

        {/* the lead exhibition plane */}
        <div className="hall-piece nsv-piece-lead" style={{ left: '57%', top: '12%', width: '25%', height: '50%', transform: 'translateZ(60px) rotateY(-5deg)' }}>
          <div className="piece-frame" style={{ height: '100%' }}>
            <ArtifactFace project={lead} />
          </div>
          {lead && (
            <div className="hall-piece__caption" style={{ transform: 'translateY(10px)' }}>
              <b>{lead.title}</b><span>{lead.year ?? ''}</span>
            </div>
          )}
        </div>

        {/* structural timber plinths */}
        <div className="hall__layer hall-plinth" />
        <div className="hall__layer hall-plinth hall-plinth--b" />

        {/* floor with cool reflection */}
        <div className="hall__layer hall-floor" />

        {/* near foreground piece — cropped by the viewport edge */}
        {lead && (
          <div className="hall-piece nsv-piece-crop" style={{ left: '88%', top: '52%', width: '13%', height: '30%', transform: 'translateZ(150px) rotateY(-14deg)' }}>
            <div className="piece-frame" style={{ height: '100%' }}>
              <ArtifactFace project={lead} compact />
            </div>
          </div>
        )}

        {/* directional light */}
        <div className="hall__layer hall-light" />
      </div>

      {/* displacement filter for the liquid seam */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
        <filter id="nsv-liquid">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.05" numOctaves="2" seed="7" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="7" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>

      <div className="hall-caption">
        <b>Open storage</b>
        <span className="sig sig--dim">hall 01 · the collection continues beyond this frame</span>
      </div>
    </div>
  )
}
