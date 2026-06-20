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
const qsoSkyMap = document.querySelector("#qsoSkyMap");
const qsoSepMagPlot = document.querySelector("#qsoSepMagPlot");
const qsoMapTooltip = document.querySelector("#qsoMapTooltip");
const qsoRangeSummary = document.querySelector("#qsoRangeSummary");

let activeFilter = "has-thumbnail";
let lang = localStorage.getItem("smtl-lang-v2") || "en";
let page = 1;
let pageSize = Number(localStorage.getItem("smtl-page-size") || 24);
pageSizeSelect.value = String(pageSize);

const i18n = {
  zh: {
    nav_catalogue: "数据目录", nav_sources: "数据源", nav_submit: "投送",
    hero_eyebrow: "引力透镜数据汇", hero_subtitle: "引力透镜类星体与引力透镜超新星数据目录",
    hero_text: "汇总已确认和高可信候选的 lensed QSOs 与 lensed SNe，目前优先使用 MAST 坐标检索入口。",
    browse_systems: "浏览源表",
    metric_systems: "源条目", metric_qso: "透镜类星体", metric_sn: "透镜超新星", metric_refs: "文献链接",
    catalogue_eyebrow: "Catalogue", catalogue_title: "透镜源目录",
    catalogue_desc: "",
    search_label: "搜索", search_placeholder: "输入源名、类型、标签或红移",
    filter_thumbnail: "有缩略图", filter_all: "全部", filter_qso: "透镜类星体", filter_sn: "透镜超新星", filter_quad: "四重像", filter_cluster: "星系团尺度", filter_timedelay: "时间延迟", filter_h0: "H0 测量样本",
    per_page: "每页", prev: "上一页", next: "下一页", page_of: "第 {page} / {pages} 页", no_results: "没有匹配结果。",
    sources_eyebrow: "Data Source", sources_title: "数据源先限定为 MAST",
    sources_desc: "每个源的 Data 按钮指向 MAST Portal，并在链接参数中写入该源的 RA/Dec。",
    submit_eyebrow: "Submit", submit_title: "投送与补充意见",
    submit_desc: "欢迎补充新源、坐标、红移、图像、首报论文、建模论文和后续观测论文；也欢迎指正错误。若本站内容侵犯版权，请发邮件告知，我们会及时删除或修正。",
    disclaimer: "免责声明：本网站为研究资料汇总与展示原型，红移、分类、文献角色和图像版权请以原始论文、MAST 元数据和数据发布页为准。",
    name: "源的名字", thumbnail: "缩略图", type: "源类型", status: "是否已认证", images: "成像数目", scale: "scale", lens_redshift: "lens redshift", source_redshift: "source redshift",
    detail: "details", data: "MAST", references: "References", subtype: "源类型", discovery: "发现年份", coordinates: "坐标", image_credit: "图像说明",
    first: "发现", observation: "观测", modelling: "建模", followup: "后续", review: "综述", catalog: "目录", candidate: "候选",
    ref_source: "源", ref_title: "文章/记录", ref_roles: "标记"
  },
  en: {
    nav_catalogue: "Catalogue", nav_sources: "Data Source", nav_submit: "Submit",
    hero_eyebrow: "Gravitational-lens catalogue", hero_subtitle: "Data catalogue of gravitationally lensed quasars and supernovae",
    hero_text: "A bilingual catalogue of confirmed and high-confidence lensed QSOs and lensed SNe. MAST coordinate search links are currently prioritized.",
    browse_systems: "Browse catalogue",
    metric_systems: "systems", metric_qso: "lensed QSOs", metric_sn: "lensed SNe", metric_refs: "reference links",
    catalogue_eyebrow: "Catalogue", catalogue_title: "Lens-source catalogue",
    catalogue_desc: "",
    search_label: "Search", search_placeholder: "Search by name, type, tag, or redshift",
    filter_thumbnail: "With thumbnails", filter_all: "All", filter_qso: "Lensed QSOs", filter_sn: "Lensed SNe", filter_quad: "Quad", filter_cluster: "Cluster-scale", filter_timedelay: "Time-delay", filter_h0: "H0 samples",
    per_page: "Per page", prev: "Previous", next: "Next", page_of: "Page {page} / {pages}", no_results: "No matching systems.",
    sources_eyebrow: "Data Source", sources_title: "MAST-first data links",
    sources_desc: "Each Data button opens MAST Portal with the source RA/Dec in the query.",
    submit_eyebrow: "Submit", submit_title: "Submit additions and corrections",
    submit_desc: "Please send new systems, coordinates, redshifts, images, first-report papers, modelling papers, and follow-up papers. Corrections are also welcome. If any content infringes copyright, please email us and we will remove or revise it promptly.",
    disclaimer: "Disclaimer: this site is a research catalogue prototype. Redshifts, classifications, reference roles, and image rights should be checked against original papers, MAST metadata, and data-release pages.",
    name: "Source name", thumbnail: "Thumbnail", type: "Source type", status: "Certified", images: "Images", scale: "scale", lens_redshift: "lens redshift", source_redshift: "source redshift",
    detail: "details", data: "MAST", references: "References", subtype: "Source type", discovery: "Discovery year", coordinates: "Coordinates", image_credit: "Image credit",
    first: "discovery", observation: "observation", modelling: "modelling", followup: "follow-up", review: "review", catalog: "catalogue", candidate: "candidate",
    ref_source: "Source", ref_title: "Article / record", ref_roles: "Roles",
    qso_map_title: "Lensed QSO sky map"
  }
};

