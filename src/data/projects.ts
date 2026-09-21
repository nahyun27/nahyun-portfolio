import type { IconName } from "@/components/ProjectIcon";

export type LinkKind = "web" | "github" | "apple" | "android";

export interface ProjectLink {
  label: string;
  href: string;
  kind: LinkKind;
}

export interface ProjectMedia {
  src: string;
  /** looping clip shown instead of the image when present, src then acts as its poster */
  video?: string;
  label: string;
  caption?: string;
  /** cover crops to fill the frame, contain letterboxes */
  fit?: "cover" | "contain";
  position?: string;
  /** frame background for images that ship with their own (e.g. white charts) */
  bg?: string;
  /** frame height as a percentage of its width, default 62 */
  aspect?: number;
  /** show native controls and sound instead of a silent loop, for demo recordings */
  controls?: boolean;
  /** phone shaped recording, shown at its own proportions */
  portrait?: boolean;
}

/** how the screen fills in when a project opens, each one nods to what the project is */
export type TransitionKind =
  | "liquid"
  | "tennis"
  | "paper"
  | "grid"
  | "stack"
  | "scan"
  | "wave"
  | "bars"
  | "pills"
  | "photos"
  | "stamp"
  | "eclipse"
  | "darkness";

/** each project opens as its own colour world */
export interface SceneTheme {
  bg: string;
  fg: string;
  accent: string;
  accent2: string;
}

/** which interactive stage a project scene shows next to the text */
export type StageKind = "ssd" | "papers" | "shell" | "liquid" | "media";

export interface Project {
  id: string;
  icon: IconName;
  title: string;
  badge?: string;
  summary: string;
  media?: ProjectMedia[];
  metrics?: { value: string; label: string }[];
  highlights: string[];
  tags: string[];
  links: ProjectLink[];
  theme: SceneTheme;
  stage: StageKind;
  transition: TransitionKind;
}

