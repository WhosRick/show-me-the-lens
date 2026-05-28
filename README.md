# Show Me the Lens

**中文副标题：引力透镜类星体与引力透镜超新星数据汇总**  
**English subtitle: Data Catalogue of Gravitationally Lensed Quasars and Supernovae**

这是一个可以直接部署到 GitHub Pages 的中英双语静态网站原型，用于汇总 lensed QSOs 与 lensed SNe 的缩略图、基本参数、数据下载入口、ADS/arXiv 链接和图片引用说明。

This is a bilingual static website prototype for collecting thumbnails, basic parameters, data-access links, ADS/arXiv literature links, and image-credit notes for gravitationally lensed quasars and gravitationally lensed supernovae.

## 文件结构 / File structure

```text
show-me-the-lens/
  ├── index.html
  ├── assets/
  │   ├── css/styles.css
  │   ├── js/app.js
  │   ├── js/data.js
  │   └── img/thumbs/*.svg
  └── data/
      ├── systems.json
      └── systems_seed.csv
```

## 本地预览 / Local preview

```bash
python -m http.server 8000
```

然后打开 / open:

```text
http://localhost:8000
```

## 部署到 GitHub Pages / Deploy to GitHub Pages

1. 在 GitHub 新建仓库，建议名称：`show-me-the-lens`。
2. 把本目录中的所有文件上传到仓库根目录。
3. 进入 `Settings → Pages`。
4. Source 选择 `Deploy from a branch`。
5. Branch 选择 `main / root`。
6. 保存后等待部署完成，通常网址为：

```text
https://你的GitHub用户名.github.io/show-me-the-lens/
```

## 新增系统 / Add a new system

编辑 `assets/js/data.js` 中的 `window.LENS_SYSTEMS` 数组。建议同时填写英文和中文字段：

```js
{
  id: "new-system-id",
  name: "New Lens Name",
  category: "Lensed QSO",
  category_zh: "引力透镜类星体",
  subtype: "Quadruply imaged quasar",
  subtype_zh: "四重成像类星体",
  scale: "Galaxy-scale",
  scale_zh: "星系尺度",
  status: "Confirmed",
  status_zh: "已确认",
  images: "4",
  lens_redshift: "z_l = ...",
  source_redshift: "z_s = ...",
  discovery_year: "...",
  coordinates: "...",
  summary: "English summary...",
  summary_zh: "中文简介...",
  tags: ["QSO", "quad", "time-delay"],
  tags_zh: ["类星体", "四重像", "时间延迟"],
  thumbnail: "assets/img/thumbs/new-system-id.svg",
  data_links: [
    { label: "MAST Portal", url: "https://mast.stsci.edu/portal/Mashup/Clients/Mast/Portal.html", note: "archive search" }
  ],
  paper_links: [
    { label: "ADS search", url: "https://ui.adsabs.harvard.edu/", note: "literature search" }
  ],
  image_credit: "...",
  image_credit_zh: "..."
}
```

## 发布前核查清单 / Pre-release checklist

- 红移值是否来自原论文或官方数据库。
- 像数、分类、发现年份是否已核对。
- 数据下载链接是否可打开。
- 论文链接是否指向 ADS/arXiv/期刊页面。
- 缩略图是否有明确版权或 credit。
- 若列出时延、D_delta t 或 H0 数值，必须逐条核查最新论文版本。
