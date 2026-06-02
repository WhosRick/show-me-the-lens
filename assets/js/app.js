const systems = window.LENS_SYSTEMS || [];
const cards = document.querySelector("#cards");
const searchInput = document.querySelector("#search");
const chips = Array.from(document.querySelectorAll(".chip"));
const dialog = document.querySelector("#detailDialog");
const dialogBody = document.querySelector("#dialogBody");
const closeDialog = document.querySelector(".dialog-close");
const langButtons = Array.from(document.querySelectorAll(".lang-btn"));
const pageSizeSelect = document.querySelector("#pageSize");
const pagerTop = document.querySelector("#pagerTop");
const pagerBottom = document.querySelector("#pagerBottom");
const referenceStats = document.querySelector("#referenceStats");

let activeFilter = "All";
let lang = localStorage.getItem("smtl-lang") || "zh";
let page = 1;
let pageSize = Number(localStorage.getItem("smtl-page-size") || 24);
pageSizeSelect.value = String(pageSize);

const i18n = {
  zh: {
    nav_catalogue: "数据目录", nav_references: "文献统计", nav_sources: "数据源", nav_submit: "投送",
    hero_eyebrow: "引力透镜数据汇", hero_subtitle: "引力透镜类星体与引力透镜超新星数据目录",
    hero_text: "汇总已确认和高可信候选的 lensed QSOs 与 lensed SNe，优先使用 MAST 坐标检索入口、可复用图像字段和可核查文献标签。",
    browse_systems: "浏览源表", download_json: "下载 JSON",
    metric_systems: "源条目", metric_qso: "透镜类星体", metric_sn: "透镜超新星", metric_refs: "文献链接",
    catalogue_eyebrow: "Catalogue", catalogue_title: "透镜源目录",
    catalogue_desc: "目录改为横向列表。当前批量并入 CASTLES 101 个多重成像系统，并保留服务器生成的 QSO panel 图；GraL 全量表可继续追加。",
    search_label: "搜索", search_placeholder: "输入源名、类型、标签或红移",
    filter_all: "全部", filter_qso: "透镜类星体", filter_sn: "透镜超新星", filter_quad: "四重像", filter_cluster: "星系团尺度", filter_timedelay: "时间延迟",
    per_page: "每页", prev: "上一页", next: "下一页", page_of: "第 {page} / {pages} 页", no_results: "没有匹配结果。",
    references_eyebrow: "References", references_title: "文献统计与角色标注",
    references_desc: "详情页列出具体文献或目录链接，并用上标标明发现、观测、建模、综述/目录等角色。",
    sources_eyebrow: "Data Source", sources_title: "数据源先限定为 MAST",
    sources_desc: "每个源的 Data 按钮指向 MAST Portal，并在链接参数中写入该源的 RA/Dec。其它数据库保留在文献和备注中，不作为本版数据入口。",
    submit_eyebrow: "Submit", submit_title: "投送与补充意见",
    submit_desc: "欢迎补充新源、坐标、红移、图像、首报论文、建模论文和后续观测论文。",
    disclaimer: "免责声明：本网站为研究资料汇总与展示原型，红移、分类、文献角色和图像版权请以原始论文、MAST 元数据和数据发布页为准。",
    name: "源的名字", thumbnail: "缩略图", type: "源类型", status: "是否已认证", images: "成像数目", scale: "scale", lens_redshift: "lens redshift", source_redshift: "source redshift",
    detail: "details", data: "MAST", references: "References", subtype: "子类型", discovery: "发现年份", coordinates: "坐标", image_credit: "图像说明",
    first: "发现", observation: "观测", modelling: "建模", followup: "后续", review: "综述", catalog: "目录", candidate: "候选"
  },
  en: {
    nav_catalogue: "Catalogue", nav_references: "References", nav_sources: "Data Source", nav_submit: "Submit",
    hero_eyebrow: "Gravitational-lens catalogue", hero_subtitle: "Data catalogue of gravitationally lensed quasars and supernovae",
    hero_text: "A bilingual catalogue of confirmed and high-confidence lensed QSOs and lensed SNe, with MAST coordinate links, reusable image fields, and reference roles.",
    browse_systems: "Browse catalogue", download_json: "Download JSON",
    metric_systems: "systems", metric_qso: "lensed QSOs", metric_sn: "lensed SNe", metric_refs: "reference links",
    catalogue_eyebrow: "Catalogue", catalogue_title: "Lens-source catalogue",
    catalogue_desc: "The catalogue now uses a horizontal list. This batch imports the CASTLES 101 multiply imaged systems and keeps server-generated QSO panels; the full GraL table can be appended later.",
    search_label: "Search", search_placeholder: "Search by name, type, tag, or redshift",
    filter_all: "All", filter_qso: "Lensed QSOs", filter_sn: "Lensed SNe", filter_quad: "Quad", filter_cluster: "Cluster-scale", filter_timedelay: "Time-delay",
    per_page: "Per page", prev: "Previous", next: "Next", page_of: "Page {page} / {pages}", no_results: "No matching systems.",
    references_eyebrow: "References", references_title: "Reference counts and roles",
    references_desc: "Detail panels list literature or catalogue links with superscript role labels for discovery, observation, modelling, review/catalogue, and candidates.",
    sources_eyebrow: "Data Source", sources_title: "MAST-first data links",
    sources_desc: "Each Data button opens MAST Portal with the source RA/Dec in the query. Other services are kept as literature context rather than primary data sources.",
    submit_eyebrow: "Submit", submit_title: "Submit additions and corrections",
    submit_desc: "Please send new systems, coordinates, redshifts, images, first-report papers, modelling papers, and follow-up papers.",
    disclaimer: "Disclaimer: this site is a research catalogue prototype. Redshifts, classifications, reference roles, and image rights should be checked against original papers, MAST metadata, and data-release pages.",
    name: "Source name", thumbnail: "Thumbnail", type: "Source type", status: "Certified", images: "Images", scale: "scale", lens_redshift: "lens redshift", source_redshift: "source redshift",
    detail: "details", data: "MAST", references: "References", subtype: "Subtype", discovery: "Discovery year", coordinates: "Coordinates", image_credit: "Image credit",
    first: "discovery", observation: "observation", modelling: "modelling", followup: "follow-up", review: "review", catalog: "catalogue", candidate: "candidate"
  }
};

