# NK. — Nahyun Kim Portfolio

> Personal portfolio of Nahyun Kim, AI Security Researcher & Creative Developer.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat-square&logo=vercel)](https://nahyun-portfolio.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-00C9A7?style=flat-square)](LICENSE)

---

## ✨ Overview

A minimal, single-page portfolio built with a strict 3-color palette — **cream, black, and mint** — with smooth scroll animations, drag-to-explore project sliders, and a custom cursor. Designed to be clean, fast, and memorable.

**Live:** [nahyun-portfolio.vercel.app](https://nahyun-portfolio.vercel.app)

---

## 🗂 Sections

| # | Section | Content |
|---|---------|---------|
| 01 | **Hero** | Animated name reveal, identity tags |
| 02 | **About** | Bio, stats, tech stack, contact links |
| 03 | **Research** | Publications & patents (drag slider) |
| 04 | **Projects** | Built apps & systems (drag slider) |
| 05 | **Creative Lab** | Web experiments & games (drag slider) |
| 06 | **Awards** | Recognitions, certifications, scores |
| — | **Footer** | Contact CTA |

---

## 🛠 Tech Stack

- **Framework** — Next.js 14 (App Router)
- **Styling** — Tailwind CSS
- **Animations** — Framer Motion
- **Font** — Syne (headings) + Inter (body) via Google Fonts
- **Deployment** — Vercel

---

## 🎨 Design System

```
Background  #F5F0E8  Cream
Text        #0A0A0A  Black
Accent      #00C9A7  Mint
Card bg     #FFFFFF  White
```

---

## 🚀 Getting Started

```bash
git clone https://github.com/nahyun27/nahyun-portfolio.git
cd nahyun-portfolio
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── layout.tsx       # Global layout, fonts, cursor
│   ├── page.tsx         # Main page (all sections)
│   └── globals.css
├── components/
│   ├── Cursor.tsx       # Custom cursor
│   ├── Navbar.tsx
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Research.tsx
│   ├── Projects.tsx
│   ├── Creative.tsx
│   ├── Awards.tsx
│   ├── Footer.tsx
│   └── DragSlider.tsx   # Horizontal drag-to-scroll
└── data/
    └── portfolio.ts     # All project/award data
```

---

## 📬 Contact

**Nahyun Kim** — AI Security Researcher @ ACE-LAB, Hanyang University (ERICA)

- Email: [ksknh7@hanyang.ac.kr](mailto:ksknh7@hanyang.ac.kr)
- GitHub: [github.com/nahyun27](https://github.com/nahyun27)
- Lab: [ace.hanyang.ac.kr](https://ace.hanyang.ac.kr)

---

© 2025 Nahyun Kim. Built with Next.js & Framer Motion.