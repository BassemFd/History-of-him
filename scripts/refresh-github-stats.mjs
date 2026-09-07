#!/usr/bin/env node
/**
 * Refreshes the `live` block of content/stats.json from the public GitHub API.
 *
 * Only touches live-fetched numbers — the `manual` array (e.g. the aggregate
 * production commit count) is left untouched.
 *
 * Usage:  node scripts/refresh-github-stats.mjs
 *
 * Auth is optional. Without a token you get the unauthenticated rate limit
 * (60 req/h) which is plenty here. To raise it, export GITHUB_TOKEN with a
 * token that has public read scope.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const USER = "BassemFd";
const __dirname = dirname(fileURLToPath(import.meta.url));
const STATS_PATH = join(__dirname, "..", "content", "stats.json");

const headers = {
  Accept: "application/vnd.github+json",
  "User-Agent": "porto-folie-stats",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function gh(path) {
  const res = await fetch(`https://api.github.com/${path}`, { headers });
  if (!res.ok) {
    throw new Error(`GitHub ${path} → ${res.status} ${res.statusText}`);
  }
  return res.json();
}

async function main() {
  const user = await gh(`users/${USER}`);
  const repos = await gh(`users/${USER}/repos?per_page=100`);
  const prs = await gh(
    `search/issues?q=${encodeURIComponent(`is:pr is:merged author:${USER}`)}`,
  );

  const totalStars = repos
    .filter((r) => !r.fork)
    .reduce((sum, r) => sum + (r.stargazers_count || 0), 0);

  const live = {
    publicRepos: user.public_repos,
    totalStars,
    mergedPRs: prs.total_count,
    followers: user.followers,
  };

  const stats = JSON.parse(await readFile(STATS_PATH, "utf8"));
  stats.live = live;
  stats.liveFetchedAt = new Date().toISOString();

  await writeFile(STATS_PATH, JSON.stringify(stats, null, 2) + "\n", "utf8");

  console.log("Updated content/stats.json live block:");
  console.log(JSON.stringify(live, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
