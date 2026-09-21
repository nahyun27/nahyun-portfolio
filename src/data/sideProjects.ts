import type { Project } from "@/data/projects";

const DATA: Omit<Project, "id">[] = [
  {
    icon: "activity",
    title: "AlgoTrace",
    summary:
      "An interactive visualization platform for understanding complex algorithms step by step. Control the playback, watch every state change in real time, and build intuition instead of memorizing.",
    media: [{ src: "/images/side/demo.jpg", video: "/images/side/demo.mp4", label: "AlgoTrace", caption: "Stepping through an algorithm with playback controls." }],
    highlights: [],
    tags: ["React", "TypeScript", "Vite", "Framer Motion"],
    links: [
      { label: "Live Demo", href: "https://algorithm-trace.vercel.app/", kind: "web" },
      { label: "GitHub", href: "https://github.com/nahyun27/algotrace", kind: "github" },
    ],
    theme: { bg: "#062B2B", fg: "#E6FFFB", accent: "#4ECDC4", accent2: "#7DD3FC" },
    stage: "media",
  },
  {
    icon: "moon",
    title: "Rise of Halfmoon",
    summary: "A strategic moon phase card game. Match phases, build lunar cycles, and outsmart your opponent.",
    media: [{ src: "/images/side/halfmoon.jpg", video: "/images/side/halfmoon.mp4", label: "Rise of Halfmoon", caption: "A round on the graph board." }],
    highlights: [],
    tags: ["React", "Game Logic", "Web"],
    links: [
      { label: "Play Now", href: "https://rise-of-halfmoon.vercel.app/", kind: "web" },
      { label: "GitHub", href: "https://github.com/nahyun27/rise-of-halfmoon", kind: "github" },
    ],
    theme: { bg: "#16140A", fg: "#FFF8DC", accent: "#F6C90E", accent2: "#FFE58A" },
    stage: "media",
  },
  {
    icon: "layers",
    title: "Stack Tower 3D",
    summary: "An addictive 3D stacking game. Click at the perfect moment to line up blocks and reach for the sky.",
    media: [{ src: "/images/side/tower.jpg", video: "/images/side/tower.mp4", label: "Stack Tower 3D", caption: "Timing the drop." }],
    highlights: [],
    tags: ["Next.js", "Three.js", "3D"],
    links: [
      { label: "Play Now", href: "https://tower-stacking.vercel.app/", kind: "web" },
      { label: "GitHub", href: "https://github.com/nahyun27/stack-tower-3d", kind: "github" },
    ],
    theme: { bg: "#04212B", fg: "#E0FAFF", accent: "#00E5FF", accent2: "#7BF0FF" },
    stage: "media",
  },
  {
    icon: "image",
    title: "Floating Memories",
    summary: "An immersive 3D photo gallery. Drift through the moments of a life as if in zero gravity.",
    media: [{ src: "/images/side/floating.jpg", video: "/images/side/floating.mp4", label: "Floating Memories", caption: "Drifting between photos." }],
    highlights: [],
    tags: ["React Three Fiber", "WebGL", "Creative"],
    links: [
      { label: "Explore", href: "https://floating-memories.vercel.app/", kind: "web" },
      { label: "GitHub", href: "https://github.com/nahyun27/floating-memories", kind: "github" },
    ],
    theme: { bg: "#0B1230", fg: "#E8EEFF", accent: "#7FA6FF", accent2: "#A5D8FF" },
    stage: "media",
  },
  {
    icon: "eyeoff",
    title: "Beware Of Darkness",
    summary: "A tense Unity maze escape. Your vision narrows relentlessly while you collect coins to survive.",
    media: [{ src: "/images/side/beware.jpg", video: "/images/side/beware.mp4", label: "Beware Of Darkness", caption: "The light is running out." }],
    highlights: [],
    tags: ["Unity", "C#", "Level Design"],
    links: [{ label: "GitHub", href: "https://github.com/nahyun27/Beware-Of-Darkness", kind: "github" }],
    theme: { bg: "#1B0A0A", fg: "#FFE9E9", accent: "#FF5252", accent2: "#FF9B7A" },
    stage: "media",
  },
];

export const SIDE_PROJECTS: Project[] = DATA.map((p, i) => ({ ...p, id: String(i + 1).padStart(2, "0") }));
