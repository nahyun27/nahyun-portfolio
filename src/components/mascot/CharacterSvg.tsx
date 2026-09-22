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

      {/* back hair, sits behind everything else above the shoulders */}
      <path
        d="M120 44 C160 44 182 76 182 116 C182 150 176 176 168 198 C160 184 160 160 158 140 C150 158 148 178 150 200 L128 206 C126 176 126 150 120 128 C114 150 114 176 112 206 L90 200 C92 178 90 158 82 140 C80 160 80 184 72 198 C64 176 58 150 58 116 C58 76 80 44 120 44 Z"
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

      {/* eyebrows */}
      <path d="M92 100 C98 94 110 94 116 99" fill="none" stroke={HAIR} strokeWidth="4" strokeLinecap="round" />
      <path d="M124 99 C130 94 142 94 148 100" fill="none" stroke={HAIR} strokeWidth="4" strokeLinecap="round" />

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

      {/* front hair, drawn last so it overlaps the top of the face */}
      <g id="bangs">
        <path d="M58 116 C58 84 72 58 96 50 C86 66 82 86 84 108 C74 104 64 108 58 116 Z" fill={HAIR} />
        <path d="M182 116 C182 84 168 58 144 50 C154 66 158 86 156 108 C166 104 176 108 182 116 Z" fill={HAIR} />
        <path d="M120 46 C104 46 92 58 88 76 C96 66 108 60 120 60 C132 60 144 66 152 76 C148 58 136 46 120 46 Z" fill={HAIR} />
        <path d="M96 58 C90 70 88 84 90 98 C96 88 100 78 100 66 Z" fill={HAIR_SHADOW} />
        <path d="M144 58 C150 70 152 84 150 98 C144 88 140 78 140 66 Z" fill={HAIR_SHADOW} />
        <path d="M112 54 C108 66 108 78 112 90 C116 78 116 66 114 54 Z" fill={HAIR} />
        <path d="M128 54 C132 66 132 78 128 90 C124 78 124 66 126 54 Z" fill={HAIR} />
      </g>
    </svg>
  );
}
