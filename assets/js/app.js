const systems = window.LENS_SYSTEMS || [];
const cards = document.querySelector("#cards");
const searchInput = document.querySelector("#search");
const chips = Array.from(document.querySelectorAll(".chip"));
const dialog = document.querySelector("#detailDialog");
const dialogBody = document.querySelector("#dialogBody");
const closeDialog = document.querySelector(".dialog-close");
const langButtons = Array.from(document.querySelectorAll(".lang-btn"));

let activeFilter = "All";
let lang = localStorage.getItem("smtl-lang") || "zh";

const i18n = {
  zh: {
    nav_catalogue: "数据目录", nav_sources: "数据来源", nav_contribute: "新增条目",
    hero_eyebrow: "数据汇总 / Data Catalogue",
    hero_text: "汇总已确认或具有代表性的引力透镜类星体与引力透镜超新星，集中展示缩略图、基本参数、数据下载入口、ADS/arXiv 文献链接、观测档案入口与图像引用说明。当前版本是可直接部署到 GitHub Pages 的静态网站原型。",
    browse_systems: "浏览系统", download_json: "下载 JSON 数据",
    metric_systems: "系统条目", metric_qso: "引力透镜类星体", metric_sn: "引力透镜超新星", metric_version: "双语原型",
    catalogue_eyebrow: "数据目录 / Catalogue", catalogue_title: "透镜系统目录",
    catalogue_desc: "先以代表性小样本搭建结构；后续只需要继续扩展 <code>assets/js/data.js</code> 或 <code>data/systems.json</code>。",
    search_label: "搜索", search_placeholder: "输入系统名、标签、类型，例如 WGD、SN Ia、quad...",
    filter_all: "全部", filter_qso: "透镜类星体", filter_sn: "透镜超新星", filter_timedelay: "时间延迟", filter_quad: "四重像", filter_cluster: "星系团尺度",
    sources_eyebrow: "数据来源 / Data sources", sources_title: "推荐的数据来源组织方式",
    sources_desc: "缩略图建议优先从公开 survey cutout 或 FITS 数据自行生成，避免直接复制论文插图。论文插图只作为外链和引用入口。每个系统页面都应保留 image credit 字段。",
    submit_eyebrow: "新增条目 / Add entries", submit_title: "新增系统时建议填写的字段",
    submit_note: "对外发布前，建议把红移、像数、发现年份、时延数值和 H0 结果逐条回查原论文，不要只依赖二级数据库。",
    footer_title: "引力透镜类星体与引力透镜超新星数据汇总", footer_note: "静态网站原型。正式替换真实缩略图前，请先核查图像版权和引用说明。",
    no_results: "没有匹配结果。可以减少关键词或切换筛选条件。",
    detail: "详情", papers: "ADS/arXiv", configuration: "成像构型", scale: "尺度", lens_redshift: "透镜红移", source_redshift: "源红移",
    subtype: "子类型", discovery: "发现年份", coordinates: "坐标", image_credit: "图像说明", data_links: "数据下载 / 观测档案入口", paper_links: "相关文章 / ADS / arXiv", images: "个像"
  },
  en: {
    nav_catalogue: "Catalogue", nav_sources: "Data sources", nav_contribute: "Add entries",
    hero_eyebrow: "Data Catalogue / 数据汇总",
    hero_text: "A data catalogue of confirmed or representative gravitationally lensed quasars and gravitationally lensed supernovae, collecting thumbnails, basic parameters, data-access links, ADS/arXiv literature links, archive entries, and image-credit notes. This version is a static GitHub Pages prototype.",
    browse_systems: "Browse systems", download_json: "Download JSON data",
    metric_systems: "systems", metric_qso: "lensed quasars", metric_sn: "lensed supernovae", metric_version: "bilingual prototype",
    catalogue_eyebrow: "Catalogue / 数据目录", catalogue_title: "Lens-system catalogue",
    catalogue_desc: "The current version uses a representative seed sample. Extend <code>assets/js/data.js</code> or <code>data/systems.json</code> to add more systems.",
    search_label: "Search", search_placeholder: "Search by name, tag, or type, e.g. WGD, SN Ia, quad...",
    filter_all: "All", filter_qso: "Lensed QSOs", filter_sn: "Lensed SNe", filter_timedelay: "Time-delay", filter_quad: "Quad", filter_cluster: "Cluster-scale",
    sources_eyebrow: "Data sources / 数据来源", sources_title: "Recommended data-source structure",
    sources_desc: "For thumbnails, first consider generating cutouts from public survey images or FITS data. Avoid directly reproducing figures from papers unless the license is clear. Each system entry should keep an image-credit field.",
    submit_eyebrow: "Add entries / 新增条目", submit_title: "Suggested fields for new systems",
    submit_note: "Before public release, verify redshifts, image multiplicity, discovery year, time-delay values, and H0 results against the original papers rather than relying only on secondary databases.",
    footer_title: "Data Catalogue of Gravitationally Lensed Quasars and Supernovae", footer_note: "Static website prototype. Verify image rights and credit lines before replacing placeholder thumbnails with real images.",
    no_results: "No matching systems. Try fewer keywords or a different filter.",
    detail: "Details", papers: "ADS/arXiv", configuration: "Configuration", scale: "Scale", lens_redshift: "Lens redshift", source_redshift: "Source redshift",
    subtype: "Subtype", discovery: "Discovery", coordinates: "Coordinates", image_credit: "Image credit", data_links: "Data / archive links", paper_links: "Papers / ADS / arXiv", images: "images"
  }
};

