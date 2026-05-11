import { profile } from "../data/profile";

const terminalLines = [
  { command: "whoami", output: profile.username },
  {
    command: "interests",
    output: "data science / computational social science / art",
  },
  { command: "status", output: "quietly growing a world through small experiments" },
];

export function Hero() {
  return (
    <section className="fade-up grid min-h-[calc(84vh-2rem)] gap-10 py-8 lg:grid-cols-[1.04fr_0.96fr] lg:items-center lg:gap-14">
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-3 rounded-full border border-border bg-surface/80 px-4 py-2 font-mono text-xs text-muted backdrop-blur">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_18px_rgba(0,255,136,0.7)]" />
          <span>playground.init()</span>
        </div>

        <p className="mt-8 font-mono text-sm uppercase tracking-[0.28em] text-accent">hello, this is</p>
        <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight tracking-normal text-text sm:text-6xl lg:text-7xl">
          Ryo / <span className="text-accent">ryouy</span>
        </h1>
        <p className="mt-6 text-xl font-medium text-text sm:text-2xl">
          Hiker, Developer, Artist, and Data Explorer.
        </p>
        <p className="mt-5 max-w-2xl text-base leading-8 text-muted sm:text-lg">
          A small playground for web apps, data visualization, and research tools, slowly growing around useful little ideas.
        </p>

        <div className="mt-9 flex flex-col gap-3 sm:flex-row">
          <a
            href="#projects"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-accent/60 bg-accent px-6 py-3 text-sm font-semibold text-[#041008] shadow-[0_0_26px_rgba(0,255,136,0.18)] transition hover:bg-[#56ffad]"
          >
            Explore Playground
          </a>
          <a
            href={profile.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-border bg-surface/80 px-6 py-3 text-sm font-semibold text-text transition hover:border-accent hover:text-accent"
          >
            GitHub
          </a>
          <a
            href={profile.kaggleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-12 items-center justify-center rounded-2xl border border-border bg-surface/80 px-6 py-3 text-sm font-semibold text-text transition hover:border-accent hover:text-accent"
          >
            Kaggle
          </a>
          <a
            href={profile.galleryUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex min-h-12 items-center justify-center overflow-hidden rounded-2xl border border-white/65 bg-[linear-gradient(135deg,#f7f7f7_0%,#d7d7d7_48%,#9faaa5_100%)] px-7 py-3 text-sm font-semibold text-[#050505] shadow-[0_16px_42px_rgba(245,245,245,0.16),0_0_22px_rgba(0,255,136,0.08)] transition hover:-translate-y-0.5 hover:border-white hover:shadow-[0_22px_52px_rgba(245,245,245,0.22),0_0_28px_rgba(0,255,136,0.14)]"
          >
            <span className="absolute inset-x-3 top-0 h-px bg-white/90" />
            <span className="relative">Art Gallery</span>
          </a>
        </div>
      </div>

      <div className="terminal-shadow rounded-[1.75rem] border border-border bg-[#0b0b0b]/95 p-4 backdrop-blur sm:p-6 lg:translate-y-12 xl:translate-y-16">
        <div className="mb-5 flex items-center justify-between border-b border-border pb-4">
          <div className="flex gap-2">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <span className="h-3 w-3 rounded-full bg-accent" />
          </div>
          <p className="font-mono text-xs text-muted">~/ryouy/index</p>
        </div>
        <div className="space-y-6 font-mono text-sm leading-7">
          {terminalLines.map((line) => (
            <div key={line.command}>
              <p className="text-accent">$ {line.command}</p>
              <p className="mt-1 text-text">{line.output}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
