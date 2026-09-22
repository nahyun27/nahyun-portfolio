/**
 * A simple bob-haired bust character, drawn as flat SVG shapes so JavaScript can grab each part
 * by id and move it independently (eyes, eyelids, mouth) instead of swapping a static image.
 * viewBox is 0 0 240 260, character centered around x=120. The waving arm is NOT included here:
 * it needs to swing past this circle's clip, so Mascot.tsx draws it as a separate unclipped layer.
 *
 * `--eye-x` / `--eye-y` custom properties (set by an ancestor) drift the pupils toward the cursor;
 * `#mouthNeutral` / `#mouthSmile` / `#mouthOpen` and `.eye` are toggled/squished directly from JS.
 */

const HAIR = "#2B211C";
const HAIR_SHADOW = "#221A16";
const SKIN = "#FCDFC4";
const SKIN_SHADOW = "#F3CBAA";
const HOODIE = "#262A33";
const HOODIE_LIGHT = "#343A46";
const SHIRT = "#EFEAE1";
const BLUSH = "#F2A99A";
const MINT = "#00C9A7";

function Pupil({ id, cx, hl1, hl2 }: { id: string; cx: number; hl1: [number, number]; hl2: [number, number] }) {
  return (
    <g id={id} style={{ transform: "translate(var(--eye-x, 0px), var(--eye-y, 0px))" }}>
      <circle cx={cx} cy="118" r="8.4" fill="#332018" />
      <circle cx={cx} cy="118" r="4.2" fill="#1A0F0A" />
      <circle cx={hl1[0]} cy={hl1[1]} r="2.4" fill="#FFFFFF" />
      <circle cx={hl2[0]} cy={hl2[1]} r="1.2" fill="#FFFFFF" opacity="0.85" />
    </g>
  );
}

export default function CharacterSvg() {
  return (
    <svg viewBox="0 0 240 260" width="100%" height="100%" aria-hidden focusable="false">
      {/* body / hoodie, drawn first so hair and head sit on top of it */}
      <g id="body">
        <path d="M46 260 C46 214 74 196 120 196 C166 196 194 214 194 260 Z" fill={HOODIE} />
        {/* collar */}
        <path d="M96 200 C104 214 136 214 144 200 L138 194 C130 202 110 202 102 194 Z" fill={SHIRT} />
        {/* zipper / drawstrings, a small nod to the brand colour */}
        <circle cx="112" cy="232" r="3.4" fill={MINT} />
        <circle cx="128" cy="238" r="3.4" fill={MINT} />
        <path d="M112 224 L112 232 M128 228 L128 238" stroke={HOODIE_LIGHT} strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* neck, behind the face */}
      <path d="M104 168 L136 168 L136 202 C120 210 120 210 104 202 Z" fill={SKIN} />
      <path d="M104 190 C120 198 120 198 136 190 L136 202 C120 210 120 210 104 202 Z" fill={SKIN_SHADOW} opacity="0.55" />

      {/* back hair: one blunt bob silhouette, rounded crown, straight sides, one flat hem
          (the flat "L 62 208" bottom edge is what makes it read as a blunt one-length cut) */}
      <path
        d="M120 40 C158 40 181 66 183 104 C184 132 181 168 178 208 L62 208 C59 168 56 132 57 104 C59 66 82 40 120 40 Z"
        fill={HAIR}
      />

      {/* ears, peeking out from under the side hair */}
      <ellipse cx="60" cy="126" rx="7" ry="12" fill={SKIN} />
      <ellipse cx="180" cy="126" rx="7" ry="12" fill={SKIN} />

      {/* face */}
      <path
        d="M120 60 C150 60 166 84 166 116 C166 150 148 180 120 180 C92 180 74 150 74 116 C74 84 90 60 120 60 Z"
        fill={SKIN}
      />
      {/* soft cheek/jaw shading */}
      <path d="M74 116 C74 140 84 162 100 174 C90 156 86 136 88 116 Z" fill={SKIN_SHADOW} opacity="0.45" />
      <path d="M166 116 C166 140 156 162 140 174 C150 156 154 136 152 116 Z" fill={SKIN_SHADOW} opacity="0.45" />

      {/* blush */}
      <ellipse cx="90" cy="140" rx="10" ry="6.5" fill={BLUSH} opacity="0.4" />
      <ellipse cx="150" cy="140" rx="10" ry="6.5" fill={BLUSH} opacity="0.4" />

      {/* eyebrows: inner tips sit above each eye's inner corner, not crowded together */}
      <path d="M87 100 C92 91 103 90 109 97" fill="none" stroke={HAIR} strokeWidth="4" strokeLinecap="round" />
      <path d="M131 97 C137 90 148 91 153 100" fill="none" stroke={HAIR} strokeWidth="4" strokeLinecap="round" />

      {/* eyes: the socket (.eye) is what blinking squashes; the pupil cluster inside drifts with the cursor */}
      <g id="eyeL" className="eye" style={{ transformOrigin: "98px 118px" }}>
        <ellipse cx="98" cy="117" rx="12" ry="13" fill="#FFFFFF" />
        <Pupil id="pupilL" cx={98} hl1={[95, 114.5]} hl2={[100.5, 121]} />
      </g>
      <g id="eyeR" className="eye" style={{ transformOrigin: "142px 118px" }}>
        <ellipse cx="142" cy="117" rx="12" ry="13" fill="#FFFFFF" />
        <Pupil id="pupilR" cx={142} hl1={[139, 114.5]} hl2={[144.5, 121]} />
      </g>

      {/* nose: barely there, just a hint */}
      <path d="M120 126 C121 132 122 135 120 137" fill="none" stroke={SKIN_SHADOW} strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* mouths: three variants stacked in place, JS toggles opacity to switch between them */}
      <path id="mouthNeutral" d="M110 150 Q120 154 130 150" fill="none" stroke="#B8654F" strokeWidth="3" strokeLinecap="round" style={{ opacity: 1, transition: "opacity 0.15s ease" }} />
      <path id="mouthSmile" d="M105 147 Q120 165 135 147" fill="none" stroke="#B8654F" strokeWidth="4.5" strokeLinecap="round" style={{ opacity: 0, transition: "opacity 0.15s ease" }} />
      <ellipse id="mouthOpen" cx="120" cy="152" rx="7" ry="6" fill="#7A2E22" style={{ opacity: 0, transition: "opacity 0.15s ease" }} />

      {/* front hair: one wide, square-edged blunt fringe, not separate wispy strands */}
      <g id="bangs">
        <path d="M78 60 C78 46 96 39 120 39 C144 39 162 46 162 60 L162 96 L78 96 Z" fill={HAIR} />
        {/* faint centre part, just enough texture to read as hair, not a break in the block */}
        <path d="M112 42 L110 94 M130 42 L132 94" stroke={HAIR_SHADOW} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  );
}
