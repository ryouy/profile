import { SectionHeader } from "./SectionHeader";
import { profile } from "../data/profile";
import { skills } from "../data/skills";

const facts = [
  ["Affiliation", profile.affiliation],
  ["Location", profile.location],
  ["Future Base", profile.workBase],
  ["Role", profile.role],
];

export function Profile() {
  return (
    <section id="profile" className="py-8 sm:py-12">
      <SectionHeader eyebrow="<profile />" title="About me" />
      <div className="rounded-[1.75rem] border border-border bg-surface/85 p-6 backdrop-blur sm:p-8">
        <div className="grid items-stretch gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="flex rounded-2xl border border-border bg-[#0d0d0d]/60 p-5 sm:p-6">
            <p className="max-w-3xl self-center text-base leading-8 text-muted sm:text-lg">{profile.bio}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {facts.map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-border bg-[#0d0d0d]/90 p-4">
                <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">{label}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-text">{value}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 space-y-4 border-t border-border pt-5">
          <div className="grid gap-3 lg:grid-cols-[8rem_1fr] lg:items-start">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Skills</p>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-border bg-[#0b0b0b]/80 px-3 py-1.5 text-xs font-medium text-text transition hover:border-accent hover:text-accent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
          <div className="grid gap-3 lg:grid-cols-[8rem_1fr] lg:items-start">
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Interests</p>
            <div className="flex flex-wrap gap-2">
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  className="rounded-full border border-border bg-[#0b0b0b]/80 px-3 py-1.5 text-xs font-medium text-text transition hover:border-accent hover:text-accent"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
