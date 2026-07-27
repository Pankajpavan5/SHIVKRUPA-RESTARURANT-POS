# Tasks

How to use this: point the AI at one numbered task per session.
"Do 4.2" — not "add printer support".

A task is too big if you can't describe it in one line.

**Status:** `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked

---

## 1. Foundation

- [x] 1.1 Single-file `index.html` scaffold with mobile-first CSS
- [x] 1.2 `state` object + `save()` / `load()` via localStorage
- [x] 1.3 Bottom-nav tab structure (Counter / Reports / Today / More)
- [x] 1.4 Full-screen modal-page pattern with back button
- [x] 1.5 Side drawer navigation (☰)

## 2. Order flow

- [x] 2.1 Tables grid — occupied vs free visualization
- [x] 2.2 Menu picker with category chips + search
- [x] 2.3 Add item → quantity increments on repeat tap
- [x] 2.4 Bill view with live totals (subtotal, tax, discount, grand)
- [x] 2.5 Discount as flat ₹ or percent %
- [x] 2.6 Close table → append to `state.bills`, clear table
- [x] 2.7 Quantity +/− controls in bill view (auto-remove at 0)

## 3. Sending & printing

- [x] 3.1 WhatsApp send via `wa.me/<num>?text=`
- [x] 3.2 SMS send via `sms:+<num>?body=`
- [x] 3.3 Copy-to-clipboard fallback
- [x] 3.4 `window.print()` with `@media print` CSS
- [x] 3.5 KOT (Kitchen Order Ticket) — items only, no prices/customer
- [x] 3.6 KOT send: print / WhatsApp / copy
- [x] 3.7 WhatsApp Business preference (`api.whatsapp.com`)
- [x] 3.8 Message template with `#TOTAL`, `#BILL`, `#SHOP` placeholders

## 4. Reports & history

- [x] 4.1 Today's Log — unified bills + expenses timeline, searchable
- [x] 4.2 Reports KPIs: Revenue, Expenses, Net Profit, Customers/Avg Bill
- [x] 4.3 Period filter: Today / Week / Month / All
- [x] 4.4 Top-10 selling items list
- [x] 4.5 SVG sales-trend bar chart (7 or 30 days)
- [x] 4.6 Bill history — tap to view detail
- [x] 4.7 Resend old bill via WhatsApp/SMS

## 5. Customers

- [x] 5.1 Add customer with name + mobile
- [x] 5.2 Attach customer to active order (bar at top of order screen)
- [x] 5.3 Auto-fill customer's phone in WhatsApp/SMS send
- [x] 5.4 Auto-track `totalSpent`, `visitCount`, `lastVisit` on bill close
- [x] 5.5 Duplicate-phone detection
- [x] 5.6 Edit / delete customer via prompt

## 6. Catalog

- [x] 6.1 Categories editor (name, image, add, delete, rename cascade)
- [x] 6.2 Menu editor (name, price, MRP, category, image)
- [x] 6.3 Image upload with auto-resize to 240px JPEG q0.75
- [x] 6.4 Category chips + search show item images
- [x] 6.5 Tables editor (rename, add, delete)

## 7. Expenses & staff

- [x] 7.1 Add expense — note, amount, category
- [x] 7.2 Expenses flow into Reports "Expenses" KPI
- [x] 7.3 Staff CRUD (name, role, daily wage)
- [x] 7.4 Attendance calendar UI (month grid, prev/next, jump)
- [x] 7.5 Mark day as Present / Half / Absent per staff
- [x] 7.6 Monthly summary (P / H / A / wages) at top of calendar
- [x] 7.7 Wages auto-add to Reports Expenses

## 8. Receipt settings

- [x] 8.1 Business info (name, phone, address, GSTIN, website)
- [x] 8.2 Per-field "Show in Receipt" toggles
- [x] 8.3 Logo upload + "Show Logo (Beta)" toggle
- [x] 8.4 Display toggles (MRP, rate, saved, cashier, item count, etc.)
- [x] 8.5 Item ordering (added order vs name A-Z)
- [x] 8.6 Thank-you note
- [x] 8.7 Message template + WhatsApp app choice

## 9. Polish

- [x] 9.1 Dark mode with persisted preference
- [x] 9.2 Live "Today's earnings" in header
- [x] 9.3 Open-tables mini-list on home
- [x] 9.4 Quick "I want to sell..." search from home → adds to active table
- [x] 9.5 JSON export/import backup

---

## Backlog

Prioritized. Pick top-of-list unless the user asks for something else.

- [ ] 10.1 PWA installability — `manifest.json` + minimal service worker for true offline
- [ ] 10.2 Bluetooth thermal printer via Web Bluetooth (58mm/80mm ESC/POS)
- [ ] 10.3 Barcode scanning — enable the camera button using `BarcodeDetector` (Chromium)
- [ ] 10.4 Hour-of-day sales heatmap (find peak hours)
- [ ] 10.5 Loyalty points — auto-award ₹1 per ₹100, redeem on next bill
- [ ] 10.6 PIN lock on app open (4-digit, stored hashed)
- [ ] 10.7 Multi-language UI (Hindi, Marathi, Tamil) — string table + switcher
- [ ] 10.8 Multi-shop switcher (multiple localStorage namespaces on one device)
- [ ] 10.9 Custom bill footer (Instagram handle, review link)
- [ ] 10.10 Split bill (by person or by amount)
- [ ] 10.11 Service charge line (separate from tax)
- [ ] 10.12 Inventory tracking (auto-deduct stock, low-stock alert)

## Blocked

- [!] Google Calendar sync — needs backend + OAuth. Rejected in DECISIONS.md 2026-07-27.

## Parked

Things deliberately deferred. Not forgotten, not being built.

- Real cloud sync / multi-device — revisit after v1 has a paying user asking for it
- Payment gateway (Razorpay, UPI deep-links) — belongs in v2
- Automated SMS gateway (Twilio, MSG91) — v1 uses the phone's own SMS app
