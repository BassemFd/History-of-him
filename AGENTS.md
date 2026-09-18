# AGENTS.md

Operating guide for AI agents working in this repo. Read this before editing.
For the human-facing narrative, see `README.md` — this file does not repeat it.

## What this is

A content-driven Next.js (App Router) portfolio for Bassem Fayed, deployed to
Cloudflare Workers via vinext. No database, no admin, no login. **Content is JSON
in `/content`.** You change the site by editing a file, committing, and running
`npm run deploy`. Most changes are data, not code.

## The core loop

1. Edit the relevant file (usually one in `/content`).
2. Run `npm run build` — it **must pass** before you commit.
3. Commit with a Conventional Commit message.
4. Push to `main`, then run `npm run deploy` to publish to Cloudflare
   Workers. There is no deploy-on-push automation.

## Content model — where things live

| File                      | Holds                                                       |
| ------------------------- | ----------------------------------------------------------- |
| `content/profile.json`    | Name, tagline, summary, location, social links.             |
| `content/projects.json`   | The "Work log" — featured + other projects.                 |
| `content/experience.json` | Career / employment history.                                |
| `content/stats.json`      | Headline numbers — `manual` + `live` (see Stats rule).      |

- **Types** for all content live in `lib/types.ts`. Match them exactly; extend the
  interface there rather than adding untyped fields.
- **Derivation is already done** in `lib/content.ts` (projects sort strictly
  reverse-chronological by year — the site reads as a `git log`, so no
  featured-first grouping; experience sorts newest-first, `present` floats to top).
  Don't re-sort in components.
- `lib/hash.ts` `shortHash()` produces the cosmetic git-style short SHA shown in the
  UI. It's deterministic and non-cryptographic — reuse it, don't reinvent it.

## 🛑 Confidentiality boundary

- The public GitHub identity is **`BassemFd`**. Live stats are fetched from that
  public account only.
- **Never name, link, or expose private employer codebases.** Concretely:
  - Experience entries from private/employer work stay `confidential: true`.
  - The aggregate production commit number is a `manual` stat with **no repo named
    or linked**.
- When in doubt, leave it out. Do not surface a client/employer name, private repo
  URL, or internal project detail that isn't already public.

## Stats rule — `manual` vs `live`

`content/stats.json` has two deliberately separate blocks:

- **`manual`** — hand-recorded numbers (e.g. the production commit aggregate). Edit
  these by hand when they change.
- **`live`** — pulled from the public GitHub API. **Only ever rewritten by**
  `npm run refresh-stats`, which updates the `live` block and `liveFetchedAt` and
  nothing else, then you commit the result.

Rules:
- Never hand-edit the `live` block — run the script.
- Never invent a "live total commits" figure: the public API doesn't expose a
  lifetime cross-repo commit count, so the site never claims one as live.
- `refresh-stats` is a **local** script. It is **not** part of the build —
  `npm run build` just builds the committed JSON. Don't wire it into CI expecting a
  deploy-time refresh.
- The `activity` block (contribution-type breakdown: PRs / reviews / commits /
  issues) is **manual and cannot be fetched live.** GitHub's API lumps all private
  contributions into an untyped `restrictedContributionsCount` and never exposes
  the per-type split, so the real breakdown (which is mostly private work) is only
  visible on the signed-in profile page. Update it by hand; do not try to automate it.

## Code standards

- **TypeScript** `strict` is on. No `any`. Add/extend interfaces in `lib/types.ts`.
- **Styling** is Tailwind using the **design tokens only** — colors `paper`, `card`,
  `ink`, `rule`, `muted`, `accent`, `accent-soft`, and font families `display` /
  `sans` / `mono` (see `tailwind.config.ts`). No raw hex, no arbitrary `[...]`
  values unless genuinely unavoidable.
- **Imports** use the `@/*` alias (e.g. `@/content/projects.json`,
  `@/lib/types`), not deep relative paths.
- **Components** are server components by default (App Router). Keep them
  presentational; content flows in from `lib/content.ts`.

## Commit conventions

[Conventional Commits v1.0.0](https://www.conventionalcommits.org/en/v1.0.0/).
Imperative, lowercase, no trailing period.

```
feat(content): add my-new-thing
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`,
`chore`, `revert`. Common scopes: `content`, `ui`, `stats`, `build`.

## Definition of done

- `npm run build` passes locally.
- The `live` stats block was changed **only** via `refresh-stats` (or not at all).
- No confidential employer/client source named or linked.
- Committed with a Conventional Commit message, pushed to `main`, and deployed
  with `npm run deploy`.
