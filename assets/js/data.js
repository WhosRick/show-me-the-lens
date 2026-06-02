const thumb = name => `assets/img/thumbs/${name}.svg`;
const panel = name => `panels/${name}_panel.png`;
const ads = (q, label, type = "followup", note = "ADS record/search") => ({
  type, label, note, url: `https://ui.adsabs.harvard.edu/search/q=${encodeURIComponent(q)}`
});
const arxiv = (id, label, type = "followup", note = "arXiv preprint") => ({
  type, label, note, url: `https://arxiv.org/abs/${id}`
});

function qso(id, name, images, zl, zs, year, ra, dec, subtype, tags, refs, thumbnail = "q0957-561") {
  return {
    id, name, category: "Lensed QSO", category_zh: "透镜类星体",
    subtype, subtype_zh: subtype.includes("Doubly") ? "双重成像类星体" : subtype.includes("radio") ? "射电透镜源" : "多重成像类星体",
    scale: tags.includes("cluster") ? "Galaxy/cluster environment" : "Galaxy-scale",
    scale_zh: tags.includes("cluster") ? "星系/星系团环境" : "星系尺度",
    status: "Confirmed", status_zh: "已确认", images,
    lens_redshift: zl, source_redshift: zs, discovery_year: year, ra, dec,
    mast_query: `${ra} ${dec}`,
    summary: `${name} is a ${subtype.toLowerCase()} included as part of the expanded lensed-QSO catalogue, with MAST coordinate access and role-tagged references.`,
    summary_zh: `${name} 是${subtype.includes("Doubly") ? "双重" : "多重"}成像透镜类星体，已加入扩展后的 lensed QSO 目录，并提供 MAST 坐标入口和带角色标注的文献。`,
    tags: ["QSO", ...tags], tags_zh: ["类星体", ...tags.map(tag => ({quad:"四重像",double:"双重像","time-delay":"时间延迟",radio:"射电",cluster:"星系团环境",GraL:"GraL",classic:"经典样本",STRIDES:"STRIDES",H0LiCOW:"H0LiCOW"}[tag] || tag))],
    thumbnail: thumbnail.includes("/") ? `assets/img/${thumbnail}` : thumb(thumbnail),
    references: refs,
    image_credit: thumbnail.includes("/") ? "Server-generated WCS panel from raw_lens_panels_wcs." : "Thumbnail placeholder; replace with the server-generated raw_lens_panels_wcs panel when available.",
    image_credit_zh: thumbnail.includes("/") ? "服务器 raw_lens_panels_wcs 生成的 WCS 面板。" : "当前为占位缩略图；拿到服务器 raw_lens_panels_wcs 面板后可直接替换。"
  };
}

function sn(id, name, subtype, images, zl, zs, year, ra, dec, scale, tags, refs, thumbnail = "sn-refsdal", status = "Confirmed") {
  return {
    id, name, category: "Lensed SN", category_zh: "透镜超新星",
    subtype, subtype_zh: subtype.includes("Ia") ? "Ia 型超新星" : subtype.includes("candidate") ? "候选透镜超新星" : "核心坍缩超新星",
    scale, scale_zh: scale.includes("Cluster") ? "星系团尺度" : "星系尺度",
    status, status_zh: status === "Confirmed" ? "已确认" : "候选/高可信",
    images, lens_redshift: zl, source_redshift: zs, discovery_year: year, ra, dec,
    mast_query: `${ra} ${dec}`,
    summary: `${name} is included in the lensed-SN sample for image, time-delay, magnification, and modelling follow-up.`,
    summary_zh: `${name} 已加入 lensed SN 样本，用于汇总图像、时间延迟、放大率和透镜建模后续研究。`,
    tags: ["SN", ...tags], tags_zh: ["超新星", ...tags.map(tag => ({quad:"四重像",triple:"三重像","time-delay":"时间延迟",cluster:"星系团透镜",galaxy:"星系透镜",JWST:"JWST",HST:"HST",candidate:"候选"}[tag] || tag))],
    thumbnail: thumb(thumbnail),
    references: refs,
    image_credit: "Use MAST/HST/JWST release credit lines for any real stacked image.",
    image_credit_zh: "真实叠加图请按 MAST/HST/JWST 数据发布页标注版权和致谢。"
  };
}

