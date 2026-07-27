# Decisions

Why things are the way they are. Newest at the top.

Write an entry when you make a choice someone (including the AI, including future you) might reasonably want to undo. This is what stops an AI from helpfully "fixing" something you did on purpose.

---

## 2026-07-27 — Dark mode via CSS-cascade override, not CSS variables

**Decision:** Dark mode is a single `body.dark { ... }` block at the end of the stylesheet that overrides specific colors on named selectors.

**Why:** The stylesheet already had ~150 hardcoded colors when dark mode was requested. Converting each to a `var(--x)` would have touched every rule in the file (~600 lines of CSS) — high risk of visual regressions, hard to review as a diff. A cascade override adds ~50 lines and is a strictly additive change.

**Rejected:** CSS custom properties (`--bg`, `--fg`, etc.). Would be cleaner long-term, but the migration cost outweighed the payoff for a project this size.

**Revisit if:** the app grows a second theme (e.g. high-contrast, sepia), or dark-mode overrides balloon past ~120 lines.

---

## 2026-07-27 — "Internet calendar data" = device date, not Google Calendar

**Decision:** Staff attendance uses the browser's `Date` object only. Attendance is stored as `{ 'yyyy-mm-dd': { staffId: 'P'|'H'|'A' } }` in localStorage.

**Why:** Real Google/Outlook/Apple Calendar integration needs OAuth 2.0, a backend to hold the client secret, and per-user tokens. All three violate the "single HTML file, no backend, no accounts" non-negotiable in the PRD.

**Rejected:** Google Calendar API (needs backend + OAuth), CalDAV (browser CORS restrictions), Google's `gapi` client library (needs a Google Cloud project per user — impossible for a distributed HTML file).

**Revisit if:** the app moves to a hosted web version with real accounts.

---

## 2026-07-27 — Items tab merged into More; nav goes 5 → 4 tabs

**Decision:** Dropped the standalone Items bottom-nav tab. Menu editing lives inside More → Menu Items & Categories, opened as a full-screen modal-page.

**Why:** Bottom-nav real estate is scarce on 360px screens. Items were only edited during setup or rare menu changes; putting them in the daily nav wasted a slot. Reports · Today · Counter · More matches Zobaze's mental model users are already used to.

**Rejected:** Keeping 5 tabs. Would have forced smaller tap targets or a scroll indicator.

**Revisit if:** a user reports friction accessing item editing during daily use (unlikely — most shops set items once).

---

## 2026-07-27 — Category is referenced by NAME, not by ID

**Decision:** `MenuItem.cat` stores the category's *name* string, not its `id`. Renames cascade via `renameCat()` which walks all menu items.

**Why:** This was already established before categories had IDs. Migrating to ID references would require rewriting every render path that filters by category, plus a data migration. The rename cascade is O(n) but n is small (dozens of items).

**Rejected:** Refactoring to ID references. Cleaner but not worth the churn given how small the data is.

**Revisit if:** menu grows past ~500 items OR we add drag-to-reorder categories (which would benefit from stable IDs).

---

## 2026-07-27 — Bills are immutable snapshots, not live references

**Decision:** When `closeTable()` fires, it deep-clones `t.order` and snapshots `taxPct`, `discount`, and customer info into the new `Bill` entry.

**Why:** Menu prices, tax rates, and customer names can change after a bill is closed. Historical bills must show what was actually charged, not what the current values would produce. Re-sending an old bill from history must yield the exact same text as the original.

**Rejected:** Storing references (menu item IDs, tax rate ID). Would have made history queries lie — a 5% tax bill from January would recompute at today's 12% GST.

**Revisit if:** we add editable historical bills (needs a full audit-log rethink).

---

## 2026-07-27 — Images compressed to 240px JPEG q0.75 at upload

**Decision:** Every image (menu, category, logo) is drawn onto a canvas, capped at 240px on the longest edge, and exported as `image/jpeg` at quality 0.75. Original files are discarded.

**Why:** `localStorage` has a 5MB per-origin cap. A modern phone photo is 3–8MB — a single unresized upload can blow the entire budget. Menu thumbnails are displayed at ~150px CSS width, so 240px source is 2× and looks crisp. JPEG q0.75 handles food photos well.

**Rejected:** IndexedDB (larger quota, but adds async complexity and a schema layer for zero user-visible benefit). PNG (2–4× larger than JPEG for photographic content).

**Revisit if:** users start uploading transparent logos where JPEG artifacts matter, OR we move off localStorage.

---

## 2026-07-27 — All send/share goes through the phone, not a gateway

**Decision:** WhatsApp uses `wa.me/<num>?text=` (or `api.whatsapp.com/send` for WhatsApp Business preference). SMS uses `sms:+<num>?body=`. Both open the user's own app.

**Why:** Third-party gateways (Twilio, MSG91, WATI) cost per-message, require accounts, need a server to hold API keys, and impose approval flows. The target user is a solo shopkeeper — friction and cost both kill adoption. The user's own WhatsApp already has the customer's history, delivery receipts, and blue ticks for free.

**Rejected:** Twilio Programmable Messaging (per-msg cost, backend needed), MSG91 (same), WATI (₹2k+/month, template approval).

**Revisit if:** a user needs unattended/scheduled sends (marketing campaigns, reminders). That's a v2 product, not a v1 feature.

---

## 2026-07-27 — Single HTML file, no build step, no dependencies

**Decision:** Everything lives in one `index.html`. No npm, no bundler, no framework, no CDN.

**Why:** Target user is a small-shop owner who will download the file over WhatsApp, double-click it, and expect it to work. Any install step (Play Store, App Store, `npm install`, "enable Developer Mode") loses 80%+ of the audience. Zero-dep also means zero supply-chain risk, zero version-drift, zero "update the framework" chores.

**Rejected:**
- React / Vue / Svelte — needs a build; framework churn will outlive us.
- Flutter web — 2–5MB payload for a form-heavy app, and a compile step.
- Firebase Hosting + PWA — adds a Google account dependency and a domain to renew.

**Revisit if:** we need multi-device sync (which will force a backend anyway). At that point rebuild as a proper web app.

---

## 2026-07-27 — Local storage only, no backend

**Decision:** All data stays on the device in `localStorage`. Backup is manual JSON export/import.

**Why:** No accounts to manage, no privacy policy needed, no hosting cost, no data-loss-on-server-outage. A backend is the fastest way to turn a free tool into an unfunded liability. See also: `wa.me` decision above — same reasoning.

**Rejected:** Firebase Firestore (locks the data shape early, per-read cost at scale, needs auth). Supabase (same shape). PouchDB with CouchDB sync (nice API, but still needs a server to sync *to*).

**Revisit if:** users start asking for multi-device access, staff accounts with permissions, or automated backups. All three simultaneously = v2.