document.querySelector("#count-all").textContent = systems.length;
document.querySelector("#count-qso").textContent = systems.filter(s => s.category === "Lensed QSO").length;
document.querySelector("#count-sn").textContent = systems.filter(s => s.category === "Lensed SN").length;

function t(key) { return (i18n[lang] && i18n[lang][key]) || i18n.zh[key] || key; }
function pick(system, key) { return lang === "zh" ? (system[`${key}_zh`] || system[key]) : system[key]; }
function pickTags(system) { return lang === "zh" ? (system.tags_zh || system.tags || []) : (system.tags || []); }
function normalize(value) { return String(value || "").toLowerCase(); }

function applyLanguage() {
  document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;
    const value = t(key);
    if (value.includes("<code>")) el.innerHTML = value;
    else el.textContent = value;
  });
  searchInput.placeholder = t("search_placeholder");
  langButtons.forEach(btn => btn.classList.toggle("active", btn.dataset.lang === lang));
  render();
}

function matchesFilter(system) {
  if (activeFilter === "All") return true;
  if (activeFilter === "Lensed QSO" || activeFilter === "Lensed SN") return system.category === activeFilter;
  const haystack = [
    system.name, system.category, system.category_zh, system.subtype, system.subtype_zh,
    system.scale, system.scale_zh, system.status, system.status_zh,
    system.images, system.summary, system.summary_zh, ...(system.tags || []), ...(system.tags_zh || [])
  ].map(normalize).join(" ");
  return haystack.includes(normalize(activeFilter));
}

function matchesSearch(system) {
  const q = normalize(searchInput.value.trim());
  if (!q) return true;
  const haystack = [
    system.name, system.category, system.category_zh, system.subtype, system.subtype_zh,
    system.scale, system.scale_zh, system.status, system.status_zh,
    system.lens_redshift, system.source_redshift, system.coordinates,
    system.discovery_year, system.summary, system.summary_zh, ...(system.tags || []), ...(system.tags_zh || [])
  ].map(normalize).join(" ");
  return haystack.includes(q);
}

