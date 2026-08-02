# Site Refactor Progress

This is the single source of truth for the active local refactor branch.
Update it whenever a user-approved checkpoint is committed.

## Current Branch

- Branch: `cursor/site-refactor`
- Latest checkpoint: `0c59f28 perf(nav): remove jQuery back to top dependency`
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
| Site-wide controls and WhatsApp audit | Ready for review | Package messages, offer CTAs, gallery quick links, form feedback, and tour favourites were audited. Changes are uncommitted. |
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

1. Review and commit the completed controls and WhatsApp audit.
2. Run the HTML syntax and logic audit across all static pages.
3. Add a lightweight repeatable verification suite.

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
