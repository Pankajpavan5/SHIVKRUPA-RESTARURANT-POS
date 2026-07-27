# AI Context Kit — Quick POS

Filled-in context for the **Quick POS** project — a zero-install, offline-first billing app for small Indian restaurants and cafes. One HTML file, no backend, no dependencies.

## Where the app lives

```
../pos-app/index.html   ← the entire app
```

## Files in this kit

Read in this order for context on the project:

1. **[PRD.md](./PRD.md)** — What we're building, who for, what's out of scope. Start here.
2. **[types.js](./types.js)** — The `state` object shape. All data lives inside it. Read before touching any feature.
3. **[ARCHITECTURE.md](./ARCHITECTURE.md)** — How the single file is organized internally, data flow, where things go.
4. **[AGENTS.md](./AGENTS.md)** — Rules for AI agents working in this codebase. Read before writing code.
5. **[TASKS.md](./TASKS.md)** — What's done, what's next in the backlog. Point the AI at one numbered task.
6. **[DECISIONS.md](./DECISIONS.md)** — Why things are the way they are. Read before "improving" anything.
7. **[env.example](./env.example)** — Deliberately empty; explains why.

## The gold-standard file

**`../pos-app/index.html`** is the single source of truth for style, structure, and conventions. Match it. It is long but internally consistent — CSS class naming, JS function naming, comment density, emoji-icon usage, dark-mode overrides, all follow one house style.

An AI matches patterns far more reliably than it follows written style rules. When in doubt, `grep` the existing file.

## Non-negotiables (from PRD)

Do not violate these without an explicit DECISIONS.md entry:

- **One file.** Everything in `pos-app/index.html`.
- **No backend.** All storage is `localStorage`; all send/share goes through the phone's own apps.
- **No dependencies.** No npm, no bundler, no CDN scripts.
- **No accounts.** Single-device trust model.
- **Works offline** after first load.

## When adding a feature

1. Check TASKS.md — is it already listed? If not, is it in scope per PRD?
2. Read the relevant section of `pos-app/index.html` — match its style.
3. If the feature needs a new data field, update `types.js` first.
4. If it requires a schema-breaking change, bump `LS_KEY` and add a migration.
5. If it violates a non-negotiable, write a DECISIONS.md entry first — or reject it.

## Keeping this kit useful

- **Short beats complete.** These files are already tight — keep them that way.
- **Update as you go.** A stale ARCHITECTURE.md is worse than none — the AI will follow it confidently in the wrong direction.
- **When a DECISIONS entry becomes wrong,** don't delete it — add a new dated entry that supersedes it.
