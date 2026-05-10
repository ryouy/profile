import { Hero } from "../components/Hero";
import { Profile } from "../components/Profile";
import { Projects } from "../components/Projects";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-text">
      <div className="fixed inset-x-0 top-0 z-0 h-[38rem] bg-[url('/images/mountain-hero.png')] bg-cover bg-[center_30%] opacity-65" />
      <div className="fixed inset-x-0 top-0 z-0 h-[42rem] bg-[linear-gradient(180deg,rgba(5,5,5,0.10)_0%,rgba(5,5,5,0.42)_42%,#050505_100%),linear-gradient(90deg,rgba(5,5,5,0.78)_0%,rgba(5,5,5,0.32)_48%,rgba(5,5,5,0.70)_100%)]" />
      <div className="fixed inset-0 z-0 bg-[linear-gradient(rgba(0,255,136,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(0,212,255,0.03)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_18%_12%,rgba(0,255,136,0.10),transparent_28%),radial-gradient(circle_at_82%_10%,rgba(0,212,255,0.08),transparent_28%),linear-gradient(180deg,rgba(5,5,5,0.04)_0%,rgba(8,8,8,0.68)_48%,#050505_100%)]" />
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-8 sm:px-8 lg:px-10">
        <Hero />
        <Profile />
        <Projects />
      </div>
    </main>
  );
}
