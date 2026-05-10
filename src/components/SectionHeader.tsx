type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  align?: "left" | "between";
};

export function SectionHeader({ eyebrow, title, align = "left" }: SectionHeaderProps) {
  return (
    <div className={align === "between" ? "mb-8 flex items-end justify-between gap-4" : "mb-8"}>
      <div>
        <p className="font-mono text-sm uppercase tracking-[0.28em] text-accent">{eyebrow}</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-normal text-text sm:text-4xl">{title}</h2>
      </div>
    </div>
  );
}
