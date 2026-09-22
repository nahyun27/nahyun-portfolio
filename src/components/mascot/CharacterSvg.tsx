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
        <path d="M46 260 C46 198 74 180 120 180 C166 180 194 198 194 260 Z" fill={HOODIE} />
        {/* collar */}
        <path d="M96 182 C104 196 136 196 144 182 L138 176 C130 184 110 184 102 176 Z" fill={SHIRT} />
        {/* zipper / drawstrings, a small nod to the brand colour */}
        <circle cx="112" cy="232" r="3.4" fill={MINT} />
        <circle cx="128" cy="238" r="3.4" fill={MINT} />
        <path d="M112 224 L112 232 M128 228 L128 238" stroke={HOODIE_LIGHT} strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* back hair: one blunt bob silhouette, rounded crown, straight sides, one flat hem
          (the flat "L 62 182" bottom edge is what makes it read as a blunt one-length cut).
          Hem sits just past the chin, short rather than shoulder length. Drawn before the neck
          so the neck's front skin sits on top of it instead of being hidden underneath. */}
      <path
        d="M120 40 C158 40 181 66 183 104 C184 122 181 148 178 182 L62 182 C59 148 56 122 57 104 C59 66 82 40 120 40 Z"
        fill={HAIR}
      />

      {/* neck: short, just enough to connect the chin to the collar. On top of the hair so it
          reads as in front of it, behind the face */}
      <path d="M104 168 L136 168 L136 184 C120 190 120 190 104 184 Z" fill={SKIN} />
      <path d="M104 178 C120 183 120 183 136 178 L136 184 C120 190 120 190 104 184 Z" fill={SKIN_SHADOW} opacity="0.55" />

      {/* ears, peeking out from under the side hair */}
      <ellipse cx="60" cy="126" rx="7" ry="12" fill={SKIN} />
      <ellipse cx="180" cy="126" rx="7" ry="12" fill={SKIN} />

      {/* face: wide and short, the jaw stays broad almost to the very bottom instead of
          tapering into a long oval, then rounds off quickly right at the chin */}
      <path
        d="M120 58 C152 58 170 82 170 112 C170 140 158 162 120 165 C82 162 70 140 70 112 C70 82 88 58 120 58 Z"
        fill={SKIN}
      />
      {/* soft cheek/jaw shading */}
      <path d="M70 112 C70 134 80 152 98 161 C88 146 84 128 86 112 Z" fill={SKIN_SHADOW} opacity="0.45" />
      <path d="M170 112 C170 134 160 152 142 161 C152 146 156 128 154 112 Z" fill={SKIN_SHADOW} opacity="0.45" />

      {/* blush */}
      <ellipse cx="90" cy="134" rx="10" ry="6.5" fill={BLUSH} opacity="0.4" />
      <ellipse cx="150" cy="134" rx="10" ry="6.5" fill={BLUSH} opacity="0.4" />

      {/* eyebrows: inner tips sit above each eye's inner corner, not crowded together */}
      <path d="M87 100 C92 91 103 90 109 97" fill="none" stroke={HAIR} strokeWidth="4" strokeLinecap="round" />
      <path d="M131 97 C137 90 148 91 153 100" fill="none" stroke={HAIR} strokeWidth="4" strokeLinecap="round" />

      {/* eyes: the socket (.eye) is what blinking squashes. Pupils (inside Pupil) drift with the
          cursor; the eyelid cap and lash flick stay fixed over the top so the eye reads as
          lidded/almond shaped instead of a bare round dot. */}
      <g id="eyeL" className="eye" style={{ transformOrigin: "98px 118px" }}>
        <ellipse cx="98" cy="118" rx="11.5" ry="12" fill="#FFFFFF" />
        <Pupil id="pupilL" cx={98} hl1={[95, 114.5]} hl2={[100.5, 121]} />
        <path d="M87 113 C89 103 95 99 102 100 C106.5 101 109.5 105 110 110 C104 105.5 94 105.5 87 113 Z" fill={HAIR} />
        <path d="M108.5 103.5 L114.5 97.5" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" />
      </g>
      <g id="eyeR" className="eye" style={{ transformOrigin: "142px 118px" }}>
        <ellipse cx="142" cy="118" rx="11.5" ry="12" fill="#FFFFFF" />
        <Pupil id="pupilR" cx={142} hl1={[139, 114.5]} hl2={[144.5, 121]} />
        <path d="M153 113 C151 103 145 99 138 100 C133.5 101 130.5 105 130 110 C136 105.5 146 105.5 153 113 Z" fill={HAIR} />
        <path d="M131.5 103.5 L125.5 97.5" stroke={HAIR} strokeWidth="2.2" strokeLinecap="round" />
      </g>

      {/* nose: barely there, just a hint */}
      <path d="M120 120 C121 125 122 128 120 130" fill="none" stroke={SKIN_SHADOW} strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* mouths: three variants stacked in place, JS toggles opacity to switch between them */}
      <path id="mouthNeutral" d="M110 142 Q120 146 130 142" fill="none" stroke="#B8654F" strokeWidth="3" strokeLinecap="round" style={{ opacity: 1, transition: "opacity 0.15s ease" }} />
      <path id="mouthSmile" d="M105 139 Q120 157 135 139" fill="none" stroke="#B8654F" strokeWidth="4.5" strokeLinecap="round" style={{ opacity: 0, transition: "opacity 0.15s ease" }} />
      <ellipse id="mouthOpen" cx="120" cy="144" rx="7" ry="6" fill="#7A2E22" style={{ opacity: 0, transition: "opacity 0.15s ease" }} />

      {/* front hair: one wide, square-edged blunt fringe, not separate wispy strands.
          Comes down low, close to the brow line, instead of stopping high on the forehead. */}
      <g id="bangs">
        <path d="M78 60 C78 46 96 39 120 39 C144 39 162 46 162 60 L162 100 L78 100 Z" fill={HAIR} />
        {/* faint centre part, just enough texture to read as hair, not a break in the block */}
        <path d="M112 42 L110 98 M130 42 L132 98" stroke={HAIR_SHADOW} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  );
}
