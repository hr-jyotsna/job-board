/* Startup Jobs Board — reads everything from two published Google Sheet CSVs. */

const state = {
  jobs: [],
  filter: "Open",
  query: "",
};

function csvUrlFor(configured, fallback) {
  if (configured && configured.trim()) {
    // Cache-bust so edits made in the sheet show up without a hard refresh delay.
    const sep = configured.includes("?") ? "&" : "?";
    return configured.trim() + sep + "_ts=" + Date.now();
  }
  return fallback;
}

function fetchCsv(url) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      transformHeader: (h) => h.trim(),
      complete: (results) => resolve(results.data),
      error: (err) => reject(err),
    });
  });
}

function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0].toUpperCase()).join("");
}

function renderProfile(rows) {
  const row = rows && rows[0] ? rows[0] : {};
  const name = row["Name"] || "Recruiter";
  const title = row["Title"] || "";
  const bio = row["Bio"] || "";
  const email = row["Email"] || "";
  const phone = row["Phone"] || "";
  const linkedin = row["LinkedIn"] || "";
  const whatsapp = row["WhatsApp"] || "";
  const location = row["Location"] || "";
  const photo = row["Photo URL"] || "";

  document.getElementById("profile-name").textContent = name;
  document.getElementById("profile-title").textContent = [title, location].filter(Boolean).join(" · ");
  document.getElementById("profile-bio").textContent = bio;
  document.title = name ? `${name} — Startup Jobs Board` : "Startup Jobs Board";

  const avatar = document.getElementById("avatar");
  if (photo && photo.trim()) {
    avatar.style.backgroundImage = `url("${photo.trim()}")`;
    avatar.textContent = "";
  } else {
    avatar.textContent = initials(name);
  }

  const contactRow = document.getElementById("contact-row");
  contactRow.innerHTML = "";
  const links = [];
  if (email) links.push({ label: "✉ Email", href: email.startsWith("mailto:") ? email : `mailto:${email}` });
  if (whatsapp) links.push({ label: "💬 WhatsApp", href: whatsapp });
  else if (phone) links.push({ label: "📞 " + phone, href: `tel:${phone.replace(/\s+/g, "")}` });
  if (linkedin) links.push({ label: "in LinkedIn", href: linkedin });

  links.forEach((l) => {
    const a = document.createElement("a");
    a.href = l.href;
    a.textContent = l.label;
    a.target = "_blank";
    a.rel = "noopener";
    contactRow.appendChild(a);
  });
}

function normalizeStatus(s) {
  const v = (s || "").trim().toLowerCase();
  if (v.startsWith("open")) return "Open";
  if (v.startsWith("close") || v.startsWith("filled")) return "Closed";
  return v ? s.trim() : "Open";
}

function parseDateSafe(s) {
  if (!s) return 0;
  const t = Date.parse(s);
  return isNaN(t) ? 0 : t;
}

function jobMatchesQuery(job, query) {
  if (!query) return true;
  const haystack = [job["Job Title"], job["Company"], job["Location"], job["Job Type"]]
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

function renderJobs() {
  const grid = document.getElementById("jobs-grid");
  const emptyState = document.getElementById("empty-state");
  const statusLine = document.getElementById("status-line");

  let visible = state.jobs.filter((j) => {
    const status = normalizeStatus(j["Status"]);
    const statusOk = state.filter === "All" || status === state.filter;
    return statusOk && jobMatchesQuery(j, state.query);
  });

  visible.sort((a, b) => parseDateSafe(b["Date Posted"]) - parseDateSafe(a["Date Posted"]));

  grid.innerHTML = "";

  if (visible.length === 0) {
    emptyState.hidden = false;
  } else {
    emptyState.hidden = true;
    visible.forEach((job) => grid.appendChild(buildJobCard(job)));
  }

  const openCount = state.jobs.filter((j) => normalizeStatus(j["Status"]) === "Open").length;
  statusLine.textContent = `${openCount} open role${openCount === 1 ? "" : "s"} · ${state.jobs.length} total posted`;
}

function buildJobCard(job) {
  const status = normalizeStatus(job["Status"]);
  const isOpen = status === "Open";

  const card = document.createElement("article");
  card.className = "job-card" + (isOpen ? "" : " is-closed");

  const top = document.createElement("div");
  top.className = "job-card-top";
  top.innerHTML = `
    <div>
      <h3 class="job-title">${escapeHtml(job["Job Title"] || "Untitled role")}</h3>
      <p class="job-company">${escapeHtml(job["Company"] || "")}</p>
    </div>
    <span class="badge ${isOpen ? "open" : "closed"}">${isOpen ? "Open" : "Closed"}</span>
  `;

  const meta = document.createElement("div");
  meta.className = "job-meta";
  const metaBits = [job["Location"], job["Job Type"], job["Experience Level"]].filter(Boolean);
  meta.innerHTML = metaBits.map((m) => `<span>${escapeHtml(m)}</span>`).join("");

  const desc = document.createElement("p");
  desc.className = "job-desc";
  desc.textContent = job["Description"] || "";

  const footer = document.createElement("div");
  footer.className = "job-card-footer";
  const salary = job["Salary Range"] || "";
  const applyLink = job["Apply Link"] || "#";
  footer.innerHTML = `
    <span class="salary">${escapeHtml(salary)}</span>
    ${isOpen
      ? `<a class="apply-btn" href="${escapeAttr(applyLink)}" target="_blank" rel="noopener">Apply →</a>`
      : `<span class="apply-btn">Closed</span>`}
  `;

  card.appendChild(top);
  card.appendChild(meta);
  card.appendChild(desc);
  card.appendChild(footer);
  return card;
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(str) {
  return String(str).replace(/"/g, "&quot;");
}

function wireControls() {
  document.querySelectorAll("#status-filters .chip").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelectorAll("#status-filters .chip").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      state.filter = btn.dataset.filter;
      renderJobs();
    });
  });

  document.getElementById("search").addEventListener("input", (e) => {
    state.query = e.target.value;
    renderJobs();
  });
}

async function init() {
  wireControls();

  const jobsUrl = csvUrlFor(CONFIG.JOBS_CSV_URL, CONFIG.FALLBACK_JOBS_CSV);
  const profileUrl = csvUrlFor(CONFIG.PROFILE_CSV_URL, CONFIG.FALLBACK_PROFILE_CSV);

  try {
    const [jobs, profile] = await Promise.all([fetchCsv(jobsUrl), fetchCsv(profileUrl)]);
    state.jobs = jobs.filter((j) => j["Job Title"] && j["Job Title"].trim());
    renderProfile(profile);
    renderJobs();
    document.getElementById("last-updated").textContent =
      "Last refreshed " + new Date().toLocaleString();
  } catch (err) {
    console.error(err);
    document.getElementById("status-line").textContent =
      "Couldn't load the jobs sheet. Check that both Google Sheets are published to the web (see README) and that the links in js/config.js are correct.";
    document.getElementById("profile-name").textContent = "Startup Jobs Board";
  }
}

init();
