import { SectionHeader } from "./SectionHeader";
import { links } from "../data/links";

export function ExternalLinks() {
  return (
    <section id="links" className="py-16 sm:py-20">
      <SectionHeader eyebrow="<links />" title="Find more" />
      <div className="grid gap-4 sm:grid-cols-2">
        {links.map((item) => (
          <a
            key={item.label}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="card-hover rounded-[1.5rem] border border-border bg-surface/85 p-6"
          >
            <p className="font-mono text-sm uppercase tracking-[0.28em] text-accent">{item.label}</p>
            <p className="mt-4 text-base font-medium leading-7 text-text">{item.description}</p>
          </a>
        ))}
      </div>
    </section>
  );
}
