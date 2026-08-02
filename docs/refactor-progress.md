# Site Refactor Progress

This is the single source of truth for the active local refactor branch.
Update it whenever a user-approved checkpoint is committed.

## Current Branch

- Branch: `cursor/site-refactor`
- Latest checkpoint: `6c027c5 fix(html): harden page controls and gallery markup`
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
| Site-wide controls and WhatsApp audit | Completed | Package messages, offer CTAs, gallery quick links, form feedback, and tour favourites were audited and committed. |
| HTML syntax and logic audit | Completed | Static structure, IDs, links, ARIA references, button types, image sources, and visible character encoding were checked across all four pages. |
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

1. Add a lightweight repeatable verification suite.
2. Complete the final responsive and browser regression pass.
3. Review deferred image compression when a safe local tool is available.

## Controls and WhatsApp Audit Review

- Every package form builds its inquiry from the selected package, travel date,
  pickup time, vehicle, hotel tier, group size, add-ons, guest name, and notes.
- Past travel dates, invalid guest counts, short names, and overlong notes are
  blocked before an inquiry is opened; each field now has an associated label
  and live validation feedback.
- Home offers, promo claims, destination inquiries, and tour modal inquiries
  share the same WhatsApp URL helper and business number.
- The five home offer cards support click, Enter, and Space. Their inquiry
  messages retain the correct offer name and promo code.
- The six tour heart controls now save their state locally and show whether a
  package is currently saved.
- Repaired four gallery quick links that previously pointed to IDs that did not
  exist on the page.

## Destination Review Checklist

- Open each `?destination=` route: `sigiriya`, `ella`, `kandy`, `colombo`,
  `trincomalee`, `arugambay`, and `bentota`.
- Click the destination selector pills; confirm the title, hero image, article,
  and URL update together.
- Scroll through a guide; confirm both "Inside this story" menus highlight the
  current article section.
- Confirm the WhatsApp inquiry opens with the selected destination named in
  its draft message. Do not send it.