const PROJECT_DATA: Omit<Project, "id">[] = [
  {
    icon: "drive",
    title: "SSD WAF Optimization",
    summary:
      "Hot/Cold data separation inside the FEMU blackbox SSD emulator, so garbage collection stops shuffling frequently rewritten pages together with long lived ones.",
    metrics: [
      { value: "48%", label: "lower WAF" },
      { value: "56%", label: "less GC overhead" },
      { value: "2x", label: "write throughput, 1h FIO" },
    ],
    highlights: [
      "Split the blackbox FTL free line list into separate hot and cold line pools, each with its own write pointer.",
      "Classified every LPN by write frequency inside a decaying window, and promoted it to hot only after repeated short rewrite intervals.",
      "Hot lines use greedy GC on invalid page count, cold lines use a cost benefit score from line age and invalid pages. Emergency borrowing keeps either pool from running dry.",
      "Added WAF accounting (host writes vs NAND writes) and compared baseline against the new FTL on a 64GB emulated SSD with 25% over provisioning.",
    ],
    media: [
      {
        src: "/images/projects/femu-waf-baseline.png",
        label: "Baseline",
        caption: "Baseline FTL: WAF keeps climbing and settles near 7.8.",
        fit: "contain",
        bg: "#fff",
      },
      {
        src: "/images/projects/femu-waf-improved.png",
        label: "Hot/Cold FTL",
        caption: "Hot/Cold FTL: WAF settles near 3.9 under the same kind of write load.",
        fit: "contain",
        bg: "#fff",
      },
    ],
    tags: ["C", "FEMU", "FTL", "System Programming"],
    links: [{ label: "GitHub", href: "https://github.com/nahyun27/femu-hotcold-ftl", kind: "github" }],
    theme: { bg: "#071427", fg: "#EAF2FF", accent: "#FF6B3D", accent2: "#4DA3FF" },
    stage: "ssd",
    transition: "grid",
  },
  {
    icon: "tennis",
    title: "TennisTown",
    badge: "Live",
    summary:
      "A tennis tournament platform I helped build from the ground up, available on the web, App Store and Google Play.",
    highlights: [
      "Real time bracket tracking, with court by court match status.",
      "In app score submission by players.",
      "Tournament registration and draw management.",
      "BP reward system.",
      "React Native app for iOS and Android with a Node.js and Firebase backend.",
    ],
    tags: ["React Native", "Node.js", "Firebase"],
    links: [
      { label: "Website", href: "https://www.tennistown.team/", kind: "web" },
      {
        label: "App Store",
        href: "https://apps.apple.com/kr/app/%ED%85%8C%EB%8B%88%EC%8A%A4%ED%83%80%EC%9A%B4/id1632821276",
        kind: "apple",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.momzit.tennistown&hl=ko",
        kind: "android",
      },
    ],
    theme: { bg: "#0E3B2E", fg: "#F4FFE0", accent: "#D7F23B", accent2: "#7CE0B0" },
    stage: "liquid",
    transition: "tennis",
  },
  {
    icon: "scale",
    title: "KCPEC Platform",
    badge: "In production",
    summary:
      "An online education and counseling platform for court mandated crime prevention programs, built and operated end to end as a freelance full stack developer.",
    metrics: [
      { value: "4", label: "payment methods" },
      { value: "3", label: "OAuth providers" },
    ],
    highlights: [
      "Course playback, progress tracking and quizzes, with certificates and pledges generated from PPTX templates to PDF, using per course serial numbers carried over from the previous site.",
      "Toss Payments for card, easy pay, bank transfer and virtual accounts, with a webhook that confirms deposits automatically.",
      "Kakao, Naver and Google OAuth login on top of httpOnly cookie JWT sessions.",
      "Gemini drafts counseling reports, then a staff review workflow finalizes them.",
      "Admin dashboard for sales and visitor statistics, plus member, order and issued document management.",
      "Migrated the previous site's member and order history, and audited and fixed payment and security issues found in production.",
      "Moved the domain to Cloudflare DNS and AWS EC2, with an Nginx reverse proxy, SSL and systemd services.",
    ],
    tags: ["FastAPI", "PostgreSQL", "Next.js", "TypeScript", "Tailwind CSS", "AWS EC2", "Nginx"],
    links: [
      { label: "Live Site", href: "https://kcpec.co.kr", kind: "web" },
      { label: "GitHub", href: "https://github.com/nahyun27/kcpec-platform", kind: "github" },
    ],
    theme: { bg: "#12233F", fg: "#F3F0E6", accent: "#F2B544", accent2: "#5EC3E8" },
    stage: "liquid",
    transition: "stamp",
  },
  {
    icon: "search",
    title: "Paperprobe",
    summary:
      "Upload academic PDFs and ask questions grounded in their content, compare several papers side by side, and see how they relate in an interactive similarity graph.",
    metrics: [
      { value: "5", label: "papers compared at once" },
      { value: "KO / EN", label: "injection detection" },
    ],
    highlights: [
      "Ingestion pipeline: pdfplumber parsing, chunking and MiniLM embeddings stored per paper in ChromaDB, with streaming answers from FastAPI.",
      "Comparison view lines up up to five papers by purpose, method, results and limitations.",
      "D3.js network graph drawn from cosine similarity between paper embeddings.",
      "Semantic prompt injection detection: embedding similarity flags malicious instructions hidden in papers, ranks them by risk, and a defense prompt is added to every query.",
      "Swappable LLM backend, local Ollama (llama3.2) or the Gemini API.",
    ],
    media: [
      { src: "/images/projects/paperprobe-qa.gif", label: "Paper Q&A", caption: "Ask questions about an uploaded paper and get streamed answers." },
      { src: "/images/projects/paperprobe-compare.gif", label: "Compare", caption: "Compare up to five papers by purpose, method, results and limitations." },
      { src: "/images/projects/paperprobe-graph.gif", label: "Graph", caption: "Interactive similarity graph of the paper collection." },
      { src: "/images/projects/paperprobe-security.gif", label: "Injection detection", caption: "Suspicious chunks flagged and ranked by risk level." },
    ],
    tags: ["FastAPI", "ChromaDB", "Next.js", "D3.js", "RAG"],
    links: [{ label: "GitHub", href: "https://github.com/nahyun27/paperprobe", kind: "github" }],
    theme: { bg: "#F4EFE4", fg: "#1B1B1F", accent: "#E5484D", accent2: "#1E6FEB" },
    stage: "papers",
    transition: "paper",
  },
  {
    icon: "terminal",
    title: "nsh> Linux Mini Shell",
    summary:
      "A Unix shell written in C, covering process creation, pipes, redirection and a hand rolled line editor.",
    metrics: [{ value: "∞", label: "pipe stages" }],
    highlights: [
      "Recursive multi stage pipes built on fork, pipe and dup2, so a | b | c | d works with no stage limit.",
      "I/O redirection (<, >, >>, 2>), background jobs that are reaped before the next prompt, and semicolon separated commands that respect quotes.",
      "Line editor in termios raw mode with arrow key history, mid line editing, !! and !n expansion and a colored prompt.",
      "Signal handling that keeps the shell alive on Ctrl+C while foreground children still terminate.",
    ],
    media: [
      {
        src: "/images/projects/nsh-demo.png",
        label: "Demo",
        caption: "A session in nsh: redirection, history, !! expansion and semicolon separated commands.",
        fit: "cover",
        position: "top",
      },
    ],
    tags: ["C", "Linux", "System Programming", "termios"],
    links: [{ label: "GitHub", href: "https://github.com/nahyun27/linux-study-minishell", kind: "github" }],
    theme: { bg: "#08110B", fg: "#D7F7DE", accent: "#4ADE80", accent2: "#7DD3FC" },
    stage: "shell",
    transition: "scan",
  },
  {
    icon: "mic",
    title: "PerSI",
    summary:
      "A speaker identification app for hearing impaired users. Register the voices of the people around you, then see who said what in a conversation, laid out as a chat with their name and picture.",
    media: [
      {
        src: "/images/projects/persi-demo.jpg",
        video: "/images/projects/persi-demo.mp4",
        label: "Demo",
        caption: "The demo recording from the final presentation (about three minutes, with sound).",
        portrait: true,
        controls: true,
      },
    ],
    metrics: [
      { value: "7 / 8", label: "speakers identified in the test" },
      { value: "2 min", label: "of voice to register someone" },
    ],
    highlights: [
      "Register a speaker by recording their voice in the app or uploading a recording. About two minutes of speech per person is enough to train the classifier.",
      "pyannote.audio splits a conversation into per speaker segments. wav2vec 2.0 turns each segment into embeddings that feed a Conv1D speaker classifier, and it produces the transcript in the same pass.",
      "Anything below 0.5 confidence is treated as an unregistered speaker and only the transcript comes back.",
      "The classifiers were evaluated on the Zeroth Korean set (115 speakers, 22,720 utterances) across input frame sizes and against a log mel baseline. On a four speaker test conversation, 7 of 8 utterances were attributed correctly.",
      "My part was the client: UI and UX design with Figma prototypes, and the recording and file upload flow in React Native.",
      "Built by a team of four across model, server and app. With no GPU on the GCP free tier, inference was slow, and we documented that as the main limitation.",
    ],
    tags: ["React Native", "FastAPI", "PyTorch", "wav2vec2", "pyannote", "GCP", "MongoDB"],
    links: [{ label: "GitHub", href: "https://github.com/PerSI-Org", kind: "github" }],
    theme: { bg: "#FF7A59", fg: "#2A0F08", accent: "#FFE29A", accent2: "#FFFFFF" },
    stage: "liquid",
    transition: "wave",
  },
  {
    icon: "pill",
    title: "ToFindPill",
    summary:
      "A pill recognition app for clinicians. Photograph several pills at once and get each one identified in seconds.",
    metrics: [
      { value: "99.76%", label: "Top 1 accuracy" },
      { value: "1.5s", label: "inference, down from 5s" },
    ],
    media: [
      {
        src: "/images/projects/tofindpill-architecture.png",
        label: "Architecture",
        caption:
          "The React Native app (login, camera, history and results) talks to a Node.js API. The model server segments every pill in the photo with YOLO, classifies each crop and returns a top 5 list per pill. Users and results live in MongoDB.",
        fit: "contain",
        bg: "#FFFFFF",
        aspect: 96,
      },
    ],
    highlights: [
      "Two stage pipeline: YOLOv5 detects every pill in the photo, YOLOv8 classifies each detected pill.",
      "Brought inference from 5s down to 1.5s while holding 99.76% Top 1 accuracy.",
      "React Native client with a Node.js and MongoDB backend.",
      "Run as a full SDLC project with an SRS, a QA/QC strategy and Jira managed sprints.",
    ],
    tags: ["YOLOv5", "YOLOv8", "React Native", "Node.js", "MongoDB", "Python"],
    links: [{ label: "GitHub", href: "https://github.com/ToFindPill", kind: "github" }],
    theme: { bg: "#EAF7F5", fg: "#0E2A2A", accent: "#00B8A9", accent2: "#FF8FB1" },
    stage: "liquid",
    transition: "pills",
  },
  {
    icon: "branch",
    title: "Software Dev Practices",
    summary:
      "A team project built around the way software is actually shipped: agile process, automated pipelines and tests.",
    highlights: [
      "Worked as a team with agile methodology.",
      "Automated build and delivery through CI/CD pipelines.",
      "Testing built into the workflow.",
    ],
    tags: ["Agile", "CI/CD", "Testing"],
    links: [{ label: "GitHub", href: "https://github.com/Software-Development-Practices", kind: "github" }],
    theme: { bg: "#17181C", fg: "#EDEDED", accent: "#7EE787", accent2: "#79C0FF" },
    stage: "liquid",
    transition: "liquid",
  },
  {
    icon: "flask",
    title: "ACE Lab Website",
    badge: "Live",
    summary:
      "The official website of Hanyang Univ. ERICA's AI & Cyber Security Lab, covering research, members, publications and photo albums.",
    highlights: [
      "Dark and light mode.",
      "Full Korean and English i18n, with visitor language detection and shareable language links.",
      "Pages for lab news, research, members, publications and albums, plus admin pages for managing content.",
    ],
    tags: ["React", "Supabase", "i18n", "styled-components"],
    links: [{ label: "Live Site", href: "https://ace.hanyang.ac.kr", kind: "web" }],
    theme: { bg: "#0A2E33", fg: "#E6FBFA", accent: "#5EEAD4", accent2: "#38BDF8" },
    stage: "liquid",
    transition: "liquid",
  },
];

// ids follow the array order, so reordering the list needs no renumbering
export const PROJECTS: Project[] = PROJECT_DATA.map((p, i) => ({ ...p, id: String(i + 1).padStart(2, "0") }));
