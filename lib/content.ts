import profileData from "@/content/profile.json";
import projectsData from "@/content/projects.json";
import experienceData from "@/content/experience.json";
import statsData from "@/content/stats.json";
import educationData from "@/content/education.json";
import certificationsData from "@/content/certifications.json";
import profileFrData from "@/content/fr/profile.json";
import projectsFrData from "@/content/fr/projects.json";
import experienceFrData from "@/content/fr/experience.json";
import statsFrData from "@/content/fr/stats.json";
import educationFrData from "@/content/fr/education.json";
import certificationsFrData from "@/content/fr/certifications.json";
import type {
  Profile,
  Project,
  Experience,
  Stats,
  Education,
  Certification,
} from "./types";

// Reverse-chronological, newest year first — the site reads as a `git log`, so
// the order must be strictly by date (no featured-first grouping, which would
// break the log metaphor by floating old work above recent work).
function sortProjects(list: Project[]): Project[] {
  return list.slice().sort((a, b) => b.year.localeCompare(a.year));
}

// Experience newest first: a live "present" role always leads, then the rest by
// end date descending. (Comparing raw date strings is unreliable — e.g. "Jun 2026"
// sorts above "9999" — so "present" is special-cased rather than mapped to a number.
// The "present" sentinel itself is never translated in content/fr — only its
// display label is — so this comparison works identically in both locales.)
function sortExperience(list: Experience[]): Experience[] {
  return list.slice().sort((a, b) => {
    if (a.end === "present" && b.end !== "present") return -1;
    if (b.end === "present" && a.end !== "present") return 1;
    return b.end.localeCompare(a.end);
  });
}

export const profile = profileData as Profile;
export const stats = statsData as Stats;
export const education = educationData as Education[];
export const certifications = certificationsData as Certification[];
export const projects = sortProjects(projectsData as Project[]);
export const experience = sortExperience(experienceData as Experience[]);

export type LocaleContent = {
  profile: Profile;
  projects: Project[];
  experience: Experience[];
  stats: Stats;
  education: Education[];
  certifications: Certification[];
};

export const contentByLocale: { en: LocaleContent; fr: LocaleContent } = {
  en: { profile, projects, experience, stats, education, certifications },
  fr: {
    profile: profileFrData as Profile,
    projects: sortProjects(projectsFrData as Project[]),
    experience: sortExperience(experienceFrData as Experience[]),
    stats: statsFrData as Stats,
    education: educationFrData as Education[],
    certifications: certificationsFrData as Certification[],
  },
};
