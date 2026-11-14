"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Project, projects } from "../data/projects";

type Point = { x: number; y: number };
type Node = { project: Project; index: number; cluster: number; x: number; y: number; w: number };
type Edge = { from: number; to: number; strength: number };
type View = { x: number; y: number; scale: number };

const WIDTH = 1740;
const HEIGHT = 1200;
const categories: Project["category"][] = [
  "Web App", "Game", "Tool", "Data Visualization", "Experiment", "Research", "Club Site"
];
const centers: Point[] = [
  { x: 380, y: 250 },
  { x: 1050, y: 260 },
  { x: 1520, y: 525 },
  { x: 1110, y: 885 },
  { x: 570, y: 975 },
  { x: 230, y: 655 },
  { x: 760, y: 565 },
];
const palette = ["#67e8f9", "#9aaafa", "#8bf2bd", "#e4c58d", "#d3acf7", "#f8a9b4", "#a1d9c3"];
const clamp = (n: number, low: number, high: number) => Math.max(low, Math.min(high, n));
const hash = (s: string) => Array.from(s).reduce((h, c) => Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0, 2166136261);
const tokenize = (p: Project) => new Set(
  [...p.tech, p.category, ...p.title.toLowerCase().split(/[\s/—-]+/)]
    .map(s => s.toLowerCase().trim()).filter(s => s.length > 2)
);
const data = projects.map((project, index) => ({ project, index, tags: tokenize(project), cluster: categories.indexOf(project.category) }));

function similarity(a: typeof data[number], b: typeof data[number]) {
  let common = 0;
  a.tags.forEach((tag) => { if (b.tags.has(tag)) common++; });
  return common * 2 + (a.cluster === b.cluster ? 2.6 : 0);
}

// A fixed, reproducible cluster map: readable labels, no random layout jumps on reload.
function makeLayout() {
  const nodes: Node[] = data.map((item) => {
    const peers = data.filter(p => p.cluster === item.cluster);
    const order = peers.findIndex(p => p.index === item.index);
    const angle = order * 2.399963229728653 + (hash(item.project.title) % 100) / 90;
    const radius = 54 + Math.sqrt(order + 1) * 57;
    const center = centers[item.cluster];
    return {
      project: item.project, index: item.index, cluster: item.cluster,
      x: center.x + Math.cos(angle) * radius,
      y: center.y + Math.sin(angle) * radius * 0.72,
      w: clamp(item.project.title.length * 7.2 + 30, 105, 275),
    };
  });
  // Resolve label collisions without losing the thematic neighborhoods.
  for (let step = 0; step < 170; step++) {
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      const c = centers[a.cluster];
      a.x += (c.x - a.x) * 0.002;
      a.y += (c.y - a.y) * 0.002;
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j];
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const minX = (a.w + b.w) / 2 + 14;
        const minY = 35;
        if (Math.abs(dx) < minX && Math.abs(dy) < minY) {
          const ratio = Math.max(Math.abs(dx) / minX, Math.abs(dy) / minY);
          const push = (1 - ratio) * 1.8;
          const length = Math.hypot(dx, dy) || 1;
          const nx = length < 1.1 ? 0.7 : dx / length;
          const ny = length < 1.1 ? 0.7 : dy / length;
          a.x -= nx * push * 1.6;
          b.x += nx * push * 1.6;
          a.y -= ny * push * 2.6;
          b.y += ny * push * 2.6;
        }
      }
      a.x = clamp(a.x, a.w / 2 + 30, WIDTH - a.w / 2 - 30);
      a.y = clamp(a.y, 55, HEIGHT - 55);
    }
  }
  const edges: Edge[] = [];
  const unique = new Set<string>();
  const connect = (a: number, b: number, strength: number) => {
    if (a === b) return;
    const key = [Math.min(a, b), Math.max(a, b)].join("-");
    if (unique.has(key)) return;
    unique.add(key);
    edges.push({ from: a, to: b, strength });
  };
  data.forEach((item, i) => {
    const others = data.map((other, j) => ({ j, score: similarity(item, other),
      distance: Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y) }))
      .filter(other => other.j !== i)
      .sort((a, b) => b.score - a.score || a.distance - b.distance);
    others.filter(candidate => data[candidate.j].cluster === item.cluster).slice(0, 2)
      .forEach(other => connect(i, other.j, other.score));
    const crossover = others.find(other =>
      data[other.j].cluster !== item.cluster && other.score >= 3
    );
    if (crossover) connect(i, crossover.j, crossover.score);
  });
  return { nodes, edges };
}

