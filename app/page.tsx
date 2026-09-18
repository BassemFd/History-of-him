import Hero from "@/components/Hero";
import StatsSection from "@/components/StatsSection";
import ProjectsGrid from "@/components/ProjectsGrid";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import EducationSection from "@/components/EducationSection";
import { profile, projects, experience, stats, education, certifications } from "@/lib/content";

export default function Home() {
  return (
    <main>
      <Hero profile={profile} recent={projects.slice(0, 4)} />
      <ExperienceTimeline experience={experience} />
      <StatsSection stats={stats} />
      <ProjectsGrid projects={projects} />
      <EducationSection education={education} certifications={certifications} />

      <footer className="max-w-3xl px-6 py-10 lg:px-16">
        <p className="font-mono text-xs text-muted">
          Built with Next.js · content lives in <span className="text-ink">/content/*.json</span> ·{" "}
          <a
            href={profile.socials.github}
            className="underline decoration-rule underline-offset-4 hover:text-accent"
            target="_blank"
            rel="noreferrer"
          >
            source
          </a>
        </p>
      </footer>
    </main>
  );
}