Object.assign(i18n.zh, {
  qso_map_title: "Lensed QSO sky map"
});

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
  renderQsoSkyMap();
}

function matchesFilter(system) {
  if (activeFilter === "has-thumbnail") return hasRealThumbnail(system);
  if (activeFilter === "All") return true;
  if (activeFilter === "Lensed QSO" || activeFilter === "Lensed SN") return system.category === activeFilter;
  return searchableText(system).includes(normalize(activeFilter));
}

function hasRealThumbnail(system) {
  const thumbnail = system.thumbnail || "";
  return Boolean(thumbnail) && !thumbnail.endsWith("/q0957-561.svg");
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
      <td>${escapeHtml(displayType(system))}</td>
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
    <span>${label} / ${total}</span>
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
  const referenceLinks = createReferences(system.references);
  dialogBody.innerHTML = `
    <div class="dialog-layout">
      <img src="${escapeAttr(system.thumbnail)}" alt="${escapeAttr(system.name)} thumbnail">
      <div class="dialog-content">
        <p class="eyebrow">${escapeHtml(displayType(system))}</p>
        <h3>${escapeHtml(system.name)}</h3>
        ${pick(system, "summary") ? `<p>${escapeHtml(pick(system, "summary"))}</p>` : ""}
        <div class="meta">
          <div><span>${t("subtype")}</span>${escapeHtml(displayType(system))}</div>
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
        ${referenceLinks ? `<div class="link-group references-list">
          <h4>${t("references")}</h4>
          ${referenceLinks}
        </div>` : ""}
      </div>
    </div>
  `;
  dialog.showModal();
}

function createReferences(refs = []) {
  const articleRefs = refs.filter(ref => {
    const url = ref.url || "";
    return !refRoles(ref).includes("catalog") && !url.includes("/search/");
  });
  return articleRefs.map(ref => `
    <a href="${escapeAttr(ref.url)}" target="_blank" rel="noreferrer">
      <span>${escapeHtml(ref.title || ref.label)} ${refRoleHtml(ref)}</span>
      <small>${escapeHtml(ref.note || "")}</small>
    </a>
  `).join("");
}

function displayType(system) {
  if (system.category !== "Lensed SN") {
    return lang === "zh" ? "透镜类星体" : "Lensed QSO";
  }
  const subtype = system.subtype || "";
  if (/ia/i.test(subtype)) return lang === "zh" ? "透镜 Ia 型超新星" : "Lensed SN Ia";
  if (/core-collapse/i.test(subtype)) return lang === "zh" ? "透镜核坍缩超新星" : "Lensed core-collapse SN";
  if (/candidate/i.test(subtype)) return lang === "zh" ? "透镜超新星候选体" : "Lensed SN candidate";
  return lang === "zh" ? "透镜超新星" : "Lensed SN";
}

