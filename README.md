# porto-folie

Personal developer portfolio for **Bassem Fayed** — a Next.js site that presents
projects, GitHub stats, and career history as a continuous *commit log*.

No database, no admin panel, no login. **All content is JSON in `/content`.** You
update the site by editing a file and pushing to git; Vercel redeploys automatically.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build (run before deploying)
```

## The content model

| File                      | What it holds                                             |
| ------------------------- | -------------------------------------------------------- |
| `content/profile.json`    | Name, tagline, summary, location, social links.          |
| `content/projects.json`   | The "Work log" — every featured project.                 |
| `content/experience.json` | The "Releases" — career/employment history.              |
| `content/stats.json`      | Headline numbers (manual + live-fetched — see below).    |

Types for all of these live in `lib/types.ts`.

## How to add a new project

1. Open `content/projects.json` and copy an existing object.
2. Edit the fields:

   ```json
   {
     "slug": "my-new-thing",              // unique id, kebab-case
     "title": "My New Thing",
     "blurb": "One or two sentences on what it does.",
     "role": "owner",                     // "owner" | "contributor"
     "stack": ["TypeScript", "Next.js"],
     "year": "2026",
     "links": { "github": "https://github.com/BassemFd/...", "live": null },
     "featured": true,                    // true = shows first, at the top
     "category": "personal"               // "personal" | "client" | "dojo"
   }
   ```

3. Commit and push:

   ```bash
   git add content/projects.json
   git commit -m "feat(content): add my-new-thing"
   git push
   ```

That's it — Vercel rebuilds and the new card appears. Same flow for
`experience.json` (career) and `profile.json` (bio/links).

## Stats: manual vs live

`content/stats.json` deliberately separates two kinds of numbers:

- **`manual`** — numbers you record by hand, e.g. the aggregate
  `976+ commits in production systems`. These come from **private employer
  codebases** that cannot be fetched via the public API, so they never go stale
  on their own — you edit them when they change. No private repo is named or linked.
- **`live`** — pulled from the public GitHub API for `BassemFd`. Refresh them with:

  ```bash
  npm run refresh-stats
  ```

  This rewrites only the `live` block and the `liveFetchedAt` timestamp, then you
  commit the change. The UI shows the fetch date so freshness is honest.

  Live numbers and their source:
  | Stat                 | GitHub API call                                            |
  | -------------------- | ---------------------------------------------------------- |
  | Public repositories  | `GET /users/BassemFd` → `public_repos`                     |
  | Followers            | `GET /users/BassemFd` → `followers`                        |
  | Stars earned         | sum of `stargazers_count` over non-fork repos              |
  | Pull requests merged | `GET /search/issues?q=is:pr is:merged author:BassemFd`     |

  > Note: GitHub's public API does **not** expose a lifetime total-commit count
  > across repos, so the site does not claim one as a "live" figure. The large
  > commit number is the manually-recorded production aggregate.

## Deploy

1. Push to `https://github.com/BassemFd/porto-folie`.
2. Import the repo on [Vercel](https://vercel.com/new) — it auto-detects Next.js.
3. Deploy. Add a custom domain later if you want.

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · deployed on Vercel.
