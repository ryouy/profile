"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Project, projects } from "../data/projects";

const normalizeAngle = (angle: number) => {
  const normalized = ((angle % 360) + 360) % 360;
  return normalized > 180 ? normalized - 360 : normalized;
};

const stepAngle = 360 / projects.length;

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {project.appUrl ? (
        <a
          href={project.appUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-accent/50 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent hover:text-[#041008]"
        >
          Open App
        </a>
      ) : null}
      <a
        href={project.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex min-h-9 items-center justify-center rounded-lg border border-border bg-[#0b0b0b] px-3 py-1.5 text-xs font-semibold text-text transition hover:border-accent hover:text-accent"
      >
        View Code
      </a>
    </div>
  );
}

function TechTags({ tech }: { tech: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {tech.slice(0, 5).map((tag) => (
        <span key={tag} className="rounded-full border border-border bg-[#0b0b0b] px-2 py-0.5 text-[11px] text-muted">
          {tag}
        </span>
      ))}
    </div>
  );
}

export function Projects() {
  const [rotation, setRotation] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef<{ x: number; rotation: number } | null>(null);
  const dragMeta = useRef({ lastX: 0, lastTime: 0, velocity: 0, moved: false });
  const pressedProjectIndex = useRef<number | null>(null);
  const rotationRef = useRef(0);
  const animationFrame = useRef<number | null>(null);

  const setRotationValue = (value: number) => {
    rotationRef.current = value;
    setRotation(value);
  };

  const stopAnimation = () => {
    if (animationFrame.current) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  };

  const animateTo = (target: number) => {
    stopAnimation();

    const tick = () => {
      const current = rotationRef.current;
      const next = current + (target - current) * 0.12;

      if (Math.abs(target - next) < 0.08) {
        setRotationValue(target);
        animationFrame.current = null;
        return;
      }

      setRotationValue(next);
      animationFrame.current = requestAnimationFrame(tick);
    };

    animationFrame.current = requestAnimationFrame(tick);
  };

  const glideAndSnap = (initialVelocity: number) => {
    stopAnimation();

    let velocity = initialVelocity;

    const tick = () => {
      velocity *= 0.92;
      const next = rotationRef.current + velocity * 16;
      setRotationValue(next);

      if (Math.abs(velocity) < 0.015) {
        animateTo(Math.round(rotationRef.current / stepAngle) * stepAngle);
        return;
      }

      animationFrame.current = requestAnimationFrame(tick);
    };

    animationFrame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    return () => stopAnimation();
  }, []);

  const activeIndex = useMemo(() => {
    return projects.reduce(
      (active, _project, index) => {
        const angle = normalizeAngle((index * 360) / projects.length + rotation);
        const distance = Math.abs(angle);
        return distance < active.distance ? { index, distance } : active;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY }
    ).index;
  }, [rotation]);

  const activeProject = projects[activeIndex];

  const selectProject = (index: number) => {
    const baseAngle = index * stepAngle;
    const current = rotationRef.current;
    const target = current + normalizeAngle(-baseAngle - current);
    animateTo(target);
  };

  return (
    <section id="projects" className="py-16 sm:py-20">
      <SectionHeader eyebrow="<playground />" title="Project Playground" />

      <div className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr] lg:items-center">
        <div
          className="relative h-[28rem] overflow-hidden rounded-[1.75rem] border border-border bg-[#080808]/90 touch-none select-none sm:h-[32rem]"
          onPointerDown={(event) => {
            const projectButton = (event.target as HTMLElement).closest("[data-project-index]");
            pressedProjectIndex.current = projectButton
              ? Number((projectButton as HTMLElement).dataset.projectIndex)
              : null;
            stopAnimation();
            setIsDragging(true);
            dragStart.current = { x: event.clientX, rotation };
            dragMeta.current = {
              lastX: event.clientX,
              lastTime: performance.now(),
              velocity: 0,
              moved: false,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!dragStart.current) {
              return;
            }

            const deltaX = event.clientX - dragStart.current.x;
            const nextRotation = dragStart.current.rotation + deltaX * 0.36;
            const now = performance.now();
            const elapsed = Math.max(now - dragMeta.current.lastTime, 1);
            const deltaRotation = nextRotation - rotationRef.current;

            dragMeta.current.velocity = deltaRotation / elapsed;
            dragMeta.current.lastX = event.clientX;
            dragMeta.current.lastTime = now;
            dragMeta.current.moved = dragMeta.current.moved || Math.abs(deltaX) > 5;
            setRotationValue(nextRotation);
          }}
          onPointerUp={(event) => {
            dragStart.current = null;
            setIsDragging(false);
            if (dragMeta.current.moved) {
              glideAndSnap(dragMeta.current.velocity);
            } else if (pressedProjectIndex.current !== null) {
              selectProject(pressedProjectIndex.current);
            }
            pressedProjectIndex.current = null;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onPointerCancel={() => {
            dragStart.current = null;
            setIsDragging(false);
            pressedProjectIndex.current = null;
            animateTo(Math.round(rotationRef.current / stepAngle) * stepAngle);
          }}
        >
          <div className="absolute inset-8 rounded-full border border-accent/10 bg-[radial-gradient(circle,rgba(0,255,136,0.08)_0%,transparent_38%,rgba(0,212,255,0.04)_39%,transparent_64%)]" />
          <div className="absolute left-1/2 top-1/2 h-36 w-36 -translate-x-1/2 -translate-y-1/2 rounded-full border border-border bg-[#050505] shadow-[0_0_60px_rgba(0,255,136,0.08)] sm:h-44 sm:w-44">
            <div className="flex h-full flex-col items-center justify-center px-5 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-accent">orbit</p>
              <p className="mt-2 text-sm font-semibold leading-5 text-text">{activeProject.title}</p>
            </div>
          </div>

          {projects.map((project, index) => {
            const baseAngle = index * stepAngle;
            const angle = normalizeAngle(baseAngle + rotation);
            const radians = (angle * Math.PI) / 180;
            const depth = (Math.cos(radians) + 1) / 2;
            const x = Math.sin(radians) * 235;
            const y = Math.cos(radians) * 155;
            const isActive = index === activeIndex;

            return (
              <button
                key={project.title}
                type="button"
                data-project-index={index}
                className={`absolute left-1/2 top-1/2 w-40 rounded-2xl border bg-surface/95 p-3 text-left shadow-lg backdrop-blur sm:w-48 ${
                  isDragging ? "cursor-grabbing" : "cursor-grab transition-[transform,opacity,border-color] duration-300 ease-out"
                }`}
                style={{
                  borderColor: isActive ? "#00ff88" : "#262626",
                  opacity: 0.4 + depth * 0.6,
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${0.74 + depth * 0.24})`,
                  zIndex: Math.round(depth * 100),
                }}
              >
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">{project.category}</span>
                <span className="mt-2 block text-sm font-semibold leading-5 text-text">{project.title}</span>
              </button>
            );
          })}
        </div>

        <article className="rounded-[1.75rem] border border-border bg-surface/85 p-6 backdrop-blur">
          <label className="mb-5 block">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              Jump to project
            </span>
            <div className="relative">
              <select
                value={activeIndex}
                onChange={(event) => selectProject(Number(event.target.value))}
                className="h-11 w-full appearance-none rounded-xl border border-border bg-[#080808] px-4 pr-10 text-sm font-medium text-text outline-none transition hover:border-accent focus:border-accent"
              >
                {projects.map((project, index) => (
                  <option key={project.title} value={index}>
                    {project.title}
                  </option>
                ))}
              </select>
              <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 font-mono text-xs text-accent">
                v
              </span>
            </div>
          </label>

          <div className="mb-4 flex items-center justify-between gap-3">
            <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
              {activeProject.category}
            </span>
            {activeProject.featured ? <span className="font-mono text-xs text-muted">featured</span> : null}
          </div>
          <h3 className="text-2xl font-semibold leading-tight text-text">{activeProject.title}</h3>
          <p className="mt-4 text-sm leading-7 text-muted">{activeProject.description}</p>
          <p className="mt-4 border-l border-accent/40 pl-3 text-sm leading-6 text-muted">{activeProject.details[0]}</p>
          <div className="mt-5">
            <TechTags tech={activeProject.tech} />
          </div>
          <ProjectActions project={activeProject} />
        </article>
      </div>
    </section>
  );
}
