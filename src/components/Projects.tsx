"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Project, projects } from "../data/projects";

const normalizeAngle = (angle: number) => {
  const normalized = ((angle % 360) + 360) % 360;
  return normalized > 180 ? normalized - 360 : normalized;
};

const hashTitle = (title: string) => {
  return Array.from(title).reduce((hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0, 2166136261);
};

const orbitProjects = [...projects].sort((first, second) => hashTitle(first.title) - hashTitle(second.title));
const orbitLayout = orbitProjects.map((project, index) => {
  const hash = hashTitle(project.title);

  return {
    project,
    lane: index % 4,
    angleOffset: ((index % 4) * 19 + ((hash >>> 8) % 7) - 3),
    radiusOffset: ((hash >>> 16) % 9) - 4,
  };
});
// Each ring gets its own even spacing instead of clustering 44 items around one angle.
const angleFor = (index: number) => {
  const lane = orbitLayout[index].lane;
  const laneCount = orbitLayout.filter((item) => item.lane === lane).length;
  const position = Math.floor(index / 4);
  return (position * 360) / laneCount + orbitLayout[index].angleOffset;
};

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {project.appUrl ? (
        <a
          href={project.appUrl}
          aria-label={`Open ${project.title} app (opens in a new tab)`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-accent/50 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent transition hover:bg-accent hover:text-[#041008]"
        >
          Open App
        </a>
      ) : null}
      {project.appStoreUrl ? (
        <a href={project.appStoreUrl} aria-label={`View ${project.title} on the App Store (opens in a new tab)`}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-9 items-center justify-center rounded-lg border border-accentSecondary/50 bg-accentSecondary/10 px-3 py-1.5 text-xs font-semibold text-text transition hover:border-accentSecondary hover:text-accentSecondary">
          App Store
        </a>
      ) : null}
      <a
        href={project.githubUrl}
        aria-label={`View ${project.title} source code (opens in a new tab)`}
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
  const [reducedMotion, setReducedMotion] = useState(true);
  const [rotationPaused, setRotationPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lockedProjectIndex, setLockedProjectIndex] = useState<number | null>(null);
  const [orbitMetrics, setOrbitMetrics] = useState({
    cardWidth: 30,
    innerSize: 76,
    laneRadii: [130, 106, 82, 58],
    compact: true,
  });
  const dragStart = useRef<{ x: number; y: number; rotation: number; pointerId: number } | null>(null);
  const dragMeta = useRef({ lastX: 0, lastTime: 0, velocity: 0, moved: false });
  const pressedProjectIndex = useRef<number | null>(null);
  const rotationRef = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const idleFrame = useRef<number | null>(null);
  const lastIdleTick = useRef<number | null>(null);
  const orbitPanelRef = useRef<HTMLDivElement | null>(null);

  const setRotationValue = (value: number) => {
    rotationRef.current = value;
    setRotation(value);
  };

  const stopAnimation = () => {
    if (animationFrame.current !== null) {
      cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  };

  const glideAfterDrag = (initialVelocity: number) => {
    stopAnimation();

    if (reducedMotion) return;
    let velocity = initialVelocity;

    const tick = () => {
      velocity *= 0.92;
      const next = rotationRef.current + velocity * 16;
      setRotationValue(next);

      if (Math.abs(velocity) < 0.015) {
        animationFrame.current = null;
        lastIdleTick.current = null;
        return;
      }

      animationFrame.current = requestAnimationFrame(tick);
    };

    animationFrame.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(preference.matches);
      if (preference.matches) stopAnimation();
      lastIdleTick.current = null;
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    return () => stopAnimation();
  }, []);

  useEffect(() => {
    const panel = orbitPanelRef.current;

    if (!panel) {
      return;
    }

    const updateMetrics = () => {
      const rect = panel.getBoundingClientRect();
      const isCompact = rect.width < 560;

      if (!isCompact) {
        setOrbitMetrics({
          cardWidth: 36,
          innerSize: 104,
          laneRadii: [241, 188, 139, 91],
          compact: false,
        });
        return;
      }

      const cardWidth = 28;
      const outerRadius = Math.max(105, Math.min(rect.width, rect.height) / 2 - cardWidth / 2 - 14);
      const innerRadius = 58;
      const laneGap = (outerRadius - innerRadius) / 3;
      const laneRadii = [0, 1, 2, 3].map((lane) => outerRadius - laneGap * lane);
      const innerSize = 76;

      setOrbitMetrics({ cardWidth, innerSize, laneRadii, compact: true });
    };

    updateMetrics();

    const observer = new ResizeObserver(updateMetrics);
    observer.observe(panel);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const tick = (time: number) => {
      // Continuous, quiet motion: selecting or focusing a project never repositions the orbit.
      if (!reducedMotion && !rotationPaused && !document.hidden && !isDragging && animationFrame.current === null) {
        const previous = lastIdleTick.current ?? time;
        const elapsed = Math.min(time - previous, 32);
        lastIdleTick.current = time;
        setRotationValue(rotationRef.current + elapsed * 0.0025);
      } else {
        lastIdleTick.current = null;
      }

      idleFrame.current = requestAnimationFrame(tick);
    };

    idleFrame.current = requestAnimationFrame(tick);

    return () => {
      if (idleFrame.current) {
        cancelAnimationFrame(idleFrame.current);
      }
    };
  }, [isDragging, reducedMotion, rotationPaused]);

  const activeIndex = useMemo(() => {
    return orbitLayout.reduce(
      (active, item, index) => {
        const angle = normalizeAngle(angleFor(index) + rotation);
        const distance = Math.abs(angle);
        return distance < active.distance ? { index, distance } : active;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY }
    ).index;
  }, [rotation]);

  const displayedProjectIndex = lockedProjectIndex ?? activeIndex;
  const activeProject = orbitLayout[displayedProjectIndex].project;

  const selectProject = (index: number) => {
    if (!Number.isInteger(index) || index < 0 || index >= orbitLayout.length) return;
    // Only update the information and highlight: never rotate or snap on selection.
    setLockedProjectIndex(index);
  };

  const handleProjectSelectChange = (index: number) => {
    selectProject(index);
  };

  const getProjectIndexAtPoint = (x: number, y: number) => {
    const element = document.elementFromPoint(x, y);
    const projectButton = element?.closest("[data-project-index]");
    const index = projectButton instanceof HTMLElement ? Number(projectButton.dataset.projectIndex) : NaN;

    return Number.isFinite(index) ? index : null;
  };

  return (
    <section id="projects" className="py-16 sm:py-20">
      <SectionHeader eyebrow="<playground />" title="Project Playground" />
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <p className="font-mono text-xs text-muted">{orbitProjects.length} projects in orbit · Select a star to explore</p>
      <button type="button" aria-pressed={rotationPaused} disabled={reducedMotion}
        className="rounded-lg border border-border px-3 py-2 text-sm text-muted hover:border-accent disabled:opacity-60"
        onClick={() => { setRotationPaused((paused) => !paused); }}
      >
        {reducedMotion ? "Rotation off" : rotationPaused ? "Resume rotation" : "Pause rotation"}
      </button>
      </div>

      <div className="grid items-stretch gap-6 lg:grid-cols-[1.18fr_0.82fr]">
        <div
          ref={orbitPanelRef}
          className="relative h-[29rem] overflow-hidden rounded-[1.75rem] border border-border bg-[#050608] touch-none select-none sm:h-[37rem] lg:h-[39rem]"
          onPointerDown={(event) => {
            if (!event.isPrimary || event.button !== 0 || dragStart.current) return;
            pressedProjectIndex.current = getProjectIndexAtPoint(event.clientX, event.clientY);
            stopAnimation();
            setIsDragging(true);
            dragStart.current = { x: event.clientX, y: event.clientY, rotation: rotationRef.current, pointerId: event.pointerId };
            dragMeta.current = {
              lastX: event.clientX,
              lastTime: performance.now(),
              velocity: 0,
              moved: false,
            };
            event.currentTarget.setPointerCapture(event.pointerId);
          }}
          onPointerMove={(event) => {
            if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) {
              return;
            }

            const deltaX = event.clientX - dragStart.current.x;
            const deltaY = event.clientY - dragStart.current.y;
            const nextRotation = dragStart.current.rotation + deltaX * 0.36;
            const now = performance.now();
            const elapsed = Math.max(now - dragMeta.current.lastTime, 1);
            const deltaRotation = nextRotation - rotationRef.current;

            dragMeta.current.velocity = deltaRotation / elapsed;
            dragMeta.current.lastX = event.clientX;
            dragMeta.current.lastTime = now;
            dragMeta.current.moved = dragMeta.current.moved || Math.hypot(deltaX, deltaY) > 14;
            setRotationValue(nextRotation);
          }}
          onPointerUp={(event) => {
            if (!dragStart.current || dragStart.current.pointerId !== event.pointerId) return;
            const releasedProjectIndex = getProjectIndexAtPoint(event.clientX, event.clientY);
            const tappedProjectIndex = releasedProjectIndex ?? pressedProjectIndex.current;

            dragStart.current = null;
            setIsDragging(false);
            if (dragMeta.current.moved) {
              glideAfterDrag(dragMeta.current.velocity);
            } else if (tappedProjectIndex !== null) {
              selectProject(tappedProjectIndex);
            }
            pressedProjectIndex.current = null;
            if (event.currentTarget.hasPointerCapture(event.pointerId)) {
              event.currentTarget.releasePointerCapture(event.pointerId);
            }
          }}
          onPointerCancel={(event) => {
            if (dragStart.current?.pointerId !== event.pointerId) return;
            dragStart.current = null;
            setIsDragging(false);
            pressedProjectIndex.current = null;
            lastIdleTick.current = null;
          }}
          onLostPointerCapture={(event) => {
            if (dragStart.current?.pointerId !== event.pointerId) return;
            dragStart.current = null;
            pressedProjectIndex.current = null;
            setIsDragging(false);
            lastIdleTick.current = null;
          }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_24%_22%,rgba(255,255,255,0.18)_0_1px,transparent_1.5px),radial-gradient(circle_at_72%_28%,rgba(0,212,255,0.22)_0_1px,transparent_1.5px),radial-gradient(circle_at_62%_76%,rgba(255,255,255,0.12)_0_1px,transparent_1.5px),radial-gradient(circle_at_18%_72%,rgba(0,255,136,0.16)_0_1px,transparent_1.5px)] opacity-70" />
          {orbitMetrics.laneRadii.map((radius, index) => (
            <div
              key={index}
              className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border ${
                index % 2 === 0 ? "border-accent/10" : "border-accentSecondary/10"
              } ${index === 0 ? "shadow-[0_0_80px_rgba(0,212,255,0.08)]" : ""}`}
              style={{ height: radius * 2, width: radius * 2 }}
            />
          ))}
          <div className="absolute inset-8 rounded-full bg-[radial-gradient(circle,rgba(0,255,136,0.10)_0%,transparent_34%,rgba(0,212,255,0.06)_45%,transparent_66%)]" />
          <div
            className="absolute left-1/2 top-1/2 z-[110] -translate-x-1/2 -translate-y-1/2 rounded-full border border-accent/20 bg-[#050505]/95 shadow-[0_0_70px_rgba(0,255,136,0.16),inset_0_0_28px_rgba(0,212,255,0.06)]"
            style={{ height: orbitMetrics.innerSize, width: orbitMetrics.innerSize }}
          >
            <div className="flex h-full flex-col items-center justify-center px-3 text-center sm:px-5">
              <p className="line-clamp-3 text-[10px] font-semibold leading-4 text-text sm:text-xs sm:leading-5">{activeProject.title}</p>
            </div>
          </div>

          {orbitLayout.map(({ project, lane, angleOffset, radiusOffset }, index) => {
            const baseAngle = angleFor(index);
            const angle = normalizeAngle(baseAngle + rotation);
            const radians = (angle * Math.PI) / 180;
            const depth = (Math.cos(radians) + 1) / 2;
            const laneRadius = orbitMetrics.laneRadii[lane] + radiusOffset;
            const x = Math.sin(radians) * laneRadius;
            const y = Math.cos(radians) * laneRadius;
            const isActive = index === displayedProjectIndex;
            const nodeWidth = orbitMetrics.cardWidth;
            const activeScale = isActive ? 1.16 : 1;
            const nodeScale = (0.76 + depth * 0.24) * activeScale;

            return (
              <button
                key={project.title}
                type="button"
                data-project-index={index}
                aria-label={project.title}
                aria-pressed={isActive}
                onClick={(event) => {
                  // Pointer selection is handled once by the orbit's drag/tap handler.
                  if (event.detail === 0) selectProject(index);
                }}
                title={project.title}
                className={`absolute left-1/2 top-1/2 flex items-center justify-center rounded-full border bg-[#111b18]/95 shadow-md backdrop-blur ${
                  isDragging ? "cursor-grabbing" : "cursor-grab transition-[transform,opacity,border-color] duration-300 ease-out hover:border-accent"
                }`}
                style={{
                  borderColor: isActive ? "#00ff88" : "#262626",
                  height: nodeWidth,
                  opacity: isActive ? 1 : 0.52 + depth * 0.42,
                  width: nodeWidth,
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${nodeScale})`,
                  boxShadow: isActive ? "0 0 0 5px rgba(0,255,136,0.10), 0 0 27px rgba(0,255,136,0.36)" : undefined,
                  zIndex: isActive ? 105 : Math.round(depth * 100),
                }}
              >
                <span className={`rounded-full ${isActive ? "h-2.5 w-2.5 bg-accent" : "h-1.5 w-1.5 bg-[#8ba8a0]"}`} />
              </button>
            );
          })}
        </div>

        <article className="flex h-full flex-col rounded-[1.75rem] border border-border bg-surface/85 p-6 backdrop-blur">
          <label className="mb-5 block">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-[0.22em] text-muted">
              Jump to project
            </span>
            <div className="relative">
              <select
                value={displayedProjectIndex}
                onChange={(event) => handleProjectSelectChange(Number(event.target.value))}
                className="h-11 w-full appearance-none rounded-xl border border-border bg-[#080808] px-4 pr-10 text-sm font-medium text-text outline-none transition hover:border-accent focus:border-accent"
              >
                {orbitProjects.map((project, index) => (
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

