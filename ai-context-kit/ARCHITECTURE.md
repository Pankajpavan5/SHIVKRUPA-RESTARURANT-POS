# Architecture

## The one rule

**Everything is in one file: `index.html`.** No build step, no bundler, no dependencies. If a change adds a `node_modules/`, a `package.json`, or a server, it violates the architecture — write a DECISIONS.md entry first.

## File layout

```
pos-app/
└── index.html          # THE entire app. HTML + CSS + JS in one file.

ai-context-kit/         # Docs for AI agents (this folder)
├── PRD.md
├── ARCHITECTURE.md
├── AGENTS.md
├── TASKS.md
├── DECISIONS.md
├── types.js
├── env.example
└── README.md
```

That's it. Two things: the app and the context kit.

## Anatomy of `index.html`

The single file is organized top-to-bottom as if it had folders:

```
<style>           ← "core/theme" — all CSS, mobile-first, one dark-mode cascade
<header>          ← Persistent app bar (shop name, search, dark toggle, icons)
<nav>             ← (Removed — replaced by bottom-nav)
<section .page>*  ← "features/*/presentation" — one per bottom-nav tab
  #page-counter     — home (new order, expense, open tables)
  #page-reports     — KPIs + sales chart + top items
  #page-today       — unified bills + expenses log
  #page-more        — settings hub (grouped setting-items)
<div .modal-page>* ← Full-screen sub-pages opened from setting-items or actions
  #mp-tables, #mp-order, #mp-kot, #mp-shop, #mp-receipt,
  #mp-items, #mp-tblEdit, #mp-att, #mp-staff
<div .modal-bg>*   ← Small centered popups
  #sendModal, #historyModal, #expenseModal, #customerModal, #attDayModal
<div .drawer>     ← Slide-out side menu (☰)
<div .bottom-nav> ← Four tabs: Reports · Today · Counter · More
<script>          ← "data + domain + controllers" — see data flow below
```

## Data flow

There is no repository layer. There is no controller layer. Every screen reads directly from and writes directly to the single `state` object, then calls `save()`.

```
User action
   │
   ▼
handler() in <script>
   │  mutates state.*
   ▼
save()  ──► localStorage.setItem(LS_KEY, JSON.stringify(state))
   │        └► refreshHome()  (keeps header stats live)
   │        └► updateHints()  (keeps "More" hint text current)
   ▼
render*() rebuilds the current view from state
```

**Rules:**
- Never mutate `state` without calling `save()` immediately after.
- Never `render` from stale local variables — always read `state.*` fresh.
- Bills are the only *immutable* data: once `closeTable()` writes to `state.bills`, that entry is a snapshot and is never edited.

## Persistence

- **Storage:** `localStorage[LS_KEY]` — single JSON blob. Currently `quickpos_v5`.
- **Migration:** On load, an IIFE (`(function migrate(){...})()`) upgrades older shapes in-place. When the shape changes in a breaking way, bump the version number (`v5` → `v6`) and add a migration block.
- **Backup:** JSON export/import from More → Data. This is the only way to move data between devices.
- **Cap:** `state.bills` is trimmed to the last 500 entries on `closeTable()`.

## State object

See [`types.js`](./types.js) for the full shape. Root:

```
state = {
  shop, receiptSettings, categories, tables, menu, customers,
  bills, expenses, staff, attendance,
  activeTable, lastBillNo
}
```

## Rendering conventions

- Every visible page/modal has a `render<Name>()` function that produces its HTML from `state`.
- Pages re-render on demand, not reactively — no framework, no diffing. This is fine because the app is small and interactions are user-driven.
- **Full-screen modals** (`.modal-page`) are used for anything with its own header. **Small modals** (`.modal-bg`) are for confirms and quick pickers.

## External integrations

All "sends" go through the OS, never through third-party APIs:

| Channel | URL scheme |
|---|---|
| WhatsApp | `https://wa.me/<num>?text=<encoded>` |
| WhatsApp Business | `https://api.whatsapp.com/send?phone=<num>&text=<encoded>` |
| SMS | `sms:+<num>?body=<encoded>` |
| Print | `window.print()` — page has `@media print` styles |

## Where things go

| Thing | Location |
|---|---|
| New full-screen page | New `.modal-page` block in HTML + `render<Name>()` + `open<Name>()` in `<script>` |
| New setting-item | Add a `.setting-item` inside an existing `.setting-group` in `#page-more`, wire it to the opener |
| New data field | Add to `types.js`, add to default state, add migration, then use |
| New CSS | End of `<style>`; dark-mode overrides at the bottom of that block |
| New icon in header | `.h-icon` div in `<header>` |
| New drawer link | `.d-item` in `#drawer` |

## Boundaries

The single-file rule means there are no compile-time boundaries. The convention is:

- **Data:** `state.*` and its migrations
- **Domain:** pure functions — `calcTotals()`, `sortedOrder()`, `resizeImage()`, `dateKey()`, `calculateWagesForPeriod()`, `buildBillText()`, `buildKOTText()`, `buildTemplateMessage()`
- **UI/controllers:** `render*()`, `open*()`, `close*()`, event handlers

Keep pure functions pure. If you need a domain function to call `save()`, you've made it a controller — rename it.
