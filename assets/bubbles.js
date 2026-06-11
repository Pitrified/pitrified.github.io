/* ──────────────────────────────────────────────────────────────────────────
 * Bubble renderer. Reads the stage's data attributes and injects bubbles from
 * the shared PROJECTS / CATEGORIES data (projects.js, loaded first).
 *
 *   <div class="bubble-stage" data-landing></div>        landing: category bubbles
 *   <div class="bubble-stage" data-category="recipes">   one section's projects
 *   <div class="bubble-stage" data-category="all">       every project, dense map
 * ────────────────────────────────────────────────────────────────────────── */

function makeBubble({ href, label, name, desc, tag, color, x, y }) {
  const a = document.createElement("a");
  a.className = "bubble";
  a.href = href;
  a.dataset.label = label;
  if (color) a.style.setProperty("--accent-c", color);
  if (x != null) a.style.setProperty("--x", `${x}%`);
  if (y != null) a.style.setProperty("--y", `${y}%`);

  const content = document.createElement("div");
  content.className = "bubble-content";
  content.innerHTML =
    `<span class="bname"></span>` +
    `<span class="bdesc"></span>` +
    (tag ? `<span class="btag"></span>` : "");
  content.querySelector(".bname").textContent = name;
  content.querySelector(".bdesc").textContent = desc;
  if (tag) content.querySelector(".btag").textContent = tag;

  a.appendChild(content);
  return a;
}

function colorFor(project) {
  const home = project.categories[0];
  return CATEGORIES[home]?.color;
}

function renderLanding(stage) {
  for (const [key, cat] of Object.entries(CATEGORIES)) {
    stage.appendChild(
      makeBubble({
        href: cat.url,
        label: cat.label,
        name: cat.label,
        desc: cat.desc,
        color: cat.color,
      })
    );
  }
}

function renderProjects(stage, category) {
  const isAll = category === "all";
  const list = isAll
    ? PROJECTS
    : PROJECTS.filter((p) => p.categories.includes(category));

  for (const p of list) {
    stage.appendChild(
      makeBubble({
        href: p.url,
        label: p.name,
        name: p.name,
        desc: p.desc,
        tag: p.tags,
        color: colorFor(p),
        x: isAll ? p.x : null,
        y: isAll ? p.y : null,
      })
    );
  }
}

function staggerFloat(stage) {
  stage.querySelectorAll(".bubble").forEach((bubble, i) => {
    bubble.classList.add("floating");
    bubble.style.animationDelay = `${i * 0.9}s`;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".bubble-stage").forEach((stage) => {
    if ("landing" in stage.dataset) {
      stage.classList.add("bubble-stage--flow");
      renderLanding(stage);
    } else {
      const category = stage.dataset.category;
      const isAll = category === "all";
      stage.classList.add(isAll ? "bubble-stage--map" : "bubble-stage--flow");
      renderProjects(stage, category);
    }
    staggerFloat(stage);
  });
});
