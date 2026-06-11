#!/usr/bin/env python3
"""Generate the libraries dependency graph data (JSON only).

Reuses repomgr's dependency parsing: ``build_dep_graph`` reads each tracked
repo's ``pyproject.toml`` and returns ``{repo: [dep_repos]}`` for git-sourced
deps. We dedupe, keep only the connected sub-graph, and emit
``assets/graph.json`` in d3's ``{nodes, links}`` shape, keyed by repomgr repo
name. Labels and colours are resolved on the JS side from ``projects.js`` (the
single source of truth), so this script stays dumb about presentation.

Run from the repomgr environment so ``repomgr`` is importable, e.g.:

    cd ~/repos/repomgr && uv run python \\
        ~/repos/pitrified.github.io/tools/gen_graph.py \\
        --config ~/repos/linux-box-cloudflare/configs/repomgr/repos.toml

Edges are Python-only (only ``pyproject.toml`` git deps are visible); JS/Go
repos and unreferenced libs simply don't appear here.
"""

from __future__ import annotations

import argparse
import json
from pathlib import Path

from repomgr import deps as deps_mod
from repomgr.config.repos_config import load_config


def build_connected_graph(config_path: Path) -> dict[str, list[str]]:
    """Load config, build the dep graph, dedupe, keep only connected nodes."""
    config = load_config(config_path)
    raw = deps_mod.build_dep_graph(config.repos, config.repos_by_name)

    # dedupe each adjacency list, preserving order
    graph = {node: list(dict.fromkeys(deps)) for node, deps in raw.items()}

    # keep only nodes that participate in at least one edge
    connected: set[str] = set()
    for node, dep_list in graph.items():
        if dep_list:
            connected.add(node)
            connected.update(dep_list)

    return {n: [d for d in graph.get(n, []) if d in connected] for n in connected}


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--config", type=Path, required=True, help="repos.toml path")
    parser.add_argument(
        "--out",
        type=Path,
        default=Path(__file__).resolve().parent.parent / "assets" / "graph.json",
        help="output JSON file (default: ../assets/graph.json)",
    )
    args = parser.parse_args()

    graph = build_connected_graph(args.config.expanduser())

    nodes = sorted({n for n in graph} | {d for ds in graph.values() for d in ds})
    # link source = consumer, target = dependency it relies on
    links = sorted((n, d) for n, ds in graph.items() for d in ds)
    payload = {
        "nodes": [{"id": n} for n in nodes],
        "links": [{"source": a, "target": b} for a, b in links],
    }

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(json.dumps(payload, indent=2) + "\n", encoding="utf-8")
    print(f"wrote {len(nodes)} nodes, {len(links)} links to {args.out}")


if __name__ == "__main__":
    main()