function createCard(system) {
  const tagHtml = pickTags(system).slice(0, 6).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  const imageWord = lang === "zh" ? t("images") : t("images");
  const configurationValue = lang === "zh" ? `${escapeHtml(system.images)}${imageWord}` : `${escapeHtml(system.images)} ${imageWord}`;
  return `
    <article class="card">
      <img src="${escapeAttr(system.thumbnail)}" alt="${escapeAttr(system.name)} thumbnail" loading="lazy">
      <div class="card-body">
        <div class="card-kicker">
          <span>${escapeHtml(pick(system, "category"))}</span>
          <span>${escapeHtml(pick(system, "status"))}</span>
        </div>
        <h3>${escapeHtml(system.name)}</h3>
        <p>${escapeHtml(pick(system, "summary"))}</p>
        <div class="meta">
          <div><span>${t("configuration")}</span>${configurationValue}</div>
          <div><span>${t("scale")}</span>${escapeHtml(pick(system, "scale"))}</div>
          <div><span>${t("lens_redshift")}</span>${escapeHtml(system.lens_redshift)}</div>
          <div><span>${t("source_redshift")}</span>${escapeHtml(system.source_redshift)}</div>
        </div>
        <div class="tags">${tagHtml}</div>
        <div class="card-actions">
          <button type="button" data-id="${escapeAttr(system.id)}">${t("detail")}</button>
          <a href="${escapeAttr((system.paper_links && system.paper_links[0] || {}).url || '#')}" target="_blank" rel="noreferrer">${t("papers")}</a>
        </div>
      </div>
    </article>
  `;
}

function render() {
  const filtered = systems.filter(s => matchesFilter(s) && matchesSearch(s));
  cards.innerHTML = filtered.map(createCard).join("") || `<p class="note">${t("no_results")}</p>`;
  cards.querySelectorAll("button[data-id]").forEach(button => {
    button.addEventListener("click", () => openDetails(button.dataset.id));
  });
}

function openDetails(id) {
  const system = systems.find(s => s.id === id);
  if (!system) return;
  const dataLinks = createLinks(system.data_links);
  const paperLinks = createLinks(system.paper_links);
  const tags = pickTags(system).map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join("");
  const imageCredit = lang === "zh" ? (system.image_credit_zh || system.image_credit) : system.image_credit;
  dialogBody.innerHTML = `
    <div class="dialog-layout">
      <img src="${escapeAttr(system.thumbnail)}" alt="${escapeAttr(system.name)} thumbnail">
      <div class="dialog-content">
        <p class="eyebrow">${escapeHtml(pick(system, "category"))} · ${escapeHtml(pick(system, "status"))}</p>
        <h3>${escapeHtml(system.name)}</h3>
        <p>${escapeHtml(pick(system, "summary"))}</p>
        <div class="meta">
          <div><span>${t("subtype")}</span>${escapeHtml(pick(system, "subtype"))}</div>
          <div><span>${t("configuration")}</span>${escapeHtml(system.images)}</div>
          <div><span>${t("scale")}</span>${escapeHtml(pick(system, "scale"))}</div>
          <div><span>${t("discovery")}</span>${escapeHtml(system.discovery_year)}</div>
          <div><span>${t("lens_redshift")}</span>${escapeHtml(system.lens_redshift)}</div>
          <div><span>${t("source_redshift")}</span>${escapeHtml(system.source_redshift)}</div>
          <div><span>${t("coordinates")}</span>${escapeHtml(system.coordinates)}</div>
          <div><span>${t("image_credit")}</span>${escapeHtml(imageCredit)}</div>
        </div>
        <div class="tags" style="margin-top: 14px">${tags}</div>
        <div class="link-group">
          <h4>${t("data_links")}</h4>
          ${dataLinks}
        </div>
        <div class="link-group">
          <h4>${t("paper_links")}</h4>
          ${paperLinks}
        </div>
      </div>
    </div>
  `;
  dialog.showModal();
}

function createLinks(links = []) {
  return links.map(link => `
    <a href="${escapeAttr(link.url)}" target="_blank" rel="noreferrer">
      ${escapeHtml(link.label)}
      <small>${escapeHtml(link.note || "")}</small>
    </a>
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

chips.forEach(chip => {
  chip.addEventListener("click", () => {
    chips.forEach(c => c.classList.remove("active"));
    chip.classList.add("active");
    activeFilter = chip.dataset.filter;
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

searchInput.addEventListener("input", render);
closeDialog.addEventListener("click", () => dialog.close());
dialog.addEventListener("click", event => { if (event.target === dialog) dialog.close(); });

applyLanguage();
