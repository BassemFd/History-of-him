export interface Profile {
  name: string;
  tagline: string;
  summary: string;
  location: string;
  socials: {
    github: string;
    linkedin: string;
    email: string;
  };
}

export type ProjectRole = "owner" | "contributor";
export type ProjectCategory = "personal" | "dojo" | "client";

export interface Project {
  slug: string;
  title: string;
  blurb: string;
  role: ProjectRole;
  stack: string[];
  year: string;
  links: {
    github: string | null;
    live: string | null;
  };
  featured: boolean;
  category: ProjectCategory;
}

export interface Experience {
  company: string;
  role: string;
  start: string;
  end: string;
  location: string;
  summary: string;
  stack: string[];
  confidential: boolean;
}

export interface ManualStat {
  label: string;
  value: string;
  note: string;
  source: "manual";
}

export interface LiveStats {
  publicRepos: number;
  totalStars: number;
  mergedPRs: number;
  followers: number;
}

export interface Stats {
  manual: ManualStat[];
  liveFetchedAt: string;
  live: LiveStats;
}
