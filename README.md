# Sumtez

Sumtez 的公开个人网站，包含首页、作品介绍、AI 工具箱与使用指南。

## 当前版本 · 2026-11-05

首页保留浅色背景、黑色项目标题与扫描线签名动效，6 个项目采用等宽双栏、统一字号和间距，手机上显示为单列。六个项目介绍页沿用同一套浅灰底、黑色排印、导航和细线布局，项目名称与首页保持一致。

- `index.html`、`home.css`、`home-motion.js`：首页、项目目录与签名动效。
- `project-detail.css`：六个项目介绍页的统一样式。生成器按项目目录加载此样式。
- `site-polish.css`：全站共享的颜色、导航、字号层级、控件和响应式细节，同时统一工具箱与实践笔记的视觉。默认正文 18px、导航与操作 16px、辅助文字 15px；使用 rem 跟随读者的字体偏好。所有实际内容页面最后加载此层，工具箱与指南不再叠加旧的 `future*.css`。
- `work.html`：兼容旧作品目录地址，跳转到首页并保留查询参数与锚点。
- 产品介绍、工具筛选收藏和指南保持独立入口。

修改后运行以下命令，生成静态页面并检查本地链接及项目目录，无需安装依赖：

```sh
node scripts/build-product-pages.mjs
node scripts/check-site.mjs
```

工具箱筛选支持 URL 保存与分享（关键词、分类、排序、免费、中文、收藏筛选）；收藏 ID 仍只保存在浏览器。指南步骤在多个标签页与返回首页时同步，填写的提示词素材仍只存在当前页面。

全站细节打磨覆盖静态链接、文档结构、项目数量，320px/390px 手机与 768px 平板布局，以及筛选、收藏、原生弹窗、提示词填写和跨标签页进度。参考来源、取舍和具体边界见 [全站细节打磨记录](docs/research/2026-11-05-site-polish.md)。随后针对全站小字重新设计了字体层级，并检查根字号 200% 与文字间距偏好下的排版，见 [字体可读性研究与验证](docs/research/2026-11-05-typography.md)。下方历史改版记录仅供参考。

## 线上发布与 GitHub 副本

正式站点 [sumtez.com](https://sumtez.com) 由现有 Sites 项目托管；本仓库是公开的静态源码副本。发布时将确认后的页面及资源同步到 Sites 源码的 `dist/`，运行生成器与检查，再通过 Sites 保存版本并部署。仅推送本仓库不代表正式域名已经更新。

本目录也可用于 GitHub Pages：在仓库的 Pages 设置中选择从 `codex/production` 分支的 `/ (root)` 发布。`.nojekyll` 用于按原样提供静态文件，无需安装依赖。

页面、脚本、样式和图片使用相对路径，可用于默认项目地址 `/sumtez-public/`，也可部署在自定义域名根目录。规范链接与站点地图使用正式域名 `sumtez.com`；默认 Pages 地址可用于预览与验证。

保留 `tools.html`、`ainovel.html`、`guide.html` 入口。`tools/`、`ainovel/`、`guide/` 中的兼容页会跳转到对应 HTML 页面，并保留查询参数和锚点；禁用 JavaScript 时提供手动打开链接。


## 我的产品

| 展示名称 | 项目仓库 | 介绍页面 |
| --- | --- | --- |
| elselife · 人生复本 | [ainovel](https://github.com/TeezyTez/ainovel) | [产品介绍](ainovel.html) |
| MPCI 申报问答助手 | [DeclarationAssit](https://github.com/TeezyTez/DeclarationAssit) | [产品介绍](declaration.html) |
| 提单识别与 EDI 工作台 | [BL_RECO](https://github.com/TeezyTez/BL_RECO) | [产品介绍](bl-reco.html) |
| 企业字段映射助手 | [EDI-Agent](https://github.com/TeezyTez/EDI-Agent) | [产品介绍](edi-agent.html) |
| 智能体任务工作台 | [Cloud-Agent-Platform](https://github.com/TeezyTez/Cloud-Agent-Platform) | [产品介绍](cloud-agent.html) |
| 规约驱动代码生成 | [codegen-verify](https://github.com/TeezyTez/codegen-verify) | [产品介绍](codegen-verify.html) |

`content.js` 管理公开产品文案。修改后运行 `node scripts/build-product-pages.mjs`，同步生成 5 个产品介绍页与 `index.html` 静态作品卡片，并自动更新 CSS/JS 的内容版本；ainovel 介绍页单独维护。运行生成器后提交生成的 HTML 文件，无需安装依赖。

资料于 2026-10-18 按 README 与关键代码核对；每项保留原型/MVP/研究阶段标签，提供源码入口。这里是产品展示网站，没有部署各产品后端，也未复制客户样本或环境配置。

## 2026-10-23 创作工作室改版

暖纸色、墨绿、朱红与中文衬线标题组成统一视觉系统。首页使用原创轨道动效与项目流程示意，展示6个真实项目、覆盖六类任务的6款精选工具和3篇实践笔记。保留完整32款工具目录、筛选收藏、提示词与进度功能。

动效可暂停，并响应减少动态偏好与页面可见性；作品在禁用 JavaScript 时仍可阅读。修改后执行 `node scripts/build-product-pages.mjs` 和 `node scripts/check-site.mjs`。

参考网站、框架取舍、官方 skills 和可复用设计提示词见 [设计研究](docs/research/2026-10-23-design-research.md)，实际检查范围见 [验证记录](docs/research/2026-10-23-verification.md)。


## 最新视觉修订 · 2026-10-23

首页改为冷灰色、错位排版的简洁开场和六个真实项目序列；移除被否决的 3D 主视觉。工具和指南保持原有功能。最终设计和验证记录在 docs/research/2026-10-23-final-direction.md 与 docs/research/2026-10-23-final-verification.md。此工作副本已与 Sites 生产资产同步，GitHub 远端是否更新以实际 push 记录为准。
