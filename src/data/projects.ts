export type Project = {
  title: string;
  description: string;
  details: string[];
  category: "Web App" | "Data Visualization" | "Tool" | "Experiment" | "Club Site" | "Research" | "Game";
  tech: string[];
  appUrl: string;
  githubUrl: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    title: "English as Code",
    description:
      "An English-learning tool that visualizes grammar as programming-style expressions while preserving the original words.",
    details: [
      "A deterministic tokenizer and parser build a syntax tree, with Simple, Structure, and Grammar views plus a word-level inspector.",
      "The rule-based engine handles constructions including passives and relative clauses; hundreds of golden-corpus test cases support regression testing."
    ],
    category: "Tool",
    tech: ["TypeScript", "Express", "JavaScript", "AST", "Parsing"],
    appUrl: "https://english-as-code-indol.vercel.app/",
    githubUrl: "https://github.com/ryouy/English_as_Code",
    featured: true
  },
  {
    title: "Tiny City Sites",
    description:
      "Student-led small-business website design with ten distinct fictional shop demos.",
    details: [
      "The portfolio showcases approachable website design for local restaurants, cafés, and independent stores, with individual concepts for ten businesses.",
      "Each demo is an independent Astro site; a shared build pipeline bundles them into one deployable showcase."
    ],
    category: "Web App",
    tech: ["Astro", "JavaScript", "CSS", "Vercel"],
    appUrl: "https://tiny-city-sites.vercel.app/",
    githubUrl: "https://github.com/ryouy/tiny-city-sites",
    featured: true
  },
  {
    title: "Shaberu Kakinoki",
    description:
      "A mobile-first prototype for collectively looking after a playful persimmon-tree character.",
    details: [
      "Eight-question diagnosis, timed watering missions, quizzes, rankings, badges, and a reviewable administration screen demonstrate the product flow.",
      "Weather and tree conditions are simulated; progress is saved in local storage, without live AI, sensors, shared databases, or authentication."
    ],
    category: "Web App",
    tech: ["HTML", "CSS", "JavaScript", "Local Storage"],
    appUrl: "https://shabe-kaki.vercel.app",
    githubUrl: "https://github.com/ryouy/shabe-kaki",
    featured: true
  },
  {
    title: "University of Aizu Admissions Explorer",
    description:
      "An interactive visualization of enrollment by Japanese prefecture at the University of Aizu.",
    details: [
      "The dataset contains prefecture-level admissions across academic years 2016–2026, including an eleven-year total.",
      "Vite and Plotly.js turn the CSV into a visual explorer for comparing the university's geographic intake over time."
    ],
    category: "Data Visualization",
    tech: ["Vite", "JavaScript", "Plotly.js", "CSV"],
    appUrl: "",
    githubUrl: "https://github.com/ryouy/UoA_admin_stats",
    featured: true
  },
  {
    title: "KAKI LINK",
    description:
      "An IoT- and AI-inspired concept app for shared persimmon orchard management.",
    details: [
      "The demo combines tree status, watering, growth logs, reservations, shared management, community chat, and reward points.",
      "Automatic watering, cameras, and the AI persimmon character are demonstrated as product concepts rather than claims of deployed orchard hardware."
    ],
    category: "Web App",
    tech: ["Web App", "IoT Concept", "AI Chat", "Prototype"],
    appUrl: "https://ryouy.github.io/kaki-link/",
    githubUrl: "https://github.com/ryouy/kaki-link",
    featured: true
  },
  {
    title: "Mechanistic Interpretability Research",
    description:
      "An undergraduate thesis workspace investigating how internal language-model states evolve through reasoning.",
    details: [
      "Experiments study hidden-state trajectories and concept activation under negation, replacement, and other prompting conditions with open-weight language models.",
      "Research in progress examines attractors, self-loops, and activation steering through notebooks, layerwise analyses, and model probes."
    ],
    category: "Research",
    tech: ["Python", "PyTorch", "Transformers", "Qwen", "Jupyter"],
    appUrl: "",
    githubUrl: "https://github.com/ryouy/GraduationThesis",
    featured: true
  },
  {
    title: "Personalized TV Viewing Prediction",
    description:
      "A machine-learning prototype predicting an individual's viewing interest from behavioral context and media content.",
    details: [
      "The project combines smartphone step history and weather with a model of whether a person is at home.",
      "Search-history text and transcribed advertisement content are compared using TF–IDF and cosine similarity, complementing a Random Forest predictor."
    ],
    category: "Research",
    tech: ["Python", "scikit-learn", "Whisper", "TF–IDF"],
    appUrl: "",
    githubUrl: "https://github.com/ryouy/Hakuhodo_ChatGPT",
    featured: false
  },
  {
    title: "MapChart for Swift",
    description:
      "A native Apple-platform prototype exploring interactive chart rendering and custom graphics.",
    details: [
      "An Xcode application exercises graph drawing, view management, and chart interactions in Swift.",
      "Test targets accompany the learning-oriented iOS/macOS graphics experiments; it is not presented as a released charting library."
    ],
    category: "Experiment",
    tech: ["Swift", "Xcode", "CoreGraphics", "iOS"],
    appUrl: "",
    githubUrl: "https://github.com/ryouy/MapChart",
    featured: false
  },
  {
    title: "Flutter Development Training",
    description:
      "A collection of Flutter mobile application samples created during training in Da Nang.",
    details: [
      "The repository documents practice with Flutter layouts, state management, navigation, and platform-specific integration.",
      "It contains multiple learning projects for Android and iOS rather than one released consumer application."
    ],
    category: "Experiment",
    tech: ["Flutter", "Dart", "Android", "iOS"],
    appUrl: "",
    githubUrl: "https://github.com/ryouy/Flutter-Training",
    featured: false
  },
  {
    title: "Computer Graphics Exercises",
    description:
      "Programming exercises exploring core graphics concepts, including 3D viewing and geometric rendering.",
    details: [
      "The coursework repository includes random-walk triangle experiments and three-dimensional viewing exercises.",
      "Result write-ups and implementations document practical learning in rendering and visualization."
    ],
    category: "Experiment",
    tech: ["Computer Graphics", "3D", "Rendering", "Coursework"],
    appUrl: "",
    githubUrl: "https://github.com/ryouy/CG_exercises",
    featured: false
  },

  {
    title: "Viewport City",
    description:
      "A browser puzzle where window size, scrolling, zoom, and tab visibility become the physical laws of a city.",
    details: [
      "Viewport City turns the browser itself into the controller: resizing the window, scrolling, changing zoom, and hiding the tab alter the world and unlock each stage.",
      "On-screen sliders mirror the unusual desktop controls so every puzzle remains playable on mobile without losing the central idea.",
      "Progress and best records stay in local storage, while hints, pause controls, keyboard shortcuts, and tested game logic make the one-screen experiment feel complete."
    ],
    category: "Game",
    tech: ["JavaScript", "Vite", "HTML", "CSS", "Local Storage"],
    appUrl: "https://screen-game.vercel.app",
    githubUrl: "https://github.com/ryouy/screen_game",
    featured: true
  },
  {
    title: "Window-Light Cipher City",
    description:
      "A night-city puzzle about switching linked windows and decoding the secrets hidden in their lights.",
    details: [
      "Each move flips a window and its connected neighbors, gradually revealing patterns and clues across eight data-driven stages.",
      "Investigations add conversations and records to a notebook, blending a light-switching logic puzzle with a small urban mystery.",
      "Undo, redo, hints, keyboard and touch controls, persistent progress, and reachability tests support a polished play experience across screen sizes."
    ],
    category: "Game",
    tech: ["React", "TypeScript", "Vite", "Vitest", "Local Storage"],
    appUrl: "https://window-game.vercel.app",
    githubUrl: "https://github.com/ryouy/window_game",
    featured: true
  },
  {
    title: "Azusagawa Letter",
    description:
      "A story puzzle about guiding a letter from the Northern Alps to Azumino through water, weather, time, and careful wrapping.",
    details: [
      "Players study clues in the landscape, choose packaging and attachments, then select a time, weather condition, and waterway before sending the letter downstream.",
      "Eight stages use deterministic route rules and visible delivery paths, letting failed attempts become information for the next plan.",
      "Its picture-book and old-map visual language is paired with keyboard support, reduced-motion and high-contrast modes, persistent progress, and end-to-end checks."
    ],
    category: "Game",
    tech: ["React", "TypeScript", "Vite", "SVG", "Vitest"],
    appUrl: "https://game-letter-flow.vercel.app",
    githubUrl: "https://github.com/ryouy/game_letter",
    featured: true
  },
  {
    title: "Azumino Mountain Time",
    description:
      "A scoreless interactive landscape for quietly watching Azumino's fields and the Northern Alps change with time and weather.",
    details: [
      "The sky, mountains, and rice fields move continuously from morning into night across four seasons and conditions including mist, rain, snow, moonlight, and alpenglow.",
      "Six viewpoints, rippling water, birds, clouds, and procedural Web Audio ambience create a place to observe rather than a goal to complete.",
      "Favorite scenes can be restored later, while the interface fades away completely so the landscape, responsive controls, and low-motion option remain at the center."
    ],
    category: "Experiment",
    tech: ["React", "TypeScript", "Vite", "Web Audio API", "CSS"],
    appUrl: "https://game-scenery.vercel.app",
    githubUrl: "https://github.com/ryouy/game_scenery",
    featured: true
  },
  {
    title: "Cloudsea Path",
    description:
      "A mountain-observation puzzle where light, wind, cloud height, and temperature determine whether a safe route can be seen.",
    details: [
      "Across eight fictional mountain stages, players tune environmental instruments, record visible landmarks, reject deceptive routes, and wait for stable visibility before moving.",
      "Continuous visibility calculations make the illustrated landscape respond to every adjustment, turning observation into the main puzzle mechanic instead of simple trial and error.",
      "A field notebook, progressive hints, undo, topographic view, checklists, responsive keyboard controls, and tested route logic support the expedition from start to finish."
    ],
    category: "Game",
    tech: ["React", "TypeScript", "Vite", "Vitest", "Playwright"],
    appUrl: "https://game-cloudsea-view.vercel.app/",
    githubUrl: "https://github.com/ryouy/game_cloudsea",
    featured: true
  },
  {
    title: "Audio Intelligence",
    description:
      "A Streamlit app that turns YouTube videos and uploaded audio into acoustic, linguistic, and semantic insights.",
    details: [
      "Audio Intelligence brings waveform, loudness, frequency, pitch, and tempo analysis together with transcription, speaker separation, emotion cues, and semantic search.",
      "It uses Whisper for speech recognition and can call OpenAI to suggest low-information filler words before excluding them from the analysis with the user's approval.",
      "The project packages a broad audio-analysis pipeline into an approachable visual workspace, with interactive charts, exports, tests, and optional Docker deployment."
    ],
    category: "Data Visualization",
    tech: ["Python", "Streamlit", "Whisper", "librosa", "OpenAI API"],
    appUrl: "https://ytaudio-analyzer.streamlit.app/",
    githubUrl: "https://github.com/ryouy/audio-analyzer",
    featured: true
  },
  {
    title: "Comment Analysis",
    description:
      "An exploratory dashboard for visualizing the space between a news article and the conversation around it.",
    details: [
      "Paste a public news URL or provide JSON, CSV, or manual input to explore emotion, discussion topics, minority opinions, diffusion, and the quality of the conversation.",
      "Views such as Opinion Galaxy, the emotion seismograph, perception gaps, topic drift, and headline analysis turn large comment sets into structures that are easier to inspect.",
      "The analysis combines browser-based content collection with statistical and machine-learning methods, while remaining usable without an OpenAI API key."
    ],
    category: "Data Visualization",
    tech: ["Python", "Streamlit", "Plotly", "scikit-learn", "OpenAI API"],
    appUrl: "https://yhcomment-analysis.streamlit.app/",
    githubUrl: "https://github.com/ryouy/comment-analysis",
    featured: true
  },
  {
    title: "Mindscape AI",
    description:
      "An opinion-space visualizer that follows how multiple AI personas move across a topic over time.",
    details: [
      "Mindscape AI generates opinions from multiple personas at multiple points in time, then places them in a shared semantic space using OpenAI embeddings, UMAP, and KMeans.",
      "Users can add their own position, find nearby or distant viewpoints, animate changes over time, and zoom semantically into individual clusters.",
      "LLM-generated cluster names and CSV export make the visualization useful both for open-ended exploration and for taking the generated data into further analysis."
    ],
    category: "Data Visualization",
    tech: ["Python", "Streamlit", "OpenAI", "UMAP", "Plotly"],
    appUrl: "https://mindscapeai.streamlit.app/",
    githubUrl: "https://github.com/ryouy/MindscapeAI",
    featured: true
  },
  {
    title: "Memories",
    description:
      "A personal travel journal for collecting trips, photographs, locations, and stories in one place.",
    details: [
      "Memories presents travel entries as a fast public website while keeping the underlying stories and uploaded media in repository-managed content.",
      "Dedicated entry pages combine written records with photos, maps, and embedded media, making each trip feel more like a place to revisit than a conventional blog post.",
      "A protected admin workflow supports creating and maintaining entries, while content validation and indexing scripts keep the published collection dependable."
    ],
    category: "Web App",
    tech: ["Next.js", "React", "TypeScript", "Leaflet", "Markdown"],
    appUrl: "https://trvlmmrs.vercel.app/",
    githubUrl: "https://github.com/ryouy/memories",
    featured: true
  },
  {
    title: "VR Catch Stick Game",
    description:
      "A Unity VR reflex game where players use hand tracking to catch randomly falling sticks.",
    details: [
      "The game uses XR Hands so the player can interact directly with their hands instead of relying on controller-only input.",
      "A random stick drops from an overhead holder, and the player earns score by catching it quickly through XR grab interaction.",
      "The project combines core VR interaction pieces: hand tracking, front-facing UI, object grabbing, score updates, and sound feedback."
    ],
    category: "Game",
    tech: ["Unity", "C#", "XR Hands", "XR Interaction Toolkit", "OpenXR"],
    appUrl: "https://unityroom.com/games/stick_catch",
    githubUrl: "https://github.com/ryouy/VR_project",
    featured: true
  },
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
    title: "Art Gallery",
    description:
      "A quiet gallery site for presenting paintings and photographs through a clean, image-first interface.",
    details: [
      "The site is designed as a small online gallery with separate spaces for paintings and photos, keeping the visual language restrained so the works stay at the center.",
      "Content is managed through markdown files with frontmatter and image files in public folders, so new works can be added from GitHub without a CMS or database.",
      "It uses Next.js App Router, TypeScript, and Tailwind CSS to support listing pages, detail pages, responsive grids, and post-order or random-order browsing."
    ],
    category: "Web App",
    tech: ["Next.js", "TypeScript", "Tailwind CSS", "Markdown", "Vercel"],
    appUrl: "https://ryouy-gallery.vercel.app",
    githubUrl: "https://github.com/ryouy/art-gallery",
    featured: true
  },
  {
    title: "KUPOO",
    description:
      "A lively web gallery for the University of Aizu's unofficial drawing circle, KUPOO.",
    details: [
      "The site introduces KUPOO as an informal drawing circle at the University of Aizu and gives the group a colorful public home for its identity, artwork, members, and contact information.",
      "It presents recent works through gallery pages backed by local markdown and JSON content, keeping the public site fast while still making the content easy to maintain in the repository.",
      "The project also includes an admin page that can add, edit, and delete artworks, site text, and members through the GitHub API, connecting a playful front-facing site with practical content operations."
    ],
    category: "Club Site",
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "GitHub API"],
    appUrl: "https://kupoo.vercel.app",
    githubUrl: "https://github.com/ryouy/kupoo",
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
    title: "6ro paint",
    description:
      "A small browser app for drawing on a rotating pottery-wheel-like canvas.",
    details: [
      "This app lets users drag inside a circular canvas while it rotates, creating repeated radial strokes with adjustable color, brush size, rotation speed, and copy count.",
      "It is a compact HTML/CSS/JavaScript experiment that turns a simple drawing surface into a playful generative art tool."
    ],
    category: "Experiment",
    tech: ["HTML", "CSS", "JavaScript", "Canvas"],
    appUrl: "https://6ro-pnt.vercel.app",
    githubUrl: "https://github.com/ryouy/6roPnt",
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
  },
  {
    title: "Yahoo Shorts Studio",
    description:
      "A local production studio that turns Yahoo! JAPAN News articles and comments into narrated vertical videos.",
    details: [
      "The workflow brings article discovery, comment collection, AI-assisted script writing, human editing and approval, text-to-speech, thumbnails, and vertical video rendering into one resumable browser app.",
      "FastAPI, React, and SQLite replace an earlier notebook pipeline, while job history and per-article retries make long-running production work easier to recover and manage.",
      "OpenAI Structured Outputs, browser automation, edge-tts, and ffmpeg support the path from a selected story to an exported MP4 and project archive."
    ],
    category: "Tool",
    tech: ["Python", "FastAPI", "React", "SQLite", "OpenAI API", "ffmpeg"],
    appUrl: "",
    githubUrl: "https://github.com/ryouy/yahoo2shorts",
    featured: false
  },
  {
    title: "heic2jpg",
    description:
      "A macOS toolkit for organizing Google Takeout media while converting HEIC photos and preserving useful metadata.",
    details: [
      "The scripts collect HEIC, JPG, PNG, and video files into one folder, prefer existing JPG copies, convert HEIC-only photos, and merge capture time and GPS data from Google Photos sidecar JSON files.",
      "Additional commands rename images by capture time, compress JPEGs toward a target size, and optionally reduce dimensions when quality changes alone are not enough.",
      "The workflow uses macOS sips and ExifTool to keep a large photo export practical without discarding the metadata needed to sort and revisit it."
    ],
    category: "Tool",
    tech: ["Python", "ExifTool", "sips", "Pillow", "Google Takeout"],
    appUrl: "",
    githubUrl: "https://github.com/ryouy/heic2jpg",
    featured: false
  },
  {
    title: "AI News Reader",
    description:
      "A small AI-first news reader that filters the feed before it reaches the reader instead of adding more content.",
    details: [
      "Articles from Yahoo! JAPAN News are evaluated for relevance, importance, and usefulness so gossip, sensational stories, and clickbait can be removed before the feed is shown.",
      "Each selected item includes a short summary and a reason for appearing, while natural-language preferences and local browsing history shape the experience.",
      "A deliberate ten-story daily limit keeps the interface focused on controlling information intake rather than encouraging endless scrolling."
    ],
    category: "Web App",
    tech: ["Next.js", "React", "TypeScript", "OpenAI API", "Local Storage"],
    appUrl: "https://anr-ryouy.vercel.app/",
    githubUrl: "https://github.com/ryouy/ANR",
    featured: false
  },
  {
    title: "Hakuhodo 24",
    description:
      "A Google Colab pipeline that analyzes presentation material and develops it into a new IT service proposal for students.",
    details: [
      "The notebook combines PDF slide images and PowerPoint text for multimodal analysis, then asks generated student personas to discuss problems, common needs, and possible solutions.",
      "The resulting service concept is structured as JSON and expanded into generated proposal imagery and a Marp Markdown presentation.",
      "It connects document understanding, persona-led ideation, and proposal production in a single reproducible notebook workflow."
    ],
    category: "Research",
    tech: ["Python", "Jupyter", "Google Colab", "OpenAI API", "Marp"],
    appUrl: "",
    githubUrl: "https://github.com/ryouy/hakuhodo-24",
    featured: false
  },
  {
    title: "Kaki Talk Demo",
    description:
      "An AI conversation demo where an old persimmon tree responds through its own personality, senses, and memory of care.",
    details: [
      "Users can talk with the tree, water it, or clear weeds while temperature, humidity, soil moisture, and light change how the illustrated character looks and speaks.",
      "The tree persona, recent conversation, environmental readings, and care history are assembled into the model context so responses remain grounded in the character's physical point of view.",
      "Local storage preserves the simulated tree state and chat history, creating a compact experiment in giving a living environment an AI interface."
    ],
    category: "Experiment",
    tech: ["Next.js", "React", "TypeScript", "OpenAI API", "Local Storage"],
    appUrl: "https://kaki-talk-demo.vercel.app",
    githubUrl: "https://github.com/ryouy/kaki-talk-demo",
    featured: false
  },
  {
    title: "Simple Pomodoro",
    description:
      "A customizable Chrome extension for moving smoothly between focused work sessions and restorative breaks.",
    details: [
      "The extension lets users tailor work and break durations, session counts, alarm sounds, color themes, automatic transitions, notifications, and skipping to match their own focus rhythm.",
      "Its timer continues after the popup closes, while preferences and session state stay entirely within the browser for a dependable, privacy-friendly workflow.",
      "A companion web version shares the same lightweight interface, making the core Pomodoro experience available beyond the extension popup."
    ],
    category: "Tool",
    tech: ["JavaScript", "Chrome Extension", "Manifest V3", "HTML", "CSS"],
    appUrl: "https://pomodoro-chrome-extension.vercel.app/",
    githubUrl: "https://github.com/ryouy/pomodoro-chrome-extension",
    featured: false
  }
];