function t(key) { return (i18n[lang] && i18n[lang][key]) || key; }
function pick(system, key) { return lang === "zh" ? (system[`${key}_zh`] || system[key]) : system[key]; }
function normalize(value) { return String(value || "").toLowerCase(); }
function tags(system) { return lang === "zh" ? (system.tags_zh || system.tags || []) : (system.tags || []); }
function refRoles(ref) { return Array.isArray(ref.roles) ? ref.roles : [ref.type || "followup"]; }
function refRoleHtml(ref) {
  return refRoles(ref).map(role => `<sup>${escapeHtml(t(role) || role)}</sup>`).join("");
}

function mastUrl(system) {
  const query = encodeURIComponent(system.mast_query || `${system.ra} ${system.dec}`);
  return `https://mast.stsci.edu/portal/Mashup/Clients/Mast/Portal.html?searchQuery=${query}`;
}

function applyLanguage() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  searchInput.placeholder = t("search_placeholder");
  langButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.lang === lang));
  render();
  renderReferenceStats();
}

function matchesFilter(system) {
  if (activeFilter === "All") return true;
  if (activeFilter === "Lensed QSO" || activeFilter === "Lensed SN") return system.category === activeFilter;
  return searchableText(system).includes(normalize(activeFilter));
}

function matchesSearch(system) {
  const q = normalize(searchInput.value.trim());
  return !q || searchableText(system).includes(q);
}

function searchableText(system) {
  return [
    system.name, system.category, system.category_zh, system.subtype, system.subtype_zh,
    system.scale, system.scale_zh, system.status, system.status_zh, system.images,
    system.lens_redshift, system.source_redshift, system.discovery_year, system.ra, system.dec,
    system.summary, system.summary_zh, ...(system.tags || []), ...(system.tags_zh || [])
  ].map(normalize).join(" ");
}

function createRow(system) {
  return `
    <tr>
      <td class="source-name">${escapeHtml(system.name)}</td>
      <td><img class="table-thumb" src="${escapeAttr(system.thumbnail)}" alt="${escapeAttr(system.name)} thumbnail" loading="lazy"></td>
      <td>${escapeHtml(pick(system, "subtype") || pick(system, "category"))}</td>
      <td><span class="status-pill">${escapeHtml(pick(system, "status"))}</span></td>
      <td>${escapeHtml(system.images)}</td>
      <td>${escapeHtml(pick(system, "scale"))}</td>
      <td>${escapeHtml(system.lens_redshift)}</td>
      <td>${escapeHtml(system.source_redshift)}</td>
      <td class="details-cell"><button type="button" data-id="${escapeAttr(system.id)}">${t("detail")}</button></td>
    </tr>
  `;
}

function render() {
  const filtered = systems.filter(s => matchesFilter(s) && matchesSearch(s));
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  page = Math.min(page, pages);
  const start = (page - 1) * pageSize;
  const shown = filtered.slice(start, start + pageSize);
  cards.innerHTML = shown.length ? `
    <div class="catalogue-table-wrap">
      <table class="catalogue-table">
        <thead>
          <tr>
            <th>${t("name")}</th>
            <th>${t("thumbnail")}</th>
            <th>${t("type")}</th>
            <th>${t("status")}</th>
            <th>${t("images")}</th>
            <th>${t("scale")}</th>
            <th>${t("lens_redshift")}</th>
            <th>${t("source_redshift")}</th>
            <th>${t("detail")}</th>
          </tr>
        </thead>
        <tbody>${shown.map(createRow).join("")}</tbody>
      </table>
    </div>
  ` : `<p class="note">${t("no_results")}</p>`;
  cards.querySelectorAll("button[data-id]").forEach(button => {
    button.addEventListener("click", () => openDetails(button.dataset.id));
  });
  renderPager(filtered.length, pages);
}

