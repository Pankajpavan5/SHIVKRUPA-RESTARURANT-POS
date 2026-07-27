# Quick POS — PRD

**One-liner:** A zero-install, offline-first billing app for small Indian restaurants and cafes that turns a table tap into a WhatsApp-ready receipt in under 30 seconds.

**For:** Solo shopkeepers and small restaurant owners (1–3 staff, ~5–20 tables) who currently use paper ledgers or find apps like Zobaze too heavy. Primary target: tea shops, cafes, dhabas, small eateries in tier-2/3 Indian cities.

**Success looks like:** Owner can complete the full flow — pick table → add 3 items → send WhatsApp bill to customer — in under 30 seconds, without any login or internet connection (after first page load).

---

## In scope (v1)

- Take an order against a table (occupied/free visualization)
- Build a bill with items, quantities, discount, tax
- Send the bill via WhatsApp / SMS / print, or copy as text
- Attach a customer (name + mobile) to the bill and auto-track spend/visits
- Log daily expenses; see revenue, expenses, profit, top items in Reports
- Mark daily staff attendance (Present / Half / Absent) with auto-wage calculation
- Configure receipt: logo, GSTIN, thank-you note, MRP display, cashier, message template
- Print a Kitchen Order Ticket (KOT) with items only (no prices / customer info)

## Out of scope

- **User accounts / login** — single-device, single-shop app
- **Cloud sync / multi-device** — data lives in browser localStorage; backup is manual JSON export/import
- **Real-time Google/Outlook Calendar sync** — attendance uses device date only; no OAuth
- **Payment gateway integration** — bills are informational; cash/UPI is settled outside the app
- **Barcode scanning** (button exists but disabled — needs camera + HTTPS + native APIs)
- **Automated SMS gateway** — SMS/WhatsApp uses the phone's own app; no Twilio/MSG91
- **Inventory tracking / stock deduction** — parked for v2
- **Multi-language UI** — English only in v1
- **PWA installability with service worker** — works add-to-home-screen but no offline SW yet

> Non-negotiable: If a feature needs a server, a login, or a paid API, it belongs in v2. v1 must run from a double-clicked HTML file.

---

## Constraints

- **Platform:** Any modern browser (Chrome / Safari on phone, tablet, PC). Optimized for mobile-first, ~360px width up.
- **Offline:** Required. Works fully offline after first page load. All state in `localStorage`.
- **Auth:** None. Single-device trust model.
- **Data:** Local only. JSON export/import for backup and device transfer.
- **Deadline:** None — iterative delivery per user request.

## Non-negotiables

- **Single-file deliverable.** One `index.html` — no build step, no dependencies, no npm install. Double-click to run.
- **No backend, ever, in v1.** The moment a server is needed, it becomes a different product.
- **Works with zero setup.** No accounts, no config wizard, no first-run flow beyond default seed data.
- **All send/share goes through the phone's own apps** (`sms:`, `wa.me/`, `api.whatsapp.com`). No third-party messaging APIs.
- **Images are compressed on capture** to ≤240px JPEG (~75% quality) to protect the 5MB localStorage budget.

---

## Open questions

- [ ] Should closed bill history be capped at 500 entries (current default) or made configurable per shop size?
- [ ] Bluetooth thermal printer support via Web Bluetooth — worth the browser-compat complexity, or is `window.print()` enough?
- [ ] Should staff wages count toward Reports "Expenses" automatically (current behaviour) or be shown as a separate line?
- [ ] PIN lock on app open — needed for shared-device use, or does it add friction the target user doesn't want?
