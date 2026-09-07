import profileData from "@/content/profile.json";
import projectsData from "@/content/projects.json";
import experienceData from "@/content/experience.json";
import statsData from "@/content/stats.json";
import type { Profile, Project, Experience, Stats } from "./types";

export const profile = profileData as Profile;
export const stats = statsData as Stats;

// Featured projects first, then by year descending.
export const projects: Project[] = (projectsData as Project[])
  .slice()
  .sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    return b.year.localeCompare(a.year);
  });

// Experience newest first (entries with "present" float to the top).
export const experience: Experience[] = (experienceData as Experience[])
  .slice()
  .sort((a, b) => {
    const rank = (v: string) => (v === "present" ? "9999" : v);
    return rank(b.end).localeCompare(rank(a.end));
  });