window.LENS_SYSTEMS = [
  qso("q0957-561", "Q0957+561", "2", "z_l ≈ 0.36", "z_s ≈ 1.41", "1979", "10:01:20.8", "+55:53:56", "Doubly imaged quasar", ["double","time-delay","cluster","classic"], [
    ads('title:"0957+561" Walsh Carswell Weymann 1979', "Walsh et al. 1979, Nature", "first", "First reported gravitationally lensed quasar"),
    ads('Q0957+561 time delay lens modelling', "Q0957+561 time-delay/modelling literature", "modelling")
  ], "q0957-561"),
  qso("pg1115-080", "PG 1115+080", "4", "z_l ≈ 0.31", "z_s ≈ 1.72", "1980", "11:18:17.0", "+07:45:58", "Quadruply imaged quasar", ["quad","time-delay","classic"], [
    ads('"PG 1115+080" discovery gravitational lens', "PG 1115+080 discovery papers", "first"),
    ads('"PG 1115+080" lens model time delay', "PG 1115+080 lens modelling", "modelling")
  ], panel("pg1115-080")),
  qso("b1608-656", "B1608+656", "4", "z_l ≈ 0.63", "z_s ≈ 1.39", "1995", "16:09:13.9", "+65:32:28", "Quadruply imaged radio source", ["quad","time-delay","radio","classic"], [
    ads('"B1608+656" discovery radio lens', "B1608+656 discovery", "first"),
    ads('"B1608+656" time delay H0 lens model', "B1608+656 time-delay cosmography", "modelling")
  ], panel("b1608-656")),
  qso("he0435-1223", "HE 0435-1223", "4", "z_l ≈ 0.45", "z_s ≈ 1.69", "2002", "04:38:14.9", "-12:17:14", "Quadruply imaged quasar", ["quad","time-delay","H0LiCOW"], [
    ads('"HE 0435-1223" discovery lens', "HE 0435-1223 discovery", "first"),
    ads('"HE 0435-1223" H0LiCOW lens model', "H0LiCOW/TDCOSMO modelling", "modelling"),
    ads('"HE 0435-1223" microlensing follow-up', "Microlensing and follow-up", "followup")
  ], panel("he0435-1223")),
  qso("rxj1131-1231", "RXJ1131-1231", "4", "z_l ≈ 0.30", "z_s ≈ 0.65", "2003", "11:31:51.6", "-12:31:58", "Quadruply imaged quasar", ["quad","time-delay","H0LiCOW"], [
    ads('"RXJ1131-1231" discovery lens', "RXJ1131-1231 discovery", "first"),
    ads('"RXJ1131-1231" lens model H0LiCOW', "Lens modelling and H0", "modelling")
  ], panel("rxj1131-1231")),
  qso("wfi2033-4723", "WFI 2033-4723", "4", "z_l ≈ 0.66", "z_s ≈ 1.66", "2004", "20:33:42.1", "-47:23:43", "Quadruply imaged quasar", ["quad","time-delay","H0LiCOW"], [
    ads('"WFI 2033-4723" discovery lens', "WFI 2033-4723 discovery", "first"),
    ads('"WFI2033-4723" H0LiCOW lens model', "H0LiCOW modelling", "modelling")
  ], panel("wfi2033-4723")),
  qso("des-j0408-5354", "DES J0408-5354", "4", "z_l ≈ 0.60", "z_s ≈ 2.38", "2017", "04:08:21.8", "-53:54:35", "Quadruply imaged quasar", ["quad","time-delay","STRIDES"], [
    ads('"DES J0408-5354" STRIDES discovery', "STRIDES/DES discovery", "first"),
    ads('"DES J0408-5354" time delay mass model', "Time-delay and mass modelling", "modelling")
  ], panel("des-j0408-5354")),
  qso("wgd2038-4008", "WGD 2038-4008", "4", "z_l ≈ 0.23", "z_s ≈ 0.78", "2018", "20:38:24.9", "-40:08:13", "Quadruply imaged quasar", ["quad","time-delay","STRIDES"], [
    ads('"WGD 2038-4008" discovery', "WGD/STRIDES discovery", "first"),
    ads('"WGD 2038-4008" lens environment model', "Environment and modelling", "modelling")
  ], panel("wgd2038-4008")),
  qso("sdss-j1206-4332", "SDSS J1206+4332", "2", "z_l ≈ 0.75", "z_s ≈ 1.79", "2006", "12:06:29.7", "+43:32:17", "Doubly imaged quasar", ["double","time-delay"], [
    ads('"SDSS J1206+4332" lensed quasar discovery', "SDSS J1206+4332 discovery", "first"),
    ads('"SDSS J1206+4332" time delay lens model', "Time-delay and lens modelling", "modelling")
  ], panel("sdss-j1206-4332")),
  qso("sdss-j1004-4112", "SDSS J1004+4112", "5", "z_l ≈ 0.68", "z_s ≈ 1.73", "2003", "10:04:34.9", "+41:12:42", "Cluster-scale lensed quasar", ["quad","time-delay","cluster","classic"], [
    ads('"SDSS J1004+4112" discovery cluster lens quasar', "Cluster-lens discovery", "first"),
    ads('"SDSS J1004+4112" lens model time delays', "Cluster lens modelling", "modelling")
  ]),
  qso("sdss-j0924-0219", "SDSS J0924+0219", "4", "z_l ≈ 0.39", "z_s ≈ 1.52", "2003", "09:24:55.8", "+02:19:24", "Quadruply imaged quasar", ["quad","classic"], [
    ads('"SDSS J0924+0219" gravitational lens discovery', "SDSS discovery", "first"),
    ads('"SDSS J0924+0219" flux anomaly microlensing', "Flux-anomaly follow-up", "followup")
  ]),
  qso("sdss-j1029-2623", "SDSS J1029+2623", "3", "z_l ≈ 0.58", "z_s ≈ 2.20", "2006", "10:29:13.9", "+26:23:17", "Cluster-scale lensed quasar", ["cluster","time-delay"], [
    ads('"SDSS J1029+2623" lensed quasar discovery', "Wide-separation discovery", "first"),
    ads('"SDSS J1029+2623" cluster lens model', "Cluster modelling", "modelling")
  ]),
  qso("sdss-j2222-2745", "SDSS J2222+2745", "6", "z_l ≈ 0.49", "z_s ≈ 2.80", "2012", "22:22:08.6", "+27:45:35", "Cluster-scale lensed quasar", ["cluster","time-delay"], [
    ads('"SDSS J2222+2745" lensed quasar discovery', "Cluster lens discovery", "first"),
    ads('"SDSS J2222+2745" time delays lens model', "Time-delay cluster modelling", "modelling")
  ]),
  qso("ps-j0147-4630", "PS J0147-4630", "4", "z_l ≈ 0.57", "z_s ≈ 2.38", "2017", "01:47:20.0", "-46:30:00", "Quadruply imaged quasar", ["quad","GraL"], [
    ads('"PS J0147-4630" gravitational lens', "Pan-STARRS/Gaia discovery", "first"),
    ads('"PS J0147-4630" lens model', "Lens modelling", "modelling")
  ]),
  qso("graL-j0248-1845", "GraL J0248-1845", "4", "z_l ≈ 0.40", "z_s ≈ 2.24", "2018", "02:48:48.7", "-18:45:10", "Quadruply imaged quasar", ["quad","GraL"], [
    ads('"GraL J0248-1845" lensed quasar', "Gaia GraL discovery", "first"),
    ads('"GraL J0248-1845" lens model', "Modelling/follow-up", "modelling")
  ]),
  qso("graL-j0607-2152", "GraL J0607-2152", "4", "z_l ≈ 0.66", "z_s ≈ 3.13", "2019", "06:07:10.8", "-21:52:17", "Quadruply imaged quasar", ["quad","GraL"], [
    ads('"GraL J0607-2152" lensed quasar', "Gaia GraL discovery", "first"),
    ads('"GraL J0607-2152" follow-up', "Follow-up observations", "followup")
  ]),
  qso("graL-j0818-2613", "GraL J0818-2613", "4", "z_l ≈ 0.87", "z_s ≈ 2.16", "2019", "08:18:28.3", "-26:13:25", "Quadruply imaged quasar", ["quad","GraL"], [
    ads('"GraL J0818-2613" lensed quasar', "Gaia GraL discovery", "first"),
    ads('"GraL J0818-2613" lens model', "Modelling/follow-up", "modelling")
  ]),
  qso("graL-j1651-0417", "GraL J1651-0417", "4", "z_l ≈ 0.44", "z_s ≈ 3.69", "2019", "16:51:05.9", "-04:17:24", "Quadruply imaged quasar", ["quad","GraL"], [
    ads('"GraL J1651-0417" lensed quasar', "Gaia GraL discovery", "first"),
    ads('"GraL J1651-0417" follow-up', "Follow-up observations", "followup")
  ]),
  qso("w2m-j1042-1251", "W2M J1042+1251", "4", "z_l ≈ 0.60", "z_s ≈ 2.52", "2012", "10:42:22.0", "+12:51:22", "Quadruply imaged quasar", ["quad"], [
    ads('"W2M J1042+1251" lensed quasar discovery', "Discovery paper", "first"),
    ads('"W2M J1042+1251" lens model', "Lens modelling", "modelling")
  ]),
  qso("hs0810-2554", "HS 0810+2554", "4", "z_l ≈ 0.89", "z_s ≈ 1.51", "2002", "08:12:37.0", "+25:45:18", "Quadruply imaged quasar", ["quad"], [
    ads('"HS 0810+2554" gravitational lens discovery', "Discovery paper", "first"),
    ads('"HS 0810+2554" microlensing', "Microlensing follow-up", "followup")
  ]),
  qso("h1413-117", "H1413+117 / Cloverleaf", "4", "z_l ≈ 1.88", "z_s ≈ 2.56", "1988", "14:15:46.2", "+11:29:44", "Quadruply imaged quasar", ["quad","classic"], [
    ads('"H1413+117" Cloverleaf gravitational lens discovery', "Cloverleaf discovery", "first"),
    ads('"H1413+117" lens model molecular gas', "Modelling and follow-up", "modelling")
  ]),
  qso("apm08279-5255", "APM 08279+5255", "3", "z_l ≈ 1.06", "z_s ≈ 3.91", "1998", "08:31:41.6", "+52:45:17", "Lensed quasar", ["classic"], [
    ads('"APM 08279+5255" gravitationally lensed quasar discovery', "Discovery paper", "first"),
    ads('"APM 08279+5255" lens model', "Lens model and follow-up", "modelling")
  ]),
  qso("mg0414-0534", "MG 0414+0534", "4", "z_l ≈ 0.96", "z_s ≈ 2.64", "1990", "04:14:37.7", "+05:34:43", "Quadruply imaged radio quasar", ["quad","radio","classic"], [
    ads('"MG 0414+0534" gravitational lens discovery', "Discovery paper", "first"),
    ads('"MG 0414+0534" substructure lens model', "Substructure modelling", "modelling")
  ]),
  qso("b1422-231", "B1422+231", "4", "z_l ≈ 0.34", "z_s ≈ 3.62", "1992", "14:24:38.1", "+22:56:00", "Quadruply imaged radio quasar", ["quad","radio","classic"], [
    ads('"B1422+231" gravitational lens discovery', "Discovery paper", "first"),
    ads('"B1422+231" flux ratio anomaly lens model', "Flux-anomaly modelling", "modelling")
  ]),
  qso("wfi2026-4536", "WFI 2026-4536", "4", "z_l ≈ 1.04", "z_s ≈ 2.23", "2002", "20:26:10.4", "-45:36:27", "Quadruply imaged quasar", ["quad"], [
    ads('"WFI 2026-4536" lensed quasar discovery', "Discovery paper", "first"),
    ads('"WFI 2026-4536" lens modelling', "Lens modelling", "modelling")
  ]),

  sn("sn-refsdal", "SN Refsdal", "Core-collapse supernova", "multiple", "z_l ≈ 0.54", "z_s ≈ 1.49", "2014", "11:49:35.7", "+22:23:55", "Cluster-scale", ["cluster","HST","time-delay"], [
    arxiv("1411.6009", "Kelly et al. 2015, multiply imaged SN Refsdal", "first"),
    arxiv("1411.6443", "Oguri 2015, predicted properties", "modelling"),
    ads('"SN Refsdal" time delay lens model', "SN Refsdal follow-up and time delays", "followup")
  ], "sn-refsdal"),
  sn("iptf16geu", "iPTF16geu / SN 2016geu", "Type Ia supernova", "4", "z_l ≈ 0.216", "z_s ≈ 0.409", "2016", "21:16:27.4", "+40:55:03", "Galaxy-scale", ["galaxy","quad"], [
    arxiv("1611.00014", "Goobar et al. 2017, iPTF16geu discovery", "first"),
    ads('"iPTF16geu" lens model microlensing', "Lens modelling and microlensing", "modelling"),
    ads('"SN 2016geu" HST Keck follow-up', "Resolved follow-up", "followup")
  ], "iptf16geu"),
  sn("sn-zwicky", "SN Zwicky / SN 2022qmx", "Type Ia supernova", "4", "z_l ≈ 0.23", "z_s ≈ 0.35", "2022", "17:14:48.5", "+34:49:23", "Galaxy-scale", ["galaxy","quad","HST"], [
    arxiv("2211.03772", "LensWatch HST observations", "followup"),
    ads('"SN Zwicky" "SN 2022qmx" discovery', "SN Zwicky discovery", "first"),
    ads('"SN Zwicky" lens model', "Lens modelling", "modelling")
  ], "sn-zwicky"),
  sn("sn-h0pe", "SN H0pe", "Type Ia supernova", "3", "z_l ≈ 0.35", "z_s ≈ 1.78", "2024", "11:27:13.3", "+42:28:24", "Cluster-scale", ["cluster","JWST","triple","time-delay"], [
    ads('"SN H0pe" lensed supernova JWST', "SN H0pe first reports", "first"),
    ads('"SN H0pe" lens model H0', "Time-delay and H0 modelling", "modelling"),
    ads('"SN H0pe" JWST follow-up', "JWST follow-up", "followup")
  ], "sn-h0pe"),
  sn("at2016jka", "AT 2016jka / SN Requiem", "Core-collapse supernova", "3+ predicted", "z_l ≈ 0.54", "z_s ≈ 1.95", "2016", "03:32:38.6", "-27:46:59", "Cluster-scale", ["cluster","HST","time-delay"], [
    ads('"SN Requiem" AT 2016jka lensed supernova', "SN Requiem report", "first"),
    ads('"AT 2016jka" lens model return image', "Return-image prediction", "modelling")
  ], "sn-refsdal"),
  sn("ps1-10afx", "PS1-10afx", "Type Ia supernova", "unresolved magnified", "z_l ≈ 1.12", "z_s ≈ 1.39", "2010", "22:11:24.6", "+00:09:44", "Galaxy-scale", ["galaxy"], [
    ads('"PS1-10afx" gravitationally lensed supernova', "Lens interpretation", "first"),
    ads('"PS1-10afx" lens galaxy spectroscopy', "Lens confirmation follow-up", "followup")
  ], "sn-zwicky", "Candidate/high-confidence"),
  sn("at2022riv", "AT 2022riv", "Lensed supernova candidate", "candidate", "z_l ≈ 0.49", "z_s ≈ 1.78", "2022", "00:14:21.2", "-30:23:50", "Cluster-scale", ["cluster","JWST","candidate"], [
    ads('"AT 2022riv" lensed supernova candidate', "Candidate report", "candidate"),
    ads('"AT 2022riv" lens model', "Lens model discussion", "modelling")
  ], "sn-h0pe", "Candidate/high-confidence"),
  sn("at2023adsy", "AT 2023adsy", "Lensed supernova candidate", "candidate", "z_l ≈ 0.39", "z_s ≈ 2.90", "2023", "03:32:38.0", "-27:47:00", "Cluster-scale", ["cluster","JWST","candidate"], [
    ads('"AT 2023adsy" lensed supernova', "Candidate report", "candidate"),
    ads('"AT 2023adsy" JWST lens model', "JWST follow-up/modelling", "followup")
  ], "sn-h0pe", "Candidate/high-confidence")
];
