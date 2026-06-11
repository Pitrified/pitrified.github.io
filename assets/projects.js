/* ──────────────────────────────────────────────────────────────────────────
 * Single source of truth for the whole site.
 *
 * CATEGORIES  - the top-level bubbles on the landing page, one per section page.
 * PROJECTS    - every project, tagged into one or more categories. A project's
 *               colour comes from its FIRST category (its "home"), so a repo
 *               keeps the same identity even when cross-listed (e.g. lang-tools
 *               shows blue on both /language-learning and /libraries).
 *
 * `repo`  bridges the bubble id to the repomgr / GitHub repo name, so the
 *         dependency graph (tools/gen_graph.py) can line up with these bubbles.
 *         `null` = not a tracked Python repo (won't appear in the dep graph).
 * `x`,`y` are percentage coordinates used only by the dense /all map.
 * ────────────────────────────────────────────────────────────────────────── */

const CATEGORIES = {
  simulation: {
    label: "simulation",
    url: "/simulation/",
    color: "#3ab8b8",
    desc: "LLM-driven life simulation.",
  },
  recipes: {
    label: "recipes",
    url: "/recipes/",
    color: "#f07a5a",
    desc: "Capture, parse & store recipes.",
  },
  "language-learning": {
    label: "language",
    url: "/language-learning/",
    color: "#5a8af0",
    desc: "Apps & tools for learning languages.",
  },
  travel: {
    label: "travel",
    url: "/travel/",
    color: "#5adcf0",
    desc: "Maps, places & trip planning.",
  },
  xr: {
    label: "xr",
    url: "/xr/",
    color: "#f05ab8",
    desc: "Pose tracking & spatial computing.",
  },
  misc: {
    label: "misc",
    url: "/misc/",
    color: "#f0c95a",
    desc: "Odds and ends.",
  },
  libraries: {
    label: "libraries",
    url: "/libraries/",
    color: "#7a5af0",
    desc: "Reusable Python libs, with a dependency graph.",
  },
  infra: {
    label: "infra",
    url: "/infra/",
    color: "#5af078",
    desc: "The box, dotfiles & fleet tooling.",
  },
  about: {
    label: "about",
    url: "/about/",
    color: "#b8f05a",
    desc: "Who I am - a timeline.",
  },
};

const GH = "https://github.com/Pitrified/";

