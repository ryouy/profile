"use client";

import { useMemo, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Project, projects } from "../data/projects";

type Category = Project["category"] | "All";
const categories: Category[] = [
  "All", "Web App", "Game", "Tool", "Data Visualization", "Experiment", "Research", "Club Site"
];
const sortedProjects = [...projects].sort(
  (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.title.localeCompare(b.title)
);

function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="group flex h-full min-w-0 flex-col rounded-2xl border border-border bg-[#0b1011]/90 p-5 transition-colors duration-200 hover:border-accent/40 hover:bg-[#101819] sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span className="rounded-full border border-accent/20 bg-accent/5 px-2.5 py-1 font-mono text-[11px] text-accent">
          {project.category}
        </span>
        {project.featured && <span className="font-mono text-[10px] uppercase tracking-wider text-muted">Featured</span>}
      </div>

      <h3 className="break-words text-lg font-semibold leading-snug text-text sm:text-xl">
        {project.title}
      </h3>
      <p className="mt-3 text-sm leading-6 text-muted">{project.description}</p>
      <div className="mt-4 flex flex-wrap gap-1.5">
        {project.tech.slice(0, 4).map((tag) => (
          <span key={tag} className="rounded-md border border-border/80 bg-black/20 px-2 py-1 text-[11px] text-muted">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto flex flex-wrap gap-2 border-t border-border/70 pt-5" style={{ marginTop: "auto" }}>
        {project.appUrl && (
          <a href={project.appUrl} target="_blank" rel="noopener noreferrer"
            aria-label={`Open ${project.title} app in a new tab`}
            className="inline-flex min-h-9 items-center rounded-lg border border-accent/40 bg-accent/10 px-3 text-xs font-semibold text-accent transition-colors hover:bg-accent/20">
            Open App
          </a>
        )}
        {project.appStoreUrl && (
          <a href={project.appStoreUrl} target="_blank" rel="noopener noreferrer"
            aria-label={`Open ${project.title} on App Store in a new tab`}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-[#171d20] px-3 text-xs font-semibold text-text transition-colors hover:border-accentSecondary/70">
            <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M17.05 12.54c.02 2.14 1.89 2.85 1.91 2.86-.02.05-.3 1.03-.99 2.03-.6.87-1.23 1.73-2.22 1.75-.97.02-1.28-.57-2.39-.57-1.1 0-1.45.55-2.37.59-.96.04-1.68-.95-2.28-1.81-1.24-1.78-2.18-5.02-.91-7.22a3.53 3.53 0 0 1 2.99-1.81c.93-.02 1.81.64 2.39.64.58 0 1.67-.79 2.82-.67.48.02 1.83.19 2.7 1.47-.07.05-1.61.94-1.59 2.74Zm-2.8-5.34a4.56 4.56 0 0 0 1.04-3.33 4.5 4.5 0 0 0-2.97 1.58 4.31 4.31 0 0 0-1.06 3.22 3.75 3.75 0 0 0 2.99-1.47Z"/>
            </svg>
            App Store
          </a>
        )}
        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
          aria-label={`View ${project.title} source code in a new tab`}
          className="inline-flex min-h-9 items-center rounded-lg border border-border bg-[#101315] px-3 text-xs font-semibold text-text transition-colors hover:border-accent/50">
          GitHub
        </a>
      </div>
    </article>
  );
}

export function Projects() {
  const [category, setCategory] = useState<Category>("All");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return sortedProjects.filter((project) => {
      if (category !== "All" && project.category !== category) return false;
      if (!term) return true;
      return [project.title, project.description, project.category, ...project.tech]
        .some((text) => text.toLowerCase().includes(term));
    });
  }, [category, search]);

  return (
    <section id="projects" className="py-16 sm:py-20">
      <SectionHeader eyebrow="<projects />" title="List" />
      <p className="mb-6 max-w-2xl text-sm leading-7 text-muted">
        A collection of {projects.length} apps, tools, games, and experiments.
      </p>

      <div className="mb-6 flex flex-col gap-4">
        <label className="block">
          <span className="sr-only">Search projects</span>
          <input type="search" value={search} onChange={(event) => setSearch(event.target.value)}
            placeholder="Search projects or technologies..."
            className="h-11 w-full max-w-lg rounded-xl border border-border bg-[#0a1011]/90 px-4 text-sm text-text placeholder:text-muted/70 outline-none transition-colors focus:border-accent" />
        </label>
        <div className="flex flex-wrap gap-2" aria-label="Filter projects">
          {categories.map((item) => {
            const count = item === "All" ? projects.length : projects.filter((p) => p.category === item).length;
            return (
              <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === item
                    ? "border-accent/60 bg-accent/10 text-accent"
                    : "border-border bg-[#0b1011]/80 text-muted hover:border-accent/40 hover:text-text"
                }`}>
                {item} <span className="ml-1 opacity-60">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      <p className="mb-4 font-mono text-xs text-muted" aria-live="polite">
        Showing {filtered.length} of {projects.length} projects
      </p>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 sm:gap-5">
          {filtered.map((project) => <ProjectCard key={project.githubUrl + project.title} project={project} />)}
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-[#0b1011] px-5 py-12 text-center">
          <p className="text-sm text-text">No matching projects.</p>
          <button type="button" onClick={() => { setSearch(""); setCategory("All"); }}
            className="mt-4 rounded-lg border border-accent/40 px-4 py-2 text-xs text-accent hover:bg-accent/10">
            Clear filters
          </button>
        </div>
      )}
    </section>
  );
}
