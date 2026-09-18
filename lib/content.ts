import profileData from "@/content/profile.json";
import projectsData from "@/content/projects.json";
import experienceData from "@/content/experience.json";
import statsData from "@/content/stats.json";
import educationData from "@/content/education.json";
import certificationsData from "@/content/certifications.json";
import type {
  Profile,
  Project,
  Experience,
  Stats,
  Education,
  Certification,
} from "./types";

export const profile = profileData as Profile;
export const stats = statsData as Stats;
export const education = educationData as Education[];
export const certifications = certificationsData as Certification[];

// Reverse-chronological, newest year first — the site reads as a `git log`, so
// the order must be strictly by date (no featured-first grouping, which would
// break the log metaphor by floating old work above recent work).
export const projects: Project[] = (projectsData as Project[])
  .slice()
  .sort((a, b) => b.year.localeCompare(a.year));

// Experience newest first: a live "present" role always leads, then the rest by
// end date descending. (Comparing raw date strings is unreliable — e.g. "Jun 2026"
// sorts above "9999" — so "present" is special-cased rather than mapped to a number.)
export const experience: Experience[] = (experienceData as Experience[])
  .slice()
  .sort((a, b) => {
    if (a.end === "present" && b.end !== "present") return -1;
    if (b.end === "present" && a.end !== "present") return 1;
    return b.end.localeCompare(a.end);
  });
