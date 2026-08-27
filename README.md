<div align="center">

# Arsalan Khan

### Cinematic Developer Portfolio

Awwwards-level personal portfolio built with pure HTML5, CSS3 and Vanilla JavaScript — featuring Three.js particle backgrounds, GSAP scroll animations and buttery-smooth Lenis scrolling.

[![Live Demo](https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://arsalan-khan-dev.github.io/portfolio-website/)
[![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)](https://arsalan-khan-dev.github.io/portfolio-website/)
[![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)](LICENSE)

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![GSAP](https://img.shields.io/badge/GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white)](https://gsap.com/)
[![Three.js](https://img.shields.io/badge/Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white)](https://threejs.org/)

[![Made with Love](https://img.shields.io/badge/Made_with-%E2%99%A5-e25555?style=flat-square)](#)
[![Maintained](https://img.shields.io/badge/Maintained-Yes-brightgreen?style=flat-square)](#)
[![PRs Welcome](https://img.shields.io/badge/PRs-Welcome-blueviolet?style=flat-square)](#)
[![WCAG 2.1 AA](https://img.shields.io/badge/WCAG_2.1-AA-005A9C?style=flat-square)](#)
[![No Build Step](https://img.shields.io/badge/Build_Step-None-lightgrey?style=flat-square)](#)

[Live Preview](https://arsalan-khan-dev.github.io/DevArsalanKhan/) · [Report Bug](https://github.com/arsalan-khan-dev/portfolio-website/issues) · [Request Feature](https://github.com/arsalan-khan-dev/portfolio-website/issues)

</div>

<br>

<div align="center">
<img src="https://img.shields.io/badge/-Split_Panel_Loader-111111?style=flat-square" />
<img src="https://img.shields.io/badge/-Glassmorphism_Navbar-111111?style=flat-square" />
<img src="https://img.shields.io/badge/-Particle_Hero-111111?style=flat-square" />
<img src="https://img.shields.io/badge/-Dark_%2F_Light_Theme-111111?style=flat-square" />
<img src="https://img.shields.io/badge/-Custom_Cursor-111111?style=flat-square" />
<img src="https://img.shields.io/badge/-SEO_Ready-111111?style=flat-square" />
</div>

<br>

---

## Overview

This repository contains the full source of **Arsalan Khan's** developer portfolio — a production-grade, single-page website engineered for performance, accessibility and visual polish. It ships with zero build tooling: clone it, open `index.html`, and it runs.

---

## Table of Contents

- [Quick Start](#quick-start)
- [Folder Structure](#folder-structure)
- [Configuration](#configuration)
- [Tech Stack](#tech-stack)
- [Feature Checklist](#feature-checklist)
- [Deployment](#deployment)
- [Browser Support](#browser-support)
- [Contact](#contact)
- [License](#license)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/arsalan-khan-dev/portfolio-website.git

# 2. Move into the project directory
cd portfolio-website

# 3. Open index.html in your browser
# no build step, no dependencies to install
```

> **Tip:** for the smoothest experience during local development, serve the folder with a lightweight static server (e.g. VS Code's *Live Server* extension) rather than opening the file directly, so relative asset paths and fonts resolve correctly.

---

## Folder Structure

```
arsalan-portfolio/
├── index.html                    Main HTML file
├── style.css                     Complete stylesheet (design system + sections)
├── script.js                     All JavaScript modules
├── README.md                     This file
│
└── assets/
    ├── fonts/
    │   └── rockybilly/           Self-hosted Rockybilly display font
    │       ├── rockybilly.woff2
    │       └── rockybilly.woff
    ├── images/
    │   ├── profile/              arsalan-profile.webp        (600x800)
    │   ├── projects/             project-01.webp – project-06.webp   (800x450)
    │   ├── gallery/               gallery-01.webp – gallery-08.webp
    │   ├── certificates/          cert-01.webp – cert-06.webp
    │   └── favicon/               favicon.ico, favicon-32.png, apple-touch-icon.png
    ├── icons/
    │   ├── tech/                 Tech stack SVG icons
    │   └── ui/                   UI SVG icons
    └── resume/
        └── arsalan-khan-cv.pdf   Resume PDF — replace with your own CV
```

---

## Configuration

### Contact Form — Formspree

| Step | Action |
|---|---|
| Endpoint | `https://formspree.io/f/mnpqagzj` |
| Integration | Vanilla JavaScript `fetch()` submission in `script.js` |

### Resume Download

Place your CV at:

```
public/resume/arsalan-khan-cv.pdf
```

The download button picks it up automatically — no code changes required.

### Profile Photo

1. Add your photo at `assets/images/profile/arsalan-profile.webp` (600 × 800 px)
2. Update the `about__photo` section in `index.html` to render an `<img>` element instead of the default initials placeholder

---

## Tech Stack

<div align="center">

| Layer | Technology | Purpose |
|---|---|---|
| ![HTML5](https://img.shields.io/badge/-HTML5-E34F26?style=flat-square&logo=html5&logoColor=white) | HTML5 | Semantic, accessible markup |
| ![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=flat-square&logo=css3&logoColor=white) | CSS3 | Custom properties, glassmorphism, fluid typography |
| ![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black) | Vanilla JS | 21 modules, zero framework dependencies |
| ![GSAP](https://img.shields.io/badge/-GSAP-88CE02?style=flat-square&logo=greensock&logoColor=white) | GSAP + ScrollTrigger | Cinematic scroll-driven animation |
| ![Three.js](https://img.shields.io/badge/-Three.js-000000?style=flat-square&logo=threedotjs&logoColor=white) | Three.js | Particle constellation hero background |
| ![Lenis](https://img.shields.io/badge/-Lenis-FF5C00?style=flat-square) | Lenis | Buttery smooth scrolling |
| ![AOS](https://img.shields.io/badge/-AOS-6E56CF?style=flat-square) | AOS | Scroll reveal fallback |

</div>

---

## Feature Checklist

Full compliance against the project's Product Requirements Document.

<table>
<tr><td>✔</td><td>Split-panel cinematic page loader</td></tr>
<tr><td>✔</td><td>Glassmorphism navbar with scroll-spy</td></tr>
<tr><td>✔</td><td>Three.js particle hero with mouse interaction</td></tr>
<tr><td>✔</td><td>Code block typewriter — Python <code>ArsalanKhan</code> class</td></tr>
<tr><td>✔</td><td>Animated skills — circular progress bars across 5 categories</td></tr>
<tr><td>✔</td><td>6 service cards with border-trace hover effect</td></tr>
<tr><td>✔</td><td>8 project cards with filtering + fullscreen modal (PSO structure)</td></tr>
<tr><td>✔</td><td>Alternating experience timeline</td></tr>
<tr><td>—</td><td>Certifications section removed</td></tr>
<tr><td>✔</td><td>Masonry gallery with lightbox</td></tr>
<tr><td>✔</td><td>Resume download with loading state</td></tr>
<tr><td>✔</td><td>Contact form with live validation</td></tr>
<tr><td>✔</td><td>Dark / light theme with OS preference detection</td></tr>
<tr><td>✔</td><td>Custom cursor with lerp tracking</td></tr>
<tr><td>✔</td><td>Magnetic CTA buttons</td></tr>
<tr><td>✔</td><td>Mobile bottom navigation</td></tr>
<tr><td>✔</td><td>Swipe gesture support</td></tr>
<tr><td>✔</td><td>Back-to-top button</td></tr>
<tr><td>✔</td><td>Scroll progress bar</td></tr>
<tr><td>✔</td><td>WCAG 2.1 AA accessibility</td></tr>
<tr><td>✔</td><td>SEO meta tags + JSON-LD structured data</td></tr>
<tr><td>✔</td><td><code>prefers-reduced-motion</code> support</td></tr>
<tr><td>✔</td><td>Mobile-first responsive design</td></tr>
</table>

---

## Deployment

This is a static site — deploy it anywhere that serves static files.

<div align="center">

[![Deploy with Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/new)
[![Deploy with Netlify](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://app.netlify.com/start)
[![Deploy with GitHub Pages](https://img.shields.io/badge/Deploy-GitHub_Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)](https://pages.github.com/)

</div>

No environment variables or build commands are required — point your host at the repository root.

---

## Browser Support

| Chrome | Firefox | Safari | Edge |
|:---:|:---:|:---:|:---:|
| ![Chrome](https://img.shields.io/badge/-Latest-4285F4?style=flat-square&logo=googlechrome&logoColor=white) | ![Firefox](https://img.shields.io/badge/-Latest-FF7139?style=flat-square&logo=firefoxbrowser&logoColor=white) | ![Safari](https://img.shields.io/badge/-Latest-000000?style=flat-square&logo=safari&logoColor=white) | ![Edge](https://img.shields.io/badge/-Latest-0078D7?style=flat-square&logo=microsoftedge&logoColor=white) |

---

## Contact

<div align="center">

[![Email](https://img.shields.io/badge/Email-arsalankhang004%40gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:arsalankhang004@gmail.com)
[![GitHub](https://img.shields.io/badge/GitHub-arsalan--khan--dev-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/arsalan-khan-dev)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-arsalan--khan-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/-arsalan-khan/)
[![Portfolio](https://img.shields.io/badge/Portfolio-Visit_Site-000000?style=for-the-badge&logo=googlechrome&logoColor=white)](https://arsalan-khan-dev.github.io/portfolio-website/)

</div>

---

## License

Distributed under the MIT License. See `LICENSE` for details.

<div align="center">

<sub>Designed and built by Arsalan Khan</sub>

</div>