function renderPager(total, pages) {
  const label = t("page_of").replace("{page}", page).replace("{pages}", pages);
  const html = `
    <button type="button" data-page="prev" ${page <= 1 ? "disabled" : ""}>${t("prev")}</button>
    <span>${label} · ${total}</span>
    <button type="button" data-page="next" ${page >= pages ? "disabled" : ""}>${t("next")}</button>
  `;
  [pagerTop, pagerBottom].forEach(pager => {
    pager.innerHTML = html;
    pager.querySelectorAll("button").forEach(btn => {
      btn.addEventListener("click", () => {
        page += btn.dataset.page === "next" ? 1 : -1;
        render();
        document.querySelector("#catalogue").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  });
}

function openDetails(id) {
  const system = systems.find(s => s.id === id);
  if (!system) return;
  const tagsHtml = tags(system).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  dialogBody.innerHTML = `
    <div class="dialog-layout">
      <img src="${escapeAttr(system.thumbnail)}" alt="${escapeAttr(system.name)} thumbnail">
      <div class="dialog-content">
        <p class="eyebrow">${escapeHtml(pick(system, "category"))}</p>
        <h3>${escapeHtml(system.name)}</h3>
        <p>${escapeHtml(pick(system, "summary"))}</p>
        <div class="meta">
          <div><span>${t("subtype")}</span>${escapeHtml(pick(system, "subtype"))}</div>
          <div><span>${t("status")}</span>${escapeHtml(pick(system, "status"))}</div>
          <div><span>${t("images")}</span>${escapeHtml(system.images)}</div>
          <div><span>${t("scale")}</span>${escapeHtml(pick(system, "scale"))}</div>
          <div><span>${t("discovery")}</span>${escapeHtml(system.discovery_year)}</div>
          <div><span>${t("lens_redshift")}</span>${escapeHtml(system.lens_redshift)}</div>
          <div><span>${t("source_redshift")}</span>${escapeHtml(system.source_redshift)}</div>
          <div><span>${t("coordinates")}</span>${escapeHtml(`${system.ra || ""}, ${system.dec || ""}`)}</div>
          <div><span>${t("image_credit")}</span>${escapeHtml(pick(system, "image_credit"))}</div>
        </div>
        <div class="tags dialog-tags">${tagsHtml}</div>
        <div class="link-group">
          <h4>${t("data")}</h4>
          <a href="${escapeAttr(mastUrl(system))}" target="_blank" rel="noreferrer">MAST Portal <small>${escapeHtml(system.mast_query || `${system.ra} ${system.dec}`)}</small></a>
        </div>
        <div class="link-group references-list">
          <h4>${t("references")}</h4>
          ${createReferences(system.references)}
        </div>
      </div>
    </div>
  `;
  dialog.showModal();
}

function createReferences(refs = []) {
  return refs.map(ref => `
    <a href="${escapeAttr(ref.url)}" target="_blank" rel="noreferrer">
      <span>${escapeHtml(ref.title || ref.label)} ${refRoleHtml(ref)}</span>
      <small>${escapeHtml(ref.note || "")}</small>
    </a>
  `).join("");
}

function renderReferenceStats() {
  const counts = systems.flatMap(s => s.references || []).flatMap(refRoles).reduce((acc, role) => {
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});
  referenceStats.innerHTML = Object.entries(counts).map(([role, count]) => `
    <article>
      <span>${count}</span>
      <p>${escapeHtml(t(role) || role)}</p>
    </article>
  `).join("");
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
function escapeAttr(value) { return escapeHtml(value).replaceAll("`", "&#096;"); }

document.querySelector("#count-all").textContent = systems.length;
document.querySelector("#count-qso").textContent = systems.filter(s => s.category === "Lensed QSO").length;
document.querySelector("#count-sn").textContent = systems.filter(s => s.category === "Lensed SN").length;
document.querySelector("#count-ref").textContent = systems.reduce((sum, s) => sum + (s.references || []).length, 0);

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
    page = 1;
    render();
  });
});

langButtons.forEach(button => {
  button.addEventListener("click", () => {
    lang = button.dataset.lang;
    localStorage.setItem("smtl-lang", lang);
    applyLanguage();
  });
});

pageSizeSelect.addEventListener("change", () => {
  pageSize = Number(pageSizeSelect.value);
  localStorage.setItem("smtl-page-size", String(pageSize));
  page = 1;
  render();
});

searchInput.addEventListener("input", () => { page = 1; render(); });
closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

applyLanguage();
