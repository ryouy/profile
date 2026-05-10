# Ryo / ryouy

A quiet engineering playground for small web apps, data visualizations, research tools, and interface experiments.

Built as a personal profile page with a dark visual system, mountain-inspired atmosphere, and an interactive project orbit.

## Stack

- Next.js
- TypeScript
- Tailwind CSS
- Vercel

## Local Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Structure

```txt
src/app          App Router entry, metadata, global styles
src/components   Hero, profile, and project orbit UI
src/data         Profile, skills, project, and link data
public           Static assets
```

## Notes

Project information is kept in `src/data/projects.ts` so new experiments can be added without touching the UI.
