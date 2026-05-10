export type Project = {
  title: string;
  description: string;
  details: string[];
  category: "Web App" | "Data Visualization" | "Tool" | "Experiment" | "Club Site" | "Research";
  tech: string[];
  appUrl: string;
  githubUrl: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "Human Topology",
    description:
      "A graph exploration app that visualizes connections between people using Japanese Wikipedia biography links.",
    details: [
      "The app treats people as nodes and Wikipedia links as edges, making it possible to search how one person is connected to another through public biographical knowledge.",
      "I built the interface so users can move from a simple name search into a visual network, link distance, and relationship path without needing to understand the underlying graph processing.",
      "This project reflects my interest in computational social science: turning messy public information into an interactive structure that invites exploration."
    ],
    category: "Data Visualization",
    tech: ["Next.js", "TypeScript", "Python", "Wikipedia API", "Graph"],
    appUrl: "https://human-topology.vercel.app",
    githubUrl: "https://github.com/ryouy/human-topology",
    featured: true
  },
  {
    title: "LightNews",
    description:
      "A lightweight news and weather app designed to stay usable on slow or unstable connections.",
    details: [
      "LightNews prioritizes text, speed, and low data usage instead of heavy media and complicated layouts, so the important information reaches the user quickly.",
      "The project combines scraped or fetched content with a minimal Next.js interface, focusing on practical access rather than visual excess.",
      "I made it as a small answer to a real usability problem: news should still be readable when network conditions are not ideal."
    ],
    category: "Web App",
    tech: ["Next.js", "React", "Tailwind CSS", "Axios", "Cheerio"],
    appUrl: "https://lightnewsy.vercel.app",
    githubUrl: "https://github.com/ryouy/LightNews",
    featured: true
  },
  {
    title: "GFormGen / FMT",
    description:
      "A form management tool for creating, rediscovering, aggregating, and exporting Google Forms data.",
    details: [
      "This tool supports workflows around Google Forms, Drive, and collected responses, especially where forms multiply and become hard to track over time.",
      "It focuses on practical operations: creating forms, finding existing forms again, aggregating answers, and exporting data for later use.",
      "The project sits close to real DX work because it reduces repeated manual effort and makes an everyday administrative workflow easier to manage."
    ],
    category: "Tool",
    tech: ["React", "Vite", "Node.js", "Express", "Google APIs", "Firebase"],
    appUrl: "https://gfca-aizu.web.app",
    githubUrl: "https://github.com/ryouy/gformgen",
    featured: true
  },
  {
    title: "Wave Memo",
    description:
      "An experimental memo app where written text gradually disappears like waves erasing words from the shore.",
    details: [
      "Wave Memo intentionally has no database, no persistence, and no archive. It is designed around the feeling of writing something temporary and letting it fade.",
      "The app explores how interface behavior can change the emotional meaning of a simple memo tool, turning writing into a small interaction with time.",
      "It connects my interest in web apps with art and atmosphere: a practical interface, but one that asks the user to experience impermanence."
    ],
    category: "Experiment",
    tech: ["Next.js", "React", "TypeScript", "CSS Animations"],
    appUrl: "https://wave-memo-vlgs.vercel.app",
    githubUrl: "https://github.com/ryouy/wave-memo",
    featured: true
  },
  {
    title: "Election 2026 Candidate Survey Viewer",
    description:
      "A static 3D scatter viewer for exploring Japanese election candidate survey answers through dimensionality reduction.",
    details: [
      "The viewer maps candidate survey answers into a 3D space using UMAP and PCA-style visualization, helping users see clusters, distances, and political tendencies at a glance.",
      "It uses Three.js to make the dataset spatial and inspectable, rather than presenting political answers only as tables or long text.",
      "This project is a concrete example of my interest in computational social science: using visualization to make social and political data easier to reason about."
    ],
    category: "Data Visualization",
    tech: ["HTML", "JavaScript", "Three.js", "UMAP", "PCA", "Static Site"],
    appUrl: "https://yomiuri-election-2026.web.app",
    githubUrl: "https://github.com/ryouy/election2026",
    featured: true
  },
  {
    title: "Kendo Shokai",
    description:
      "A playful website for the University of Aizu Kendo Club with Japanese and English pages.",
    details: [
      "This site introduces the club in a friendlier way than a standard announcement page, making it easier for new students and visitors to understand the atmosphere of the group.",
      "I designed it with a soft, memorable visual identity so the club feels approachable while still keeping the information clear.",
      "The project also reflects my own connection to kendo and my interest in building small websites that serve real communities."
    ],
    category: "Club Site",
    tech: ["Next.js", "TypeScript", "CSS"],
    appUrl: "https://ryouy.github.io/kendo-shokai",
    githubUrl: "https://github.com/ryouy/kendo-shokai",
    featured: false
  },
  {
    title: "6roPnt",
    description:
      "A small browser app for drawing on a rotating pottery-wheel-like canvas.",
    details: [
      "6roPnt lets users drag inside a circular canvas while it rotates, creating repeated radial strokes with adjustable color, brush size, rotation speed, and copy count.",
      "It is a compact HTML/CSS/JavaScript experiment that turns a simple drawing surface into a playful generative art tool."
    ],
    category: "Experiment",
    tech: ["HTML", "CSS", "JavaScript", "Canvas"],
    appUrl: "https://6ro-pnt.vercel.app",
    githubUrl: "https://github.com/ryouy/6roPnt",
    featured: false
  },
  {
    title: "Graduation Thesis",
    description:
      "A research-oriented repository connected to graduation thesis work in data science.",
    details: [
      "This repository is a place for thesis-related experiments, notebooks, and analysis work rather than a polished public app.",
      "It represents the research side of my portfolio: asking questions, testing methods, and organizing data-driven investigation in a reproducible way."
    ],
    category: "Research",
    tech: ["Jupyter Notebook", "Data Science", "Research"],
    appUrl: "",
    githubUrl: "https://github.com/ryouy/GraduationThesis",
    featured: false
  },
  {
    title: "LineChatViewer",
    description:
      "A TypeScript project for viewing and working with LINE chat-style data.",
    details: [
      "The project is focused on making chat-style records easier to inspect and handle through a typed web-oriented codebase.",
      "It fits my broader interest in turning everyday digital data into interfaces that are easier to read, filter, and understand."
    ],
    category: "Tool",
    tech: ["TypeScript"],
    appUrl: "https://line-chat-viewer.vercel.app",
    githubUrl: "https://github.com/ryouy/LineChatViewer",
    featured: false
  }
];
