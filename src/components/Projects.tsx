"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Project, projects } from "../data/projects";

const PAGE_SIZE = 12;
const CATEGORIES = ["All", "Web App", "Data Visualization", "Tool", "Experiment", "Club Site", "Research", "Game"] as const;
type CategoryFilter = (typeof CATEGORIES)[number];

const orderedProjects = [...projects].sort((a, b) =>
  Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || a.title.localeCompare(b.title)
);

const normalizeAngle = (angle: number) => ((angle % 360) + 360) % 360;

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2">
      {project.appUrl && (
        <a href={project.appUrl} target="_blank" rel="noopener noreferrer"
          aria-label={`Open ${project.title} app (opens in a new tab)`}
          className="inline-flex min-h-10 items-center rounded-lg border border-accent/50 bg-accent/10 px-4 text-xs font-semibold text-accent transition hover:bg-accent hover:text-[#041008]">
          Open App
        </a>
      )}
      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
        aria-label={`View ${project.title} source code (opens in a new tab)`}
        className="inline-flex min-h-10 items-center rounded-lg border border-border bg-[#0b0b0b] px-4 text-xs font-semibold text-text transition hover:border-accent hover:text-accent">
        View Code
      </a>
    </div>
  );
}

export function Projects() {
  const [category, setCategory] = useState<CategoryFilter>("All");
  const [page, setPage] = useState(0);
  const [selectedTitle, setSelectedTitle] = useState(orderedProjects[0].title);
  const [rotation, setRotation] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(true);
  const [compact, setCompact] = useState(false);
  const orbitRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number; rotation: number; moved: boolean } | null>(null);
  const [dragging, setDragging] = useState(false);
  const hoverRef = useRef(false);
  const focusRef = useRef(false);
  const rotationRef = useRef(0);

  const filtered = useMemo(
    () => category === "All" ? orderedProjects : orderedProjects.filter((p) => p.category === category),
    [category]
  );
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = useMemo(() => filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE), [filtered, page]);
  const selectedProject = filtered.find((p) => p.title === selectedTitle) ?? visible[0] ?? orderedProjects[0];
  const selectedIndex = visible.findIndex((p) => p.title === selectedProject.title);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motion.matches);
    updateMotion();
    motion.addEventListener("change", updateMotion);
    return () => motion.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const target = orbitRef.current;
    if (!target) return;
    const observer = new ResizeObserver(([entry]) => setCompact(entry.contentRect.width < 490));
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (paused || reducedMotion || dragging) return;
    let frame = 0;
    let previous = 0;
    const tick = (now: number) => {
      if (previous && !hoverRef.current && !focusRef.current && !document.hidden) {
        rotationRef.current = normalizeAngle(rotationRef.current + Math.min(now - previous, 50) * 0.002);
        setRotation(rotationRef.current);
      }
      previous = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [paused, reducedMotion, dragging]);

  const changePage = (nextPage: number) => {
    const next = Math.max(0, Math.min(nextPage, pageCount - 1));
    setPage(next);
    setSelectedTitle(filtered[next * PAGE_SIZE]?.title ?? filtered[0].title);
    rotationRef.current = 0;
    setRotation(0);
  };

  const changeCategory = (next: CategoryFilter) => {
    setCategory(next);
    setPage(0);
    const nextProjects = next === "All" ? orderedProjects : orderedProjects.filter((p) => p.category === next);
    setSelectedTitle(nextProjects[0]?.title ?? orderedProjects[0].title);
    rotationRef.current = 0;
    setRotation(0);
  };

  const selectProject = (project: Project) => {
    setSelectedTitle(project.title);
    const index = visible.findIndex((item) => item.title === project.title);
    if (index >= 0) {
      // Move the selected node to the bottom, where it is least likely to obscure others.
      const angle = index * (360 / visible.length);
      rotationRef.current = normalizeAngle(180 - angle);
      setRotation(rotationRef.current);
    }
  };

  const activeOrbitIndex = selectedIndex >= 0 ? selectedIndex : 0;

  return (
    <section id="projects" className="py-16 sm:py-20">
      <SectionHeader eyebrow="<playground />" title="Project Playground" />
      <div className="mb-5 flex flex-wrap items-center gap-2" aria-label="Filter projects by category">
        {CATEGORIES.map((item) => {
          const count = item === "All" ? orderedProjects.length : orderedProjects.filter((p) => p.category === item).length;
          if (!count) return null;
          return (
            <button type="button" key={item} onClick={() => changeCategory(item)}
              aria-pressed={category === item}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                category === item
                  ? "border-accent/60 bg-accent/10 text-accent"
                  : "border-border bg-[#090b0c]/80 text-muted hover:border-accent/40 hover:text-text"
              }`}>
              {item} <span className="ml-1 opacity-60">{count}</span>
            </button>
          );
        })}
      </div>

      <div className="grid items-stretch gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="relative min-w-0 overflow-hidden rounded-[1.75rem] border border-border bg-[#050608]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(0,255,136,0.06),transparent_65%)]" />
          <div className="relative flex items-center justify-between gap-3 px-5 pt-5">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-muted">Project orbit</p>
              <p className="mt-1 text-xs text-muted">Showing {visible.length} of {filtered.length} projects</p>
            </div>
            <button type="button" disabled={reducedMotion} aria-pressed={paused}
              onClick={() => setPaused((p) => !p)}
              className="rounded-lg border border-border px-3 py-2 text-xs text-muted transition hover:border-accent/50 disabled:opacity-40">
              {reducedMotion ? "Motion off" : paused ? "Resume" : "Pause"}
            </button>
          </div>

          <div ref={orbitRef}
            className="relative mx-auto mt-2 h-[340px] w-full touch-pan-y select-none sm:h-[455px] lg:h-[465px]"
            onMouseEnter={() => { hoverRef.current = true; }}
            onMouseLeave={() => { hoverRef.current = false; }}
            onFocusCapture={() => { focusRef.current = true; }}
            onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) focusRef.current = false; }}
            onPointerDown={(e) => {
              if (e.button !== 0 || !e.isPrimary) return;
              dragRef.current = { x: e.clientX, y: e.clientY, rotation: rotationRef.current, moved: false };
            }}
            onPointerMove={(e) => {
              if (!dragRef.current) return;
              const dx = e.clientX - dragRef.current.x;
              const dy = e.clientY - dragRef.current.y;
              if (Math.hypot(dx, dy) < 8 && !dragRef.current.moved) return;
              dragRef.current.moved = true;
              if (!dragging) setDragging(true);
              rotationRef.current = normalizeAngle(dragRef.current.rotation + dx * 0.34);
              setRotation(rotationRef.current);
            }}
            onPointerUp={() => { dragRef.current = null; setDragging(false); }}
            onPointerCancel={() => { dragRef.current = null; setDragging(false); }}
          >
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(82vw,390px)] w-[min(82vw,390px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/10" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-[min(51vw,250px)] w-[min(51vw,250px)] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accentSecondary/10" />
            <div className="pointer-events-none absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20 bg-[#07120d] shadow-[0_0_55px_rgba(0,255,136,0.09)] sm:h-24 sm:w-24">
              <div className="flex h-full flex-col items-center justify-center">
                <span className="font-mono text-lg font-semibold text-accent">{filtered.length}</span>
                <span className="text-[9px] uppercase tracking-widest text-muted">projects</span>
              </div>
            </div>

            {visible.map((project, index) => {
              const angle = normalizeAngle(index * (360 / visible.length) + rotation);
              const radians = (angle * Math.PI) / 180;
              const isOuter = index % 2 === 0;
              const radius = compact ? (isOuter ? 134 : 92) : (isOuter ? 194 : 136);
              const x = Math.sin(radians) * radius;
              const y = Math.cos(radians) * radius;
              const active = index === activeOrbitIndex;
              return (
                <button key={project.title} type="button" title={project.title}
                  aria-label={`Select ${project.title}`} aria-pressed={active}
                  onClick={() => { if (!dragRef.current?.moved && !dragging) selectProject(project); }}
                  className={`absolute left-1/2 top-1/2 flex items-center justify-center rounded-full border transition-[border-color,background-color,box-shadow] duration-200 ${
                    active
                      ? "border-accent bg-[#123425] text-accent shadow-[0_0_22px_rgba(0,255,136,0.18)]"
                      : "border-[#304039] bg-[#101715] text-[#b2c0bb] hover:border-accent/60 hover:text-text"
                  }`}
                  style={{
                    width: compact ? 30 : 42,
                    height: compact ? 30 : 42,
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
                  }}>
                  <span className="font-mono text-[10px] font-medium">{String(page * PAGE_SIZE + index + 1).padStart(2, "0")}</span>
                </button>
              );
            })}
          </div>

          <div className="relative flex items-center justify-between gap-3 border-t border-border/70 px-5 py-4">
            <button type="button" onClick={() => changePage(page - 1)} disabled={page === 0}
              className="min-h-9 rounded-lg border border-border px-4 text-xs text-text transition hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-30">
              Previous
            </button>
            <div className="flex items-center gap-1.5" aria-label={`Page ${page + 1} of ${pageCount}`}>
              {Array.from({ length: pageCount }, (_, i) => (
                <button key={i} type="button" onClick={() => changePage(i)} aria-label={`Go to page ${i + 1}`}
                  aria-current={i === page ? "page" : undefined}
                  className={`h-2 rounded-full transition-all ${
                    i === page ? "w-5 bg-accent" : "w-2 bg-[#40504a] hover:bg-accent/60"
                  }`} />
              ))}
            </div>
            <button type="button" onClick={() => changePage(page + 1)} disabled={page === pageCount - 1}
              className="min-h-9 rounded-lg border border-border px-4 text-xs text-text transition hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-30">
              Next
            </button>
          </div>
        </div>

        <article className="flex min-w-0 flex-col rounded-[1.75rem] border border-border bg-surface/85 p-5 backdrop-blur sm:p-6">
          <label className="mb-5 block">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Jump to project</span>
            <select value={selectedProject.title}
              onChange={(e) => {
                const project = filtered.find((p) => p.title === e.target.value);
                if (!project) return;
                const index = filtered.indexOf(project);
                if (Math.floor(index / PAGE_SIZE) !== page) {
                  const nextPage = Math.floor(index / PAGE_SIZE);
                  setPage(nextPage);
                  rotationRef.current = 0;
                  setRotation(0);
                }
                setSelectedTitle(project.title);
              }}
              className="h-11 w-full rounded-xl border border-border bg-[#080808] px-3 text-sm text-text outline-none transition hover:border-accent focus:border-accent">
              {filtered.map((project, index) => (
                <option key={project.title} value={project.title}>
                  {String(index + 1).padStart(2, "0")} · {project.title}
                </option>
              ))}
            </select>
          </label>
          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">{selectedProject.category}</span>
            {selectedProject.featured && <span className="font-mono text-xs text-muted">featured</span>}
          </div>
          <h3 className="text-2xl font-semibold leading-tight text-text">{selectedProject.title}</h3>
          <p className="mt-4 text-sm leading-7 text-muted">{selectedProject.description}</p>
          <p className="mt-4 border-l border-accent/40 pl-3 text-sm leading-6 text-muted">{selectedProject.details[0]}</p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {selectedProject.tech.slice(0, 5).map((tag) => (
              <span key={tag} className="rounded-full border border-border bg-[#0b0b0b] px-2 py-0.5 text-[11px] text-muted">{tag}</span>
            ))}
          </div>
          <ProjectActions project={selectedProject} />
          <p className="mt-auto pt-8 font-mono text-[11px] text-muted">Select a numbered dot or jump directly to a project.</p>
        </article>
      </div>
    </section>
  );
}
