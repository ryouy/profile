import { Hero } from "../components/Hero";
import { Profile } from "../components/Profile";
import { Projects } from "../components/Projects";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-background text-text">
      <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(0,255,136,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(0,255,136,0.12),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(0,212,255,0.11),transparent_28%),linear-gradient(180deg,#050505_0%,#080808_48%,#050505_100%)]" />
      <div className="mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <Hero />
        <Profile />
        <Projects />
      </div>
    </main>
  );
}