const PROJECTS = [
  // ── AI / Simulation ──
  { id: "laife", name: "lAIfe", repo: "laife",
    desc: "LLM-driven life simulation. Autonomous AI agents, Pygame + asyncio.",
    tags: "python · llm · game", categories: ["simulation"], x: 50, y: 7 },

  // ── Recipe Domain ──
  { id: "kit-hub", name: "kit-hub", repo: "kit-hub",
    desc: "Recipe management app. LLM parsing, voice notes, HTMX interface.",
    tags: "python · fastapi", categories: ["recipes"], x: 12.5, y: 17.75 },
  { id: "recipamatic", name: "recipamatic", repo: "recipamatic",
    desc: "Recipe ingestion pipeline. Scrapes Instagram reels, downloads media.",
    tags: "python · svelte", categories: ["recipes"], x: 37.5, y: 17.75 },
  { id: "recipinator", name: "recipinator", repo: "recipinator",
    desc: "Recipe CRUD service. Normalized model, FastAPI + React.",
    tags: "python · react", categories: ["recipes"], x: 62.5, y: 17.75 },
  { id: "cookbook", name: "cookbook", repo: "cookbook",
    desc: "Personal recipe site in Italian. Jekyll + GitHub Pages.",
    tags: "jekyll · italian", categories: ["recipes"], x: 87.5, y: 17.75 },

  // ── Language Learning ──
  { id: "lang-tools", name: "lang-tools", repo: "lang-tools",
    desc: "Language learning core. Word ingestion, data, and management. Git LFS.",
    tags: "python · language", categories: ["language-learning", "libraries"], x: 8.5, y: 28.5 },
  { id: "convo-craft", name: "convo-craft", repo: "convo_craft",
    desc: "Bilingual conversation practice via LLM. Streamlit + LangChain.",
    tags: "python · llm", categories: ["language-learning"], x: 25, y: 28.5 },
  { id: "br-bites", name: "br-bites", repo: "brazilian-bites",
    desc: "Flashcard app focused on false friends. React + Supabase.",
    tags: "react · portuguese", categories: ["language-learning"], x: 41.5, y: 28.5 },
  { id: "worldly-words", name: "worldly-words", repo: "worldly-words",
    desc: "Multilingual Wordle clone. React + Tailwind.",
    tags: "react · language", categories: ["language-learning"], x: 58.5, y: 28.5 },
  { id: "fala-comigo", name: "fala-comigo", repo: "fala-comigo-ai-tutor",
    desc: "AI language tutor. LLM conversation practice app.",
    tags: "react · llm", categories: ["language-learning"], x: 75, y: 28.5 },
  { id: "go-accenter", name: "go-accenter", repo: "go-accenter",
    desc: "Accent placement practice for Portuguese. CLI tool in Go.",
    tags: "go · language", categories: ["language-learning"], x: 91.5, y: 28.5 },

  // ── Travel / Maps ──
  { id: "places-tools", name: "places-tools", repo: "places-tools",
    desc: "Google Maps/Places library. Takeout parsing, place details, geo utils.",
    tags: "python · maps", categories: ["travel", "libraries"], x: 30, y: 39.25 },
  { id: "trip-me-up", name: "trip-me-up", repo: "trip-me-up",
    desc: "Trip planner from Google Maps saved lists. Itinerary and distance planning.",
    tags: "python · maps", categories: ["travel"], x: 70, y: 39.25 },

  // ── Extended Reality ──
  { id: "pose-tools", name: "pose-tools", repo: "pose-tools",
    desc: "Pose tracking library. MediaPipe integration, homography utilities.",
    tags: "python · cv", categories: ["xr", "libraries"], x: 12.5, y: 50 },
  { id: "climbing-wire", name: "climbing-wire", repo: "climbing-wire",
    desc: "Pose tracking on climbing videos. MediaPipe + DTW alignment.",
    tags: "python · cv", categories: ["xr"], x: 37.5, y: 50 },
  { id: "holo-table", name: "holo-table", repo: "holo-table",
    desc: "Air pinch-to-zoom via MediaPipe hands. Touchless display control.",
    tags: "python · cv", categories: ["xr"], x: 62.5, y: 50 },
  { id: "abyss", name: "abyss", repo: "abyss",
    desc: "3D viewer geometry. Viewer and screen position visualization.",
    tags: "python · cv", categories: ["xr"], x: 87.5, y: 50 },

  // ── Epub handling (misc) ──
  { id: "interleaver", name: "interleaver", repo: null,
    desc: "Interleaves two epubs paragraph by paragraph. Bilingual ebooks for language learning.",
    tags: "python · epub", categories: ["misc", "libraries"], x: 50, y: 60.75 },

  // ── Framework / Tooling (core libraries) ──
  { id: "llm-core", name: "llm-core", repo: "llm-core",
    desc: "LLM tooling library. Structured chains, versioned prompts, multi-provider.",
    tags: "python · llm", categories: ["libraries"], x: 10, y: 71.5 },
  { id: "fastapi-tools", name: "fastapi-tools", repo: "fastapi-tools",
    desc: "FastAPI toolkit. OAuth, sessions, HTMX, CSP middleware, Jinja2.",
    tags: "python · fastapi", categories: ["libraries"], x: 30, y: 71.5 },
  { id: "media-dl", name: "media-dl", repo: "media-downloader",
    desc: "Media download service. Instagram, YouTube, web recipes, transcription.",
    tags: "python · fastapi", categories: ["libraries"], x: 50, y: 71.5 },
  { id: "py-template", name: "py-template", repo: "python-project-template",
    desc: "Python project scaffold. uv, ruff, pyright, MkDocs, FastAPI.",
    tags: "python · scaffold", categories: ["libraries"], x: 70, y: 71.5 },
  { id: "py-tools", name: "py-tools", repo: "python-tools",
    desc: "General Python utilities. Config, logging, helpers (Singleton, etc).",
    tags: "python · lib", categories: ["libraries"], x: 90, y: 71.5 },

  // ── Interfaces / Bots ──
  { id: "tg-bot", name: "tg-bot", repo: "tg-central-hub-bot",
    desc: "Telegram bot + webapp. Primary interface to the linux-box ecosystem.",
    tags: "python · telegram", categories: ["infra"], x: 50, y: 82.25 },

  // ── Infrastructure ──
  { id: "linux-box", name: "linux-box", repo: "linux-box-cloudflare",
    desc: "Home server ecosystem. Cloudflare Tunnel, all services, one box.",
    tags: "devops · infra", categories: ["infra"], x: 12.5, y: 93 },
  { id: "dotfiles", name: "dotfiles", repo: "dotfiles",
    desc: "Personal dotfiles. Shell, editor, personalization. Custom Python manager.",
    tags: "shell · config", categories: ["infra"], x: 37.5, y: 93 },
  { id: "repomgr", name: "repomgr", repo: "repomgr",
    desc: "Repo fleet manager. Status, fetch, dep updates across all repos.",
    tags: "python · cli", categories: ["infra"], x: 62.5, y: 93 },
  { id: "github-io", name: "github.io", repo: "pitrified.github.io",
    desc: "Personal static site. This site. Pure static, GitHub Pages.",
    tags: "static · site", categories: ["infra"], x: 87.5, y: 93 },
];

// Attach the GitHub repo URL to every project (used as the bubble link).
for (const p of PROJECTS) {
  p.url = GH + (p.repo ?? p.id);
}

// Map repomgr repo name -> bubble id, for the dependency graph renderer.
const REPO_TO_ID = {};
for (const p of PROJECTS) {
  if (p.repo) REPO_TO_ID[p.repo] = p.id;
}
