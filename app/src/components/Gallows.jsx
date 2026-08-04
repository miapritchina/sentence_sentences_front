// Hand-drawn-style SVG gallows that appears stroke by stroke as mistakes accrue.
// Stage order: base, post, beam, brace, rope, head, body, left arm, right arm, legs.
const STAGES = [
  <line key="base" x1="15" y1="230" x2="145" y2="230" />,
  <line key="post" x1="45" y1="230" x2="45" y2="25" />,
  <line key="beam" x1="45" y1="25" x2="155" y2="25" />,
  <line key="brace" x1="45" y1="60" x2="80" y2="25" />,
  <line key="rope" x1="155" y1="25" x2="155" y2="55" />,
  <circle key="head" cx="155" cy="75" r="20" fill="none" />,
  <line key="body" x1="155" y1="95" x2="155" y2="150" />,
  <line key="arm-l" x1="155" y1="110" x2="130" y2="135" />,
  <line key="arm-r" x1="155" y1="110" x2="180" y2="135" />,
  <g key="legs">
    <line x1="155" y1="150" x2="135" y2="185" />
    <line x1="155" y1="150" x2="175" y2="185" />
  </g>,
];

export default function Gallows({ mistakes, won }) {
  return (
    <svg
      className={`gallows ${won ? 'gallows-won' : ''}`}
      viewBox="0 0 200 240"
      role="img"
      aria-label={`Gallows drawing, ${mistakes} of ${STAGES.length} strokes`}
    >
      <g
        className="gallows-ghost"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      >
        {STAGES.slice(mistakes)}
      </g>
      <g
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      >
        {STAGES.slice(0, mistakes)}
      </g>
      {won && (
        <g
          className="gallows-bird"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          transform={mistakes >= 3 ? 'translate(155 15)' : 'translate(100 215)'}
        >
          {/* a small bird perched on the beam — or on the ground if there is no gallows yet */}
          <circle cx="0" cy="0" r="7" />
          <circle cx="-3" cy="-2" r="1" fill="currentColor" stroke="none" />
          <path d="M7 0 q8 -2 10 3" />
          <line x1="-2" y1="7" x2="-2" y2="12" />
          <line x1="2" y1="7" x2="2" y2="12" />
        </g>
      )}
    </svg>
  );
}
