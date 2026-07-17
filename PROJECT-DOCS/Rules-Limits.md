# Rules & Limits — What I Fixed vs. What You Must Still Do

## Things I will NOT fabricate (and why)
- **Formspree ID** — I cannot create an account or endpoint on your behalf. You must sign up at formspree.io, create a form, and paste the ID into `script.js` where marked `TODO_FORMSPREE_ID`.
- **Resume PDF** — I cannot write your CV for you. Drop your real PDF at `public/resume/arsalan-khan-cv.pdf` (path is already wired correctly in the download buttons).
- **Open Graph image** — needs a real 1200x630 branded image. I've added the correct `<meta>` tags pointing to `/public/og-image.jpg` — supply that file (a clean screenshot of the hero section at 1200x630 works well).
- **Unverified project repo URLs** — I confirmed your GitHub (github.com/arsalan-khan-dev) is real and has 18 public repos, and confirmed `bofalgan-pharmaceuticals` by name. I could not confirm exact repo names/URLs for Car Hub, MemoryOS, AI Text Detector, or a security research writeup from search alone — GitHub blocks automated browsing of your repo list beyond the profile README. Those links are marked `<!-- TODO: paste real repo URL -->` directly in the HTML, not left as dead `#`.
- **Live demo URLs** — same treatment; marked, not invented.
- **"Smart AI Hacks & Cyber Tips" platform claim** — the original experience section claimed you built and run an education platform under this name. I searched for it and found no matching result. I removed this claim rather than keep an unverifiable achievement on the page. If this is real, tell me the actual URL/name and I'll add it back properly — right now it reads exactly like the kind of fabricated bullet a recruiter would flag.
- **Snapchat security research / AI text detection bullets** — removed from the Experience timeline since those projects were dropped (no screenshots or proof existed) and the bullets no longer matched anything shown elsewhere on the page.
- **Testimonials** — none added. You said only real ones, and none were supplied. Section left out entirely rather than faked.
- **Numeric outcomes** ("50,000+ tests", "100+ bookings", etc.) — these were fabricated in the original modal copy. Replaced with honest, qualitative language about what each project does and what problem it solves. If you have real numbers later, they're easy to slot back in.

## Things I DID fix outright (no client input needed)
- Profile photo wired into About section
- All 6 project screenshots wired into project cards
- Stat mismatch (20 vs 6 projects) corrected to match actual project count
- Dead JS files deleted (main.js, projects.js, chatbot.js)
- Certifications section removed per instruction
- Skills section rebuilt to modern web + security stack only
- Broken `assets/{...}` brace-expansion folder removed; all paths now point to real files

## Follow-up checklist for you
- [ ] Create Formspree form, paste ID into script.js
- [ ] Add real resume PDF to public/resume/
- [ ] Add a real 1200x630 og-image.jpg to public/
- [ ] Confirm/paste real repo + live demo URLs for the 4 unverified projects
- [ ] Double check github.com/arsalan-khan-dev and your LinkedIn slug are fully populated — a recruiter will click through
