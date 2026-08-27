# Architecture

## Stack (unchanged)
- Static HTML/CSS/JS, no build step
- GSAP + ScrollTrigger + TextPlugin (animation)
- Three.js r128 (hero particle system)
- Lenis (smooth scroll)
- AOS (scroll reveal)
- Vanilla JS, ES modules removed (main.js/projects.js/chatbot.js deleted — dead code, not imported by index.html)

## File structure (post-fix)
```
/index.html          — single page, all sections
/style.css           — full design system (tokens in :root, light-theme override)
/script.js           — all active behavior: nav, hero canvas, skills, projects modal, form, theme toggle
/images/projects/    — project screenshots for 8 portfolio projects, compressed
/public/profile-ak.jpg      — real profile photo, compressed
/public/og-image.jpg         — generated placeholder OG image (1200x630) — swap for a designed one later
/public/resume/               — empty, needs arsalan-khan-cv.pdf dropped in (see README.txt inside)
```

Removed entirely: the 6 unused certificate images, the 6 generic stock "gallery" images, and the raw pic1–pic6 source frames (their 2 best frames per project now live in /images/projects, renamed and optimized). Total image payload went from ~15MB to under 1MB for what's actually loaded on the page.

## Why assets/ was deleted
The zip shipped a literal folder named `{fonts/rockybilly,images/{profile,projects,gallery,certificates,favicon},icons/{tech,ui},resume}` — an un-expanded bash brace pattern, not a real directory tree. All real assets actually live flat in `/images` and `/public`. Every path in HTML/CSS/JS now points to real, existing files only.

## Data flow
- Skills: static HTML grid, grouped by category (Frontend/Backend/Databases/APIs/Security/Tools)
- Projects: 8 static HTML cards + a JS object (`projects` in script.js) driving the "view details" modal — kept in matching order so card clicks open the correct project details
- Contact form: native `fetch()` POST to Formspree endpoint, no third-party JS SDK
