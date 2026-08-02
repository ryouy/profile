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
    angleOffset: ((hash >>> 8) % 13) - 6,
    radiusOffset: ((hash >>> 16) % 13) - 6,
  };
});
const stepAngle = 360 / orbitProjects.length;

const getSnapTarget = (rotation: number) => {
  const nearest = orbitLayout.reduce(
    (active, item, index) => {
      const angle = normalizeAngle(index * stepAngle + item.angleOffset + rotation);
      const distance = Math.abs(angle);
      return distance < active.distance ? { index, distance } : active;
    },
    { index: 0, distance: Number.POSITIVE_INFINITY }
  );
  const itemAngle = nearest.index * stepAngle + orbitLayout[nearest.index].angleOffset;

  return rotation + normalizeAngle(-itemAngle - rotation);
};

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
  const [lockedProjectIndex, setLockedProjectIndex] = useState<number | null>(null);
  const [lastInteraction, setLastInteraction] = useState(Date.now());
  const [orbitMetrics, setOrbitMetrics] = useState({
    cardWidth: 36,
    innerSize: 80,
    laneRadii: [112, 91, 70, 49],
    compact: true,
  });
  const dragStart = useRef<{ x: number; y: number; rotation: number } | null>(null);
  const dragMeta = useRef({ lastX: 0, lastTime: 0, velocity: 0, moved: false });
  const pressedProjectIndex = useRef<number | null>(null);
  const rotationRef = useRef(0);
  const animationFrame = useRef<number | null>(null);
  const idleFrame = useRef<number | null>(null);
  const lastIdleTick = useRef<number | null>(null);
  const orbitPanelRef = useRef<HTMLDivElement | null>(null);
  const projectSelectActiveRef = useRef(false);

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

  const markInteraction = () => {
    setLastInteraction(Date.now());
    lastIdleTick.current = null;
  };

  const animateTo = (target: number, onComplete?: () => void) => {
    stopAnimation();

    const tick = () => {
      if (projectSelectActiveRef.current) {
        animationFrame.current = null;
        return;
      }

      const current = rotationRef.current;
      const next = current + (target - current) * 0.12;

      if (Math.abs(target - next) < 0.08) {
        setRotationValue(target);
        animationFrame.current = null;
        onComplete?.();
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
      if (projectSelectActiveRef.current) {
        animationFrame.current = null;
        return;
      }

      velocity *= 0.92;
      const next = rotationRef.current + velocity * 16;
      setRotationValue(next);

      if (Math.abs(velocity) < 0.015) {
        animateTo(getSnapTarget(rotationRef.current));
        return;
      }

      animationFrame.current = requestAnimationFrame(tick);
    };

    animationFrame.current = requestAnimationFrame(tick);
  };

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
          cardWidth: 124,
          innerSize: 108,
          laneRadii: [234, 190, 146, 102],
          compact: false,
        });
        return;
      }

      const cardWidth = 36;
      const outerRadius = Math.max(94, Math.min(rect.width, rect.height) / 2 - cardWidth / 2 - 10);
      const laneGap = Math.max(18, (outerRadius - 50) / 3);
      const laneRadii = [0, 1, 2, 3].map((lane) => outerRadius - laneGap * lane);
      const innerSize = 80;

      setOrbitMetrics({ cardWidth, innerSize, laneRadii, compact: true });
    };

    updateMetrics();

    const observer = new ResizeObserver(updateMetrics);
    observer.observe(panel);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const tick = (time: number) => {
      const idleFor = Date.now() - lastInteraction;

      if (!isDragging && !projectSelectActiveRef.current && animationFrame.current === null && idleFor > 4200) {
        const previous = lastIdleTick.current ?? time;
        const elapsed = Math.min(time - previous, 32);
        lastIdleTick.current = time;
        setRotationValue(rotationRef.current + elapsed * 0.004);
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
  }, [isDragging, lastInteraction]);

  const activeIndex = useMemo(() => {
    return orbitLayout.reduce(
      (active, item, index) => {
        const angle = normalizeAngle(index * stepAngle + item.angleOffset + rotation);
        const distance = Math.abs(angle);
        return distance < active.distance ? { index, distance } : active;
      },
      { index: 0, distance: Number.POSITIVE_INFINITY }
    ).index;
  }, [rotation]);

  const displayedProjectIndex = lockedProjectIndex ?? activeIndex;
  const activeProject = orbitLayout[displayedProjectIndex].project;

  const selectProject = (index: number) => {
    if (!Number.isInteger(index) || index < 0 || index >= orbitLayout.length) {
      return;
    }

    markInteraction();
    setLockedProjectIndex(index);
    const baseAngle = index * stepAngle + orbitLayout[index].angleOffset;
    const current = rotationRef.current;
    const target = current + normalizeAngle(-baseAngle - current);
    animateTo(target, () => {
      if (!projectSelectActiveRef.current) {
        setLockedProjectIndex(null);
      }
    });
  };

  const beginProjectSelectInteraction = () => {
    projectSelectActiveRef.current = true;
    setLockedProjectIndex((current) => current ?? activeIndex);
    stopAnimation();
    markInteraction();
  };

  const endProjectSelectInteraction = () => {
    projectSelectActiveRef.current = false;
    markInteraction();

    if (animationFrame.current === null) {
      setLockedProjectIndex(null);
    }
  };

  const handleProjectSelectChange = (index: number) => {
    // A native select fires change after the user has committed an option.
    // Keep the orbit frozen while the menu is open, then move to the choice.
    endProjectSelectInteraction();
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

      <div className="grid items-stretch gap-6 lg:grid-cols-[1.18fr_0.82fr]">
        <div
          ref={orbitPanelRef}
          className="relative h-[28rem] overflow-hidden rounded-[1.75rem] border border-border bg-[#050608] touch-none select-none sm:h-[34rem] lg:h-[36rem]"
          onPointerDown={(event) => {
            markInteraction();
            setLockedProjectIndex(null);
            pressedProjectIndex.current = getProjectIndexAtPoint(event.clientX, event.clientY);
            stopAnimation();
            setIsDragging(true);
            dragStart.current = { x: event.clientX, y: event.clientY, rotation };
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
            const releasedProjectIndex = getProjectIndexAtPoint(event.clientX, event.clientY);
            const tappedProjectIndex = releasedProjectIndex ?? pressedProjectIndex.current;

            dragStart.current = null;
            setIsDragging(false);
            if (dragMeta.current.moved) {
              glideAndSnap(dragMeta.current.velocity);
            } else if (tappedProjectIndex !== null) {
              selectProject(tappedProjectIndex);
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
            animateTo(getSnapTarget(rotationRef.current));
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
              <p className="text-[10px] font-semibold leading-4 text-text sm:text-xs sm:leading-5">{activeProject.title}</p>
            </div>
          </div>

          {orbitLayout.map(({ project, lane, angleOffset, radiusOffset }, index) => {
            const baseAngle = index * stepAngle + angleOffset;
            const angle = normalizeAngle(baseAngle + rotation);
            const radians = (angle * Math.PI) / 180;
            const depth = (Math.cos(radians) + 1) / 2;
            const laneRadius = orbitMetrics.laneRadii[lane] + radiusOffset;
            const x = Math.sin(radians) * laneRadius;
            const y = Math.cos(radians) * laneRadius;
            const isActive = index === displayedProjectIndex;

            return (
              <button
                key={project.title}
                type="button"
                data-project-index={index}
                aria-label={project.title}
                title={project.title}
                className={`absolute left-1/2 top-1/2 border bg-surface/95 shadow-lg backdrop-blur ${
                  orbitMetrics.compact
                    ? "flex items-center justify-center rounded-full p-0"
                    : "rounded-xl p-2 text-left"
                } ${
                  isDragging ? "cursor-grabbing" : "cursor-grab transition-[transform,opacity,border-color] duration-300 ease-out"
                }`}
                style={{
                  borderColor: isActive ? "#00ff88" : "#262626",
                  height: orbitMetrics.compact ? orbitMetrics.cardWidth : undefined,
                  opacity: 0.34 + depth * 0.66,
                  width: orbitMetrics.cardWidth,
                  transform: `translate(-50%, -50%) translate(${x}px, ${y}px) scale(${0.62 + depth * 0.3})`,
                  zIndex: Math.round(depth * 100),
                }}
              >
                {orbitMetrics.compact ? (
                  <span className={`h-2 w-2 rounded-full ${isActive ? "bg-accent" : "bg-muted"}`} />
                ) : (
                  <span className="line-clamp-2 block text-[11px] font-semibold leading-4 text-text">{project.title}</span>
                )}
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
                onPointerDown={beginProjectSelectInteraction}
                onFocus={beginProjectSelectInteraction}
                onBlur={endProjectSelectInteraction}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    endProjectSelectInteraction();
                  }
                }}
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
