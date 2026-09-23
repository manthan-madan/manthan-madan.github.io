/* =============================================
   Content — edit these two arrays to update the
   Projects and Skills sections. No HTML needed.
============================================= */
const PROJECTS = [
  {
    icon: "🧭",
    title: "Project One",
    year: "2026",
    description:
      "One or two sentences on what the project does and the problem it solves. Lead with the outcome, not the tech.",
    tags: ["React", "Node", "PostgreSQL"],
    demo: "#",
    source: "#",
  },
  {
    icon: "📊",
    title: "Project Two",
    year: "2025",
    description:
      "Another project. Mention scale or results where you have them — users served, latency cut, hours saved.",
    tags: ["Python", "FastAPI", "Docker"],
    demo: "#",
    source: "#",
  },
  {
    icon: "⚡",
    title: "Project Three",
    year: "2025",
    description:
      "A smaller build or experiment. Even weekend projects count if you can say what you learned from them.",
    tags: ["TypeScript", "Vite"],
    demo: "",
    source: "#",
  },
];

const SKILLS = [
  { group: "Languages", items: ["JavaScript", "TypeScript", "Python", "Java", "SQL"] },
  { group: "Frontend", items: ["React", "HTML", "CSS", "Tailwind", "Vite"] },
  { group: "Backend", items: ["Node.js", "Express", "FastAPI", "PostgreSQL", "REST"] },
  { group: "Tools", items: ["Git", "Docker", "AWS", "Figma", "Linux"] },
];

/* =============================================
   Rendering
============================================= */
function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

function renderProjects() {
  const grid = document.getElementById("projectGrid");
  if (!grid) return;

  grid.innerHTML = PROJECTS.map((project) => {
    const tags = project.tags
      .map((tag) => `<li class="tag">${escapeHtml(tag)}</li>`)
      .join("");

    const links = [
      project.demo ? `<a href="${escapeHtml(project.demo)}">Live demo →</a>` : "",
      project.source ? `<a href="${escapeHtml(project.source)}">Source →</a>` : "",
    ].join("");

    return `
      <article class="project-card reveal">
        <div class="project-head">
          <span class="project-icon" aria-hidden="true">${escapeHtml(project.icon)}</span>
          <span class="project-year">${escapeHtml(project.year)}</span>
        </div>
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(project.description)}</p>
        <ul class="tag-row">${tags}</ul>
        <div class="project-links">${links}</div>
      </article>`;
  }).join("");
}

function renderSkills() {
  const grid = document.getElementById("skillsGrid");
  if (!grid) return;

  grid.innerHTML = SKILLS.map((section) => {
    const items = section.items
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join("");

    return `
      <div class="skill-group reveal">
        <h3>${escapeHtml(section.group)}</h3>
        <ul>${items}</ul>
      </div>`;
  }).join("");
}

/* =============================================
   Theme
============================================= */
function initTheme() {
  const root = document.documentElement;
  const toggle = document.getElementById("themeToggle");

  let stored = null;
  try {
    stored = localStorage.getItem("theme");
  } catch (err) {
    /* storage blocked — fall back to system preference */
  }

  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  root.dataset.theme = stored || (prefersLight ? "light" : "dark");

  toggle?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch (err) {
      /* ignore */
    }
  });
}

/* =============================================
   Mobile nav
============================================= */
function initNav() {
  const nav = document.getElementById("nav");
  const button = document.getElementById("menuToggle");
  if (!nav || !button) return;

  const setOpen = (open) => {
    nav.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", String(open));
    button.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  };

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setOpen(false);
  });
}

/* =============================================
   Header shadow + active section highlighting
============================================= */
function initScrollState() {
  const header = document.getElementById("siteHeader");
  const links = [...document.querySelectorAll(".nav-list a")];
  const sections = links
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const onScroll = () => {
    header?.classList.toggle("is-scrolled", window.scrollY > 8);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if (!sections.length) return;

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
          link.classList.toggle(
            "is-active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  sections.forEach((section) => spy.observe(section));
}

/* =============================================
   Reveal on scroll
============================================= */
function initReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry, index) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => entry.target.classList.add("is-visible"), index * 70);
        obs.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  items.forEach((item) => observer.observe(item));
}

/* =============================================
   Boot
============================================= */
initTheme();

document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  renderSkills();
  initNav();
  initScrollState();
  initReveal();

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
});
