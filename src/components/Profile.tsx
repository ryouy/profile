import { SectionHeader } from "./SectionHeader";
import { profile } from "../data/profile";
import { skills } from "../data/skills";

const facts = [
  ["Affiliation", profile.affiliation],
  ["Location", profile.location],
  ["Work base", profile.workBase],
  ["Handle", profile.username],
  ["Role", profile.role],
];

export function Profile() {
  return (
    <section id="profile" className="py-8 sm:py-12">
      <SectionHeader eyebrow="<profile />" title="About me" />
      <div className="rounded-[1.75rem] border border-border bg-surface/85 p-6 backdrop-blur sm:p-8">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="max-w-3xl text-base leading-8 text-muted sm:text-lg">{profile.bio}</p>
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
        <div className="mt-6 grid gap-4 border-t border-border pt-5 lg:grid-cols-2">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Skills</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="rounded-xl border border-border bg-[#0b0b0b]/90 px-3 py-3 text-xs font-medium text-text transition hover:border-accent hover:text-accent"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-muted">Interests</p>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {profile.interests.map((interest) => (
                <div
                  key={interest}
                  className="rounded-xl border border-border bg-[#0b0b0b]/90 px-3 py-3 text-xs font-medium text-text transition hover:border-accent hover:text-accent"
                >
                  {interest}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
