# Portfolio Redesign — PRD

## Objective
Ship v2.0 of Arsalan Khan's existing portfolio: same identity, same layout, same design language — but functionally complete, visually refined, and honest about what's real.

## Non-goals
- No rebuild from scratch
- No new color palette
- No new layout/nav structure
- No invented stats, testimonials, or achievements

## Source of truth for content
- 8 real projects, represented by the project cards and images/ assets
- Real profile photo: public/profile-ak.jpg
- Real project screenshots: images/pic1-*.jpg (Nova Heaven / "Car Hub" retail UI) through pic6-*.jpg
- Certs are real (W3Schools/Coursera-style, verifiable) — but removed per client instruction (redundant, not needed for target roles)

## Decisions made with client (2026-07-16)
1. **Metrics**: All invented numeric claims (e.g. "100+ bookings", "5000+ visits", "87% accuracy", "3 vulnerabilities disclosed") replaced with qualitative, defensible language. No fabricated stats anywhere.
2. **Unverified links**: Real GitHub profile + bofalgan-pharmaceuticals repo wired in directly. Car Hub / MemoryOS / AI Text Detector / security research links use clearly marked `<!-- TODO: -->` placeholders pointing to exact spot to paste the real URL — never left as dead `href="#"`.

## Priority order (from audit)
1. Wire real images (profile, project screenshots) — no more initials/placeholders
2. Fix resume path + contact form (Formspree) + explain both need a real ID/PDF from the client
3. Keep the 8-project count consistent across the portfolio
4. Real/placeholder-marked links, never bare `#`
5. Delete dead code (main.js, projects.js, chatbot.js) — done
6. De-risk fabricated project outcomes
7. Fix og:image or set expectations that client must supply one
8. Skills section rescoped to modern web dev + security only
9. Certifications section removed
