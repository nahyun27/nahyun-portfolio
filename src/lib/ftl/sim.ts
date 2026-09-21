/**
 * Small flash translation layer model for the SSD WAF project scene.
 *
 * 32 blocks x 16 pages with 25% over provisioning. Baseline mixes every write into one pool. The
 * hot/cold variant keeps two pools (like the FEMU work) and classifies each LPN by how often it was
 * written recently, using a counter that decays. Both use greedy garbage collection.
 */
export type Mode = "baseline" | "hotcold";

export const BLOCKS = 32;
export const PPB = 16;
const TOTAL = BLOCKS * PPB;
const LOGICAL = Math.floor(TOTAL * 0.75);
export const HOT_SET = Math.floor(LOGICAL * 0.1);
const GC_FREE_THRESHOLD = 1;
const DECAY_EVERY = 256;

export function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** identical write stream for both simulators: 90% of writes hit 10% of the addresses */
export function makeWorkload(seed: number) {
  const r = rng(seed);
  return (burst: boolean) => {
    const hotShare = burst ? 0.99 : 0.9;
    if (r() < hotShare) return Math.floor(r() * HOT_SET);
    return HOT_SET + Math.floor(r() * (LOGICAL - HOT_SET));
  };
}

interface Pointer {
  block: number;
  page: number;
}

export class FtlSim {
  readonly mode: Mode;
  state = new Uint8Array(TOTAL); // 0 free, 1 valid, 2 invalid
  hot = new Uint8Array(TOTAL); // page was written as hot
  lpnOf = new Int16Array(TOTAL).fill(-1);
  map = new Int16Array(LOGICAL).fill(-1);
  validCount = new Uint8Array(BLOCKS);
  blockState = new Uint8Array(BLOCKS); // 0 free, 1 open, 2 full
  flash = new Uint8Array(BLOCKS); // render hint: frames left to flash after an erase
  free: number[] = [];
  ptr: (Pointer | null)[] = [null, null]; // [hot pool, cold pool]; baseline only uses [0]
  count = new Uint8Array(LOGICAL);
  hostWrites = 0;
  nandWrites = 0;
  gcCopies = 0;
  erases = 0;
  private inGc = false;

  constructor(mode: Mode) {
    this.mode = mode;
    for (let b = 0; b < BLOCKS; b++) this.free.push(b);
    // fill the drive once so it starts in steady state, then zero the counters
    for (let l = 0; l < LOGICAL; l++) this.write(l);
    this.hostWrites = 0;
    this.nandWrites = 0;
    this.gcCopies = 0;
    this.erases = 0;
    this.count.fill(0);
  }

  get waf() {
    return this.hostWrites === 0 ? 1 : this.nandWrites / this.hostWrites;
  }
  get freeBlocks() {
    return this.free.length;
  }

  private isHot(lpn: number): boolean {
    if (this.mode === "baseline") return true;
    this.count[lpn] = Math.min(255, this.count[lpn] + 1);
    return this.count[lpn] >= 2;
  }

  write(lpn: number) {
    this.hostWrites++;
    if (this.mode === "hotcold" && this.hostWrites % DECAY_EVERY === 0) {
      for (let i = 0; i < LOGICAL; i++) this.count[i] >>= 1;
    }
    const hot = this.isHot(lpn);
    this.invalidate(lpn);
    this.program(lpn, hot);
  }

  private invalidate(lpn: number) {
    const old = this.map[lpn];
    if (old >= 0) {
      this.state[old] = 2;
      this.validCount[(old / PPB) | 0]--;
      this.map[lpn] = -1;
    }
  }

  private program(lpn: number, hot: boolean) {
    const pool = this.mode === "baseline" ? 0 : hot ? 0 : 1;
    let p = this.ptr[pool];
    if (!p || p.page >= PPB) p = this.open(pool);
    const ppn = p.block * PPB + p.page++;
    this.state[ppn] = 1;
    this.lpnOf[ppn] = lpn;
    this.hot[ppn] = hot ? 1 : 0;
    this.map[lpn] = ppn;
    this.validCount[p.block]++;
    this.nandWrites++;
    if (p.page >= PPB) {
      this.blockState[p.block] = 2;
      this.ptr[pool] = null;
    }
  }

  private open(pool: number): Pointer {
    if (!this.inGc && this.free.length <= GC_FREE_THRESHOLD) {
      this.collect();
      // relocation may already have opened a block in this pool, reuse it instead of leaking it
      const reused = this.ptr[pool];
      if (reused && reused.page < PPB) return reused;
    }
    const b = this.free.shift() as number;
    this.blockState[b] = 1;
    const p = { block: b, page: 0 };
    this.ptr[pool] = p;
    return p;
  }

  /** greedy GC: erase the full block with the most invalid pages, relocating what is still valid */
  private collect() {
    this.inGc = true;
    for (let guard = 0; guard < 8 && this.free.length <= GC_FREE_THRESHOLD; guard++) {
      let victim = -1;
      let best = -1;
      for (let b = 0; b < BLOCKS; b++) {
        if (this.blockState[b] !== 2) continue;
        const invalid = PPB - this.validCount[b];
        if (invalid > best) {
          best = invalid;
          victim = b;
        }
      }
      if (victim < 0) break;
      for (let i = 0; i < PPB; i++) {
        const ppn = victim * PPB + i;
        if (this.state[ppn] !== 1) continue;
        const lpn = this.lpnOf[ppn];
        const wasHot = this.hot[ppn] === 1;
        this.state[ppn] = 2;
        this.validCount[victim]--;
        this.map[lpn] = -1;
        this.program(lpn, wasHot);
        this.gcCopies++;
      }
      for (let i = 0; i < PPB; i++) {
        const ppn = victim * PPB + i;
        this.state[ppn] = 0;
        this.lpnOf[ppn] = -1;
        this.hot[ppn] = 0;
      }
      this.validCount[victim] = 0;
      this.blockState[victim] = 0;
      this.flash[victim] = 24;
      this.free.push(victim);
      this.erases++;
    }
    this.inGc = false;
  }
}