const graph = makeLayout();
const initialView: View = { x: 0, y: 0, scale: 0.64 };

function ProjectActions({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap gap-2">
      {project.appUrl && (
        <a href={project.appUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-9 items-center rounded-lg border border-accent/40 bg-accent/10 px-3 text-xs font-semibold text-accent hover:bg-accent/20">
          Open App
        </a>
      )}
      {project.appStoreUrl && (
        <a href={project.appStoreUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex min-h-9 items-center gap-1.5 rounded-lg border border-border bg-[#14191c] px-3 text-xs font-semibold text-text hover:border-accentSecondary">
          <svg width="14" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17.05 12.54c.02 2.14 1.89 2.85 1.91 2.86-.02.05-.3 1.03-.99 2.03-.6.87-1.23 1.73-2.22 1.75-.97.02-1.28-.57-2.39-.57-1.1 0-1.45.55-2.37.59-.96.04-1.68-.95-2.28-1.81-1.24-1.78-2.18-5.02-.91-7.22a3.53 3.53 0 0 1 2.99-1.81c.93-.02 1.81.64 2.39.64.58 0 1.67-.79 2.82-.67.48.02 1.83.19 2.7 1.47-.07.05-1.61.94-1.59 2.74Zm-2.8-5.34a4.56 4.56 0 0 0 1.04-3.33 4.5 4.5 0 0 0-2.97 1.58 4.31 4.31 0 0 0-1.06 3.22 3.75 3.75 0 0 0 2.99-1.47Z"/>
          </svg>
          App Store
        </a>
      )}
      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
        className="inline-flex min-h-9 items-center rounded-lg border border-border bg-[#0b0b0b] px-3 text-xs font-semibold text-text hover:border-accent/50">
        View Code
      </a>
    </div>
  );
}

export function Projects() {
  const [selected, setSelected] = useState<number | null>(null);
  const [hovered, setHovered] = useState<number | null>(null);
  const [view, setView] = useState<View>(initialView);
  const [size, setSize] = useState({ width: 1080, height: 700 });
  const [motion, setMotion] = useState(false);
  const [pause, setPause] = useState(false);
  const [time, setTime] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const drag = useRef<{ x: number; y: number; origin: View; moved: boolean; id: number } | null>(null);
  const movedAt = useRef(0);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setMotion(!media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!motion || pause || dragging) return;
    let frame = 0;
    let last = 0;
    let elapsed = 0;
    const tick = (now: number) => {
      if (!document.hidden) {
        elapsed += last ? Math.min(now - last, 50) : 0;
        if (elapsed > 45) {
          setTime(t => t + elapsed / 1000);
          elapsed = 0;
        }
      }
      last = now;
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [motion, pause, dragging]);

  const coordinates = useMemo(() => graph.nodes.map((node) => {
    const seed = hash(node.project.title) / 4294967296;
    return {
      x: node.x + (motion ? Math.sin(time * 0.25 + seed * 16) * 6 : 0),
      y: node.y + (motion ? Math.cos(time * 0.19 + seed * 13) * 7 : 0),
    };
  }), [time, motion]);

  const screenCenter = { x: size.width / 2, y: size.height / 2 };
  const fit = useCallback(() => {
    const scale = clamp(Math.min((size.width - 60) / WIDTH, (size.height - 60) / HEIGHT), 0.26, 1);
    setView({ scale, x: (size.width - WIDTH * scale) / 2, y: (size.height - HEIGHT * scale) / 2 });
  }, [size]);

  useEffect(() => { fit(); }, [fit]);
  const zoom = (factor: number, at = screenCenter) => {
    setView(old => {
      const scale = clamp(old.scale * factor, 0.24, 1.65);
      const f = scale / old.scale;
      return { scale, x: at.x - (at.x - old.x) * f, y: at.y - (at.y - old.y) * f };
    });
  };

  const moveToProject = (index: number) => {
    // Selection does not change the viewport or interrupt the floating animation.
    setSelected(index);
  };
  const active = selected === null ? null : graph.nodes[selected];
  const focus = hovered ?? selected;

  return (
    <section id="projects" className="py-16 sm:py-20">
      <SectionHeader eyebrow="<playground />" title="Project Playground" />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <p className="font-mono text-xs text-muted">{graph.nodes.length} projects · Connected by themes and technologies</p>
        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setPause(p => !p)} disabled={!motion}
            className="rounded-lg border border-border px-3 py-2 text-xs text-muted hover:border-accent/50 disabled:opacity-40">
            {!motion ? "Motion off" : pause ? "Resume drift" : "Pause drift"}
          </button>
          <label className="sr-only" htmlFor="project-jump">Jump to project</label>
          <select id="project-jump" className="max-w-[190px] rounded-lg border border-border bg-[#0c1111] px-3 py-2 text-xs text-text sm:max-w-[240px]"
            value={selected ?? ""} onChange={(event) => moveToProject(Number(event.target.value))}>
            <option value="" disabled>Find a project</option>
            {graph.nodes.map((n, i) => <option key={n.project.title} value={i}>{n.project.title}</option>)}
          </select>
        </div>
      </div>

      <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-[#050608] shadow-[0_22px_75px_rgba(0,0,0,0.25)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(0,255,136,0.045),transparent_65%),radial-gradient(ellipse_at_85%_75%,rgba(0,212,255,0.045),transparent_40%)]" />
        <svg ref={svgRef} role="group" aria-label="Interactive map of projects grouped by themes and technologies"
          className={"relative block h-[470px] w-full select-none touch-none sm:h-[610px] lg:h-[700px] " + (dragging ? "cursor-grabbing" : "cursor-grab")}
          onPointerDown={(e) => {
            if (e.button !== 0 || !e.isPrimary || (e.target as Element).closest("[data-project-node]")) return;
            drag.current = { x: e.clientX, y: e.clientY, origin: view, moved: false, id: e.pointerId };
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
          }}
          onPointerMove={(e) => {
            if (!drag.current || drag.current.id !== e.pointerId) return;
            const dx = e.clientX - drag.current.x;
            const dy = e.clientY - drag.current.y;
            drag.current.moved ||= Math.hypot(dx, dy) > 4;
            setView({ ...drag.current.origin, x: drag.current.origin.x + dx, y: drag.current.origin.y + dy });
          }}
          onPointerUp={(e) => {
            if (!drag.current || drag.current.id !== e.pointerId) return;
            if (drag.current.moved) movedAt.current = Date.now();
            drag.current = null;
            setDragging(false);
            if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
          }}
          onPointerCancel={(e) => {
            if (drag.current?.id !== e.pointerId) return;
            drag.current = null;
            setDragging(false);
          }}
          onWheel={(e) => {
            e.preventDefault();
            const bounds = e.currentTarget.getBoundingClientRect();
            zoom(e.deltaY < 0 ? 1.1 : 1 / 1.1, { x: e.clientX - bounds.left, y: e.clientY - bounds.top });
          }}>
          <defs>
            <pattern id="project-starfield" width="140" height="140" patternUnits="userSpaceOnUse">
              <circle cx="20" cy="31" r="1" fill="#d5e9ef" opacity=".24" />
              <circle cx="109" cy="104" r=".85" fill="#94d8e1" opacity=".25" />
              <circle cx="76" cy="56" r=".55" fill="#d5e9ef" opacity=".2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#project-starfield)" pointerEvents="none" />
          <g transform={ "translate(" + view.x + " " + view.y + ") scale(" + view.scale + ")" }>
            {centers.map((center, i) => (
              <g key={categories[i]} pointerEvents="none">
                <circle cx={center.x} cy={center.y} r={235} fill={palette[i]} opacity=".026" />
                <circle cx={center.x} cy={center.y} r={160} fill="none" stroke={palette[i]} strokeOpacity=".08" strokeDasharray="3 11" />
                <text x={center.x} y={center.y - 215} textAnchor="middle" fontSize="16" letterSpacing="3" fill={palette[i]} opacity=".43">
                  {categories[i].toUpperCase()}
                </text>
              </g>
            ))}
            {graph.edges.map((edge) => {
              const a = coordinates[edge.from], b = coordinates[edge.to];
              const highlighted = focus !== null && (edge.from === focus || edge.to === focus);
              const cross = graph.nodes[edge.from].cluster !== graph.nodes[edge.to].cluster;
              return <line key={edge.from + "-" + edge.to} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={highlighted ? "#9cf9cd" : cross ? "#65b0c0" : "#8aa9ac"}
                strokeWidth={highlighted ? 1.7 : cross ? 0.85 : 1.1}
                strokeOpacity={highlighted ? 0.75 : cross ? 0.12 : 0.23}
                strokeDasharray={cross ? "3 7" : undefined} pointerEvents="none" />;
            })}
            {graph.nodes.map((node, i) => {
              const p = coordinates[i];
              const chosen = selected === i;
              const highlighted = hovered === i || chosen;
              const dimmed = focus !== null && !highlighted && !graph.edges.some(e =>
                (e.from === focus && e.to === i) || (e.to === focus && e.from === i));
              return (
                <g key={node.project.title} data-project-node="true"
                  transform={ "translate(" + p.x + " " + p.y + ")" }
                  role="button" tabIndex={0} aria-label={node.project.title} aria-pressed={chosen}
                  className="cursor-pointer outline-none"
                  onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(v => v === i ? null : v)}
                  onFocus={() => setHovered(i)} onBlur={() => setHovered(v => v === i ? null : v)}
                  onClick={() => { if (Date.now() - movedAt.current > 180) moveToProject(i); }}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); moveToProject(i); } }}>
                  {highlighted && <circle r="25" fill={palette[node.cluster]} opacity=".13" />}
                  <rect x={-node.w / 2} y="-15" width={node.w} height="30" rx="12"
                    fill={highlighted ? "#14251f" : "#0d1416"}
                    fillOpacity={dimmed ? 0.68 : .96}
                    stroke={palette[node.cluster]} strokeOpacity={highlighted ? 0.86 : dimmed ? .11 : .35}
                    strokeWidth={highlighted ? 1.5 : .8} />
                  <circle cx={-node.w / 2 + 13} cy="0" r={highlighted ? 4.6 : 3.2}
                    fill={palette[node.cluster]} opacity={dimmed ? .4 : 1} />
                  <text x={-node.w / 2 + 25} y="4.5" fontSize="12" fontWeight={highlighted ? "600" : "450"}
                    fill={highlighted ? "#ffffff" : "#c6d5d7"} opacity={dimmed ? .6 : 1}>
                    {node.project.title}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
        <div className="absolute bottom-4 left-4 pointer-events-none rounded-lg border border-white/10 bg-[#080d0e]/80 px-3 py-2 font-mono text-[10px] text-muted backdrop-blur">
          Drag to pan · Scroll to zoom · Select to inspect
        </div>
        <div className="absolute bottom-4 right-4 flex gap-1.5">
          <button type="button" onClick={() => zoom(1.2)} aria-label="Zoom in" className="h-9 w-9 rounded-lg border border-border bg-[#10191b] text-lg text-text hover:border-accent">+</button>
          <button type="button" onClick={() => zoom(1 / 1.2)} aria-label="Zoom out" className="h-9 w-9 rounded-lg border border-border bg-[#10191b] text-lg text-text hover:border-accent">−</button>
          <button type="button" onClick={fit} aria-label="Fit all projects" className="h-9 rounded-lg border border-border bg-[#10191b] px-3 text-xs text-text hover:border-accent">Fit</button>
        </div>
      </div>

      <div className="mt-4 min-h-[150px] rounded-[1.5rem] border border-border bg-surface/90 p-5 backdrop-blur sm:p-6">
        {active ? (
          <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
            <div className="max-w-3xl">
              <p className="mb-2 font-mono text-[11px] uppercase tracking-wider text-accent">{active.project.category}</p>
              <h3 className="text-xl font-semibold text-text">{active.project.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted">{active.project.description}</p>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {active.project.tech.slice(0, 6).map(tech => <span key={tech} className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted">{tech}</span>)}
              </div>
            </div>
            <ProjectActions project={active.project} />
          </div>
        ) : (
          <div className="flex min-h-[105px] flex-col items-center justify-center text-center">
            <p className="text-sm font-medium text-text">Explore the project universe</p>
            <p className="mt-2 max-w-lg text-xs leading-6 text-muted">Related projects form constellations. Select a project to see its details and links without moving the map.</p>
          </div>
        )}
      </div>
    </section>
  );
}