function parseRa(value) {
  if (!value) return null;
  const text = String(value).trim();
  if (/^[0-9.]+$/.test(text)) {
    const v = Number(text);
    return v > 24 ? v : v * 15;
  }
  const parts = text.replace("+", "").split(/[:hms\s]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  return (parts[0] + parts[1] / 60 + parts[2] / 3600) * 15;
}

function parseDec(value) {
  if (!value) return null;
  const text = String(value).trim();
  const sign = text.startsWith("-") ? -1 : 1;
  const parts = text.replace(/^[+-]/, "").split(/[:dms\s]+/).filter(Boolean).map(Number);
  if (parts.length < 3 || parts.some(Number.isNaN)) return null;
  return sign * (parts[0] + parts[1] / 60 + parts[2] / 3600);
}

function aitoffXY(raDeg, decDeg, width = 960, height = 480) {
  const cx = width / 2;
  const cy = height / 2;
  const rx = width * 0.455;
  const ry = height * 0.43;
  const lambda = ((((raDeg + 180) % 360) - 180) * -1) * Math.PI / 180;
  const phi = decDeg * Math.PI / 180;
  const alpha = Math.acos(Math.cos(phi) * Math.cos(lambda / 2));
  const sinc = Math.abs(alpha) < 1e-7 ? 1 : Math.sin(alpha) / alpha;
  const x = 2 * Math.cos(phi) * Math.sin(lambda / 2) / sinc;
  const y = Math.sin(phi) / sinc;
  return { x: cx + (x / Math.PI) * rx, y: cy - (y / (Math.PI / 2)) * ry };
}

function qsoPlotData() {
  return systems
    .filter(s => s.category === "Lensed QSO")
    .map(s => ({
      system: s,
      ra: parseRa(s.ra),
      dec: parseDec(s.dec),
      sep: Number(s.separation_arcsec),
      mag: Number(s.faintest_image_mag)
    }))
    .filter(p => p.ra !== null && p.dec !== null);
}

function qsoStats(qso) {
  const seps = qso.map(p => p.sep).filter(Number.isFinite);
  const mags = qso.map(p => p.mag).filter(Number.isFinite);
  return {
    sepMin: Math.min(...seps),
    sepMax: Math.max(...seps),
    magMin: Math.min(...mags),
    magMax: Math.max(...mags),
    nSepMag: qso.filter(p => Number.isFinite(p.sep) && Number.isFinite(p.mag)).length
  };
}

function renderQsoSkyMap() {
  if (!qsoSkyMap) return;
  const width = 960;
  const height = 480;
  const qso = qsoPlotData();
  const stats = qsoStats(qso);
  const grid = [];
  for (let dec = -60; dec <= 60; dec += 15) {
    const pts = [];
    for (let ra = -180; ra <= 180; ra += 2) {
      const p = aitoffXY(ra, dec, width, height);
      pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    grid.push(`<polyline class="qso-grid" points="${pts.join(" ")}"></polyline>`);
  }
  for (let ra = -150; ra <= 150; ra += 30) {
    const pts = [];
    for (let dec = -90; dec <= 90; dec += 2) {
      const p = aitoffXY(ra, dec, width, height);
      pts.push(`${p.x.toFixed(1)},${p.y.toFixed(1)}`);
    }
    grid.push(`<polyline class="qso-grid" points="${pts.join(" ")}"></polyline>`);
  }
  qsoSkyMap.innerHTML = `
    <rect class="qso-map-outer" x="0" y="0" width="960" height="480"></rect>
    <ellipse class="qso-map-fill" cx="480" cy="240" rx="437" ry="206"></ellipse>
    ${grid.join("")}
    ${qso.map(({ system, ra, dec }) => {
      const p = aitoffXY(ra, dec, width, height);
      return `<circle class="qso-map-point" tabindex="0" data-id="${escapeAttr(system.id)}" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="3.1"></circle>`;
    }).join("")}
    <ellipse class="qso-map-frame" cx="480" cy="240" rx="437" ry="206"></ellipse>
  `;
  renderQsoSepMagPlot(qso, stats);
  if (qsoRangeSummary && Number.isFinite(stats.sepMin) && Number.isFinite(stats.sepMax)) {
    qsoRangeSummary.textContent = `${qso.length} lensed QSOs with sky positions; ${stats.nSepMag} have both separation and screening magnitude. Image separation range: ${stats.sepMin.toFixed(2)}-${stats.sepMax.toFixed(2)} arcsec.`;
  }
  bindQsoPoints();
}

function renderQsoSepMagPlot(qso, stats) {
  if (!qsoSepMagPlot) return;
  const width = 760;
  const height = 480;
  const pad = { left: 82, right: 34, top: 42, bottom: 70 };
  const plotW = width - pad.left - pad.right;
  const plotH = height - pad.top - pad.bottom;
  const usable = qso.filter(p => Number.isFinite(p.sep) && Number.isFinite(p.mag));
  const xMin = 0;
  const xMax = Math.max(24, Math.ceil(stats.sepMax || 1));
  const yMin = Math.floor(Math.max(12, (stats.magMin || 14) - 1));
  const yMax = Math.ceil(Math.min(28, (stats.magMax || 24) + 1));
  const x = value => pad.left + ((value - xMin) / (xMax - xMin)) * plotW;
  const y = value => pad.top + ((value - yMin) / (yMax - yMin)) * plotH;
  const xTicks = [0, 5, 10, 15, 20].filter(v => v <= xMax);
  if (!xTicks.includes(xMax)) xTicks.push(xMax);
  const yTicks = [];
  for (let v = yMin; v <= yMax; v += 2) yTicks.push(v);
  qsoSepMagPlot.innerHTML = `
    <rect class="qso-map-outer" x="0" y="0" width="${width}" height="${height}"></rect>
    <line class="qso-axis" x1="${pad.left}" y1="${pad.top}" x2="${pad.left}" y2="${pad.top + plotH}"></line>
    <line class="qso-axis" x1="${pad.left}" y1="${pad.top + plotH}" x2="${pad.left + plotW}" y2="${pad.top + plotH}"></line>
    ${xTicks.map(v => `<g><line class="qso-tick" x1="${x(v).toFixed(1)}" y1="${pad.top + plotH}" x2="${x(v).toFixed(1)}" y2="${pad.top + plotH + 7}"></line><text class="qso-tick-label" x="${x(v).toFixed(1)}" y="${pad.top + plotH + 30}" text-anchor="middle">${v}</text></g>`).join("")}
    ${yTicks.map(v => `<g><line class="qso-tick" x1="${pad.left - 7}" y1="${y(v).toFixed(1)}" x2="${pad.left}" y2="${y(v).toFixed(1)}"></line><text class="qso-tick-label" x="${pad.left - 14}" y="${(y(v) + 6).toFixed(1)}" text-anchor="end">${v}</text></g>`).join("")}
    <line class="qso-threshold" x1="${x(1.64).toFixed(1)}" y1="${pad.top}" x2="${x(1.64).toFixed(1)}" y2="${pad.top + plotH}"></line>
    <line class="qso-threshold" x1="${pad.left}" y1="${y(21.5).toFixed(1)}" x2="${pad.left + plotW}" y2="${y(21.5).toFixed(1)}"></line>
    <text class="qso-summary-label" x="${(x(1.64) + 8).toFixed(1)}" y="${pad.top + 20}">1.64 arcsec</text>
    <text class="qso-summary-label" x="${pad.left + plotW - 96}" y="${(y(21.5) - 8).toFixed(1)}">m_cut=21.5</text>
    <text class="qso-axis-label" x="${pad.left + plotW / 2}" y="${height - 22}" text-anchor="middle">maximum image separation (arcsec)</text>
    <text class="qso-axis-label" transform="translate(25 ${pad.top + plotH / 2}) rotate(-90)" text-anchor="middle">screening magnitude</text>
    ${usable.map(({ system, sep, mag }) => `<circle class="qso-sep-point" tabindex="0" data-id="${escapeAttr(system.id)}" cx="${x(sep).toFixed(1)}" cy="${y(mag).toFixed(1)}" r="3.3"></circle>`).join("")}
  `;
}

function bindQsoPoints() {
  document.querySelectorAll(".qso-map-point, .qso-sep-point").forEach(point => {
    const show = event => showQsoTooltip(point.dataset.id, event);
    point.addEventListener("mouseenter", show);
    point.addEventListener("mousemove", show);
    point.addEventListener("focus", show);
    point.addEventListener("mouseleave", hideQsoTooltip);
    point.addEventListener("blur", hideQsoTooltip);
    point.addEventListener("click", () => openDetails(point.dataset.id));
  });
}

function showQsoTooltip(id, event) {
  if (!qsoMapTooltip) return;
  const system = systems.find(s => s.id === id);
  if (!system) return;
  setQsoActive(id, true);
  const allQso = qsoPlotData();
  const stats = qsoStats(allQso);
  qsoMapTooltip.innerHTML = `
    <strong>${escapeHtml(system.name)}</strong>
    <small>RA/Dec: ${escapeHtml(system.ra || "")}, ${escapeHtml(system.dec || "")}</small>
    <small>Image sep: ${escapeHtml(system.separation_arcsec || "n/a")} arcsec</small>
    <small>Catalogue sep range: ${Number.isFinite(stats.sepMin) ? stats.sepMin.toFixed(2) : "n/a"}-${Number.isFinite(stats.sepMax) ? stats.sepMax.toFixed(2) : "n/a"} arcsec</small>
    <small>Screening mag: ${escapeHtml(system.faintest_image_mag || "n/a")} ${escapeHtml(system.faintest_image_mag_band || "")}</small>
  `;
  qsoMapTooltip.hidden = false;
  const host = document.querySelector(".qso-map-grid").getBoundingClientRect();
  const x = event.clientX ? event.clientX - host.left : Number(event.target.getAttribute("cx"));
  const y = event.clientY ? event.clientY - host.top : Number(event.target.getAttribute("cy"));
  qsoMapTooltip.style.left = `${Math.min(Math.max(x + 14, 10), host.width - 270)}px`;
  qsoMapTooltip.style.top = `${Math.min(Math.max(y + 14, 10), host.height - 148)}px`;
}

function hideQsoTooltip() {
  setQsoActive(null, false);
  if (qsoMapTooltip) qsoMapTooltip.hidden = true;
}

function setQsoActive(id, active) {
  document.querySelectorAll(".qso-map-point, .qso-sep-point").forEach(point => {
    point.classList.toggle("is-active", active && point.dataset.id === id);
  });
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
    localStorage.setItem("smtl-lang-v2", lang);
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
