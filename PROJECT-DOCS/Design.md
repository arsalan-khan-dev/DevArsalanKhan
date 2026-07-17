# Design Notes

## Palette (kept, refined only)
Base: near-black (#111111 bg-primary), lime-green accent (#89E900). This is a strong, distinctive combo — dark "developer terminal" aesthetic that already reads as premium. Refinements only:
- Slightly deepened surface-raised shade for card contrast
- Consistent hover/active states on all buttons using existing --color-accent-dim
- Unified glass/blur treatment already defined in tokens — reused, not replaced

## Typography
Existing fluid clamp() scale kept as-is (already well-built: --text-hero through --text-label). Only touched:
- Line-height on long-form paragraphs (project descriptions) bumped for readability
- Section header spacing tightened slightly for rhythm

## Skills section redesign
Old: mixed/unclear scope. New: 6 clear categories (Frontend, Backend, Databases, APIs, Security, Tools) — each a card grid, matching existing card visual language (border, radius, hover lift already in style.css).

## Projects
Kept existing card + modal pattern. Each card now:
- Real screenshot (object-fit: cover, lazy-loaded)
- Real or TODO-marked GitHub/Live links, rendered as disabled-state style if unresolved (not a dead active-looking button)
- Modal retains problem → approach → result structure, de-fabricated
