import { profile } from "../data/profile";

export function Footer() {
  return (
    <footer className="border-t border-border py-8 text-sm text-muted">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p>© 2026 Ryo / ryouy. Built with Next.js and deployed on Vercel.</p>
        <a
          href={profile.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-accent transition hover:text-[#73ffb9]"
        >
          GitHub
        </a>
      </div>
    </footer>
  );
}
