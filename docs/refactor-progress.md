# Site Refactor Progress

This is the single source of truth for the active local refactor branch.
Update it whenever a user-approved checkpoint is committed.

## Current Branch

- Branch: `cursor/site-refactor`
- Latest checkpoint: `cdc4bb4 refactor(tours): modularize dynamic tour pages`
- Push status: local only; nothing has been pushed.

## Work Board

| Area | Status | Notes |
| --- | --- | --- |
| CSS modularization and HTML wiring | Completed | Twelve numbered stylesheets are loaded in order. |
| General JS folder/module organization | Completed | Shared, home, gallery, and tour concerns are separated. |
| Dynamic tour-page refactor | Completed | Six routes verified; user manual testing approved. |
| Destinations-page JS deep refactor | Completed | User-approved after Ella and Sigiriya manual verification. |
| Move and organize tours/destinations assets | Not started | Preserve current public URLs. |
| Root cleanup and temporary-file organization | Not started | Keep reusable tooling contained, not scattered. |
| Unused-code and performance audit | Not started | Inspect only after structure is stable. |
| Site-wide controls and WhatsApp audit | Not started | Includes package booking message contents. |
| HTML syntax and logic audit | Not started | Cover every static page. |
| Repeatable automated verification | Not started | Add only lightweight checks compatible with no build step. |
| Final responsive/browser regression pass | Not started | Desktop, tablet, and mobile. |

## Completed Tour Checkpoint

- Replaced `tour-dynamic.js` with focused data, route, itinerary, template,
  renderer, tabs, gallery, booking, and entry modules.
- Kept six public tour URLs and the existing visual order intact.
- Centralized tour records for the home cards and tour detail pages.
- Added future-date enforcement, per-field feedback, and shared WhatsApp URLs.
- Removed polling, duplicate PhotoSwipe loading, unrelated home scripts, and
  inline tour action handlers.

## Next Checkpoint

1. Move and organize tours/destinations assets while preserving public URLs.
2. Keep reusable working files contained before root cleanup.
3. Audit unused code and performance only after the asset structure is stable.

## Destination Review Checklist

- Open each `?destination=` route: `sigiriya`, `ella`, `kandy`, `colombo`,
  `trincomalee`, `arugambay`, and `bentota`.
- Click the destination selector pills; confirm the title, hero image, article,
  and URL update together.
- Scroll through a guide; confirm both "Inside this story" menus highlight the
  current article section.
- Confirm the WhatsApp inquiry opens with the selected destination named in
  its draft message. Do not send it.
