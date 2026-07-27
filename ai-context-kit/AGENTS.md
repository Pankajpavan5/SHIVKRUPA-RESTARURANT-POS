# Project Rules — Quick POS

Read this before writing any code. Follow it before you follow your instincts.

## The Prime Directive

**One file. No backend. No dependencies. No build step.**

The entire app is `pos-app/index.html`. If a change adds a `package.json`, a `node_modules/`, a server call, a CDN `<script>`, or a compile step — **stop and ask**. This constraint is the product, not an accident.

## Response format (this user's session)

Every response in this chat — including simple ones — must open with a `<thinking_process>` block covering all six frameworks (5x5 Rule, First Principles, Root Cause, Occam's Razor, OODA, Six Hats) and close with a `<final_solution>` block. Scale depth to the task, but never omit either block. This is a session preference, not a project law — do not enforce it in other repos.

## Hard "do not" rules (ranked by blast radius)

1. **Do not add dependencies, build tools, or backend calls.** Violates the Prime Directive.
2. **Do not break `LS_KEY` without a migration.** Bumping `quickpos_vN` → `vN+1` requires an in-place migration inside the load-time IIFE, or existing users lose their data on next open.
3. **Do not mutate `state.bills[i]` after it's written.** Bills are immutable snapshots — see DECISIONS.md 2026-07-27.
4. **Do not skip `resizeImage()` on user uploads.** Raw phone photos will blow the 5MB localStorage cap in one shot.
5. **Do not add UI without `no-print` class where appropriate.** New buttons/nav that print onto receipts are the #1 regression source.
6. **Do not refactor code you weren't asked to touch.** The file is long but internally consistent; unrequested cleanups create merge pain and hide the diff that mattered.
7. **Do not guess when ambiguous.** Ask. "Add loyalty" could be 20 lines or 2000.

## How to work in this codebase

- **Mutate `state`, then call `save()`.** Never read state back out of the DOM.
- **Rebuild views, don't diff them.** Each screen has a `render<Name>()` that regenerates its HTML from `state`. No framework, no reactivity.
- **Snapshot on close.** When `closeTable()` writes a `Bill`, deep-clone items/customer/tax so past bills survive future edits.
- **When adding a data field:** update `types.js` first → add to default state → add migration if schema breaks → then use it.
- **When adding a screen:** copy the pattern of a nearby `.modal-page` — never invent a new navigation model.

## When in doubt

**Grep `pos-app/index.html` for a similar existing pattern and copy it.** One matched pattern beats ten style rules.

Related files: [PRD.md](./PRD.md), [ARCHITECTURE.md](./ARCHITECTURE.md), [types.js](./types.js), [DECISIONS.md](./DECISIONS.md), [TASKS.md](./TASKS.md).

## Stack

- **Language:** Vanilla HTML + CSS + ES2020 JavaScript. No TypeScript, no framework.
- **Storage:** `localStorage` (single JSON blob at `LS_KEY`). Backup = JSON export/import.
- **Charts:** Inline SVG.
- **Send/share:** `wa.me/`, `api.whatsapp.com/send`, `sms:`, `window.print()`. Never a third-party API.

## Commands

There is no build. There are no tests. There is no lint.

```bash
# run — pick one
open pos-app/index.html                  # macOS
xdg-open pos-app/index.html              # Linux
start pos-app/index.html                 # Windows

# for camera / clipboard testing (needs HTTPS or localhost)
python3 -m http.server 8000              # then http://localhost:8000/pos-app/
```

## Gotchas by phase

**At code time:**
- Base64 images bloat state fast — always `resizeImage(file, 240)` (JPEG q0.75).
- `MenuItem.cat` references category by *name*, not id — renames must cascade via `renameCat()`.
- Category, staff, and expense enums are string literals — do not invent new ones without updating `types.js`.

**At test time (in the browser):**
- `file:///` and `http://localhost/` have separate `localStorage` — data won't cross.
- WhatsApp Business preference (`api.whatsapp.com/send`) is a hint, not a guarantee; the OS chooser may override it.
- `sms:?body=` behavior differs across Android / iOS / carriers. Keep templates short.

**At ship time:**
- `window.print()` renders the currently-visible DOM. Any UI element without `.no-print` will appear on the receipt.
- The barcode-scan button is a placeholder — do **not** enable it silently. Real scanning needs `BarcodeDetector` (Chromium) + camera permission + HTTPS.
- Google/Outlook/Apple Calendar sync is impossible in v1 (needs OAuth + backend). Do not partially implement it.

---

**Keep this file under ~80 lines.** Long context buries what matters. If a section grows, move it to its own file and link it here.
