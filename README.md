# pitrified.github.io

Personal site served at <https://pitrified.github.io/> - a "project universe" of
bubbles linking out to every repo, grouped into domains.

Pure static HTML/CSS/JS. No build step, no Jekyll (`.nojekyll`). GitHub Pages
serves the repo root directly: **Settings → Pages → Deploy from a branch →
`main` / `/` (root)**. Push to `main` to publish.

## Structure

```
index.html                landing: the domain bubbles
<domain>/index.html        one page per domain (simulation, recipes, …)
all/index.html             every project on one dense map
libraries/index.html       core libs + the dependency graph
about/index.html           life + projects timeline
assets/
  projects.js              single source of truth: every project + category
  bubbles.js               renderer (reads a stage's data-* and injects bubbles)
  style.css                shared styles
  graph.js                 d3 force-directed dependency graph (libraries page)
  graph.json               generated graph data (see below)
sitemap.md                 generated index of all pages (see below)
tools/gen_graph.py         regenerates graph.json from repomgr
tools/gen_sitemap.py       regenerates sitemap.md + checks internal links
Makefile                   dev tasks - run `make` for the menu
```

## Make targets

```sh
make            # help menu (self-documenting from ## comments)
make serve      # serve locally at http://localhost:8000  (override PORT=…)
make sitemap    # regenerate sitemap.md (live links + broken-link check)
make check      # broken internal-link check only, no file written
make graph      # regenerate the dependency graph (needs the repomgr env)
```

### Adding / editing a project

Edit `assets/projects.js` only. Each project lists the `categories` it belongs
to, so cross-listing (e.g. `lang-tools` in both `language-learning` and
`libraries`) is just a second tag. A project's colour comes from its first
category. Page shells render themselves from this data via `bubbles.js`.

Bubbles expand on hover (pointer devices). On touch / no-hover devices
(`@media (hover: none)`), the first tap expands a bubble and the second tap
follows its link - handled in `bubbles.js` via a `.tapped` state mirroring the
`:hover` styles.

### Regenerating the dependency graph

`tools/gen_graph.py` reuses [repomgr](https://github.com/Pitrified/repomgr)'s
`build_dep_graph`, which parses each repo's `pyproject.toml` for git-sourced
deps. Run it from the repomgr environment (so `repomgr` is importable):

```sh
cd ~/repos/repomgr && uv run python \
  ~/repos/pitrified.github.io/tools/gen_graph.py \
  --config ~/repos/linux-box-cloudflare/configs/repomgr/repos.toml
```

It rewrites `assets/graph.json` (d3 `{nodes, links}`, keyed by repo name). The
`/libraries` page renders it client-side with `assets/graph.js` (d3 v7, force-
directed) - labels and colours are resolved there from `projects.js`, so the
JSON stays minimal and identity lives in one place. d3 loads from a pinned CDN
(SRI-checked) in `libraries/index.html`.

Edges are Python-only (only `pyproject.toml` git deps are visible); JS/Go repos
and unreferenced libs appear as bubbles but not in the graph.

### Sitemap & link check

`make sitemap` writes `sitemap.md` - a single page listing every page as a live
`pitrified.github.io` link (handy for browsing and spotting 404s) - and locally
flags any internal `href`/`src` that points at a missing file. `make check` runs
just the link check (exits non-zero on a break, so it's CI-friendly).

## Local preview

```sh
make serve                    # then open http://localhost:8000/
```

(Open a directory URL - paths are root-absolute, so `file://` won't resolve the
shared assets.)
