# Site Refactor Progress

This is the single source of truth for the active local refactor branch.
Update it whenever a user-approved checkpoint is committed.

## Current Branch

- Branch: `cursor/site-refactor`
- Latest checkpoint: `e7112f7 refactor(tours): organize tour package images`
- Push status: local only; nothing has been pushed.

## Work Board

| Area | Status | Notes |
| --- | --- | --- |
| CSS modularization and HTML wiring | Completed | Twelve numbered stylesheets are loaded in order. |
| General JS folder/module organization | Completed | Shared, home, gallery, and tour concerns are separated. |
| Dynamic tour-page refactor | Completed | Six routes verified; user manual testing approved. |
| Destinations-page JS deep refactor | Completed | User-approved after Ella and Sigiriya manual verification. |
| Move and organize tours/destinations assets | Completed | Tour images now live in `assets/img/tours`; public page routes are unchanged. |
| Root cleanup and temporary-file organization | Completed | Site root contains only site files; ignored temporary work remains in `_tools/`. |
| Unused-code and performance audit | Completed | Removed unused jQuery; image compression is deferred because no safe local tool is available. |
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

1. Audit every customer facing control and WhatsApp flow.
2. Verify each package inquiry includes the needed trip details.
3. Compress oversized image assets when a safe local tool is available.

## Destination Review Checklist

- Open each `?destination=` route: `sigiriya`, `ella`, `kandy`, `colombo`,
  `trincomalee`, `arugambay`, and `bentota`.
- Click the destination selector pills; confirm the title, hero image, article,
  and URL update together.
- Scroll through a guide; confirm both "Inside this story" menus highlight the
  current article section.
- Confirm the WhatsApp inquiry opens with the selected destination named in
  its draft message. Do not send it.
