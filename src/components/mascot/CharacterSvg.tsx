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

      {/* ears: overlap the face edge slightly (face is drawn after, on top) so there is no gap */}
      <ellipse cx="66" cy="126" rx="7" ry="12" fill={SKIN} />
      <ellipse cx="174" cy="126" rx="7" ry="12" fill={SKIN} />

      {/* face: wide and short, the jaw stays broad almost to the very bottom instead of
          tapering into a long oval. Reaches down far enough to overlap the neck, no gap
          between them. */}
      <path
        d="M120 58 C152 58 170 82 170 112 C170 140 158 168 120 172 C82 168 70 140 70 112 C70 82 88 58 120 58 Z"
        fill={SKIN}
      />
      {/* soft cheek/jaw shading */}
      <path d="M70 112 C70 136 80 156 98 167 C88 150 84 130 86 112 Z" fill={SKIN_SHADOW} opacity="0.45" />
      <path d="M170 112 C170 136 160 156 142 167 C152 150 156 130 154 112 Z" fill={SKIN_SHADOW} opacity="0.45" />

      {/* blush */}
      <ellipse cx="86" cy="134" rx="10" ry="6.5" fill={BLUSH} opacity="0.4" />
      <ellipse cx="154" cy="134" rx="10" ry="6.5" fill={BLUSH} opacity="0.4" />

      {/* eyebrows: shifted out to stay above each eye's inner corner now that the eyes are wider set */}
      <path d="M80 100 C85 91 96 90 102 97" fill="none" stroke={HAIR} strokeWidth="4" strokeLinecap="round" />
      <path d="M138 97 C144 90 155 91 160 100" fill="none" stroke={HAIR} strokeWidth="4" strokeLinecap="round" />

      {/* eyes: plain round sockets again, no eyelid cap or lash (removed, didn't read well).
          Set further apart so they don't crowd the middle of the now-wider face. */}
      <g id="eyeL" className="eye" style={{ transformOrigin: "92px 118px" }}>
        <ellipse cx="92" cy="118" rx="11.5" ry="12" fill="#FFFFFF" />
        <Pupil id="pupilL" cx={92} hl1={[89, 114.5]} hl2={[94.5, 121]} />
      </g>
      <g id="eyeR" className="eye" style={{ transformOrigin: "148px 118px" }}>
        <ellipse cx="148" cy="118" rx="11.5" ry="12" fill="#FFFFFF" />
        <Pupil id="pupilR" cx={148} hl1={[145, 114.5]} hl2={[150.5, 121]} />
      </g>

      {/* nose: barely there, just a hint */}
      <path d="M120 120 C121 125 122 128 120 130" fill="none" stroke={SKIN_SHADOW} strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* mouths: three variants stacked in place, JS toggles opacity to switch between them */}
      <path id="mouthNeutral" d="M110 142 Q120 146 130 142" fill="none" stroke="#B8654F" strokeWidth="3" strokeLinecap="round" style={{ opacity: 1, transition: "opacity 0.15s ease" }} />
      <path id="mouthSmile" d="M105 139 Q120 157 135 139" fill="none" stroke="#B8654F" strokeWidth="4.5" strokeLinecap="round" style={{ opacity: 0, transition: "opacity 0.15s ease" }} />
      <ellipse id="mouthOpen" cx="120" cy="144" rx="7" ry="6" fill="#7A2E22" style={{ opacity: 0, transition: "opacity 0.15s ease" }} />

      {/* front hair: one wide, square-edged blunt fringe spanning the full width of the jaw
          below it (was narrower than the face), and low, close to the brow line. */}
      <g id="bangs">
        <path d="M70 62 C70 46 92 37 120 37 C148 37 170 46 170 62 L170 106 L70 106 Z" fill={HAIR} />
        {/* faint centre part, just enough texture to read as hair, not a break in the block */}
        <path d="M112 40 L110 104 M130 40 L132 104" stroke={HAIR_SHADOW} strokeWidth="1.6" strokeLinecap="round" opacity="0.5" />
      </g>
    </svg>
  );
}
