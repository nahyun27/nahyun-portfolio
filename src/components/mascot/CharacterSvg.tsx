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
      <circle cx={cx} cy="126" r="9.4" fill="#332018" />
      <circle cx={cx} cy="126" r="4.8" fill="#1A0F0A" />
      <circle cx={hl1[0]} cy={hl1[1]} r="2.6" fill="#FFFFFF" />
      <circle cx={hl2[0]} cy={hl2[1]} r="1.3" fill="#FFFFFF" opacity="0.85" />
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
          so the neck's front skin sits on top of it instead of being hidden underneath.
          Pivots from the crown so it can sway with the cursor (set by an ancestor via
          --hair-sway); being the longest piece it swings the most. */}
      <g
        id="hairBack"
        style={{
          transformOrigin: "120px 45px",
          transform: "rotate(var(--hair-sway, 0deg))",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <path
          d="M120 38 C160 38 184 62 184 98 C185 124 180 152 174 182 L66 182 C60 152 55 124 56 98 C56 62 80 38 120 38 Z"
          fill={HAIR}
        />
      </g>

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
      <ellipse cx="86" cy="142" rx="10" ry="6.5" fill={BLUSH} opacity="0.4" />
      <ellipse cx="154" cy="142" rx="10" ry="6.5" fill={BLUSH} opacity="0.4" />

      {/* eyebrows: closer to a flat line than an arch, and sitting closer to the eyes than the
          original (was too low right after that fix, nudged back up a little) */}
      <path d="M81 111 C88 107 96 107 103 111" fill="none" stroke={HAIR} strokeWidth="4" strokeLinecap="round" />
      <path d="M137 111 C144 107 152 107 159 111" fill="none" stroke={HAIR} strokeWidth="4" strokeLinecap="round" />

      {/* eyes: round sockets with a lidded crease along the top - the low eyebrows already read
          as a hint of eyelid, this line is the actual lid, sitting right at the top of the iris
          so it reads as a sleepy/soft lidded eye instead of a fully round open one. A little
          closer together and a little bigger than before, moved down with the rest of the face
          (nose/mouth included) so they sit centred on the now taller lower face. */}
      <g id="eyeL" className="eye" style={{ transformOrigin: "94px 126px" }}>
        <ellipse cx="94" cy="126" rx="13" ry="13.5" fill="#FFFFFF" />
        <Pupil id="pupilL" cx={94} hl1={[90.5, 122]} hl2={[97, 129.5]} />
        {/* the lid itself: skin, not white, filling the gap between the brow and the crease
            line below so it reads as a fold of skin covering the top of the eye, not a line
            floating over bare sclera */}
        <path d="M82 119 C82 114 87 111 94 111 C101 111 106 114 106 119 Q94 114.5 82 119 Z" fill={SKIN} />
        <path d="M82 119 Q94 113.5 106 119" fill="none" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" opacity="0.85" />
      </g>
      <g id="eyeR" className="eye" style={{ transformOrigin: "146px 126px" }}>
        <ellipse cx="146" cy="126" rx="13" ry="13.5" fill="#FFFFFF" />
        <Pupil id="pupilR" cx={146} hl1={[142.5, 122]} hl2={[149, 129.5]} />
        <path d="M134 119 C134 114 139 111 146 111 C153 111 158 114 158 119 Q146 114.5 134 119 Z" fill={SKIN} />
        <path d="M134 119 Q146 113.5 158 119" fill="none" stroke={HAIR} strokeWidth="2.6" strokeLinecap="round" opacity="0.85" />
      </g>

      {/* nose: barely there, just a hint */}
      <path d="M120 128 C121 133 122 136 120 138" fill="none" stroke={SKIN_SHADOW} strokeWidth="2" strokeLinecap="round" opacity="0.7" />

      {/* mouths: three variants stacked in place, JS toggles opacity to switch between them */}
      <path id="mouthNeutral" d="M110 150 Q120 154 130 150" fill="none" stroke="#B8654F" strokeWidth="3" strokeLinecap="round" style={{ opacity: 1, transition: "opacity 0.15s ease" }} />
      <path id="mouthSmile" d="M105 147 Q120 165 135 147" fill="none" stroke="#B8654F" strokeWidth="4.5" strokeLinecap="round" style={{ opacity: 0, transition: "opacity 0.15s ease" }} />
      <ellipse id="mouthOpen" cx="120" cy="152" rx="7" ry="6" fill="#7A2E22" style={{ opacity: 0, transition: "opacity 0.15s ease" }} />

      {/* front hair: a blunt centre piece plus two side pieces that sweep diagonally out and
          down (their bottom edge slants, longer on the outer/temple side, shorter on the inner
          side toward the centre part) - like a real fringe with the outer sections swept back,
          not a straight-across trim on all three. Pieces run long and close together (barely any
          gap at the top, only a little more at the bottom) so the forehead barely shows between
          them. Shares the SAME sway variable and origin as the back hair (not a scaled-down
          version of it): two layers rotating at different rates is what caused the side pieces
          to poke past the back hair's edge whenever the cursor wasn't dead centre, since they
          only ever lined up at rotation 0. Moving together keeps them nested at every angle. */}
      <g
        id="bangs"
        style={{
          transformOrigin: "120px 45px",
          transform: "rotate(var(--hair-sway, 0deg))",
          transition: "transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      >
        <path d="M66 128 L64 60 C64 50 70 48 78 48 C87 48 99 50 99 60 L100 110 Z" fill={HAIR} />
        {/* the centre piece's bottom corners sit further out than the side pieces' inner edges
            (97/143 vs the side pieces' 100/140) on purpose: they're the same fill colour, so
            overlap is invisible, but a gap there showed forehead in a widening wedge down toward
            the eyebrows, reading as a deep centre part and a wide forehead. Overlapping instead,
            more so near the bottom, closes it. */}
        <path d="M97 112 L99 52 C99 42 107 40 120 40 C133 40 141 42 141 52 L143 112 Z" fill={HAIR} />
        <path d="M174 128 L176 60 C176 50 170 48 162 48 C153 48 141 50 141 60 L140 110 Z" fill={HAIR} />
        {/* aegyo-meori: two thin wisps at the temple, pulled in closer to the face than the
            main fringe's outer edge instead of sitting out past the ear */}
        <path d="M66 70 C66 65 72 63 75 67 L72 146 C70 150 66 148 66 143 Z" fill={HAIR} />
        <path d="M174 70 C174 65 168 63 165 67 L168 146 C170 150 174 148 174 143 Z" fill={HAIR} />
      </g>
    </svg>
  );
}
